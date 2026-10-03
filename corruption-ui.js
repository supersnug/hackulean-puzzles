(() => {
  const errors = [
    "Question archive checksum mismatch.", "Answer table references an unknown process.",
    "Stage controller is no longer responding.", "World Tunnel authentication module corrupted.",
    "Database payload signature rejected.", "File recovery partition cannot be mounted.",
    "Virus Scanner terminated unexpectedly.", "Quarantine Bot containment boundary breached.",
    "Metapuzzle routing table destroyed.", "Unauthorized process requesting network ownership.",
  ];
  let nextId = 0;

  function popup({ title, message, index = 0, modal = false, container = null, onDismiss = () => {} }) {
    const id = `hk-error-${++nextId}`;
    const dialog = document.createElement("dialog");
    dialog.className = `hk-error-window${modal ? " hk-modal" : ""}`;
    dialog.setAttribute("role", "alertdialog");
    dialog.setAttribute("aria-labelledby", `${id}-title`);
    dialog.setAttribute("aria-describedby", `${id}-message`);
    dialog.innerHTML = `<div class="hk-error-bar"><span>SYSTEM EXCEPTION</span><span>ERR ${String(index + 1).padStart(2, "0")}</span></div><div class="hk-error-content"><h2 id="${id}-title"></h2><p id="${id}-message"></p></div><button type="button" class="hk-error-ok">OK</button>`;
    dialog.querySelector("h2").textContent = title;
    dialog.querySelector("p").textContent = message;
    (container || document.body).appendChild(dialog);
    if (modal) dialog.showModal();
    else dialog.show();

    const position = () => {
      if (modal || container) return;
      const positions = [[.04, .08], [.96, .9], [.15, .65], [.85, .12], [.48, .85], [.06, .32], [.94, .62], [.4, .1], [.1, .95], [.9, .38]];
      const [x, y] = positions[index % positions.length];
      const top = Math.min(300, Math.max(72, innerHeight - dialog.offsetHeight - 100));
      dialog.style.left = `${16 + Math.max(0, innerWidth - dialog.offsetWidth - 32) * x}px`;
      dialog.style.top = `${top + Math.max(0, innerHeight - dialog.offsetHeight - top - 16) * y}px`;
    };
    position();
    window.addEventListener("resize", position);
    const remove = () => {
      window.removeEventListener("resize", position);
      dialog.remove();
    };
    dialog.addEventListener("cancel", (event) => { if (!modal) event.preventDefault(); });
    dialog.addEventListener("close", () => { remove(); onDismiss(); }, { once: true });
    dialog.querySelector("button").addEventListener("click", () => dialog.close());
    dialog.querySelector("button").focus({ preventScroll: true });
    return remove;
  }

  function errorWave({ onDismiss = () => true, onComplete = () => {} } = {}) {
    const layer = document.createElement("section");
    layer.className = "hk-error-wave";
    layer.setAttribute("aria-label", "System errors");
    document.body.appendChild(layer);
    let dismissed = 0;
    let stopped = false;
    const removers = [];
    const positionWindows = () => {
      const slots = Array.from(layer.children);
      const width = Math.min(390, layer.clientWidth * .88);
      slots.forEach((slot) => { slot.style.width = `${width}px`; });
      const tallest = Math.max(...slots.map((slot) => slot.offsetHeight));
      const availableHeight = Math.max(layer.clientHeight - 8, tallest + 200);
      const positions = [];
      slots.forEach((slot) => {
        let best;
        let bestDistance = -1;
        // Reject near-identical positions without forcing a grid or cascade.
        for (let attempt = 0; attempt < 80; attempt++) {
          const point = {
            x: Math.random() * Math.max(0, layer.clientWidth - width - 8),
            y: Math.random() * Math.max(0, availableHeight - slot.offsetHeight),
          };
          const distance = Math.min(...positions.map((other) => Math.hypot(point.x - other.x, point.y - other.y)));
          if (distance > bestDistance) { best = point; bestDistance = distance; }
          if (distance >= 45) break;
        }
        positions.push(best);
        slot.style.left = `${best.x}px`;
        slot.style.top = `${best.y}px`;
      });
    };
    window.addEventListener("resize", positionWindows);
    const stop = () => {
      stopped = true;
      window.removeEventListener("resize", positionWindows);
      removers.forEach((remove) => remove());
      layer.remove();
    };
    errors.forEach((message, index) => {
      // Preserve each window's position as other errors are dismissed.
      const slot = document.createElement("div");
      slot.className = "hk-error-slot";
      layer.appendChild(slot);
      removers.push(popup({ title: "Integrity check failed", message, index, container: slot, onDismiss: () => {
        if (stopped) return;
        dismissed++;
        if (onDismiss(dismissed) === false) { stop(); return; }
        if (dismissed === errors.length) { stop(); onComplete(); }
      } }));
    });
    positionWindows();
    layer.scrollTop = 0;
    layer.querySelector("button").focus({ preventScroll: true });
    return stop;
  }

  function showRecovery() {
    window.HackuleanKnowledge.save("recovery");
    document.body.className = "hk-recovery-mode";
    if (window.HackuleanKnowledge.read().terminalBlackout) {
      showTerminalBlackout();
      return;
    }
    document.body.innerHTML = `<main class="hk-recovery"><div class="hk-robot" aria-hidden="true"><div class="hk-robot-head">× ×</div><div class="hk-robot-body">!</div></div><section><h1>FASTBOOT MODE</h1><p>HACKULEAN RECOVERY INTERFACE</p><dl><dt>PRODUCT</dt><dd>hackulean-network</dd><dt>BOOTLOADER</dt><dd>HK-09.00 / EMERGENCY</dd><dt>SECURE BOOT</dt><dd>FAILED</dd><dt>SYSTEM STATE</dt><dd>CORRUPTED</dd><dt>RECOVERY STATUS</dt><dd>AWAITING INSTRUCTIONS</dd></dl><div class="hk-recovery-selection" aria-disabled="true">▶ RECOVERY MODE</div><p class="hk-recovery-note">No valid operating system found.<br />Recovery controls unavailable.</p></section></main>`;
    document.title = "FASTBOOT MODE - HacKulean Recovery";
    const errorLog = document.createElement("p");
    errorLog.className = "hk-fastboot-error-log";
    errorLog.textContent = "Error log: p8fVkkm8";
    document.querySelector(".hk-recovery").appendChild(errorLog);
    const fastbootScreen = document.querySelector(".hk-recovery");
    const unlockSequence = 'UnlockOptionsIa,"(@90kapJk';
    const fastbootLabels = ["START", "RESTART BOOTLOADER", "RECOVERY MODE", "POWER OFF"];
    let labels = fastbootLabels;
    let inAndroidRecovery = false;
    let typed = "";
    let menu = null;
    let selected = 0;
    let screenActive = true;

    function replayBootFailure() {
      screenActive = false;
      window.HackuleanKnowledge.save("hub-collapse", undefined, { collapseStartedAt: Date.now(), recoveryScreen: "fastboot" });
      location.href = window.HackuleanKnowledge.url();
    }

    function activateOption() {
      if (inAndroidRecovery && selected === 2) {
        screenActive = false;
        startRecoveryAttack(document.querySelector(".hk-android-recovery"), fastbootScreen);
        return;
      }
      if (inAndroidRecovery && selected === 4) {
        appendRecoveryMessage("Wiped cache");
        return;
      }
      if (inAndroidRecovery && selected === 3) {
        screenActive = false;
        appendRecoveryMessage("Factory reset started...");
        window.setTimeout(() => appendRecoveryMessage("Mounting /system..."), 600);
        window.setTimeout(() => {
          appendRecoveryMessage("E: Failed to mount /system (Invalid argument)");
          appendRecoveryMessage("Factory reset failed.");
          screenActive = true;
          menu.focus({ preventScroll: true });
        }, 1600);
        return;
      }
      if (!inAndroidRecovery && selected === 2) {
        screenActive = false;
        fastbootScreen.style.display = "none";
        window.setTimeout(() => {
          showAndroidRecovery();
          screenActive = true;
        }, 1000);
        return;
      }
      if (selected === 0) {
        replayBootFailure();
        return;
      }

      screenActive = false;
      const screen = document.querySelector(inAndroidRecovery ? ".hk-android-recovery" : ".hk-recovery");
      screen.style.display = "none";
      if (selected === 1) {
        window.setTimeout(() => {
          if (inAndroidRecovery) {
            inAndroidRecovery = false;
            window.HackuleanKnowledge.save("recovery", undefined, { recoveryScreen: "fastboot" });
            labels = fastbootLabels;
            document.body.replaceChildren(fastbootScreen);
            menu = fastbootScreen.querySelector(".hk-fastboot-options");
            document.title = "FASTBOOT MODE - HacKulean Recovery";
          }
          fastbootScreen.style.display = "";
          screenActive = true;
          selectOption(0);
          menu.focus({ preventScroll: true });
        }, 1000);
      } else {
        document.body.addEventListener("click", replayBootFailure, { once: true });
      }
    }

    function selectOption(index) {
      selected = (index + labels.length) % labels.length;
      Array.from(menu.children).forEach((option, optionIndex) => {
        option.setAttribute("aria-selected", String(optionIndex === selected));
        option.textContent = `${optionIndex === selected ? "▶" : " "} ${labels[optionIndex]}`;
      });
      menu.setAttribute("aria-activedescendant", menu.children[selected].id);
    }

    document.addEventListener("keydown", (event) => {
      if (!screenActive) return;
      if (event.ctrlKey || event.metaKey || event.altKey || event.isComposing) return;
      if (menu) {
        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
          event.preventDefault();
          selectOption(selected + (event.key === "ArrowDown" ? 1 : -1));
        } else if (event.key === "Enter") {
          event.preventDefault();
          if (!event.repeat) activateOption();
        }
        return;
      }

      if (event.key === "Backspace") {
        typed = typed.slice(0, -1);
        event.preventDefault();
        return;
      }
      if (event.key.length !== 1) return;
      typed = `${typed}${event.key}`.slice(-unlockSequence.length);
      if (typed !== unlockSequence) return;

      event.preventDefault();
      unlockOptions();
    });

    function buildOptions(className, name) {
      menu = document.createElement("div");
      menu.className = className;
      menu.tabIndex = 0;
      menu.setAttribute("role", "listbox");
      menu.setAttribute("aria-label", name);
      menu.setAttribute("aria-orientation", "vertical");
      labels.forEach((label, index) => {
        const option = document.createElement("div");
        option.id = `${inAndroidRecovery ? "recovery" : "fastboot"}-option-${index}`;
        option.setAttribute("role", "option");
        option.textContent = label;
        menu.appendChild(option);
      });
      return menu;
    }

    function appendRecoveryMessage(message) {
      const line = document.createElement("p");
      line.textContent = message;
      document.querySelector(".hk-recovery-diagnostics").appendChild(line);
      line.scrollIntoView({ block: "nearest" });
    }

    function showAndroidRecovery() {
      inAndroidRecovery = true;
      window.HackuleanKnowledge.save("recovery", undefined, { recoveryScreen: "recovery" });
      labels = ["Reboot system now", "Reboot to bootloader", "Apply update from ADB", "Wipe data/factory reset", "Wipe cache partition", "Power off"];
      const screen = document.createElement("main");
      screen.className = "hk-android-recovery";
      screen.innerHTML = `<header><h1>HacKulean Recovery</h1><p>hackulean/network/recovery<br />HK-09.00/emergency:user/release-keys</p><p>Use ↑ / ↓ to select and Enter to choose.</p></header><div class="hk-recovery-menu-slot"></div><div class="hk-recovery-diagnostics"><p>E: Failed to mount /system (Invalid argument)</p><p>E: System image verification failed</p><p>Supported API: 3</p><p>Recovery environment ready.</p></div>`;
      document.body.replaceChildren(screen);
      document.title = "HacKulean Recovery";
      screen.querySelector(".hk-recovery-menu-slot").replaceWith(buildOptions("hk-android-options", "Recovery options"));
      selectOption(0);
      menu.focus({ preventScroll: true });
    }

    function unlockOptions() {
      window.HackuleanKnowledge.save("recovery", undefined, { fastbootUnlocked: true });
      buildOptions("hk-fastboot-options", "Fastboot options");
      document.querySelector(".hk-recovery-selection").replaceWith(menu);
      document.querySelector(".hk-recovery-note").textContent = "No valid operating system found.";
      selectOption(0);
      menu.focus({ preventScroll: true });
    }

    if (window.HackuleanKnowledge.read().fastbootUnlocked) unlockOptions();
    if (window.HackuleanKnowledge.read().recoveryScreen === "recovery") showAndroidRecovery();
  }

  function startRecoveryAttack(recoveryScreen, fastbootScreen) {
    const diagnostics = recoveryScreen.querySelector(".hk-recovery-diagnostics");
    const options = Array.from(recoveryScreen.querySelectorAll('[role="option"]'));
    const menu = recoveryScreen.querySelector('[role="listbox"]');
    menu.inert = true;
    menu.blur();
    const log = (text) => {
      const line = document.createElement("p");
      line.textContent = text;
      diagnostics.appendChild(line);
      line.scrollIntoView({ block: "nearest" });
    };
    log("Installing update from ADB...");
    window.setTimeout(() => log("Verifying update package..."), 700);
    window.setTimeout(() => log("Applying system update... 23%"), 1400);
    window.setTimeout(() => {
      log("SECURITY ALERT: Hacker detected in update channel.");
      recoveryScreen.classList.add("hk-recovery-infected");
    }, 2100);
    options.forEach((option, index) => {
      window.setTimeout(() => {
        option.remove();
        if (index !== options.length - 1) return;
        log("E: Recovery controls destroyed. Bootloader compromised.");
        window.setTimeout(() => {
          document.body.replaceChildren();
          window.setTimeout(() => showBrokenFastboot(fastbootScreen, recoveryScreen), 1000);
        }, 1000);
      }, 2600 + index * 350);
    });
  }

  function showBrokenFastboot(fastbootScreen, recoveryScreen) {
    fastbootScreen.style.display = "";
    recoveryScreen.classList.add("hk-recovery-overlay");
    recoveryScreen.removeAttribute("aria-hidden");
    document.body.classList.add("hk-broken-fastboot");
    document.body.replaceChildren(fastbootScreen, recoveryScreen);
    window.scrollTo(0, 0);
    document.title = "FASTBOOT // CORRUPTED - HacKulean";

    const menu = fastbootScreen.querySelector(".hk-fastboot-options");
    menu.removeAttribute("aria-activedescendant");
    menu.removeAttribute("tabindex");
    const menuOptions = Array.from(menu.children);
    const originalNames = ["START", "RESTART BOOTLOADER", "RECOVERY MODE", "POWER OFF"];
    const targets = [
      ...fastbootScreen.querySelectorAll("h1, section > p, dt, dd, .hk-fastboot-error-log"),
      recoveryScreen,
      ...menuOptions,
    ];
    const logo = fastbootScreen.querySelector(".hk-robot");
    const cursor = document.createElement("span");
    cursor.className = "hk-corrupt-cursor";
    cursor.textContent = "▶";
    cursor.setAttribute("aria-hidden", "true");
    document.body.appendChild(cursor);
    let current = null;
    let spider = null;
    let spiderTimer = 0;
    let finished = false;

    const remaining = () => targets.filter((element) => element.isConnected);
    const entries = () => [
      ...menuOptions.filter((element) => element.isConnected).map((element) => ({ element, deletable: false })),
      ...(remaining().length ? remaining() : logo.isConnected ? [logo] : []).map((element) => ({ element, deletable: true })),
    ];
    const glitchNames = () => {
      const symbols = "#$%&!?@/\\[]{}";
      menuOptions.forEach((element, index) => {
        if (!element.isConnected) return;
        element.textContent = originalNames[index].split("").map((character, position) =>
          position === 0 || Math.random() < .45 ? symbols[Math.floor(Math.random() * symbols.length)] : character
        ).join("");
      });
    };
    const positionCursor = () => {
      if (!current?.element.isConnected) return;
      const bounds = current.element.getBoundingClientRect();
      cursor.style.left = `${Math.max(2, bounds.left - 20)}px`;
      cursor.style.top = `${Math.max(2, Math.min(innerHeight - 25, bounds.top))}px`;
    };
    const select = (index) => {
      const choices = entries();
      if (!choices.length) return;
      document.querySelectorAll(".hk-delete-selected").forEach((element) => element.classList.remove("hk-delete-selected"));
      menuOptions.forEach((element) => element.setAttribute("aria-selected", "false"));
      current = choices[Math.max(0, Math.min(choices.length - 1, index))];
      current.element.classList.add("hk-delete-selected");
      current.element.scrollIntoView({ block: "nearest" });
      positionCursor();
    };
    const finish = () => {
      finished = true;
      window.clearTimeout(spiderTimer);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", positionCursor);
      window.removeEventListener("scroll", positionCursor);
      showTerminalBlackout();
    };
    const deleteTarget = (element) => {
      if (finished || !element?.isConnected || (element === logo && remaining().length)) return;
      const previousIndex = entries().findIndex((entry) => entry.element === current?.element && entry.deletable === current?.deletable);
      element.remove();
      if (!remaining().length && !logo.isConnected) { finish(); return; }
      select(Math.max(0, previousIndex));
    };
    const hunt = () => {
      if (finished) return;
      const choices = remaining();
      const target = choices.length ? choices[Math.floor(Math.random() * choices.length)] : logo;
      const bounds = target.getBoundingClientRect();
      spider.style.left = `${Math.max(0, Math.min(innerWidth - 64, bounds.left + bounds.width / 2 - 32))}px`;
      spider.style.top = `${Math.max(0, Math.min(innerHeight - 64, bounds.top + bounds.height / 2 - 32))}px`;
      spiderTimer = window.setTimeout(() => {
        deleteTarget(target);
        if (!finished) spiderTimer = window.setTimeout(hunt, 180);
      }, 800);
    };
    const startSpider = () => {
      if (spider || finished) return;
      spider = document.createElement("div");
      spider.className = "hk-deletion-spider";
      spider.setAttribute("aria-label", "Corruption spider");
      spider.innerHTML = `<svg viewBox="0 0 64 64" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="3"><path d="M26 25 12 12 4 22M25 30 9 25 2 35M25 36 10 42 4 53M27 42 19 53 20 62M38 25 52 12 60 22M39 30 55 25 62 35M39 36 54 42 60 53M37 42 45 53 44 62"/></g><ellipse cx="32" cy="36" rx="11" ry="16" fill="currentColor"/><circle cx="32" cy="18" r="8" fill="currentColor"/><circle cx="29" cy="16" r="2" fill="#000"/><circle cx="35" cy="16" r="2" fill="#000"/></svg>`;
      document.body.appendChild(spider);
      // Give the browser a frame at the screen edge before the first crawl.
      spiderTimer = window.setTimeout(hunt, 100);
    };
    function onKeyDown(event) {
      if (finished || event.ctrlKey || event.metaKey || event.altKey) return;
      if (!["ArrowUp", "ArrowDown", "Enter"].includes(event.key)) return;
      event.preventDefault();
      glitchNames();
      if (event.key === "Enter") {
        if (!event.repeat && current?.deletable) {
          deleteTarget(current.element);
          startSpider();
        }
      } else {
        const index = entries().findIndex((entry) => entry.element === current?.element && entry.deletable === current?.deletable);
        select(index + (event.key === "ArrowDown" ? 1 : -1));
      }
    }
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", positionCursor);
    window.addEventListener("scroll", positionCursor);
    window.addEventListener("pagehide", () => window.clearTimeout(spiderTimer), { once: true });
    glitchNames();
    select(0);
  }

  function showTerminalBlackout() {
    const state = window.HackuleanKnowledge;
    const startedAt = state.read().blackoutStartedAt || Date.now();
    state.save("recovery", undefined, { terminalBlackout: true, blackoutStartedAt: startedAt });
    document.body.className = "hk-recovery-mode";
    document.body.replaceChildren();
    document.title = "HacKulean";
    const timer = window.setTimeout(() => {
      state.save("overrun", undefined, { terminalBlackout: false });
      location.replace(state.url());
    }, Math.max(0, 3000 - (Date.now() - startedAt)));
    window.addEventListener("pagehide", () => window.clearTimeout(timer), { once: true });
    window.addEventListener("pageshow", (event) => { if (event.persisted) location.reload(); });
  }

  function showOverrunHub() {
    document.body.classList.add("hk-overrun");
    const shell = document.querySelector(".shell");
    shell.inert = true;
    shell.querySelectorAll("a, button").forEach((element) => {
      element.removeAttribute("href");
      element.setAttribute("aria-disabled", "true");
      element.tabIndex = -1;
    });
    const layer = document.createElement("div");
    layer.className = "hk-overrun-swarm";
    layer.setAttribute("role", "group");
    layer.setAttribute("aria-label", "Scam messages");
    document.body.appendChild(layer);
    const completed = new Set(window.HackuleanKnowledge.read().scamWins || []);
    let gameOpen = false;
    const sprites = [];
    const addSprite = (element, speed) => {
      layer.appendChild(element);
      const sprite = { element, x: Math.random() * innerWidth, y: Math.random() * innerHeight,
        vx: (Math.random() < .5 ? -1 : 1) * speed, vy: (Math.random() < .5 ? -1 : 1) * speed * (.6 + Math.random() * .6), width: 0, height: 0 };
      sprites.push(sprite);
      return sprite;
    };
    window.HackuleanScamGames.games.forEach(({ id, message }) => {
      if (completed.has(id)) return;
      const element = document.createElement("button");
      element.type = "button";
      element.className = "hk-scam-message";
      element.dataset.scamId = id;
      element.textContent = message;
      const sprite = addSprite(element, 65 + Math.random() * 65);
      element.addEventListener("click", () => {
        if (gameOpen) return;
        gameOpen = true;
        const opened = window.HackuleanScamGames.open(id, {
          onComplete: () => {
            const state = window.HackuleanKnowledge;
            const wins = new Set(state.read().scamWins || []);
            wins.add(id);
            state.save("overrun", undefined, { scamWins: [...wins] });
            completed.add(id);
            element.remove();
            const index = sprites.indexOf(sprite);
            if (index >= 0) sprites.splice(index, 1);
          },
          onClose: () => { gameOpen = false; },
        });
        if (!opened) gameOpen = false;
      });
    });
    const destroyedSpiders = new Set(window.HackuleanKnowledge.read().destroyedSpiders || []);
    const spiders = [];
    for (let index = 0; index < 6; index++) {
      const spiderId = `spider-${index}`;
      if (destroyedSpiders.has(spiderId)) continue;
      const element = document.createElement("div");
      element.className = "hk-roaming-spider";
      element.dataset.spiderId = spiderId;
      element.setAttribute("aria-hidden", "true");
      element.innerHTML = `<svg viewBox="0 0 64 64" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="3"><path d="M26 25 12 12 4 22M25 30 9 25 2 35M25 36 10 42 4 53M27 42 19 53 20 62M38 25 52 12 60 22M39 30 55 25 62 35M39 36 54 42 60 53M37 42 45 53 44 62"/></g><ellipse cx="32" cy="36" rx="11" ry="16" fill="currentColor"/><circle cx="32" cy="18" r="8" fill="currentColor"/><circle cx="29" cy="16" r="2" fill="#000"/><circle cx="35" cy="16" r="2" fill="#000"/></svg>`;
      const sprite = addSprite(element, 40 + Math.random() * 70);
      sprite.spiderId = spiderId;
      spiders.push(sprite);
    }
    const measure = () => sprites.forEach((sprite) => {
      sprite.width = sprite.element.offsetWidth;
      sprite.height = sprite.element.offsetHeight;
      sprite.x = Math.min(sprite.x, Math.max(0, innerWidth - sprite.width));
      sprite.y = Math.min(sprite.y, Math.max(0, innerHeight - sprite.height));
    });
    measure();
    const spiderHunt = window.HackuleanSpiderHunt.create({
      layer,
      spiders,
      onRemove: (spider) => {
        const index = sprites.indexOf(spider);
        if (index >= 0) sprites.splice(index, 1);
      },
    });
    let lastTime = performance.now();
    let frame = 0;
    const move = (now) => {
      const seconds = Math.min(.05, Math.max(0, (now - lastTime) / 1000));
      lastTime = now;
      const hunting = spiderHunt.step(seconds, now, completed.size === 6 && !gameOpen);
      sprites.forEach((sprite) => {
        if (!gameOpen && !(sprite.spiderId && hunting)) {
          const maxX = Math.max(0, innerWidth - sprite.width);
          const maxY = Math.max(0, innerHeight - sprite.height);
          sprite.x += sprite.vx * seconds;
          sprite.y += sprite.vy * seconds;
          if (sprite.x < 0 || sprite.x > maxX) sprite.vx *= -1;
          if (sprite.y < 0 || sprite.y > maxY) sprite.vy *= -1;
          sprite.x = Math.max(0, Math.min(maxX, sprite.x));
          sprite.y = Math.max(0, Math.min(maxY, sprite.y));
        }
        sprite.element.style.transform = `translate3d(${sprite.x}px, ${sprite.y}px, 0)`;
      });
      frame = window.requestAnimationFrame(move);
    };
    move(lastTime);
    window.addEventListener("resize", measure);
    window.addEventListener("pagehide", () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", measure);
      spiderHunt.destroy();
    }, { once: true });
  }

  function startHubCollapse() {
    const state = window.HackuleanKnowledge;
    const collapseDuration = 4000;
    if (state.read().phase === "stopping") state.save("hub-collapse", undefined, { collapseStartedAt: Date.now() });
    const saved = state.read();
    const banner = document.createElement("main");
    banner.className = "hk-collapse-banner";
    banner.innerHTML = `<pre id="destruction-log" role="log" aria-live="polite"></pre>`;
    document.body.replaceChildren(banner);
    document.body.classList.add("hk-collapsing");
    const lines = [
      "[FAIL] Stop request intercepted",
      "[FAIL] System services terminated",
      "[FAIL] Network nodes disconnected",
      "[FAIL] Root filesystem destroyed",
      "[FATAL] No bootable system. Entering recovery...",
    ];
    let renderedLines = 0;
    let timer = 0;
    let recoveryTimer = 0;
    const update = () => {
      const elapsed = Math.max(0, Date.now() - saved.collapseStartedAt);
      const lineCount = Math.min(lines.length, Math.floor(elapsed / collapseDuration * lines.length) + 1);
      if (lineCount !== renderedLines) {
        banner.querySelector("pre").textContent = lines.slice(0, lineCount).join("\n");
        renderedLines = lineCount;
      }
      if (elapsed < collapseDuration) return false;
      window.clearInterval(timer);
      state.save("recovery");
      recoveryTimer = window.setTimeout(() => location.reload(), 700);
      return true;
    };
    if (!update()) {
      timer = window.setInterval(update, 50);
    }
    window.addEventListener("pagehide", () => {
      window.clearInterval(timer);
      window.clearTimeout(recoveryTimer);
    }, { once: true });
    window.addEventListener("pageshow", (event) => { if (event.persisted) location.reload(); });
  }

  window.HackuleanCorruptionUI = Object.freeze({ popup, errorWave, showRecovery, startHubCollapse, showOverrunHub });
})();
