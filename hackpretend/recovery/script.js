const outageActive = localStorage.getItem("hackulean_server_unavailable") === "1";
const restartBtn = document.getElementById("restart-btn");
const reloadBtn = document.getElementById("reload-btn");
const status = document.getElementById("status");
const mp1Active = localStorage.getItem("hackulean_metapuzzle_1_active") === "1";

let restarted = false;

if (!outageActive) {
  restartBtn.disabled = true;
  reloadBtn.disabled = true;
  status.textContent = "System is operating normally";
  status.className = "status bad";
}

restartBtn.addEventListener("click", () => {
  if (!outageActive) {
    return;
  }

  restarted = true;
  restartBtn.disabled = true;
  status.textContent = "Server restart staged. Now reload safety checks.";
  status.className = "status ok";
});

reloadBtn.addEventListener("click", () => {
  if (!outageActive) {
    status.textContent = "System is operating normally";
    status.className = "status bad";
    return;
  }

  if (!restarted) {
    status.textContent = "Restart Server must be run first.";
    status.className = "status bad";
    return;
  }

  // Reset only HackPretend runtime flags; keep puzzle completion records intact.
  localStorage.removeItem("hackulean_server_unavailable");
  localStorage.removeItem("hackpretend_logged_out");
  localStorage.removeItem("hackpretend_logged_in");
  localStorage.removeItem("hackpretend_elevated");

  const metapuzzleTimer = document.getElementById("metapuzzle-one-status");
  document.body.className = mp1Active ? "success-screen mp1-success-screen" : "success-screen";
  document.body.innerHTML = mp1Active
    ? "<div class=\"mp1-completion\"><p class=\"mp1-kicker\">COMPL3TION S1GNAL // CROSSWIRED</p><h1 data-text=\"Puzzle Completed\">Puzzle C0mplet_d</h1><p>You solved various ciphers, crashed the server to stop a hacker from getting in, and then restored <span class=\"missing-copy\">[DATA MISSING]</span>.</p><p class=\"mp1-fragment\">SYSTEM ERROR // COMPLETION MESSAGE GLITCHED</p><div class=\"actions\"><button id=\"back-root-btn\" type=\"button\">Back to Puzzle Root</button></div></div>"
    : "<div><h1>Puzzle Completed</h1><p>You solved various ciphers, crashed the server to stop a hacker from getting in, and then restored it to keep it running!</p><div class=\"actions\"><button id=\"back-root-btn\" type=\"button\">Back to Puzzle Root</button></div></div>";
  if (metapuzzleTimer) document.body.appendChild(metapuzzleTimer);

  const backRootBtn = document.getElementById("back-root-btn");
  backRootBtn.addEventListener("click", () => {
    window.location.href = mp1Active
      ? "/metapuzzle/1?signal=mp1_reset_puzzle_03"
      : "/?signal=puzzle_completed&puzzle=01-hackpretend";
  });
});
