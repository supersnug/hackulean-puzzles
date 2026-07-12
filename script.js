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
    const title = card.querySelector(".puzzle-title");
    const description = card.querySelector(".puzzle-description");

    if (!requirementsMet) {
      card.classList.add("puzzle-card-locked");
      card.setAttribute("aria-disabled", "true");
      if (card.matches("a")) card.setAttribute("tabindex", "-1");
      if (title && card.dataset.lockedTitle) title.textContent = card.dataset.lockedTitle;
      if (description && card.dataset.lockedDescription) {
        description.textContent = card.dataset.lockedDescription;
      } else if (requirements.length === 1 && requirements[0] === "04-metapuzzle-1" && description) {
        const puzzleNumber = card.querySelector(".icon-core")?.textContent.trim();
        if (puzzleNumber) description.textContent = `Complete Metapuzzle 1 to unlock Puzzle ${puzzleNumber}.`;
      }
      return;
    }

    if (card.dataset.comingSoon === "true") {
      if (state && !card.classList.contains("puzzle-card-complete")) state.textContent = "COMING SOON";
      if (description) description.textContent = "Prerequisite complete. This puzzle has not been deployed yet.";
      return;
    }

    card.classList.remove("puzzle-card-locked");
    card.classList.add("puzzle-card-active");
    card.removeAttribute("aria-disabled");
    card.removeAttribute("tabindex");
    if (title && card.dataset.unlockedTitle) title.textContent = card.dataset.unlockedTitle;
    if (state && !card.classList.contains("puzzle-card-complete")) state.textContent = "ENTER";
    if (description) {
      description.textContent = card.dataset.unlockedDescription
        || "The first three missions hide a larger secret. Cross the checkpoint to begin Metapuzzle 1.";
    }
  });
}

function applyCurrentStage(map) {
  const widget = document.querySelector(".stage-widget");
  const icon = document.getElementById("stage-widget-icon");
  const stage = document.getElementById("current-stage");
  const status = document.getElementById("stage-widget-status");
  const isStageTwo = Boolean(map["04-metapuzzle-1"]);
  const isStageThree = Boolean(map["08-metapuzzle-2"]);
  let isMetapuzzleActive = false;

  document.body.classList.toggle("stage-two-active", isStageTwo);
  document.body.classList.toggle("stage-three-active", isStageThree);

  try {
    isMetapuzzleActive =
      localStorage.getItem("hackulean_metapuzzle_1_active") === "1"
      || localStorage.getItem("hackulean_metapuzzle_2_active") === "1";
  } catch (_error) {
    // Fall back to the resolved stage when storage is unavailable.
  }

  if (isMetapuzzleActive) {
    icon.textContent = "?";
    status.textContent = "SIGNAL UNSTABLE";
    widget.classList.add("stage-unstable");

    const glitchStageNumber = () => {
      stage.textContent = `STAGE ${Math.floor(Math.random() * 9) + 1}`;
    };
    glitchStageNumber();
    const glitchTimer = window.setInterval(glitchStageNumber, 200);
    window.addEventListener("pagehide", () => window.clearInterval(glitchTimer), { once: true });
    return;
  }

  icon.textContent = isStageThree ? "3" : isStageTwo ? "2" : "1";
  stage.textContent = isStageThree ? "STAGE 3" : isStageTwo ? "STAGE 2" : "STAGE 1";
  status.textContent = isStageThree ? "MERGED NETWORK" : isStageTwo ? "NETWORK EXPANDED" : "INITIAL NETWORK";
  widget.classList.toggle("stage-two", isStageTwo && !isStageThree);
  widget.classList.toggle("stage-three", isStageThree);
}

function preventLockedNavigation(event) {
  const lockedCard = event.target.closest("a.puzzle-card[aria-disabled='true']");
  if (lockedCard) event.preventDefault();
}

function processCompletionSignal() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("signal") !== COMPLETION_SIGNAL) return "";

  const puzzleId = params.get("puzzle");
  if (!puzzleId) return "";

  const completionMap = readCompletionMap();
  completionMap[puzzleId] = true;
  writeCompletionMap(completionMap);

  params.delete("signal");
  params.delete("puzzle");
  const query = params.toString();
  const cleanUrl = `${window.location.pathname}${query ? `?${query}` : ""}`;
  window.history.replaceState({}, "", cleanUrl);
  return puzzleId;
}

function showStageTwoReveal() {
  const reveal = document.getElementById("stage-two-reveal");
  const continueButton = document.getElementById("stage-two-continue");
  reveal.hidden = false;
  document.body.classList.add("stage-two-boot");

  continueButton.addEventListener("click", () => {
    document.body.classList.add("stage-two-closing");
    window.setTimeout(() => {
      reveal.hidden = true;
      document.body.classList.remove("stage-two-boot", "stage-two-closing");
      document.body.classList.add("stage-two-arrived");
    }, 500);
  }, { once: true });
}

function showStageThreeReveal() {
  const reveal = document.getElementById("stage-three-reveal");
  const continueButton = document.getElementById("stage-three-continue");
  reveal.hidden = false;
  document.body.classList.add("stage-three-boot");
  continueButton.addEventListener("click", () => {
    document.body.classList.add("stage-three-closing");
    window.setTimeout(() => {
      reveal.hidden = true;
      document.body.classList.remove("stage-three-boot", "stage-three-closing");
      document.body.classList.add("stage-three-arrived");
    }, 550);
  }, { once: true });
}

function initializeAmbientStageGrid(isStageThree = false) {
  const grid = document.getElementById("ambient-stage-grid");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const cellSize = 23;
  let cells = [];
  let patternTimer = 0;
  let resizeTimer = 0;

  const buildGrid = () => {
    const columns = Math.ceil(window.innerWidth / cellSize) + 1;
    const rows = Math.ceil(window.innerHeight / cellSize) + 1;
    grid.style.setProperty("--ambient-columns", columns);
    grid.style.setProperty("--ambient-rows", rows);

    const fragment = document.createDocumentFragment();
    for (let index = 0; index < columns * rows; index += 1) {
      const cell = document.createElement("span");
      cell.className = "ambient-stage-cell";
      fragment.appendChild(cell);
    }
    grid.replaceChildren(fragment);
    cells = Array.from(grid.children);
  };

  const lightCells = () => {
    if (!cells.length) return;
    const count = Math.min(cells.length, (isStageThree ? 30 : 12) + Math.floor(Math.random() * (isStageThree ? 35 : 17)));
    const indexes = new Set();
    while (indexes.size < count) indexes.add(Math.floor(Math.random() * cells.length));

    indexes.forEach((index) => {
      const cell = cells[index];
      cell.classList.remove("active");
      cell.style.setProperty("--cell-duration", `${isStageThree ? 650 : 1100 + Math.random() * (isStageThree ? 650 : 1200)}ms`);
      void cell.offsetWidth;
      cell.classList.add("active");
    });
    patternTimer = window.setTimeout(lightCells, (isStageThree ? 260 : 650) + Math.random() * (isStageThree ? 420 : 850));
  };

  buildGrid();
  lightCells();
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(buildGrid, 120);
  });
  window.addEventListener("pagehide", () => {
    window.clearTimeout(patternTimer);
    window.clearTimeout(resizeTimer);
  }, { once: true });
}

const completedPuzzleId = processCompletionSignal();
const completionMap = readCompletionMap();
applyCompletionStatus(completionMap);
applyPrerequisiteLocks(completionMap);
applyCurrentStage(completionMap);
if (completionMap["04-metapuzzle-1"]) initializeAmbientStageGrid(Boolean(completionMap["08-metapuzzle-2"]));
if (completedPuzzleId === "04-metapuzzle-1") showStageTwoReveal();
if (completedPuzzleId === "08-metapuzzle-2") showStageThreeReveal();
document.addEventListener("click", preventLockedNavigation);

const puzzleCards = document.querySelectorAll(".puzzle-card");

puzzleCards.forEach((card, index) => {
  window.setTimeout(() => {
    card.classList.add("revealed");
  }, 70 * index);
});
