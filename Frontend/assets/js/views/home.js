/**
 * Home page: render and handlers.
 */

export function renderHomePage() {
  return `
    <section class="flex-1 flex flex-col items-center justify-center px-6 py-10">
      <div class="w-full max-w-4xl text-center space-y-8">
        <div class="space-y-3">
          <h1 class="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            💊 MedConnect
          </h1>
          <p class="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
            Find affordable medicines, check interactions, and locate nearby emergency pharmacies.
          </p>
        </div>

        <div class="relative w-full max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-xl shadow-primary/5 border border-slate-200 dark:border-slate-700 p-2 md:p-3">
          <div class="flex flex-col md:flex-row items-center gap-2">
            <div class="flex flex-1 items-center gap-3 px-4 w-full">
              <span class="material-symbols-outlined text-primary">search</span>
              <input
                id="home-search-input"
                type="text"
                placeholder="Search medicine (e.g., Paracetamol 500)"
                class="w-full border-none focus:ring-0 bg-transparent text-lg py-3 placeholder:text-slate-400 dark:text-white"
              />
            </div>
            <div class="hidden md:block w-px h-10 bg-slate-200 dark:bg-slate-700"></div>
            <div class="flex items-center gap-2 px-4 w-full md:w-auto min-w-[180px]">
              <span class="material-symbols-outlined text-primary text-xl">location_on</span>
              <select
                class="w-full border-none focus:ring-0 bg-transparent text-sm font-medium cursor-pointer py-3 appearance-none dark:text-white"
              >
                <option>New Delhi</option>
                <option>Mumbai</option>
                <option>Bangalore</option>
                <option>Hyderabad</option>
              </select>
              <span class="material-symbols-outlined text-slate-400 text-sm">expand_more</span>
            </div>
            <button
              id="home-search-btn"
              class="w-full md:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-lg font-semibold transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              <span>Search</span>
            </button>
          </div>
        </div>

        <div class="flex items-center justify-center gap-2 mt-4 text-slate-500 dark:text-slate-400">
          <span class="material-symbols-outlined text-primary text-lg">verified_user</span>
          <span class="text-sm font-medium">
            Trusted by pharmacies and clinicians for safe decisions
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <button
            class="group flex flex-col items-center p-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:shadow-lg transition-all home-card-animate"
            data-action="go-search"
          >
            <div
              class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
            >
              <span class="material-symbols-outlined text-primary text-3xl">sell</span>
            </div>
            <h3 class="text-lg font-bold mb-2">Compare Prices</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400">
              View pharmacy-level prices and savings.
            </p>
          </button>

          <button
            class="group flex flex-col items-center p-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:shadow-lg transition-all home-card-animate"
            data-action="go-interaction"
          >
            <div
              class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
            >
              <span class="material-symbols-outlined text-primary text-3xl">pill_off</span>
            </div>
            <h3 class="text-lg font-bold mb-2">Check Interactions</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400">
              Validate combinations with a severity-aware checker.
            </p>
          </button>

          <button
            class="group flex flex-col items-center p-8 bg-white dark:bg-slate-800 rounded-xl border-2 border-primary/20 hover:border-primary/60 hover:shadow-lg transition-all relative overflow-hidden home-card-animate"
            data-action="go-sos"
          >
            <div class="absolute top-0 right-0 p-2">
              <span class="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            </div>
            <div
              class="w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
            >
              <span class="material-symbols-outlined text-red-600 text-3xl">emergency</span>
            </div>
            <h3 class="text-lg font-bold mb-2 text-red-600 dark:text-red-400">Emergency SOS</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400">
              Quickly locate 24/7 emergency pharmacies near you.
            </p>
          </button>
        </div>
      </div>
    </section>

    <footer class="w-full max-w-7xl mx-auto px-6 py-8 mt-auto">
      <div class="border-t border-slate-200 dark:border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2 text-primary/70">
          <span class="material-symbols-outlined text-xl">medical_services</span>
          <span class="text-sm font-semibold">MedConnect © 2024</span>
        </div>
        <div class="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
          <a href="#" class="hover:text-primary transition-colors">About</a>
          <a href="#" class="hover:text-primary transition-colors">Privacy</a>
          <a href="#" class="hover:text-primary transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  `;
}

export function attachHomeHandlers(store, deps) {
  const { api, feedback, navigateTo } = deps;
  const searchInput = document.getElementById("home-search-input");
  const searchBtn = document.getElementById("home-search-btn");

  searchBtn?.addEventListener("click", async () => {
    const q = searchInput?.value?.trim();
    if (!q) return;
    try {
      searchBtn.disabled = true;
      searchBtn.innerHTML = '<span class="app-spinner mr-2"></span>Searching…';
      const res = await api.getMedicines(q);
      store.searchQuery = q;
      store.medicines = res.data || [];
      store.selectedMedicineId = null;
      store.priceData = null;
      navigateTo("search");
    } catch (err) {
      feedback.logError(err, "home-search");
      feedback.showToast("error", feedback.getUserFriendlyMessage(err));
    } finally {
      searchBtn.disabled = false;
      searchBtn.textContent = "Search";
    }
  });
}
