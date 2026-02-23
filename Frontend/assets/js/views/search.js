/**
 * Search results page: render and handlers.
 */

export function renderSearchResultsPage() {
  return `
    <div class="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <header class="bg-white dark:bg-slate-900 border border-primary/10 rounded-xl px-4 md:px-6 py-3 shadow-sm">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-3xl text-primary">medical_services</span>
            <div>
              <h1 class="text-lg font-bold tracking-tight">Search Results</h1>
              <p class="text-xs text-slate-500 dark:text-slate-400">Search medicines and compare pharmacy prices</p>
            </div>
          </div>
          <div class="w-full md:w-72">
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/60">search</span>
              <input id="search-page-input" type="text" placeholder="Search medicines (e.g. Paracetamol, Ibuprofen)" class="w-full bg-primary/5 border-none rounded-lg pl-10 py-2 focus:ring-2 focus:ring-primary text-sm" />
            </div>
          </div>
          <button id="search-page-btn" class="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90">Search</button>
        </div>
      </header>
      <main class="space-y-6" id="search-results-container">
        <p class="text-slate-500 py-6">Search for a medicine from the home page or use the search bar above.</p>
      </main>
    </div>
  `;
}

export async function attachSearchHandlers(store, deps) {
  const { api, feedback } = deps;

  const container = document.getElementById("search-results-container");
  const searchInput = document.getElementById("search-page-input");
  const searchBtn = document.getElementById("search-page-btn");

  if (!container) return;

  /* =========================
     RENDER PRICE VIEW
  ========================== */
  const renderPriceView = (priceData) => {
    if (!priceData || !priceData.medicine) return "";

    const m = priceData.medicine;
    const prices = priceData.prices || [];
    const savings = priceData.savings;

    const bestBadge = `
      <div class="absolute -top-3 right-6 z-10 bg-[#22c55e] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
        <span class="material-symbols-outlined text-xs">verified</span> BEST PRICE
      </div>
    `;

    const priceCards = prices.map((p, i) => `
      <div class="${i === 0 ? "relative" : ""}">
        ${i === 0 ? bestBadge : ""}
        <div class="bg-white dark:bg-slate-900 p-5 rounded-xl border ${i === 0 ? "border-2 border-[#22c55e]" : "border-primary/10"} shadow-sm">
          <div class="flex flex-col md:flex-row md:items-center gap-6">
            <div class="flex-1 space-y-3">
              <div class="flex items-start justify-between">
                <div>
                  <h4 class="text-lg font-bold">${p.pharmacy?.name || "Pharmacy"}</h4>
                  <p class="text-sm text-slate-500">${p.pharmacy?.location || ""}</p>
                </div>
                <div class="text-right">
                  <p class="font-black text-3xl">₹${p.price}</p>
                  <p class="text-xs text-slate-400">per strip</p>
                </div>
              </div>

              <div class="flex gap-3 pt-2">
                <button 
                  data-action="add-to-cart" 
                  data-id="${p.id}" 
                  data-med-id="${m._id}" 
                  class="bg-primary text-white px-4 py-2 rounded-lg font-bold">
                  Add to Cart
                </button>

                <button 
                  data-action="view-map" 
                  data-id="${p.pharmacy?._id}" 
                  data-med-id="${m._id}" 
                  class="border border-primary text-primary px-4 py-2 rounded-lg">
                  View Map
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `).join("");

    return `
      <div class="space-y-6">
        <div class="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-primary/10">
          <h2 class="text-2xl font-bold">${m.name}</h2>
          <p class="text-slate-500">Salt: ${m.salt}</p>
          <p class="text-slate-500">Manufacturer: ${m.manufacturer || "—"}</p>

          <button 
            data-action="share-details" 
            data-id="${m._id}" 
            class="mt-3 border border-primary text-primary px-4 py-2 rounded-lg">
            Share Details
          </button>
        </div>

        <h3 class="text-lg font-bold">
          Available at ${prices?.length || 0} Pharmacies
        </h3>

        <div class="space-y-4">
          ${prices.length ? priceCards : "<p>No price data available.</p>"}
        </div>

        ${
          savings && savings.savingsAbsolute > 0
            ? `<div class="bg-[#22c55e] p-6 rounded-xl text-white font-bold">
                You save ₹${savings.savingsAbsolute}
              </div>`
            : ""
        }
      </div>
    `;
  };

  /* =========================
     RENDER MEDICINE LIST
  ========================== */
  const renderMedicineList = (medicines) => {
    if (!medicines || !medicines.length) {
      return `<p class="py-6 text-center">No Results Found</p>`;
    }

    return medicines.map((m) => `
      <button 
        data-action="select-medicine" 
        data-id="${m._id}" 
        class="block w-full text-left p-4 border rounded-lg mb-3 hover:bg-gray-50">
        <p class="font-bold">${m.name}</p>
        <p class="text-sm text-slate-500">${m.salt}</p>
      </button>
    `).join("");
  };

  /* =========================
     LOAD STATE
  ========================== */
  const loadSearchState = async () => {

    if (store.selectedMedicineId) {
      try {
        container.innerHTML = `<p class="py-6">Loading prices...</p>`;
        const priceData = await api.getPrices(store.selectedMedicineId);
        store.priceData = priceData;
        container.innerHTML = renderPriceView(priceData);
      } catch (err) {
        container.innerHTML = `<p class="text-red-500">Error loading prices</p>`;
      }
      return;
    }

    if (store.medicines?.length) {
      container.innerHTML = renderMedicineList(store.medicines);
      return;
    }

    container.innerHTML = `<p class="py-6">Search for a medicine above.</p>`;
  };

  /* =========================
     SEARCH FUNCTION
  ========================== */
  const doSearch = async () => {
    const q = searchInput?.value?.trim();
    if (!q) return;

    try {
      searchBtn.disabled = true;
      searchBtn.textContent = "Searching...";

      const res = await api.getMedicines(q);

      store.searchQuery = q;
      store.medicines = res.data || [];
      store.selectedMedicineId = null;
      store.priceData = null;

      await loadSearchState();

    } catch (err) {
      container.innerHTML = `<p class="text-red-500">Search failed</p>`;
    } finally {
      searchBtn.disabled = false;
      searchBtn.textContent = "Search";
    }
  };

  /* =========================
     EVENT LISTENERS
  ========================== */

  searchBtn?.addEventListener("click", doSearch);
  searchInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") doSearch();
  });


  await loadSearchState();
}
