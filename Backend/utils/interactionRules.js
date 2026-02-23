/**
 * Very simple rule-based interaction engine.
 * You can expand this later with a real knowledge base.
 */

const normalize = (name) => name.trim().toLowerCase();

/**
 * Evaluate interaction risk for a list of medicine names.
 * @param {string[]} medicines
 * @returns {{riskLevel: string, message: string, recommendation: string, pairs: string[]}}
 */
function evaluateInteractions(medicines) {
  const normalized = medicines.map(normalize);
  const pairs = [];

  // Example high‑risk rule: Ibuprofen + Warfarin
  const hasIbuprofen = normalized.includes("ibuprofen");
  const hasWarfarin = normalized.includes("warfarin");

  if (hasIbuprofen && hasWarfarin) {
    pairs.push("Ibuprofen + Warfarin");
    return {
      riskLevel: "High",
      message:
        "Combining NSAIDs like Ibuprofen with anticoagulants such as Warfarin increases the risk of serious gastrointestinal bleeding.",
      recommendation: "Consult a doctor or pharmacist before using this combination.",
      pairs,
    };
  }

  // Example moderate rule: NSAID + antihypertensive (very simplified example)
  const hasParacetamol = normalized.includes("paracetamol");
  const hasAntihypertensive = normalized.includes("amlodipine");
  if (hasParacetamol && hasAntihypertensive) {
    pairs.push("Paracetamol + Amlodipine");
    return {
      riskLevel: "Moderate",
      message:
        "This combination is usually safe, but patients with liver or blood‑pressure issues should be monitored.",
      recommendation:
        "Use with caution and follow the dosage recommended by your healthcare provider.",
      pairs,
    };
  }

  // Default safe
  return {
    riskLevel: "Low",
    message: "No major interactions detected based on current rule set.",
    recommendation:
      "This does not replace professional medical advice. Always consult a healthcare professional if in doubt.",
    pairs,
  };
}

module.exports = {
  evaluateInteractions,
};

