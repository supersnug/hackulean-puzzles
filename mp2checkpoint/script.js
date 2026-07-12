const COMPLETION_STORE_KEY = "hackulean_puzzle_completion_map";
const MP2_ACTIVE_KEY = "hackulean_metapuzzle_2_active";
const MP2_STARTED_AT_KEY = "hackulean_metapuzzle_2_started_at";
const REQUIRED_PUZZLES = ["05-fixcorruption", "06-manage-database", "07-defeat-hackers"];

const startButton = document.getElementById("start-button");
const checkpoint = document.getElementById("checkpoint");
const checkpointNote = document.getElementById("checkpoint-note");
const prerequisiteStatus = document.getElementById("prerequisite-status");
const launchSequence = document.getElementById("launch-sequence");
const completedView = document.getElementById("completed-view");
const finalTime = document.getElementById("final-time");

function prerequisitesAreComplete() {
  try {
    const completionMap = JSON.parse(localStorage.getItem(COMPLETION_STORE_KEY) || "{}");
    return REQUIRED_PUZZLES.every((puzzleId) => completionMap?.[puzzleId]);
  } catch (_error) {
    return false;
  }
}

function mp2IsActive() {
  try {
    return localStorage.getItem(MP2_ACTIVE_KEY) === "1";
  } catch (_error) {
    return false;
  }
}

function completionIsReady() {
  try { return localStorage.getItem("hackulean_mp2_complete_ready") === "1"; } catch (_error) { return false; }
}

function formatElapsed(milliseconds) {
  const seconds = Math.max(0, Math.floor(milliseconds / 1000));
  return [Math.floor(seconds / 3600), Math.floor(seconds % 3600 / 60), seconds % 60]
    .map((value) => String(value).padStart(2, "0")).join(":");
}

function completeMetapuzzle() {
  let elapsed = 0;
  let completionMap = {};
  try {
    elapsed = Date.now() - Number(localStorage.getItem(MP2_STARTED_AT_KEY) || Date.now());
    completionMap = JSON.parse(localStorage.getItem(COMPLETION_STORE_KEY) || "{}");
    completionMap = completionMap && typeof completionMap === "object" ? completionMap : {};
    completionMap["06-manage-database"] = true;
    localStorage.clear();
    localStorage.setItem(COMPLETION_STORE_KEY, JSON.stringify(completionMap));
  } catch (_error) {}
  checkpoint.hidden = true;
  completedView.hidden = false;
  finalTime.textContent = formatElapsed(elapsed);
}

function beginMetapuzzle() {
  if (!prerequisitesAreComplete()) {
    checkpointNote.textContent = "Access denied: complete Puzzles 05–07 before starting Metapuzzle 2.";
    return;
  }

  startButton.disabled = true;
  document.body.classList.add("is-launching");
  checkpoint.setAttribute("aria-hidden", "true");
  launchSequence.setAttribute("aria-hidden", "false");

  window.setTimeout(() => document.body.classList.add("portal-opening"), 5100);
  window.setTimeout(() => {
    try {
      localStorage.setItem(MP2_ACTIVE_KEY, "1");
      if (!localStorage.getItem(MP2_STARTED_AT_KEY)) {
        localStorage.setItem(MP2_STARTED_AT_KEY, String(Date.now()));
      }
    } catch (_error) {
      // Continue into the metapuzzle if storage is unavailable.
    }
    window.location.href = "/defeathackers";
  }, 7200);
}

if (completionIsReady()) {
  checkpoint.querySelector(".eyebrow").textContent = "METAPUZZLE SESSION // READY";
  checkpoint.querySelector("h1").textContent = "Final Signal Recovered";
  checkpoint.querySelector(".subtitle").textContent = "All crossover routes have converged. Complete the metapuzzle to finalize the session.";
  startButton.textContent = "COMPLETE METAPUZZLE 2";
} else if (!prerequisitesAreComplete()) {
  startButton.disabled = true;
  startButton.textContent = "PUZZLES 05–07 REQUIRED";
  prerequisiteStatus.classList.add("is-locked");
  prerequisiteStatus.lastChild.textContent = " Puzzles 05–07 incomplete";
} else if (mp2IsActive()) {
  startButton.textContent = "RESUME METAPUZZLE 2";
}

startButton.addEventListener("click", () => {
  if (completionIsReady()) {
    completeMetapuzzle();
    return;
  }
  if (mp2IsActive()) {
    window.location.href = "/defeathackers";
    return;
  }
  beginMetapuzzle();
});
