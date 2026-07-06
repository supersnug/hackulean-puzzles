if (localStorage.getItem("hackulean_server_unavailable") === "1") {
  window.location.replace("/hackpretend/error");
}


const LOGGED_IN_KEY = "hackpretend_logged_in";
const form = document.getElementById("code-form");
const input = document.getElementById("code-input");
const mainPanel = document.getElementById("main-panel");
const result = document.getElementById("result");
const loginPrompt = document.getElementById("login-prompt");
const passwordHint = document.getElementById("password-hint");
const partThreeMessage = document.getElementById("part-three-message");
const clue = document.getElementById("clue");
const verifyButton = form.querySelector('button[type="submit"]');
const adminPanel = document.getElementById("admin-panel");
const adminStatus = document.getElementById("admin-status");
const privilegeToggle = document.getElementById("privilege-toggle");
const manageButtons = document.querySelectorAll(".manage-btn");
const fakeMenus = document.querySelectorAll(".fake-menu");
const adminTopbar = document.querySelector(".admin-topbar");
const adminOptions = document.querySelectorAll(".admin-option");
const systemLog = document.getElementById("system-log");
const logOutput = document.getElementById("log-output");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const enableInternetBtn = document.getElementById("enable-internet");
const incomingAlert = document.getElementById("incoming-alert");
const LOGOUT_LOCK_KEY = "hackpretend_logged_out";

let internetBooting = false;
let incidentTriggered = false;
let keywordCheckComplete = false;
let logoutSequenceStarted = false;
const taskOneSavedClues = new Set();

function clearBootMessage() {
  result.textContent = "";
  result.className = "result";
}

function enterHomepageState(animate = false) {
  mainPanel.classList.remove("boot-screen-hidden");
  form.classList.add("hidden");
  clue.classList.add("hidden");
  loginPrompt.classList.add("hidden");
  passwordHint.classList.add("hidden");
  adminPanel.classList.remove("hidden");
  systemLog.classList.remove("hidden");
  clearBootMessage();

  if (animate) {
    [adminPanel, systemLog].forEach((element) => {
      element.classList.remove("dashboard-flicker-in");
      void element.offsetWidth;
      element.classList.add("dashboard-flicker-in");
    });
  }

  if (!logOutput.hasChildNodes()) {
    appendLog("[SYS] Incident log standby. Awaiting access handshake...");
  }

  appendLog("[SYS] Admin panel unlocked.");
  appendLog("[SYS] Awaiting management action...");
  applyPrivilegeState();
  syncPrivilegeToggle();
}

function closeAllMenus() {
  fakeMenus.forEach((menu) => menu.classList.remove("visible"));
}

function appendLog(message, type = "") {
  const line = document.createElement("p");
  line.className = `log-entry ${type}`.trim();
  line.textContent = message;
  logOutput.appendChild(line);
  logOutput.scrollTop = logOutput.scrollHeight;
}

function typeChatMessage(message, prefix = "[CHAT] ", charDelay = 70) {
  const line = document.createElement("p");
  line.className = "log-entry log-chat";
  line.textContent = prefix;
  logOutput.appendChild(line);

  let index = 0;
  const timer = setInterval(() => {
    line.textContent += message[index] || "";
    index++;
    logOutput.scrollTop = logOutput.scrollHeight;
    if (index >= message.length) {
      clearInterval(timer);
    }
  }, charDelay);

  return message.length * charDelay;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function typePanelMessage(element, message, charDelay = 38) {
  element.textContent = "";
  element.classList.remove("hidden");

  for (let i = 0; i < message.length; i++) {
    element.textContent += message[i];
    await wait(charDelay);
  }
}

async function playTakeoverChatScript() {
  let duration = typeChatMessage("CONNECTION ESTABLISHED.");
  await wait(duration + 400);

  duration = typeChatMessage("---- Welcome to the Hack Pretend Trials");
  await wait(duration + 5000);

  duration = typeChatMessage("Your first task is to:");
  await wait(duration + 500);

  duration = typeChatMessage(
    "Hack into the server at https://drive.google.com/drive/folders/1n-CBAckArGtX1wbxAXMAj6E-FB8d3UsZ?usp=drive_link",
    "[CHAT] ",
    42,
  );
  await wait(duration + 300);

  typeChatMessage(
    "Steal all valuable data and send it here",
    "[CHAT] ",
    42,
  );
}

function restoreLoginPrompt() {
  localStorage.setItem(LOGOUT_LOCK_KEY, "1");
  localStorage.removeItem("hackpretend_elevated");
  closeAllMenus();
  applyPrivilegeState();
  syncPrivilegeToggle();

  mainPanel.classList.remove("boot-screen-hidden");
  form.classList.add("hidden");
  clue.classList.add("hidden");
  loginPrompt.classList.add("hidden");
  passwordHint.classList.add("hidden");
  adminPanel.classList.add("hidden");
  systemLog.classList.add("hidden");
  systemLog.classList.remove("fullscreen");
  chatForm.classList.add("hidden");
  partThreeMessage.classList.add("hidden");
  partThreeMessage.textContent = "";

  const fadeTargets = [adminTopbar, ...adminOptions];
  fadeTargets.forEach((target) => target.classList.remove("fade-out"));

  input.value = "";
  input.disabled = true;
  if (verifyButton) {
    verifyButton.disabled = true;
  }
  input.placeholder = "LOCKED";
  result.textContent = "LOCKED OUT";
  result.className = "result bad";
}

async function flickerPanelMessage(message, className = "result ok") {
  result.className = className;
  result.textContent = message;
  for (let i = 0; i < 3; i++) {
    result.classList.add("flicker");
    await wait(150);
    result.classList.remove("flicker");
    await wait(110);
  }
}

function applyPersistentLogoutState() {
  if (localStorage.getItem(LOGOUT_LOCK_KEY) !== "1") {
    return false;
  }

  restoreLoginPrompt();
  partThreeMessage.classList.remove("hidden");
  partThreeMessage.textContent = "Welcome to Part Three. https://puzzles.sarulean.com/hackpretend/partthree";
  return true;
}

async function runAutoLoginIntro() {
  mainPanel.classList.add("boot-screen-hidden");
  await wait(3000);
  mainPanel.classList.remove("boot-screen-hidden");
  await flickerPanelMessage("SYSTEM MESSAGE", "result ok");
  await wait(220);

  const baseMessage = "Password brute-forced successfully. Hacking into system in ";
  result.className = "result ok";
  await typePanelMessage(result, `${baseMessage}3...`, 34);

  for (let count = 2; count >= 0; count--) {
    await wait(760);
    result.textContent = `${baseMessage}${count}...`;
  }

  await wait(500);
  result.classList.add("fading-out");
  await wait(460);
  result.classList.remove("fading-out");
  localStorage.setItem(LOGGED_IN_KEY, "1");
  enterHomepageState(true);
}

async function runDeleteCompletionFlow() {
  if (logoutSequenceStarted) {
    return;
  }

  logoutSequenceStarted = true;
  keywordCheckComplete = true;

  let duration = typeChatMessage("Congratulations.");
  await wait(duration + 500);

  duration = typeChatMessage("Trials complete.");
  await wait(duration + 500);

  duration = typeChatMessage("Restoring dashboard.");
  await wait(duration + 500);

  restoreLoginPrompt();
  await typePanelMessage(
    partThreeMessage,
    "Welcome to Part Three. https://puzzles.sarulean.com/hackpretend/partthree",
  );
}

function rememberTaskOneClue(clueKey) {
  if (taskOneSavedClues.has(clueKey)) {
    return;
  }

  taskOneSavedClues.add(clueKey);
}

function hasCompletedTaskOne() {
  return taskOneSavedClues.has("password") && taskOneSavedClues.has("bootloader");
}

async function evaluateChatMessage(message) {
  const lowered = message.toLowerCase();
  const hasCredentialSet =
    lowered.includes("5ystem3xpert1337!!!") && lowered.includes("password");
  const hasBootSet =
    lowered.includes("bootloader") && lowered.includes("unlocked");

  if (!keywordCheckComplete) {
    if (hasCredentialSet) {
      rememberTaskOneClue("password");
    }

    if (hasBootSet) {
      rememberTaskOneClue("bootloader");
    }

    if (hasCompletedTaskOne()) {
      keywordCheckComplete = true;
      let duration = typeChatMessage("Congratulations, you found the info.");
      await wait(duration + 500);
      duration = typeChatMessage("Your next task is:");
      await wait(duration + 500);
      duration = typeChatMessage(
        "https://drive.google.com/drive/folders/1xjnlizoNmX44wGgpa435jTXeoyquUoSC?usp=drive_link",
      );
      await wait(duration + 500);
      duration = typeChatMessage("Adapt");
      await wait(duration + 500);
      typeChatMessage("Advance");
      return;
    }

    if (hasCredentialSet || hasBootSet) {
      typeChatMessage(
        "You found one piece of information, but we need more. Look for another piece of important information.",
      );
      return;
    }

    let duration = typeChatMessage(
      "Your message is either random or contains only unimportant info.",
    );
    await wait(duration + 500);
    typeChatMessage("Look for important info on the server");
    return;
  }

  const hasDeleteString =
    lowered.includes("delete") ||
    lowered.includes("file");

  if (hasDeleteString) {
    await runDeleteCompletionFlow();
    return;
  }

  if (hasCredentialSet) {
    rememberTaskOneClue("password");
  }

  if (hasBootSet) {
    rememberTaskOneClue("bootloader");
  }

  let duration = typeChatMessage(
    "Your message is either random or contains only unimportant info.",
  );
  await wait(duration + 500);
  typeChatMessage("Look for important info on the server");
}

function beginTakeoverSequence() {
  if (incidentTriggered) return;
  incidentTriggered = true;

  incomingAlert.classList.add("show");
  setTimeout(() => {
    incomingAlert.classList.remove("show");
    const fadeTargets = [adminTopbar, ...adminOptions];
    fadeTargets.forEach((target, i) => {
      setTimeout(() => {
        target.classList.add("fade-out");
      }, i * 260);
    });

    setTimeout(
      () => {
        systemLog.classList.add("fullscreen");
        chatForm.classList.remove("hidden");
        chatInput.focus();
        if (enableInternetBtn.parentNode) {
          enableInternetBtn.remove();
        }
        playTakeoverChatScript();
      },
      fadeTargets.length * 260 + 500,
    );
  }, 3000);
}

function applyPrivilegeState() {
  const elevated = localStorage.getItem("hackpretend_elevated") === "1";

  manageButtons.forEach((btn) => {
    const icon = btn.querySelector(".lock-icon");
    btn.disabled = !elevated;
    if (icon) {
      icon.textContent = elevated ? "🔓" : "🔒";
    }
  });

  if (!elevated) {
    closeAllMenus();
  }

  adminStatus.textContent = elevated
    ? "SYSTEM STATUS: AUTHENTICATED - ELEVATED MANAGEMENT ENABLED"
    : "SYSTEM STATUS: AUTHENTICATED - MANAGEMENT LOCKED";
}

function syncPrivilegeToggle() {
  const elevated = localStorage.getItem("hackpretend_elevated") === "1";
  privilegeToggle.textContent = elevated
    ? "DE-ESCALATE PRIVILEGES"
    : "ESCALATE PRIVILEGES";
}

privilegeToggle.addEventListener("click", () => {
  const elevated = localStorage.getItem("hackpretend_elevated") === "1";

  if (elevated) {
    localStorage.removeItem("hackpretend_elevated");
    closeAllMenus();
    applyPrivilegeState();
    syncPrivilegeToggle();
    result.textContent = "PRIVILEGES DE-ESCALATED";
    result.className = "result bad";
    return;
  }

  if (localStorage.getItem("hackulean_metapuzzle_1_active") === "1") {
    window.location.href = "/hackpretend/escalate/error";
    return;
  }

  window.location.href = "/hackpretend/escalate";
});

manageButtons.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    if (btn.disabled) {
      return;
    }

    const title =
      btn.closest(".admin-option")?.querySelector("h3")?.textContent ||
      "MANAGEMENT MODULE";
    appendLog(
      `[ERROR] ${title}: Server internet connection disabled. Reason: "System is undergoing maintenance".`,
      "log-error",
    );
    enableInternetBtn.classList.remove("hidden");
    adminStatus.textContent =
      "SYSTEM STATUS: ELEVATED - INTERNET DISABLED, ACTION BLOCKED";
  });
});

enableInternetBtn.addEventListener("click", () => {
  if (internetBooting || incidentTriggered) {
    return;
  }

  internetBooting = true;
  enableInternetBtn.disabled = true;

  appendLog("[NET] ENABLE INTERNET command accepted.");
  setTimeout(() => appendLog("[NET] Booting interface eth0..."), 700);
  setTimeout(
    () => appendLog("[NET] Restarting routing table and DNS cache..."),
    1500,
  );
  setTimeout(
    () => appendLog("[NET] Attempting handshake with upstream gateway..."),
    2300,
  );
  setTimeout(() => appendLog("[NET] Connection established.", "log-ok"), 3200);
  setTimeout(() => beginTakeoverSequence(), 3250);
});

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = chatInput.value.trim();

  if (!message) {
    return;
  }

  typeChatMessage(message, "[YOU] ", 22);
  await evaluateChatMessage(message);
  chatInput.value = "";
});

input.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    event.preventDefault();
  }
});

input.addEventListener("input", () => {
  input.value = input.value.replace(/\s+/g, "").toUpperCase();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  enterHomepageState();
});

syncPrivilegeToggle();
const isLockedOut = applyPersistentLogoutState();

if (!isLockedOut && localStorage.getItem(LOGGED_IN_KEY) === "1") {
  enterHomepageState();
} else if (!isLockedOut) {
  runAutoLoginIntro();
}

if (isLockedOut && !logOutput.hasChildNodes()) {
  appendLog("[SYS] Incident log standby. Awaiting access handshake...");
}
