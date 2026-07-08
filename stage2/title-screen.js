(() => {
  const {
    stageTwoNumber,
    stageTwoTitle,
    stageTwoLogo,
    stageTwoStatus,
    stageTwoTitleBlockerKey,
  } = document.body.dataset;

  function readTitleBlocker(key) {
    if (!key) return false;
    try {
      return localStorage.getItem(key) === "1";
    } catch (_error) {
      return false;
    }
  }

  function writeTitleBlocker(key, blocked = true) {
    if (!key) return false;
    try {
      if (blocked) localStorage.setItem(key, "1");
      else localStorage.removeItem(key);
      return true;
    } catch (_error) {
      return false;
    }
  }

  window.HackuleanStage2Title = Object.freeze({
    isBlocked: () => readTitleBlocker(stageTwoTitleBlockerKey),
    setBlocked: (blocked = true) => writeTitleBlocker(stageTwoTitleBlockerKey, blocked),
    blockerKey: stageTwoTitleBlockerKey || null,
  });

  if (!stageTwoNumber || !stageTwoTitle) return;
  if (readTitleBlocker(stageTwoTitleBlockerKey)) {
    document.body.classList.remove("stage-two-title-pending");
    return;
  }

  const screen = document.createElement("section");
  document.body.classList.add("stage-two-title-open");
  screen.className = "stage-two-title-screen";
  screen.setAttribute("aria-labelledby", "stage-two-puzzle-title");
  screen.innerHTML = `
    <div class="stage-two-title-content">
      <div class="stage-two-title-logo" aria-label="${stageTwoTitle} logo"><span>${stageTwoLogo || stageTwoNumber}</span></div>
      <p class="stage-two-title-eyebrow">HACKULEAN PUZZLES // STAGE 2 // PUZZLE ${stageTwoNumber}</p>
      <h1 id="stage-two-puzzle-title">${stageTwoTitle}</h1>
      <p class="stage-two-title-status">${stageTwoStatus || "PUZZLE NODE READY"}</p>
      <button class="stage-two-title-launch" type="button">LAUNCH PUZZLE</button>
    </div>`;

  document.body.prepend(screen);
  document.body.classList.remove("stage-two-title-pending");
  const launchButton = screen.querySelector(".stage-two-title-launch");
  const launchDelay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 20 : 760;
  launchButton.focus({ preventScroll: true });
  launchButton.addEventListener("click", () => {
    launchButton.disabled = true;
    launchButton.textContent = "INITIALIZING...";
    screen.classList.add("is-launching");
    window.setTimeout(() => {
      screen.remove();
      document.body.classList.remove("stage-two-title-open");
      window.dispatchEvent(new CustomEvent("hackulean:stage-two-launched"));
    }, launchDelay);
  }, { once: true });
})();
