

import { getState } from "./state/store.js";
import * as feedback from "./utils/feedback.js";
import { navigateTo, setActiveNav } from "./router.js";
import { api } from "./api.js";
import {
  renderHomePage,
  attachHomeHandlers,
  renderExpiryDealsPage,
  attachExpiryHandlers,
  renderSearchResultsPage,
  attachSearchHandlers,
  renderInteractionCheckerPage,
  attachInteractionHandlers,
  renderGenericAlternativesPage,
  attachGenericHandlers,
  renderEmergencySOSPage,
} from "./views/index.js";

const store = getState();
const deps = { api, feedback, navigateTo };

const ROUTES = {
  home: renderHomePage,
  expiry: renderExpiryDealsPage,
  search: renderSearchResultsPage,
  interaction: renderInteractionCheckerPage,
  alternatives: renderGenericAlternativesPage,
  sos: renderEmergencySOSPage,
};

function handleRouteChange() {
  const raw = window.location.hash.replace("#", "");
  const routeKey = raw || "home";
  const appRoot = document.getElementById("app-root");
  const render = ROUTES[routeKey] || ROUTES.home;
  appRoot.innerHTML = "";
  const wrapper = document.createElement("div");
  wrapper.className = "flex-1 flex flex-col app-page-enter";
  wrapper.innerHTML = render();
  appRoot.appendChild(wrapper);
  setActiveNav(routeKey);
  attachPageSpecificHandlers(routeKey);
}

function attachPageSpecificHandlers(routeKey) {
  if (routeKey === "home") attachHomeHandlers(store, deps);
  else if (routeKey === "search") attachSearchHandlers(store, deps);
  else if (routeKey === "expiry") attachExpiryHandlers(store, deps);
  else if (routeKey === "interaction") attachInteractionHandlers(store, deps);
  else if (routeKey === "alternatives") attachGenericHandlers(store, deps);
}

function attachGlobalClickHandler() {
  document.addEventListener("click", async (event) => {
    const target = event.target.closest("[data-action], .app-nav-link");
    if (!target) return;

    const route = target.getAttribute("data-route");
    if (route) {
      event.preventDefault();
      navigateTo(route);
      return;
    }

    const action = target.getAttribute("data-action");
    if (!action) return;

    const { openModal, closeModal, showToast, getUserFriendlyMessage, logError } = feedback;

    switch (action) {
      case "close-modal":
        closeModal();
        break;
      case "go-search":
        navigateTo("search");
        break;
      case "go-interaction":
        navigateTo("interaction");
        break;
      case "go-sos":
        navigateTo("sos");
        break;
      case "select-medicine": {
        const medId = target.getAttribute("data-id");
        if (!medId) return;
        store.selectedMedicineId = medId;
        store.priceData = null;
        const container = document.getElementById("search-results-container");
        if (container) {
          try {
            container.innerHTML = '<div class="flex flex-col items-center gap-4 py-8"><span class="app-spinner app-spinner--lg text-primary"></span><p class="text-slate-500">Loading prices…</p></div>';
            const priceData = await api.getPrices(medId);
            store.priceData = priceData;
            const m = priceData.medicine;
            const prices = priceData.prices || [];
            const savings = priceData.savings;
            const bestBadge = `<div class="absolute -top-3 right-6 z-10 bg-[#22c55e] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1"><span class="material-symbols-outlined text-xs">verified</span> BEST PRICE</div>`;
            const priceCards = prices.map((p, i) => `
              <div class="${i === 0 ? "relative animate-best-price" : ""}">
                ${i === 0 ? bestBadge : ""}
                <div class="bg-white dark:bg-slate-900 p-5 rounded-xl border ${i === 0 ? "border-2 border-[#22c55e]" : "border-primary/10"} shadow-sm hover:shadow-md transition-shadow">
                  <div class="flex flex-col md:flex-row md:items-center gap-6">
                    <div class="flex-1 space-y-3">
                      <div class="flex items-start justify-between">
                        <div>
                          <h4 class="text-lg font-bold">${p.pharmacy?.name || "Pharmacy"}</h4>
                          <div class="flex items-center gap-4 mt-1">
                            <span class="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400"><span class="material-symbols-outlined text-sm text-primary">location_on</span>${p.pharmacy?.location || ""}</span>
                            <span class="flex items-center gap-1 text-sm text-[#22c55e] font-medium"><span class="material-symbols-outlined text-sm">check_circle</span> In Stock</span>
                          </div>
                        </div>
                        <div class="text-right">
                          <p class="font-black text-slate-900 dark:text-slate-100 text-3xl md:text-4xl">₹${p.price}</p>
                          <p class="text-xs text-slate-400">per strip</p>
                        </div>
                      </div>
                      <div class="flex items-center gap-3 pt-2">
                        <button data-action="add-to-cart" data-id="${p.id}" data-med-id="${m?._id}" class="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-bold hover:bg-primary/90 transition-colors">Add to Cart</button>
                        <button data-action="view-map" data-id="${p.pharmacy?._id}" data-med-id="${m?._id}" class="flex-1 md:flex-none flex items-center justify-center gap-2 border border-primary/20 text-primary px-4 py-2.5 rounded-lg font-semibold hover:bg-primary/5 transition-colors"><span class="material-symbols-outlined text-lg">map</span> View Map</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `).join("");
            container.innerHTML = `
              <div class="space-y-6">
                <div class="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-primary/10">
                  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div class="flex items-start gap-5">
                      <div class="w-20 h-20 bg-primary/5 rounded-lg flex items-center justify-center border border-primary/10"><span class="material-symbols-outlined text-4xl text-primary">pill</span></div>
                      <div class="space-y-1">
                        <div class="flex items-center gap-3">
                          <h2 class="text-2xl font-bold">${m?.name || ""}</h2>
                          <span class="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase">${m?.type || "Generic"}</span>
                        </div>
                        <p class="text-slate-500 dark:text-slate-400">Salt: <span class="font-medium">${m?.salt || ""}</span></p>
                      </div>
                    </div>
                    <button data-action="share-details" data-id="${m?._id}" class="flex items-center justify-center gap-2 border-2 border-primary/20 hover:border-primary text-primary font-semibold px-4 py-2 rounded-lg transition-all"><span class="material-symbols-outlined text-lg">share</span> Share Details</button>
                  </div>
                </div>
                <div class="flex items-center justify-between px-1">
                  <h3 class="text-lg font-bold">Available at ${prices.length} Pharmacies</h3>
                  ${savings ? `<span class="text-sm text-[#22c55e] font-semibold">Save ₹${savings.savingsAbsolute}</span>` : ""}
                </div>
                <div class="space-y-4">${priceCards || "<p class=\"text-slate-500 py-4\">No price data.</p>"}</div>
              </div>
            `;
          } catch (err) {
            logError(err, "select-medicine-prices");
            const msg = getUserFriendlyMessage(err);
            container.innerHTML = `<p class="text-red-500 py-6">${msg}</p>`;
            showToast("error", msg);
          }
        }
        break;
      }
      case "add-to-cart": {
        const priceId = target.getAttribute("data-id");
        if (priceId) {
          try {
            openModal({ title: "Added to cart", body: `Price ID: ${priceId}. Connect to backend when cart API is ready.` });
          } catch (err) {
            showToast("error", getUserFriendlyMessage(err));
          }
        }
        break;
      }
      case "view-map": {
        const pharmacyId = target.getAttribute("data-id");
        if (pharmacyId) openModal({ title: "View map", body: `Pharmacy ID: ${pharmacyId}. Connect to maps when ready.` });
        break;
      }
      case "share-details": {
        const medId = target.getAttribute("data-id");
        if (medId && navigator.share) {
          try {
            await navigator.share({ title: "MedConnect", url: window.location.href, text: `Medicine ID: ${medId}` });
          } catch (e) {
            if (e.name !== "AbortError") showToast("error", e.message || "Share failed");
          }
        } else {
          navigator.clipboard?.writeText(window.location.href).then(() => showToast("success", "Link copied to clipboard")).catch(() => {});
        }
        break;
      }
      case "expiry-details": {
        const dealId = target.getAttribute("data-id");
        if (dealId) {
          const deal = store.expiryDeals?.find((d) => d.id === dealId);
          if (deal) openModal({ title: deal.medicine?.name || "Deal details", type: "expiry", data: deal });
        }
        break;
      }
      case "expiry-reserve": {
        const dealId = target.getAttribute("data-id");
        if (dealId) {
          const reserveBtn = target.closest("button");
          const originalHTML = reserveBtn?.innerHTML;
          try {
            if (reserveBtn) {
              reserveBtn.disabled = true;
              reserveBtn.innerHTML = '<span class="app-spinner mr-1" style="width:1rem;height:1rem;border-width:2px;border-color:rgba(255,255,255,0.3);border-top-color:white;"></span> Reserving…';
            }
            await api.reserveDeal(dealId);
            const deal = store.expiryDeals?.find((d) => d.id === dealId);
            if (deal) deal.reserved = true;
            const btnEl = document.querySelector(`[data-action="expiry-reserve"][data-id="${dealId}"]`);
            if (btnEl) {
              const span = document.createElement("span");
              span.className = "flex-[2] py-2 text-sm font-semibold text-center text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center gap-1";
              span.innerHTML = "<span class=\"material-symbols-outlined text-sm\">check_circle</span> Reserved";
              btnEl.replaceWith(span);
            }
            showToast("success", "Deal reserved successfully!");
          } catch (err) {
            logError(err, "expiry-reserve");
            showToast("error", getUserFriendlyMessage(err));
            if (reserveBtn && originalHTML) reserveBtn.innerHTML = originalHTML;
          } finally {
            if (reserveBtn) reserveBtn.disabled = false;
          }
        }
        break;
      }
      case "remove-chip": {
        const name = target.getAttribute("data-name");
        if (name) {
          store.selectedMedicines = store.selectedMedicines.filter((n) => n !== name);
          const chipsContainer = document.getElementById("interaction-chips");
          if (chipsContainer) {
            chipsContainer.innerHTML = store.selectedMedicines.map((n) => `
              <div class="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/20">
                <span class="text-sm font-medium">${n}</span>
                <button data-action="remove-chip" data-name="${n}" class="hover:text-primary/70"><span class="material-symbols-outlined text-sm">close</span></button>
              </div>
            `).join("");
          }
        }
        break;
      }
      case "check-interaction": {
        if (store.selectedMedicines.length < 2) {
          openModal({ title: "Interaction check", type: "interaction", data: { message: "Add at least 2 medicines to check interactions." } });
          return;
        }
        const resultContainer = document.getElementById("interaction-result");
        const checkBtn = document.getElementById("interaction-check-btn");
        if (!checkBtn || !resultContainer) return;
        try {
          checkBtn.disabled = true;
          checkBtn.innerHTML = '<span class="app-spinner mr-2" style="border-color: rgba(255,255,255,0.3); border-top-color: white;"></span> Checking…';
          const result = await api.checkInteractions(store.selectedMedicines);
          store.interactionResult = result;
          const riskClass = result.riskLevel === "High" ? "red" : result.riskLevel === "Moderate" ? "amber" : "emerald";
          resultContainer.innerHTML = `
            <div class="relative overflow-hidden rounded-xl border-2 border-${riskClass}-500/20 bg-${riskClass}-50 dark:bg-${riskClass}-950/20 p-6 shadow-sm">
              <div class="flex gap-4">
                <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-${riskClass}-100 text-${riskClass}-600">
                  <span class="material-symbols-outlined text-3xl">${result.riskLevel === "High" ? "warning" : result.riskLevel === "Moderate" ? "info" : "check_circle"}</span>
                </div>
                <div class="flex flex-col gap-1">
                  <p class="text-${riskClass}-800 dark:text-${riskClass}-200 text-lg font-bold">
                    <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-${riskClass}-600 text-white">${result.riskLevel} Risk</span>
                    ${result.message}
                  </p>
                  <p class="text-${riskClass}-700 dark:text-${riskClass}-300 text-sm mt-2">${result.recommendation}</p>
                </div>
              </div>
            </div>
          `;
        } catch (err) {
          logError(err, "check-interaction");
          resultContainer.innerHTML = `<p class="text-red-500">${getUserFriendlyMessage(err)}</p>`;
          showToast("error", getUserFriendlyMessage(err));
        } finally {
          checkBtn.disabled = false;
          checkBtn.innerHTML = "<span class=\"material-symbols-outlined\">verified_user</span><span>Check Interaction</span>";
        }
        break;
      }
      case "switch-generic": {
        const genericId = target.getAttribute("data-id");
        if (genericId) {
          try {
            openModal({ title: "Switched to generic", body: `Generic ID: ${genericId}. Connect to cart/backend when ready.` });
          } catch (err) {
            showToast("error", getUserFriendlyMessage(err));
          }
        }
        break;
      }
      default:
        break;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  attachGlobalClickHandler();
  handleRouteChange();
});
window.addEventListener("hashchange", handleRouteChange);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const modal = document.getElementById("app-modal");
    if (modal?.classList.contains("is-open")) feedback.closeModal();
  }
});
