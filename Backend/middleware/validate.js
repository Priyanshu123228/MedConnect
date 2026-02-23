// Simple validation helpers (no external libraries)

const isValidMongoId = (str) => {
  if (typeof str !== "string" || !str.trim()) return false;
  return /^[a-fA-F0-9]{24}$/.test(str.trim());
};

const validateMedicineId = (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ success: false, message: "Medicine ID is required" });
  }
  if (!isValidMongoId(id)) {
    return res.status(400).json({ success: false, message: "Invalid medicine ID format" });
  }
  next();
};

const validatePriceMedicineId = (req, res, next) => {
  const medicineId = req.params.medicineId;
  if (!medicineId) {
    return res.status(400).json({ success: false, message: "Medicine ID is required" });
  }
  if (!isValidMongoId(medicineId)) {
    return res.status(400).json({ success: false, message: "Invalid medicine ID format" });
  }
  next();
};

const validateInteractionBody = (req, res, next) => {
  const { medicines } = req.body;
  if (!Array.isArray(medicines)) {
    return res.status(400).json({
      success: false,
      message: "Request body must include 'medicines' as an array",
    });
  }
  if (medicines.length < 2) {
    return res.status(400).json({
      success: false,
      message: "Please provide at least two medicine names to check interactions",
    });
  }
  const invalid = medicines.some((m) => typeof m !== "string" || !String(m).trim());
  if (invalid) {
    return res.status(400).json({
      success: false,
      message: "All medicine names must be non-empty strings",
    });
  }
  next();
};

const validateExpiryQuery = (req, res, next) => {
  const { maxDays } = req.query;
  if (maxDays !== undefined && maxDays !== "") {
    const n = Number(maxDays);
    if (Number.isNaN(n) || n < 1 || n > 365) {
      return res.status(400).json({
        success: false,
        message: "maxDays must be a number between 1 and 365",
        data: [],
      });
    }
  }
  next();
};

const validateExpiryDealId = (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Deal ID is required",
      data: [],
    });
  }
  if (!isValidMongoId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid deal ID format",
      data: [],
    });
  }
  next();
};

module.exports = {
  validateMedicineId,
  validatePriceMedicineId,
  validateInteractionBody,
  validateExpiryQuery,
  validateExpiryDealId,
};
