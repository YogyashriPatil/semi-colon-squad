import Rate from "../models/Rate.js";

export const updateRate = async (req, res) => {
  const { material, rate } = req.body;

  const updated = await Rate.findOneAndUpdate(
    { material },
    { rate },
    { new: true }
  );

  res.json(updated);
};