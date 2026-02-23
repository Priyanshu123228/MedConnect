const { evaluateInteractions } = require("../utils/interactionRules");
const { success } = require("../utils/response");

// POST /api/interactions
// Body: { medicines: ["Ibuprofen", "Warfarin"] }
const checkInteractions = async (req, res, next) => {
  try {
    const { medicines } = req.body;
    const result = evaluateInteractions(medicines);
    success(res, result, "Interaction check complete");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkInteractions,
};
