(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const flashes = document.createElement("div");
  flashes.className = "scanline-flashes";
  flashes.setAttribute("aria-hidden", "true");
  document.body.prepend(flashes);

  let flashTimer = 0;
  const runButton = document.getElementById("run-button");
  const loadingScreen = document.getElementById("loading-screen");
  const loadingLines = document.getElementById("loading-lines");
  const viewerIntro = document.getElementById("viewer-intro");
  const introStatus = document.getElementById("intro-status");
  const databaseViewer = document.getElementById("database-viewer");
  const titleWasBlocked = Boolean(window.HackuleanStage2Title?.isBlocked());
  const collectionButtons = Array.from(document.querySelectorAll(".rail-button"));
  const recordList = document.getElementById("record-list");
  const recordCount = document.getElementById("record-count");
  const repairButton = document.getElementById("repair-button");
  const repairAllButton = document.getElementById("repair-all-button");
  const resolveRecordsButton = document.getElementById("resolve-records-button");
  const remountButton = document.getElementById("remount-button");
  const rebootButton = document.getElementById("reboot-button");
  const recalibrateButton = document.getElementById("recalibrate-button");
  const repairError = document.getElementById("repair-error");
  const readOnlyStatus = document.getElementById("read-only-status");
  const inspectorActions = document.getElementById("inspector-actions");
  const filterButton = document.getElementById("filter-button");
  const inspectFragmentsButton = document.getElementById("inspect-fragments-button");
  const fragmentDialog = document.getElementById("fragment-dialog");
  const fragmentDialogClose = document.getElementById("fragment-dialog-close");
  const fragmentDialogTitle = document.getElementById("fragment-dialog-title");
  const fragmentDialogSummary = document.getElementById("fragment-dialog-summary");
  const fragmentVirusAlert = document.getElementById("fragment-virus-alert");
  const fragmentGrid = document.getElementById("fragment-grid");
  const mp2VirusCountDialog = document.getElementById("mp2-virus-count-dialog");
  const mp2VirusCountOutput = document.getElementById("mp2-virus-count");
  const mp2VirusCountPlus = document.getElementById("mp2-virus-count-plus");
  const mp2VirusCountConfirm = document.getElementById("mp2-virus-count-confirm");
  const mp2VirusCountError = document.getElementById("mp2-virus-count-error");
  const remountTerminal = document.getElementById("remount-terminal");
  const remountTerminalState = document.getElementById("remount-terminal-state");
  const remountTerminalOutput = document.getElementById("remount-terminal-output");
  const remountProgressFill = document.getElementById("remount-progress-fill");
  const remountProgressText = document.getElementById("remount-progress-text");
  const quarantineDialog = document.getElementById("quarantine-dialog");
  const quarantineOkButton = document.getElementById("quarantine-ok-button");
  const rebootScreen = document.getElementById("reboot-screen");
  const rebootLog = document.getElementById("reboot-log");
  const recalibrationOverlay = document.getElementById("recalibration-overlay");
  const indexHealthValue = document.getElementById("index-health-value");
  const indexHealthFill = document.getElementById("index-health-fill");
  const viewerHealth = document.getElementById("viewer-health");
  const anomalyCount = document.getElementById("anomaly-count");
  const anomalyBreakdown = document.getElementById("anomaly-breakdown");
  const unsortedTab = document.getElementById("unsorted-tab");
  const resolverGame = document.getElementById("resolver-game");
  const resolverCanvas = document.getElementById("resolver-canvas");
  const resolverTimer = document.getElementById("resolver-timer");
  const resolverScore = document.getElementById("resolver-score");
  const resolverLevelProgressFill = document.getElementById("resolver-level-progress-fill");
  const resolverObjective = document.getElementById("resolver-objective");
  const resolverBriefing = document.getElementById("resolver-briefing");
  const resolverBeginButton = document.getElementById("resolver-begin-button");
  const resolverGameMessage = document.getElementById("resolver-game-message");
  const resolverNotification = document.getElementById("resolver-notification");
  const resolverNotificationRecord = document.getElementById("resolver-notification-record");
  const resolverNotificationFill = document.getElementById("resolver-notification-fill");
  const resolverNotificationStatus = document.getElementById("resolver-notification-status");
  const mp2VirusRunner = document.getElementById("mp2-virus-runner");
  const mp2VirusCanvas = document.getElementById("mp2-virus-canvas");
  const mp2VirusTimer = document.getElementById("mp2-virus-timer");
  const mp2VirusScore = document.getElementById("mp2-virus-score");
  const mp2VirusProgress = document.getElementById("mp2-virus-progress");
  const mp2VirusObjective = document.getElementById("mp2-virus-objective");
  const mp2VirusMessage = document.getElementById("mp2-virus-message");
  const mp2VirusGuide = document.getElementById("mp2-virus-guide");
  const mp2VirusBegin = document.getElementById("mp2-virus-begin");
  const updateScreen = document.getElementById("update-screen");
  const updatePanel = document.getElementById("update-panel");
  const updateButton = document.getElementById("update-button");
  const updateProgress = document.getElementById("update-progress");
  const updateProgressFill = document.getElementById("update-progress-fill");
  const updateProgressText = document.getElementById("update-progress-text");
  const partOneComplete = document.getElementById("part-one-complete");
  const completePuzzleButton = document.getElementById("complete-puzzle-button");
  const mp2VirusComplete = document.getElementById("mp2-virus-complete");
  const activeCollection = document.getElementById("active-collection");
  let randomFlashesStarted = false;
  let mp2VirusCountValue = 0;
  let mp2VirusRebootReady = false;
  try {
    if (
      window.HackuleanMP2State?.isActive()
      && localStorage.getItem("hackulean_mp2_puzzle_05_viruses_cleared") === "1"
    ) {
      mp2VirusRebootReady = true;
      rebootButton.classList.add("mp2-reboot-ready");
      rebootButton.textContent = "Reboot to Complete";
    }
  } catch (_error) {}
  let recordRows = [];
  let currentCollection = "DAMAGED";
  let currentFilterIndex = 0;
  let repairAttempts = 0;
  let startupIsFromReboot = false;
  let updatePendingAfterReboot = false;
  const READ_WRITE_SESSION_KEY = "hackulean_fixcorruption_read_write_session";
  const HEALTH_RECALIBRATED_KEY = "hackulean_fixcorruption_health_recalibrated";
  let isReadWriteSession = false;
  let healthIsRecalibrated = false;
  try {
    isReadWriteSession = localStorage.getItem(READ_WRITE_SESSION_KEY) === "1";
    healthIsRecalibrated = localStorage.getItem(HEALTH_RECALIBRATED_KEY) === "1";
  } catch (_error) {
    // Continue with a temporary session if storage is unavailable.
  }

  if (isReadWriteSession) {
    readOnlyStatus.textContent = "READ-WRITE SESSION";
    readOnlyStatus.classList.add("is-read-write");
  }

  const recordsByCollection = {
    DAMAGED: [
      ["AX-00491", "IDENTITY", 12, "07", "UNKNOWN", "ACTIVE", "03:41:08"],
      ["CX-18104", "ROUTE", 47, "12", "TRANSIT", "BROKEN", "03:38:22"],
      ["QN-77220", "ASSET", 9, "03", "REDACTED", "ACTIVE", "03:22:17"],
      ["MT-00813", "INDEX", 61, "28", "SYSTEM", "PARTIAL", "02:59:44"],
      ["VR-44002", "ACCESS", 18, "09", "ROOT", "SEALED", "02:44:09"],
    ],
    RECOVERED: [
      ["RC-10927", "IDENTITY", 98, "01", "ARCHIVE", "OPEN", "01:18:33"],
      ["LM-66310", "ASSET", 91, "02", "MEDIA", "OPEN", "00:54:17"],
      ["PK-22018", "ROUTE", 87, "04", "TRANSIT", "OPEN", "00:31:49"],
    ],
    QUARANTINE: [
      ["ZX-90001", "PAYLOAD", 6, "31", "UNKNOWN", "ISOLATED", "04:02:11"],
      ["HX-77342", "ACCESS", 15, "18", "EXTERNAL", "ISOLATED", "03:57:06"],
      ["NV-10199", "SCRIPT", 24, "42", "UNKNOWN", "ISOLATED", "03:45:52"],
      ["BT-00804", "MIRROR", 32, "16", "SYSTEM", "ISOLATED", "03:29:15"],
    ],
    UNSORTED: [
      ["UF-33017", "UNKNOWN", 73, "05", "UNASSIGNED", "NONE", "02:17:40"],
      ["UF-33018", "BINARY", 55, "11", "UNASSIGNED", "NONE", "02:17:39"],
      ["UF-33019", "IMAGE", 82, "02", "UNASSIGNED", "NONE", "02:17:38"],
      ["UF-33020", "INDEX", 39, "19", "UNASSIGNED", "NONE", "02:17:37"],
      ["UF-33021", "ROUTE", 68, "08", "UNASSIGNED", "NONE", "02:17:36"],
    ],
  };
  const RECORD_STATE_KEY = "hackulean_fixcorruption_record_collections";
  const recordStateMeta = { quarantineCleared: false };

  function restoreRecordState() {
    try {
      const saved = window.HackuleanMP2State?.isActive()
        ? window.HackuleanMP2State.loadCollections("05")
        : JSON.parse(localStorage.getItem(RECORD_STATE_KEY) || "null");
      if (!saved || typeof saved !== "object") return;
      Object.keys(recordsByCollection).forEach((collection) => {
        const sharedCollection = window.HackuleanMP2State?.isActive() && collection === "RECOVERED"
          ? "NORMAL"
          : collection;
        const records = saved[sharedCollection];
        if (Array.isArray(records) && records.every((record) => Array.isArray(record) && record.length >= 7)) {
          recordsByCollection[collection] = records;
        }
      });
      recordStateMeta.quarantineCleared = saved.__meta?.quarantineCleared === true;
    } catch (_error) {
      // Keep the built-in record set when saved state is unavailable or malformed.
    }
  }

  function saveRecordState() {
    if (window.HackuleanMP2State?.isActive()) {
      window.HackuleanMP2State.saveCollections("05", {
        NORMAL: recordsByCollection.RECOVERED,
        DAMAGED: recordsByCollection.DAMAGED,
        QUARANTINE: recordsByCollection.QUARANTINE,
        UNSORTED: recordsByCollection.UNSORTED,
        __meta: recordStateMeta,
      });
      return;
    }
    try {
      localStorage.setItem(RECORD_STATE_KEY, JSON.stringify({ ...recordsByCollection, __meta: recordStateMeta }));
    } catch (_error) {
      // The current session can continue if storage is unavailable.
    }
  }

  restoreRecordState();
  const ORIGINAL_DAMAGED_IDS = new Set(["AX-00491", "CX-18104", "QN-77220", "MT-00813", "VR-44002"]);
  if (healthIsRecalibrated) {
    indexHealthValue.textContent = "100%";
    indexHealthFill.style.width = "100%";
  }
  recalibrateButton.hidden = !recordStateMeta.quarantineCleared || healthIsRecalibrated;
  if (healthIsRecalibrated && recordsByCollection.UNSORTED.length) unsortedTab.classList.add("is-alerting");
  const collectionMarkers = {
    DAMAGED: ["!", "damaged"],
    RECOVERED: ["✓", "recovered"],
    QUARANTINE: ["×", "quarantine"],
    UNSORTED: ["?", "unsorted"],
    VIRUS: ["!", "virus"],
  };
  const integrityFilters = [
    ["ALL", () => true],
    ["CRITICAL", (integrity) => integrity < 30],
    ["UNSTABLE", (integrity) => integrity >= 30 && integrity < 75],
    ["STABLE", (integrity) => integrity >= 75],
  ];

  const wait = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

  function integrityClass(integrity) {
    if (integrity < 30) return "bad";
    if (integrity < 75) return "warn";
    return "good";
  }

  function selectRecord(row) {
    recordRows.forEach((candidate) => {
      const isSelected = candidate === row;
      candidate.classList.toggle("selected", isSelected);
      candidate.setAttribute("aria-pressed", String(isSelected));
    });
    const { record, type, integrity, fragments, owner, lock } = row.dataset;
    document.getElementById("inspector-glyph").textContent = record.slice(0, 2);
    document.getElementById("inspector-record").textContent = record;
    document.getElementById("inspector-path").textContent = `/${type.toLowerCase()}/archive/${record}.hdb`;
    const inspectorIntegrity = document.getElementById("inspector-integrity");
    inspectorIntegrity.textContent = `${integrity}%`;
    inspectorIntegrity.className = integrityClass(Number(integrity));
    document.getElementById("inspector-fragments").textContent = fragments;
    document.getElementById("inspector-owner").textContent = owner;
    document.getElementById("inspector-lock").textContent = lock;
  }

  function clearInspector() {
    document.getElementById("inspector-glyph").textContent = "--";
    document.getElementById("inspector-record").textContent = "NO MATCH";
    document.getElementById("inspector-path").textContent = "No records match the active filter.";
    const inspectorIntegrity = document.getElementById("inspector-integrity");
    inspectorIntegrity.textContent = "--";
    inspectorIntegrity.className = "";
    document.getElementById("inspector-fragments").textContent = "--";
    document.getElementById("inspector-owner").textContent = "--";
    document.getElementById("inspector-lock").textContent = "--";
  }

  function updateAnomalyCounter() {
    const records = Object.values(recordsByCollection).flat();
    const critical = records.filter((record) => Number(record[2]) < 30).length;
    const unstable = records.filter((record) => Number(record[2]) >= 30 && Number(record[2]) < 75).length;
    anomalyCount.textContent = String(critical + unstable);
    anomalyBreakdown.textContent = `${critical} critical · ${unstable} unstable`;
    viewerHealth.classList.toggle("health-critical", critical > 0);
    viewerHealth.classList.toggle("health-unstable", critical === 0 && unstable > 0);
    viewerHealth.classList.toggle("health-clear", critical === 0 && unstable === 0);
  }

  function partOneIsReady() {
    return healthIsRecalibrated
      && recordStateMeta.quarantineCleared
      && recordsByCollection.DAMAGED.length === 0
      && recordsByCollection.UNSORTED.length === 0;
  }

  function updateFinalRebootState() {
    rebootButton.classList.toggle("update-ready", partOneIsReady());
  }

  function renderCollection(collection) {
    updateAnomalyCounter();
    currentCollection = collection;
    repairError.textContent = "";
    repairError.classList.remove("is-visible");
    readOnlyStatus.classList.remove("is-rejected");
    const allRecords = recordsByCollection[collection];
    const [, filterRecords] = integrityFilters[currentFilterIndex];
    const records = allRecords.filter((record) => filterRecords(record[2]));
    const [marker, markerClass] = collectionMarkers[collection];
    const fragment = document.createDocumentFragment();
    records.forEach(([record, type, integrity, fragments, owner, lock, modified]) => {
      const row = document.createElement("button");
      row.className = "record-row";
      row.type = "button";
      Object.assign(row.dataset, { record, type, integrity, fragments, owner, lock });
      const [rowMarker, rowMarkerClass] = type === "VIRUS" ? collectionMarkers.VIRUS : [marker, markerClass];
      row.innerHTML = `<span><i class="${rowMarkerClass}" aria-hidden="true">${rowMarker}</i> ${record}</span><span>${type}</span><span class="${integrityClass(integrity)}">${integrity}%</span><span>${modified}</span>`;
      row.addEventListener("click", () => selectRecord(row));
      fragment.appendChild(row);
    });
    recordList.replaceChildren(fragment);
    recordRows = Array.from(recordList.children);
    if (!recordRows.length) {
      const empty = document.createElement("p");
      empty.className = "empty-records";
      empty.textContent = "NO RECORDS MATCH THIS FILTER";
      recordList.appendChild(empty);
    }
    recordCount.textContent = `${records.length} OF ${allRecords.length} RECORDS`;
    repairButton.hidden = collection === "RECOVERED";
    const hasRepairedRecord = recordsByCollection.RECOVERED.some((record) => ORIGINAL_DAMAGED_IDS.has(record[0]));
    repairAllButton.hidden = collection !== "DAMAGED" || !isReadWriteSession || !hasRepairedRecord || recordsByCollection.DAMAGED.length === 0;
    resolveRecordsButton.hidden = collection !== "UNSORTED" || !healthIsRecalibrated || recordsByCollection.UNSORTED.length === 0;
    remountButton.hidden = isReadWriteSession || repairAttempts < 3;
    inspectorActions.hidden = !recordRows.length;
    if (recordRows.length) selectRecord(recordRows[0]);
    else clearInspector();
    updateFinalRebootState();
  }

  collectionButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.classList.contains("active"))));

  collectionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      collectionButtons.forEach((candidate) => {
        const isActive = candidate === button;
        candidate.classList.toggle("active", isActive);
        candidate.setAttribute("aria-pressed", String(isActive));
      });
      activeCollection.textContent = button.dataset.collection;
      if (button.dataset.collection === "UNSORTED") button.classList.remove("is-alerting");
      renderCollection(button.dataset.collection);
    });
  });

  filterButton.addEventListener("click", () => {
    currentFilterIndex = (currentFilterIndex + 1) % integrityFilters.length;
    filterButton.textContent = `FILTER: ${integrityFilters[currentFilterIndex][0]}`;
    renderCollection(currentCollection);
  });

  const FRAGMENT_SEED_KEY = "hackulean_fixcorruption_fragment_seed";

  function generateRunSeed() {
    const values = new Uint32Array(2);
    if (window.crypto?.getRandomValues) window.crypto.getRandomValues(values);
    else {
      values[0] = Date.now();
      values[1] = Math.floor(Math.random() * 0xffffffff);
    }
    const seed = Array.from(values, (value) => value.toString(16).padStart(8, "0")).join("");
    if (!window.HackuleanMP2State?.isActive()) {
      try { localStorage.setItem(FRAGMENT_SEED_KEY, seed); } catch (_error) {}
    }
    return seed;
  }

  function getRunSeed() {
    const sharedSeed = window.HackuleanMP2State?.getSeed(generateRunSeed);
    if (sharedSeed) return sharedSeed;
    try {
      return localStorage.getItem(FRAGMENT_SEED_KEY) || generateRunSeed();
    } catch (_error) {
      return generateRunSeed();
    }
  }

  function hashSeed(value) {
    let hash = 2166136261;
    for (const character of value) {
      hash ^= character.charCodeAt(0);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function seededRandom(seed) {
    let state = seed;
    return () => {
      state += 0x6d2b79f5;
      let value = state;
      value = Math.imul(value ^ value >>> 15, value | 1);
      value ^= value + Math.imul(value ^ value >>> 7, value | 61);
      return ((value ^ value >>> 14) >>> 0) / 4294967296;
    };
  }

  function randomHex(length, random) {
    const characters = "0123456789ABCDEF";
    return Array.from({ length }, () => characters[Math.floor(random() * characters.length)]).join("");
  }

  inspectFragmentsButton.addEventListener("click", () => {
    const selectedRecord = recordRows.find((row) => row.classList.contains("selected"));
    if (!selectedRecord) return;

    const { record, type, integrity, fragments, owner, lock } = selectedRecord.dataset;
    const totalFragments = Math.max(1, Number.parseInt(fragments, 10));
    const requestedFragments = Math.min(16, totalFragments);
    const integrityValue = Number.parseInt(integrity, 10);
    const metadataSeed = `${getRunSeed()}|${record}|${type}|${integrity}|${fragments}|${owner}|${lock}`;
    const random = seededRandom(hashSeed(metadataSeed));
    const fragment = document.createDocumentFragment();
    let damagedCount = 0;

    for (let index = 0; index < requestedFragments; index += 1) {
      const valid = random() < integrityValue / 100;
      const faultRoll = random();
      const state = valid ? "VALID" : faultRoll < .5 ? "DAMAGED" : faultRoll < .82 ? "PARTIAL" : "UNKNOWN";
      if (state !== "VALID") damagedCount += 1;
      const block = document.createElement("article");
      block.className = `fragment-block ${state.toLowerCase()}`;
      const missingByteChance = state === "VALID" ? 0 : Math.max(.12, (100 - integrityValue) / 125);
      const bytes = Array.from({ length: 4 }, () => random() < missingByteChance ? "??" : randomHex(2, random)).join(" ");
      block.innerHTML = `<span>FRG-${String(index + 1).padStart(2, "0")}</span><strong>${bytes}</strong><small>0x${randomHex(4, random)} // ${state}</small>`;
      fragment.appendChild(block);
    }

    fragmentDialogTitle.textContent = `${record} fragments`;
    fragmentDialogSummary.textContent = `${requestedFragments}/${totalFragments} sectors mapped // ${damagedCount} irregular // ${type} // ${owner} // ${lock} // capture ${randomHex(8, random)}`;
    fragmentVirusAlert.hidden = !(window.HackuleanMP2State?.isActive() && type === "VIRUS");
    fragmentGrid.replaceChildren(fragment);
    fragmentDialog.showModal();
  });

  fragmentDialogClose.addEventListener("click", () => fragmentDialog.close());
  fragmentDialog.addEventListener("click", (event) => {
    if (event.target === fragmentDialog) fragmentDialog.close();
  });

  let virusAlertClicks = 0;
  fragmentVirusAlert.addEventListener("click", () => {
    if (fragmentVirusAlert.hidden || !window.HackuleanMP2State?.isActive()) return;
    try {
      if (localStorage.getItem("hackulean_mp2_puzzle_05_runner_complete") === "1") {
        fragmentDialog.close();
        mp2VirusCountValue = 0;
        mp2VirusCountOutput.textContent = "0";
        mp2VirusCountError.textContent = "";
        mp2VirusCountDialog.showModal();
        return;
      }
    } catch (_error) {}
    virusAlertClicks += 1;
    fragmentVirusAlert.classList.remove("is-glitching");
    void fragmentVirusAlert.offsetWidth;
    fragmentVirusAlert.classList.add("is-glitching");
    window.setTimeout(() => fragmentVirusAlert.classList.remove("is-glitching"), 130);
    if (virusAlertClicks < 5) return;
    virusAlertClicks = 0;
    fragmentDialog.classList.add("virus-runner-launch");
    window.setTimeout(() => {
      fragmentDialog.close();
      fragmentDialog.classList.remove("virus-runner-launch");
      mp2VirusRunner.classList.remove("hidden");
      mp2VirusGuide.classList.remove("hidden");
      startMp2VirusRunner();
    }, prefersReducedMotion ? 20 : 700);
  });

  mp2VirusCountPlus.addEventListener("click", () => {
    mp2VirusCountValue = (mp2VirusCountValue + 1) % 100;
    mp2VirusCountOutput.textContent = String(mp2VirusCountValue);
    mp2VirusCountError.textContent = "";
  });

  mp2VirusCountConfirm.addEventListener("click", () => {
    const virusCount = Object.values(recordsByCollection).flat().filter((record) => record[1] === "VIRUS").length;
    if (mp2VirusCountValue !== virusCount) {
      mp2VirusCountError.textContent = "COUNT MISMATCH // ENUMERATION REJECTED";
      return;
    }
    mp2VirusCountConfirm.disabled = true;
    mp2VirusCountDialog.close();
    void runMp2VirusCleanup();
  });

  function startMp2VirusRunner() {
    const context = mp2VirusCanvas.getContext("2d");
    const player = { x: 112, y: 0, size: 32, velocityY: 0, grounded: true };
    const levelEnd = 17_200;
    const checkpoints = [
      { x: 1700, kind: "hard" }, { x: 3900, kind: "hard" }, { x: 6100, kind: "green" },
      { x: 8400, kind: "hard" }, { x: 10_900, kind: "green" }, { x: 12_700, kind: "hard" },
      { x: 15_100, kind: "hard" },
    ].map((plus) => ({ ...plus, collected: false }));
    const trollPluses = [2850, 7350, 11_900, 14_350];
    const spikes = [650, 1120, 2200, 3450, 4750, 5700, 7050, 9050, 10_250, 11_350, 12_500, 14_050, 15_550, 15_900]
      .map((x, index) => ({ x, width: x === 5700 || x === 15_550 ? 190 : index % 4 === 2 ? 72 : 38, height: x === 5700 || x === 15_550 ? 50 : 44 }));
    const hardSpikes = [2450, 5100, 6750, 9400, 11_650, 13_750].map((x) => ({ x, width: 105, height: 52 }));
    const trollSpikes = [1500, 4250, 7900, 10_650, 13_500, 16_250].map((x) => ({ x, raised: false }));
    const yellowSpikes = [3200, 8900, 12_850];
    const pits = [{ x: 3650, width: 310 }, { x: 7650, width: 380 }, { x: 11_000, width: 330 }, { x: 14_600, width: 410 }];
    const platforms = [
      { x: 3700, width: 250, elevation: 125 }, { x: 7680, width: 330, elevation: 145 },
      { x: 11_060, width: 250, elevation: 112 }, { x: 14_680, width: 315, elevation: 145 },
    ];
    const pads = [
      { x: 3570, kind: "lift", power: -820, enabled: true, used: false },
      { x: 5640, kind: "vault", power: -1300, enabled: true, used: false },
      { x: 7520, kind: "lift", power: -1050, enabled: false, used: false },
      { x: 10_190, kind: "fault", power: -250, enabled: true, used: false },
      { x: 14_450, kind: "lift", power: -1050, enabled: false, used: false },
      { x: 15_420, kind: "vault", power: -1500, enabled: true, used: false },
    ];
    const doors = [{ x: 4550, open: false }, { x: 9700, open: true }, { x: 13_950, open: false }];
    const buttons = [
      { x: 4100, type: "door", target: 0, used: false },
      { x: 9250, type: "door", target: 1, used: false },
      { x: 13_500, type: "door", target: 2, used: false },
      { x: 7200, type: "pad", target: 2, used: false },
      { x: 13_920, type: "pad", target: 4, used: false },
      { x: 9850, type: "hacker", used: false },
    ];
    const initialPadEnabled = pads.map((pad) => pad.enabled);
    const initialDoorOpen = doors.map((door) => door.open);
    const hackerHazards = [11_750, 12_250, 13_100, 16_450, 16_850];
    let width = 0;
    let height = 0;
    let ground = 0;
    let worldX = 0;
    let checkpointX = 0;
    let previousTime = performance.now();
    let startedAt = previousTime;
    let frameId = 0;
    let running = false;
    let finished = false;
    let hardRoute = false;
    let hackerMode = false;
    let checkpointCount = 0;
    let invulnerableUntil = 0;

    function resize() {
      const ratio = devicePixelRatio || 1;
      width = innerWidth;
      height = innerHeight;
      ground = height - 74;
      mp2VirusCanvas.width = Math.floor(width * ratio);
      mp2VirusCanvas.height = Math.floor(height * ratio);
      mp2VirusCanvas.style.width = `${width}px`;
      mp2VirusCanvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (player.grounded) player.y = ground - player.size;
    }

    function jump(event) {
      if (event?.type === "keydown" && !["Space", "ArrowUp", "KeyW"].includes(event.code)) return;
      if (event?.type === "keydown") event.preventDefault();
      if (running && player.grounded) {
        player.velocityY = -650;
        player.grounded = false;
      }
    }

    function message(text, duration = 600) {
      mp2VirusMessage.textContent = text;
      mp2VirusMessage.classList.remove("hidden");
      window.setTimeout(() => mp2VirusMessage.classList.add("hidden"), duration);
    }

    function respawn(now) {
      worldX = checkpointX;
      player.y = ground - player.size;
      player.velocityY = 0;
      player.grounded = true;
      invulnerableUntil = now + 850;
      pads.forEach((pad, index) => {
        pad.enabled = initialPadEnabled[index];
        pad.used = false;
      });
      doors.forEach((door, index) => { door.open = initialDoorOpen[index]; });
      buttons.forEach((button) => { button.used = false; });
      trollSpikes.forEach((spike) => { spike.raised = false; });
      message("RUN RESTARTED");
    }

    function triangle(x, baseY, widthValue, heightValue, fill, stroke) {
      context.beginPath();
      context.moveTo(x, baseY);
      context.lineTo(x + widthValue / 2, baseY - heightValue);
      context.lineTo(x + widthValue, baseY);
      context.closePath();
      context.fillStyle = fill;
      context.strokeStyle = stroke;
      context.lineWidth = 3;
      context.fill();
      context.stroke();
    }

    function draw(now) {
      context.fillStyle = hackerMode ? "#03110a" : hardRoute ? "#10070b" : "#050711";
      context.fillRect(0, 0, width, height);
      context.fillStyle = "rgba(230,246,255,.035)";
      context.font = `900 ${Math.min(112, width / 7)}px Courier New`;
      context.textAlign = "center";
      context.fillText(`SECTOR ${String(Math.floor(worldX / 3400) + 1).padStart(2, "0")}`, width / 2, height * .42);
      context.strokeStyle = "rgba(81,209,255,.1)";
      for (let x = -(worldX % 40); x < width; x += 40) { context.beginPath(); context.moveTo(x, 0); context.lineTo(x, ground); context.stroke(); }
      for (let y = 0; y < ground; y += 40) { context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke(); }
      context.fillStyle = "#152339";
      context.fillRect(0, ground, width, height - ground);
      context.fillStyle = "#51d1ff";
      context.fillRect(0, ground, width, 3);
      context.fillStyle = "rgba(81,209,255,.32)";
      for (let x = -(worldX % 90); x < width + 90; x += 90) {
        context.beginPath(); context.moveTo(x, ground + 29); context.lineTo(x + 18, ground + 38); context.lineTo(x, ground + 47); context.lineTo(x + 7, ground + 38); context.closePath(); context.fill();
      }

      pits.forEach((pit) => { const x = pit.x - worldX; context.fillStyle = "#020207"; context.fillRect(x, ground - 2, pit.width, height - ground + 2); });
      platforms.forEach((platform) => { const x = platform.x - worldX; const y = ground - platform.elevation; context.fillStyle = "#123b4c"; context.fillRect(x, y, platform.width, 18); context.strokeStyle = "#51d1ff"; context.strokeRect(x, y, platform.width, 18); context.fillStyle = "rgba(81,209,255,.35)"; for (let stripe = 8; stripe < platform.width; stripe += 22) context.fillRect(x + stripe, y + 5, 10, 8); });
      [...spikes, ...(hardRoute ? hardSpikes : [])].forEach((spike) => {
        const x = spike.x - worldX;
        const count = Math.max(1, Math.round(spike.width / 38));
        const spikeWidth = spike.width / count;
        for (let i = 0; i < count; i += 1) triangle(x + i * spikeWidth, ground, spikeWidth, spike.height, "rgba(255, 75, 111, .82)", "#ff4b6f");
      });
      trollSpikes.forEach((spike) => {
        const x = spike.x - worldX;
        const lift = spike.raised ? 88 : 0;
        triangle(x, ground - lift, 42, 62, "rgba(81, 209, 255, .72)", "#51d1ff");
      });
      yellowSpikes.forEach((position) => triangle(position - worldX, ground, 42, 44, "rgba(255, 200, 87, .78)", "#ffc857"));

      pads.forEach((pad) => {
        const x = pad.x - worldX;
        const color = !pad.enabled ? "#3e4650" : pad.kind === "fault" ? "#ff4fc8" : pad.kind === "lift" ? "#51d1ff" : "#ffc857";
        context.fillStyle = color;
        context.shadowColor = color; context.shadowBlur = pad.enabled ? 12 : 0;
        context.beginPath(); context.moveTo(x - 25, ground); context.lineTo(x - 15, ground - 12); context.lineTo(x + 15, ground - 12); context.lineTo(x + 25, ground); context.closePath(); context.fill(); context.shadowBlur = 0;
        context.fillStyle = color;
        context.font = "700 9px Courier New";
        context.textAlign = "center";
        context.fillText(pad.kind.toUpperCase(), x, ground - 17);
      });
      doors.forEach((door) => {
        const x = door.x - worldX;
        context.strokeStyle = door.open ? "#7ef29a" : "#ff4b6f";
        context.fillStyle = door.open ? "rgba(126,242,154,.1)" : "rgba(255,75,111,.58)";
        context.lineWidth = 3;
        context.strokeRect(x, ground - 150, 28, 150);
        if (!door.open) context.fillRect(x + 4, ground - 146, 20, 146);
        context.fillStyle = door.open ? "#7ef29a" : "#ff4b6f";
        context.font = "700 10px Courier New";
        context.textAlign = "center";
        context.fillText(door.open ? "OPEN" : "LOCK", x + 14, ground - 159);
      });
      buttons.forEach((button) => { const x = button.x - worldX; const color = button.type === "hacker" ? "#39ff88" : button.type === "pad" ? "#51d1ff" : "#ffc857"; context.fillStyle = button.used ? "#39424a" : color; context.fillRect(x - 16, ground - 18, 32, 18); context.fillStyle = "#07121f"; context.font = "900 10px Courier New"; context.textAlign = "center"; context.fillText(button.type === "hacker" ? "H" : "■", x, ground - 5); });

      checkpoints.forEach((plus) => {
        if (plus.collected) return;
        const x = plus.x - worldX;
        const centerY = plus.kind === "hard" ? ground - 118 : ground - 52;
        const color = plus.kind === "hard" ? "#ff405f" : "#7ef29a";
        context.save(); context.translate(x, centerY); context.rotate(now / 700); context.fillStyle = color; context.shadowColor = color; context.shadowBlur = 18; context.fillRect(-6, -24, 12, 48); context.fillRect(-24, -6, 48, 12); context.restore();
        context.fillStyle = color; context.font = "700 9px Courier New"; context.textAlign = "center"; context.fillText(plus.kind === "hard" ? "HARD" : "CHECKPOINT", x, centerY - 35);
      });
      trollPluses.forEach((position) => {
        const x = position - worldX;
        const centerY = ground - 118;
        context.save(); context.translate(x, centerY); context.rotate(-now / 620); context.fillStyle = "#3f8cff"; context.shadowColor = "#3f8cff"; context.shadowBlur = 18; context.fillRect(-6, -24, 12, 48); context.fillRect(-24, -6, 48, 12); context.restore();
        context.fillStyle = "#3f8cff"; context.font = "700 9px Courier New"; context.textAlign = "center"; context.fillText("TROLL", x, centerY - 35);
      });
      if (hackerMode) hackerHazards.forEach((position) => { const x = position - worldX; context.fillStyle = now % 260 < 130 ? "#39ff88" : "#0c4b2a"; context.fillRect(x, ground - 62, 18, 62); });

      const portalX = levelEnd - worldX;
      context.strokeStyle = "#7ef29a";
      context.lineWidth = 7;
      context.beginPath(); context.ellipse(portalX, ground - 65, 32, 58, 0, 0, Math.PI * 2); context.stroke();
      context.save();
      context.translate(player.x + player.size / 2, player.y + player.size / 2);
      context.rotate(worldX / 80);
      context.fillStyle = now < invulnerableUntil ? "rgba(230,246,255,.45)" : "#e6f6ff";
      context.fillRect(-player.size / 2, -player.size / 2, player.size, player.size);
      context.strokeStyle = hackerMode ? "#39ff88" : "#51d1ff"; context.strokeRect(-player.size / 2 + 3, -player.size / 2 + 3, player.size - 6, player.size - 6);
      context.restore();
      context.textAlign = "start";
    }

    function overlapsAt(position, widthValue = 38) {
      const playerWorld = worldX + player.x;
      return playerWorld + player.size - 6 > position && playerWorld + 6 < position + widthValue;
    }

    function hitsPlus(position, kind) {
      const playerWorld = worldX + player.x;
      const centerY = kind === "green" ? ground - 52 : ground - 118;
      return playerWorld + player.size > position - 25
        && playerWorld < position + 25
        && player.y + player.size > centerY - 25
        && player.y < centerY + 25;
    }

    function update(now) {
      if (!running || finished) return;
      const delta = Math.min(.034, (now - previousTime) / 1000);
      previousTime = now;
      worldX += 242 * delta;
      player.velocityY += 1850 * delta;
      const previousBottom = player.y + player.size;
      player.y += player.velocityY * delta;
      player.grounded = false;
      const playerWorld = worldX + player.x;
      const foot = playerWorld + player.size / 2;
      const overPit = pits.some((pit) => foot > pit.x && foot < pit.x + pit.width);
      let landed = false;
      if (player.velocityY >= 0) platforms.forEach((platform) => {
        const top = ground - platform.elevation;
        if (!landed && playerWorld + player.size > platform.x && playerWorld < platform.x + platform.width && previousBottom <= top + 4 && player.y + player.size >= top) {
          player.y = top - player.size; player.velocityY = 0; player.grounded = true; landed = true;
        }
      });
      if (!landed && !overPit && player.y + player.size >= ground) { player.y = ground - player.size; player.velocityY = 0; player.grounded = true; }
      if (player.y > height + 60) { respawn(now); draw(now); frameId = requestAnimationFrame(update); return; }

      pads.forEach((pad) => { if (pad.enabled && !pad.used && Math.abs(playerWorld - pad.x) < 30 && player.y + player.size >= ground - 4) { pad.used = true; player.velocityY = pad.power; player.grounded = false; } });
      buttons.forEach((button) => { if (button.used || !overlapsAt(button.x, 32) || player.y + player.size < ground - 25) return; button.used = true; if (button.type === "door") doors[button.target].open = !doors[button.target].open; if (button.type === "pad") pads[button.target].enabled = !pads[button.target].enabled; if (button.type === "hacker") hackerMode = true; });
      trollSpikes.forEach((spike) => { if (playerWorld > spike.x - 170) spike.raised = true; });
      yellowSpikes.forEach((position) => {
        if (
          overlapsAt(position + 7, 28)
          && player.y + player.size > ground - 35
          && player.y < ground
        ) hardRoute = true;
      });

      let died = false;
      if (now >= invulnerableUntil) {
        const activeSpikes = [...spikes, ...(hardRoute ? hardSpikes : [])];
        died = activeSpikes.some((spike) => overlapsAt(spike.x, spike.width) && player.y + player.size > ground - spike.height + 8);
        died ||= trollSpikes.some((spike) => spike.raised
          && overlapsAt(spike.x + 8, 26)
          && player.y + player.size > ground - 150
          && player.y < ground - 88);
        died ||= trollPluses.some((position) => hitsPlus(position, "troll"));
        died ||= doors.some((door) => !door.open && overlapsAt(door.x, 22));
        died ||= hackerMode && hackerHazards.some((position) => overlapsAt(position, 18) && player.y + player.size > ground - 62);
      }
      if (died) { respawn(now); draw(now); frameId = requestAnimationFrame(update); return; }

      checkpoints.forEach((plus) => {
        if (plus.collected || !hitsPlus(plus.x, plus.kind)) return;
        plus.collected = true;
        checkpointCount += 1;
        checkpointX = Math.max(0, plus.x - player.x + 60);
        if (plus.kind === "hard") hardRoute = true;
        mp2VirusScore.textContent = String(checkpointCount);
      });
      const elapsed = Math.floor((now - startedAt) / 1000);
      mp2VirusTimer.textContent = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;
      mp2VirusProgress.style.width = `${Math.min(100, playerWorld / levelEnd * 100)}%`;
      mp2VirusObjective.textContent = hackerMode ? "HACKER FEATURES ACTIVE // REACH PORTAL" : hardRoute ? "HARD ROUTE ACTIVE // REACH PORTAL" : "REACH THE EXIT PORTAL";
      if (playerWorld >= levelEnd) {
        finished = true; running = false; cancelAnimationFrame(frameId);
        try { localStorage.setItem("hackulean_mp2_puzzle_05_runner_complete", "1"); } catch (_error) {}
        message("RUN COMPLETE", 900);
        window.setTimeout(() => mp2VirusRunner.classList.add("hidden"), 950);
        window.removeEventListener("keydown", jump);
        window.removeEventListener("resize", resize);
        mp2VirusCanvas.removeEventListener("pointerdown", jump);
        return;
      }
      draw(now);
      frameId = requestAnimationFrame(update);
    }

    resize();
    worldX = 0;
    checkpointX = 0;
    checkpointCount = 0;
    hardRoute = false;
    hackerMode = false;
    mp2VirusTimer.textContent = "00:00";
    mp2VirusScore.textContent = "0";
    mp2VirusProgress.style.width = "0";
    draw(performance.now());
    mp2VirusBegin.onclick = () => {
      mp2VirusBegin.onclick = null;
      mp2VirusGuide.classList.add("hidden");
      previousTime = performance.now();
      startedAt = previousTime;
      running = true;
      window.addEventListener("keydown", jump);
      window.addEventListener("resize", resize);
      mp2VirusCanvas.addEventListener("pointerdown", jump);
      frameId = requestAnimationFrame(update);
    };
  }

  repairButton.addEventListener("click", async () => {
    const collectionError = currentCollection === "QUARANTINE"
      ? "ERROR // REPAIR BLOCKED // RECORD ISOLATED BY QUARANTINE"
      : currentCollection === "UNSORTED"
        ? "ERROR // REPAIR BLOCKED // RECORD TYPE IS UNRESOLVED"
        : "";
    if (collectionError) {
      repairError.textContent = collectionError;
      repairError.classList.remove("is-visible");
      void repairError.offsetWidth;
      repairError.classList.add("is-visible");
      return;
    }
    if (isReadWriteSession) {
      repairError.textContent = "";
      repairError.classList.remove("is-visible");
      await repairSelectedRecord();
      return;
    }
    repairAttempts += 1;
    repairError.textContent = "ERROR // WRITE ACCESS DENIED // SESSION IS READ-ONLY";
    readOnlyStatus.classList.remove("is-rejected");
    repairError.classList.remove("is-visible");
    void readOnlyStatus.offsetWidth;
    readOnlyStatus.classList.add("is-rejected");
    repairError.classList.add("is-visible");
    if (repairAttempts >= 3) {
      repairError.textContent = "ERROR // WRITE ACCESS DENIED // REMOUNT OPTION AVAILABLE";
      if (remountButton.hidden) {
        remountButton.hidden = false;
        remountButton.classList.add("is-revealed");
      }
    }
  });

  function appendTerminalLine(text, type) {
    const line = document.createElement("span");
    line.className = `remount-terminal-line ${type}`;
    line.textContent = text;
    remountTerminalOutput.appendChild(line);
    remountTerminalOutput.scrollTop = remountTerminalOutput.scrollHeight;
    return line;
  }

  async function typeTerminalCommand(command) {
    const line = appendTerminalLine("$ ", "command");
    for (const character of command) {
      line.textContent += character;
      remountTerminalOutput.scrollTop = remountTerminalOutput.scrollHeight;
      await wait(58);
    }
  }

  const remountOperations = [
      {
        command: "mount -o remount,rw /archive/database",
        output: ["checking archive journal...", "write lock detected on /dev/hkdb0", "negotiating temporary mount token..."],
      },
      {
        command: "dbviewer-index --verify --repair-map",
        output: ["18 anomaly headers indexed", "fragment allocation map loaded", "repair map staged in volatile memory"],
      },
      {
        command: "sessionctl --elevate write-channel",
        output: ["requesting local write channel", "session permissions synchronized", "archive remounted read/write"],
      },
    ];

  async function runTerminalCommands(operations) {
    for (const operation of operations) {
      await typeTerminalCommand(operation.command);
      for (const output of operation.output) {
        await wait(350);
        appendTerminalLine(output, "output");
      }
    }
  }

  async function runTerminalProgress(duration) {
    const stepDuration = duration / 100;
    for (let progress = 1; progress <= 100; progress += 1) {
      await wait(stepDuration);
      remountProgressFill.style.width = `${progress}%`;
      remountProgressText.textContent = `${progress}%`;
    }
  }

  async function runTerminalSession(operations, completionMessage) {
    remountTerminalOutput.replaceChildren();
    remountProgressFill.style.width = "0";
    remountProgressText.textContent = "0%";
    remountTerminalState.textContent = "RUNNING";
    remountTerminal.classList.remove("hidden", "is-closing");

    const operationDuration = operations.reduce(
      (total, operation) => total + operation.command.length * 58 + operation.output.length * 350,
      0,
    );
    await Promise.all([runTerminalCommands(operations), runTerminalProgress(operationDuration)]);
    appendTerminalLine(completionMessage, "command");
    remountTerminalState.textContent = "COMPLETE";
    await wait(800);
    remountTerminal.classList.add("is-closing");
    await wait(prefersReducedMotion ? 20 : 400);
    remountTerminal.classList.add("hidden");
    remountTerminal.classList.remove("is-closing");
  }

  async function runMp2VirusCleanup() {
    databaseViewer.classList.add("operation-active");
    await runTerminalSession(remountOperations, "REMOUNT COMPLETE // archive is read-write");
    isReadWriteSession = true;
    try { localStorage.setItem(READ_WRITE_SESSION_KEY, "1"); } catch (_error) {}
    readOnlyStatus.textContent = "READ-WRITE SESSION";
    readOnlyStatus.classList.add("is-read-write");

    const clearVirusOperations = [
      {
        command: "dbviewer virus-scan --collection normal --enumerate",
        output: ["loading infected record map...", "virus signatures matched", "cleanup manifest generated"],
      },
      {
        command: "dbviewer cleanse-virus --restore-integrity --all",
        output: ["removing hostile payload bodies...", "reconstructing normalized record headers", "integrity values restored"],
      },
      {
        command: "dbviewer-index --commit --verify",
        output: ["writing clean collection index", "shared record map synchronized", "no virus signatures detected"],
      },
    ];
    await runTerminalSession(clearVirusOperations, "VIRUS CLEANUP COMPLETE // closing local TTY");

    const recoveredTypes = ["USER", "ROUTE", "ASSET", "INDEX", "SESSION", "MEDIA", "AUDIT"];
    let recoveredIndex = 0;
    Object.keys(recordsByCollection).forEach((collection) => {
      recordsByCollection[collection] = recordsByCollection[collection].map((record) => {
        if (record[1] !== "VIRUS") return record;
        const cleanRecord = [...record];
        cleanRecord[0] = cleanRecord[0].replace(/^VX-/, "NM-");
        cleanRecord[1] = recoveredTypes[recoveredIndex % recoveredTypes.length];
        cleanRecord[2] = 85 + Math.floor(Math.random() * 16);
        cleanRecord[3] = String(1 + recoveredIndex % 5).padStart(2, "0");
        cleanRecord[4] = "SYSTEM";
        cleanRecord[5] = "OPEN";
        cleanRecord[6] = "JUST NOW";
        recoveredIndex += 1;
        return cleanRecord;
      });
    });
    saveRecordState();
    renderCollection(currentCollection);
    databaseViewer.classList.remove("operation-active");
    mp2VirusRebootReady = true;
    mp2VirusCountConfirm.disabled = false;
    rebootButton.classList.add("update-ready", "mp2-reboot-ready");
    rebootButton.textContent = "Reboot to Complete";
    try { localStorage.setItem("hackulean_mp2_puzzle_05_viruses_cleared", "1"); } catch (_error) {}
  }

  async function repairSelectedRecord() {
    const selectedRow = recordRows.find((row) => row.classList.contains("selected"));
    if (!selectedRow) return;

    const collection = currentCollection;
    const recordId = selectedRow.dataset.record;
    const repairOperations = [
      {
        command: `dbrepair --record ${recordId} --rebuild-fragments`,
        output: ["loading deterministic fragment map...", "recoverable sectors identified", "rebuilding damaged allocation chain..."],
      },
      {
        command: `dbrepair --record ${recordId} --verify-integrity`,
        output: ["validating reconstructed payload...", "owner and lock metadata reconciled", "integrity threshold satisfied"],
      },
      {
        command: `dbviewer move ${recordId} --collection recovered`,
        output: ["staging repaired record", "updating collection index", "record ready for migration"],
      },
    ];

    repairButton.disabled = true;
    databaseViewer.classList.add("operation-active");
    await runTerminalSession(repairOperations, "REPAIR COMPLETE // closing local TTY");

    const targetIntegrity = 85 + Math.floor(Math.random() * 16);
    const integrityCell = selectedRow.children[2];
    let integrity = Number.parseInt(selectedRow.dataset.integrity, 10);
    integrityCell.className = "good";
    while (integrity < targetIntegrity) {
      await wait(50);
      integrity += 1;
      selectedRow.dataset.integrity = String(integrity);
      integrityCell.textContent = `${integrity}%`;
      document.getElementById("inspector-integrity").textContent = `${integrity}%`;
      document.getElementById("inspector-integrity").className = "good";
    }

    selectedRow.classList.add("repair-complete");
    await wait(1000);
    selectedRow.classList.remove("repair-complete");
    selectedRow.replaceChildren();
    const movedMessage = document.createElement("span");
    movedMessage.className = "moved-to-recovered";
    movedMessage.textContent = "Moved to Recovered";
    selectedRow.appendChild(movedMessage);
    selectedRow.classList.add("is-transfer-message", "is-moving-to-recovered");
    await wait(3000);

    const sourceRecords = recordsByCollection[collection];
    const sourceIndex = sourceRecords.findIndex((record) => record[0] === recordId);
    if (sourceIndex >= 0) {
      const [repairedRecord] = sourceRecords.splice(sourceIndex, 1);
      repairedRecord[2] = targetIntegrity;
      repairedRecord[5] = "OPEN";
      repairedRecord[6] = "JUST NOW";
      recordsByCollection.RECOVERED.unshift(repairedRecord);
      saveRecordState();
    }

    databaseViewer.classList.remove("operation-active");
    repairButton.disabled = false;
    renderCollection(collection);
    maybePromptQuarantineClear();
  }

  function maybePromptQuarantineClear() {
    if (recordsByCollection.DAMAGED.length || recordStateMeta.quarantineCleared || !recordsByCollection.QUARANTINE.length) return;
    window.setTimeout(() => {
      if (!quarantineDialog.open) quarantineDialog.showModal();
    }, 350);
  }

  repairAllButton.addEventListener("click", async () => {
    if (!isReadWriteSession || !recordsByCollection.DAMAGED.length) return;
    const total = recordsByCollection.DAMAGED.length;
    repairAllButton.disabled = true;
    databaseViewer.classList.add("operation-active");
    const operations = [
      {
        command: `dbrepair --collection damaged --batch ${total}`,
        output: ["building batch fragment map...", `${total} damaged records queued`, "parallel repair workers started..."],
      },
      {
        command: "dbrepair --batch --verify-integrity --minimum 85",
        output: ["reconstructing allocation chains", "validating repaired payloads", "all records exceed recovery threshold"],
      },
      {
        command: "dbviewer move --all-repaired --collection recovered",
        output: ["updating recovered collection", "removing damaged index entries", "batch migration complete"],
      },
    ];
    await runTerminalSession(operations, "BATCH REPAIR COMPLETE // closing local TTY");

    const repaired = recordsByCollection.DAMAGED.splice(0);
    repaired.forEach((record) => {
      record[2] = 85 + Math.floor(Math.random() * 16);
      record[5] = "OPEN";
      record[6] = "JUST NOW";
    });
    recordsByCollection.RECOVERED.unshift(...repaired);
    saveRecordState();
    databaseViewer.classList.remove("operation-active");
    repairAllButton.disabled = false;
    renderCollection("DAMAGED");
    maybePromptQuarantineClear();
  });

  quarantineOkButton.addEventListener("click", async () => {
    quarantineOkButton.disabled = true;
    quarantineDialog.close();
    const operations = [
      {
        command: "quarantinectl scan --confirm-malicious",
        output: ["malicious payload signatures confirmed", "virus containers remain isolated", "deletion manifest generated"],
      },
      {
        command: "quarantinectl purge --all --secure",
        output: ["revoking quarantined execution tokens", "overwriting isolated payload sectors", "quarantine collection cleared"],
      },
    ];
    await runTerminalSession(operations, "QUARANTINE PURGE COMPLETE // closing local TTY");
    recordsByCollection.QUARANTINE.splice(0);
    recordStateMeta.quarantineCleared = true;
    saveRecordState();
    updateAnomalyCounter();
    recalibrateButton.hidden = healthIsRecalibrated;
    quarantineOkButton.disabled = false;
    if (currentCollection === "QUARANTINE") renderCollection("QUARANTINE");
  });
  quarantineDialog.addEventListener("cancel", (event) => event.preventDefault());

  const rebootLines = [
    "[    0.000000] Linux version 6.8.7-hackulean (root@viewer05) #1 SMP PREEMPT_DYNAMIC",
    "[    0.000013] Command line: BOOT_IMAGE=/boot/vmlinuz root=/dev/mapper/archive rw",
    "[    0.084110] BIOS-provided physical RAM map loaded",
    "[    0.227904] Memory: 4021184K/4194304K available",
    "[    0.516882] smpboot: Allowing 4 CPUs, 0 hotplug CPUs",
    "[    0.793241] devtmpfs: initialized",
    "[    1.105630] NET: Registered PF_NETLINK/PF_ROUTE protocol family",
    "[    1.481992] nvme nvme0: 16/0/0 default/read/poll queues",
    "[    1.846720] EXT4-fs (dm-0): recovery complete",
    "[    2.190443] EXT4-fs (dm-0): mounted filesystem read-write",
    "[    2.477100] systemd[1]: Detected architecture x86-64.",
    "[    2.803761] systemd[1]: Hostname set to archive-viewer-05.",
    "[    3.184205] systemd[1]: Reached target Local File Systems.",
    "[    3.519004] systemd[1]: Starting Database Viewer Service...",
    "[    3.880127] dbviewer[508]: loading record collection state",
    "[    4.203771] dbviewer[508]: validating fragment seed",
    "[    4.570016] dbviewer[508]: restoring session permissions",
    "[    4.934522] systemd[1]: Started Database Viewer Service.",
    "[    5.221840] systemd[1]: Reached target Multi-User System.",
    "[    5.519300] Reboot complete. Returning control to startup loader...",
  ];

  rebootButton.addEventListener("click", async () => {
    let virusCleanupComplete = mp2VirusRebootReady;
    try { virusCleanupComplete ||= localStorage.getItem("hackulean_mp2_puzzle_05_viruses_cleared") === "1"; } catch (_error) {}
    if (window.HackuleanMP2State?.isActive() && virusCleanupComplete) {
      rebootButton.disabled = true;
      databaseViewer.classList.add("mp2-completion-collapse");
      await wait(prefersReducedMotion ? 20 : 700);
      databaseViewer.classList.add("hidden");
      mp2VirusComplete.classList.remove("hidden");
      return;
    }
    const updateAvailable = partOneIsReady();
    rebootButton.disabled = true;
    window.clearTimeout(flashTimer);
    randomFlashesStarted = false;
    rebootLog.textContent = "";
    rebootScreen.classList.remove("hidden");
    document.body.classList.add("is-rebooting");
    const lines = updateAvailable
      ? [...rebootLines.slice(0, -1), "[    5.401220] dbviewer-update[611]: NEW UPDATE AVAILABLE", "[    5.519300] Reboot complete. Update service awaiting confirmation..."]
      : rebootLines;
    for (const line of lines) {
      const output = document.createElement("span");
      output.textContent = `${line}\n`;
      rebootLog.appendChild(output);
      rebootLog.scrollTop = rebootLog.scrollHeight;
      await wait(85);
    }
    await wait(650);
    rebootScreen.classList.add("hidden");
    document.body.classList.remove("is-rebooting");
    updatePendingAfterReboot = updateAvailable;
    introStatus.classList.toggle("update-available", updateAvailable);
    introStatus.querySelector("strong").textContent = updateAvailable ? "UPDATE AVAILABLE" : "CORRUPTED DATA FOUND";
    startupIsFromReboot = true;
    await runLoadingSequence();
    rebootButton.disabled = false;
  });

  updateButton.addEventListener("click", async () => {
    updateButton.disabled = true;
    updatePanel.classList.add("is-installing");
    updateProgress.classList.remove("hidden");
    updateProgressText.classList.remove("hidden");
    const transitionPercentage = 45 + Math.floor(Math.random() * 11);
    const blurStart = transitionPercentage - 20;
    for (let progress = 1; progress <= transitionPercentage; progress += 1) {
      await wait(70);
      updateProgressFill.style.width = `${progress}%`;
      updateProgressText.textContent = `${progress}%`;
      if (progress === blurStart) updatePanel.classList.add("is-blurring");
    }
    await wait(250);
    updatePanel.classList.add("hidden");
    partOneComplete.classList.remove("hidden");
  });

  completePuzzleButton.addEventListener("click", () => {
    try {
      const puzzleKeys = [];
      for (let index = 0; index < localStorage.length; index += 1) {
        const key = localStorage.key(index);
        if (key?.startsWith("hackulean_fixcorruption_")) puzzleKeys.push(key);
      }
      puzzleKeys.forEach((key) => localStorage.removeItem(key));
    } catch (_error) {
      // Continue to Puzzle Root if storage is unavailable.
    }
  });

  recalibrateButton.addEventListener("click", async () => {
    if (healthIsRecalibrated) return;
    const buttons = Array.from(databaseViewer.querySelectorAll("button"));
    const disabledStates = buttons.map((button) => button.disabled);
    buttons.forEach((button) => { button.disabled = true; });
    databaseViewer.classList.add("is-recalibrating");
    recalibrationOverlay.classList.remove("hidden");

    let health = Number.parseInt(indexHealthValue.textContent, 10) || 62;
    while (health < 100) {
      await wait(200);
      health += 1;
      indexHealthValue.textContent = `${health}%`;
      indexHealthFill.style.width = `${health}%`;
      databaseViewer.style.setProperty("--glitch-speed", `${Math.max(55, 420 - health * 3.5)}ms`);
      databaseViewer.style.setProperty("--glitch-shift", `${Math.max(1, Math.round((health - 55) / 7))}px`);
      recalibrationOverlay.style.setProperty("--glitch-shift", `${Math.max(2, Math.round((health - 50) / 6))}px`);
    }

    healthIsRecalibrated = true;
    try { localStorage.setItem(HEALTH_RECALIBRATED_KEY, "1"); } catch (_error) {}
    await wait(350);
    recalibrationOverlay.classList.add("hidden");
    databaseViewer.classList.remove("is-recalibrating");
    databaseViewer.style.removeProperty("--glitch-speed");
    databaseViewer.style.removeProperty("--glitch-shift");
    recalibrationOverlay.style.removeProperty("--glitch-shift");
    buttons.forEach((button, index) => { button.disabled = disabledStates[index]; });
    recalibrateButton.hidden = true;
    if (recordsByCollection.UNSORTED.length) unsortedTab.classList.add("is-alerting");
  });

  async function resolveUnsortedRecord(sourceRecord, stagedRecords) {
    const record = sourceRecord ? [...sourceRecord] : null;
    if (!record) return;
    const startingIntegrity = Number(record[2]);
    const targetIntegrity = 85 + Math.floor(Math.random() * 16);
    resolverNotificationRecord.textContent = `${record[0]} // ${record[1]}`;
    resolverNotificationStatus.textContent = `${startingIntegrity}% // RESOLVING`;
    resolverNotificationFill.style.width = `${startingIntegrity}%`;
    resolverNotification.classList.remove("hidden");

    for (let integrity = startingIntegrity + 1; integrity <= targetIntegrity; integrity += 1) {
      await wait(35);
      resolverNotificationFill.style.width = `${integrity}%`;
      resolverNotificationStatus.textContent = `${integrity}% // RESOLVING`;
    }

    record[2] = targetIntegrity;
    record[4] = record[4] === "UNASSIGNED" ? "RESOLVED" : record[4];
    record[5] = "OPEN";
    record[6] = "JUST NOW";
    stagedRecords.push(record);
    resolverNotificationStatus.textContent = `${targetIntegrity}% // RESOLVED // TRANSFER QUEUED`;
    await wait(900);
    resolverNotification.classList.add("hidden");
  }

  resolveRecordsButton.addEventListener("click", () => {
    if (!healthIsRecalibrated || !recordsByCollection.UNSORTED.length) return;
    const context = resolverCanvas.getContext("2d");
    const player = { x: 120, y: 0, size: 34, velocityY: 0, grounded: true };
    const plusCount = Math.min(5, recordsByCollection.UNSORTED.length);
    const runRecords = recordsByCollection.UNSORTED.slice(0, plusCount);
    const stagedResolvedRecords = [];
    const pluses = Array.from({ length: plusCount }, (_, index) => ({ x: 3000 + index * 5500, collected: false }));
    const spikes = [];
    const platforms = [];
    const deathPits = [];
    const jumpPads = [];
    pluses.forEach((plus, segment) => {
      const segmentStart = segment ? pluses[segment - 1].x + 300 : 0;
      const segmentLength = plus.x - segmentStart;
      [.12, .23, .49, .82, .93].forEach((position, index) => {
        spikes.push({
          x: segmentStart + segmentLength * position,
          width: (index + segment) % 3 === 1 ? 68 : 38,
          height: 42 + (index + segment) % 2 * 8,
        });
      });
      const segmentPlatforms = [
        { x: segmentStart + segmentLength * .34, width: 180, elevation: 125 },
        { x: segmentStart + segmentLength * .68, width: 150, elevation: 96 },
      ];
      platforms.push(...segmentPlatforms);
      segmentPlatforms.forEach((platform, platformIndex) => {
        // Leave solid ground immediately after each platform. Pit collision uses
        // the cube's footing point below, so stepping off lands instead of
        // becoming an irreversible fall while part of the cube overlaps the pit.
        const pit = { x: platform.x - 70, width: platform.width + 70 };
        deathPits.push(pit);
        if (platformIndex === 0) {
          jumpPads.push({ x: pit.x - 45, triggered: false, kind: "lift", power: -800, label: "LIFT" });
        }
      });
      const vaultSpike = spikes.at(-3);
      const faultSpike = spikes.at(-2);
      vaultSpike.width = 200;
      vaultSpike.height = 50;
      vaultSpike.count = 5;
      // FAULT sections must remain a single, normally jumpable hazard even in
      // sectors whose procedural width pattern would otherwise create 68px spikes.
      faultSpike.width = 38;
      jumpPads.push(
        { x: vaultSpike.x - 60, triggered: false, kind: "vault", power: -1220, label: "VAULT" },
        // Keep the trap and spike compact enough to clear together with a
        // normal jump; landing on the FAULT pad is still the dangerous route.
        { x: faultSpike.x - 28, triggered: false, kind: "fault", power: -430, label: "FAULT" },
      );
    });
    const portalX = pluses.at(-1).x + 1700;
    const particles = [];
    let width = 0;
    let height = 0;
    let ground = 0;
    let worldX = 0;
    let checkpointWorldX = 0;
    let collected = 0;
    let animationFrame = 0;
    let previousTime = performance.now();
    let startedAt = previousTime;
    let invulnerableUntil = 0;
    let collisionFlashUntil = 0;
    let finished = false;
    let particleClock = 0;
    let fallingIntoPit = false;

    function resizeGame() {
      const ratio = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      ground = height - 78;
      resolverCanvas.width = Math.floor(width * ratio);
      resolverCanvas.height = Math.floor(height * ratio);
      resolverCanvas.style.width = `${width}px`;
      resolverCanvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (player.grounded) player.y = ground - player.size;
    }

    function jump(event) {
      if (event?.type === "keydown" && !["Space", "ArrowUp", "KeyW"].includes(event.code)) return;
      if (event?.type === "keydown") event.preventDefault();
      if (player.grounded && !finished) {
        player.velocityY = -650;
        player.grounded = false;
      }
    }

    function showGameMessage(message) {
      resolverGameMessage.textContent = message;
      resolverGameMessage.classList.remove("hidden");
      window.setTimeout(() => resolverGameMessage.classList.add("hidden"), 520);
    }

    function respawn(now) {
      worldX = checkpointWorldX;
      player.y = ground - player.size;
      player.velocityY = 0;
      player.grounded = true;
      fallingIntoPit = false;
      invulnerableUntil = now + 900;
      collisionFlashUntil = now + 260;
      const checkpointPlayerX = checkpointWorldX + player.x;
      jumpPads.forEach((pad) => { if (pad.x > checkpointPlayerX) pad.triggered = false; });
      showGameMessage("RUN RESTARTED");
    }

    async function exitGame(message) {
      if (finished) return;
      finished = true;
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("keydown", jump);
      window.removeEventListener("resize", resizeGame);
      resolverCanvas.removeEventListener("pointerdown", jump);
      if (message === "RESOLUTION COMPLETE" && stagedResolvedRecords.length === plusCount) {
        const resolvedIds = new Set(stagedResolvedRecords.map((record) => record[0]));
        recordsByCollection.UNSORTED = recordsByCollection.UNSORTED.filter((record) => !resolvedIds.has(record[0]));
        recordsByCollection.RECOVERED.unshift(...stagedResolvedRecords);
        saveRecordState();
        updateAnomalyCounter();
      }
      resolverGameMessage.textContent = message;
      resolverGameMessage.classList.remove("hidden");
      await wait(850);
      resolverGame.classList.add("is-exiting");
      await wait(prefersReducedMotion ? 20 : 650);
      resolverGame.classList.add("hidden");
      resolverGame.classList.remove("is-exiting");
      resolverGameMessage.classList.add("hidden");
      resolverNotification.classList.add("hidden");
      document.body.classList.remove("resolver-active");
      renderCollection("UNSORTED");
    }

    function hitsSpike(left, top, size, spike) {
      return left + 7 < spike.x + spike.width - 5
        && left + size - 7 > spike.x + 5
        && top + size > ground - spike.height + 8;
    }

    function drawScene(now) {
      context.clearRect(0, 0, width, height);
      const zoneColors = ["#050711", "#090717", "#041016", "#10070f", "#07110c"];
      const zone = Math.min(zoneColors.length - 1, Math.floor(worldX / 4800));
      context.fillStyle = zoneColors[zone];
      context.fillRect(0, 0, width, height);
      context.fillStyle = "rgba(230,246,255,.035)";
      context.font = `900 ${Math.min(120, width / 7)}px Courier New`;
      context.textAlign = "center";
      context.fillText(`SECTOR ${String(zone + 1).padStart(2, "0")}`, width / 2, height * .42);
      context.textAlign = "start";
      context.strokeStyle = "rgba(120,217,255,.09)";
      context.lineWidth = 1;
      const gridOffset = -(worldX * .3 % 40);
      for (let x = gridOffset; x < width; x += 40) { context.beginPath(); context.moveTo(x, 0); context.lineTo(x, ground); context.stroke(); }
      for (let y = ground % 40; y < ground; y += 40) { context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke(); }
      context.fillStyle = "#16243a";
      context.fillRect(0, ground, width, height - ground);
      context.fillStyle = "#78d9ff";
      context.fillRect(0, ground, width, 3);
      context.fillStyle = "rgba(120,217,255,.38)";
      const arrowOffset = -(worldX % 90);
      for (let x = arrowOffset; x < width + 90; x += 90) {
        context.beginPath();
        context.moveTo(x, ground + 28);
        context.lineTo(x + 18, ground + 38);
        context.lineTo(x, ground + 48);
        context.lineTo(x + 7, ground + 38);
        context.closePath();
        context.fill();
      }

      deathPits.forEach((pit) => {
        const x = pit.x - worldX;
        if (x < -pit.width - 40 || x > width + 40) return;
        const pitGradient = context.createLinearGradient(0, ground, 0, height);
        pitGradient.addColorStop(0, "#ff2647");
        pitGradient.addColorStop(.12, "#350713");
        pitGradient.addColorStop(1, "#020306");
        context.fillStyle = pitGradient;
        context.fillRect(x, ground - 1, pit.width, height - ground + 1);
        context.fillStyle = "#ff536d";
        context.fillRect(x, ground - 2, pit.width, 3);
      });

      jumpPads.forEach((pad) => {
        const x = pad.x - worldX;
        if (x < -60 || x > width + 60) return;
        const padColor = pad.kind === "fault" ? "#ff4fc8" : pad.kind === "lift" ? "#51d1ff" : "#ffc857";
        context.fillStyle = pad.triggered ? "#4b5158" : padColor;
        context.shadowColor = padColor;
        context.shadowBlur = pad.triggered ? 0 : 15;
        context.beginPath();
        context.moveTo(x - 24, ground);
        context.lineTo(x - 14, ground - 11);
        context.lineTo(x + 14, ground - 11);
        context.lineTo(x + 24, ground);
        context.closePath();
        context.fill();
        context.shadowBlur = 0;
        context.fillStyle = pad.triggered ? "#707780" : padColor;
        context.font = "700 10px Courier New";
        context.textAlign = "center";
        context.fillText(pad.label, x, ground - 19);
      });

      platforms.forEach((platform) => {
        const x = platform.x - worldX;
        if (x < -platform.width - 40 || x > width + 40) return;
        const y = ground - platform.elevation;
        context.fillStyle = "#123b4c";
        context.strokeStyle = "#51d1ff";
        context.shadowColor = "#51d1ff";
        context.shadowBlur = 10;
        context.fillRect(x, y, platform.width, 18);
        context.strokeRect(x, y, platform.width, 18);
        context.shadowBlur = 0;
        context.fillStyle = "rgba(81,209,255,.35)";
        for (let stripe = 8; stripe < platform.width; stripe += 22) context.fillRect(x + stripe, y + 5, 10, 8);
      });

      spikes.forEach((spike) => {
        const x = spike.x - worldX;
        if (x < -80 || x > width + 80) return;
        context.fillStyle = "#d93655";
        context.strokeStyle = "#ff91a5";
        context.shadowColor = "#ff536d";
        context.shadowBlur = 10;
        const spikeCount = spike.count || 1;
        const spikeWidth = spike.width / spikeCount;
        for (let index = 0; index < spikeCount; index += 1) {
          const spikeX = x + index * spikeWidth;
          context.beginPath();
          context.moveTo(spikeX, ground);
          context.lineTo(spikeX + spikeWidth / 2, ground - spike.height);
          context.lineTo(spikeX + spikeWidth, ground);
          context.closePath();
          context.fill();
          context.stroke();
        }
        context.shadowBlur = 0;
      });

      pluses.forEach((plus) => {
        if (plus.collected) return;
        const x = plus.x - worldX;
        if (x < -60 || x > width + 60) return;
        context.save();
        context.translate(x, ground - 54);
        context.rotate(now / 650);
        context.fillStyle = "#7ef29a";
        context.shadowColor = "#7ef29a";
        context.shadowBlur = 20;
        context.fillRect(-7, -25, 14, 50);
        context.fillRect(-25, -7, 50, 14);
        context.restore();
        context.fillStyle = "#7ef29a";
        context.font = "700 10px Courier New";
        context.textAlign = "center";
        context.fillText(`CHECKPOINT ${pluses.indexOf(plus) + 1}`, x, ground - 94);
      });
      context.textAlign = "start";

      if (collected === plusCount) {
        const portalScreenX = portalX - worldX;
        context.strokeStyle = "#ffc857";
        context.lineWidth = 8;
        context.shadowColor = "#ffc857";
        context.shadowBlur = 25;
        context.beginPath();
        context.ellipse(portalScreenX, ground - 70, 34, 62, 0, 0, Math.PI * 2);
        context.stroke();
        context.shadowBlur = 0;
      }

      particles.forEach((particle) => {
        context.globalAlpha = particle.life;
        context.fillStyle = particle.color;
        context.fillRect(particle.x, particle.y, particle.size, particle.size);
      });
      context.globalAlpha = 1;

      context.save();
      context.translate(player.x + player.size / 2, player.y + player.size / 2);
      context.rotate((worldX / 80) % (Math.PI * 2));
      context.fillStyle = now < invulnerableUntil ? "rgba(230,246,255,.45)" : "#e6f6ff";
      context.fillRect(-player.size / 2, -player.size / 2, player.size, player.size);
      context.strokeStyle = "#51d1ff";
      context.lineWidth = 3;
      context.strokeRect(-player.size / 2 + 3, -player.size / 2 + 3, player.size - 6, player.size - 6);
      context.fillStyle = "#07121f";
      context.fillRect(-8, -6, 4, 4);
      context.fillRect(5, -6, 4, 4);
      context.fillRect(-6, 7, 14, 3);
      context.restore();
      if (now < collisionFlashUntil) {
        context.fillStyle = "rgba(255,38,71,.32)";
        context.fillRect(0, 0, width, height);
      }
    }

    function updateGame(now) {
      if (finished) return;
      const delta = Math.min(.034, (now - previousTime) / 1000);
      previousTime = now;
      const seconds = Math.floor((now - startedAt) / 1000);
      resolverTimer.textContent = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

      const speedZones = [220, 235, 250, 228, 242, 235];
      const speed = speedZones[Math.min(speedZones.length - 1, Math.floor(worldX / 4800))];
      worldX += speed * delta;
      const previousBottom = player.y + player.size;
      player.velocityY += 1850 * delta;
      player.y += player.velocityY * delta;
      player.grounded = false;
      const playerWorldX = worldX + player.x;
      const playerFootX = playerWorldX + player.size / 2;
      const overPit = deathPits.some((pit) => playerFootX > pit.x && playerFootX < pit.x + pit.width);
      let landedOnPlatform = false;
      if (!fallingIntoPit && player.velocityY >= 0) {
        for (const platform of platforms) {
          const platformTop = ground - platform.elevation;
          const overlaps = playerWorldX + player.size > platform.x && playerWorldX < platform.x + platform.width;
          if (overlaps && previousBottom <= platformTop + 4 && player.y + player.size >= platformTop) {
            player.y = platformTop - player.size;
            player.velocityY = 0;
            player.grounded = true;
            landedOnPlatform = true;
            break;
          }
        }
      }
      if (!landedOnPlatform && !overPit && !fallingIntoPit && player.y + player.size >= ground) {
        player.y = ground - player.size;
        player.velocityY = 0;
        player.grounded = true;
      }
      if (!landedOnPlatform && overPit && player.y + player.size >= ground - 2) fallingIntoPit = true;
      if (fallingIntoPit && player.y > height + player.size) {
        respawn(now);
        drawScene(now);
        animationFrame = window.requestAnimationFrame(updateGame);
        return;
      }
      jumpPads.forEach((pad) => {
        if (!pad.triggered && Math.abs(playerWorldX - pad.x) < 30 && player.grounded) {
          pad.triggered = true;
          player.velocityY = pad.power;
          player.grounded = false;
        }
      });
      if (now >= invulnerableUntil && spikes.some((spike) => hitsSpike(playerWorldX, player.y, player.size, spike))) {
        respawn(now);
        drawScene(now);
        animationFrame = window.requestAnimationFrame(updateGame);
        return;
      }

      particleClock += delta;
      if (particleClock > .045) {
        particleClock = 0;
        particles.push({ x: player.x + 4, y: player.y + player.size - 7, size: 4 + Math.random() * 4, life: 1, color: collected % 2 ? "#7ef29a" : "#51d1ff" });
      }
      particles.forEach((particle) => {
        particle.x -= 130 * delta;
        particle.y += 35 * delta;
        particle.life -= 1.8 * delta;
      });
      while (particles.length && particles[0].life <= 0) particles.shift();

      pluses.forEach((plus) => {
        if (plus.collected) return;
        if (Math.abs(playerWorldX - plus.x) < 32 && player.y + player.size > ground - 86) {
          plus.collected = true;
          collected += 1;
          checkpointWorldX = plus.x - player.x + 70;
          resolverScore.textContent = `${collected} / ${plusCount}`;
          resolveUnsortedRecord(runRecords[collected - 1], stagedResolvedRecords);
        }
      });
      const nextPlusIndex = pluses.findIndex((plus) => !plus.collected);
      resolverObjective.textContent = nextPlusIndex >= 0
        ? `NEXT CHECKPOINT // ${String(nextPlusIndex + 1).padStart(2, "0")} // ${Math.max(0, Math.ceil((pluses[nextPlusIndex].x - playerWorldX) / 100))} UNITS`
        : "ALL RECORDS RESOLVED // PORTAL AHEAD";
      resolverLevelProgressFill.style.width = `${Math.min(100, playerWorldX / portalX * 100)}%`;
      if (collected === plusCount && playerWorldX >= portalX) { exitGame("RESOLUTION COMPLETE"); return; }
      drawScene(now);
      animationFrame = window.requestAnimationFrame(updateGame);
    }

    resolverScore.textContent = `0 / ${plusCount}`;
    resolverTimer.textContent = "00:00";
    resolverObjective.textContent = "NEXT CHECKPOINT // 01 // 29 UNITS";
    resolverLevelProgressFill.style.width = "0";
    resolverGame.classList.remove("hidden", "is-exiting");
    resolverBriefing.classList.remove("hidden");
    document.body.classList.add("resolver-active");
    resizeGame();
    drawScene(performance.now());
    resolverBeginButton.onclick = () => {
      resolverBeginButton.onclick = null;
      resolverBriefing.classList.add("hidden");
      previousTime = performance.now();
      startedAt = previousTime;
      window.addEventListener("keydown", jump);
      window.addEventListener("resize", resizeGame);
      resolverCanvas.addEventListener("pointerdown", jump);
      animationFrame = window.requestAnimationFrame(updateGame);
    };
  });

  remountButton.addEventListener("click", async () => {
    remountButton.disabled = true;
    await runTerminalSession(remountOperations, "REMOUNT COMPLETE // closing local TTY");
    isReadWriteSession = true;
    try { localStorage.setItem(READ_WRITE_SESSION_KEY, "1"); } catch (_error) {}
    readOnlyStatus.textContent = "READ-WRITE SESSION";
    readOnlyStatus.classList.remove("is-rejected");
    readOnlyStatus.classList.add("is-read-write");
    repairError.textContent = "";
    repairError.classList.remove("is-visible");
    remountButton.hidden = true;
    remountButton.classList.remove("is-revealed");
    remountButton.disabled = false;
  });
  renderCollection("DAMAGED");

  function flashRandomLine() {
    const line = document.createElement("i");
    const duration = 180 + Math.random() * 300;
    const scanlineStep = 5;
    const maximumStep = Math.max(1, Math.floor(window.innerHeight / scanlineStep));
    line.className = "scanline-flash";
    line.style.top = `${Math.floor(Math.random() * maximumStep) * scanlineStep}px`;
    line.style.setProperty("--flash-duration", `${duration}ms`);
    flashes.appendChild(line);
    window.setTimeout(() => line.remove(), duration + 50);

    flashTimer = window.setTimeout(flashRandomLine, 240 + Math.random() * 1100);
  }

  function startRandomFlashes() {
    if (prefersReducedMotion || randomFlashesStarted) return;
    randomFlashesStarted = true;
    flashTimer = window.setTimeout(flashRandomLine, 300 + Math.random() * 700);
  }

  async function typeProgressLine(label) {
    const line = document.createElement("p");
    const initialText = `${label} 0%`;
    line.className = "loading-line";
    loadingLines.appendChild(line);

    for (const character of initialText) {
      line.textContent += character;
      await wait(56);
    }

    line.replaceChildren(document.createTextNode(`${label} `));
    const percentage = document.createElement("strong");
    percentage.textContent = "0%";
    line.appendChild(percentage);

    for (let progress = 1; progress <= 100; progress += 1) {
      await wait(50);
      percentage.textContent = `${progress}%`;
    }
  }

  async function runLoadingSequence() {
    loadingLines.replaceChildren();
    loadingScreen.classList.remove("is-complete");
    loadingScreen.hidden = false;
    document.body.classList.add("fixcorruption-loading");
    viewerIntro.classList.remove("hidden");
    databaseViewer.classList.add("hidden");
    runButton.disabled = true;
    await typeProgressLine("Initializing database viewer...");
    await typeProgressLine("Loading asset files...");
    await typeProgressLine("Allocating memory...");
    await wait(250);
    loadingScreen.classList.add("is-complete");
    await wait(1100);
    loadingScreen.hidden = true;
    document.body.classList.remove("fixcorruption-loading");
    runButton.disabled = false;
    startRandomFlashes();
  }

  function showDatabaseViewer(animate = true) {
    viewerIntro.classList.add("hidden");
    databaseViewer.classList.remove("hidden");
    if (animate) {
      databaseViewer.classList.add("is-opening");
      window.setTimeout(() => databaseViewer.classList.remove("is-opening"), 550);
    }
    maybePromptQuarantineClear();
  }

  function runScanlineSweep(onComplete) {
    window.clearTimeout(flashTimer);
    flashes.classList.remove("is-fading");
    flashes.replaceChildren();
    if (prefersReducedMotion) {
      randomFlashesStarted = false;
      startRandomFlashes();
      onComplete();
      return;
    }

    const lineSpacing = 5;
    const lightStep = 7;
    const lineCount = Math.ceil(window.innerHeight / lineSpacing) + 1;
    const fadeStart = lineCount * lightStep + 300;
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < lineCount; index += 1) {
      const line = document.createElement("i");
      line.className = "scanline-sweep";
      line.style.top = `${index * lineSpacing}px`;
      line.style.setProperty("--light-delay", `${index * lightStep}ms`);
      line.style.setProperty("--fade-step", `${index * lightStep}ms`);
      fragment.appendChild(line);
    }
    flashes.appendChild(fragment);
    window.setTimeout(() => flashes.classList.add("is-fading"), fadeStart);

    const sweepDuration = fadeStart + lineCount * lightStep + 950;
    window.setTimeout(() => {
      flashes.classList.remove("is-fading");
      flashes.replaceChildren();
      randomFlashesStarted = false;
      startRandomFlashes();
      onComplete();
    }, sweepDuration);
  }

  runButton.addEventListener("click", () => {
    runButton.disabled = true;
    if (updatePendingAfterReboot) {
      updatePendingAfterReboot = false;
      startupIsFromReboot = false;
      updateScreen.classList.remove("hidden");
      return;
    }
    if (!startupIsFromReboot) {
      generateRunSeed();
      window.HackuleanStage2Title?.setBlocked();
    }
    startupIsFromReboot = false;
    runScanlineSweep(() => showDatabaseViewer());
  });

  if (titleWasBlocked) {
    loadingScreen.hidden = true;
    document.body.classList.remove("fixcorruption-loading");
    showDatabaseViewer(false);
    startRandomFlashes();
  } else if (document.querySelector(".stage-two-title-screen")) {
    window.addEventListener("hackulean:stage-two-launched", runLoadingSequence, { once: true });
  } else {
    runLoadingSequence();
  }
  window.addEventListener("pagehide", () => window.clearTimeout(flashTimer), { once: true });
})();
