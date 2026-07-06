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

function applyPrerequisiteLocks(map) {
  const gatedCards = document.querySelectorAll(".puzzle-card[data-requires]");

  gatedCards.forEach((card) => {
    const requirements = card.dataset.requires
      .split(",")
      .map((requirement) => requirement.trim())
      .filter(Boolean);
    const requirementsMet = requirements.every((requirement) => Boolean(map[requirement]));
    const state = card.querySelector(".puzzle-state");
    const description = card.querySelector(".puzzle-description");

    if (!requirementsMet) {
      card.classList.add("puzzle-card-locked");
      card.setAttribute("aria-disabled", "true");
      if (card.matches("a")) card.setAttribute("tabindex", "-1");
      return;
    }

    if (card.dataset.comingSoon === "true") {
      if (state) state.textContent = "COMING SOON";
      if (description) description.textContent = "Prerequisite complete. This puzzle has not been deployed yet.";
      return;
    }

    card.classList.remove("puzzle-card-locked");
    card.classList.add("puzzle-card-active");
    card.removeAttribute("aria-disabled");
    card.removeAttribute("tabindex");
    if (state && !card.classList.contains("puzzle-card-complete")) state.textContent = "ENTER";
    if (description) description.textContent = "The first three missions hide a larger secret. Cross the checkpoint to begin Metapuzzle 1.";
  });
}

function preventLockedNavigation(event) {
  const lockedCard = event.target.closest("a.puzzle-card[aria-disabled='true']");
  if (lockedCard) event.preventDefault();
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
const completionMap = readCompletionMap();
applyCompletionStatus(completionMap);
applyPrerequisiteLocks(completionMap);
document.addEventListener("click", preventLockedNavigation);

const puzzleCards = document.querySelectorAll(".puzzle-card");

puzzleCards.forEach((card, index) => {
  window.setTimeout(() => {
    card.classList.add("revealed");
  }, 70 * index);
});
