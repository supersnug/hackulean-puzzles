const ACCESS_KEY = "hackulean_mp1_puzzle_03_recovery_access";
const MP1_ACTIVE_KEY = "hackulean_metapuzzle_1_active";
const MOUNT_COMMAND = "mount -o remount,rw /";

const authorized =
  localStorage.getItem(MP1_ACTIVE_KEY) === "1" &&
  localStorage.getItem(ACCESS_KEY) === "1";

if (!authorized) {
  window.HACKULEAN_SUPPRESS_MP1_STATUS = true;
  document.title = "404 Not Found";
  document.body.className = "fake-404";
  document.body.innerHTML = "<main><h1>404 Not Found</h1><p>The requested URL was not found on this server.</p></main>";
} else {
  const recoveryScreen = document.getElementById("recovery-screen");
  const filesystemStatus = document.getElementById("filesystem-status");
  const networkStatus = document.getElementById("network-status");
  const notice = document.getElementById("recovery-notice");
  const remountButton = document.getElementById("remount-button");
  const networkButton = document.getElementById("network-button");
  const exitButton = document.getElementById("exit-recovery-button");
  const passwordModal = document.getElementById("root-password-modal");
  const passwordStatus = document.getElementById("password-modal-status");
  const terminalHelp = document.getElementById("terminal-help");
  const recoveryPrompt = document.getElementById("recovery-prompt");
  const terminalForm = document.getElementById("terminal-form");
  const terminalInput = document.getElementById("terminal-input");
  const databaseManagement = document.getElementById("database-management");
  const cleanButton = document.getElementById("clean-corruption-button");
  const cleaningModal = document.getElementById("cleaning-modal");
  const cleaningFill = document.getElementById("cleaning-fill");
  const cleaningPercent = document.getElementById("cleaning-percent");
  const fileStatus = document.getElementById("file-status");
  const puzzleComplete = document.getElementById("puzzle-complete");
  const backRootButton = document.getElementById("back-root-button");

  let filesystemWritable = false;
  let promptReady = false;
  let exitWindowOpen = false;
  let exitWindowTimer = 0;

  function showNotice(message) {
    notice.textContent = message;
    notice.classList.remove("hidden");
  }

  remountButton.addEventListener("click", () => {
    if (remountButton.disabled) return;
    passwordModal.classList.remove("hidden");
    passwordStatus.textContent = "Enter the root password to continue.";

    window.setTimeout(() => {
      passwordStatus.textContent = "Authentication service unavailable.";
      passwordModal.classList.add("hidden");
      remountButton.disabled = true;
      remountButton.textContent = "PASSWORD REQUIRED";
      showNotice("Automatic authentication failed.");

      window.setTimeout(() => {
        promptReady = true;
        terminalHelp.classList.remove("hidden");
        recoveryPrompt.classList.add("is-ready");
        recoveryPrompt.setAttribute("aria-label", "Recovery terminal ready. Click to enter a command.");
      }, 3000);
    }, 3000);
  });

  recoveryPrompt.addEventListener("click", () => {
    if (!promptReady || filesystemWritable) return;
    recoveryPrompt.classList.add("hidden");
    terminalForm.classList.remove("hidden");
    terminalInput.focus();
  });

  terminalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const command = terminalInput.value.trim().replace(/\s+/g, " ");

    if (command !== MOUNT_COMMAND) {
      showNotice(`bash: ${command || "[empty]"}: command failed`);
      terminalInput.select();
      return;
    }

    filesystemWritable = true;
    filesystemStatus.textContent = "READ-WRITE";
    remountButton.textContent = "FILESYSTEM REMOUNTED";
    terminalHelp.classList.add("hidden");
    terminalForm.classList.add("hidden");
    recoveryPrompt.classList.remove("hidden", "is-ready");
    recoveryPrompt.innerHTML = "root@recovery-node-03:~# mount complete <span aria-hidden=\"true\">_</span>";
    document.body.classList.add("filesystem-remounted");
    showNotice("Root filesystem remounted read-write.");
  });

  function closeExitWindow() {
    exitWindowOpen = false;
    exitButton.disabled = true;
    exitButton.classList.remove("is-urgent");
    networkStatus.textContent = "OFFLINE";
    networkButton.disabled = false;
    networkButton.textContent = "ENABLE NETWORK";
    document.body.classList.remove("corruption-alert");
    showNotice("ERROR: Recovery route expired. Corrupted network data disconnected.");
  }

  networkButton.addEventListener("click", () => {
    if (!filesystemWritable) {
      showNotice("Root filesystem must be remounted before enabling network.");
      return;
    }

    window.clearTimeout(exitWindowTimer);
    networkButton.disabled = true;
    networkButton.textContent = "CORRUPTED DATA";
    networkStatus.textContent = "CORRUPTED DATA";
    showNotice("Corrupted data detected. Exit recovery immediately!");
    document.body.classList.add("corruption-alert");
    exitWindowOpen = true;
    exitButton.disabled = false;
    exitButton.classList.add("is-urgent");
    exitWindowTimer = window.setTimeout(closeExitWindow, 3000);
  });

  exitButton.addEventListener("click", () => {
    if (!exitWindowOpen) return;
    window.clearTimeout(exitWindowTimer);
    exitWindowOpen = false;
    recoveryScreen.classList.add("hidden");
    document.body.classList.remove("corruption-alert");
    document.body.classList.add("database-management-active", "cleaning-enabled");
    databaseManagement.classList.remove("hidden");
  });

  cleanButton.addEventListener("click", () => {
    cleanButton.disabled = true;
    cleaningModal.classList.remove("hidden");
    let progress = 0;
    const cleaningTimer = window.setInterval(() => {
      progress = Math.min(100, progress + 4);
      cleaningFill.style.width = `${progress}%`;
      cleaningPercent.textContent = `${progress}%`;
      if (progress < 100) return;

      window.clearInterval(cleaningTimer);
      fileStatus.textContent = "HEALTHY";
      document.querySelector(".database-file-card").classList.remove("corrupted");
      document.querySelector(".database-file-card").classList.add("cleansed");
      window.setTimeout(() => {
        cleaningModal.classList.add("hidden");
        databaseManagement.classList.add("hidden");
        document.body.classList.remove("database-management-active", "cleaning-enabled");
        document.body.classList.add("glitch-complete-active");
        puzzleComplete.classList.remove("hidden");
      }, 350);
    }, 70);
  });

  backRootButton.addEventListener("click", () => {
    window.location.href = "/metapuzzle/1?signal=mp1_complete_puzzle_03";
  });
}
