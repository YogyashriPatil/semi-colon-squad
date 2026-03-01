import Estimation from "../models/Estimation.js";
import Rate from "../models/Rate.js";
import Drawing from "../models/Drawing.js";
import axios from "axios";
import {
  getSteelRate,
  getFuelPrice,
  getTransportFactor
} from "../services/pricingService.js";


// 🔹 Avg Rates
const avgRates = {
  concrete: 5000,
  masonry: 250,
  flooring: 100,
  plumbing: 5500,
  electrical: 3500,
  paint: 30,
  fixture: 1800,
  labour: 800,
  steel: 75
};

// 🔹 Avg Quantities (fallback if analysis missing)
const avgQty = {
  concrete: 120,
  steel: 3500,
  masonry: 900,
  flooring: 1200,
  plumbingPoints: 10,
  electricalPoints: 12,
  paintArea: 2000,
  fixtures: 8,
  labour: 960
};


export const generateEstimation = async (req, res) => {

  try {

    const { drawingId } = req.params;

    const drawing = await Drawing.findById(drawingId);

    let analysis = drawing?.analysisResult
      ? (typeof drawing.analysisResult === "string"
          ? JSON.parse(drawing.analysisResult)
          : drawing.analysisResult)
      : {};

    // 🔹 Safe Quantity Generator
    const quantities = {
      concrete: analysis.concrete || avgQty.concrete,
      steel: analysis.steel || avgQty.steel,
      masonry: analysis.wallLength
        ? analysis.wallLength * 10 * 0.75
        : avgQty.masonry,
      flooring: analysis.floorArea || avgQty.flooring,
      plumbingPoints: analysis.bathrooms
        ? analysis.bathrooms * 5
        : avgQty.plumbingPoints,
      electricalPoints: analysis.rooms
        ? analysis.rooms * 4
        : avgQty.electricalPoints,
      paintArea: analysis.wallLength
        ? analysis.wallLength * 2.5
        : avgQty.paintArea,
      fixtures:
        (analysis.doors || 0) + (analysis.windows || 0)
        || avgQty.fixtures,
      labour:
        analysis.floorArea
        ? analysis.floorArea * 0.8
        : avgQty.labour
    };


    // 🔹 Live Market Data
    const steelRate = await getSteelRate() || avgRates.steel;
    const fuelPrice = await getFuelPrice() || 100;
    const transportFactor = getTransportFactor(fuelPrice) || 1;


    // 🔹 AI Multipliers
    let multipliers = {
      budget: {},
      standard: {},
      premium: {}
    };

    try {
      const qualityRes = await axios.post("http://localhost:8000/quality", {
        floorArea: analysis.floorArea,
        layoutType: analysis.layoutType,
        structureComplexity: analysis.structureComplexity
      });

      multipliers = qualityRes.data || multipliers;
    } catch {}


    // 🔹 DB Rates
    const rates = await Rate.find();
    const rateMap = {};

    rates.forEach(r => {
      const key = r.material?.trim().toLowerCase();
      if (!key) return;

      const dbRate = Number(r.rate);
      rateMap[key] =
        dbRate && dbRate > 0
          ? dbRate
          : avgRates[key];
    });

    const getRate = (key) =>
      rateMap[key] || avgRates[key];


    // 🔹 Base Costs
    const baseCosts = {

      structure:
        quantities.concrete * getRate("concrete") +
        quantities.steel * steelRate,

      masonry:
        quantities.masonry * getRate("masonry") * transportFactor,

      flooring:
        quantities.flooring * getRate("flooring") * transportFactor,

      plumbing:
        quantities.plumbingPoints * getRate("plumbing"),

      electrical:
        quantities.electricalPoints * getRate("electrical"),

      finishing:
        quantities.paintArea * getRate("paint"),

      fixtures:
        quantities.fixtures * getRate("fixture"),

      labour:
        quantities.labour * getRate("labour")
    };


    // 🔹 Apply AI Multipliers
    const estimate = {};

    ["budget", "standard", "premium"].forEach(level => {

      estimate[level] = {};

      Object.keys(baseCosts).forEach(cat => {

        const base = baseCosts[cat] || 0;
        const factor = multipliers[level]?.[cat] || 1;

        estimate[level][cat] = {
          low: base * factor * 0.9,
          high: base * factor * 1.1
        };

      });

    });


    const estimation = await Estimation.create({
      drawingId,
      estimate
    });

    res.json(estimation);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};