const Medicine = require("../models/Medicine");
const { success, notFound } = require("../utils/response");

// GET /api/medicines?name=&page=1&limit=10
const getMedicines = async (req, res, next) => {
  try {
    const { name, page = 1, limit = 10 } = req.query;
    const query = {};

    if (name && String(name).trim()) {
      query.name = { $regex: String(name).trim(), $options: "i" };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [medicines, total] = await Promise.all([
      Medicine.find(query).sort({ name: 1 }).skip(skip).limit(limitNum),
      Medicine.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limitNum);
    const data = {
      items: medicines,
      total,
      page: pageNum,
      totalPages,
    };

    success(res, data, "Medicines retrieved");
  } catch (error) {
    next(error);
  }
};

// GET /api/medicines/:id
const getMedicineById = async (req, res, next) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return notFound(res, next, "Medicine not found");
    }
    success(res, medicine, "Medicine retrieved");
  } catch (error) {
    next(error);
  }
};

// GET /api/medicines/:id/generic
const getGenericAlternative = async (req, res, next) => {
  try {
    const baseMedicine = await Medicine.findById(req.params.id);
    if (!baseMedicine) {
      return notFound(res, next, "Base medicine not found");
    }

    const generic = await Medicine.findOne({
      _id: { $ne: baseMedicine._id },
      salt: baseMedicine.salt,
      type: "Generic",
    });

    const data = generic
      ? { exists: true, baseMedicine, generic }
      : {
          exists: false,
          message: "No generic alternative found for this medicine",
        };

    success(res, data, generic ? "Generic alternative found" : data.message);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMedicines,
  getMedicineById,
  getGenericAlternative,
};
