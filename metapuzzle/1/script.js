const COMPLETION_STORE_KEY = "hackulean_puzzle_completion_map";
const RESET_PUZZLE_03_SIGNAL = "mp1_reset_puzzle_03";
const COMPLETE_PUZZLE_03_SIGNAL = "mp1_complete_puzzle_03";
const MP1_PUZZLE_03_UNLOCKED_KEY = "hackulean_mp1_puzzle_03_unlocked";
const MP1_PUZZLE_02_UNLOCKED_KEY = "hackulean_mp1_puzzle_02_unlocked";

function clearPuzzle03State() {
  try {
    const completionMap = JSON.parse(localStorage.getItem(COMPLETION_STORE_KEY) || "{}");
    if (completionMap && typeof completionMap === "object" && !Array.isArray(completionMap)) {
      delete completionMap["03-restorefiles"];
      localStorage.setItem(COMPLETION_STORE_KEY, JSON.stringify(completionMap));
    }

    const restoreKeys = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (key?.startsWith("restore_files_")) restoreKeys.push(key);
    }
    restoreKeys.forEach((key) => localStorage.removeItem(key));
  } catch (_error) {
    // Continue routing even if storage is unavailable or malformed.
  }
}

function advanceFromPuzzle03() {
  try {
    const completionMap = JSON.parse(localStorage.getItem(COMPLETION_STORE_KEY) || "{}");
    const safeMap = completionMap && typeof completionMap === "object" && !Array.isArray(completionMap)
      ? completionMap
      : {};
    delete safeMap["02-destroydatabase"];
    safeMap["03-restorefiles"] = true;
    localStorage.setItem(COMPLETION_STORE_KEY, JSON.stringify(safeMap));
    localStorage.setItem(MP1_PUZZLE_02_UNLOCKED_KEY, "1");
  } catch (_error) {
    // Continue routing if storage is unavailable or malformed.
  }
}

const params = new URLSearchParams(window.location.search);

if (params.get("signal") === RESET_PUZZLE_03_SIGNAL) {
  clearPuzzle03State();
  try {
    localStorage.setItem(MP1_PUZZLE_03_UNLOCKED_KEY, "1");
  } catch (_error) {
    // Continue routing if storage is unavailable.
  }
  window.location.replace("/");
} else if (params.get("signal") === COMPLETE_PUZZLE_03_SIGNAL) {
  advanceFromPuzzle03();
  window.location.replace("/");
} else {
  window.location.replace("/");
}
