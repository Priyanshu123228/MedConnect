/**
 * Generic alternatives page: render and handlers.
 */

export function renderGenericAlternativesPage() {
  return `
    <div class="relative flex h-auto min-h-[calc(100vh-64px)] w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">
      <main class="flex flex-1 justify-center py-8 px-4 md:px-0 pb-12">
        <div class="flex flex-col max-w-[960px] flex-1">
          <div class="flex items-center gap-2 px-4 py-2 text-sm">
            <span class="text-primary font-medium">Home</span>
            <span class="text-slate-400 material-symbols-outlined text-xs">chevron_right</span>
            <span class="text-primary font-medium">Search</span>
            <span class="text-slate-400 material-symbols-outlined text-xs">chevron_right</span>
            <span class="text-slate-500">Savings Comparison</span>
          </div>
          <section class="flex flex-col gap-4 p-4 mt-4">
            <div class="flex flex-col gap-3">
              <h1 class="text-slate-900 dark:text-slate-50 text-3xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
                Save more with the <span class="text-primary">generic alternative</span>
              </h1>
              <p class="text-slate-600 dark:text-slate-400 text-lg font-normal max-w-2xl">
                Switch to a high-quality generic substitute that's identical in composition,
                safety, and effectiveness—at a fraction of the cost.
              </p>
            </div>
          </section>
          <div id="generic-comparison"></div>
          <section class="flex flex-col items-center justify-center p-8 mt-4 text-center">
            <div class="w-full max-w-md h-px bg-slate-200 dark:bg-slate-800 relative">
              <div class="absolute inset-0 flex items-center justify-center -top-4">
                <div class="bg-background-light dark:bg-background-dark px-4 flex items-center gap-2">
                  <div class="flex -space-x-2">
                    <div class="size-8 rounded-full bg-primary/20 flex items-center justify-center border-2 border-background-light dark:border-background-dark"><span class="material-symbols-outlined text-primary text-xs">science</span></div>
                    <div class="size-8 rounded-full bg-primary flex items-center justify-center border-2 border-background-light dark:border-background-dark"><span class="material-symbols-outlined text-white text-xs">sync</span></div>
                  </div>
                  <span class="text-sm font-bold text-slate-700 dark:text-slate-300">Medically Equivalent</span>
                </div>
              </div>
            </div>
          </section>
          <section class="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
            <div class="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
              <span class="material-symbols-outlined text-primary text-4xl mb-3">verified</span>
              <h4 class="font-bold text-slate-900 dark:text-slate-100 mb-2">WHO-GMP Certified</h4>
              <p class="text-sm text-slate-500">All generic medicines are sourced from high-quality, certified manufacturers.</p>
            </div>
            <div class="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
              <span class="material-symbols-outlined text-primary text-4xl mb-3">analytics</span>
              <h4 class="font-bold text-slate-900 dark:text-slate-100 mb-2">Lab Tested</h4>
              <p class="text-sm text-slate-500">Every batch undergoes rigorous quality checks to ensure purity and potency.</p>
            </div>
            <div class="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
              <span class="material-symbols-outlined text-primary text-4xl mb-3">security_update_good</span>
              <h4 class="font-bold text-slate-900 dark:text-slate-100 mb-2">Same Efficacy</h4>
              <p class="text-sm text-slate-500">Identical active ingredients ensure the exact same health outcomes.</p>
            </div>
          </section>
          <section class="p-8 mt-8 mb-4 bg-primary/5 rounded-2xl border border-primary/10">
            <div class="flex gap-4">
              <div class="text-primary shrink-0"><span class="material-symbols-outlined text-3xl">lightbulb</span></div>
              <div>
                <h3 class="text-primary font-bold mb-1">Why choose Generic?</h3>
                <p class="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  Generic medicines are unbranded versions of common drugs. They contain the <span class="font-bold">exact same active pharmaceutical ingredient (API)</span> as the branded counterparts, but are typically far more affordable.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  `;
}

export async function attachGenericHandlers(store, deps) {
  const { api, feedback } = deps;
  const container = document.getElementById("generic-comparison");
  if (!container) return;
  try {
    container.innerHTML = '<div class="flex flex-col items-center gap-4 py-12"><span class="app-spinner app-spinner--lg text-primary"></span><p class="text-slate-500">Loading generic alternatives…</p></div>';
    const res = await api.getMedicines("", 1, 50);
    const medicines = res.data || [];
    const branded = medicines.find((m) => m.type === "Branded") || medicines[0];
    if (!branded) {
      container.innerHTML = `<div class="py-8">${feedback.renderEmptyState("No Results Found", "No medicines in database. Run the seed script to populate.")}</div>`;
      return;
    }
    const data = await api.getGenericAlternative(branded._id);
    store.genericData = data;
    if (!data.exists || !data.generic) {
      container.innerHTML = `<div class="py-8">${feedback.renderEmptyState("No Results Found", `No generic alternative found for ${data.baseMedicine?.name || "this medicine"}.`)}</div>`;
      return;
    }
    const b = data.baseMedicine;
    const g = data.generic;
    let brandPrice = 120;
    let genericPrice = 35;
    try {
      const bp = await api.getPrices(b._id);
      const gp = await api.getPrices(g._id);
      if (bp.prices?.length) brandPrice = bp.prices[0].price;
      if (gp.prices?.length) genericPrice = gp.prices[0].price;
    } catch (_) {}
    const savePct = brandPrice > 0 ? Math.round(((brandPrice - genericPrice) / brandPrice) * 100) : 0;
    container.innerHTML = `
      <section class="mx-4 mt-6 p-6 bg-white dark:bg-slate-900 rounded-xl border border-primary/10 shadow-sm">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 class="text-slate-900 dark:text-slate-50 text-2xl font-bold">Salt: ${b.salt}</h2>
            <div class="flex items-center gap-2 mt-2">
              <span class="material-symbols-outlined text-primary text-sm">check_circle</span>
              <p class="text-primary text-sm font-semibold uppercase">Same Salt, Same Strength</p>
            </div>
          </div>
        </div>
      </section>
      <section class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 mt-4">
        <div class="relative flex flex-col p-8 rounded-xl bg-slate-100 dark:bg-slate-800/50 border-2 border-transparent">
          <div class="flex justify-between items-start mb-6">
            <div>
              <span class="text-slate-500 text-xs font-bold uppercase mb-1 block">Prescribed Brand</span>
              <h3 class="text-slate-800 dark:text-slate-200 text-2xl font-bold">${b.name}</h3>
              <p class="text-slate-500 text-sm">${b.manufacturer}</p>
            </div>
            <div class="size-12 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center"><span class="material-symbols-outlined text-slate-400">pill</span></div>
          </div>
          <div class="mt-auto">
            <div class="flex items-baseline gap-1">
              <span class="text-slate-400 text-lg">₹</span>
              <span class="text-slate-900 dark:text-slate-100 text-4xl font-bold">${brandPrice}</span>
              <span class="text-slate-500 text-sm ml-1">/ strip</span>
            </div>
          </div>
        </div>
        <div class="relative flex flex-col p-8 rounded-xl bg-white dark:bg-slate-900 border-2 border-primary shadow-xl scale-105 z-10">
          <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-1.5 rounded-full font-bold text-sm shadow-lg flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px]">savings</span> SAVE ${savePct}%
          </div>
          <div class="flex justify-between items-start mb-6 pt-2">
            <div>
              <span class="text-primary text-xs font-bold uppercase block mb-1">Recommended Generic</span>
              <h3 class="text-slate-900 dark:text-slate-50 text-2xl font-bold">${g.name}</h3>
              <p class="text-slate-500 text-sm">${g.manufacturer}</p>
            </div>
            <div class="size-12 bg-primary/10 rounded-lg flex items-center justify-center"><span class="material-symbols-outlined text-primary">medication_liquid</span></div>
          </div>
          <div class="mt-auto">
            <div class="flex items-baseline gap-1">
              <span class="text-primary text-lg">₹</span>
              <span class="text-slate-900 dark:text-slate-50 text-5xl font-black">${genericPrice}</span>
              <span class="text-slate-500 text-sm ml-1">/ strip</span>
            </div>
            <button data-action="switch-generic" data-id="${g._id}" data-brand-id="${b._id}" class="mt-6 w-full flex items-center justify-center gap-2 py-4 px-6 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold text-lg">
              Switch to Generic <span class="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>
    `;
  } catch (err) {
    feedback.logError(err, "attachGenericHandlers");
    const msg = feedback.getUserFriendlyMessage(err);
    container.innerHTML = `<p class="text-red-500 py-8 text-center">${msg}</p>`;
    feedback.showToast("error", msg);
  }
}
