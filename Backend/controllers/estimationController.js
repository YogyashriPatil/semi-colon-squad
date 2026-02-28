import Estimation from "../models/Estimation.js";
import Rate from "../models/Rate.js";
import Drawing from "../models/Drawing.js";
import axios from "axios";
import {
  getSteelRate,
  getFuelPrice,
  getTransportFactor
} from "../services/pricingService.js";
const generateQuantities = (analysis) => {

  const wallHeight = 10;      // ft
  const wallThickness = 0.75; // ft

  const masonryVolume =
    (analysis.wallLength || 0) *
    wallHeight *
    wallThickness;

  const paintArea =
    (analysis.wallLength || 0) * 2.5;

  return {

    // structure
    concrete: analysis.concrete || 0,
    steel: analysis.steel || 0,

    // masonry
    masonry: masonryVolume,

    // flooring
    flooring: analysis.floorArea || 0,

    // plumbing
    plumbingPoints: (analysis.bathrooms || 1) * 5,

    // electrical
    electricalPoints: (analysis.rooms || 1) * 4,

    // finishing
    paintArea,

    // fixtures
    fixtures:
      (analysis.doors || 0) +
      (analysis.windows || 0),

    // labour
    labour: (analysis.floorArea || 0) * 0.8
  };
};

export const generateEstimation = async (req, res) => {
  const defaultRates = {
    concrete: 4500,
    masonry: 200,
    flooring: 80,
    plumbing: 5000,
    electrical: 3000,
    paint: 25,
    fixture: 1500,
    labour: 700
  };
  try {
    const { drawingId } = req.params;
    console.log("BODY RECEIVED:", req.body);
    const drawing = await Drawing.findById(drawingId);

    if (!drawing || !drawing.analysisResult)
      return res.status(400).json({ message: "Analysis not ready" });

    const analysis = drawing.analysisResult;
    // 🔥 GET LIVE MARKET DATA
    const steelRate = await getSteelRate();
    const fuelPrice = await getFuelPrice();
    const transportFactor = getTransportFactor(fuelPrice);
    // 🔹 Step 1: Generate quantities
    const quantities = generateQuantities(analysis);

    // 🔹 Step 2: Call AI for quality
    const qualityRes = await axios.post("http://localhost:8000/quality", {
      floorArea: analysis.floorArea,
      layoutType: analysis.layoutType,
      structureComplexity: analysis.structureComplexity
    });

    const multipliers = qualityRes.data;

    // 🔹 Step 3: Get base rates
    const rates = await Rate.find();

    const rateMap = {};
    rates.forEach(r => rateMap[r.material.toLowerCase()] = r.rate);

const baseCosts = {
  structure:
    (quantities.concrete || 0) *
      (rateMap["concrete"] ?? defaultRates.concrete) +
    (quantities.steel || 0) *
      (steelRate || 75),

  masonry:
    (quantities.masonry || 0) *
    (rateMap["masonry"] ?? defaultRates.masonry) *
    transportFactor,

  flooring:
    (quantities.flooring || 0) *
    (rateMap["flooring"] ?? defaultRates.flooring) *
    transportFactor,

  plumbing:
    (quantities.plumbingPoints || 0) *
    (rateMap["plumbing"] ?? defaultRates.plumbing),

  electrical:
    (quantities.electricalPoints || 0) *
    (rateMap["electrical"] ?? defaultRates.electrical),

  finishing:
    (quantities.paintArea || 0) *
    (rateMap["paint"] ?? defaultRates.paint),

  fixtures:
    (quantities.fixtures || 0) *
    (rateMap["fixture"] ?? defaultRates.fixture),

  labour:
    (quantities.labour || 0) *
    (rateMap["labour"] ?? defaultRates.labour)
};    const estimate = {};

    ["budget", "standard", "premium"].forEach(level => {
      estimate[level] = {};

      Object.keys(baseCosts).forEach(cat => {
        const base = baseCosts[cat] ?? 0;
        const factor = multipliers[level]?.[cat]??1;

        estimate[level][cat] = {
          low: base * factor * 0.9,
          high: base * factor * 1.1
        };
      });
    });
    console.log("Rates:", rateMap);
    console.log("Quantities:", quantities);
    console.log("Multipliers:", multipliers);
    const estimation = await Estimation.create({
      drawingId,
      estimate
    });

    res.json(estimation);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};