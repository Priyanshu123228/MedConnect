/**
 * View modules – one per route. Each exports render* and attach* (handlers).
 */

export { renderHomePage, attachHomeHandlers } from "./home.js";
export { renderExpiryDealsPage, attachExpiryHandlers } from "./expiry.js";
export { renderInteractionCheckerPage, attachInteractionHandlers } from "./interaction.js";
export { renderSearchResultsPage, attachSearchHandlers } from "./search.js";
export { renderGenericAlternativesPage, attachGenericHandlers } from "./alternatives.js";
export { renderEmergencySOSPage } from "./sos.js";
