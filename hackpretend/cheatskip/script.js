const MP1_ACTIVE_KEY = "hackulean_metapuzzle_1_active";
const OUTAGE_KEY = "hackulean_server_unavailable";
const message = document.getElementById("message");

if (localStorage.getItem(MP1_ACTIVE_KEY) === "1") {
  localStorage.setItem(OUTAGE_KEY, "1");
  document.body.classList.add("route-active");
  document.title = "Recovery Route Unlocked";
  message.innerHTML =
    '<p class="code">MP1 ROUTE OVERRIDE</p><h1>Recovery unlocked early</h1><p>Resolving emergency recovery endpoint...</p>';
  window.setTimeout(() => {
    window.location.replace("/hackpretend/recovery/blocked");
  }, 1000);
}
