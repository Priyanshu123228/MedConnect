const Price = require("../models/Price");
const Medicine = require("../models/Medicine");
const { success, notFound } = require("../utils/response");

// GET /api/prices/:medicineId
const getPricesForMedicine = async (req, res, next) => {
  try {
    const { medicineId } = req.params;

    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return notFound(res, next, "Medicine not found");
    }

    const prices = await Price.find({ medicineId })
      .populate("pharmacyId", "name location")
      .sort({ price: 1 });

    let data = {
      medicine,
      prices: prices.map((p) => ({
        id: p._id,
        price: p.price,
        pharmacy: p.pharmacyId,
      })),
      savings: null,
    };

    if (prices.length > 0) {
      const lowest = prices[0].price;
      const highest = prices[prices.length - 1].price;
      const savingsAbsolute = highest - lowest;
      const savingsPercent =
        highest > 0 ? (savingsAbsolute / highest) * 100 : 0;
      data.savings = {
        lowestPrice: lowest,
        highestPrice: highest,
        savingsAbsolute,
        savingsPercent: Number(savingsPercent.toFixed(2)),
      };
    }

    success(res, data, "Prices retrieved");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPricesForMedicine,
};
