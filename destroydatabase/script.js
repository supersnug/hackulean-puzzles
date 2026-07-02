const actionButton = document.getElementById("action-button");
const pageBody = document.body;
const gridOverlay = document.getElementById("grid-overlay");
const bootStatus = document.getElementById("boot-status");
const starterPanel = document.querySelector(".starter-panel");
const managementScreen = document.getElementById("management-screen");
const statusBox = document.querySelector(".management-status-box");
const accessState = document.getElementById("access-state");
const monitoringState = document.getElementById("monitoring-state");
const securityAlertMessage = document.getElementById("security-alert-message");
const commandList = document.getElementById("management-command-list");
const commandButtons = Array.from(document.querySelectorAll(".command-button"));
const commandsLock = document.getElementById("commands-lock");
const rootOpsPanel = document.getElementById("root-ops-panel");
const disableMonitoringButton = document.getElementById("disable-monitoring-button");
const changeBypassButton = document.getElementById("change-bypass-button");
const sqlTerminalButton = document.getElementById("sql-terminal-button");
const requestAccessButton = document.getElementById("request-access-button");
const logEntries = document.getElementById("management-log-entries");
const securityAlertModal = document.getElementById("security-alert-modal");
const securityAlertReason = document.getElementById("security-alert-reason");
const securityAlertAck = document.getElementById("security-alert-ack");
const requestAccessModal = document.getElementById("request-access-modal");
const requestAccessForm = document.getElementById("request-access-form");
const requestAccessSubmit = document.getElementById("request-access-submit");
const requestAccessCancel = document.getElementById("request-access-cancel");
const requestDeniedModal = document.getElementById("request-denied-modal");
const requestDeniedClose = document.getElementById("request-denied-close");
const bypassModal = document.getElementById("bypass-modal");
const bypassDescription = document.getElementById("bypass-description");
const bypassForm = document.getElementById("bypass-form");
const bypassCodeInput = document.getElementById("bypass-code-input");
const bypassError = document.getElementById("bypass-error");
const bypassCancel = document.getElementById("bypass-cancel");
const changeBypassModal = document.getElementById("change-bypass-modal");
const changeBypassForm = document.getElementById("change-bypass-form");
const oldBypassCodeInput = document.getElementById("old-bypass-code");
const newBypassCodeInput = document.getElementById("new-bypass-code");
const changeBypassError = document.getElementById("change-bypass-error");
const changeBypassCancel = document.getElementById("change-bypass-cancel");
const infoModal = document.getElementById("info-modal");
const infoMessage = document.getElementById("info-message");
const infoClose = document.getElementById("info-close");
const sqlTerminalModal = document.getElementById("sql-terminal-modal");
const sqlDatabaseList = document.getElementById("sql-database-list");
const sqlTerminalOutput = document.getElementById("sql-terminal-output");
const sqlTerminalForm = document.getElementById("sql-terminal-form");
const sqlCommandInput = document.getElementById("sql-command-input");
const sqlTerminalClose = document.getElementById("sql-terminal-close");
const takeoverButton = document.getElementById("takeover-button");
const takeoverModal = document.getElementById("takeover-modal");
const takeoverProgressFill = document.getElementById("takeover-progress-fill");
const takeoverProgressText = document.getElementById("takeover-progress-text");
const puzzleCompleteModal = document.getElementById("puzzle-complete-modal");
const returnRootButton = document.getElementById("return-root-button");

const GRID_PERIOD = 22;
const GRID_CELL_SIZE = 22;
const GRID_OFFSET = 0;
const REVEAL_STEP_MS = 38;
const REVEAL_DURATION_MS = 900;
const BOOT_MESSAGE = "Initializing payload... 1%";
const BOOT_PREFIX = "Initializing payload... ";
const BOOT_TYPE_MS = 56;
const BOOT_PROGRESS_MS = 50;
const BOOT_FLICKER_MS = 650;
const PANEL_SWAP_MS = 420;
const COMMAND_SWAP_MS = 280;
const REQUEST_DENIED_DELAY_MS = 2600;
const SESSION_STATE_KEY = "destroy_database_session_state";
const SESSION_STATE_BOOT = "boot";
const SESSION_STATE_LOGGED_IN = "logged_in";
const SESSION_STATE_RESTRICTED = "restricted";
const GAME_STAGE_KEY = "destroy_database_game_stage";
const GAME_STAGE_RECOVERY = "recovery_access";
const BYPASS_CODE_KEY = "destroy_database_bypass_code";
const DEFAULT_BYPASS_CODE = "SecureBypass123";
const BYPASS_ACTION_COMMAND = "command";
const BYPASS_ACTION_DISABLE_MONITORING = "disable_monitoring";
const TARGET_DATABASES = ["PasswordFiles", "DataMain", "AdminCode"];
const PUZZLE_ID = "02-destroydatabase";
const PUZZLE_COMPLETION_DESCRIPTION =
  "You shut down the evil database and took over it to store files!";
const SQL_TERMINAL_TABLES = {
  password_files: {
    label: "password_files",
    columns: ["file_id", "secret_name", "owner_team", "last_updated"],
    rows: [
      {
        file_id: "pf-001",
        secret_name: "ops-vault-rotation.csv",
        owner_team: "security_ops",
        last_updated: "2026-06-21 09:14",
      },
      {
        file_id: "pf-002",
        secret_name: "legacy-admin-notes.txt",
        owner_team: "platform",
        last_updated: "2026-06-18 16:42",
      },
      {
        file_id: "pf-003",
        secret_name: "incident-bridge-credentials.json",
        owner_team: "sre",
        last_updated: "2026-06-29 08:01",
      },
    ],
  },
  data_main: {
    label: "data_main",
    columns: ["record_id", "dataset_name", "status", "updated_at"],
    rows: [
      {
        record_id: "dm-1042",
        dataset_name: "payments_archive",
        status: "replicating",
        updated_at: "2026-06-30 11:12",
      },
      {
        record_id: "dm-1043",
        dataset_name: "support_ticket_index",
        status: "online",
        updated_at: "2026-06-30 11:18",
      },
      {
        record_id: "dm-1044",
        dataset_name: "audit_events",
        status: "online",
        updated_at: "2026-06-30 11:20",
      },
    ],
  },
  admin_code: {
    label: "admin_code",
    columns: ["code_name", "value", "issued_to"],
    rows: [
      {
        code_name: "root_override",
        value: "valid until 2026-07-04",
        issued_to: "platform-admins",
      },
      {
        code_name: "breakglass_sync",
        value: "rotate after incident review",
        issued_to: "on-call",
      },
      {
        code_name: "vault_refresh",
        value: "approved for quarterly rotation",
        issued_to: "security-ops",
      },
    ],
  },
};

let gridColumns = 0;
let gridRows = 0;
let gridTiles = [];
let patternTimer = 0;
let resizeTimer = 0;
let requestSubmitTimer = 0;
let revealStarted = false;
let revealComplete = false;
let securityAlertTriggered = false;
let monitoringEnabled = true;
let accessLevel = "elevated";
let rootOpsEnabled = false;
let pendingBypassAction = null;
let currentBypassCode = DEFAULT_BYPASS_CODE;
let takeoverTimer = 0;
let takeoverProgress = 0;

const remainingDatabases = new Set(TARGET_DATABASES.map((name) => name.toLowerCase()));

const clickedNonRootCommands = new Set();
const nonRootCommandTotal = commandButtons.filter((button) => button.dataset.command !== "grant-root").length;

function readSessionState() {
  try {
    const stored = window.localStorage.getItem(SESSION_STATE_KEY);
    if (
      stored === SESSION_STATE_BOOT ||
      stored === SESSION_STATE_LOGGED_IN ||
      stored === SESSION_STATE_RESTRICTED
    ) {
      return stored;
    }
  } catch (_error) {
    return SESSION_STATE_BOOT;
  }

  return SESSION_STATE_BOOT;
}

function writeSessionState(nextState) {
  try {
    window.localStorage.setItem(SESSION_STATE_KEY, nextState);
  } catch (_error) {
    // Continue without storage if browser settings block localStorage.
  }
}

function readGameStage() {
  try {
    return window.localStorage.getItem(GAME_STAGE_KEY) || "";
  } catch (_error) {
    return "";
  }
}

function writeGameStage(nextStage) {
  try {
    window.localStorage.setItem(GAME_STAGE_KEY, nextStage);
  } catch (_error) {
    // Continue without storage if browser settings block localStorage.
  }
}

function readBypassCode() {
  try {
    const stored = window.localStorage.getItem(BYPASS_CODE_KEY);
    if (stored && stored.trim()) {
      return stored;
    }
  } catch (_error) {
    return DEFAULT_BYPASS_CODE;
  }

  return DEFAULT_BYPASS_CODE;
}

function writeBypassCode(nextCode) {
  try {
    window.localStorage.setItem(BYPASS_CODE_KEY, nextCode);
  } catch (_error) {
    // Continue without storage if browser settings block localStorage.
  }
}

function appendLog(level, message) {
  if (!logEntries) {
    return;
  }

  const line = document.createElement("p");
  line.textContent = `[${level}] ${message}`;
  logEntries.appendChild(line);

  while (logEntries.childElementCount > 16) {
    logEntries.removeChild(logEntries.firstElementChild);
  }
}

function setMonitoringDisplay(isActive, isAlert) {
  monitoringEnabled = isActive;
  monitoringState.textContent = isActive ? "Monitoring Active" : "Monitoring Inactive";
  monitoringState.classList.toggle("is-alert", Boolean(isAlert));
}

function setGlitchLevel(level) {
  pageBody.classList.remove("glitch-level-1", "glitch-level-2", "glitch-level-3", "glitch-level-4");
  if (level > 0) {
    pageBody.classList.add(`glitch-level-${Math.min(4, level)}`);
  }
}

function appendTerminalLine(message) {
  if (!sqlTerminalOutput) {
    return;
  }

  const line = document.createElement("p");
  line.textContent = message;
  sqlTerminalOutput.appendChild(line);

  while (sqlTerminalOutput.childElementCount > 18) {
    sqlTerminalOutput.removeChild(sqlTerminalOutput.firstElementChild);
  }

  sqlTerminalOutput.scrollTop = sqlTerminalOutput.scrollHeight;
}

function appendSqlTableRows(columns, rows) {
  if (!sqlTerminalOutput) {
    return;
  }

  appendTerminalLine(columns.join(" | "));
  appendTerminalLine(columns.map(() => "---").join(" | "));

  rows.forEach((row) => {
    appendTerminalLine(columns.map((column) => row[column] ?? "").join(" | "));
  });
}

function getSqlTable(commandName) {
  return SQL_TERMINAL_TABLES[commandName.toLowerCase().replace(/[^a-z0-9_]/g, "")];
}

function showSqlHelp() {
  appendTerminalLine("Available commands:");
  appendTerminalLine("HELP");
  appendTerminalLine("SELECT * FROM password_files;");
  appendTerminalLine("SELECT file_id, secret_name FROM password_files;");
  appendTerminalLine("SELECT * FROM data_main;");
  appendTerminalLine("SELECT code_name, value FROM admin_code;");
  appendTerminalLine("DROP DATABASE <name>;");
  appendTerminalLine("WARNING: DROP DATABASE commands are very dangerous and should not be used unless neccessary!");
}

function handleSelectCommand(command) {
  const selectMatch = command.match(/^select\s+(.+?)\s+from\s+([a-zA-Z0-9_]+)(?:\s+limit\s+(\d+))?$/i);

  if (!selectMatch) {
    appendTerminalLine("[ERROR] Invalid SELECT statement.");
    return;
  }

  const requestedColumns = selectMatch[1].trim();
  const tableName = selectMatch[2].toLowerCase();
  const limitValue = selectMatch[3] ? Number.parseInt(selectMatch[3], 10) : null;
  const table = getSqlTable(tableName);

  if (!table) {
    appendTerminalLine(`[ERROR] Unknown table: ${tableName}`);
    return;
  }

  const columns = requestedColumns === "*"
    ? table.columns
    : requestedColumns.split(",").map((column) => column.trim()).filter(Boolean);

  const invalidColumns = columns.filter((column) => !table.columns.includes(column));
  if (invalidColumns.length > 0) {
    appendTerminalLine(`[ERROR] Unknown column(s): ${invalidColumns.join(", ")}`);
    return;
  }

  const rows = limitValue === null ? table.rows : table.rows.slice(0, limitValue);
  appendTerminalLine(`[OK] ${rows.length} row(s) returned from ${table.label}.`);
  appendSqlTableRows(columns, rows);
}

function renderDatabaseList() {
  if (!sqlDatabaseList) {
    return;
  }

  sqlDatabaseList.replaceChildren();

  TARGET_DATABASES.forEach((dbName) => {
    if (!remainingDatabases.has(dbName.toLowerCase())) {
      return;
    }

    const item = document.createElement("li");
    item.setAttribute("data-db", dbName);
    item.textContent = dbName;
    sqlDatabaseList.appendChild(item);
  });
}

function clearPuzzleSpecificStorage() {
  try {
    const keysToRemove = [];
    for (let index = 0; index < window.localStorage.length; index++) {
      const key = window.localStorage.key(index);
      if (key && key.startsWith("destroy_database_")) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => {
      window.localStorage.removeItem(key);
    });
  } catch (_error) {
    // Continue even when storage APIs are restricted.
  }
}

function completePuzzle() {
  hideSqlTerminalModal();
  hideTakeoverModal();
  clearPuzzleSpecificStorage();
  setGlitchLevel(0);

  puzzleCompleteModal?.classList.remove("is-hidden");
  puzzleCompleteModal?.setAttribute("aria-hidden", "false");
}

function showInfoModal(message, titleText = "System Notice") {
  if (!infoModal || !infoMessage) {
    return;
  }

  const titleElement = infoModal.querySelector("#info-title");
  if (titleElement) {
    titleElement.textContent = titleText;
  }

  infoMessage.textContent = message;
  infoModal.classList.remove("is-hidden");
  infoModal.setAttribute("aria-hidden", "false");
}

function hideInfoModal() {
  if (!infoModal) {
    return;
  }

  infoModal.classList.add("is-hidden");
  infoModal.setAttribute("aria-hidden", "true");
}

function showManagementScreen(animate) {
  if (!managementScreen) {
    return;
  }

  managementScreen.classList.remove("is-hidden");
  managementScreen.setAttribute("aria-hidden", "false");
  managementScreen.classList.toggle("is-flicker-in", Boolean(animate));
}

function hideRequestAccessModal() {
  if (!requestAccessModal) {
    return;
  }

  requestAccessModal.classList.add("is-hidden");
  requestAccessModal.setAttribute("aria-hidden", "true");
}

function showRequestAccessModal() {
  if (!requestAccessModal) {
    return;
  }

  requestAccessModal.classList.remove("is-hidden");
  requestAccessModal.setAttribute("aria-hidden", "false");
}

function hideRequestDeniedModal() {
  if (!requestDeniedModal) {
    return;
  }

  requestDeniedModal.classList.add("is-hidden");
  requestDeniedModal.setAttribute("aria-hidden", "true");
}

function showRequestDeniedModal() {
  if (!requestDeniedModal) {
    return;
  }

  requestDeniedModal.classList.remove("is-hidden");
  requestDeniedModal.setAttribute("aria-hidden", "false");
}

function hideSqlTerminalModal() {
  if (!sqlTerminalModal) {
    return;
  }

  sqlTerminalModal.classList.add("is-hidden");
  sqlTerminalModal.setAttribute("aria-hidden", "true");
}

function showSqlTerminalModal() {
  if (!sqlTerminalModal) {
    return;
  }

  sqlTerminalModal.classList.remove("is-hidden");
  sqlTerminalModal.setAttribute("aria-hidden", "false");
  sqlCommandInput?.focus();
}

function hideTakeoverModal() {
  if (!takeoverModal) {
    return;
  }

  takeoverModal.classList.add("is-hidden");
  takeoverModal.setAttribute("aria-hidden", "true");
}

function showTakeoverModal() {
  if (!takeoverModal) {
    return;
  }

  takeoverModal.classList.remove("is-hidden");
  takeoverModal.setAttribute("aria-hidden", "false");
}

function hidePuzzleCompleteModal() {
  if (!puzzleCompleteModal) {
    return;
  }

  puzzleCompleteModal.classList.add("is-hidden");
  puzzleCompleteModal.setAttribute("aria-hidden", "true");
}

function hideSecurityAlertModal() {
  if (!securityAlertModal) {
    return;
  }

  securityAlertModal.classList.add("is-hidden");
  securityAlertModal.setAttribute("aria-hidden", "true");
}

function showSecurityAlertModal(reason) {
  if (!securityAlertModal) {
    return;
  }

  if (securityAlertReason) {
    securityAlertReason.textContent = reason;
  }

  securityAlertModal.classList.remove("is-hidden");
  securityAlertModal.setAttribute("aria-hidden", "false");
}

function hideBypassModal() {
  if (!bypassModal) {
    return;
  }

  bypassModal.classList.add("is-hidden");
  bypassModal.setAttribute("aria-hidden", "true");
  bypassError?.classList.add("is-hidden");
  bypassForm?.reset();
  pendingBypassAction = null;
}

function showBypassModal(actionType, description, command) {
  if (!bypassModal) {
    return;
  }

  pendingBypassAction = { actionType, command };
  if (bypassDescription) {
    bypassDescription.textContent = description;
  }

  bypassError?.classList.add("is-hidden");
  bypassForm?.reset();
  bypassModal.classList.remove("is-hidden");
  bypassModal.setAttribute("aria-hidden", "false");
  bypassCodeInput?.focus();
}

function hideChangeBypassModal() {
  if (!changeBypassModal) {
    return;
  }

  changeBypassModal.classList.add("is-hidden");
  changeBypassModal.setAttribute("aria-hidden", "true");
  changeBypassError?.classList.add("is-hidden");
  changeBypassForm?.reset();
}

function showChangeBypassModal() {
  if (!changeBypassModal) {
    return;
  }

  changeBypassError?.classList.add("is-hidden");
  changeBypassForm?.reset();
  changeBypassModal.classList.remove("is-hidden");
  changeBypassModal.setAttribute("aria-hidden", "false");
  oldBypassCodeInput?.focus();
}

function resetManagementVisualState() {
  commandList?.classList.remove("is-fade-out", "is-hidden");
  commandButtons.forEach((button) => {
    button.disabled = false;
  });

  commandsLock?.classList.remove("is-fade-in");
  commandsLock?.classList.add("is-hidden");
  commandsLock?.setAttribute("aria-hidden", "true");

  rootOpsEnabled = false;
  rootOpsPanel?.classList.add("is-hidden");
  rootOpsPanel?.setAttribute("aria-hidden", "true");
}

function resetManagementToElevated() {
  accessLevel = "elevated";
  securityAlertTriggered = false;
  clickedNonRootCommands.clear();

  accessState.textContent = "Elevated Access";
  setMonitoringDisplay(true, false);
  statusBox?.classList.remove("is-alert");
  securityAlertMessage?.classList.add("is-hidden");

  resetManagementVisualState();
  hideSecurityAlertModal();
  hideRequestAccessModal();
  hideRequestDeniedModal();
  hideBypassModal();
  hideChangeBypassModal();
  hideInfoModal();
  hideSqlTerminalModal();
  hideTakeoverModal();
  hidePuzzleCompleteModal();
  resetSqlTerminalState();
  setGlitchLevel(0);

  window.clearTimeout(requestSubmitTimer);
  if (requestAccessSubmit) {
    requestAccessSubmit.disabled = false;
    requestAccessSubmit.textContent = "Submit";
  }
  requestAccessForm?.reset();
}

function applyTemporaryRecoveryState() {
  accessLevel = "temporary";
  securityAlertTriggered = false;
  accessState.textContent = "Temporary Access";
  setMonitoringDisplay(true, false);
  statusBox?.classList.remove("is-alert");
  securityAlertMessage?.classList.add("is-hidden");

  resetManagementVisualState();
  resetSqlTerminalState();
  appendLog("NOTICE", "Recovery access granted: Temporary Access active");
}

function showRestrictedCommandLock(animate) {
  commandButtons.forEach((button) => {
    button.disabled = true;
  });

  rootOpsPanel?.classList.add("is-hidden");
  rootOpsPanel?.setAttribute("aria-hidden", "true");

  if (!commandList || !commandsLock) {
    return;
  }

  if (!animate) {
    commandList.classList.add("is-hidden");
    commandList.classList.remove("is-fade-out");
    commandsLock.classList.remove("is-hidden", "is-fade-in");
    commandsLock.setAttribute("aria-hidden", "false");
    return;
  }

  commandList.classList.add("is-fade-out");
  window.setTimeout(() => {
    commandList.classList.add("is-hidden");
    commandList.classList.remove("is-fade-out");
    commandsLock.classList.remove("is-hidden");
    commandsLock.classList.add("is-fade-in");
    commandsLock.setAttribute("aria-hidden", "false");
  }, COMMAND_SWAP_MS);
}

function applyRestrictedStatus() {
  accessLevel = "restricted";
  accessState.textContent = "Restricted Access";
  setMonitoringDisplay(true, true);
  statusBox?.classList.add("is-alert");
  securityAlertMessage?.classList.remove("is-hidden");
}

function triggerSecurityAlert(reason, animateLock) {
  if (securityAlertTriggered) {
    return;
  }

  securityAlertTriggered = true;
  writeSessionState(SESSION_STATE_RESTRICTED);
  applyRestrictedStatus();
  showSecurityAlertModal(reason);
  appendLog("ALERT", "SECURITY ALERT detected");
  appendLog("ALERT", reason);
  showRestrictedCommandLock(animateLock);
}

function enterPersistentGridMode() {
  if (!gridOverlay) {
    return;
  }

  window.clearTimeout(patternTimer);
  revealStarted = true;
  revealComplete = true;
  pageBody.classList.add("grid-visible");
  syncTileState();
  runPatternLoop();
}

function sleep(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function runBootSequence() {
  if (!starterPanel || !bootStatus) {
    starterPanel?.classList.remove("is-hidden");
    return;
  }

  bootStatus.textContent = "";
  bootStatus.classList.remove("is-hidden", "is-done", "is-flicker-out");
  starterPanel.classList.add("is-hidden");

  for (let index = 0; index < BOOT_MESSAGE.length; index++) {
    bootStatus.textContent = BOOT_MESSAGE.slice(0, index + 1);
    await sleep(BOOT_TYPE_MS);
  }

  for (let percent = 2; percent <= 100; percent++) {
    await sleep(BOOT_PROGRESS_MS);
    bootStatus.textContent = `${BOOT_PREFIX}${percent}%`;
  }

  bootStatus.classList.add("is-done", "is-flicker-out");
  await sleep(BOOT_FLICKER_MS);

  bootStatus.classList.add("is-hidden");
  starterPanel.classList.remove("is-hidden");
  starterPanel.classList.add("is-ready");
}

function getCommandResult(command) {
  switch (command) {
    case "grant-root":
      return "Privilege escalation request submitted";
    case "freeze-transactions":
      return "Global transaction stream frozen";
    case "flush-cache":
      return "Distributed cache flush completed";
    case "replicate-backup":
      return "Cold-storage backup replication queued";
    case "verify-integrity":
      return "Deep integrity verification started";
    default:
      return "Command accepted";
  }
}

function showRootOpsInterface() {
  if (!commandList || !rootOpsPanel) {
    return;
  }

  rootOpsEnabled = true;
  commandList.classList.add("is-hidden");
  rootOpsPanel.classList.remove("is-hidden");
  rootOpsPanel.setAttribute("aria-hidden", "false");
  appendLog("NOTICE", "Root operations interface enabled");
}

function processCommandWithBypass(command, label) {
  if (command === "grant-root") {
    showRootOpsInterface();
    return;
  }

  appendLog("CMD", label);
  appendLog("INFO", `${getCommandResult(command)} (bypass verified)`);
}

function resetSqlTerminalState() {
  remainingDatabases.clear();
  TARGET_DATABASES.forEach((name) => {
    remainingDatabases.add(name.toLowerCase());
  });

  sqlTerminalOutput?.replaceChildren();
  appendTerminalLine("Connected to root terminal.");
  appendTerminalLine("Run HELP to check commands before issuing SQL.");
  appendTerminalLine("Sample data is loaded in password_files, data_main, and admin_code.");
  renderDatabaseList();

  takeoverButton?.classList.add("is-hidden");
  window.clearInterval(takeoverTimer);
  takeoverProgress = 0;
  if (takeoverProgressFill) {
    takeoverProgressFill.style.width = "0%";
  }
  if (takeoverProgressText) {
    takeoverProgressText.textContent = "0%";
  }
}

function updateGlitchForDrops() {
  const droppedCount = TARGET_DATABASES.length - remainingDatabases.size;
  setGlitchLevel(Math.min(3, droppedCount));
}

function handleDropCommand(dbNameRaw) {
  const dbName = dbNameRaw.toLowerCase();
  const known = TARGET_DATABASES.some((entry) => entry.toLowerCase() === dbName);

  if (!known) {
    appendTerminalLine(`[ERROR] Unknown database: ${dbNameRaw}`);
    return;
  }

  if (!remainingDatabases.has(dbName)) {
    appendTerminalLine(`[ERROR] Unknown database: ${dbNameRaw}`);
    return;
  }

  remainingDatabases.delete(dbName);
  appendTerminalLine(`[OK] DROP DATABASE ${dbNameRaw} completed.`);
  renderDatabaseList();
  updateGlitchForDrops();

  if (remainingDatabases.size === 0) {
    appendTerminalLine("[FATAL] Core storage references missing. Database shutting down...");
    takeoverButton?.classList.remove("is-hidden");
  }
}

function handleSqlCommandSubmit(event) {
  event.preventDefault();
  const rawInput = (sqlCommandInput?.value || "").trim();
  if (!rawInput) {
    return;
  }

  appendTerminalLine(`> ${rawInput}`);
  const normalized = rawInput.replace(/;$/, "");
  const lowered = normalized.toLowerCase();

  if (lowered === "help") {
    showSqlHelp();
  } else if (lowered.startsWith("select ")) {
    handleSelectCommand(normalized);
  } else {
    const match = normalized.match(/^drop\s+database\s+([a-zA-Z0-9_]+)$/i);

    if (match) {
      handleDropCommand(match[1]);
    } else {
      appendTerminalLine("[ERROR] Invalid command. Use HELP, SELECT <columns> FROM <table>; or DROP DATABASE <name>;");
    }
  }

  if (sqlCommandInput) {
    sqlCommandInput.value = "";
  }
}

function startTakeoverSequence() {
  showTakeoverModal();
  window.clearInterval(takeoverTimer);
  takeoverProgress = 0;
  setGlitchLevel(3);

  if (takeoverProgressFill) {
    takeoverProgressFill.style.width = "0%";
  }
  if (takeoverProgressText) {
    takeoverProgressText.textContent = "0%";
  }

  takeoverTimer = window.setInterval(() => {
    takeoverProgress = Math.min(100, takeoverProgress + 2 + Math.floor(Math.random() * 4));
    if (takeoverProgressFill) {
      takeoverProgressFill.style.width = `${takeoverProgress}%`;
    }
    if (takeoverProgressText) {
      takeoverProgressText.textContent = `${takeoverProgress}%`;
    }

    if (takeoverProgress >= 34) {
      setGlitchLevel(2);
    }
    if (takeoverProgress >= 68) {
      setGlitchLevel(3);
    }
    if (takeoverProgress >= 90) {
      setGlitchLevel(4);
    }

    if (takeoverProgress >= 100) {
      window.clearInterval(takeoverTimer);
      completePuzzle();
    }
  }, 130);
}

function handleCommandClick(button) {
  if (!button || securityAlertTriggered) {
    return;
  }

  const command = button.dataset.command;
  const label = button.textContent.trim();

  if (accessLevel === "temporary") {
    showBypassModal(BYPASS_ACTION_COMMAND, `Enter bypass code to run: ${label}`, command);
    return;
  }

  button.disabled = true;
  appendLog("CMD", label);
  appendLog("INFO", getCommandResult(command));

  if (command === "grant-root") {
    triggerSecurityAlert("Unauthorized root grant attempt blocked", true);
    return;
  }

  clickedNonRootCommands.add(command);
  if (clickedNonRootCommands.size >= nonRootCommandTotal) {
    triggerSecurityAlert("Anomalous command saturation detected", true);
  }
}

function handleBypassSubmit(event) {
  event.preventDefault();
  if (!pendingBypassAction) {
    return;
  }

  const value = (bypassCodeInput?.value || "").trim();
  if (
    pendingBypassAction.actionType === BYPASS_ACTION_DISABLE_MONITORING &&
    value === DEFAULT_BYPASS_CODE
  ) {
    if (bypassError) {
      bypassError.textContent = "This code is outdated. Change the bypass code first.";
      bypassError.classList.remove("is-hidden");
    }
    return;
  }

  if (value !== currentBypassCode) {
    if (bypassError) {
      bypassError.textContent = "Invalid bypass code.";
      bypassError.classList.remove("is-hidden");
    }
    return;
  }

  const { actionType, command } = pendingBypassAction;
  hideBypassModal();

  if (actionType === BYPASS_ACTION_COMMAND && command) {
    const button = commandButtons.find((entry) => entry.dataset.command === command);
    processCommandWithBypass(command, button ? button.textContent.trim() : command);
    return;
  }

  if (actionType === BYPASS_ACTION_DISABLE_MONITORING) {
    setMonitoringDisplay(false, false);
    appendLog("NOTICE", "Monitoring disabled via bypass verification");
  }
}

function handleChangeBypassSubmit(event) {
  event.preventDefault();

  const oldCode = (oldBypassCodeInput?.value || "").trim();
  const newCode = (newBypassCodeInput?.value || "").trim();

  if (oldCode !== currentBypassCode) {
    changeBypassError.textContent = "Old code is incorrect.";
    changeBypassError.classList.remove("is-hidden");
    return;
  }

  if (!newCode) {
    changeBypassError.textContent = "New code cannot be empty.";
    changeBypassError.classList.remove("is-hidden");
    return;
  }

  currentBypassCode = newCode;
  writeBypassCode(newCode);
  appendLog("NOTICE", "Bypass code updated successfully");
  hideChangeBypassModal();
}

function setupManagementInteractions() {
  commandButtons.forEach((button) => {
    button.addEventListener("click", () => {
      handleCommandClick(button);
    });
  });

  requestAccessButton?.addEventListener("click", () => {
    showRequestAccessModal();
  });

  securityAlertAck?.addEventListener("click", () => {
    hideSecurityAlertModal();
  });

  requestAccessCancel?.addEventListener("click", () => {
    hideRequestAccessModal();
  });

  requestAccessForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (requestAccessSubmit) {
      requestAccessSubmit.disabled = true;
      requestAccessSubmit.textContent = "Submitting...";
    }

    appendLog("NOTICE", "Access request submitted to security control");
    appendLog("NOTICE", "Awaiting authorization response...");

    window.clearTimeout(requestSubmitTimer);
    requestSubmitTimer = window.setTimeout(() => {
      hideRequestAccessModal();
      showRequestDeniedModal();
      appendLog("NOTICE", "Access request denied");
      appendLog("NOTICE", "For more information, check code SKRqHZnQ");

      if (requestAccessSubmit) {
        requestAccessSubmit.disabled = false;
        requestAccessSubmit.textContent = "Submit";
      }

      requestAccessForm?.reset();
    }, REQUEST_DENIED_DELAY_MS);
  });

  requestDeniedClose?.addEventListener("click", () => {
    hideRequestDeniedModal();
  });

  bypassForm?.addEventListener("submit", handleBypassSubmit);
  bypassCancel?.addEventListener("click", hideBypassModal);

  changeBypassButton?.addEventListener("click", () => {
    showChangeBypassModal();
  });
  changeBypassForm?.addEventListener("submit", handleChangeBypassSubmit);
  changeBypassCancel?.addEventListener("click", hideChangeBypassModal);

  disableMonitoringButton?.addEventListener("click", () => {
    showBypassModal(
      BYPASS_ACTION_DISABLE_MONITORING,
      "Enter bypass code to disable monitoring.",
      "disable-monitoring"
    );
  });

  sqlTerminalButton?.addEventListener("click", () => {
    if (monitoringEnabled && (accessLevel === "temporary" || accessLevel === "restricted")) {
      showInfoModal(
        "Terminal can only access SELECT due to monitoring on and a restricted or recovery access level. Disable monitoring or switch to a elevated account to access INSERT, CREATE, and DROP.",
        "SQL TERMINAL RESTRICTION"
      );
      return;
    }

    showSqlTerminalModal();
  });

  infoClose?.addEventListener("click", hideInfoModal);
  sqlTerminalForm?.addEventListener("submit", handleSqlCommandSubmit);
  sqlTerminalClose?.addEventListener("click", hideSqlTerminalModal);
  takeoverButton?.addEventListener("click", startTakeoverSequence);
  returnRootButton?.addEventListener("click", () => {
    const description = encodeURIComponent(PUZZLE_COMPLETION_DESCRIPTION);
    window.location.href = `../?signal=puzzle_completed&puzzle=${PUZZLE_ID}`;
  });
}

function activateTiles(indexes) {
  indexes.forEach((index) => {
    const tile = gridTiles[index];
    if (!tile) {
      return;
    }

    tile.classList.remove("active");
    tile.style.setProperty("--tile-duration", `${900 + Math.random() * 1100}ms`);
    void tile.offsetWidth;
    tile.classList.add("active");
  });
}

function randomPattern() {
  const count = 6 + Math.floor(Math.random() * 14);
  const indexes = new Set();

  while (indexes.size < count) {
    indexes.add(Math.floor(Math.random() * gridTiles.length));
  }

  return [...indexes];
}

function nextPattern() {
  if (!gridTiles.length) {
    return [];
  }

  return randomPattern();
}

function runPatternLoop() {
  if (!revealComplete) {
    return;
  }

  activateTiles(nextPattern());
  patternTimer = window.setTimeout(runPatternLoop, 700 + Math.random() * 1100);
}

function syncTileState() {
  if (!gridTiles.length) {
    return;
  }

  gridOverlay?.classList.toggle("is-visible", revealStarted || revealComplete);
  gridOverlay?.classList.toggle("reveal-complete", revealComplete);
  gridTiles.forEach((tile) => {
    tile.classList.remove("active", "reveal-active");
    tile.style.removeProperty("--tile-duration");
    tile.style.removeProperty("--tile-delay");
  });
}

function buildGrid() {
  if (!gridOverlay) {
    return;
  }

  // Include the leading offset so the final grid reaches past the viewport edge.
  const nextColumns = Math.ceil((window.innerWidth + GRID_OFFSET) / GRID_PERIOD);
  const nextRows = Math.ceil((window.innerHeight + GRID_OFFSET) / GRID_PERIOD);

  if (nextColumns === gridColumns && nextRows === gridRows && gridTiles.length) {
    return;
  }

  gridColumns = nextColumns;
  gridRows = nextRows;

  gridOverlay.style.setProperty("--grid-columns", String(gridColumns));
  gridOverlay.style.setProperty("--grid-rows", String(gridRows));
  gridOverlay.style.width = `${gridColumns * GRID_CELL_SIZE + Math.max(0, gridColumns - 1) * (GRID_PERIOD - GRID_CELL_SIZE) + GRID_OFFSET}px`;
  gridOverlay.style.height = `${gridRows * GRID_CELL_SIZE + Math.max(0, gridRows - 1) * (GRID_PERIOD - GRID_CELL_SIZE) + GRID_OFFSET}px`;

  const fragment = document.createDocumentFragment();
  const total = gridColumns * gridRows;

  for (let index = 0; index < total; index++) {
    const tile = document.createElement("span");
    tile.className = "grid-tile";
    fragment.appendChild(tile);
  }

  gridOverlay.replaceChildren(fragment);
  gridTiles = Array.from(gridOverlay.children);
  syncTileState();
}

function initializeAnimatedGrid() {
  if (!gridOverlay) {
    return;
  }

  buildGrid();

  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      buildGrid();
    }, 120);
  });
}

function revealGridFromCenter() {
  if (!gridTiles.length || !gridOverlay || revealStarted) {
    return;
  }

  revealStarted = true;
  pageBody.classList.add("grid-visible");
  gridOverlay.classList.add("is-visible");
  window.clearTimeout(patternTimer);

  const centerColumns =
    gridColumns % 2 === 0 ? [gridColumns / 2 - 1, gridColumns / 2] : [Math.floor(gridColumns / 2)];
  const centerRows = gridRows % 2 === 0 ? [gridRows / 2 - 1, gridRows / 2] : [Math.floor(gridRows / 2)];
  let maxDistance = 0;

  gridTiles.forEach((tile, index) => {
    const row = Math.floor(index / gridColumns);
    const column = index % gridColumns;
    let distance = Number.POSITIVE_INFINITY;

    centerColumns.forEach((centerColumn) => {
      centerRows.forEach((centerRow) => {
        const candidateDistance = Math.abs(column - centerColumn) + Math.abs(row - centerRow);
        if (candidateDistance < distance) {
          distance = candidateDistance;
        }
      });
    });

    const delay = distance * REVEAL_STEP_MS;

    tile.classList.remove("active", "reveal-active");
    tile.style.setProperty("--tile-delay", `${delay}ms`);
    void tile.offsetWidth;
    tile.classList.add("reveal-active");

    if (delay > maxDistance) {
      maxDistance = delay;
    }
  });

  window.setTimeout(() => {
    revealComplete = true;
    syncTileState();
    runPatternLoop();
  }, maxDistance + REVEAL_DURATION_MS);
}

initializeAnimatedGrid();
setupManagementInteractions();
currentBypassCode = readBypassCode();

const sessionState = readSessionState();
const gameStage = readGameStage();

if (gameStage === GAME_STAGE_RECOVERY) {
  writeSessionState(SESSION_STATE_LOGGED_IN);
  bootStatus?.classList.add("is-hidden");
  starterPanel?.classList.add("is-hidden");
  resetManagementToElevated();
  showManagementScreen(false);
  enterPersistentGridMode();
  applyTemporaryRecoveryState();
  appendLog("INFO", "Recovery stage loaded from game state");
} else if (sessionState === SESSION_STATE_LOGGED_IN) {
  bootStatus?.classList.add("is-hidden");
  starterPanel?.classList.add("is-hidden");
  resetManagementToElevated();
  showManagementScreen(false);
  enterPersistentGridMode();
  appendLog("INFO", "Session restored from local state");
} else if (sessionState === SESSION_STATE_RESTRICTED) {
  bootStatus?.classList.add("is-hidden");
  starterPanel?.classList.add("is-hidden");
  resetManagementToElevated();
  showManagementScreen(false);
  applyRestrictedStatus();
  showRestrictedCommandLock(false);
  enterPersistentGridMode();
  appendLog("ALERT", "SECURITY ALERT persisted from prior session");
} else {
  runBootSequence();
}

if (actionButton) {
  actionButton.addEventListener("click", () => {
    actionButton.disabled = true;
    writeSessionState(SESSION_STATE_LOGGED_IN);
    if (readGameStage() !== GAME_STAGE_RECOVERY) {
      writeGameStage("");
    }
    resetManagementToElevated();

    if (starterPanel) {
      starterPanel.classList.remove("is-ready");
      starterPanel.classList.add("is-flicker-out");
    }

    window.setTimeout(() => {
      if (starterPanel) {
        starterPanel.classList.add("is-hidden");
      }

      showManagementScreen(true);
    }, PANEL_SWAP_MS);

    revealGridFromCenter();
  });
}
