/**
 * Interaction checker page: render and handlers.
 */

export function renderInteractionCheckerPage() {
  return `
    <div class="relative flex min-h-[calc(100vh-64px)] w-full flex-col overflow-x-hidden">
      <main class="flex flex-1 justify-center py-10 px-6 lg:px-40">
        <div class="flex flex-col max-w-[800px] flex-1 gap-8">
          <div class="flex flex-col gap-4">
            <h1 class="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-tight">
              Drug Interaction Checker
            </h1>
            <p class="text-slate-600 dark:text-slate-400 text-lg">
              Safely check for potential contraindications between medications. Search and add
              drugs to see a sample interaction report.
            </p>
          </div>

          <section
            class="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-primary/10 shadow-sm flex flex-col gap-6"
          >
            <div class="flex flex-col gap-2">
              <label
                class="text-slate-700 dark:text-slate-300 text-sm font-semibold uppercase tracking-wider"
              >
                Search Medications
              </label>
              <div class="relative group">
                <span
                  class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 group-focus-within:text-primary transition-colors"
                >
                  search
                </span>
                <input
                  id="interaction-search-input"
                  type="text"
                  placeholder="Type medicine name and press Enter (e.g., Ibuprofen, Warfarin)"
                  class="w-full pl-12 pr-4 py-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>
            </div>

            <div id="interaction-chips" class="flex flex-wrap gap-2"></div>

            <button
              id="interaction-check-btn"
              data-action="check-interaction"
              class="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-lg font-bold text-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
            >
              <span class="material-symbols-outlined">verified_user</span>
              <span>Check Interaction</span>
            </button>
          </section>

          <section class="flex flex-col gap-6">
            <h3
              class="text-slate-900 dark:text-white text-xl font-bold border-b border-primary/10 pb-2 flex items-center gap-2"
            >
              <span class="material-symbols-outlined">analytics</span>
              Interaction Analysis
            </h3>

            <div id="interaction-result">
              <p class="text-slate-500 py-4">Add at least 2 medicines above and click "Check Interaction".</p>
            </div>
          </section>

          <section
            class="mt-6 p-6 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800 text-center"
          >
            <p
              class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed italic"
            >
              Disclaimer: This tool is for informational purposes only and does not substitute
              professional medical advice. Always consult with a healthcare professional before
              changing your medication regimen.
            </p>
          </section>
        </div>
      </main>
    </div>
  `;
}

export function attachInteractionHandlers(store, deps) {
  const input = document.getElementById("interaction-search-input");
  const chipsContainer = document.getElementById("interaction-chips");

  const renderChips = () => {
    if (!chipsContainer) return;
    chipsContainer.innerHTML = store.selectedMedicines
      .map(
        (name) => `
        <div class="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/20">
          <span class="text-sm font-medium">${name}</span>
          <button data-action="remove-chip" data-name="${name}" class="chip-remove hover:text-primary/70">
            <span class="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      `
      )
      .join("");
  };

  input?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const name = input.value.trim();
      if (name && !store.selectedMedicines.includes(name)) {
        store.selectedMedicines.push(name);
        input.value = "";
        renderChips();
      }
    }
  });

  renderChips();
}
