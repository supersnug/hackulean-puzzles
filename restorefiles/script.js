const walkGrid = document.getElementById("walk-grid");
const cellSize = 22;
const trailLength = 12;
const stepDelay = 130;
const walkerCount = 10;
const regionColumns = 5;
const regionRows = 2;

let columns = 0;
let rows = 0;
let walkers = [];
let cells = [];
let walkTimer = 0;
let resizeTimer = 0;
let targetModeActive = false;
let targetedWalker = null;
let targetHitCount = 0;
let targetRoundLocked = false;
let targetKillRound = 0;
let virusDefeated = false;

function cellAt(column, row) {
  return cells[row * columns + column];
}

function renderWalks() {
  cells.forEach((cell) => cell.classList.remove(
    "is-head", "is-trail", "is-clean-crawler", "is-clean-trail",
    "is-targetable", "is-targeted-spider", "is-faded-spider",
    "is-faded-trail", "is-dying-spider"
  ));

  walkers.forEach((walker) => {
    if (walker.isKilled) return;
    walker.trail.forEach(({ column, row }) => {
      cellAt(column, row)?.classList.add("is-trail");
      if (walker.isCleanCrawler) cellAt(column, row)?.classList.add("is-clean-trail");
      if (targetedWalker && walker !== targetedWalker && !walker.isDying) {
        cellAt(column, row)?.classList.add("is-faded-trail");
      }
    });
  });

  walkers.forEach((walker) => {
    if (walker.isKilled) return;
    const head = cellAt(walker.column, walker.row);
    head?.classList.add("is-head");
    if (walker.isCleanCrawler) head?.classList.add("is-clean-crawler");
    if (targetModeActive && !targetedWalker) head?.classList.add("is-targetable");
    if (walker === targetedWalker) head?.classList.add("is-targeted-spider");
    if (targetedWalker && walker !== targetedWalker && !walker.isDying) head?.classList.add("is-faded-spider");
    if (walker.isDying) head?.classList.add("is-dying-spider");
  });
}

function createWalkers() {
  walkers = Array.from({ length: walkerCount }, (_, index) => {
    const regionColumn = index % regionColumns;
    const regionRow = Math.floor(index / regionColumns) % regionRows;
    const minColumn = Math.floor((regionColumn * columns) / regionColumns);
    const maxColumn = Math.max(
      minColumn,
      Math.floor(((regionColumn + 1) * columns) / regionColumns) - 1,
    );
    const minRow = Math.floor((regionRow * rows) / regionRows);
    const maxRow = Math.max(
      minRow,
      Math.floor(((regionRow + 1) * rows) / regionRows) - 1,
    );

    return {
      column: minColumn + Math.floor(Math.random() * (maxColumn - minColumn + 1)),
      row: minRow + Math.floor(Math.random() * (maxRow - minRow + 1)),
      minColumn,
      maxColumn,
      minRow,
      maxRow,
      trail: [],
    };
  });
}

function buildWalkGrid() {
  columns = Math.ceil(window.innerWidth / cellSize);
  rows = Math.ceil(window.innerHeight / cellSize);
  walkGrid.style.setProperty("--walk-columns", columns);
  walkGrid.style.setProperty("--walk-rows", rows);
  walkGrid.style.width = `${columns * cellSize}px`;
  walkGrid.style.height = `${rows * cellSize}px`;

  const fragment = document.createDocumentFragment();
  for (let index = 0; index < columns * rows; index++) {
    const cell = document.createElement("span");
    cell.className = "walk-cell";
    fragment.appendChild(cell);
  }

  walkGrid.replaceChildren(fragment);
  cells = Array.from(walkGrid.children);
  createWalkers();
  renderWalks();
}

function takeRandomStep(walker) {
  if (walker.isKilled || walker.isDying) return;
  const directions = [
    { column: 1, row: 0 },
    { column: -1, row: 0 },
    { column: 0, row: 1 },
    { column: 0, row: -1 },
  ];
  let available = [];

  while (!available.length) {
    const blockedCells = new Set(
      walker.trail.map(({ column, row }) => `${column},${row}`),
    );

    available = directions.filter(({ column, row }) => {
      const nextColumn = walker.column + column;
      const nextRow = walker.row + row;
      return (
        nextColumn >= walker.minColumn &&
        nextColumn <= walker.maxColumn &&
        nextRow >= walker.minRow &&
        nextRow <= walker.maxRow &&
        !blockedCells.has(`${nextColumn},${nextRow}`)
      );
    });

    if (!available.length) {
      if (!walker.trail.length) {
        break;
      }
      walker.trail.shift();
    }
  }

  const direction = available[Math.floor(Math.random() * available.length)];
  if (!direction) {
    return;
  }

  walker.trail.push({ column: walker.column, row: walker.row });
  walker.trail = walker.trail.slice(-trailLength);
  walker.column += direction.column;
  walker.row += direction.row;
}

function advanceWalkers() {
  walkers.forEach(takeRandomStep);
  renderWalks();
}

buildWalkGrid();

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  walkTimer = window.setInterval(advanceWalkers, stepDelay);
}

window.addEventListener("resize", () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(buildWalkGrid, 120);
});

const RECOVERY_MODE_KEY = "restore_files_recovery_mode";
const CLEAN_DATABASE_KEY = "restore_files_clean_database";
const FILE_CORRUPTION_KEY = "restore_files_corrupted_file_indexes";
const VERIFICATION_KEY = "restore_files_verification_complete";
const CLEANED_FILES_KEY = "restore_files_cleaned_file_indexes";
const STUCK_PROGRESS = 62.3;
const loadingFill = document.getElementById("loading-fill");
const loadingPercent = document.getElementById("loading-percent");
const loadingProgress = document.getElementById("loading-progress");
const loadingTitle = document.getElementById("loading-title");
const loadingMessage = document.getElementById("loading-message");
const statusLine = document.getElementById("status-line");
const statusText = document.getElementById("status-text");
const crashDump = document.getElementById("crash-dump");
const crashOutput = document.getElementById("crash-output");
const recoveryScreen = document.getElementById("recovery-screen");
const databaseManagement = document.getElementById("database-management");
const databaseFileGrid = document.getElementById("database-file-grid");
const cleanCorruptionButton = document.getElementById("clean-corruption-button");
const cleaningModal = document.getElementById("cleaning-modal");
const cleaningMessage = document.getElementById("cleaning-message");
const cleaningProgressFill = document.getElementById("cleaning-progress-fill");
const cleaningProgressText = document.getElementById("cleaning-progress-text");
const puzzleCompleteModal = document.getElementById("puzzle-complete-modal");
const returnPuzzleRoot = document.getElementById("return-puzzle-root");
const exitRecoveryButton = document.getElementById("exit-recovery-button");
const networkButton = document.getElementById("network-button");
const networkStatus = document.getElementById("network-status");
const remountButton = document.getElementById("remount-button");
const filesystemStatus = document.getElementById("filesystem-status");
const recoveryNotice = document.getElementById("recovery-notice");
const passwordModal = document.getElementById("password-modal");
const automaticPassword = document.getElementById("automatic-password");
const passwordModalStatus = document.getElementById("password-modal-status");
const remountLog = document.getElementById("remount-log");
const remountLogOutput = document.getElementById("remount-log-output");
const networkCutscene = document.getElementById("network-cutscene");
const networkCutsceneText = document.getElementById("network-cutscene-text");
const scamMessageLayer = document.getElementById("scam-message-layer");
const attackEffectLayer = document.getElementById("attack-effect-layer");
const victoryMessage = document.getElementById("victory-message");

const scamEntities = [];
let entityAnimationFrame = 0;
let lastEntityFrame = 0;
let volleyActive = false;
let spiderVolleyTimer = 0;
let scamBoxesConverging = false;
let infectionFinaleStarted = false;
let coreVolleyTimer = 0;
let coreVolleyActive = false;
let coreCharge = 0;
let cleaningEnabled = false;
let fileCleaningActive = false;
const infectedRecoveryBoxes = new Set();
let pointerX = window.innerWidth * .75;
let pointerY = window.innerHeight * .5;

window.addEventListener("pointermove", (event) => {
  pointerX = event.clientX;
  pointerY = event.clientY;
});

const crashLines = [
  "[    0.000000] Linux version 6.8.7-recovery (root@node03) #1 SMP PREEMPT_DYNAMIC",
  "[    0.000014] Command line: BOOT_IMAGE=/boot/vmlinuz root=/dev/mapper/recovery ro quiet",
  "[    0.021772] x86/fpu: Supporting XSAVE feature 0x001: x87 floating point registers",
  "[    0.083441] BIOS-provided physical RAM map loaded",
  "[    0.194208] ACPI: Early table checksum verification enabled",
  "[    0.488120] smpboot: CPU0: Virtual Recovery Core (family: 0x6, model: 0x8f)",
  "[    0.731902] devtmpfs: initialized",
  "[    1.044381] NET: Registered PF_NETLINK/PF_ROUTE protocol family",
  "[    1.398006] audit: initializing netlink subsys (disabled)",
  "[    1.822604] SCSI subsystem initialized",
  "[    2.106931] nvme nvme0: 16/0/0 default/read/poll queues",
  "[    2.319477] EXT4-fs (dm-0): mounted filesystem 3f9a-03 with ordered data mode",
  "[    2.700183] systemd[1]: Detected architecture x86-64.",
  "[    3.008551] systemd[1]: Hostname set to recovery-node-03.",
  "[    3.411028] systemd[1]: Reached target Local File Systems.",
  "[    3.847730] mirror-agent[412]: opening recovery payload /srv/mirror/payload.img",
  "[    4.209145] mirror-agent[412]: index header verified; 18432 records declared",
  "[    4.683901] mirror-agent[412]: scanning allocation table",
  "[    5.177226] WARNING: I/O error, dev dm-3, sector 0362 op 0x0:(READ)",
  "[    5.598104] WARNING: Buffer I/O error on dev dm-3, logical block 62",
  "[    6.003872] EXT4-fs warning (device dm-3): htree_dirblock_to_tree: bad entry",
  "[    6.444091] mirror-agent[412]: payload progress stalled at 62.3 percent",
  "[    6.802745] BUG: soft lockup - CPU#3 stuck for 22s! [mirror-agent:412]",
  "[    7.214093] RIP: 0010:recovery_map_sector+0x93/0x1d0 [mirror_core]",
  "[    7.600882] RSP: 0018:ffffb82380173d80 EFLAGS: 00010246",
  "[    8.029441] Call Trace:",
  "[    8.113004]  <TASK>",
  "[    8.198720]  database_file_read_index+0x14c/0x2b0 [mirror_core]",
  "[    8.286319]  payload_loader_start+0x71/0x110 [mirror_core]",
  "[    8.371502]  process_one_work+0x174/0x340",
  "[    8.456019]  worker_thread+0x2f0/0x410",
  "[    8.544277]  </TASK>",
  "[    8.901166] WARNING: mirror-agent retry budget exhausted",
  "[    9.206590] systemd[1]: system-load.service: Main process exited, status=139",
  "[    9.605441] FATAL: system-load.service failed with result core-dump",
  "[   10.017828] Kernel panic - not syncing: Fatal exception in database loading",
  "[   10.489304] Kernel Offset: 0x1c600000 from 0xffffffff81000000",
];

const startupLines = [
  "[    0.000000] Linux version 6.8.7-database (root@node03) #1 SMP PREEMPT_DYNAMIC",
  "[    0.000012] Command line: BOOT_IMAGE=/boot/vmlinuz root=/dev/mapper/database rw",
  "[    0.018403] x86/fpu: x87 FPU will use FXSAVE",
  "[    0.062117] BIOS-provided physical RAM map loaded",
  "[    0.141809] Memory: 4021184K/4194304K available",
  "[    0.310622] smpboot: Allowing 4 CPUs, 0 hotplug CPUs",
  "[    0.527193] devtmpfs: initialized",
  "[    0.799405] clocksource: Switched to clocksource tsc-early",
  "[    1.021884] NET: Registered PF_NETLINK/PF_ROUTE protocol family",
  "[    1.298560] audit: initializing netlink subsys",
  "[    1.553421] SCSI subsystem initialized",
  "[    1.784002] usbcore: registered new interface driver usbfs",
  "[    2.039118] nvme nvme0: pci function 0000:00:04.0",
  "[    2.287641] nvme nvme0: 16/0/0 default/read/poll queues",
  "[    2.590184] device-mapper: uevent: version 1.0.3",
  "[    2.812770] EXT4-fs (dm-0): recovery complete",
  "[    3.006431] EXT4-fs (dm-0): mounted filesystem 3f9a-03 read-write",
  "[    3.281509] systemd[1]: Detected architecture x86-64.",
  "[    3.514208] systemd[1]: Hostname set to database-node-03.",
  "[    3.790115] systemd[1]: Started Dispatch Password Requests to Console.",
  "[    4.027691] systemd[1]: Reached target Local File Systems.",
  "[    4.298347] systemd[1]: Starting Load Kernel Modules...",
  "[    4.531807] systemd[1]: Finished Load Kernel Modules.",
  "[    4.774013] systemd[1]: Starting Apply Kernel Variables...",
  "[    5.019340] systemd[1]: Finished Apply Kernel Variables.",
  "[    5.281966] systemd[1]: Starting Network Configuration...",
  "[    5.534782] networkd[301]: eth0: Link UP",
  "[    5.801142] networkd[301]: eth0: Gained carrier",
  "[    6.067290] systemd[1]: Reached target Network.",
  "[    6.308441] systemd[1]: Starting Database File Service...",
  "[    6.590127] database-file[508]: opening /srv/database/files.db",
  "[    6.829004] database-file[508]: allocation table contains 18432 records",
  "[    7.091820] database-file[508]: validating sector index",
  "[    7.326504] database-file[508]: loading database sectors",
  "[    7.581249] systemd[1]: Started Database File Service.",
  "[    7.803691] systemd[1]: Reached target Multi-User System.",
  "[    8.017442] database-node-03 login services ready",
  "[    8.248001] Startup complete. Returning control to database loader...",
];

let loadingValue = 0;
let filesystemWritable = false;
let networkSequenceStarted = false;

function recoveryModeIsSaved() {
  try {
    return window.localStorage.getItem(RECOVERY_MODE_KEY) === "1";
  } catch (_error) {
    return false;
  }
}

function saveRecoveryMode() {
  try {
    window.localStorage.setItem(RECOVERY_MODE_KEY, "1");
  } catch (_error) {
    // Recovery mode still works when browser storage is unavailable.
  }
}

function clearRecoveryMode() {
  try {
    window.localStorage.removeItem(RECOVERY_MODE_KEY);
  } catch (_error) {
    // Continue the startup sequence when browser storage is unavailable.
  }
}

function cleanDatabaseIsSaved() {
  try {
    return window.localStorage.getItem(CLEAN_DATABASE_KEY) === "1";
  } catch (_error) {
    return false;
  }
}

function saveCleanDatabase() {
  try {
    window.localStorage.setItem(CLEAN_DATABASE_KEY, "1");
  } catch (_error) {
    // Continue to Database Management when browser storage is unavailable.
  }
}

function getCorruptedFileIndexes() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(FILE_CORRUPTION_KEY));
    if (
      Array.isArray(saved) &&
      saved.length === 5 &&
      new Set(saved).size === 5 &&
      saved.every((index) => Number.isInteger(index) && index >= 1 && index <= 10)
    ) {
      return saved;
    }
  } catch (_error) {
    // Generate a new arrangement when saved data is absent or malformed.
  }

  const generated = Array.from({ length: 10 }, (_, index) => index + 1)
    .sort(() => Math.random() - .5)
    .slice(0, 5);
  try {
    window.localStorage.setItem(FILE_CORRUPTION_KEY, JSON.stringify(generated));
  } catch (_error) {
    // Continue with the generated in-memory arrangement if storage is blocked.
  }
  return generated;
}

function verificationIsComplete() {
  try {
    return window.localStorage.getItem(VERIFICATION_KEY) === "1";
  } catch (_error) {
    return false;
  }
}

function getCleanedFileIndexes() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(CLEANED_FILES_KEY));
    return Array.isArray(saved) ? saved.filter(Number.isInteger) : [];
  } catch (_error) {
    return [];
  }
}

function saveCleanedFileIndexes(indexes) {
  try {
    window.localStorage.setItem(CLEANED_FILES_KEY, JSON.stringify(indexes));
  } catch (_error) {
    // Continue the current repair session when storage is unavailable.
  }
}

function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function renderLoadingProgress(value) {
  loadingFill.style.width = `${value}%`;
  loadingPercent.textContent = `${value.toFixed(1)}%`;
  loadingProgress.setAttribute("aria-valuenow", value.toFixed(1));
}

function triggerLoadingFailure() {
  loadingValue = STUCK_PROGRESS;
  renderLoadingProgress(loadingValue);
  loadingTitle.textContent = "Loading process unresponsive";
  loadingMessage.textContent = "WARNING: Malicious data detected! System integrity compromised. Attempting to recover...";
  statusText.textContent = "VIRUS DETECTED";
  statusLine.classList.add("is-fault");
  document.body.classList.add("is-glitching");
  window.setTimeout(startCrashDump, 3000);
}

function typeCrashLine(text, line) {
  return new Promise((resolve) => {
    let characterIndex = 0;
    const typingTimer = window.setInterval(() => {
      characterIndex = Math.min(text.length, characterIndex + 8);
      line.textContent = text.slice(0, characterIndex);
      crashDump.scrollTop = crashDump.scrollHeight;
      if (characterIndex >= text.length) {
        window.clearInterval(typingTimer);
        resolve();
      }
    }, 4);
  });
}

async function streamLogLines(lines) {
  for (let index = 0; index < lines.length; index++) {
    const text = lines[index];
    const line = document.createElement("span");
    line.className = "crash-line";
    if (/fatal|panic|bug:|rip:/i.test(text)) line.classList.add("is-fatal");
    else if (/warning|error|stalled|failed/i.test(text)) line.classList.add("is-warning");
    crashOutput.appendChild(line);
    crashOutput.appendChild(document.createTextNode("\n"));
    await typeCrashLine(text, line);
    if (index < lines.length - 1) {
      await new Promise((resolve) => {
        window.setTimeout(resolve, 60 + Math.floor(Math.random() * 121));
      });
    }
  }
}

async function streamCrashDump() {
  await streamLogLines(crashLines);
  await runRecoveryCountdown();
  showRecoveryMode();
}

async function runRecoveryCountdown() {
  await new Promise((resolve) => window.setTimeout(resolve, 500));
  for (let count = 3; count >= 1; count--) {
    const line = document.createElement("span");
    line.className = "crash-line is-warning";
    line.textContent = `[RECOVERY] Entering recovery mode in ${count}...`;
    crashOutput.appendChild(line);
    crashOutput.appendChild(document.createTextNode("\n"));
    crashDump.scrollTop = crashDump.scrollHeight;
    await new Promise((resolve) => window.setTimeout(resolve, 1000));
  }
}

function showRecoveryMode() {
  saveRecoveryMode();
  window.clearInterval(walkTimer);
  document.body.classList.remove("is-glitching");
  document.body.classList.add("is-crashed");
  crashDump.classList.add("hidden");
  recoveryScreen.classList.remove("hidden");
}

function showDatabaseManagement() {
  window.clearInterval(walkTimer);
  window.clearInterval(spiderVolleyTimer);
  window.clearInterval(coreVolleyTimer);
  document.body.classList.remove("is-glitching", "target-mode", "spider-mode", "network-transition");
  document.body.classList.add("is-crashed", "database-management-active");
  crashDump.classList.add("hidden");
  recoveryScreen.classList.add("hidden");
  updateCleaningAccess();
  renderDatabaseFiles();
  databaseManagement.classList.remove("hidden");
  databaseManagement.classList.remove("is-entering");
  void databaseManagement.offsetWidth;
  databaseManagement.classList.add("is-entering");
  buildWalkGrid();
  window.clearInterval(walkTimer);
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    walkTimer = window.setInterval(advanceWalkers, stepDelay);
  }
}

function updateCleaningAccess() {
  const verified = verificationIsComplete();
  cleanCorruptionButton.classList.toggle("locked", !verified);
  cleanCorruptionButton.textContent = verified ? "CLEAN CORRUPTION" : "🔒 LOCKED";
  if (verified) cleanCorruptionButton.removeAttribute("data-tooltip");
  else cleanCorruptionButton.dataset.tooltip = "Complete human verification to access";
}

function renderDatabaseFiles() {
  databaseFileGrid.replaceChildren();
  const corruptedFiles = new Set(getCorruptedFileIndexes());
  const cleanedFiles = new Set(getCleanedFileIndexes());

  for (let index = 1; index <= 10; index++) {
    const card = document.createElement("article");
    const corrupted = corruptedFiles.has(index) && !cleanedFiles.has(index);
    card.className = `database-file-card${corrupted ? " corrupted" : ""}${cleanedFiles.has(index) ? " cleansed" : ""}`;
    card.dataset.fileIndex = String(index);
    card.style.setProperty("--file-delay", `${1900 + index * 90}ms`);
    if (corrupted) {
      card.dataset.tooltip = 'This file seems like it\'s corrupted. Check data code dnQPfcGM with password "DatabaseRecovery!Corrupt".';
    }

    const name = document.createElement("span");
    name.textContent = `data_file_${index}`;
    const status = document.createElement("span");
    status.className = "database-file-status";
    status.textContent = corrupted ? "CORRUPTED" : "HEALTHY";
    card.append(name, status);
    databaseFileGrid.appendChild(card);
  }
}

cleanCorruptionButton.addEventListener("click", () => {
  if (!verificationIsComplete()) {
    return;
  }
  cleaningEnabled = true;
  document.body.classList.add("cleaning-enabled");
  cleanCorruptionButton.disabled = true;
  cleanCorruptionButton.textContent = "SELECT A CORRUPTED FILE";
});

databaseFileGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".database-file-card.corrupted");
  if (!card || !cleaningEnabled || fileCleaningActive) return;
  cleanDatabaseFile(card);
});

async function cleanDatabaseFile(card) {
  fileCleaningActive = true;
  const messages = [
    "Restoring file",
    "Removing corrupted data",
    "Flipping dirty bit",
    "Fixing file header",
    "Resetting permissions",
  ];
  cleaningMessage.textContent = messages[Math.floor(Math.random() * messages.length)];
  cleaningProgressFill.style.width = "0%";
  cleaningProgressText.textContent = "0%";
  cleaningModal.classList.remove("hidden");

  const startedAt = performance.now();
  await new Promise((resolve) => {
    function update(now) {
      const progress = Math.min(1, (now - startedAt) / 3000);
      const percent = Math.round(progress * 100);
      cleaningProgressFill.style.width = `${percent}%`;
      cleaningProgressText.textContent = `${percent}%`;
      if (progress < 1) window.requestAnimationFrame(update);
      else resolve();
    }
    window.requestAnimationFrame(update);
  });

  const fileIndex = Number(card.dataset.fileIndex);
  const cleanedFiles = new Set(getCleanedFileIndexes());
  cleanedFiles.add(fileIndex);
  saveCleanedFileIndexes([...cleanedFiles]);
  card.classList.remove("corrupted");
  card.classList.add("cleansed");
  card.removeAttribute("data-tooltip");
  card.querySelector(".database-file-status").textContent = "HEALTHY";
  cleaningModal.classList.add("hidden");
  fileCleaningActive = false;

  const corruptedFiles = getCorruptedFileIndexes();
  if (corruptedFiles.every((index) => cleanedFiles.has(index))) {
    completeRestoreFilesPuzzle();
  }
}

function clearRestoreFilesStorage() {
  try {
    const keys = [];
    for (let index = 0; index < window.localStorage.length; index++) {
      const key = window.localStorage.key(index);
      if (key?.startsWith("restore_files_")) keys.push(key);
    }
    keys.forEach((key) => window.localStorage.removeItem(key));
  } catch (_error) {
    // The completion screen still works if storage access is restricted.
  }
}

function completeRestoreFilesPuzzle() {
  clearRestoreFilesStorage();
  puzzleCompleteModal.classList.remove("hidden");
}

returnPuzzleRoot.addEventListener("click", () => {
  window.location.href = "/?signal=puzzle_completed&puzzle=03-restorefiles";
});

async function runCleanDatabaseLoading() {
  databaseManagement.classList.add("hidden");
  crashDump.classList.add("hidden");
  recoveryScreen.classList.add("hidden");
  document.body.classList.remove(
    "is-crashed", "is-glitching", "filesystem-remounted", "network-transition",
    "spider-mode", "target-mode"
  );
  statusLine.classList.remove("is-fault");
  statusText.textContent = "DATABASE LOADING";
  loadingTitle.textContent = "Loading files...";
  loadingMessage.textContent = "Loading clean database sectors...";
  loadingValue = 0;
  renderLoadingProgress(loadingValue);
  buildWalkGrid();
  window.clearInterval(walkTimer);
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    walkTimer = window.setInterval(advanceWalkers, stepDelay);
  }

  while (loadingValue < 100) {
    await wait(60);
    loadingValue = Math.min(100, loadingValue + .7 + Math.random() * 1.8);
    renderLoadingProgress(loadingValue);
  }

  loadingTitle.textContent = "Database loaded successfully";
  loadingMessage.textContent = "All database sectors passed integrity checks.";
  statusText.textContent = "DATABASE READY";
  await wait(650);
  showDatabaseManagement();
}

function startCrashDump() {
  document.body.classList.remove("is-glitching");
  document.body.classList.add("is-crashed");
  crashDump.classList.remove("hidden");
  streamCrashDump();
}

async function startDatabaseStartup() {
  const cleanStartup = virusDefeated || cleanDatabaseIsSaved();
  exitRecoveryButton.disabled = true;
  if (cleanStartup) saveCleanDatabase();
  clearRecoveryMode();
  crashOutput.replaceChildren();
  recoveryScreen.classList.add("hidden");
  crashDump.classList.remove("hidden");
  await streamLogLines(startupLines);
  if (cleanStartup) runCleanDatabaseLoading();
  else window.location.reload();
}

exitRecoveryButton.addEventListener("click", startDatabaseStartup);

networkButton.addEventListener("click", () => {
  if (!filesystemWritable) {
    recoveryNotice.textContent = "ERROR: Root filesystem is read-only. The network configuration bit cannot be modified.";
    recoveryNotice.classList.remove("hidden");
    return;
  }

  startNetworkSequence();
});

function startNetworkSequence() {
  if (networkSequenceStarted) return;
  networkSequenceStarted = true;
  networkButton.disabled = true;
  networkButton.textContent = "CONNECTING...";
  networkStatus.textContent = "CONNECTING";
  recoveryNotice.classList.add("hidden");
  networkCutscene.classList.remove("hidden");
  document.body.classList.add("network-transition");

  window.clearInterval(walkTimer);
  walkTimer = window.setInterval(advanceWalkers, 110);

  window.setTimeout(() => {
    networkStatus.textContent = "ONLINE";
    networkButton.textContent = "NETWORK ENABLED";
  }, 900);

  window.setTimeout(() => {
    document.body.classList.remove("network-transition");
    document.body.classList.add("spider-mode");
    networkStatus.textContent = "COMPROMISED";
    networkButton.textContent = "NETWORK COMPROMISED";
    networkCutsceneText.textContent = "MALICIOUS CRAWLERS DETECTED";
  }, 4600);

  window.setTimeout(() => {
    networkCutscene.classList.add("hidden");
    window.setTimeout(pauseSpidersAndSendScams, 3000);
  }, 7000);
}

function pauseSpidersAndSendScams() {
  window.clearInterval(walkTimer);
  walkTimer = 0;

  const messages = [
    "FREE MONEY!!!",
    "CLICK HERE TO WIN",
    "YOU ARE OUR 1,000,000TH VISITOR",
    "CLAIM YOUR PRIZE NOW",
    "FREE CRYPTO GIVEAWAY",
    "YOUR ACCOUNT WILL EXPIRE",
    "URGENT: VERIFY PASSWORD",
    "CONGRATULATIONS, WINNER!",
    "DOUBLE YOUR MONEY TODAY",
    "LIMITED TIME CASH REWARD",
  ];

  const spiderHeads = Array.from(document.querySelectorAll(".walk-cell.is-head"));
  const destinations = [];
  spiderHeads.forEach((head, index) => {
    const bounds = head.getBoundingClientRect();
    const startX = bounds.left + bounds.width / 2;
    const startY = bounds.top + bounds.height / 2;
    const message = document.createElement("span");
    message.className = "scam-message";
    message.textContent = messages[index % messages.length];
    message.style.visibility = "hidden";
    scamMessageLayer.appendChild(message);
    const destination = getRandomScamDestination(
      destinations,
      message.offsetWidth,
      message.offsetHeight,
    );
    if (!destination) {
      message.remove();
      return;
    }
    destinations.push(destination);
    message.style.left = `${startX}px`;
    message.style.top = `${startY}px`;
    message.style.setProperty("--scam-x", `${destination.x - startX}px`);
    message.style.setProperty("--scam-y", `${destination.y - startY}px`);
    message.style.setProperty("--scam-delay", `${index * 75}ms`);
    message.style.setProperty("--scam-duration", `${1300 + Math.floor(Math.random() * 800)}ms`);
    message.style.visibility = "visible";
    scamEntities.push({
      element: message,
      x: destination.x,
      y: destination.y,
      width: message.offsetWidth,
      height: message.offsetHeight,
      velocityX: (Math.random() < .5 ? -1 : 1) * (65 + Math.random() * 55),
      velocityY: (Math.random() < .5 ? -1 : 1) * (65 + Math.random() * 55),
    });
  });

  window.setTimeout(() => {
    exitRecoveryButton.disabled = true;
    walkTimer = window.setInterval(advanceWalkers, 110);
    startEntityAnimation();
    spiderVolleyTimer = window.setInterval(launchSpiderVolley, 3000);
  }, 3000);
}

function startEntityAnimation() {
  scamEntities.forEach((entity) => {
    entity.element.classList.add("is-bouncing");
    entity.element.style.left = `${entity.x}px`;
    entity.element.style.top = `${entity.y}px`;
  });
  if (!entityAnimationFrame) {
    entityAnimationFrame = window.requestAnimationFrame(updateEntities);
  }
}

function updateEntities(timestamp) {
  const elapsed = Math.min(.05, (timestamp - lastEntityFrame) / 1000 || 0);
  lastEntityFrame = timestamp;
  if (!scamBoxesConverging) {
    scamEntities.forEach((entity) => moveBouncingEntity(entity, elapsed));
    resolveScamBoxCollisions();
  }
  entityAnimationFrame = window.requestAnimationFrame(updateEntities);
}

function resolveScamBoxCollisions() {
  for (let firstIndex = 0; firstIndex < scamEntities.length; firstIndex++) {
    for (let secondIndex = firstIndex + 1; secondIndex < scamEntities.length; secondIndex++) {
      const first = scamEntities[firstIndex];
      const second = scamEntities[secondIndex];
      const overlapX = (first.width + second.width) / 2 - Math.abs(first.x - second.x);
      const overlapY = (first.height + second.height) / 2 - Math.abs(first.y - second.y);
      if (overlapX <= 0 || overlapY <= 0) continue;

      if (overlapX < overlapY) {
        const direction = first.x < second.x ? -1 : 1;
        first.x += direction * overlapX / 2;
        second.x -= direction * overlapX / 2;
        [first.velocityX, second.velocityX] = [second.velocityX, first.velocityX];
      } else {
        const direction = first.y < second.y ? -1 : 1;
        first.y += direction * overlapY / 2;
        second.y -= direction * overlapY / 2;
        [first.velocityY, second.velocityY] = [second.velocityY, first.velocityY];
      }
      first.element.style.left = `${first.x}px`;
      first.element.style.top = `${first.y}px`;
      second.element.style.left = `${second.x}px`;
      second.element.style.top = `${second.y}px`;
    }
  }
}

function moveBouncingEntity(entity, elapsed) {
  entity.x += entity.velocityX * elapsed;
  entity.y += entity.velocityY * elapsed;
  const halfWidth = entity.width / 2;
  const halfHeight = entity.height / 2;
  if (entity.x <= halfWidth || entity.x >= window.innerWidth - halfWidth) {
    entity.velocityX *= -1;
    entity.x = Math.max(halfWidth, Math.min(window.innerWidth - halfWidth, entity.x));
  }
  if (entity.y <= halfHeight || entity.y >= window.innerHeight - halfHeight) {
    entity.velocityY *= -1;
    entity.y = Math.max(halfHeight, Math.min(window.innerHeight - halfHeight, entity.y));
  }
  entity.element.style.left = `${entity.x}px`;
  entity.element.style.top = `${entity.y}px`;
}

async function launchSpiderVolley() {
  if (volleyActive || !scamEntities.length) return;
  volleyActive = true;
  const target = scamEntities[Math.floor(Math.random() * scamEntities.length)];
  const sources = [
    ...document.querySelectorAll(".walk-cell.is-head"),
  ];
  await Promise.all(sources.map((source) => shootSpiderDot(source, target)));
  await emitSoundWave(target);
  volleyActive = false;
}

function shootSpiderDot(source, target) {
  const bounds = source.getBoundingClientRect();
  const startX = bounds.left + bounds.width / 2;
  const startY = bounds.top + bounds.height / 2;
  const dot = document.createElement("span");
  dot.className = "spider-shot";
  attackEffectLayer.appendChild(dot);
  const duration = 650;
  const startedAt = performance.now();

  return new Promise((resolve) => {
    function moveDot(now) {
      const progress = Math.min(1, (now - startedAt) / duration);
      dot.style.left = `${startX + (target.x - startX) * progress}px`;
      dot.style.top = `${startY + (target.y - startY) * progress}px`;
      if (progress < 1) window.requestAnimationFrame(moveDot);
      else {
        dot.remove();
        resolve();
      }
    }
    window.requestAnimationFrame(moveDot);
  });
}

function getRecoveryWaveTargets() {
  const boxes = Array.from(document.querySelectorAll(
    ".recovery-badge, .recovery-kicker, .recovery-screen > h1, .recovery-message, .recovery-status > div, .remount-log, .recovery-prompt"
  )).filter((element) =>
    element.getClientRects().length &&
    !infectedRecoveryBoxes.has(element) &&
    !element.classList.contains("wave-targeted")
  );
  const targets = boxes.sort(() => Math.random() - .5).slice(0, 3);
  targets.forEach((target) => target.classList.add("wave-targeted"));
  return targets;
}

async function emitSoundWave(source) {
  const targets = getRecoveryWaveTargets();
  if (!targets.length) return;
  const wave = document.createElement("span");
  wave.className = "sound-wave-pulse";
  wave.style.left = `${source.x}px`;
  wave.style.top = `${source.y}px`;
  attackEffectLayer.appendChild(wave);
  const position = { x: source.x, y: source.y };
  const waveColors = ["#ff7043", "#a96cff", "#51d1ff"];

  for (let index = 0; index < targets.length; index++) {
    const edge = getRandomScreenEdgePoint();
    await moveSoundWave(wave, position, edge.x, edge.y, 330);
    const bounds = targets[index].getBoundingClientRect();
    const targetX = bounds.left + bounds.width / 2;
    const targetY = bounds.top + bounds.height / 2;
    await moveSoundWave(wave, position, targetX, targetY, 430);
    targets[index].classList.remove("wave-targeted");
    targets[index].classList.add("recovery-infected");
    infectedRecoveryBoxes.add(targets[index]);
    wave.style.color = waveColors[index];
  }

  const visibleGridPoint = getVisibleGridPoint();
  const finalEdge = getRandomScreenEdgePoint();
  await moveSoundWave(wave, position, finalEdge.x, finalEdge.y, 330);
  await moveSoundWave(wave, position, visibleGridPoint.x, visibleGridPoint.y, 480);
  wave.remove();
  spawnCrawlerAt(position.x, position.y);
  if (infectedRecoveryBoxes.size === 9) startInfectionFinale();
}

function getVisibleGridPoint() {
  const blockers = [
    ...document.querySelectorAll(".recovery-screen > *:not(.recovery-prompt), .scam-message"),
  ].filter((element) => element.getClientRects().length)
    .map((element) => element.getBoundingClientRect());
  const visibleCells = cells.filter((cell) => {
    const bounds = cell.getBoundingClientRect();
    const x = bounds.left + bounds.width / 2;
    const y = bounds.top + bounds.height / 2;
    return x > 30 && x < window.innerWidth - 30 && y > 30 && y < window.innerHeight - 30 &&
      blockers.every((blocker) =>
        x < blocker.left - 20 || x > blocker.right + 20 || y < blocker.top - 20 || y > blocker.bottom + 20
      );
  });
  const cell = visibleCells[Math.floor(Math.random() * visibleCells.length)];
  if (!cell) return { x: 44, y: window.innerHeight - 44 };
  const bounds = cell.getBoundingClientRect();
  return { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 };
}

function getRandomScreenEdgePoint() {
  const margin = 18;
  const edge = Math.floor(Math.random() * 4);
  if (edge === 0) return { x: margin, y: margin + Math.random() * (window.innerHeight - margin * 2) };
  if (edge === 1) return { x: window.innerWidth - margin, y: margin + Math.random() * (window.innerHeight - margin * 2) };
  if (edge === 2) return { x: margin + Math.random() * (window.innerWidth - margin * 2), y: margin };
  return { x: margin + Math.random() * (window.innerWidth - margin * 2), y: window.innerHeight - margin };
}

function moveSoundWave(wave, position, destinationX, destinationY, duration) {
  const startX = position.x;
  const startY = position.y;
  const startedAt = performance.now();
  return new Promise((resolve) => {
    function move(now) {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 2);
      position.x = startX + (destinationX - startX) * eased;
      position.y = startY + (destinationY - startY) * eased;
      wave.style.left = `${position.x}px`;
      wave.style.top = `${position.y}px`;
      if (progress < 1) window.requestAnimationFrame(move);
      else resolve();
    }
    window.requestAnimationFrame(move);
  });
}

function spawnCrawlerAt(x, y) {
  const crawler = {
    column: Math.max(0, Math.min(columns - 1, Math.floor(x / cellSize))),
    row: Math.max(0, Math.min(rows - 1, Math.floor(y / cellSize))),
    minColumn: 0,
    maxColumn: columns - 1,
    minRow: 0,
    maxRow: rows - 1,
    trail: [],
    isCleanCrawler: true,
  };
  walkers.push(crawler);
  renderWalks();
  window.setTimeout(() => {
    crawler.isCleanCrawler = false;
    renderWalks();
  }, 900);
}

async function startInfectionFinale() {
  if (infectionFinaleStarted) return;
  infectionFinaleStarted = true;
  window.clearInterval(spiderVolleyTimer);
  const infectedBoxes = Array.from(infectedRecoveryBoxes);
  infectedBoxes.forEach((box, index) => {
    box.style.setProperty("--box-glitch-delay", `${index * 70}ms`);
    box.classList.add("infection-collapse");
  });
  await wait(1500);
  infectedBoxes.forEach((box) => box.classList.add("infection-gone"));
  document.querySelector(".recovery-status")?.classList.add("infection-shell-cleared");
  await convergeScamBoxes();
}

async function convergeScamBoxes() {
  scamBoxesConverging = true;
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  scamEntities.forEach((entity, index) => {
    entity.element.style.transition = `left 1.5s cubic-bezier(.5,0,.2,1) ${index * 35}ms, top 1.5s cubic-bezier(.5,0,.2,1) ${index * 35}ms, opacity 300ms ease 1.3s`;
    entity.element.style.left = `${centerX}px`;
    entity.element.style.top = `${centerY}px`;
    entity.element.style.opacity = "0";
  });
  await wait(1900);
  scamEntities.forEach((entity) => entity.element.classList.add("hidden"));

  const core = document.createElement("span");
  core.className = "infection-core";
  core.style.left = `${centerX}px`;
  core.style.top = `${centerY}px`;
  attackEffectLayer.appendChild(core);
  await wait(500);
  startCoreVolleys(core, centerX, centerY);
}

function startCoreVolleys(core, centerX, centerY) {
  fireCoreVolley(core, centerX, centerY);
  coreVolleyTimer = window.setInterval(() => {
    fireCoreVolley(core, centerX, centerY);
  }, 3000);
}

async function fireCoreVolley(core, centerX, centerY) {
  if (coreVolleyActive) return;
  coreVolleyActive = true;
  const sources = Array.from(document.querySelectorAll(".walk-cell.is-head"));
  await Promise.all(sources.map((source) => shootSpiderDot(source, { x: centerX, y: centerY })));
  coreCharge = Math.min(5, coreCharge + 1);
  updateCoreCharge(core);
  core.classList.add("is-charged");
  await wait(250);
  core.classList.remove("is-charged");
  const cursorWasHit = await launchCursorDirectedWave(centerX, centerY);
  if (cursorWasHit) {
    coreCharge = 0;
    updateCoreCharge(core);
  } else if (coreCharge === 5) {
    enterCoreReadyState(core);
  }
  coreVolleyActive = false;
}

function updateCoreCharge(core) {
  const amount = coreCharge / 5;
  const red = Math.round(255 + (81 - 255) * amount);
  const green = Math.round(38 + (209 - 38) * amount);
  const blue = Math.round(61 + (255 - 61) * amount);
  const color = `rgb(${red}, ${green}, ${blue})`;
  core.style.background = color;
  core.style.boxShadow = `0 0 ${26 + amount * 14}px ${10 + amount * 8}px rgba(${red}, ${green}, ${blue}, .72)`;
}

function enterCoreReadyState(core) {
  window.clearInterval(coreVolleyTimer);
  core.classList.remove("is-charged");
  core.style.removeProperty("background");
  core.style.removeProperty("box-shadow");
  core.style.setProperty("background-color", "transparent", "important");
  core.classList.add("is-ready");
  core.setAttribute("role", "button");
  core.setAttribute("aria-label", "Open virus targeting mode");
  core.tabIndex = 0;
  const activate = () => expandCoreIntoTargetMode(core);
  core.addEventListener("click", activate, { once: true });
  core.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activate();
    }
  }, { once: true });
}

async function expandCoreIntoTargetMode(core) {
  if (core.classList.contains("is-expanding")) return;
  core.style.setProperty("--core-expansion", `${Math.hypot(window.innerWidth, window.innerHeight) / 42 + 2}`);
  core.classList.add("is-expanding");
  await wait(750);
  core.remove();
  startTargetMode();
}

async function launchCursorDirectedWave(startX, startY) {
  let directionX = pointerX - startX;
  let directionY = pointerY - startY;
  if (Math.abs(directionX) + Math.abs(directionY) < 1) directionX = 1;
  const margin = 24;
  const horizontalTime = directionX > 0
    ? (window.innerWidth - margin - startX) / directionX
    : directionX < 0
      ? (margin - startX) / directionX
      : Number.POSITIVE_INFINITY;
  const verticalTime = directionY > 0
    ? (window.innerHeight - margin - startY) / directionY
    : directionY < 0
      ? (margin - startY) / directionY
      : Number.POSITIVE_INFINITY;
  const travelTime = Math.min(horizontalTime, verticalTime);
  const destinationX = startX + directionX * travelTime;
  const destinationY = startY + directionY * travelTime;
  const wave = document.createElement("span");
  wave.className = "sound-wave-pulse cursor-wave";
  wave.style.left = `${startX}px`;
  wave.style.top = `${startY}px`;
  attackEffectLayer.appendChild(wave);
  const startedAt = performance.now();
  let cursorWasHit = false;
  await new Promise((resolve) => {
    function move(now) {
      const progress = Math.min(1, (now - startedAt) / 1200);
      const x = startX + (destinationX - startX) * progress;
      const y = startY + (destinationY - startY) * progress;
      wave.style.left = `${x}px`;
      wave.style.top = `${y}px`;
      if (Math.hypot(pointerX - x, pointerY - y) < 34) cursorWasHit = true;
      if (progress < 1) window.requestAnimationFrame(move);
      else resolve();
    }
    window.requestAnimationFrame(move);
  });
  wave.remove();
  return cursorWasHit;
}

function setWalkerSpeed(milliseconds) {
  window.clearInterval(walkTimer);
  walkTimer = window.setInterval(advanceWalkers, milliseconds);
}

function startTargetMode() {
  targetModeActive = true;
  targetedWalker = null;
  targetHitCount = 0;
  targetRoundLocked = false;
  document.body.classList.add("target-mode");
  setWalkerSpeed(420);
  renderWalks();
}

walkGrid.addEventListener("click", (event) => {
  if (!targetModeActive || targetRoundLocked) return;
  const cell = event.target.closest(".walk-cell.is-head");
  if (!cell) return;
  const cellIndex = cells.indexOf(cell);
  const column = cellIndex % columns;
  const row = Math.floor(cellIndex / columns);
  const walker = walkers.find((entry) =>
    !entry.isKilled && entry.column === column && entry.row === row &&
    (!targetedWalker || entry === targetedWalker)
  );
  if (!walker) return;

  if (!targetedWalker) {
    targetedWalker = walker;
    targetHitCount = 0;
    setWalkerSpeed(420);
    renderWalks();
    return;
  }

  targetHitCount += 1;
  cell.classList.add("target-impact");
  window.setTimeout(() => cell.classList.remove("target-impact"), 180);
  if (targetHitCount >= 3) eliminateTargetGroup();
});

async function eliminateTargetGroup() {
  if (!targetedWalker || targetRoundLocked) return;
  targetRoundLocked = true;
  window.clearInterval(walkTimer);
  targetKillRound += 1;
  const availableCompanions = walkers
    .filter((walker) => !walker.isKilled && walker !== targetedWalker)
    .sort(() => Math.random() - .5);
  const companions = targetKillRound === 1
    ? availableCompanions.slice(0, 5)
    : availableCompanions;

  targetedWalker.isDying = true;
  renderWalks();
  await wait(550);
  companions.forEach((walker) => { walker.isDying = true; });
  renderWalks();
  await wait(900);

  [targetedWalker, ...companions].forEach((walker) => {
    walker.isDying = false;
    walker.isKilled = true;
    walker.trail = [];
  });
  targetedWalker = null;
  targetHitCount = 0;
  renderWalks();

  if (walkers.some((walker) => !walker.isKilled)) {
    await wait(500);
    targetRoundLocked = false;
    setWalkerSpeed(420);
    renderWalks();
  } else {
    completeVirusBattle();
  }
}

async function completeVirusBattle() {
  virusDefeated = true;
  targetModeActive = false;
  targetRoundLocked = true;
  document.body.classList.remove("target-mode");
  window.clearInterval(walkTimer);
  networkStatus.textContent = "ONLINE";
  exitRecoveryButton.disabled = false;
  document.querySelector(".recovery-status")?.classList.remove("infection-shell-cleared");
  document.querySelectorAll(".recovery-status > div").forEach((box) => {
    box.classList.remove("infection-collapse", "infection-gone", "recovery-infected");
    box.style.removeProperty("--box-glitch-delay");
  });
  victoryMessage.classList.remove("hidden");
  const messages = [
    "YOU HAVE DEFEATED THE VIRUS",
    "BUT YOU HAVE NOT RECOVERED YOUR FILES",
    "EXIT RECOVERY TO RECOVERY YOUR FILES",
  ];
  for (const text of messages) {
    const line = document.createElement("p");
    line.textContent = text;
    victoryMessage.appendChild(line);
    await wait(1400);
  }
}

function getRandomScamDestination(existingDestinations, width, height) {
  const padding = 12;
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const minimumX = halfWidth + padding;
  const maximumX = Math.max(minimumX, window.innerWidth - halfWidth - padding);
  const minimumY = halfHeight + padding;
  const maximumY = Math.max(minimumY, window.innerHeight - halfHeight - padding);
  function createCandidate(x, y) {
    return {
      x,
      y,
      left: x - halfWidth,
      right: x + halfWidth,
      top: y - halfHeight,
      bottom: y + halfHeight,
    };
  }

  function candidateHasRoom(candidate) {
    return existingDestinations.every((destination) =>
      candidate.right + padding <= destination.left ||
      candidate.left >= destination.right + padding ||
      candidate.bottom + padding <= destination.top ||
      candidate.top >= destination.bottom + padding
    );
  }

  for (let attempt = 0; attempt < 2000; attempt++) {
    const x = minimumX + Math.random() * Math.max(1, maximumX - minimumX);
    const y = minimumY + Math.random() * Math.max(1, maximumY - minimumY);
    const candidate = createCandidate(x, y);
    if (candidateHasRoom(candidate)) return candidate;
  }

  const freeCandidates = [];
  const scanStep = 8;
  const scanOffsetX = Math.random() * scanStep;
  const scanOffsetY = Math.random() * scanStep;
  for (let y = minimumY + scanOffsetY; y <= maximumY; y += scanStep) {
    for (let x = minimumX + scanOffsetX; x <= maximumX; x += scanStep) {
      const candidate = createCandidate(x, y);
      if (candidateHasRoom(candidate)) freeCandidates.push(candidate);
    }
  }

  if (freeCandidates.length) {
    return freeCandidates[Math.floor(Math.random() * freeCandidates.length)];
  }

  // Extremely small viewports may not physically fit every full-size label.
  // Omitting one is preferable to knowingly overlapping another message.
  return null;
}

async function runRemountSequence() {
  remountButton.disabled = true;
  recoveryNotice.classList.add("hidden");
  automaticPassword.value = "";
  passwordModalStatus.textContent = "Enter your root password to continue.";
  passwordModal.classList.remove("hidden");

  await wait(650);
  for (let index = 0; index < 14; index++) {
    automaticPassword.value += "x";
    await wait(75 + Math.floor(Math.random() * 55));
  }

  await wait(350);
  passwordModalStatus.textContent = "Password accepted.";
  await wait(650);
  passwordModal.classList.add("hidden");
  remountLog.classList.remove("hidden");

  const lines = [
    "[mount] checking /dev/mapper/database-root...",
    "[ext4] journal replay complete",
    "[mount] clearing read-only filesystem flag",
    "[mount] remounting / as read-write",
    "[  OK  ] Root filesystem mounted read-write.",
  ];

  for (const text of lines) {
    const line = document.createElement("p");
    line.textContent = text;
    remountLogOutput.appendChild(line);
    await wait(240 + Math.floor(Math.random() * 180));
  }

  filesystemWritable = true;
  filesystemStatus.textContent = "READ-WRITE";
  remountButton.textContent = "FILESYSTEM REMOUNTED";
  document.body.classList.add("filesystem-remounted");
}

remountButton.addEventListener("click", runRemountSequence);

const cleanDatabaseSaved = cleanDatabaseIsSaved();
const recoveryModeSaved = recoveryModeIsSaved();

if (cleanDatabaseSaved) {
  showDatabaseManagement();
} else if (recoveryModeSaved) {
  showRecoveryMode();
}

const loadingTimer = cleanDatabaseSaved || recoveryModeSaved
  ? 0
  : window.setInterval(() => {
    loadingValue = Math.min(STUCK_PROGRESS, loadingValue + 0.7 + Math.random() * 1.8);
    renderLoadingProgress(loadingValue);

    if (loadingValue >= STUCK_PROGRESS) {
      window.clearInterval(loadingTimer);
      window.setTimeout(triggerLoadingFailure, 650);
    }
  }, 85);
