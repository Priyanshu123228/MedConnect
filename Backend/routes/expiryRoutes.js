const express = require("express");
const { getExpiryDeals, reserveDeal } = require("../controllers/expiryController");
const { validateExpiryQuery, validateExpiryDealId } = require("../middleware/validate");

const router = express.Router();

router.get("/", validateExpiryQuery, getExpiryDeals);
router.post("/:id/reserve", validateExpiryDealId, reserveDeal);

module.exports = router;

