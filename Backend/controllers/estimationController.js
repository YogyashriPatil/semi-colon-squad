import Estimation from "../models/Estimation.js";
import Rate from "../models/Rate.js";
import Drawing from "../models/Drawing.js";
import axios from "axios";
export const generateEstimation = async (req, res) => {
  try {
    const { drawingId } = req.body;

    const drawing = await Drawing.findById(drawingId);

    if (!drawing || !drawing.analysisResult)
      return res.status(400).json({ message: "Analysis not ready" });

    const analysis = drawing.analysisResult;

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
    rates.forEach(r => rateMap[r.material] = r.rate);

    const baseCosts = {
      structure: quantities.concrete * rateMap.concrete +
                 quantities.steel * rateMap.steel,
      masonry: quantities.masonry * rateMap.masonry,
      flooring: quantities.flooring * rateMap.flooring,
      plumbing: quantities.plumbingPoints * rateMap.plumbing,
      electrical: quantities.electricalPoints * rateMap.electrical,
      finishing: quantities.paintArea * rateMap.paint,
      fixtures: quantities.fixtures * rateMap.fixture,
      labour: quantities.labour * rateMap.labour
    };

    const estimate = {};

    ["budget", "standard", "premium"].forEach(level => {
      estimate[level] = {};

      Object.keys(baseCosts).forEach(cat => {
        const base = baseCosts[cat];
        const factor = multipliers[level][cat];

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