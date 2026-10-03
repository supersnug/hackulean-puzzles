(() => {
  const games = [
    { id: "prize", message: "YOU WON! CLAIM YOUR PRIZE NOW!", title: "Prize Collector", rules: "Catch 10 falling trophies in 45 seconds. Catching a spider ends the attempt. Move the basket with your mouse, touch, or Left/Right arrows.", timed: true, play: playPrize },
    { id: "files", message: "YOUR FILES ARE LOCKED — PAY TO RESTORE", title: "Crack the File Lock", rules: "Deduce the four-digit passcode from the clues. All digits are different and the first is not zero. You have three guesses and no time limit.", timed: false, play: playFiles },
    { id: "update", message: "FREE SECURITY UPDATE! CLICK HERE!", title: "Security Update", rules: "Reach 100% in 45 seconds by clicking 10 plus signs. Two minus signs chase your pointer. Each hit removes 10% progress; three hits end the attempt.", timed: true, play: playUpdate },
    { id: "password", message: "URGENT: VERIFY YOUR PASSWORD!", title: "Password Check", rules: "Choose the strongest password in five rounds of three choices. Prefer long, unpredictable passwords over common words and patterns. One wrong answer ends the attempt. No time limit.", timed: false, play: playPasswords },
    { id: "credits", message: "1,000,000 CREDITS WAITING FOR YOU!", title: "Count the Credits", rules: "Earn $100 in 45 seconds. Only bills showing exactly $1, $5, $10, or $20 are genuine. Wait for fake bills to change: clicking one ends the attempt.", timed: true, play: playCredits },
    { id: "vacuum", message: "VIRUS FOUND! DOWNLOAD CLEANER NOW!", title: "Virus Vacuum", rules: "Collect 15 viruses in 45 seconds. Click the vacuum to switch it on, then move it with your mouse, touch, or arrow keys.", timed: true, play: playVacuum },
  ];
  let active = null;

  function shuffle(items) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index--) {
      const other = Math.floor(Math.random() * (index + 1));
      [result[index], result[other]] = [result[other], result[index]];
    }
    return result;
  }

  function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    if (tag === "button") element.type = "button";
    return element;
  }

  function open(id, { onComplete = () => {}, onClose = () => {} } = {}) {
    if (active) return false;
    const game = games.find((entry) => entry.id === id);
    if (!game) return false;
    const dialog = node("dialog", "sg-dialog");
    dialog.dataset.game = id;
    dialog.setAttribute("aria-labelledby", "sg-title");
    dialog.innerHTML = `<header class="sg-header"><div><p>SCAM NODE // COUNTERMEASURE</p><h2 id="sg-title"></h2></div><button class="sg-close" type="button" aria-label="Close minigame">×</button></header><p class="sg-rules"></p><div class="sg-toolbar"><span class="sg-status" role="status">READY</span><span class="sg-time"></span></div><div class="sg-progress" role="progressbar" aria-label="Minigame progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></div><div class="sg-content"></div><p class="sg-feedback" role="status"></p><button class="sg-start" type="button">START</button><div class="sg-result" role="status" hidden></div>`;
    dialog.querySelector("h2").textContent = game.title;
    dialog.querySelector(".sg-rules").textContent = game.rules;
    const time = dialog.querySelector(".sg-time");
    time.textContent = game.timed ? "45s" : "NO TIMER";
    const content = dialog.querySelector(".sg-content");
    const start = dialog.querySelector(".sg-start");
    const controls = new AbortController();
    let phase = "ready";
    let deadline = 0;
    let frame = 0;
    let resultTimer = 0;
    let lastTime = 0;
    let update = () => {};

    const finish = (won, reason) => {
      if (phase !== "playing") return;
      phase = "finished";
      window.cancelAnimationFrame(frame);
      controls.abort();
      content.inert = true;
      const result = dialog.querySelector(".sg-result");
      result.hidden = false;
      result.classList.toggle("sg-won", won);
      result.textContent = won ? "SCAM CLEARED" : reason;
      if (won) onComplete(id);
      resultTimer = window.setTimeout(() => dialog.close(), won ? 800 : 1000);
    };
    const live = () => {
      if (phase !== "playing") return false;
      if (game.timed && performance.now() >= deadline) {
        finish(false, "TIME EXPIRED — TRY AGAIN");
        return false;
      }
      return true;
    };
    const context = {
      content,
      status: (text) => { dialog.querySelector(".sg-status").textContent = text; },
      feedback: (text) => { dialog.querySelector(".sg-feedback").textContent = text; },
      progress: (value, target) => {
        const percent = Math.max(0, Math.min(100, value / target * 100));
        dialog.querySelector(".sg-progress").setAttribute("aria-valuenow", String(percent));
        dialog.querySelector(".sg-progress span").style.width = `${percent}%`;
      },
      on: (target, event, handler) => target.addEventListener(event, (input) => {
        if (live()) handler(input);
      }, { signal: controls.signal }),
      win: () => { if (live()) finish(true); },
      lose: (reason) => finish(false, reason),
      live,
    };
    const tick = (now) => {
      if (!live()) return;
      if (game.timed) time.textContent = `${Math.max(0, Math.ceil((deadline - now) / 1000))}s`;
      const seconds = Math.min(.05, Math.max(0, (now - lastTime) / 1000));
      lastTime = now;
      update(seconds, now);
      if (phase === "playing") frame = window.requestAnimationFrame(tick);
    };
    start.addEventListener("click", () => {
      if (phase !== "ready") return;
      phase = "playing";
      start.hidden = true;
      lastTime = performance.now();
      deadline = lastTime + 45000;
      update = game.play(context) || (() => {});
      frame = window.requestAnimationFrame(tick);
    });
    dialog.querySelector(".sg-close").addEventListener("click", () => dialog.close());
    const cleanup = () => {
      phase = "closed";
      controls.abort();
      window.cancelAnimationFrame(frame);
      window.clearTimeout(resultTimer);
      window.removeEventListener("pagehide", cleanup);
      dialog.remove();
      active = null;
      onClose();
    };
    dialog.addEventListener("close", cleanup, { once: true });
    window.addEventListener("pagehide", cleanup, { once: true });
    active = dialog;
    document.body.appendChild(dialog);
    dialog.showModal();
    start.focus();
    return true;
  }

  function playFiles(ctx) {
    let digits;
    do { digits = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4); } while (digits[0] === 0);
    const [a, b, c, d] = digits;
    const clues = node("ul", "sg-clues");
    [
      `First digit + second digit = ${a + b}`,
      `Second digit + third digit = ${b + c}`,
      `Third digit + fourth digit = ${c + d}`,
      `The first digit is ${Math.abs(a - d)} ${a > d ? "greater" : "less"} than the fourth digit.`,
    ].forEach((text) => clues.appendChild(node("li", "", text)));
    const form = node("form", "sg-lock-form");
    form.noValidate = true;
    const label = node("label", "", "Four-digit passcode");
    const input = node("input", "sg-passcode");
    input.id = "sg-passcode";
    input.inputMode = "numeric";
    input.maxLength = 4;
    input.autocomplete = "off";
    label.htmlFor = input.id;
    const submit = node("button", "sg-action", "UNLOCK FILES");
    submit.type = "submit";
    form.append(label, input, submit);
    ctx.content.append(clues, form);
    let attempts = 3;
    ctx.status("3 guesses remaining");
    ctx.on(form, "submit", (event) => {
      event.preventDefault();
      const answer = input.value.trim();
      if (!/^\d{4}$/.test(answer)) { ctx.feedback("Enter exactly four digits."); return; }
      if (answer === digits.join("")) { ctx.progress(1, 1); ctx.win(); return; }
      attempts--;
      if (!attempts) { ctx.lose("LOCKOUT — THREE INCORRECT GUESSES"); return; }
      ctx.status(`${attempts} guesses remaining`);
      ctx.feedback("Incorrect code. Check the clues and try again.");
      input.select();
    });
    input.focus();
  }

  function playPasswords(ctx) {
    const rounds = [
      ["q7#Zp2!mV9@Lr4$Kx8", "password123", "Summer2026!"],
      ["Maple!Orbit7-Cobalt#River82", "BlueCar9", "Tr0ub4dor!"],
      ["r8$Qv2#Lp9!Zc4@Mn7", "Admin!2026", "111111111111"],
      ["Violet9!Comet#Lantern$42", "CoffeeTime!", "orange"],
      ["n4@Tz8!Wq2#Fr7$Lp5^Yk9", "PasswordPassword!", "Qwerty0987"],
    ];
    let round = 0;
    const choices = node("div", "sg-passwords");
    ctx.content.appendChild(choices);
    function showRound() {
      ctx.status(`Password ${round + 1} / 5`);
      choices.replaceChildren();
      shuffle(rounds[round]).forEach((password) => {
        const button = node("button", "sg-password", password);
        ctx.on(button, "click", () => {
          if (password !== rounds[round][0]) { ctx.lose("WEAK PASSWORD — VERIFICATION FAILED"); return; }
          round++;
          ctx.progress(round, 5);
          if (round === 5) ctx.win();
          else showRound();
        });
        choices.appendChild(button);
      });
    }
    showRound();
  }

  function arena(ctx) {
    const board = node("div", "sg-arena");
    board.tabIndex = 0;
    board.setAttribute("aria-label", "Minigame play area");
    ctx.content.appendChild(board);
    const keys = new Set();
    ctx.on(board, "keydown", (event) => {
      if (!event.key.startsWith("Arrow")) return;
      event.preventDefault();
      keys.add(event.key);
    });
    ctx.on(window, "keyup", (event) => keys.delete(event.key));
    ctx.on(window, "blur", () => keys.clear());
    const pointer = (event) => {
      const bounds = board.getBoundingClientRect();
      return { x: Math.max(.03, Math.min(.97, (event.clientX - bounds.left) / bounds.width)), y: Math.max(.05, Math.min(.95, (event.clientY - bounds.top) / bounds.height)) };
    };
    board.focus({ preventScroll: true });
    return { board, keys, pointer };
  }

  function position(element, x, y) {
    element.style.left = `${x * 100}%`;
    element.style.top = `${y * 100}%`;
  }

  function playPrize(ctx) {
    const { board, keys, pointer } = arena(ctx);
    const basket = node("div", "sg-basket", "CATCH");
    board.appendChild(basket);
    let basketX = .5;
    let caught = 0;
    let spawnTime = 0;
    let spawned = 0;
    const drops = [];
    ctx.status("0 / 10 trophies");
    const move = (event) => { basketX = Math.max(.09, Math.min(.91, pointer(event).x)); };
    ctx.on(board, "pointermove", move);
    ctx.on(board, "pointerdown", (event) => { board.setPointerCapture(event.pointerId); move(event); });
    return (seconds) => {
      if (keys.has("ArrowLeft")) basketX -= seconds * .85;
      if (keys.has("ArrowRight")) basketX += seconds * .85;
      basketX = Math.max(.09, Math.min(.91, basketX));
      position(basket, basketX, .94);
      spawnTime -= seconds;
      if (spawnTime <= 0) {
        const spider = spawned++ % 4 === 3;
        const element = node("div", `sg-falling ${spider ? "sg-falling-spider" : "sg-trophy"}`, spider ? "🕷" : "🏆");
        element.setAttribute("aria-label", spider ? "Spider" : "Trophy");
        const drop = { element, x: .06 + Math.random() * .88, y: -.08, spider };
        position(element, drop.x, drop.y);
        board.appendChild(element);
        drops.push(drop);
        spawnTime = .65;
      }
      for (let index = drops.length - 1; index >= 0; index--) {
        const drop = drops[index];
        drop.y += seconds * .3;
        position(drop.element, drop.x, drop.y);
        if (drop.y >= .86 && drop.y <= 1 && Math.abs(drop.x - basketX) < .115) {
          drop.element.remove();
          drops.splice(index, 1);
          if (drop.spider) { ctx.lose("SPIDER CAUGHT — PRIZE LOST"); return; }
          caught++;
          ctx.status(`${caught} / 10 trophies`);
          ctx.progress(caught, 10);
          if (caught >= 10) { ctx.win(); return; }
        } else if (drop.y > 1.1) {
          drop.element.remove();
          drops.splice(index, 1);
        }
      }
    };
  }

  function playUpdate(ctx) {
    const { board, pointer } = arena(ctx);
    let cursor = { x: .5, y: .5 };
    let progress = 0;
    let hits = 0;
    let immuneUntil = 0;
    const plus = node("button", "sg-plus", "+");
    plus.setAttribute("aria-label", "Install update plus");
    board.appendChild(plus);
    const minuses = [{ x: .08, y: .1 }, { x: .92, y: .9 }].map((minus) => {
      minus.element = node("button", "sg-minus", "−");
      minus.element.tabIndex = -1;
      minus.element.setAttribute("aria-label", "Chasing minus hazard");
      board.appendChild(minus.element);
      position(minus.element, minus.x, minus.y);
      return minus;
    });
    const status = () => {
      ctx.status(`${progress * 10}% installed · ${hits} / 3 hits`);
      ctx.progress(progress, 10);
    };
    const relocatePlus = () => {
      let point = { x: .5, y: .5 };
      for (let attempt = 0; attempt < 50; attempt++) {
        point = { x: .08 + Math.random() * .84, y: .1 + Math.random() * .8 };
        if (minuses.every((minus) => Math.hypot(point.x - minus.x, point.y - minus.y) > .22)) break;
      }
      position(plus, point.x, point.y);
    };
    const hit = (minus) => {
      if (performance.now() < immuneUntil) return;
      immuneUntil = performance.now() + 1000;
      hits++;
      progress = Math.max(0, progress - 1);
      minus.x = cursor.x < .5 ? .92 : .08;
      minus.y = cursor.y < .5 ? .9 : .1;
      status();
      if (hits >= 3) ctx.lose("UPDATE OVERRUN — THREE HITS");
      else ctx.feedback("Minus hit! Lost 10% progress.");
    };
    ctx.on(board, "pointermove", (event) => { cursor = pointer(event); });
    ctx.on(board, "pointerdown", (event) => { cursor = pointer(event); });
    minuses.forEach((minus) => ctx.on(minus.element, "click", () => hit(minus)));
    ctx.on(plus, "click", () => {
      progress++;
      status();
      if (progress >= 10) ctx.win();
      else relocatePlus();
    });
    relocatePlus();
    status();
    return (seconds, now) => {
      minuses.forEach((minus) => {
        const dx = cursor.x - minus.x;
        const dy = cursor.y - minus.y;
        const distance = Math.hypot(dx, dy);
        const step = Math.min(distance, seconds * .12);
        if (distance > 0) { minus.x += dx / distance * step; minus.y += dy / distance * step; }
        position(minus.element, minus.x, minus.y);
        minus.element.classList.toggle("sg-hazard-immune", now < immuneUntil);
        if (distance < .055) hit(minus);
      });
    };
  }

  function playVacuum(ctx) {
    const { board, keys, pointer } = arena(ctx);
    const vacuum = node("button", "sg-vacuum");
    vacuum.setAttribute("aria-label", "Activate vacuum cleaner");
    vacuum.innerHTML = `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M44 42V18Q44 8 56 8" fill="none" stroke="currentColor" stroke-width="5"/><rect x="8" y="30" width="40" height="24" rx="8" fill="currentColor"/><circle cx="17" cy="55" r="5" fill="#e6f6ff"/><circle cx="40" cy="55" r="5" fill="#e6f6ff"/><path d="M55 8V40H62" fill="none" stroke="currentColor" stroke-width="4"/></svg>`;
    board.appendChild(vacuum);
    const viruses = [];
    for (let index = 0; index < 15; index++) {
      const virus = { x: .1 + (index % 5) * .2 + (Math.random() - .5) * .07, y: .14 + Math.floor(index / 5) * .25 + (Math.random() - .5) * .07 };
      virus.element = node("div", "sg-virus", "✹");
      virus.element.setAttribute("aria-label", "Virus");
      position(virus.element, virus.x, virus.y);
      board.appendChild(virus.element);
      viruses.push(virus);
    }
    let location = { x: .5, y: .86 };
    let activated = false;
    let collected = 0;
    position(vacuum, location.x, location.y);
    ctx.status("Click the vacuum to activate · 0 / 15");
    ctx.on(vacuum, "click", () => {
      activated = true;
      board.classList.add("sg-vacuum-running");
      vacuum.setAttribute("aria-label", "Vacuum running");
      board.focus({ preventScroll: true });
      ctx.status(`${collected} / 15 viruses removed`);
    });
    ctx.on(board, "pointermove", (event) => { if (activated) location = pointer(event); });
    ctx.on(board, "pointerdown", (event) => {
      if (activated) { board.setPointerCapture(event.pointerId); location = pointer(event); }
    });
    return (seconds) => {
      if (!activated) return;
      if (keys.has("ArrowLeft")) location.x -= seconds * .65;
      if (keys.has("ArrowRight")) location.x += seconds * .65;
      if (keys.has("ArrowUp")) location.y -= seconds * .65;
      if (keys.has("ArrowDown")) location.y += seconds * .65;
      location.x = Math.max(.03, Math.min(.97, location.x));
      location.y = Math.max(.05, Math.min(.95, location.y));
      position(vacuum, location.x, location.y);
      const bounds = board.getBoundingClientRect();
      for (let index = viruses.length - 1; index >= 0; index--) {
        const virus = viruses[index];
        if (Math.hypot((location.x - virus.x) * bounds.width, (location.y - virus.y) * bounds.height) > 35) continue;
        virus.element.remove();
        viruses.splice(index, 1);
        collected++;
        ctx.status(`${collected} / 15 viruses removed`);
        ctx.progress(collected, 15);
      }
      if (collected === 15) ctx.win();
    };
  }

  function playCredits(ctx) {
    const legend = node("p", "sg-bill-legend", "GENUINE: $1 · $5 · $10 · $20");
    const bill = node("button", "sg-bill");
    bill.append(node("span", "", "HACKULEAN CREDIT NOTE"), node("strong", "sg-bill-amount"), node("span", "", "CLICK ONLY IF GENUINE"));
    ctx.content.append(legend, bill);
    let earned = 0;
    let deal = 0;
    let value = 0;
    let nextDeal = 0;
    const genuine = [1, 5, 10, 20, 20];
    const fakes = ["$0", "-$10", "$999"];
    const reveal = () => {
      const fake = deal++ % 3 === 2;
      value = fake ? 0 : genuine[Math.floor(Math.random() * genuine.length)];
      bill.querySelector("strong").textContent = fake ? fakes[Math.floor(Math.random() * fakes.length)] : `$${value}`;
      nextDeal = performance.now() + 1400;
    };
    ctx.status("$0 / $100 earned");
    ctx.on(bill, "click", () => {
      if (!value) { ctx.lose("COUNTERFEIT BILL — CREDITS LOST"); return; }
      earned += value;
      ctx.status(`$${earned} / $100 earned`);
      ctx.progress(earned, 100);
      if (earned >= 100) ctx.win();
      else reveal();
    });
    reveal();
    return (_seconds, now) => { if (now >= nextDeal) reveal(); };
  }

  window.HackuleanScamGames = Object.freeze({ games: games.map(({ id, message }) => Object.freeze({ id, message })), open });
})();
