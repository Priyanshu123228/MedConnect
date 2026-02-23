/**
 * Expiry deals page: render and handlers.
 */

export function renderExpiryDealsPage() {
  return `
    <main class="grid-pattern flex-1">
      <section class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-8 pb-6">
        <div class="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 overflow-hidden relative">
          <div class="flex-1 z-10 text-center md:text-left">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <span class="material-symbols-outlined text-sm">eco</span>
              Sustainability Initiative
            </div>
            <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3 md:mb-4">Expiry Deals – Save Before It Expires</h2>
            <p class="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-xl">Get safe, discounted medicines before expiry and reduce medical waste while supporting affordable healthcare for all.</p>
          </div>
          <div class="w-full md:w-1/3 aspect-video md:aspect-square bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-primary/5 overflow-hidden relative shrink-0">
            <img class="w-full h-full object-cover opacity-90" alt="Assorted medicine capsules" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAN9u5FzYvAJRXrBlptrTMHkXSBdAO5Z0hQeOKIfLJpDvOMz2DIfd05Xq7QjXCxBnDguz8A9db5xTXCr4QJtc4xN1f4sAQWn_ueGhlMt2V4Z-0gg1P9pOpzpI1NG8zhq3updnXga4Wm3ypu5pR-kAgDKh0hCsAWvKXaWb5an36UZcg_GO29w8-n5_xQ-c-qQsw_2Hddhoj6q0QcfEEXLZMBwYoteTUME37QFc_krvbVN7cGPeFG4UbgogCRIgO87Ok4cMQ9iSsBOs" />
            <div class="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent"></div>
          </div>
          <span class="material-symbols-outlined absolute -bottom-10 -right-10 text-[120px] md:text-[200px] text-emerald-500/10 rotate-12 select-none pointer-events-none">eco</span>
        </div>
      </section>

      <section class="sticky top-[73px] z-40 bg-white/60 dark:bg-background-dark/60 backdrop-blur-md border-b border-primary/5 py-4">
        <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex flex-wrap items-center gap-3 md:gap-4">
          <div class="flex items-center gap-2 text-primary font-semibold text-sm mr-2">
            <span class="material-symbols-outlined text-xl">tune</span>
            Filter By:
          </div>
          <button class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-primary/10 rounded-lg text-sm font-medium hover:border-primary transition-all">
            Expiry Period
            <span class="material-symbols-outlined text-sm">expand_more</span>
          </button>
          <button class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-primary/10 rounded-lg text-sm font-medium hover:border-primary transition-all">
            Discount %
            <span class="material-symbols-outlined text-sm">expand_more</span>
          </button>
          <button class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-primary/10 rounded-lg text-sm font-medium hover:border-primary transition-all">
            <span class="material-symbols-outlined text-sm text-primary">location_on</span>
            Location
            <span class="material-symbols-outlined text-sm">expand_more</span>
          </button>
          <div class="ml-auto flex items-center gap-2">
            <span class="text-xs text-slate-500 font-medium">Sort by:</span>
            <select class="bg-transparent border-none text-sm font-semibold text-primary focus:ring-0 cursor-pointer">
              <option>Days Remaining</option>
              <option>Highest Discount</option>
              <option>Price: Low to High</option>
            </select>
          </div>
        </div>
      </section>

      <section class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-10">
        <div id="expiry-deals-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <div class="col-span-full text-slate-500 py-8 text-center">Loading expiry deals…</div>
        </div>
      </section>

      <section class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-12 md:pb-20">
        <div class="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div class="w-14 h-14 md:w-16 md:h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <span class="material-symbols-outlined text-3xl">recycling</span>
          </div>
          <div class="flex-1">
            <h4 class="text-lg md:text-xl font-bold text-primary mb-2">Every Purchase Makes a Difference</h4>
            <p class="text-slate-600 dark:text-slate-400 text-sm md:text-base">By purchasing near-expiry medicines, you help reduce medical waste and support affordable healthcare. Join our mission for a greener planet and healthier community.</p>
          </div>
          <button class="px-6 py-3 bg-white dark:bg-slate-800 border border-primary text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-all whitespace-nowrap">
            Learn More
          </button>
        </div>
      </section>
    </main>
  `;
}

export async function attachExpiryHandlers(store, deps) {
  const { api, feedback } = deps;
  const grid = document.getElementById("expiry-deals-grid");
  if (!grid) return;
  try {
    grid.innerHTML = '<div class="col-span-full flex flex-col items-center justify-center py-12 gap-4"><span class="app-spinner app-spinner--lg text-primary"></span><p class="text-slate-500">Loading expiry deals…</p></div>';
    const { data: deals } = await api.getExpiryDeals(365);
    store.expiryDeals = deals ?? [];
    if (!(deals ?? []).length) {
      grid.innerHTML = `<div class="col-span-full py-8">${feedback.renderEmptyState("No Results Found", "No expiry deals are available at the moment. Check back later.")}</div>`;
      return;
    }
    const getSeverity = (d) => {
      if (d.daysRemaining <= 14) return { bg: "red", border: "red", icon: "priority_high" };
      if (d.daysRemaining <= 45) return { bg: "amber", border: "amber", icon: "hourglass_empty" };
      return { bg: "emerald", border: "emerald", icon: "check_circle" };
    };
    const cards = (deals ?? []).map((d) => {
      const sev = getSeverity(d);
      const pct = Math.min(100, (d.daysRemaining / 180) * 100);
      return `
        <div class="bg-white dark:bg-slate-800 rounded-xl border border-${sev.border}-100 dark:border-${sev.border}-900/30 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col group">
          <div class="p-5 flex-1">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">${d.medicine?.name || "Medicine"}</h3>
                <p class="text-xs text-slate-500 font-medium uppercase mt-1">${d.medicine?.salt || ""}</p>
              </div>
              <span class="bg-${sev.border}-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">${d.discountPercent}% OFF</span>
            </div>
            <div class="flex items-baseline gap-2 mb-6">
              <span class="text-xl md:text-2xl font-bold text-emerald-600">₹${d.discountedPrice}</span>
              <span class="text-sm text-slate-400 line-through">₹${d.originalPrice}</span>
            </div>
            <div class="space-y-3 mb-6">
              <div class="flex items-center justify-between text-sm">
                <span class="text-slate-500">Pharmacy</span>
                <span class="font-semibold flex items-center gap-1">
                  <span class="material-symbols-outlined text-primary text-sm">local_pharmacy</span>
                  ${d.pharmacy?.name || ""}
                </span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-slate-500">Expiry</span>
                <span class="font-semibold">${d.expiryDate ? new Date(d.expiryDate).toLocaleDateString() : ""}</span>
              </div>
            </div>
            <div class="bg-${sev.border}-50 dark:bg-${sev.border}-900/20 border border-${sev.border}-100 dark:border-${sev.border}-800 rounded-lg p-3">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-${sev.border}-600 uppercase">Expires in ${d.daysRemaining} days</span>
                <span class="material-symbols-outlined text-${sev.border}-500 text-sm">${sev.icon}</span>
              </div>
              <div class="w-full bg-${sev.border}-200 dark:bg-${sev.border}-900/40 h-1.5 rounded-full overflow-hidden">
                <div class="bg-${sev.border}-500 h-full" style="width: ${pct}%"></div>
              </div>
            </div>
          </div>
          <div class="p-4 bg-slate-50 dark:bg-slate-800/50 border-t flex gap-3">
            <button data-action="expiry-details" data-id="${d.id}" class="flex-1 py-2 text-sm font-semibold text-slate-700 bg-white dark:bg-slate-700 border rounded-lg">Details</button>
            ${d.reserved
              ? `<span class="flex-[2] py-2 text-sm font-semibold text-center text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center gap-1"><span class="material-symbols-outlined text-sm">check_circle</span> Reserved</span>`
              : `<button data-action="expiry-reserve" data-id="${d.id}" class="flex-[2] py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:brightness-110">Reserve Now</button>`
            }
          </div>
        </div>
      `;
    });
    grid.innerHTML = cards.join("");
  } catch (err) {
    feedback.logError(err, "attachExpiryHandlers");
    const msg = feedback.getUserFriendlyMessage(err);
    grid.innerHTML = `<div class="col-span-full py-8"><p class="text-red-500 text-center">${msg}</p></div>`;
    feedback.showToast("error", msg);
  }
}
