import axios from "axios";

// 🟢 LIVE STEEL RATE
export const getSteelRate = async () => {
  try {
    const res = await axios.get("https://api.steelpriceapi.com/latest");
    return res.data.price || 75;
  } catch {
    return 75; // fallback if API fails
  }
};

// 🟢 FUEL PRICE (affects transport)
export const getFuelPrice = async () => {
  try {
    const res = await axios.get("https://api.collectapi.com/gasPrice/india");
    return res.data.result[0].price || 100;
  } catch {
    return 100;
  }
};

// 🟢 TRANSPORT FACTOR
export const getTransportFactor = (fuelPrice) => {
  if (fuelPrice > 110) return 1.1;
  if (fuelPrice > 100) return 1.05;
  return 1.0;
};