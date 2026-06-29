const COMPLETION_STORE_KEY = "hackulean_puzzle_completion_map";
const COMPLETION_SIGNAL = "puzzle_completed";

function readCompletionMap() {
  const raw = localStorage.getItem(COMPLETION_STORE_KEY);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed;
    }
  } catch (_error) {
    // Ignore malformed storage and recover with an empty map.
  }

  return {};
}

function writeCompletionMap(map) {
  localStorage.setItem(COMPLETION_STORE_KEY, JSON.stringify(map));
}

function applyCompletionStatus(map) {
  const cards = document.querySelectorAll(".puzzle-card[data-puzzle-id]");

  cards.forEach((card) => {
    const puzzleId = card.dataset.puzzleId;
    if (!puzzleId || !map[puzzleId]) return;

    const state = card.querySelector(".puzzle-state");
    if (!state) return;

    state.textContent = "PUZZLE COMPLETE";
    state.classList.add("puzzle-state-complete");
    card.classList.add("puzzle-card-complete");
  });
}

function processCompletionSignal() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("signal") !== COMPLETION_SIGNAL) return;

  const puzzleId = params.get("puzzle");
  if (!puzzleId) return;

  const completionMap = readCompletionMap();
  completionMap[puzzleId] = true;
  writeCompletionMap(completionMap);

  params.delete("signal");
  params.delete("puzzle");
  const query = params.toString();
  const cleanUrl = `${window.location.pathname}${query ? `?${query}` : ""}`;
  window.history.replaceState({}, "", cleanUrl);
}

processCompletionSignal();
applyCompletionStatus(readCompletionMap());

const puzzleCards = document.querySelectorAll(".puzzle-card");

puzzleCards.forEach((card, index) => {
  window.setTimeout(() => {
    card.classList.add("revealed");
  }, 70 * index);
});