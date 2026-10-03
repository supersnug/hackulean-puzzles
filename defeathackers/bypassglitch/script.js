const MP2_ACTIVE_KEY = "hackulean_metapuzzle_2_active";
const RECOVERY_KEY = "hackulean_defeathackers_recovery_started";
const HACKERS_DEFEATED_KEY = "hackulean_defeathackers_hackers_defeated";

let routeAvailable = false;
try {
  routeAvailable = localStorage.getItem(MP2_ACTIVE_KEY) === "1" && localStorage.getItem(RECOVERY_KEY) === "1";
} catch (_error) {
  routeAvailable = false;
}

if (!routeAvailable) {
  document.title = "404 Not Found";
  document.body.className = "not-found";
  document.querySelector('meta[name="theme-color"]').content = "#07121f";
  document.body.innerHTML = '<main id="message" class="message" aria-live="polite"><p class="code">404</p><h1>Not Found</h1><p>The requested URL was not found on this server.</p></main>';
} else {
  document.body.classList.add("is-bypassing");
  window.setTimeout(() => {
    try {
      localStorage.removeItem(RECOVERY_KEY);
      localStorage.setItem(HACKERS_DEFEATED_KEY, "1");
    } catch (_error) {
      // Continue back to Puzzle 07 if storage is unavailable.
    }
    window.location.replace("/defeathackers");
  }, 3_400);
}
