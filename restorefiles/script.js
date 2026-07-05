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

function cellAt(column, row) {
  return cells[row * columns + column];
}

function renderWalks() {
  cells.forEach((cell) => cell.classList.remove("is-head", "is-trail"));

  walkers.forEach((walker) => {
    walker.trail.forEach(({ column, row }) => {
      cellAt(column, row)?.classList.add("is-trail");
    });
  });

  walkers.forEach((walker) => {
    cellAt(walker.column, walker.row)?.classList.add("is-head");
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

let loadingValue = 0;

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

async function streamCrashDump() {
  for (const text of crashLines) {
    const line = document.createElement("span");
    line.className = "crash-line";
    if (/fatal|panic|bug:|rip:/i.test(text)) line.classList.add("is-fatal");
    else if (/warning|error|stalled|failed/i.test(text)) line.classList.add("is-warning");
    crashOutput.appendChild(line);
    crashOutput.appendChild(document.createTextNode("\n"));
    await typeCrashLine(text, line);
    await new Promise((resolve) => {
      window.setTimeout(resolve, 60 + Math.floor(Math.random() * 121));
    });
  }

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

function startCrashDump() {
  document.body.classList.remove("is-glitching");
  document.body.classList.add("is-crashed");
  crashDump.classList.remove("hidden");
  streamCrashDump();
}

const recoveryModeSaved = recoveryModeIsSaved();

if (recoveryModeSaved) {
  showRecoveryMode();
}

const loadingTimer = recoveryModeSaved
  ? 0
  : window.setInterval(() => {
    loadingValue = Math.min(STUCK_PROGRESS, loadingValue + 0.7 + Math.random() * 1.8);
    renderLoadingProgress(loadingValue);

    if (loadingValue >= STUCK_PROGRESS) {
      window.clearInterval(loadingTimer);
      window.setTimeout(triggerLoadingFailure, 650);
    }
  }, 85);
