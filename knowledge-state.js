(() => {
  const KEY = "hackulean_knowledge_test";
  const root = new URL("./", document.currentScript.src);
  const phases = ["quiz", "stranded", "spread", "challenge", "cleared", "stopping", "hub-collapse", "recovery", "overrun", "restored"];
  let memory = { phase: "quiz", question: 0 };

  function read() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "null");
      if (saved && phases.includes(saved.phase)) {
        memory = {
          phase: saved.phase,
          question: Number.isInteger(saved.question) ? Math.max(0, Math.min(6, saved.question)) : 0,
          hackPercent: Number.isFinite(saved.hackPercent) ? Math.max(0, Math.min(100, saved.hackPercent)) : 0,
          collapseStartedAt: Number.isFinite(saved.collapseStartedAt) ? saved.collapseStartedAt : 0,
          fastbootUnlocked: saved.fastbootUnlocked === true,
          recoveryScreen: saved.recoveryScreen === "recovery" ? "recovery" : "fastboot",
          terminalBlackout: saved.terminalBlackout === true,
          blackoutStartedAt: Number.isFinite(saved.blackoutStartedAt) ? saved.blackoutStartedAt : 0,
          scamWins: Array.isArray(saved.scamWins) ? [...new Set(saved.scamWins.filter((id) => ["prize", "files", "update", "password", "credits", "vacuum"].includes(id)))] : [],
          spiderGlitchUnlocked: saved.spiderGlitchUnlocked === true,
          destroyedSpiders: Array.isArray(saved.destroyedSpiders) ? [...new Set(saved.destroyedSpiders.filter((id) => /^spider-[0-5]$/.test(id)))].slice(0, 5) : [],
        };
      }
    } catch (_error) {
      // Keep this page playable if storage is unavailable.
    }
    return { ...memory };
  }

  function save(phase, question = read().question, details = {}) {
    memory = { ...read(), ...details, phase, question };
    try { localStorage.setItem(KEY, JSON.stringify(memory)); } catch (_error) {}
  }

  function isCorrupted() { return !["quiz", "restored"].includes(read().phase); }
  function url(path = "") { return new URL(path, root).href; }

  function blockMetapuzzle() {
    if (!isCorrupted()) return false;
    location.replace(url("?signal=corruption-blocked"));
    return true;
  }

  function showFailure(container, detail) {
    container.replaceChildren();
    container.setAttribute("role", "alert");
    const title = document.createElement("h2");
    title.textContent = "INITIALIZATION FAILED";
    title.style.color = "#ff6675";
    const message = document.createElement("p");
    message.textContent = `${detail} Network corruption detected. Node quarantined.`;
    const back = document.createElement("a");
    back.href = url();
    back.textContent = "BACK TO PUZZLE ROOT";
    back.style.cssText = "display:inline-block;margin-top:24px;padding:14px;border:1px solid #ff6675;color:#ff6675;font:700 14px monospace";
    container.append(title, message, back);
  }

  window.HackuleanKnowledge = Object.freeze({ read, save, isCorrupted, url, blockMetapuzzle, showFailure });
  const initiallyCorrupted = isCorrupted();
  const refreshIfChanged = () => {
    if (isCorrupted() !== initiallyCorrupted) location.reload();
  };
  window.addEventListener("pageshow", refreshIfChanged);
  window.addEventListener("storage", (event) => {
    if (event.key === KEY || event.key === null) refreshIfChanged();
  });
})();
