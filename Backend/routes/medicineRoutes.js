const express = require("express");
const {
  getMedicines,
  getMedicineById,
  getGenericAlternative,
} = require("../controllers/medicineController");
const { validateMedicineId } = require("../middleware/validate");

const router = express.Router();

router.get("/", getMedicines);
router.get("/:id", validateMedicineId, getMedicineById);
router.get("/:id/generic", validateMedicineId, getGenericAlternative);

module.exports = router;

