const express = require("express");
const { checkInteractions } = require("../controllers/interactionController");
const { validateInteractionBody } = require("../middleware/validate");

const router = express.Router();

router.post("/", validateInteractionBody, checkInteractions);

module.exports = router;

