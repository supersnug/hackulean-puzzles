const outageActive = localStorage.getItem("hackulean_server_unavailable") === "1";
const restartBtn = document.getElementById("restart-btn");
const reloadBtn = document.getElementById("reload-btn");
const status = document.getElementById("status");

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

  document.body.className = "success-screen";
  document.body.innerHTML =
    "<div><h1>Puzzle Completed</h1><p>You solved various ciphers, crashed the server to stop a hacker from getting in, and then restored it to keep it running!</p><div class=\"actions\"><button id=\"back-root-btn\" type=\"button\">Back to Puzzle Root</button></div></div>";

  const backRootBtn = document.getElementById("back-root-btn");
  backRootBtn.addEventListener("click", () => {
    window.location.href = "/?signal=puzzle_completed&puzzle=01-hackpretend";
  });
});
