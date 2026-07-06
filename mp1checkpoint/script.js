const COMPLETION_STORE_KEY = "hackulean_puzzle_completion_map";
const METAPUZZLE_ACTIVE_KEY = "hackulean_metapuzzle_1_active";
const METAPUZZLE_STARTED_AT_KEY = "hackulean_metapuzzle_1_started_at";
const METAPUZZLE_READY_KEY = "hackulean_mp1_completion_ready";
const REQUIRED_PUZZLES = ["01-hackpretend", "02-destroydatabase", "03-restorefiles"];

const startButton = document.getElementById("start-button");
const checkpointNote = document.getElementById("checkpoint-note");
const prerequisiteStatus = document.getElementById("prerequisite-status");
const warningView = document.getElementById("warning-view");
const activeView = document.getElementById("active-view");
const elapsedTime = document.getElementById("elapsed-time");
const finishMp1Button = document.getElementById("finish-mp1-button");
const completedView = document.getElementById("completed-view");
const finalTime = document.getElementById("final-time");

let elapsedTimer = 0;

function prerequisitesAreComplete() {
  try {
    const completionMap = JSON.parse(localStorage.getItem(COMPLETION_STORE_KEY) || "{}");
    return REQUIRED_PUZZLES.every((puzzleId) => completionMap[puzzleId]);
  } catch (_error) {
    return false;
  }
}

function startMetapuzzle() {
  if (!prerequisitesAreComplete()) {
    checkpointNote.textContent = "Access denied: complete puzzles 01–03 before starting Metapuzzle 1.";
    return;
  }

  try {
    if (!localStorage.getItem(METAPUZZLE_STARTED_AT_KEY)) {
      localStorage.setItem(METAPUZZLE_STARTED_AT_KEY, String(Date.now()));
    }
    localStorage.setItem(METAPUZZLE_ACTIVE_KEY, "1");
  } catch (_error) {
    // The metapuzzle can still open when storage is unavailable.
  }

  window.location.href = "/hackpretend";
}

function getStartTime() {
  try {
    if (localStorage.getItem(METAPUZZLE_ACTIVE_KEY) !== "1") return 0;
    const stored = Number(localStorage.getItem(METAPUZZLE_STARTED_AT_KEY));
    if (Number.isFinite(stored) && stored > 0) return stored;

    const migratedStartTime = Date.now();
    localStorage.setItem(METAPUZZLE_STARTED_AT_KEY, String(migratedStartTime));
    return migratedStartTime;
  } catch (_error) {
    return 0;
  }
}

function formatElapsed(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

function showActiveSession(startTime) {
  warningView.classList.add("hidden");
  activeView.classList.remove("hidden");

  const updateElapsedTime = () => {
    const elapsedMilliseconds = Date.now() - startTime;
    elapsedTime.textContent = formatElapsed(elapsedMilliseconds);
    elapsedTime.dateTime = `PT${Math.max(0, Math.floor(elapsedMilliseconds / 1000))}S`;
  };

  updateElapsedTime();
  elapsedTimer = window.setInterval(updateElapsedTime, 1000);
  if (localStorage.getItem(METAPUZZLE_READY_KEY) === "1") finishMp1Button.classList.remove("hidden");
}

function completeMetapuzzle() {
  const elapsed = startTime ? Date.now() - startTime : 0;
  let completionMap = {};
  try { completionMap = JSON.parse(localStorage.getItem(COMPLETION_STORE_KEY) || "{}"); } catch (_error) {}
  completionMap = completionMap && typeof completionMap === "object" ? completionMap : {};
  completionMap["02-destroydatabase"] = true;
  localStorage.clear();
  localStorage.setItem(COMPLETION_STORE_KEY, JSON.stringify(completionMap));
  window.clearInterval(elapsedTimer);
  activeView.classList.add("hidden");
  completedView.classList.remove("hidden");
  finalTime.textContent = formatElapsed(elapsed);
  finalTime.dateTime = `PT${Math.floor(elapsed / 1000)}S`;
}

const startTime = getStartTime();

if (startTime) {
  showActiveSession(startTime);
} else if (!prerequisitesAreComplete()) {
  startButton.disabled = true;
  startButton.textContent = "Puzzles 01–03 Required";
  prerequisiteStatus.classList.add("is-locked");
  prerequisiteStatus.lastChild.textContent = " Puzzles 01–03 incomplete";
  checkpointNote.textContent = "This checkpoint is locked until the first three puzzles are complete.";
}

startButton.addEventListener("click", startMetapuzzle);
finishMp1Button.addEventListener("click", completeMetapuzzle);

window.addEventListener("pagehide", () => window.clearInterval(elapsedTimer));
