const MP1_P02_KEY = "hackulean_mp1_puzzle_02_unlocked";
const MP1_ACTIVE_KEY = "hackulean_metapuzzle_1_active";
const MP1_READY_KEY = "hackulean_mp1_completion_ready";

window.HACKULEAN_MP1_P02_VARIANT =
  localStorage.getItem(MP1_ACTIVE_KEY) === "1" &&
  localStorage.getItem(MP1_P02_KEY) === "1";

if (window.HACKULEAN_MP1_P02_VARIANT) {
  document.body.className = "mp1-p02";
  document.body.innerHTML = `
    <div id="mp1-grid" class="mp1-grid" aria-hidden="true"></div>
    <div id="mp1-walkers" class="walk-grid" aria-hidden="true"></div>
    <main id="mp1-stage" class="mp1-stage">
      <main id="mp1-loader" class="panel mp1-loader">
        <div class="status-line"><span class="status-dot"></span><span>DATABASE LOADING</span></div>
        <h1>HacKulean Files</h1>
        <p class="lead">Database startup complete.</p>
        <section class="placeholder"><p class="placeholder-label">SYSTEM STARTUP</p><div class="loading-heading"><h2>Loading files...</h2><strong id="mp1-progress-text">0.0%</strong></div><div class="progress-track"><span id="mp1-progress-fill"></span></div><p class="placeholder-copy">Loading database sectors...</p></section>
      </main>
      <section id="mp1-stable" class="panel starter-panel mp1-stable mp1-hidden">
        <div class="ghost-title ghost-02">PAYLOAD INITIALIZED</div>
        <div class="ghost-title ghost-03">DATABASE MANAGEMENT</div>
        <p>RECOVERY PAYLOAD // ELEVATED FILE ACCESS // MONITORING UNKNOWN</p>
        <button id="mp1-run" type="button">Run</button>
      </section>
      <section id="mp1-hybrid" class="mp1-hybrid mp1-hidden">
        <div class="panel world-fragment"><h1>HACK PRETEND UNIVERSE PRIVATE ACCESS TUNNEL</h1><p class="sub">CONNECTION: CROSSWIRED</p><section class="admin-shell"><h2 class="admin-title">ADMIN PRETEND OPTIONS UNLOCKED</h2></section></div>
        <div class="panel management-screen database-fragment"><h1 class="management-title">DATABASE MANAGEMENT</h1><div class="management-status-box"><h2 class="management-label">STATUS</h2><p class="management-status-value">Connected · Elevated Access · Monitoring Unknown</p></div><button class="command-button" disabled>grant root --node all</button></div>
        <div class="panel recovery-screen recovery-fragment"><div class="recovery-badge"><span></span>EMERGENCY ENVIRONMENT</div><p class="recovery-kicker">HACKULEAN FILE SYSTEM // NODE 03</p><h1>Recovery Mode</h1><dl class="recovery-status"><div><dt>NETWORK</dt><dd>CORRUPTED</dd></div></dl></div>
        <p id="hybrid-alert" class="hybrid-alert">INTERFACE COLLISION DETECTED</p>
        <button id="hybrid-exit" class="hybrid-exit mp1-hidden" type="button">EXIT RECOVERY</button>
      </section>
      <section id="mp1-verification" class="mp1-verification mp1-hidden">
        <header class="hud"><div><span class="hud-label">CURSOR INTEGRITY</span><div class="hearts">♥ ♥ ♥</div></div><div class="boss-hud"><span class="hud-label">VERIFICATION SENTINEL</span><div class="boss-track"><span></span></div></div></header>
        <div id="verification-sentinel" class="sentinel"></div>
        <main id="escalation-card" class="card escalation-card">
          <h1>ESCALATION GATEWAY</h1>
          <p>Secondary authorization required for management controls.</p>
          <label>ESCALATION CODE</label><input type="text" disabled value="[verification required]" />
          <button id="start-verification" type="button">START HUMAN VERIFICATION</button>
          <button id="password-hint" type="button">Password Hint</button>
          <p id="glitch-message" class="glitch-message"></p>
        </div>
        <div id="verification-alerts" class="verification-alerts"></div>
        <button id="complete-mp1" class="complete-mp1 mp1-hidden" type="button">COMPLETE PUZZLE</button>
      </section>
    </main>`;

  const grid = document.getElementById("mp1-grid");
  const walkersLayer = document.getElementById("mp1-walkers");
  const loader = document.getElementById("mp1-loader");
  const stable = document.getElementById("mp1-stable");
  const hybrid = document.getElementById("mp1-hybrid");
  const verification = document.getElementById("mp1-verification");
  const progressFill = document.getElementById("mp1-progress-fill");
  const progressText = document.getElementById("mp1-progress-text");
  const runButton = document.getElementById("mp1-run");
  const exitButton = document.getElementById("hybrid-exit");
  const escalationCard = document.getElementById("escalation-card");
  const startVerification = document.getElementById("start-verification");
  const passwordHint = document.getElementById("password-hint");
  const glitchMessage = document.getElementById("glitch-message");
  const alerts = document.getElementById("verification-alerts");
  const completeButton = document.getElementById("complete-mp1");
  let pointer = { x: innerWidth / 2, y: innerHeight / 2 };
  let walkerTimer = 0;
  let projectileTimer = 0;

  addEventListener("pointermove", (event) => { pointer = { x: event.clientX, y: event.clientY }; });

  function buildGrid() {
    const total = Math.ceil(innerWidth / 22) * Math.ceil(innerHeight / 22);
    grid.replaceChildren(...Array.from({ length: total }, () => Object.assign(document.createElement("i"), { className: "mp1-cell" })));
  }

  let walkColumns = 0;
  let walkRows = 0;
  let walkCells = [];
  let walkers = [];

  function walkCellAt(column, row) { return walkCells[row * walkColumns + column]; }

  function renderWalkers() {
    walkCells.forEach((cell) => cell.classList.remove("is-head", "is-trail"));
    walkers.forEach((walker) => walker.trail.forEach(({ column, row }) => walkCellAt(column, row)?.classList.add("is-trail")));
    walkers.forEach((walker) => {
      const head = walkCellAt(walker.column, walker.row);
      head?.classList.add("is-head");
      head?.style.setProperty("--spider-turn", `${walker.turn}deg`);
    });
  }

  function buildWalkerGrid() {
    walkColumns = Math.ceil(innerWidth / 22);
    walkRows = Math.ceil(innerHeight / 22);
    walkersLayer.style.setProperty("--walk-columns", walkColumns);
    walkersLayer.style.setProperty("--walk-rows", walkRows);
    walkersLayer.style.width = `${walkColumns * 22}px`;
    walkersLayer.style.height = `${walkRows * 22}px`;
    walkersLayer.replaceChildren(...Array.from({ length: walkColumns * walkRows }, () => Object.assign(document.createElement("span"), { className: "walk-cell" })));
    walkCells = Array.from(walkersLayer.children);
    walkers = Array.from({ length: 10 }, (_, index) => {
      const regionColumn = index % 5;
      const regionRow = Math.floor(index / 5);
      const minColumn = Math.floor(regionColumn * walkColumns / 5);
      const maxColumn = Math.max(minColumn, Math.floor((regionColumn + 1) * walkColumns / 5) - 1);
      const minRow = Math.floor(regionRow * walkRows / 2);
      const maxRow = Math.max(minRow, Math.floor((regionRow + 1) * walkRows / 2) - 1);
      return { column: minColumn + Math.floor(Math.random() * (maxColumn - minColumn + 1)), row: minRow + Math.floor(Math.random() * (maxRow - minRow + 1)), minColumn, maxColumn, minRow, maxRow, trail: [], turn: 0 };
    });
    renderWalkers();
  }

  function advanceWalkers() {
    const directions = [{ column:1,row:0,turn:0 },{ column:-1,row:0,turn:180 },{ column:0,row:1,turn:90 },{ column:0,row:-1,turn:-90 }];
    walkers.forEach((walker) => {
      const available = directions.filter((direction) => {
        const column = walker.column + direction.column;
        const row = walker.row + direction.row;
        return column >= walker.minColumn && column <= walker.maxColumn && row >= walker.minRow && row <= walker.maxRow;
      });
      const direction = available[Math.floor(Math.random() * available.length)];
      walker.trail.push({ column: walker.column, row: walker.row });
      walker.trail = walker.trail.slice(-12);
      walker.column += direction.column;
      walker.row += direction.row;
      walker.turn = direction.turn;
    });
    renderWalkers();
  }

  function startWalkers() {
    buildWalkerGrid();
    walkerTimer = setInterval(advanceWalkers, 130);
  }

  function spawnJetpack() {
    const jet = document.createElement("i");
    jet.className = "jetpack red wiggle mp1-jetpack";
    jet.style.left = `${Math.random() > .5 ? -30 : innerWidth + 30}px`;
    jet.style.top = `${80 + Math.random() * (innerHeight - 130)}px`;
    verification.appendChild(jet);
    const target = escalationCard.getBoundingClientRect();
    requestAnimationFrame(() => {
      jet.style.left = `${target.left + Math.random() * target.width}px`;
      jet.style.top = `${target.top + Math.random() * target.height}px`;
    });
    setTimeout(() => { escalationCard.classList.add("impact"); setTimeout(() => escalationCard.classList.remove("impact"), 160); jet.remove(); }, 850);
  }

  function spawnProjectile() {
    const shot = document.createElement("i");
    shot.className = "mp1-projectile";
    const originX = Math.random() > .5 ? 0 : innerWidth;
    const originY = Math.random() * innerHeight;
    shot.style.left = `${originX}px`;
    shot.style.top = `${originY}px`;
    verification.appendChild(shot);
    requestAnimationFrame(() => { shot.style.left = `${pointer.x}px`; shot.style.top = `${pointer.y}px`; });
    setTimeout(() => shot.remove(), 700);
  }

  buildGrid();
  let progress = 0;
  const loadingTimer = setInterval(() => {
    progress = Math.min(100, progress + 2.2 + Math.random() * 3.4);
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `${progress.toFixed(1)}%`;
    if (progress < 100) return;
    clearInterval(loadingTimer);
    progressText.textContent = "100.0%";
    document.body.classList.add("screen-crossfade");
    const loadingTitle = loader.querySelector("h2");
    const loadingCopy = loader.querySelector(".placeholder-copy");
    const crosswireTimer = setInterval(() => {
      const showPayload = loadingTitle.textContent === "DATABASE MANAGEMENT";
      loadingTitle.textContent = showPayload ? "PAYLOAD INITIALIZED" : "DATABASE MANAGEMENT";
      loadingCopy.textContent = showPayload
        ? "Click Run to enter database..."
        : "ROOT FILESYSTEM // RECOVERY MANAGEMENT";
    }, 180);
    setTimeout(() => {
      clearInterval(crosswireTimer);
      loader.classList.add("mp1-hidden");
      stable.classList.remove("mp1-hidden");
      document.body.classList.add("stable-hybrid");
    }, 2900);
  }, 90);

  runButton.addEventListener("click", () => {
    stable.classList.add("mp1-hidden");
    hybrid.classList.remove("mp1-hidden");
    grid.classList.add("reveal");
    startWalkers();
    setTimeout(() => {
      hybrid.classList.add("shaking");
      let elapsed = 0;
      const accelerate = setInterval(() => {
        elapsed += 250;
        hybrid.style.setProperty("--shake-speed", `${Math.max(.06, .8 - elapsed / 14000)}s`);
        if (elapsed >= 10000) {
          clearInterval(accelerate);
          exitButton.classList.remove("mp1-hidden");
        }
      }, 250);
    }, 3000);
  });

  exitButton.addEventListener("click", () => {
    hybrid.classList.add("mp1-hidden");
    verification.classList.remove("mp1-hidden");
  });

  passwordHint.addEventListener("click", () => {
    glitchMessage.textContent = "H1NT UNAVAILABLE // JETPACK ARCHIVE MIXED WITH ESCALATION MEMORY";
    escalationCard.classList.add("impact");
  });

  startVerification.addEventListener("click", () => {
    startVerification.disabled = true;
    escalationCard.classList.add("under-attack");
    document.getElementById("verification-sentinel").classList.add("hostile");
    const jetTimer = setInterval(spawnJetpack, 520);
    setTimeout(() => {
      clearInterval(jetTimer);
      document.body.classList.add("filesystem-remounted", "spider-mode");
      alerts.innerHTML = "<b>SECURITY ALERT</b><b>HUMAN VERIFICATION CORRUPTED</b><b>CURSOR TARGETED</b>";
      projectileTimer = setInterval(spawnProjectile, 430);
      setTimeout(() => completeButton.classList.remove("mp1-hidden"), 7000);
    }, 3500);
  });

  completeButton.addEventListener("click", () => {
    clearInterval(projectileTimer);
    localStorage.setItem(MP1_READY_KEY, "1");
    window.location.href = "../mp1checkpoint";
  });
}
