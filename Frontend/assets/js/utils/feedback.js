/**
 * User feedback: modal, toasts, error handling, empty states.
 */

export const IS_DEV =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

export function getUserFriendlyMessage(err) {
  const msg = err?.message || "Something went wrong";
  const status = err?.statusCode ?? err?.status;
  if (status >= 500) return "Something went wrong. Please try again later.";
  return msg;
}

export function logError(err, context = "") {
  if (!IS_DEV || !err) return;
  const entry = {
    timestamp: new Date().toISOString(),
    type: "API_ERROR",
    message: err.message,
    statusCode: err?.statusCode ?? err?.status,
    context: context || "unknown",
  };
  console.error("[MedConnect]", entry);
  if (err?.stack) console.error(err.stack);
}

export function showToast(type, message) {
  const container = document.getElementById("app-toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = `app-toast app-toast--${type}`;
  const icon = type === "success" ? "check_circle" : type === "error" ? "error" : "info";
  toast.innerHTML = `
    <span class="material-symbols-outlined" aria-hidden="true">${icon}</span>
    <span>${String(message).replace(/</g, "&lt;")}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "opacity 0.25s, transform 0.25s";
    setTimeout(() => toast.remove(), 250);
  }, 4000);
}

export function renderEmptyState(title = "No Results Found", text = "Try adjusting your search or filters.") {
  return `
    <div class="app-empty-state">
      <span class="material-symbols-outlined app-empty-state__icon">search_off</span>
      <p class="app-empty-state__title">${title}</p>
      <p class="app-empty-state__text">${text}</p>
    </div>
  `;
}

export function openModal(options) {
  const modal = document.getElementById("app-modal");
  const titleEl = document.getElementById("app-modal-title");
  const bodyEl = modal?.querySelector(".app-modal-body");
  if (!modal || !titleEl || !bodyEl) return;

  const { title = "Notice", body = "", type = "message", data = {} } =
    typeof options === "string" ? { body: options } : options;

  titleEl.textContent = title;

  if (type === "expiry" && data.medicine) {
    const d = data;
    bodyEl.innerHTML = `
      <div class="modal-detail-row"><span class="modal-detail-label">Medicine</span><span class="modal-detail-value">${d.medicine?.name || "—"}</span></div>
      <div class="modal-detail-row"><span class="modal-detail-label">Salt</span><span class="modal-detail-value">${d.medicine?.salt || "—"}</span></div>
      <div class="modal-detail-row"><span class="modal-detail-label">Pharmacy</span><span class="modal-detail-value">${d.pharmacy?.name || "—"}</span></div>
      <div class="modal-detail-row"><span class="modal-detail-label">Location</span><span class="modal-detail-value">${d.pharmacy?.location || "—"}</span></div>
      <div class="modal-detail-row"><span class="modal-detail-label">Original price</span><span class="modal-detail-value">₹${d.originalPrice ?? "—"}</span></div>
      <div class="modal-detail-row"><span class="modal-detail-label">Discounted price</span><span class="modal-detail-value">₹${d.discountedPrice ?? "—"}</span></div>
      <div class="modal-detail-row"><span class="modal-detail-label">Discount</span><span class="modal-detail-value">${d.discountPercent ?? "—"}%</span></div>
      <div class="modal-detail-row"><span class="modal-detail-label">Expiry</span><span class="modal-detail-value">${d.expiryDate ? new Date(d.expiryDate).toLocaleDateString() : "—"}</span></div>
      <div class="modal-detail-row"><span class="modal-detail-label">Days left</span><span class="modal-detail-value">${d.daysRemaining ?? "—"}</span></div>
      ${body ? `<p class="modal-note mt-3">${body}</p>` : ""}
    `;
  } else if (type === "medicine" && (data.medicine || data.pharmacy)) {
    const m = data.medicine || {};
    const p = data.pharmacy || {};
    bodyEl.innerHTML = `
      ${m.name ? `<div class="modal-detail-row"><span class="modal-detail-label">Medicine</span><span class="modal-detail-value">${m.name}</span></div>` : ""}
      ${m.salt ? `<div class="modal-detail-row"><span class="modal-detail-label">Salt</span><span class="modal-detail-value">${m.salt}</span></div>` : ""}
      ${p.name ? `<div class="modal-detail-row"><span class="modal-detail-label">Pharmacy</span><span class="modal-detail-value">${p.name}</span></div>` : ""}
      ${p.location ? `<div class="modal-detail-row"><span class="modal-detail-label">Location</span><span class="modal-detail-value">${p.location}</span></div>` : ""}
      ${data.price != null ? `<div class="modal-detail-row"><span class="modal-detail-label">Price</span><span class="modal-detail-value">₹${data.price}</span></div>` : ""}
      ${body ? `<p class="modal-note mt-3">${body}</p>` : ""}
    `;
  } else if (type === "interaction" && data.message) {
    bodyEl.innerHTML = `
      <p>${data.message}</p>
      ${data.recommendation ? `<p class="modal-note mt-3"><strong>Recommendation:</strong> ${data.recommendation}</p>` : ""}
      ${body ? `<p class="modal-note mt-2">${body}</p>` : ""}
    `;
  } else {
    bodyEl.innerHTML = body ? `<p>${body}</p>` : "";
  }

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

export function closeModal() {
  const modal = document.getElementById("app-modal");
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
