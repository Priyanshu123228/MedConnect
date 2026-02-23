/**
 * Centralized application state.
 * Single source of truth; no global variables.
 * Structure is React-migration friendly (e.g. useReducer/context).
 */

const state = {
  searchQuery: null,
  medicines: [],
  selectedMedicineId: null,
  priceData: null,
  expiryDeals: [],
  interactionResult: null,
  selectedMedicines: [],
  genericData: null,
};

export function getState() {
  return state;
}

export default state;
