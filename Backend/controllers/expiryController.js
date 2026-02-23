const ExpiryDeal = require("../models/ExpiryDeal");
const { success, notFound } = require("../utils/response");

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function computeDaysRemaining(expiryDate, now = new Date()) {
  return Math.ceil((expiryDate.getTime() - now.getTime()) / MS_PER_DAY);
}

// GET   /api/expiry-deals?maxDays=90
const getExpiryDeals = async (req, res, next) => {
  try {
    const { maxDays } = req.query;
    const now = new Date();

    const filter = { expiryDate: { $gte: now } };
    if (maxDays) {
      const maxDate = new Date(now.getTime() + Number(maxDays) * MS_PER_DAY);
      filter.expiryDate.$lte = maxDate;
    }

    const deals = await ExpiryDeal.find(filter)
      .populate("medicineId", "name salt type manufacturer")
      .populate("pharmacyId", "name location")
      .sort({ discountPercent: -1 });

    const data = deals.map((deal) => ({
      id: deal._id,
      medicine: deal.medicineId,
      pharmacy: deal.pharmacyId,
      originalPrice: deal.originalPrice,
      discountedPrice: deal.discountedPrice,
      discountPercent: deal.discountPercent,
      expiryDate: deal.expiryDate,
      daysRemaining: computeDaysRemaining(deal.expiryDate, now),
      reserved: Boolean(deal.reserved),
    }));

    success(res, data, "Expiry deals retrieved");
  } catch (error) {
    next(error);
  }
};

// POST    /api/expiry-deals/:id/reserve
const reserveDeal = async (req, res, next) => {
  try {
    const deal = await ExpiryDeal.findById(req.params.id);
    if (!deal) {
      return notFound(res, next, "Deal not found");
    }
    if (deal.reserved) {
      res.status(409);
      return next(new Error("This deal is already reserved"));
    }
    deal.reserved = true;
    await deal.save();
    success(res, { id: deal._id, reserved: true }, "Deal reserved successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExpiryDeals,
  reserveDeal,
};
