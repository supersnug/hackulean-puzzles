const OUTAGE_KEY = "hackulean_server_unavailable";
const LOGOUT_LOCK_KEY = "hackpretend_logged_out";
const outageActive = localStorage.getItem(OUTAGE_KEY) === "1";
const accountLockedOut = localStorage.getItem(LOGOUT_LOCK_KEY) === "1";

if (outageActive) {
  window.location.replace("/hackpretend/error");
}

const terminalShell = document.getElementById("terminal-shell");
const accountStateError = document.getElementById("account-state-error");

if (!outageActive && !accountLockedOut) {
  terminalShell.classList.add("hidden");
  terminalShell.setAttribute("aria-hidden", "true");
  accountStateError.classList.remove("hidden");
}

const ACCESS_CODE = "TERM-1A07-9JTB";
const DATA_LIMIT = 1000000000;
const gate = document.getElementById("gate");
const gateForm = document.getElementById("gate-form");
const gateInput = document.getElementById("gate-input");
const gateResult = document.getElementById("gate-result");
const terminal = document.getElementById("terminal");
const output = document.getElementById("output");
const cmd = document.getElementById("cmd");

function appendLine(text) {
  const p = document.createElement("p");
  p.className = "line";
  p.textContent = text;
  output.appendChild(p);
  output.scrollTop = output.scrollHeight;
}

function simulateLag(ms = 1400) {
  const start = performance.now();
  while (performance.now() - start < ms) {
    // Intentional short freeze to simulate terminal lag.
  }
}

function runCommand(raw) {
  const input = raw.trim();
  if (!input) return;

  appendLine(`guest@relay:~$ ${input}`);
  const parts = input.split(/\s+/);
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  switch (command) {
    case "help":
      appendLine("Available commands: help, ls, cat, whoami, pwd, uname, date, echo, send_data, clear, exit");
      appendLine("Warning: Do not send over 1000000000 data!");
      appendLine("Tip: try cat briefing.txt");
      break;
    case "ls":
      appendLine("briefing.txt  mission.log  users/  tmp/");
      break;
    case "cat":
      if (!args[0]) {
        appendLine("cat: missing file operand");
      } else if (args[0] === "briefing.txt") {
        appendLine("Part Three briefing: infiltrate quietly, leave no trace.");
      } else if (args[0] === "mission.log") {
        appendLine("[1] Access relay established");
        appendLine("[2] Temporary shell granted");
      } else {
        appendLine(`cat: ${args[0]}: No such file`);
      }
      break;
    case "whoami":
      appendLine("guest");
      break;
    case "pwd":
      appendLine("/home/guest");
      break;
    case "uname":
      appendLine("HackuleanOS relay-kernel 5.7.13-sim");
      break;
    case "date":
      appendLine(new Date().toString());
      break;
    case "echo":
      appendLine(args.join(" "));
      break;
    case "send_data": {
      const amount = Number(args[0]);
      if (!args[0]) {
        appendLine("usage: send_data <amount>");
        break;
      }

      if (!Number.isFinite(amount)) {
        appendLine("send_data: invalid amount");
        break;
      }

      if (amount > DATA_LIMIT) {
        appendLine(`Warning: payload ${amount} exceeds safe limit ${DATA_LIMIT}.`);
        appendLine("Relay congestion detected... terminal is lagging.");
        simulateLag();
        localStorage.setItem(OUTAGE_KEY, "1");
        appendLine("Critical failure: Server Not Available");
        setTimeout(() => {
          window.location.replace("/hackpretend/error");
        }, 200);
        break;
      }

      appendLine(`Data payload ${amount} sent successfully.`);
      break;
    }
    case "clear":
      output.textContent = "";
      break;
    case "exit":
      appendLine("Session ended. Reload page to re-authenticate.");
      cmd.disabled = true;
      break;
    default:
      appendLine(`${command}: command not found`);
      break;
  }
}

gateInput.addEventListener("input", () => {
  gateInput.value = gateInput.value.replace(/\s+/g, "").toUpperCase();
});

gateForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const entered = gateInput.value.trim().toUpperCase();

  if (!entered.startsWith("TERM")) {
    gateResult.textContent = "CODE FORMAT INVALID: must begin with TERM";
    gateResult.className = "result bad";
    return;
  }

  if (entered !== ACCESS_CODE) {
    gateResult.textContent = "ACCESS DENIED";
    gateResult.className = "result bad";
    return;
  }

  gateResult.textContent = "ACCESS GRANTED";
  gateResult.className = "result ok";
  gate.classList.add("hidden");
  terminal.classList.remove("hidden");
  appendLine("Temporary shell granted.");
  appendLine("Type 'help' to list commands.");
  cmd.focus();
});

cmd.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  const raw = cmd.value;
  cmd.value = "";
  runCommand(raw);
});
