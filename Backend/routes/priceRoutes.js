const express = require("express");
const { getPricesForMedicine } = require("../controllers/priceController");
const { validatePriceMedicineId } = require("../middleware/validate");

const router = express.Router();

router.get("/:medicineId", validatePriceMedicineId, getPricesForMedicine);

module.exports = router;

