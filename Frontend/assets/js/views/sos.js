/**
 * Emergency SOS page: render only (no page-specific handlers).
 */

export function renderEmergencySOSPage() {
  return `
    <div class="relative flex min-h-[calc(100vh-64px)] flex-col items-center bg-background-light dark:bg-background-dark">
      <main class="flex-1 w-full max-w-4xl px-4 flex flex-col items-center justify-start pt-10 pb-20">
        <section class="flex flex-col items-center mb-16 text-center gap-6">
          <div class="flex flex-col items-center gap-2">
            <h1 class="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Emergency Pharmacy SOS</h1>
            <p class="text-sm text-slate-500 dark:text-slate-400 max-w-md">Use this screen in critical situations to quickly locate the nearest 24/7 pharmacies.</p>
          </div>
          <button class="sos-ripple group relative flex h-64 w-64 items-center justify-center rounded-full bg-emergency text-white transition-transform active:scale-95 shadow-2xl animate-pulse-subtle">
            <div class="flex flex-col items-center px-6">
              <span class="material-symbols-outlined text-6xl mb-2">emergency</span>
              <span class="text-2xl font-black uppercase leading-tight tracking-tighter">Emergency Pharmacy Near Me</span>
            </div>
          </button>
          <div class="mt-4 flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
            <span class="material-symbols-outlined text-primary text-sm font-bold">location_on</span>
            <p class="text-primary text-sm font-semibold">Location auto-detected • Sample city</p>
          </div>
        </section>
        <section class="w-full space-y-6">
          <div class="flex items-center justify-between border-b border-primary/10 pb-2">
            <h2 class="text-lg font-bold text-slate-800 dark:text-slate-200">Nearest 24/7 Stores</h2>
            <button class="text-primary text-sm font-bold flex items-center gap-1"><span class="material-symbols-outlined text-sm">map</span> View Full Map</button>
          </div>
          <div class="w-full h-48 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 border border-primary/10 relative">
            <div class="absolute inset-0 bg-cover bg-center opacity-80" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCE9K92QuOnUNhxT6-WwH5fJv3ud85tKsgkBA7FG6LWZm2jkh1yxKZgeakFeFrbXcsXlspAh_LK8vWqvYZ9b_PIpCKCmeJGtNaMAHOutaFJ6nHLYPc5uCzYwbHEIZA4CQ5g5B6SzyhQwAAPhoKBKAZiRIW8fYkfF0C3fuN6NPDOCBFzsp_gLeJLAsJeu1WHkTUeJ-mRgH1qeUgkrD45o3FOAtwJRsGquuZgBOCprpk7He9MZqKHVmC0Hnr_uob39Z9TsWMfkXKrjGI');"></div>
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div class="bg-emergency w-4 h-4 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
            </div>
          </div>
          <div class="grid gap-4 pb-4">
            <div class="bg-white dark:bg-background-dark border border-primary/10 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="flex items-start gap-4">
                <div class="bg-primary/10 p-3 rounded-lg text-primary"><span class="material-symbols-outlined text-3xl">local_pharmacy</span></div>
                <div>
                  <h3 class="font-bold text-lg leading-none">CVS Pharmacy - 24 Hours</h3>
                  <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">701 Van Ness Ave, Sample City</p>
                  <div class="flex items-center gap-3 mt-2">
                    <span class="text-primary font-bold text-xs uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded">Open 24/7</span>
                    <span class="text-slate-400 text-xs font-medium">0.4 miles away</span>
                  </div>
                </div>
              </div>
              <div class="flex gap-2">
                <button class="flex-1 sm:flex-none bg-primary text-white px-5 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"><span class="material-symbols-outlined text-lg">directions</span> Navigate</button>
                <button class="flex-1 sm:flex-none border border-primary text-primary px-5 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"><span class="material-symbols-outlined text-lg">call</span> Call</button>
              </div>
            </div>
            <div class="bg-white dark:bg-background-dark border border-primary/10 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="flex items-start gap-4">
                <div class="bg-primary/10 p-3 rounded-lg text-primary"><span class="material-symbols-outlined text-3xl">local_pharmacy</span></div>
                <div>
                  <h3 class="font-bold text-lg leading-none">Walgreens Pharmacy</h3>
                  <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">135 Central St, Sample City</p>
                  <div class="flex items-center gap-3 mt-2">
                    <span class="text-primary font-bold text-xs uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded">Open 24/7</span>
                    <span class="text-slate-400 text-xs font-medium">1.2 miles away</span>
                  </div>
                </div>
              </div>
              <div class="flex gap-2">
                <button class="flex-1 sm:flex-none bg-primary text-white px-5 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"><span class="material-symbols-outlined text-lg">directions</span> Navigate</button>
                <button class="flex-1 sm:flex-none border border-primary text-primary px-5 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors"><span class="material-symbols-outlined text-lg">call</span> Call</button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer class="w-full bg-white dark:bg-background-dark border-t border-primary/10 py-4 px-6 flex justify-center items-center">
        <p class="text-slate-500 text-xs font-medium flex items-center gap-2">
          <span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span></span>
          Live emergency updates (sample UI only)
        </p>
      </footer>
    </div>
  `;
}
