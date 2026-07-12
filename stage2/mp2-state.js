(() => {
  const ACTIVE_KEY = "hackulean_metapuzzle_2_active";
  const SEED_KEY = "hackulean_metapuzzle_2_seed";
  const COLLECTIONS_KEY = "hackulean_metapuzzle_2_record_collections";
  const memoryCollections = new Map();

  function isActive() {
    try { return localStorage.getItem(ACTIVE_KEY) === "1"; } catch (_error) { return false; }
  }

  function isPuzzleUnlocked(puzzleNumber) {
    if (String(puzzleNumber).padStart(2, "0") === "07") return true;
    try {
      return localStorage.getItem(`hackulean_mp2_puzzle_${String(puzzleNumber).padStart(2, "0")}_unlocked`) === "1";
    } catch (_error) {
      return false;
    }
  }

  function readJson(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "null");
      return value && typeof value === "object" && !Array.isArray(value) ? value : null;
    } catch (_error) {
      return null;
    }
  }

  function clone(value) {
    return value ? JSON.parse(JSON.stringify(value)) : value;
  }

  function loadCollections(puzzleNumber) {
    if (!isActive()) return null;
    if (isPuzzleUnlocked(puzzleNumber)) return clone(readJson(COLLECTIONS_KEY));
    return clone(memoryCollections.get(String(puzzleNumber)) || null);
  }

  function saveCollections(puzzleNumber, collections) {
    if (!isActive()) return false;
    if (!isPuzzleUnlocked(puzzleNumber)) {
      memoryCollections.set(String(puzzleNumber), clone(collections));
      return true;
    }

    try {
      const existing = readJson(COLLECTIONS_KEY) || {};
      localStorage.setItem(COLLECTIONS_KEY, JSON.stringify({ ...existing, ...clone(collections) }));
      return true;
    } catch (_error) {
      return false;
    }
  }

  function getSeed(createSeed) {
    if (!isActive()) return null;
    try {
      const stored = localStorage.getItem(SEED_KEY);
      if (stored) return stored;
      const seed = createSeed();
      localStorage.setItem(SEED_KEY, seed);
      return seed;
    } catch (_error) {
      return createSeed();
    }
  }

  window.HackuleanMP2State = Object.freeze({ isActive, isPuzzleUnlocked, loadCollections, saveCollections, getSeed });
})();
