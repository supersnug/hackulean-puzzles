(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

  const RECOVERY_KEY = "hackulean_defeathackers_recovery_started";
  const SPIDERS_DEFEATED_KEY = "hackulean_defeathackers_spiders_defeated";
  const HACKERS_DEFEATED_KEY = "hackulean_defeathackers_hackers_defeated";
  const DEV_TERMINAL_KEY = "hackulean_defeathackers_dev_terminal";
  const DEV_COMMANDS_READY_KEY = "hackulean_defeathackers_dev_commands_ready";
  const RECORD_STATE_KEY = "hackulean_defeathackers_record_collections";
  const FRAGMENT_SEED_KEY = "hackulean_defeathackers_fragment_seed";

  const loadingScreen = document.getElementById("loading-screen");
  const loadingLines = document.getElementById("loading-lines");
  const viewerIntro = document.getElementById("viewer-intro");
  const startButton = document.getElementById("start-button");
  const databaseManager = document.getElementById("database-manager");
  const rebootButton = document.getElementById("reboot-button");
  const rebootScreen = document.getElementById("reboot-screen");
  const rebootLog = document.getElementById("reboot-log");
  const collectionButtons = Array.from(document.querySelectorAll(".rail-button"));
  const managerTabs = Array.from(document.querySelectorAll(".manager-tab"));
  const managerPanels = Array.from(document.querySelectorAll(".manager-panel"));
  const recordList = document.getElementById("record-list");
  const recordCount = document.getElementById("record-count");
  const activeCollection = document.getElementById("active-collection");
  const inspectFragmentsButton = document.getElementById("inspect-fragments-button");
  const fragmentDialog = document.getElementById("fragment-dialog");
  const fragmentDialogClose = document.getElementById("fragment-dialog-close");
  const fragmentDialogTitle = document.getElementById("fragment-dialog-title");
  const fragmentDialogSummary = document.getElementById("fragment-dialog-summary");
  const fragmentGrid = document.getElementById("fragment-grid");
  const integrityDialog = document.getElementById("integrity-dialog");
  const integrityDialogClose = document.getElementById("integrity-dialog-close");
  const integrityDialogTitle = document.getElementById("integrity-dialog-title");
  const integrityDialogSummary = document.getElementById("integrity-dialog-summary");
  const integrityDialogStatus = document.getElementById("integrity-dialog-status");
  const integrityDialogRole = document.getElementById("integrity-dialog-role");
  const integrityDialogUptime = document.getElementById("integrity-dialog-uptime");
  const integrityDialogCheck = document.getElementById("integrity-dialog-check");
  const memoryGrid = document.getElementById("memory-grid");
  const freezeFrameButton = document.getElementById("freeze-frame-button");
  const integrityList = document.getElementById("integrity-list");
  const viewerHealth = document.getElementById("viewer-health");
  const anomalyCount = document.getElementById("anomaly-count");
  const anomalyBreakdown = document.getElementById("anomaly-breakdown");
  const updateContinuation = document.getElementById("update-continuation");
  const updateProgressFill = document.getElementById("update-progress-fill");
  const updateProgressText = document.getElementById("update-progress-text");
  const updateRebootButton = document.getElementById("update-reboot-button");
  const eventBanner = document.getElementById("event-banner");
  const eventKicker = document.getElementById("event-kicker");
  const eventTitle = document.getElementById("event-title");
  const eventDescription = document.getElementById("event-description");
  const eventCount = document.getElementById("event-count");
  const eventTimer = document.getElementById("event-timer");
  const quarantineVirusButton = document.getElementById("quarantine-virus-button");
  const confirmQuarantineButton = document.getElementById("confirm-quarantine-button");
  const clearQuarantineButton = document.getElementById("clear-quarantine-button");
  const recoverDataButton = document.getElementById("recover-data-button");
  const repairDataButton = document.getElementById("repair-data-button");
  const sortDataButton = document.getElementById("sort-data-button");
  const eventTerminal = document.getElementById("event-terminal");
  const eventTerminalState = document.getElementById("event-terminal-state");
  const eventTerminalOutput = document.getElementById("event-terminal-output");
  const eventProgressFill = document.getElementById("event-progress-fill");
  const eventProgressText = document.getElementById("event-progress-text");
  const damageGame = document.getElementById("damage-game");
  const damageCanvas = document.getElementById("damage-canvas");
  const damageTimer = document.getElementById("damage-timer");
  const damageHearts = document.getElementById("damage-hearts");
  const damageScore = document.getElementById("damage-score");
  const damageMessage = document.getElementById("damage-message");
  const sorterGame = document.getElementById("sorter-game");
  const sorterCanvas = document.getElementById("sorter-canvas");
  const sorterTimer = document.getElementById("sorter-timer");
  const sorterScore = document.getElementById("sorter-score");
  const sorterMessage = document.getElementById("sorter-message");
  const partTwoComplete = document.getElementById("part-two-complete");
  const completePuzzleButton = document.getElementById("complete-puzzle-button");
  const hackerAlert = document.getElementById("hacker-alert");
  const criticalException = document.getElementById("critical-exception");
  const recoveryScreen = document.getElementById("recovery-screen");
  const recoveryStatus = document.getElementById("recovery-status");
  const recoveryButtons = Array.from(document.querySelectorAll("[data-recovery-button]"));
  const restoreDatabaseButton = document.getElementById("restore-database-button");
  const rebuildViewerButton = document.getElementById("rebuild-viewer-button");
  const emergencyShellButton = document.getElementById("emergency-shell-button");
  const recoveryShell = document.getElementById("recovery-shell");
  const recoveryShellOutput = document.getElementById("recovery-shell-output");
  const recoveryShellInput = document.getElementById("recovery-shell-input");
  const recoveryProgress = document.getElementById("recovery-progress");
  const recoveryProgressOutput = recoveryProgress.querySelector("output");
  const spiderField = document.getElementById("spider-field");
  const devTerminal = document.getElementById("dev-terminal");
  const devTerminalClose = document.getElementById("dev-terminal-close");
  const devTerminalOutput = document.getElementById("dev-terminal-output");
  const devTerminalInput = document.getElementById("dev-terminal-input");

  let recordRows = [];
  let currentCollection = "NORMAL";
  let memoryTimer = 0;
  let memoryIsFrozen = false;
  let lastMemoryCells = [];
  let eventStartTimer = 0;
  let eventInterval = 0;
  let eventNextTimer = 0;
  let eventRemainingMs = 0;
  let eventLastTick = 0;
  let eventPaused = false;
  let activeEvent = null;
  let eventCompletedCount = 0;
  let dataDamageCompletedOnce = false;
  let newDataCompletedOnce = false;
  let virusSelectionMode = false;
  let hackerTakeoverTimer = 0;
  let hackerTakeoverStarted = false;
  let spiderAttackStarted = false;
  let spiderAttackTimer = 0;
  let recoveryAutoAttackTimer = 0;
  let spidersRemaining = 0;
  let shellUnlocked = false;
  let shellCommandIndex = 0;
  let databaseRemounted = false;
  let databaseRestored = false;
  let rebuildBlockedForShell = false;
  let shellFlashTimer = 0;
  const dbviewerCommandsEntered = new Set();
  let devUnlockStep = 0;
  let typedBuffer = "";
  let devCommandIndex = 0;
  const selectedEventRecordIds = new Set();
  const eventState = {
    virusIds: [],
    memoryTargets: [],
    memoryTargetIndex: 0,
    memoryCycleCount: 0,
    flaggedMemoryIndexes: new Set(),
    damageIds: [],
    damageGameComplete: false,
    unsortedIds: [],
  };
  let damageGameFrame = 0;
  let sorterGameFrame = 0;

  const recordsByCollection = {
    NORMAL: [],
    DAMAGED: [],
    QUARANTINE: [],
    UNSORTED: [],
  };

  const collectionMarkers = {
    NORMAL: ["◆", "normal"],
    DAMAGED: ["!", "damaged"],
    QUARANTINE: ["×", "quarantine"],
    UNSORTED: ["?", "unsorted"],
    VIRUS: ["!", "virus"],
  };

  const EVENT_COMPLETED_KEY = "hackulean_defeathackers_events_completed";
  const ACTIVE_EVENT_KEY = "hackulean_defeathackers_active_event";
  const DATA_DAMAGE_TRACKER_KEY = "hackulean_defeathackers_data_damage_completed";
  const NEW_DATA_TRACKER_KEY = "hackulean_defeathackers_new_data_found_completed";
  const COMPLETION_STORE_KEY = "hackulean_puzzle_completion_map";
  const ROOT_COMPLETION_SIGNAL = "puzzle_completed";
  const PUZZLE_ID = "07-defeat-hackers";
  const eventDefinitions = [
    {
      name: "Virus Attack",
      duration: 30_000,
      errorSystem: "Quarantine Bot",
      description: "Some viruses slipped past the security filters and hijacked the Quarantine Bot! Manually quarantine them before they take over the system.",
    },
    {
      name: "Memory Corruption",
      duration: 30_000,
      errorSystem: "Memory Scanner",
      description: "A virus has compromised the Memory Scanner and is now corrupting the system's memory. Flag it before the system crashes.",
    },
    {
      name: "Data Damage",
      duration: 0,
      errorSystem: "Database Storage",
      description: "Some of your data has been damaged. Recover it before it disappears.",
    },
    {
      name: "New Data Found!",
      duration: 0,
      errorSystem: "Auto-Sorter",
      description: "The Auto-Sorter is malfunctioning. Manually sort some new data before it gets deleted.",
    },
  ];

  function generateSeed() {
    const values = new Uint32Array(2);
    if (window.crypto?.getRandomValues) window.crypto.getRandomValues(values);
    else {
      values[0] = Date.now();
      values[1] = Math.floor(Math.random() * 0xffffffff);
    }
    const seed = Array.from(values, (value) => value.toString(16).padStart(8, "0")).join("");
    try { localStorage.setItem(FRAGMENT_SEED_KEY, seed); } catch (_error) {}
    return seed;
  }

  function getSeed() {
    try {
      return localStorage.getItem(FRAGMENT_SEED_KEY) || generateSeed();
    } catch (_error) {
      return generateSeed();
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

  function generateRecords() {
    const random = seededRandom(hashSeed(`${getSeed()}|records`));
    const types = ["USER", "ROUTE", "ASSET", "INDEX", "SESSION", "MEDIA", "AUDIT"];
    const owners = ["SYSTEM", "ARCHIVE", "VIEWER", "SCANNER", "SORTER"];
    recordsByCollection.NORMAL = Array.from({ length: 13 }, (_, index) => {
      const number = 6100 + index * 17 + Math.floor(random() * 9);
      return [
        `NM-${number}`,
        types[index % types.length],
        85 + Math.floor(random() * 16),
        String(1 + Math.floor(random() * 5)).padStart(2, "0"),
        owners[Math.floor(random() * owners.length)],
        "OPEN",
        "JUST NOW",
      ];
    });
  }

  function saveRecords() {
    try { localStorage.setItem(RECORD_STATE_KEY, JSON.stringify(recordsByCollection)); } catch (_error) {}
  }

  function restoreRecords() {
    try {
      const saved = JSON.parse(localStorage.getItem(RECORD_STATE_KEY) || "null");
      if (!saved || typeof saved !== "object") return false;
      Object.keys(recordsByCollection).forEach((collection) => {
        if (Array.isArray(saved[collection])) recordsByCollection[collection] = saved[collection];
      });
      return recordsByCollection.NORMAL.length >= 13;
    } catch (_error) {
      return false;
    }
  }

  function ensureRecords() {
    if (!restoreRecords()) {
      generateRecords();
      saveRecords();
    }
  }

  function saveEventProgress() {
    try {
      localStorage.setItem(EVENT_COMPLETED_KEY, String(eventCompletedCount));
      localStorage.setItem(DATA_DAMAGE_TRACKER_KEY, dataDamageCompletedOnce ? "1" : "0");
      localStorage.setItem(NEW_DATA_TRACKER_KEY, newDataCompletedOnce ? "1" : "0");
      if (activeEvent) localStorage.setItem(ACTIVE_EVENT_KEY, activeEvent.name);
      else localStorage.removeItem(ACTIVE_EVENT_KEY);
    } catch (_error) {}
  }

  function restoreEventProgress() {
    try {
      eventCompletedCount = Number.parseInt(localStorage.getItem(EVENT_COMPLETED_KEY) || "0", 10) || 0;
      dataDamageCompletedOnce = localStorage.getItem(DATA_DAMAGE_TRACKER_KEY) === "1";
      newDataCompletedOnce = localStorage.getItem(NEW_DATA_TRACKER_KEY) === "1";
      const activeName = localStorage.getItem(ACTIVE_EVENT_KEY);
      if (activeName) activeEvent = eventDefinitions.find((event) => event.name === activeName) || null;
    } catch (_error) {
      eventCompletedCount = 0;
      dataDamageCompletedOnce = false;
      newDataCompletedOnce = false;
      activeEvent = null;
    }
  }

  function resetEventProgress() {
    eventCompletedCount = 0;
    activeEvent = null;
    dataDamageCompletedOnce = false;
    newDataCompletedOnce = false;
    try {
      localStorage.removeItem(EVENT_COMPLETED_KEY);
      localStorage.removeItem(ACTIVE_EVENT_KEY);
      localStorage.removeItem(DATA_DAMAGE_TRACKER_KEY);
      localStorage.removeItem(NEW_DATA_TRACKER_KEY);
    } catch (_error) {}
  }

  function findEventDefinition(name) {
    return eventDefinitions.find((event) => event.name === name);
  }

  function getFinalEventName() {
    const random = seededRandom(hashSeed(`${getSeed()}|final-event`));
    return random() < 0.5 ? "Data Damage" : "New Data Found!";
  }

  function specialEventChance() {
    if (eventCompletedCount <= 0) return 0;
    if (eventCompletedCount <= 4) return eventCompletedCount * 0.2;
    if (eventCompletedCount >= 12) return 1;
    return 0.8 + ((eventCompletedCount - 4) / 8) * 0.2;
  }

  function isFinalEventReady() {
    return eventCompletedCount >= 7 && dataDamageCompletedOnce && newDataCompletedOnce;
  }

  function chooseEventDefinition() {
    if (isFinalEventReady()) return findEventDefinition(getFinalEventName());

    const incidentEvents = [
      findEventDefinition("Virus Attack"),
      findEventDefinition("Memory Corruption"),
    ];
    const availableSpecialEvents = [
      !dataDamageCompletedOnce && findEventDefinition("Data Damage"),
      !newDataCompletedOnce && findEventDefinition("New Data Found!"),
    ].filter(Boolean);

    const random = seededRandom(hashSeed(`${getSeed()}|event-choice|${eventCompletedCount}`));
    if (availableSpecialEvents.length && random() < specialEventChance()) {
      return availableSpecialEvents[Math.floor(random() * availableSpecialEvents.length)];
    }
    return incidentEvents[Math.floor(random() * incidentEvents.length)];
  }

  function markPuzzleComplete() {
    try {
      const raw = localStorage.getItem(COMPLETION_STORE_KEY);
      const completionMap = raw ? JSON.parse(raw) : {};
      if (completionMap && typeof completionMap === "object" && !Array.isArray(completionMap)) {
        completionMap[PUZZLE_ID] = true;
        localStorage.setItem(COMPLETION_STORE_KEY, JSON.stringify(completionMap));
      }
    } catch (_error) {
      // The root completion signal below also handles completion.
    }
  }

  function clearPuzzleStorage() {
    try {
      const puzzleKeys = [];
      for (let index = 0; index < localStorage.length; index += 1) {
        const key = localStorage.key(index);
        if (key?.startsWith("hackulean_defeathackers_")) puzzleKeys.push(key);
      }
      puzzleKeys.forEach((key) => localStorage.removeItem(key));
    } catch (_error) {
      // Continue to Puzzle Root if storage is unavailable.
    }
  }

  function showCompletionModal() {
    markPuzzleComplete();
    window.clearTimeout(eventStartTimer);
    window.clearTimeout(eventNextTimer);
    stopEventTimer();
    eventBanner.classList.add("hidden");
    databaseManager.classList.add("hidden");
    partTwoComplete.classList.remove("hidden");
  }

  function readFlag(key) {
    try {
      return localStorage.getItem(key) === "1";
    } catch (_error) {
      return false;
    }
  }

  function writeFlag(key) {
    try {
      localStorage.setItem(key, "1");
    } catch (_error) {}
  }

  function removeFlag(key) {
    try {
      localStorage.removeItem(key);
    } catch (_error) {}
  }

  function appendDevLine(text, type = "") {
    const line = document.createElement("span");
    if (type) line.className = type;
    line.textContent = text;
    devTerminalOutput.appendChild(line);
    devTerminalOutput.scrollTop = devTerminalOutput.scrollHeight;
  }

  function showDevTerminal(focus = false) {
    devTerminal.classList.remove("hidden");
    if (!devTerminalOutput.children.length) appendDevLine("dev terminal ready");
    if (focus) devTerminalInput.focus();
  }

  function unlockDevTerminal() {
    writeFlag(DEV_TERMINAL_KEY);
    fragmentDialog.close();
    showDevTerminal(true);
  }

  function setDevUnlockStep(step) {
    devUnlockStep = Math.max(devUnlockStep, step);
    typedBuffer = "";
  }

  function handleSecretTyping(character) {
    if (!readFlag(HACKERS_DEFEATED_KEY) || readFlag(DEV_TERMINAL_KEY)) return;
    if (document.activeElement === devTerminalInput || document.activeElement === recoveryShellInput) return;
    typedBuffer = `${typedBuffer}${character}`.slice(-24);
    if (devUnlockStep === 2 && typedBuffer.endsWith("KEYCODE")) setDevUnlockStep(3);
    else if (devUnlockStep === 4 && typedBuffer.endsWith("ErrSystem")) setDevUnlockStep(5);
    else if (devUnlockStep === 8 && typedBuffer.endsWith("UnlockTerminal123")) unlockDevTerminal();
  }

  function maybeNoteFragmentInspect() {
    const selectedIndex = recordRows.findIndex((row) => row.classList.contains("selected"));
    if (devUnlockStep === 7 && currentCollection === "NORMAL" && selectedIndex === 2) setDevUnlockStep(8);
  }

  const devCommands = [
    {
      command: "add-schedule virusscanner-sigupdate",
      output: ["Added schedule"],
      instant: true,
    },
    {
      command: "add-schedule update-modules",
      output: ["Added schedule"],
      instant: true,
    },
    {
      command: "module update --all",
      output: ["checking module manifest...", "downloading signed module bundle", "module set staged for reboot"],
    },
    {
      command: "module cmd virus-scanner download-signatures",
      output: ["connecting to signature mirror...", "signature bundle verified", "virus scanner signatures staged"],
    },
  ];

  async function completeDevCommands() {
    writeFlag(DEV_COMMANDS_READY_KEY);
    appendDevLine("reboot required", "ok");
  }

  async function handleDevCommand(command) {
    const trimmed = command.trim();
    if (!trimmed) return;
    devTerminalInput.disabled = true;
    appendDevLine(`> ${trimmed}`);
    if (trimmed === "reboot") {
      devTerminalInput.disabled = false;
      devTerminalInput.value = "";
      await runRebootThenStartup();
      return;
    }
    const expected = devCommands[devCommandIndex];
    if (!expected || trimmed !== expected.command) {
      appendDevLine("command rejected", "error");
      devTerminalInput.disabled = false;
      devTerminalInput.focus();
      return;
    }
    for (const line of expected.output) {
      if (!expected.instant) await wait(350);
      appendDevLine(line, "ok");
    }
    devCommandIndex += 1;
    if (devCommandIndex >= devCommands.length) await completeDevCommands();
    devTerminalInput.disabled = false;
    devTerminalInput.focus();
  }

  function scheduleHackerTakeover() {
    window.clearTimeout(hackerTakeoverTimer);
    if (readFlag(RECOVERY_KEY) || readFlag(SPIDERS_DEFEATED_KEY) || readFlag(HACKERS_DEFEATED_KEY) || hackerTakeoverStarted) return;
    hackerTakeoverTimer = window.setTimeout(() => {
      void startHackerTakeover();
    }, 15_000);
  }

  function virusRecord(index) {
    return [
      `VX-${String(9000 + index * 13).padStart(5, "0")}`,
      "VIRUS",
      0,
      "99",
      "HACKER",
      "HOSTILE",
      "NOW",
    ];
  }

  async function startHackerTakeover() {
    if (hackerTakeoverStarted || readFlag(RECOVERY_KEY)) return;
    hackerTakeoverStarted = true;
    window.clearTimeout(hackerTakeoverTimer);
    hackerAlert.classList.remove("hidden");
    await wait(1300);

    renderCollection("NORMAL");
    const rows = [...recordRows];
    rows.forEach((row) => row.classList.add("is-virus-overwrite"));
    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index];
      row.dataset.record = `VX-${String(9000 + index * 13).padStart(5, "0")}`;
      row.dataset.type = "VIRUS";
      row.dataset.integrity = "0";
      row.dataset.owner = "HACKER";
      row.dataset.lock = "HOSTILE";
      row.innerHTML = `<span><i class="virus" aria-hidden="true">!</i> ${row.dataset.record}</span><span>VIRUS</span><span class="bad">0%</span><span>NOW</span>`;
      await wait(180);
    }

    let virusIndex = 0;
    Object.keys(recordsByCollection).forEach((collection) => {
      recordsByCollection[collection] = recordsByCollection[collection].map(() => virusRecord(virusIndex++));
    });
    saveRecords();
    await wait(900);
    hackerAlert.classList.add("hidden");
    databaseManager.classList.add("hidden");
    criticalException.classList.remove("hidden");
    await wait(1800);
    criticalException.classList.add("hidden");
    writeFlag(RECOVERY_KEY);
    showRecoveryScreen();
  }

  function resetRecoveryButtons() {
    recoveryButtons.forEach((button) => {
      button.dataset.health = "100";
      button.style.setProperty("--health", "100%");
      button.disabled = false;
    });
  }

  function setRecoveryButtonsEnabled(enabled) {
    recoveryButtons.forEach((button) => {
      button.disabled = !enabled;
    });
  }

  function setRecoveryMessage(message, tone = "normal") {
    recoveryStatus.textContent = message;
    recoveryStatus.dataset.tone = tone;
  }

  function updateRecoveryActionStates() {
    const spidersDefeated = readFlag(SPIDERS_DEFEATED_KEY);
    restoreDatabaseButton.disabled = databaseRestored;
    rebuildViewerButton.disabled = rebuildBlockedForShell;
    emergencyShellButton.disabled = !spidersDefeated || !shellUnlocked;
  }

  function unlockEmergencyShell(message) {
    shellUnlocked = true;
    emergencyShellButton.classList.add("is-flashing");
    window.clearTimeout(shellFlashTimer);
    shellFlashTimer = window.setTimeout(() => {
      emergencyShellButton.classList.remove("is-flashing");
    }, 3000);
    setRecoveryMessage(message, "error");
    updateRecoveryActionStates();
  }

  function appendShellLine(text, type = "") {
    const line = document.createElement("span");
    if (type) line.className = type;
    line.textContent = text;
    recoveryShellOutput.appendChild(line);
    recoveryShellOutput.scrollTop = recoveryShellOutput.scrollHeight;
  }

  function openEmergencyShell() {
    if (!shellUnlocked) return;
    emergencyShellButton.classList.remove("is-flashing");
    window.clearTimeout(shellFlashTimer);
    recoveryShell.classList.remove("hidden");
    recoveryShellInput.disabled = false;
    if (!recoveryShellOutput.children.length) {
      appendShellLine("Emergency shell ready.");
    }
    recoveryShellInput.focus();
  }

  const requiredShellCommands = [
    "remount -o remount,rw /archive/database",
    "dbviewer-index --verify --repair-map",
    "sessionctl --elevate write-channel",
  ];

  const remountCommandOutputs = [
    ["checking archive journal...", "write lock detected on /dev/hkdb0", "negotiating temporary mount token..."],
    ["18 anomaly headers indexed", "fragment allocation map loaded", "repair map staged in volatile memory"],
    ["requesting local write channel", "session permissions synchronized", "archive remounted read/write"],
  ];

  const hackerCleanupCommands = [
    "dbviewer cleanse-virus --restore-integrity --all",
    "dbviewer remove-user --bulk --unknown --scan-files --block",
  ];

  const hackerCleanupCommandOutputs = {
    "dbviewer cleanse-virus --restore-integrity --all": [
      "scanning restored archive sectors...",
      "payload signatures removed from record bodies",
      "integrity fields normalized against clean map",
    ],
    "dbviewer remove-user --bulk --unknown --scan-files --block": [
      "enumerating unknown session principals...",
      "revoking unauthorized archive handles",
      "file scan hooks blocked for unknown users",
    ],
  };

  async function completeHackerCleanup() {
    writeFlag(HACKERS_DEFEATED_KEY);
    removeFlag(RECOVERY_KEY);
    Object.keys(recordsByCollection).forEach((collection) => {
      recordsByCollection[collection] = [];
    });
    generateRecords();
    saveRecords();
    renderCollection("NORMAL");
    renderIntegrity();
    shellUnlocked = false;
    rebuildBlockedForShell = false;
    emergencyShellButton.classList.remove("is-flashing");
    recoveryShell.classList.add("hidden");
    setRecoveryMessage("Hacker command channel blocked. Rebuild Viewer is available.");
    updateRecoveryActionStates();
  }

  async function runRebuildViewerProcess() {
    rebuildViewerButton.disabled = true;
    restoreDatabaseButton.disabled = true;
    emergencyShellButton.disabled = true;
    recoveryProgress.classList.remove("hidden");
    for (let progress = 0; progress <= 100; progress += 5) {
      setRecoveryMessage(`REBUILDING VIEWER... ${progress}%`);
      recoveryProgress.style.setProperty("--progress", `${progress}%`);
      recoveryProgressOutput.textContent = `${progress}%`;
      await wait(120);
    }
    for (let seconds = 3; seconds >= 1; seconds -= 1) {
      setRecoveryMessage(`Viewer rebuild complete. Rebooting in ${seconds}...`);
      await wait(1000);
    }
    recoveryScreen.classList.add("hidden");
    await runRebootThenStartup();
  }

  async function handleShellCommand(command) {
    const trimmed = command.trim();
    if (!trimmed) return;
    recoveryShellInput.disabled = true;
    appendShellLine(`> ${trimmed}`);
    if (databaseRemounted && rebuildBlockedForShell) {
      if (trimmed === "dbviewer") {
        appendShellLine("No command provided. Failed with error code ssnuDaNZ.", "error");
      } else if (hackerCleanupCommands.includes(trimmed)) {
        dbviewerCommandsEntered.add(trimmed);
        for (const line of hackerCleanupCommandOutputs[trimmed]) {
          await wait(350);
          appendShellLine(line, "ok");
        }
        if (dbviewerCommandsEntered.size >= hackerCleanupCommands.length) {
          await wait(350);
          await completeHackerCleanup();
          return;
        }
      } else {
        appendShellLine("dbviewer command rejected", "error");
      }
      recoveryShellInput.disabled = false;
      recoveryShellInput.focus();
      return;
    }
    const expected = requiredShellCommands[shellCommandIndex];
    if (trimmed !== expected) {
      appendShellLine("command rejected", "error");
      recoveryShellInput.disabled = false;
      recoveryShellInput.focus();
      return;
    }
    shellCommandIndex += 1;
    for (const line of remountCommandOutputs[shellCommandIndex - 1]) {
      await wait(350);
      appendShellLine(line, "ok");
    }
    if (shellCommandIndex < requiredShellCommands.length) {
      recoveryShellInput.disabled = false;
      recoveryShellInput.focus();
      return;
    }
    databaseRemounted = true;
    shellUnlocked = false;
    emergencyShellButton.classList.remove("is-flashing");
    recoveryShellInput.disabled = false;
    recoveryShell.classList.add("hidden");
    appendShellLine("write channel elevated; database remounted read-write", "ok");
    setRecoveryMessage("Remount successful. Restore Database can now run.");
    updateRecoveryActionStates();
  }

  async function runRestoreProcess() {
    if (databaseRestored) return;
    restoreDatabaseButton.disabled = true;
    rebuildViewerButton.disabled = true;
    emergencyShellButton.disabled = true;
    recoveryShell.classList.add("hidden");
    for (let progress = 0; progress <= 100; progress += 10) {
      setRecoveryMessage(`RESTORING DATABASE... ${progress}%`);
      await wait(180);
    }
    databaseRestored = true;
    setRecoveryMessage("Database restored. Rebuild Viewer is now available.");
    updateRecoveryActionStates();
  }

  function handleRestoreDatabase() {
    if (!readFlag(SPIDERS_DEFEATED_KEY)) {
      startSpiderAttack();
      return;
    }
    if (!databaseRemounted) {
      unlockEmergencyShell("Database is read-only. REMOUNT the database first with: remount -o remount,rw /archive/database; then dbviewer-index --verify --repair-map; then sessionctl --elevate write-channel.");
      return;
    }
    void runRestoreProcess();
  }

  function handleRebuildViewer() {
    if (!readFlag(SPIDERS_DEFEATED_KEY)) {
      startSpiderAttack();
      return;
    }
    if (!databaseRestored) {
      setRecoveryMessage("Cannot rebuild viewer: database is corrupted. Restore the database first.", "error");
      return;
    }
    if (readFlag(HACKERS_DEFEATED_KEY)) {
      void runRebuildViewerProcess();
      return;
    }
    rebuildBlockedForShell = true;
    rebuildViewerButton.disabled = true;
    unlockEmergencyShell("Graphical interface cannot run: internet connection is unsafe because hackers are still connected. Use dbviewer commands in the command line.");
  }

  function showRecoveryScreen() {
    window.clearTimeout(hackerTakeoverTimer);
    window.clearTimeout(recoveryAutoAttackTimer);
    stopMemoryStream();
    loadingScreen.hidden = true;
    viewerIntro.classList.add("hidden");
    databaseManager.classList.add("hidden");
    hackerAlert.classList.add("hidden");
    criticalException.classList.add("hidden");
    recoveryScreen.classList.remove("hidden");
    resetRecoveryButtons();
    spiderField.replaceChildren();
    recoveryShell.classList.add("hidden");
    recoveryProgress.classList.add("hidden");
    recoveryProgress.style.setProperty("--progress", "0%");
    recoveryProgressOutput.textContent = "0%";
    spiderAttackStarted = false;
    if (readFlag(HACKERS_DEFEATED_KEY)) {
      databaseRemounted = true;
      databaseRestored = true;
      rebuildBlockedForShell = false;
      shellUnlocked = false;
    }
    if (readFlag(SPIDERS_DEFEATED_KEY)) {
      setRecoveryMessage("Spider payload defeated. Recovery controls are unlocked.");
      updateRecoveryActionStates();
      return;
    }
    setRecoveryMessage("Choose a recovery option. Defensive systems are unstable.");
    updateRecoveryActionStates();
    recoveryAutoAttackTimer = window.setTimeout(startSpiderAttack, 5_000);
  }

  function resetSpiderAttack() {
    window.clearInterval(spiderAttackTimer);
    spiderField.replaceChildren();
    resetRecoveryButtons();
    spiderAttackStarted = false;
    setRecoveryMessage("Recovery button destroyed. Defensive state reset.", "error");
    updateRecoveryActionStates();
    recoveryAutoAttackTimer = window.setTimeout(startSpiderAttack, 1200);
  }

  function updateButtonHealth(button, amount) {
    const health = Math.max(0, Number(button.dataset.health || "100") - amount);
    button.dataset.health = String(health);
    button.style.setProperty("--health", `${health}%`);
    if (health <= 0) resetSpiderAttack();
  }

  function spawnSpider(index) {
    const spider = document.createElement("button");
    spider.type = "button";
    spider.className = "spider";
    spider.setAttribute("aria-label", "Defeat spider");
    spider.dataset.target = String(index % recoveryButtons.length);
    spider.dataset.offsetX = String(((index % 3) - 1) * 30);
    spider.dataset.offsetY = String((Math.floor(index / 3) - 1) * 18);
    spider.style.left = `${12 + (index * 17) % 72}%`;
    spider.style.top = `${58 + (index * 11) % 28}%`;
    spider.addEventListener("click", () => {
      if (spider.classList.contains("is-hit")) return;
      spider.classList.add("is-hit");
      spidersRemaining -= 1;
      window.setTimeout(() => spider.remove(), 170);
      if (spidersRemaining <= 0) {
        window.clearInterval(spiderAttackTimer);
        writeFlag(SPIDERS_DEFEATED_KEY);
        setRecoveryMessage("Spiders defeated. Recovery controls unlocked.");
        updateRecoveryActionStates();
      }
    });
    spiderField.appendChild(spider);
    return spider;
  }

  function startSpiderAttack() {
    if (spiderAttackStarted || readFlag(SPIDERS_DEFEATED_KEY)) return;
    window.clearTimeout(recoveryAutoAttackTimer);
    spiderAttackStarted = true;
    setRecoveryMessage("Spider payload active. Click every spider before a recovery button is destroyed.", "error");
    setRecoveryButtonsEnabled(false);
    emergencyShellButton.classList.remove("is-flashing");
    const spiders = Array.from({ length: 9 }, (_, index) => spawnSpider(index));
    spidersRemaining = spiders.length;
    spiderAttackTimer = window.setInterval(() => {
      const livingSpiders = spiders.filter((spider) => spider.isConnected && !spider.classList.contains("is-hit"));
      livingSpiders.forEach((spider) => {
        const target = recoveryButtons[Number(spider.dataset.target) || 0];
        const targetRect = target.getBoundingClientRect();
        const panelRect = spiderField.getBoundingClientRect();
        const offsetX = Number(spider.dataset.offsetX) || 0;
        const offsetY = Number(spider.dataset.offsetY) || 0;
        const nextLeft = targetRect.left - panelRect.left + targetRect.width / 2 - 17 + offsetX;
        const nextTop = targetRect.top - panelRect.top + targetRect.height / 2 - 17 + offsetY;
        spider.style.left = `${Math.max(8, Math.min(panelRect.width - 42, nextLeft))}px`;
        spider.style.top = `${Math.max(8, Math.min(panelRect.height - 42, nextTop))}px`;
        updateButtonHealth(target, 4);
      });
    }, 950);
  }

  function formatTimer(milliseconds) {
    const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
    return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  }

  function setEventBanner(event, state = "ACTIVE") {
    eventKicker.textContent = `${state} // RANDOM EVENT`;
    eventTitle.textContent = event.name;
    eventDescription.textContent = event.description;
    eventCount.textContent = `${eventCompletedCount} EVENTS COMPLETE`;
    eventBanner.classList.remove("hidden");
  }

  function flashRed() {
    document.body.classList.remove("event-red-flash");
    void document.body.offsetWidth;
    document.body.classList.add("event-red-flash");
    window.setTimeout(() => document.body.classList.remove("event-red-flash"), 950);
  }

  function integrityClass(integrity) {
    if (integrity < 30) return "bad";
    if (integrity < 75) return "warn";
    return "good";
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

  function selectRecord(row) {
    if (activeEvent?.name === "Virus Attack" && virusSelectionMode && currentCollection === "NORMAL") {
      const recordId = row.dataset.record;
      if (selectedEventRecordIds.has(recordId)) selectedEventRecordIds.delete(recordId);
      else selectedEventRecordIds.add(recordId);
      row.classList.toggle("is-event-selected", selectedEventRecordIds.has(recordId));
      return;
    }
    recordRows.forEach((candidate) => candidate.classList.toggle("selected", candidate === row));
    const { record, type, integrity, fragments, owner, lock } = row.dataset;
    document.getElementById("inspector-glyph").textContent = record.slice(0, 2);
    document.getElementById("inspector-record").textContent = record;
    document.getElementById("inspector-path").textContent = `/${currentCollection.toLowerCase()}/archive/${record}.hdb`;
    const inspectorIntegrity = document.getElementById("inspector-integrity");
    inspectorIntegrity.textContent = `${integrity}%`;
    inspectorIntegrity.className = integrityClass(Number(integrity));
    document.getElementById("inspector-fragments").textContent = fragments;
    document.getElementById("inspector-owner").textContent = owner;
    document.getElementById("inspector-lock").textContent = lock;
    const selectedIndex = recordRows.indexOf(row);
    if (readFlag(HACKERS_DEFEATED_KEY) && devUnlockStep === 6 && currentCollection === "NORMAL" && selectedIndex === 2) setDevUnlockStep(7);
  }

  function renderCollection(collection) {
    currentCollection = collection;
    activeCollection.textContent = collection;
    const records = recordsByCollection[collection];
    const [marker, markerClass] = collectionMarkers[collection];
    const fragment = document.createDocumentFragment();
    records.forEach(([record, type, integrity, fragments, owner, lock, modified]) => {
      const row = document.createElement("button");
      row.className = "record-row";
      row.type = "button";
      Object.assign(row.dataset, { record, type, integrity, fragments, owner, lock });
      const [rowMarker, rowMarkerClass] = type === "VIRUS" ? collectionMarkers.VIRUS : [marker, markerClass];
      row.classList.toggle("is-virus-candidate", type === "VIRUS");
      row.classList.toggle("is-event-selected", selectedEventRecordIds.has(record));
      row.innerHTML = `<span><i class="${rowMarkerClass}" aria-hidden="true">${rowMarker}</i> ${record}</span><span>${type}</span><span class="${integrityClass(integrity)}">${integrity}%</span><span>${modified}</span>`;
      row.addEventListener("click", () => selectRecord(row));
      fragment.appendChild(row);
    });
    recordList.replaceChildren(fragment);
    recordRows = Array.from(recordList.children);
    if (!recordRows.length) {
      const empty = document.createElement("p");
      empty.className = "empty-records";
      empty.textContent = "NO RECORDS IN THIS COLLECTION";
      recordList.appendChild(empty);
    } else if (!(activeEvent?.name === "Virus Attack" && virusSelectionMode && collection === "NORMAL")) {
      selectRecord(recordRows[0]);
    }
    recordCount.textContent = `${records.length} OF ${records.length} RECORDS`;
    updateEventControls();
    updateAnomalyCounter();
  }

  function renderMemory(frozen = false) {
    const useFrozenSnapshot = frozen && lastMemoryCells.length;
    const random = seededRandom(hashSeed(`${getSeed()}|memory|${Date.now()}`));
    const fragment = document.createDocumentFragment();
    const activeMemoryEvent = activeEvent?.name === "Memory Corruption";
    const corruptIndex = activeMemoryEvent ? eventState.memoryTargets[eventState.memoryTargetIndex] : -1;
    for (let index = 0; index < 48; index += 1) {
      const snapshot = lastMemoryCells[index];
      const address = useFrozenSnapshot ? snapshot.address : memoryAddressFor(index);
      const liveCorrupted = activeMemoryEvent && index === corruptIndex && !eventState.flaggedMemoryIndexes.has(index);
      const liveFlagged = eventState.flaggedMemoryIndexes.has(index);
      const isCorrupted = useFrozenSnapshot ? snapshot.isCorrupted : liveCorrupted;
      const isFlagged = useFrozenSnapshot ? snapshot.isFlagged : liveFlagged;
      const bytes = useFrozenSnapshot
        ? snapshot.bytes
        : isCorrupted
          ? ["??", "??", "??", "??"]
          : [randomHex(2, random), randomHex(2, random), randomHex(2, random), randomHex(2, random)];
      const cache = useFrozenSnapshot ? snapshot.cache : Math.floor(random() * 100);
      const cell = document.createElement("article");
      cell.className = `memory-cell${frozen ? " is-frozen" : ""}${isCorrupted ? " is-corrupted" : ""}${isFlagged ? " is-flagged" : ""}`;
      cell.dataset.index = String(index);
      cell.dataset.corrupted = String(bytes.includes("??"));
      cell.innerHTML = `<strong>${address}</strong>${bytes.join(" ")}<br />${cache}% CACHE`;
      if (frozen) {
        const button = document.createElement("button");
        button.className = "mark-suspicious-button";
        button.type = "button";
        button.textContent = "Mark Suspicious";
        button.addEventListener("click", () => markMemorySuspicious(index, bytes.includes("??")));
        cell.appendChild(button);
      }
      fragment.appendChild(cell);
      if (!useFrozenSnapshot) lastMemoryCells[index] = { address, bytes, cache, isCorrupted, isFlagged };
    }
    memoryGrid.replaceChildren(fragment);
    if (activeMemoryEvent && !frozen && isMemoryPanelActive()) {
      eventState.memoryCycleCount += 1;
      if (eventState.memoryCycleCount >= 2) {
        eventState.memoryCycleCount = 0;
        eventState.memoryTargetIndex = getNextUnflaggedMemoryTargetIndex(eventState.memoryTargetIndex + 1);
      }
    }
  }

  function stopMemoryStream() {
    window.clearInterval(memoryTimer);
    memoryTimer = 0;
  }

  function startMemoryStream() {
    if (memoryIsFrozen || memoryTimer) return;
    renderMemory();
    memoryTimer = window.setInterval(renderMemory, 500);
  }

  function unfreezeMemory() {
    memoryIsFrozen = false;
    freezeFrameButton.textContent = "Freeze Frame";
    stopMemoryStream();
    renderMemory();
    if (isMemoryPanelActive()) startMemoryStream();
  }

  function isMemoryPanelActive() {
    return document.getElementById("memory-panel").classList.contains("active");
  }

  function memoryAddressFor(index) {
    const random = seededRandom(hashSeed(`${getSeed()}|memory-address|${index}`));
    return `0x${randomHex(4, random)}`;
  }

  function getNextUnflaggedMemoryTargetIndex(startIndex = 0) {
    if (!eventState.memoryTargets.length) return 0;
    for (let offset = 0; offset < eventState.memoryTargets.length; offset += 1) {
      const candidateIndex = (startIndex + offset) % eventState.memoryTargets.length;
      const target = eventState.memoryTargets[candidateIndex];
      if (!eventState.flaggedMemoryIndexes.has(target)) return candidateIndex;
    }
    return 0;
  }

  function renderIntegrity() {
    const systems = [
      ["Core Systems", "Coordinates runtime permissions, session routing, and boot services.", "Runtime control plane"],
      ["Database Storage", "Maintains record collections, archive paths, and write-ahead storage buffers.", "Persistent storage layer"],
      ["Virus Scanner", "Scans record payloads and quarantine manifests for active signatures.", "Threat detection"],
      ["Quarantine Bot", "Keeps isolated payloads sealed and prevents accidental execution.", "Containment automation"],
      ["Auto-Sorter", "Routes incoming records into Normal, Damaged, Quarantine, or Unsorted.", "Collection routing"],
      ["Update Manager", "Applies database viewer patches and validates version transitions.", "Patch orchestration"],
      ["Memory Scanner", "Samples volatile memory pages for drift and stale incident fragments.", "Volatile memory audit"],
      ["Database Viewer", "Renders record collections, fragment maps, and system state panels.", "Operator interface"],
    ];
    integrityList.replaceChildren(...systems.map((system) => {
      const row = document.createElement("article");
      row.className = "integrity-row";
      const [name, summary, role] = system;
      const uptime = `${96 + name.length % 4}.${name.length % 10}%`;
      const lastCheck = `${String(5 + name.length % 4).padStart(2, "0")}:${String(12 + name.length * 3 % 48).padStart(2, "0")}:OK`;
      const isError = activeEvent?.errorSystem === name;
      row.classList.toggle("is-error", isError);
      row.innerHTML = `<strong>${name}</strong><span>${isError ? "ERROR" : "OK"}</span><button class="integrity-action" type="button">Details</button>`;
      row.querySelector("button").addEventListener("click", () => {
        integrityDialogTitle.textContent = name;
        integrityDialogSummary.textContent = summary;
        integrityDialogStatus.textContent = isError ? "ERROR" : "OK";
        integrityDialogStatus.style.color = isError ? "#ff6683" : "#7ef29a";
        integrityDialogRole.textContent = role;
        integrityDialogUptime.textContent = uptime;
        integrityDialogCheck.textContent = lastCheck;
        integrityDialog.showModal();
      });
      return row;
    }));
  }

  collectionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      collectionButtons.forEach((candidate) => candidate.classList.toggle("active", candidate === button));
      renderCollection(button.dataset.collection);
      if (readFlag(HACKERS_DEFEATED_KEY) && devUnlockStep === 3 && button.dataset.collection === "QUARANTINE") setDevUnlockStep(4);
      if (readFlag(HACKERS_DEFEATED_KEY) && devUnlockStep === 5 && button.dataset.collection === "NORMAL") setDevUnlockStep(6);
    });
  });

  managerTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      managerTabs.forEach((candidate) => candidate.classList.toggle("active", candidate === tab));
      managerPanels.forEach((panel) => panel.classList.toggle("active", panel.id === tab.dataset.panel));
      if (tab.dataset.panel === "memory-panel") {
        if (readFlag(HACKERS_DEFEATED_KEY) && devUnlockStep === 0) setDevUnlockStep(1);
        startMemoryStream();
      }
      else {
        unfreezeMemory();
        stopMemoryStream();
      }
    });
  });

  freezeFrameButton.addEventListener("click", () => {
    if (memoryIsFrozen) return;
    memoryIsFrozen = true;
    freezeFrameButton.textContent = "Frame Frozen";
    stopMemoryStream();
    renderMemory(true);
    if (readFlag(HACKERS_DEFEATED_KEY) && devUnlockStep === 1) setDevUnlockStep(2);
  });

  quarantineVirusButton.addEventListener("click", () => {
    virusSelectionMode = true;
    selectedEventRecordIds.clear();
    renderCollection("NORMAL");
  });

  confirmQuarantineButton.addEventListener("click", async () => {
    if (activeEvent?.name !== "Virus Attack" || !virusSelectionMode) return;
    const selectedRecords = recordsByCollection.NORMAL.filter((record) => selectedEventRecordIds.has(record[0]));
    const selectedAllViruses = eventState.virusIds.every((id) => selectedEventRecordIds.has(id));
    const selectedSafeFile = selectedRecords.some((record) => record[1] !== "VIRUS");
    if (selectedSafeFile) {
      await resetActiveEvent("QUARANTINE FAILED // SAFE FILE SELECTED");
      return;
    }
    if (!selectedAllViruses) {
      eventKicker.textContent = "ACTION BLOCKED // RANDOM EVENT";
      eventDescription.textContent = "Select every virus record before confirming quarantine.";
      return;
    }
    pauseEventTimer();
    await runEventTerminal([
      { command: "quarantinectl isolate --selected-virus-records", output: [`${eventState.virusIds.length} virus records selected`, "validating payload signatures", "quarantine manifest prepared"] },
      { command: "dbviewer move --selected --collection quarantine", output: ["locking infected records", "moving records into quarantine", "normal collection sanitized"] },
    ], "VIRUS RECORDS QUARANTINED // closing local TTY");
    moveVirusesToQuarantine();
    virusSelectionMode = false;
    selectedEventRecordIds.clear();
    renderCollection(currentCollection);
    resumeEventTimer();
  });

  clearQuarantineButton.addEventListener("click", async () => {
    if (activeEvent?.name !== "Virus Attack") return;
    pauseEventTimer();
    await runEventTerminal([
      { command: "quarantinectl verify --virus-event", output: ["virus payloads remain isolated", "quarantine bot override removed", "deletion manifest generated"] },
      { command: "quarantinectl purge --event-payloads", output: ["revoking infected execution tokens", "overwriting quarantined sectors", "quarantine collection clear"] },
    ], "QUARANTINE CLEARED // closing local TTY");
    recordsByCollection.QUARANTINE = recordsByCollection.QUARANTINE.filter((record) => !eventState.virusIds.includes(record[0]));
    saveRecords();
    await completeActiveEvent();
  });

  recoverDataButton.addEventListener("click", () => {
    if (activeEvent?.name !== "Data Damage") return;
    startDamageGame();
  });

  repairDataButton.addEventListener("click", async () => {
    if (activeEvent?.name !== "Data Damage" || !eventState.damageGameComplete) return;
    repairDataButton.disabled = true;
    await runEventTerminal([
      { command: "dbrepair --collection damaged --recover-event-records", output: ["recovery minigame checksum accepted", "five damaged records staged", "repair map rebuilt"] },
      { command: "dbviewer move --repaired --collection normal", output: ["integrity restored above stable threshold", "normal collection index updated", "damaged event queue cleared"] },
    ], "DATA RECOVERY COMPLETE // closing local TTY");
    await restoreDamagedRecordsToNormal();
    repairDataButton.disabled = false;
    await completeActiveEvent();
  });

  sortDataButton.addEventListener("click", () => {
    if (activeEvent?.name !== "New Data Found!") return;
    startSorterGame();
  });

  function updateEventControls() {
    const virusEventActive = activeEvent?.name === "Virus Attack";
    const damageEventActive = activeEvent?.name === "Data Damage";
    const sorterEventActive = activeEvent?.name === "New Data Found!";
    quarantineVirusButton.hidden = !(virusEventActive && currentCollection === "NORMAL" && recordsByCollection.NORMAL.some((record) => record[1] === "VIRUS"));
    confirmQuarantineButton.hidden = !(virusEventActive && currentCollection === "NORMAL" && virusSelectionMode);
    clearQuarantineButton.hidden = !(virusEventActive && currentCollection === "QUARANTINE" && recordsByCollection.QUARANTINE.some((record) => eventState.virusIds.includes(record[0])));
    recoverDataButton.hidden = !(damageEventActive && currentCollection === "DAMAGED" && !eventState.damageGameComplete && recordsByCollection.DAMAGED.some(isDataDamageRecord));
    repairDataButton.hidden = !(damageEventActive && currentCollection === "DAMAGED" && eventState.damageGameComplete && recordsByCollection.DAMAGED.some(isDataDamageRecord));
    sortDataButton.hidden = !(sorterEventActive && currentCollection === "UNSORTED" && recordsByCollection.UNSORTED.some(isNewDataRecord));
  }

  function scheduleFirstEvent() {
    window.clearTimeout(eventStartTimer);
    window.clearTimeout(eventNextTimer);
    if (activeEvent) {
      void announceEvent(activeEvent, 0);
      return;
    }
    eventStartTimer = window.setTimeout(() => {
      void announceEvent(chooseEventDefinition(), 2000);
    }, 60_000);
  }

  function scheduleNextEvent() {
    window.clearTimeout(eventNextTimer);
    eventNextTimer = window.setTimeout(() => {
      void announceEvent(chooseEventDefinition(), 2000);
    }, 5_000);
  }

  async function announceEvent(event, preludeDuration) {
    activeEvent = event;
    saveEventProgress();
    eventPaused = true;
    eventRemainingMs = event.duration;
    eventTimer.textContent = formatTimer(eventRemainingMs);
    eventBanner.classList.add("is-warning");
    setEventBanner(event, "INCOMING");
    flashRed();
    if (preludeDuration) await wait(preludeDuration);
    eventBanner.classList.remove("is-warning");
    setEventBanner(event, "ACTIVE");
    startActiveEvent();
  }

  function startActiveEvent() {
    if (!activeEvent) return;
    if (activeEvent.name === "Virus Attack") setupVirusAttack();
    if (activeEvent.name === "Memory Corruption") setupMemoryCorruption();
    if (activeEvent.name === "Data Damage") setupDataDamage();
    if (activeEvent.name === "New Data Found!") setupNewDataFound();
    renderIntegrity();
    renderCollection(currentCollection);
    if (isMemoryPanelActive()) startMemoryStream();
    if (activeEvent.duration) startEventTimer(activeEvent.duration);
    else eventTimer.textContent = "--:--";
  }

  function startEventTimer(duration) {
    window.clearInterval(eventInterval);
    eventRemainingMs = duration;
    eventPaused = false;
    eventLastTick = performance.now();
    eventTimer.textContent = formatTimer(eventRemainingMs);
    eventInterval = window.setInterval(() => {
      if (eventPaused || !activeEvent) return;
      const now = performance.now();
      eventRemainingMs -= now - eventLastTick;
      eventLastTick = now;
      eventTimer.textContent = formatTimer(eventRemainingMs);
      if (eventRemainingMs <= 0) {
        void resetActiveEvent("EVENT TIMER EXPIRED");
      }
    }, 250);
  }

  function pauseEventTimer() {
    if (!activeEvent || eventPaused) return;
    eventPaused = true;
  }

  function resumeEventTimer() {
    if (!activeEvent || !eventPaused) return;
    eventPaused = false;
    eventLastTick = performance.now();
  }

  function stopEventTimer() {
    window.clearInterval(eventInterval);
    eventInterval = 0;
    eventPaused = false;
  }

  function setupVirusAttack() {
    const random = seededRandom(hashSeed(`${getSeed()}|virus-attack`));
    removeEventVirusRecords();
    const viruses = Array.from({ length: 3 }, (_, index) => {
      const id = `VX-${String(7400 + Math.floor(random() * 500) + index * 31).padStart(5, "0")}`;
      return [id, "VIRUS", 13 + Math.floor(random() * 17), "99", "EXTERNAL", "HOSTILE", "LIVE"];
    });
    eventState.virusIds = viruses.map((record) => record[0]);
    viruses.forEach((record) => {
      const insertAt = Math.floor(random() * (recordsByCollection.NORMAL.length + 1));
      recordsByCollection.NORMAL.splice(insertAt, 0, record);
    });
    saveRecords();
  }

  function removeEventVirusRecords() {
    recordsByCollection.NORMAL = recordsByCollection.NORMAL.filter((record) => record[1] !== "VIRUS");
    recordsByCollection.QUARANTINE = recordsByCollection.QUARANTINE.filter((record) => record[1] !== "VIRUS");
  }

  function moveVirusesToQuarantine() {
    const moved = [];
    recordsByCollection.NORMAL = recordsByCollection.NORMAL.filter((record) => {
      if (!eventState.virusIds.includes(record[0])) return true;
      moved.push(record);
      return false;
    });
    moved.forEach((record) => {
      record[5] = "ISOLATED";
      record[6] = "JUST NOW";
    });
    recordsByCollection.QUARANTINE.unshift(...moved);
    saveRecords();
  }

  function setupMemoryCorruption() {
    const random = seededRandom(hashSeed(`${getSeed()}|memory-corruption`));
    const targets = new Set();
    while (targets.size < 4) targets.add(Math.floor(random() * 48));
    eventState.memoryTargets = [...targets];
    eventState.memoryTargetIndex = 0;
    eventState.memoryCycleCount = 0;
    eventState.flaggedMemoryIndexes.clear();
    memoryIsFrozen = false;
    freezeFrameButton.textContent = "Freeze Frame";
    renderMemory();
  }

  function isDataDamageRecord(record) {
    return record?.[7] === "DATA_DAMAGE";
  }

  function setupDataDamage() {
    const existing = recordsByCollection.DAMAGED.filter(isDataDamageRecord);
    if (existing.length) {
      eventState.damageIds = existing.map((record) => record[0]);
      return;
    }
    const random = seededRandom(hashSeed(`${getSeed()}|data-damage`));
    const candidates = [...recordsByCollection.NORMAL];
    const damaged = [];
    while (damaged.length < 5 && candidates.length) {
      const index = Math.floor(random() * candidates.length);
      const [record] = candidates.splice(index, 1);
      const normalIndex = recordsByCollection.NORMAL.findIndex((candidate) => candidate[0] === record[0]);
      if (normalIndex < 0) continue;
      const [moved] = recordsByCollection.NORMAL.splice(normalIndex, 1);
      moved[7] = "DATA_DAMAGE";
      moved[8] = moved[2];
      moved[2] = 11 + Math.floor(random() * 19);
      moved[5] = "DAMAGED";
      moved[6] = "JUST NOW";
      damaged.push(moved);
    }
    eventState.damageIds = damaged.map((record) => record[0]);
    recordsByCollection.DAMAGED.unshift(...damaged);
    eventState.damageGameComplete = false;
    saveRecords();
  }

  function isNewDataRecord(record) {
    return record?.[7] === "NEW_DATA";
  }

  function setupNewDataFound() {
    const existing = recordsByCollection.UNSORTED.filter(isNewDataRecord);
    if (existing.length) {
      eventState.unsortedIds = existing.map((record) => record[0]);
      return;
    }
    const random = seededRandom(hashSeed(`${getSeed()}|new-data-found`));
    const types = ["LOG", "PACKET", "MEDIA", "INDEX", "ROUTE"];
    const records = Array.from({ length: 3 }, (_, index) => [
      `UD-${String(5200 + Math.floor(random() * 700) + index * 41).padStart(5, "0")}`,
      types[Math.floor(random() * types.length)],
      61 + Math.floor(random() * 31),
      String(2 + Math.floor(random() * 8)).padStart(2, "0"),
      "UNASSIGNED",
      "NONE",
      "JUST NOW",
      "NEW_DATA",
    ]);
    eventState.unsortedIds = records.map((record) => record[0]);
    records.forEach((record) => {
      const insertAt = Math.floor(random() * (recordsByCollection.UNSORTED.length + 1));
      recordsByCollection.UNSORTED.splice(insertAt, 0, record);
    });
    saveRecords();
  }

  function completeNewDataSort() {
    const moved = [];
    recordsByCollection.UNSORTED = recordsByCollection.UNSORTED.filter((record) => {
      if (!eventState.unsortedIds.includes(record[0])) return true;
      record[2] = Math.max(85, Number(record[2]) || 85);
      record[4] = "SORTED";
      record[5] = "OPEN";
      record[6] = "JUST NOW";
      record.splice(7);
      moved.push(record);
      return false;
    });
    recordsByCollection.NORMAL.unshift(...moved);
    eventState.unsortedIds = [];
    saveRecords();
    void completeActiveEvent();
  }

  function startSorterGame() {
    if (!sorterCanvas || sorterGameFrame) return;

    const context = sorterCanvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;
    let ground = height - 78;
    let worldX = 0;
    let lastTime = performance.now();
    let timeRemaining = 60_000;
    let checkpointWorldX = 0;
    let checkpointTime = timeRemaining;
    let collected = 0;
    let hardMode = false;
    let gameOver = false;

    const player = {
      x: 130,
      y: ground - 34,
      size: 34,
      velocityY: 0,
      grounded: true,
    };

    const pluses = [
      { x: 3300, collected: false },
      { x: 7600, collected: false },
      { x: 11200, collected: false },
    ];
    const redSpikes = [
      { x: 950, width: 38, height: 42 },
      { x: 1850, width: 76, height: 45 },
      { x: 4550, width: 38, height: 42 },
      { x: 6200, width: 114, height: 46, hard: true },
      { x: 9100, width: 76, height: 45 },
      { x: 12300, width: 92, height: 46, hard: true },
    ];
    const blueSpikes = [
      { x: 2550, width: 42, height: 62 },
      { x: 6900, width: 42, height: 66 },
      { x: 10450, width: 42, height: 64 },
    ];
    const yellowSpikes = [
      { x: 5200, width: 42, height: 44, touched: false },
      { x: 9800, width: 42, height: 44, touched: false },
    ];
    const doors = [
      { x: 2900, open: false },
      { x: 5850, open: true },
      { x: 8600, open: false },
      { x: 11900, open: false },
    ];
    const buttons = [
      { x: 2630, door: 0, triggered: false },
      { x: 5610, door: 1, triggered: false },
      { x: 8330, door: 2, triggered: false },
      { x: 11620, door: 3, triggered: false },
    ];
    const portalX = 13600;

    function resizeSorter() {
      width = window.innerWidth;
      height = window.innerHeight;
      const scale = window.devicePixelRatio || 1;
      sorterCanvas.width = Math.floor(width * scale);
      sorterCanvas.height = Math.floor(height * scale);
      sorterCanvas.style.width = `${width}px`;
      sorterCanvas.style.height = `${height}px`;
      context.setTransform(scale, 0, 0, scale, 0, 0);
      ground = height - 78;
      player.y = Math.min(player.y, ground - player.size);
    }

    function showSorterMessage(text, duration = 950) {
      sorterMessage.textContent = text;
      sorterMessage.classList.remove("hidden");
      window.clearTimeout(showSorterMessage.timeout);
      showSorterMessage.timeout = window.setTimeout(() => sorterMessage.classList.add("hidden"), duration);
    }

    function jump() {
      if (!player.grounded || gameOver) return;
      player.velocityY = -650;
      player.grounded = false;
    }

    function resetToCheckpoint(text = "RUN RESTARTED") {
      worldX = Math.max(0, checkpointWorldX - 240);
      timeRemaining = checkpointTime;
      player.y = ground - player.size;
      player.velocityY = 0;
      player.grounded = true;
      buttons.forEach((button) => {
        button.triggered = button.x < checkpointWorldX;
      });
      doors[0].open = checkpointWorldX > pluses[0].x ? true : buttons[0].triggered;
      doors[1].open = checkpointWorldX > pluses[1].x ? true : !buttons[1].triggered;
      doors[2].open = checkpointWorldX > pluses[1].x ? true : buttons[2].triggered;
      doors[3].open = checkpointWorldX > pluses[2].x ? true : buttons[3].triggered;
      showSorterMessage(text);
    }

    function fullRestart() {
      collected = 0;
      worldX = 0;
      checkpointWorldX = 0;
      timeRemaining = 60_000;
      checkpointTime = timeRemaining;
      hardMode = false;
      pluses.forEach((plus) => { plus.collected = false; });
      yellowSpikes.forEach((spike) => { spike.touched = false; });
      buttons.forEach((button) => { button.triggered = false; });
      doors[0].open = false;
      doors[1].open = true;
      doors[2].open = false;
      doors[3].open = false;
      resetToCheckpoint("RUN RESTARTED");
    }

    function finishSorterGame() {
      gameOver = true;
      cancelAnimationFrame(sorterGameFrame);
      sorterGameFrame = 0;
      window.removeEventListener("resize", resizeSorter);
      window.removeEventListener("keydown", keyHandler);
      window.removeEventListener("pointerdown", pointerHandler);
      sorterGame.classList.add("hidden");
      sorterMessage.classList.add("hidden");
      completeNewDataSort();
    }

    function keyHandler(event) {
      if (["Space", "ArrowUp", "KeyW"].includes(event.code)) {
        event.preventDefault();
        jump();
      }
    }

    function pointerHandler(event) {
      if (sorterGame.classList.contains("hidden")) return;
      event.preventDefault();
      jump();
    }

    function playerWorldRect() {
      return {
        x: worldX + player.x,
        y: player.y,
        width: player.size,
        height: player.size,
      };
    }

    function intersects(a, b) {
      return a.x < b.x + b.width
        && a.x + a.width > b.x
        && a.y < b.y + b.height
        && a.y + a.height > b.y;
    }

    function drawSpike(spike, color, stroke, offsetY = 0) {
      const screenX = spike.x - worldX;
      if (screenX < -100 || screenX > width + 100) return;
      const baseY = ground + offsetY;
      context.beginPath();
      context.moveTo(screenX, baseY);
      context.lineTo(screenX + spike.width / 2, baseY - spike.height);
      context.lineTo(screenX + spike.width, baseY);
      context.closePath();
      context.fillStyle = color;
      context.strokeStyle = stroke;
      context.lineWidth = 3;
      context.fill();
      context.stroke();
    }

    function drawDoor(door) {
      const screenX = door.x - worldX;
      if (screenX < -100 || screenX > width + 100) return;
      context.fillStyle = door.open ? "rgba(126, 242, 154, .14)" : "rgba(255, 75, 111, .32)";
      context.strokeStyle = door.open ? "#7ef29a" : "#ff4b6f";
      context.lineWidth = 3;
      context.strokeRect(screenX, ground - 128, 34, 128);
      if (!door.open) context.fillRect(screenX + 4, ground - 124, 26, 120);
      context.fillStyle = door.open ? "#7ef29a" : "#ff4b6f";
      context.font = "700 12px monospace";
      context.fillText(door.open ? "OPEN" : "LOCK", screenX - 3, ground - 140);
    }

    function drawButton(button) {
      const screenX = button.x - worldX;
      if (screenX < -100 || screenX > width + 100) return;
      context.fillStyle = button.triggered ? "#6d7a87" : "#ffc857";
      context.strokeStyle = "#fff0aa";
      context.lineWidth = 2;
      context.fillRect(screenX, ground - 18, 46, 18);
      context.strokeRect(screenX, ground - 18, 46, 18);
      context.fillStyle = "#05070e";
      context.font = "900 11px monospace";
      context.fillText("BTN", screenX + 11, ground - 5);
    }

    function drawPlus(plus, index) {
      if (plus.collected) return;
      const screenX = plus.x - worldX;
      if (screenX < -100 || screenX > width + 100) return;
      context.save();
      context.translate(screenX, ground - 118 + Math.sin(performance.now() / 180) * 8);
      context.fillStyle = "#7ef29a";
      context.shadowColor = "#7ef29a";
      context.shadowBlur = 18;
      context.fillRect(-7, -24, 14, 48);
      context.fillRect(-24, -7, 48, 14);
      context.shadowBlur = 0;
      context.fillStyle = "#d8ffe0";
      context.font = "900 13px monospace";
      context.fillText(String(index + 1), -4, 5);
      context.restore();
    }

    function updatePhysics(delta) {
      const speed = hardMode ? 248 : 226;
      worldX += speed * delta;
      timeRemaining -= delta * 1000;
      if (timeRemaining <= 0) {
        fullRestart();
        return;
      }

      player.velocityY += 1850 * delta;
      player.y += player.velocityY * delta;
      if (player.y >= ground - player.size) {
        player.y = ground - player.size;
        player.velocityY = 0;
        player.grounded = true;
      }

      const playerRect = playerWorldRect();

      buttons.forEach((button) => {
        if (button.triggered) return;
        const buttonRect = { x: button.x, y: ground - 18, width: 46, height: 18 };
        if (intersects(playerRect, buttonRect)) {
          button.triggered = true;
          doors[button.door].open = !doors[button.door].open;
        }
      });

      for (const plus of pluses) {
        if (plus.collected) continue;
        const plusRect = { x: plus.x - 28, y: ground - 148, width: 56, height: 84 };
        if (intersects(playerRect, plusRect)) {
          plus.collected = true;
          collected += 1;
          checkpointWorldX = plus.x;
          checkpointTime = timeRemaining;
          sorterScore.textContent = `${collected} / 3`;
          showSorterMessage("DATA SORTED");
        }
      }

      for (const door of doors) {
        if (door.open) continue;
        const doorRect = { x: door.x, y: ground - 128, width: 34, height: 128 };
        if (intersects(playerRect, doorRect)) {
          resetToCheckpoint();
          return;
        }
      }

      for (const spike of redSpikes) {
        if (spike.hard && !hardMode) continue;
        const spikeRect = { x: spike.x + 5, y: ground - spike.height + 8, width: spike.width - 10, height: spike.height - 8 };
        if (intersects(playerRect, spikeRect)) {
          resetToCheckpoint();
          return;
        }
      }

      for (const spike of blueSpikes) {
        const closeness = Math.max(0, 1 - Math.abs((spike.x + spike.width / 2) - (playerRect.x + playerRect.width / 2)) / 190);
        const rise = closeness * 88;
        const activeHeight = spike.height + rise;
        const spikeRect = { x: spike.x + 5, y: ground - activeHeight + 8, width: spike.width - 10, height: activeHeight - 8 };
        if (!player.grounded && intersects(playerRect, spikeRect)) {
          resetToCheckpoint();
          return;
        }
      }

      for (const spike of yellowSpikes) {
        const spikeRect = { x: spike.x + 4, y: ground - spike.height + 8, width: spike.width - 8, height: spike.height - 8 };
        if (!spike.touched && intersects(playerRect, spikeRect)) {
          spike.touched = true;
          hardMode = true;
          showSorterMessage("SORT LOAD INCREASED");
        }
      }

      if (collected >= 3 && playerRect.x > portalX) finishSorterGame();
    }

    function draw() {
      context.clearRect(0, 0, width, height);
      context.fillStyle = "#040713";
      context.fillRect(0, 0, width, height);

      context.strokeStyle = "rgba(126, 242, 154, .09)";
      context.lineWidth = 1;
      for (let x = -((worldX * .35) % 48); x < width; x += 48) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
      }
      for (let y = 0; y < height; y += 48) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
      }

      context.fillStyle = "#0c1724";
      context.fillRect(0, ground, width, height - ground);
      context.strokeStyle = "#7ef29a";
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(0, ground);
      context.lineTo(width, ground);
      context.stroke();

      buttons.forEach(drawButton);
      doors.forEach(drawDoor);
      redSpikes.forEach((spike) => {
        if (!spike.hard || hardMode) drawSpike(spike, "rgba(255, 75, 111, .82)", "#ff4b6f");
      });
      blueSpikes.forEach((spike) => {
        const playerCenter = worldX + player.x + player.size / 2;
        const closeness = Math.max(0, 1 - Math.abs((spike.x + spike.width / 2) - playerCenter) / 190);
        drawSpike(spike, "rgba(81, 209, 255, .72)", "#51d1ff", -(closeness * 88));
      });
      yellowSpikes.forEach((spike) => drawSpike(spike, spike.touched ? "rgba(255, 200, 87, .22)" : "rgba(255, 200, 87, .78)", "#ffc857"));
      pluses.forEach(drawPlus);

      if (collected >= 3) {
        const screenX = portalX - worldX;
        context.save();
        context.translate(screenX, ground - 92);
        context.strokeStyle = "#bf7cff";
        context.lineWidth = 6;
        context.shadowColor = "#bf7cff";
        context.shadowBlur = 24;
        context.beginPath();
        context.ellipse(0, 0, 34, 72, 0, 0, Math.PI * 2);
        context.stroke();
        context.restore();
      }

      context.fillStyle = "#7ef29a";
      context.strokeStyle = "#d8ffe0";
      context.lineWidth = 3;
      context.shadowColor = "#7ef29a";
      context.shadowBlur = 14;
      context.fillRect(player.x, player.y, player.size, player.size);
      context.strokeRect(player.x, player.y, player.size, player.size);
      context.shadowBlur = 0;

      context.fillStyle = "#738395";
      context.font = "700 12px monospace";
      if (width < 640) {
        context.fillText("RED=JUMP  BLUE=STAY LOW", 24, 108);
        context.fillText("YELLOW=LOAD WARNING", 24, 126);
      } else {
        context.fillText("RED = JUMP // BLUE = STAY LOW // YELLOW = LOAD WARNING", 24, 108);
      }
      if (hardMode) {
        context.fillStyle = "#ffc857";
        context.fillText("HARD ROUTE ACTIVE", 24, width < 640 ? 144 : 126);
      }
    }

    function frame(now) {
      const delta = Math.min(0.032, (now - lastTime) / 1000);
      lastTime = now;
      updatePhysics(delta);
      sorterTimer.textContent = formatTimer(Math.max(0, timeRemaining));
      draw();
      if (!gameOver) sorterGameFrame = requestAnimationFrame(frame);
    }

    resizeSorter();
    sorterGame.classList.remove("hidden");
    sorterScore.textContent = "0 / 3";
    sorterTimer.textContent = "01:00";
    window.addEventListener("resize", resizeSorter);
    window.addEventListener("keydown", keyHandler);
    window.addEventListener("pointerdown", pointerHandler);
    sorterGameFrame = requestAnimationFrame(frame);
  }

  async function restoreDamagedRecordsToNormal() {
    if (currentCollection !== "DAMAGED") renderCollection("DAMAGED");
    const rows = Array.from(recordList.querySelectorAll(".record-row"))
      .filter((row) => eventState.damageIds.includes(row.dataset.record));

    for (const row of rows) {
      const recordId = row.dataset.record;
      const record = recordsByCollection.DAMAGED.find((candidate) => candidate[0] === recordId);
      if (!record) continue;
      const targetIntegrity = Math.max(85, Number(record[8]) || 85);
      const integrityCell = row.children[2];
      let integrity = Number(row.dataset.integrity) || Number(record[2]) || 11;
      integrityCell.className = "good";
      while (integrity < targetIntegrity) {
        await wait(50);
        integrity += 1;
        row.dataset.integrity = String(integrity);
        integrityCell.textContent = `${integrity}%`;
        if (row.classList.contains("selected")) {
          document.getElementById("inspector-integrity").textContent = `${integrity}%`;
          document.getElementById("inspector-integrity").className = "good";
        }
      }
      row.classList.add("repair-complete");
      await wait(1000);
      row.classList.remove("repair-complete");
      row.replaceChildren();
      const movedMessage = document.createElement("span");
      movedMessage.className = "moved-to-recovered";
      movedMessage.textContent = "Moved to Normal";
      row.appendChild(movedMessage);
      row.classList.add("is-transfer-message", "is-moving-to-recovered");
      await wait(3000);
    }

    const repaired = [];
    recordsByCollection.DAMAGED = recordsByCollection.DAMAGED.filter((record) => {
      if (!eventState.damageIds.includes(record[0])) return true;
      record[2] = Math.max(85, Number(record[8]) || 85);
      record[5] = "OPEN";
      record[6] = "JUST NOW";
      record.splice(7);
      repaired.push(record);
      return false;
    });
    recordsByCollection.NORMAL.unshift(...repaired);
    eventState.damageIds = [];
    eventState.damageGameComplete = false;
    saveRecords();
    renderCollection("DAMAGED");
  }

  function startDamageGame() {
    const context = damageCanvas.getContext("2d");
    const random = seededRandom(hashSeed(`${getSeed()}|data-damage-game`));
    let width = window.innerWidth;
    let height = window.innerHeight;
    let previousTime = performance.now();
    let timeRemaining = 120_000;
    let hearts = 5;
    let collected = 0;
    let hitCooldown = 0;
    let jetpackClock = 0;
    let yellowClock = 0;
    let yellowStaging = false;
    let yellowLaunchClock = 0;
    let yellowSpawnCount = 0;
    let yellowSpawnClock = 0;
    let finished = false;
    let portal = null;
    let checkpoint = { timeRemaining: 120_000, collected: 0 };
    const cursor = { x: width / 2, y: height / 2 };
    const pluses = Array.from({ length: 5 }, (_, index) => ({
      x: 110 + random() * Math.max(160, width - 220),
      y: 120 + random() * Math.max(120, height - 240),
      collected: false,
      index,
      unlockAt: index * 24_000,
    }));
    let xs = [];
    let jetpacks = [];
    let yellowJetpacks = [];

    function resizeDamageGame() {
      const ratio = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      damageCanvas.width = Math.floor(width * ratio);
      damageCanvas.height = Math.floor(height * ratio);
      damageCanvas.style.width = `${width}px`;
      damageCanvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function makeXs(count) {
      xs = Array.from({ length: count }, (_, index) => ({
        x: 80 + index * 90,
        y: height - 100 - index * 45,
        speed: 118 + index * 12,
        frozenUntil: 0,
        hollowUntil: 0,
      }));
    }

    function resetToCheckpoint(fullReset = false) {
      hearts = 5;
      hitCooldown = performance.now() + 900;
      jetpacks = [];
      yellowJetpacks = [];
      yellowStaging = false;
      jetpackClock = 0;
      yellowClock = 0;
      yellowLaunchClock = 0;
      yellowSpawnCount = 0;
      yellowSpawnClock = 0;
      if (fullReset) {
        timeRemaining = 120_000;
        collected = 0;
        checkpoint = { timeRemaining: 120_000, collected: 0 };
        pluses.forEach((plus) => { plus.collected = false; });
      } else {
        timeRemaining = checkpoint.timeRemaining;
        collected = checkpoint.collected;
        pluses.forEach((plus, index) => { plus.collected = index < checkpoint.collected; });
      }
      makeXs(3 + Math.floor(collected / 2));
      damageMessage.textContent = fullReset ? "RECOVERY RESET" : "CHECKPOINT RESTORED";
      damageMessage.classList.remove("hidden");
      window.setTimeout(() => damageMessage.classList.add("hidden"), 650);
    }

    function updateHud() {
      damageTimer.textContent = formatTimer(timeRemaining);
      damageHearts.textContent = `${"♥".repeat(Math.floor(hearts))}${hearts % 1 ? "½" : ""}`;
      damageScore.textContent = `${collected} / 5`;
    }

    function pointerMove(event) {
      cursor.x = event.clientX;
      cursor.y = event.clientY;
    }

    function distance(a, b) {
      return Math.hypot(a.x - b.x, a.y - b.y);
    }

    function spawnJetpack(yellow = false) {
      const corners = [{ x: 0, y: 0 }, { x: width, y: 0 }, { x: 0, y: height }, { x: width, y: height }];
      const start = yellow ? { x: width / 2 + (random() - .5) * 120, y: height / 2 + (random() - .5) * 120 } : corners[Math.floor(random() * corners.length)];
      const angle = Math.atan2(cursor.y - start.y, cursor.x - start.x);
      return { x: start.x, y: start.y, vx: Math.cos(angle) * (yellow ? 390 : 330), vy: Math.sin(angle) * (yellow ? 390 : 330), yellow };
    }

    function spawnStagedYellowJetpack() {
      return { x: width / 2 + (random() - .5) * 120, y: height / 2 + (random() - .5) * 120, vx: 0, vy: 0, yellow: true, armed: false };
    }

    function launchYellowJetpack(jetpack) {
      const angle = Math.atan2(cursor.y - jetpack.y, cursor.x - jetpack.x);
      jetpack.vx = Math.cos(angle) * 390;
      jetpack.vy = Math.sin(angle) * 390;
      jetpack.armed = true;
    }

    function damage(amount) {
      const now = performance.now();
      if (now < hitCooldown || collected >= 5) return;
      hearts -= amount;
      hitCooldown = now + 650;
      if (hearts <= 0) resetToCheckpoint(false);
    }

    function collectPlus(plus) {
      if (120_000 - timeRemaining < plus.unlockAt) return;
      plus.collected = true;
      collected += 1;
      checkpoint = { timeRemaining, collected };
      if (collected % 2 === 0 && collected < 5) {
        xs.push({ x: width - 80, y: 90 + random() * (height - 180), speed: 128 + collected * 8, frozenUntil: 0, hollowUntil: 0 });
      }
      if (collected === 5) {
        jetpacks = [];
        yellowJetpacks = [];
        yellowStaging = false;
      }
      updateHud();
    }

    function clickDamageGame(event) {
      if (portal && distance(cursor, portal) < 36) {
        finishDamageGame();
        return;
      }
      const elapsed = 120_000 - timeRemaining;
      const plus = pluses.find((candidate) => !candidate.collected && elapsed >= candidate.unlockAt && distance(cursor, candidate) < 30);
      if (plus) collectPlus(plus);
    }

    function finishDamageGame() {
      if (finished) return;
      finished = true;
      window.cancelAnimationFrame(damageGameFrame);
      window.removeEventListener("resize", resizeDamageGame);
      damageCanvas.removeEventListener("pointermove", pointerMove);
      damageCanvas.removeEventListener("pointerdown", clickDamageGame);
      damageGame.classList.add("hidden");
      eventState.damageGameComplete = true;
      renderCollection("DAMAGED");
    }

    function updateDamageGame(now) {
      if (finished) return;
      const delta = Math.min(.033, (now - previousTime) / 1000);
      previousTime = now;
      timeRemaining -= delta * 1000;
      if (timeRemaining <= 0) resetToCheckpoint(true);
      if (collected >= 1 && collected < 5) {
        jetpackClock += delta;
        if (jetpackClock > 2.3) {
          jetpackClock = 0;
          const blueBurst = collected >= 3 ? 4 : 2;
          for (let index = 0; index < blueBurst; index += 1) jetpacks.push(spawnJetpack(false));
        }
      }
      if (collected >= 2 && collected < 5) {
        yellowClock += delta;
        if (yellowClock > 5 && !yellowStaging) {
          yellowClock = 0;
          yellowStaging = true;
          yellowLaunchClock = 0;
          yellowSpawnClock = 0;
          yellowSpawnCount = 0;
        }
        if (yellowStaging) {
          yellowLaunchClock += delta;
          yellowSpawnClock += delta;
          if (yellowSpawnCount < 5 && yellowSpawnClock >= .5) {
            yellowSpawnClock = 0;
            yellowSpawnCount += 1;
            yellowJetpacks.push(spawnStagedYellowJetpack());
          }
          if (yellowLaunchClock >= 5) {
            yellowJetpacks.filter((jetpack) => !jetpack.armed).forEach(launchYellowJetpack);
            yellowStaging = false;
            yellowClock = 0;
          }
        }
      }

      xs.forEach((x) => {
        if (now < x.frozenUntil) return;
        const direction = collected >= 5 ? Math.atan2(x.y - cursor.y, x.x - cursor.x) : Math.atan2(cursor.y - x.y, cursor.x - x.x);
        x.x = Math.max(20, Math.min(width - 20, x.x + Math.cos(direction) * x.speed * delta));
        x.y = Math.max(90, Math.min(height - 20, x.y + Math.sin(direction) * x.speed * delta));
      });
      [...jetpacks, ...yellowJetpacks].forEach((jetpack) => {
        jetpack.x += jetpack.vx * delta;
        jetpack.y += jetpack.vy * delta;
      });
      jetpacks = jetpacks.filter((jetpack) => jetpack.x > -80 && jetpack.x < width + 80 && jetpack.y > -80 && jetpack.y < height + 80);
      yellowJetpacks = yellowJetpacks.filter((jetpack) => jetpack.x > -80 && jetpack.x < width + 80 && jetpack.y > -80 && jetpack.y < height + 80);

      xs = xs.filter((x) => {
        if (distance(x, cursor) < 24) {
          if (collected >= 5) return false;
          damage(1);
        }
        return true;
      });
      [...jetpacks, ...yellowJetpacks].forEach((jetpack) => {
        const isFlying = !jetpack.yellow || jetpack.armed;
        if (isFlying && distance(jetpack, cursor) < 20) damage(.5);
        if (collected < 4) xs.forEach((x) => {
          if (isFlying && distance(jetpack, x) < 24) {
            x.frozenUntil = now + 1000;
            x.hollowUntil = now + 1000;
          }
        });
      });
      if (collected >= 5 && !xs.length && !portal) portal = { x: width / 2, y: height / 2 };

      drawDamageGame(now);
      updateHud();
      damageGameFrame = window.requestAnimationFrame(updateDamageGame);
    }

    function drawDamageGame(now) {
      context.clearRect(0, 0, width, height);
      context.fillStyle = "#050711";
      context.fillRect(0, 0, width, height);
      context.strokeStyle = "rgba(255,200,87,.12)";
      for (let x = 0; x < width; x += 44) { context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke(); }
      for (let y = 0; y < height; y += 44) { context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke(); }
      pluses.forEach((plus) => {
        if (plus.collected) return;
        const elapsed = 120_000 - timeRemaining;
        if (elapsed < plus.unlockAt - 3500) return;
        context.save();
        context.translate(plus.x, plus.y);
        context.rotate(now / 650);
        const isUnlocked = elapsed >= plus.unlockAt;
        context.globalAlpha = isUnlocked ? 1 : .25 + .15 * Math.sin(now / 130);
        context.fillStyle = isUnlocked ? "#7ef29a" : "#8a9aa6";
        context.shadowColor = context.fillStyle;
        context.shadowBlur = isUnlocked ? 18 : 6;
        context.fillRect(-6, -22, 12, 44);
        context.fillRect(-22, -6, 44, 12);
        context.globalAlpha = 1;
        context.restore();
      });
      xs.forEach((x) => {
        context.strokeStyle = now < x.hollowUntil ? "#ff91a5" : "#ff6683";
        context.lineWidth = now < x.hollowUntil ? 3 : 6;
        const wiggle = now < x.hollowUntil ? Math.sin(now / 45) * 4 : 0;
        context.beginPath();
        context.moveTo(x.x - 15 + wiggle, x.y - 15);
        context.lineTo(x.x + 15 + wiggle, x.y + 15);
        context.moveTo(x.x + 15 - wiggle, x.y - 15);
        context.lineTo(x.x - 15 - wiggle, x.y + 15);
        context.stroke();
      });
      [...jetpacks, ...yellowJetpacks].forEach((jetpack) => {
        context.fillStyle = jetpack.yellow ? "#ffc857" : "#51d1ff";
        context.shadowColor = context.fillStyle;
        context.shadowBlur = 12;
        context.beginPath();
        context.moveTo(jetpack.x + 14, jetpack.y);
        context.lineTo(jetpack.x - 10, jetpack.y - 9);
        context.lineTo(jetpack.x - 5, jetpack.y);
        context.lineTo(jetpack.x - 10, jetpack.y + 9);
        context.closePath();
        context.fill();
        context.shadowBlur = 0;
      });
      if (portal) {
        context.strokeStyle = "#ffc857";
        context.lineWidth = 7;
        context.shadowColor = "#ffc857";
        context.shadowBlur = 20;
        context.beginPath();
        context.ellipse(portal.x, portal.y, 35, 52, 0, 0, Math.PI * 2);
        context.stroke();
        context.shadowBlur = 0;
      }
      context.fillStyle = now < hitCooldown ? "rgba(230,246,255,.45)" : "#e6f6ff";
      context.beginPath();
      context.arc(cursor.x, cursor.y, 7, 0, Math.PI * 2);
      context.fill();
    }

    damageGame.classList.remove("hidden");
    resizeDamageGame();
    makeXs(3);
    updateHud();
    window.addEventListener("resize", resizeDamageGame);
    damageCanvas.addEventListener("pointermove", pointerMove);
    damageCanvas.addEventListener("pointerdown", clickDamageGame);
    damageGameFrame = window.requestAnimationFrame(updateDamageGame);
  }

  async function markMemorySuspicious(index, isCorrupted) {
    if (activeEvent?.name !== "Memory Corruption") return;
    if (!isCorrupted) {
      await resetActiveEvent("MEMORY FLAG FAILED // CLEAN REGION MARKED");
      return;
    }
    eventState.flaggedMemoryIndexes.add(index);
    const flaggedTargetIndex = eventState.memoryTargets.indexOf(index);
    eventState.memoryTargetIndex = getNextUnflaggedMemoryTargetIndex(flaggedTargetIndex + 1);
    eventState.memoryCycleCount = 0;
    unfreezeMemory();
    if (eventState.flaggedMemoryIndexes.size >= 4) {
      await completeActiveEvent();
    }
  }

  async function resetActiveEvent(reason) {
    if (!activeEvent) return;
    stopEventTimer();
    pauseEventTimer();
    eventKicker.textContent = "RESET // RANDOM EVENT";
    eventDescription.textContent = reason;
    flashRed();
    if (activeEvent.name === "Virus Attack") {
      removeEventVirusRecords();
      virusSelectionMode = false;
      selectedEventRecordIds.clear();
      saveRecords();
    }
    if (activeEvent.name === "Memory Corruption") {
      eventState.flaggedMemoryIndexes.clear();
      eventState.memoryTargetIndex = 0;
      eventState.memoryCycleCount = 0;
      unfreezeMemory();
    }
    renderIntegrity();
    renderCollection(currentCollection);
    await wait(900);
    startActiveEvent();
  }

  async function completeActiveEvent() {
    if (!activeEvent) return;
    stopEventTimer();
    const completedEventName = activeEvent.name;
    const completedFinalEvent = isFinalEventReady() && completedEventName === getFinalEventName();
    if (activeEvent.name === "Virus Attack") {
      removeEventVirusRecords();
      saveRecords();
    }
    if (activeEvent.name === "Memory Corruption") {
      eventState.flaggedMemoryIndexes.clear();
    }
    if (completedEventName === "Data Damage") dataDamageCompletedOnce = true;
    if (completedEventName === "New Data Found!") newDataCompletedOnce = true;
    eventCompletedCount += 1;
    activeEvent = null;
    saveEventProgress();
    if (completedEventName === "Memory Corruption") unfreezeMemory();
    eventKicker.textContent = "COMPLETE // RANDOM EVENT";
    eventTitle.textContent = "Event complete";
    eventDescription.textContent = "System state stabilized. Monitoring for the next incident.";
    eventTimer.textContent = "--:--";
    eventCount.textContent = `${eventCompletedCount} EVENTS COMPLETE`;
    virusSelectionMode = false;
    selectedEventRecordIds.clear();
    renderIntegrity();
    renderCollection(currentCollection);
    if (completedFinalEvent && eventCompletedCount >= 8 && dataDamageCompletedOnce && newDataCompletedOnce) {
      eventDescription.textContent = "Final incident resolved. Database incident command complete.";
      await wait(1600);
      showCompletionModal();
      return;
    }
    await wait(1200);
    scheduleNextEvent();
  }

  function appendEventTerminalLine(text, type) {
    const line = document.createElement("span");
    line.className = `remount-terminal-line ${type}`;
    line.textContent = text;
    eventTerminalOutput.appendChild(line);
    eventTerminalOutput.scrollTop = eventTerminalOutput.scrollHeight;
    return line;
  }

  async function typeEventCommand(command) {
    const line = appendEventTerminalLine("$ ", "command");
    for (const character of command) {
      line.textContent += character;
      eventTerminalOutput.scrollTop = eventTerminalOutput.scrollHeight;
      await wait(58);
    }
  }

  async function runEventTerminal(operations, completionMessage) {
    eventTerminalOutput.replaceChildren();
    eventProgressFill.style.width = "0";
    eventProgressText.textContent = "0%";
    eventTerminalState.textContent = "RUNNING";
    eventTerminal.classList.remove("hidden", "is-closing");
    const duration = operations.reduce((total, operation) => total + operation.command.length * 58 + operation.output.length * 350, 0);
    const commandTask = (async () => {
      for (const operation of operations) {
        await typeEventCommand(operation.command);
        for (const output of operation.output) {
          await wait(350);
          appendEventTerminalLine(output, "output");
        }
      }
    })();
    const progressTask = (async () => {
      const stepDuration = duration / 100;
      for (let progress = 1; progress <= 100; progress += 1) {
        await wait(stepDuration);
        eventProgressFill.style.width = `${progress}%`;
        eventProgressText.textContent = `${progress}%`;
      }
    })();
    await Promise.all([commandTask, progressTask]);
    appendEventTerminalLine(completionMessage, "command");
    eventTerminalState.textContent = "COMPLETE";
    await wait(650);
    eventTerminal.classList.add("is-closing");
    await wait(prefersReducedMotion ? 20 : 400);
    eventTerminal.classList.add("hidden");
    eventTerminal.classList.remove("is-closing");
  }

  inspectFragmentsButton.addEventListener("click", () => {
    const selectedRecord = recordRows.find((row) => row.classList.contains("selected"));
    if (!selectedRecord) return;
    maybeNoteFragmentInspect();
    const { record, type, integrity, fragments, owner, lock } = selectedRecord.dataset;
    const random = seededRandom(hashSeed(`${getSeed()}|${record}|${type}|${integrity}|${fragments}|${owner}|${lock}`));
    const fragment = document.createDocumentFragment();
    const fragmentCount = Math.min(16, Number(fragments) + 8);
    for (let index = 0; index < fragmentCount; index += 1) {
      const block = document.createElement("article");
      block.className = "fragment-block valid";
      block.innerHTML = `<span>FRG-${String(index + 1).padStart(2, "0")}</span><strong>${randomHex(2, random)} ${randomHex(2, random)} ${randomHex(2, random)} ${randomHex(2, random)}</strong><small>0x${randomHex(4, random)} // VALID</small>`;
      fragment.appendChild(block);
    }
    fragmentDialogTitle.textContent = `${record} fragments`;
    fragmentDialogSummary.textContent = `${fragmentCount} sectors mapped // 0 irregular // ${type} // ${owner} // ${lock} // capture ${randomHex(8, random)}`;
    fragmentGrid.replaceChildren(fragment);
    fragmentDialog.showModal();
  });

  fragmentDialogClose.addEventListener("click", () => fragmentDialog.close());
  fragmentDialog.addEventListener("click", (event) => {
    if (event.target === fragmentDialog) fragmentDialog.close();
  });
  integrityDialogClose.addEventListener("click", () => integrityDialog.close());
  integrityDialog.addEventListener("click", (event) => {
    if (event.target === integrityDialog) integrityDialog.close();
  });

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
    document.body.classList.add("defeathackers-loading");
    viewerIntro.classList.remove("hidden");
    databaseManager.classList.add("hidden");
    startButton.disabled = true;
    await typeProgressLine("Initializing database viewer...");
    await typeProgressLine("Loading defense modules...");
    await typeProgressLine("Allocating memory...");
    await wait(250);
    loadingScreen.classList.add("is-complete");
    await wait(1100);
    loadingScreen.hidden = true;
    document.body.classList.remove("defeathackers-loading");
    startButton.disabled = false;
  }

  function showManager(animate = true) {
    ensureRecords();
    restoreEventProgress();
    renderCollection(currentCollection);
    renderMemory();
    renderIntegrity();
    loadingScreen.hidden = true;
    document.body.classList.remove("defeathackers-loading");
    viewerIntro.classList.add("hidden");
    databaseManager.classList.remove("hidden");
    recoveryScreen.classList.add("hidden");
    if (animate) {
      databaseManager.classList.add("is-opening");
      window.setTimeout(() => databaseManager.classList.remove("is-opening"), 550);
    }
    if (document.getElementById("memory-panel").classList.contains("active")) startMemoryStream();
    scheduleHackerTakeover();
    if (readFlag(DEV_TERMINAL_KEY)) showDevTerminal(false);
  }

  const rebootLines = [
    "[    0.000000] Linux version 6.8.7-hackulean (root@viewer07) #1 SMP PREEMPT_DYNAMIC",
    "[    0.000013] Command line: BOOT_IMAGE=/boot/vmlinuz root=/dev/mapper/archive rw",
    "[    0.084110] BIOS-provided physical RAM map loaded",
    "[    0.227904] Memory: 4021184K/4194304K available",
    "[    0.516882] smpboot: Allowing 4 CPUs, 0 hotplug CPUs",
    "[    0.793241] devtmpfs: initialized",
    "[    1.846720] EXT4-fs (dm-0): recovery complete",
    "[    2.190443] EXT4-fs (dm-0): mounted filesystem read-write",
    "[    2.803761] systemd[1]: Hostname set to archive-viewer-07.",
    "[    3.184205] systemd[1]: Reached target Local File Systems.",
    "[    3.519004] systemd[1]: Starting Database Viewer Service...",
    "[    3.880127] dbmanager[608]: loading incident management modules",
    "[    4.203771] dbmanager[608]: validating normal collection",
    "[    4.570016] dbmanager[608]: memory viewer attached",
    "[    4.934522] systemd[1]: Started Database Viewer Service.",
    "[    5.519300] Reboot complete. Returning control to startup loader...",
  ];

  async function runRebootThenStartup() {
    const shouldCompletePuzzle = readFlag(DEV_COMMANDS_READY_KEY);
    removeFlag(DEV_TERMINAL_KEY);
    devTerminal.classList.add("hidden");
    rebootButton.disabled = true;
    updateRebootButton.disabled = true;
    rebootLog.textContent = "";
    updateContinuation.classList.add("hidden");
    rebootScreen.classList.remove("hidden");
    for (const line of rebootLines) {
      const output = document.createElement("span");
      output.textContent = `${line}\n`;
      rebootLog.appendChild(output);
      rebootLog.scrollTop = rebootLog.scrollHeight;
      await wait(85);
    }
    await wait(650);
    rebootScreen.classList.add("hidden");
    if (shouldCompletePuzzle) {
      showCompletionModal();
      rebootButton.disabled = false;
      updateRebootButton.disabled = false;
      return;
    }
    await runLoadingSequence();
    rebootButton.disabled = false;
    updateRebootButton.disabled = false;
  }

  rebootButton.addEventListener("click", runRebootThenStartup);
  updateRebootButton.addEventListener("click", runRebootThenStartup);
  completePuzzleButton.addEventListener("click", () => {
    markPuzzleComplete();
    clearPuzzleStorage();
  });

  recoveryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.disabled) return;
      if (button.dataset.recoveryAction === "restore") handleRestoreDatabase();
      if (button.dataset.recoveryAction === "rebuild") handleRebuildViewer();
      if (button.dataset.recoveryAction === "shell") openEmergencyShell();
    });
  });

  recoveryShellInput.addEventListener("keydown", async (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const command = recoveryShellInput.value;
    recoveryShellInput.value = "";
    await handleShellCommand(command);
  });

  devTerminalInput.addEventListener("keydown", async (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const command = devTerminalInput.value;
    devTerminalInput.value = "";
    await handleDevCommand(command);
  });

  devTerminalClose.addEventListener("click", () => {
    devTerminal.classList.add("hidden");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return;
    const tagName = document.activeElement?.tagName;
    if (tagName === "INPUT" || tagName === "TEXTAREA") return;
    handleSecretTyping(event.key);
  });

  startButton.addEventListener("click", () => {
    startButton.disabled = true;
    resetEventProgress();
    generateSeed();
    generateRecords();
    saveRecords();
    showManager();
  });

  async function runUpdateContinuation() {
    loadingScreen.hidden = true;
    document.body.classList.remove("defeathackers-loading");
    viewerIntro.classList.add("hidden");
    updateContinuation.classList.remove("hidden");
    const params = new URLSearchParams(window.location.search);
    const startingProgress = Math.max(45, Math.min(55, Number(params.get("progress")) || 50));
    updateProgressFill.style.width = `${startingProgress}%`;
    updateProgressText.textContent = `${startingProgress}%`;
    for (let progress = startingProgress + 1; progress <= 100; progress += 1) {
      await wait(70);
      updateProgressFill.style.width = `${progress}%`;
      updateProgressText.textContent = `${progress}%`;
    }
    updateRebootButton.classList.remove("hidden");
    const cleanUrl = `${window.location.pathname}`;
    window.history.replaceState({}, "", cleanUrl);
  }

  if (window.HackuleanStage2Title?.isBlocked()) {
    loadingScreen.hidden = true;
    document.body.classList.remove("defeathackers-loading");
    if (readFlag(HACKERS_DEFEATED_KEY)) {
      removeFlag(RECOVERY_KEY);
      showManager(false);
    } else {
      showRecoveryScreen();
    }
  } else if (document.querySelector(".stage-two-title-screen")) {
    window.addEventListener("hackulean:stage-two-launched", () => showManager(), { once: true });
  } else {
    showManager(false);
  }
  window.addEventListener("pagehide", () => {
    stopMemoryStream();
    window.clearTimeout(hackerTakeoverTimer);
    window.clearTimeout(recoveryAutoAttackTimer);
    window.clearTimeout(shellFlashTimer);
    window.clearInterval(spiderAttackTimer);
    window.clearTimeout(eventStartTimer);
    window.clearTimeout(eventNextTimer);
    window.clearInterval(eventInterval);
  }, { once: true });
})();
