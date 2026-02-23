/**
 * MedConnect API service layer
 * All backend communication lives here. Frontend components use this module only.
 */

const API_BASE =
  typeof window !== "undefined" && window.__MEDCONNECT_API__
    ? window.__MEDCONNECT_API__
    : "https://medconnect-backend-1pks.onrender.com/api";

/**
 * API error with status code for optional UI handling
 */
class ApiError extends Error {
  constructor(message, statusCode = null) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

/**
 * Centralized request helper: JSON by default, throws on HTTP error or network failure.
 * @param {string} path - API path (e.g. "/medicines")
 * @param {RequestInit} options - fetch options (method, body, headers)
 * @returns {Promise<object>} Parsed JSON body
 * @throws {ApiError}
 */
async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  let res;
  try {
    res = await fetch(url, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });
  } catch (err) {
    const apiErr = new ApiError(err.message || "Network error", null);
    if (typeof window !== "undefined" && /^localhost|127\.0\.0\.1$/.test(window.location?.hostname || "")) {
      console.error("[MedConnect API]", { type: "NETWORK_ERROR", message: apiErr.message, timestamp: new Date().toISOString() });
    }
    throw apiErr;
  }

  const contentType = res.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await res.json().catch(() => ({})) : {};

  if (!res.ok) {
    const msg = data?.message || data?.error || `Request failed: ${res.status}`;
    const apiErr = new ApiError(msg, res.status);
    if (typeof window !== "undefined" && /^localhost|127\.0\.0\.1$/.test(window.location?.hostname || "")) {
      console.error("[MedConnect API]", { type: "HTTP_ERROR", status: res.status, message: msg, path: url.replace(API_BASE, ""), timestamp: new Date().toISOString() });
    }
    throw apiErr;
  }

  return data;
}

// ---------------------------------------------------------------------------
// Public API – structured responses; errors always thrown as ApiError
// ---------------------------------------------------------------------------

/**
 * Search/list medicines with pagination.
 * @param {string} [name] - Search query
 * @param {number} [page=1]
 * @param {number} [limit=10]
 * @returns {Promise<{ success: boolean, total: number, page: number, totalPages: number, data: Array }>}
 */
async function getMedicines(name, page = 1, limit = 10) {
  const params = new URLSearchParams();
  if (name) params.set("name", name);
  params.set("page", String(page));
  params.set("limit", String(limit));
  const qs = params.toString();
  const res = await request(`/medicines${qs ? `?${qs}` : ""}`);
  const d = res?.data;
  if (d && typeof d === "object" && "items" in d) {
    return { success: true, data: d.items ?? [], total: d.total, page: d.page, totalPages: d.totalPages };
  }
  return res;
}

/**
 * Get a single medicine by ID.
 * @param {string} id
 * @returns {Promise<object>}
 */
async function getMedicine(id) {
  const res = await request(`/medicines/${id}`);
  return res?.data ?? res;
}

/**
 * Get price list for a medicine (pharmacies, prices, savings).
 * @param {string} medicineId
 * @returns {Promise<{ medicine?: object, prices: Array, savings?: object }>}
 */
async function getPrices(medicineId) {
  const res = await request(`/prices/${medicineId}`);
  return res?.data ?? res;
}

/**
 * Get expiry deals (near-expiry discounted medicines).
 * @param {number} [maxDays] - Max days until expiry (e.g. 365)
 * @returns {Promise<{ success: true, data: Array }>}
 */
async function getExpiryDeals(maxDays) {
  const path = maxDays ? `/expiry-deals?maxDays=${maxDays}` : "/expiry-deals";
  const res = await request(path);
  const list = Array.isArray(res) ? res : res?.data ?? [];
  return { success: true, data: list };
}

/**
 * Reserve an expiry deal by ID. (Backend may implement later.)
 * @param {string} id - Deal ID
 * @returns {Promise<{ success: true, data: object }>}
 */
async function reserveDeal(id) {
  const data = await request(`/expiry-deals/${id}/reserve`, { method: "POST" });
  return { success: true, data: data ?? {} };
}

/**
 * Check interactions between a list of medicine names.
 * @param {string[]} medicines - Array of medicine names
 * @returns {Promise<{ riskLevel: string, message: string, recommendation: string }>}
 */
async function checkInteractions(medicines) {
  const res = await request("/interactions", {
    method: "POST",
    body: JSON.stringify({ medicines }),
  });
  return res?.data ?? res;
}

/**
 * Get generic alternative for a branded medicine.
 * @param {string} id - Medicine ID
 * @returns {Promise<{ exists: boolean, baseMedicine?: object, generic?: object, message?: string }>}
 */
async function getGenericAlternative(id) {
  const res = await request(`/medicines/${id}/generic`);
  return res?.data ?? res;
}

const api = {
  getMedicines,
  getMedicine,
  getPrices,
  getExpiryDeals,
  reserveDeal,
  checkInteractions,
  getGenericAlternative,
};

if (typeof window !== "undefined") {
  window.api = api;
  window.ApiError = ApiError;
}

export { api, ApiError };
