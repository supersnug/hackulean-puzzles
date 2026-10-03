(() => {
  function start() {
    const story = window.HackuleanSpiderFinale;
    const panel = document.createElement("main");
    panel.className = "sf-boss shell";
    panel.innerHTML = `<p class="eyebrow">NODE 09 // SPIDER CORE</p><h1>Break the infestation.</h1><p class="sf-boss-rules">Click the three laser emitters to fire. Avoid red projectiles and marked spike zones with your cursor. 12 laser hits weaken the spider; three hits restart the fight.</p><div class="sf-boss-status" role="status"></div><button class="sf-boss-start" type="button">START FIGHT</button><div class="sf-boss-arena" tabindex="0" aria-label="Spider boss arena"><div class="sf-boss-target">${story.spiderMarkup}</div><div class="sf-boss-hazards"></div><div class="sf-boss-lasers"></div><div class="sf-boss-aura" hidden></div></div>`;
    document.body.append(panel);
    const board = panel.querySelector(".sf-boss-arena");
    const target = panel.querySelector(".sf-boss-target");
    const status = panel.querySelector(".sf-boss-status");
    const aura = panel.querySelector(".sf-boss-aura");
    const startButton = panel.querySelector(".sf-boss-start");
    const controls = new AbortController();
    const on = (element, event, handler) => element.addEventListener(event, handler, { signal: controls.signal });
    let phase = "ready";
    let health = 3;
    let hits = 0;
    let elapsed = 0;
    let immuneUntil = 0;
    let nextAttack = 1.5;
    let attackNumber = 0;
    let frame = 0;
    let last = performance.now();
    let pointer = { x: .5, y: .85, inside: false };
    let boss = { x: .5, y: .24 };
    let hazards = [];
    const emitters = [];
    const beams = [];
    const place = (element, x, y) => { element.style.left = `${x * 100}%`; element.style.top = `${y * 100}%`; };
    const active = () => pointer.inside && !document.hidden && document.hasFocus();
    const showStatus = () => {
      status.textContent = phase === "finisher" ? "GLITCH RESTORED — TOUCH THE SPIDER" : `LASER HITS ${hits} / 12 · CURSOR HEALTH ${health} / 3${phase === "fighting" && !active() ? " · PAUSED" : ""}`;
    };
    function clearHazards() { hazards.forEach(h => h.element.remove()); hazards = []; }
    function armFinisher() {
      phase = "finisher";
      story.save("finisher");
      clearHazards();
      target.classList.add("sf-weakened");
      emitters.forEach(emitter => { emitter.button.disabled = true; });
      showStatus();
    }
    function fire(emitter) {
      if (phase !== "fighting" || !active() || elapsed < emitter.readyAt) return;
      emitter.readyAt = elapsed + 1.8;
      hits++;
      const beam = document.createElement("div");
      beam.className = "sf-laser-beam";
      const bounds = board.getBoundingClientRect();
      const dx = (boss.x - emitter.x) * bounds.width;
      const dy = (boss.y - .91) * bounds.height;
      place(beam, emitter.x, .91);
      beam.style.width = `${Math.hypot(dx, dy)}px`;
      beam.style.transform = `rotate(${Math.atan2(dy, dx)}rad)`;
      board.append(beam);
      beams.push({ element: beam, expires: elapsed + .22 });
      target.classList.remove("sf-impact");
      void target.offsetWidth;
      target.classList.add("sf-impact");
      if (hits >= 12) armFinisher();
      showStatus();
    }
    [.15, .5, .85].forEach((x, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "sf-emitter";
      button.textContent = `LASER ${index + 1}`;
      button.disabled = true;
      place(button, x, .91);
      panel.querySelector(".sf-boss-lasers").append(button);
      const emitter = { button, x, readyAt: 0 };
      emitters.push(emitter);
      on(button, "click", event => {
        const touch = event.pointerType === "touch" || event.pointerType === "pen";
        if (touch) track(event);
        fire(emitter);
        if (touch) pointer.inside = false;
      });
    });
    function track(event) {
      const bounds = board.getBoundingClientRect();
      pointer = { x: (event.clientX - bounds.left) / bounds.width, y: (event.clientY - bounds.top) / bounds.height, inside: true };
    }
    on(board, "pointermove", track);
    on(board, "pointerdown", event => {
      track(event);
      if (phase === "finisher") {
        const bounds = board.getBoundingClientRect();
        if (Math.hypot((pointer.x - boss.x) * bounds.width, (pointer.y - boss.y) * bounds.height) < 42) finish();
      }
    });
    on(board, "pointerleave", () => { pointer.inside = false; });
    on(board, "pointercancel", () => { pointer.inside = false; });
    on(board, "pointerup", event => { if (event.pointerType !== "mouse") pointer.inside = false; });
    on(window, "blur", () => { pointer.inside = false; });
    function addAttack() {
      const spike = attackNumber++ % 2 === 0;
      const element = document.createElement("div");
      element.className = spike ? "sf-spike sf-warning" : "sf-projectile sf-warning";
      element.textContent = spike ? "▲ ▲ ▲" : "✹";
      const hazard = { element, spike, x: spike ? Math.max(.12, Math.min(.88, pointer.x)) : boss.x, y: spike ? Math.max(.15, Math.min(.87, pointer.y)) : boss.y, born: elapsed, dx: pointer.x - boss.x, dy: pointer.y - boss.y };
      const length = Math.hypot(hazard.dx, hazard.dy) || 1;
      hazard.dx /= length; hazard.dy /= length;
      place(element, hazard.x, hazard.y);
      panel.querySelector(".sf-boss-hazards").append(element);
      hazards.push(hazard);
    }
    function damage() {
      if (elapsed < immuneUntil) return;
      health--;
      immuneUntil = elapsed + 1.1;
      board.classList.remove("sf-damage");
      void board.offsetWidth;
      board.classList.add("sf-damage");
      if (!health) {
        phase = "ready";
        clearHazards();
        startButton.hidden = false;
        startButton.textContent = "RETRY FIGHT";
        emitters.forEach(emitter => { emitter.button.disabled = true; });
        status.textContent = "CURSOR LOST — BOSS CHECKPOINT SAVED";
      } else showStatus();
    }
    async function finish() {
      if (phase !== "finisher") return;
      phase = "ending";
      aura.hidden = true;
      story.save("victory");
      target.classList.add("sf-boss-exploding");
      status.textContent = "SPIDER CORE DESTROYED";
      await new Promise(resolve => setTimeout(resolve, 650));
      const box = target.getBoundingClientRect();
      target.hidden = true;
      await story.shockwave({ x: box.left + box.width / 2, y: box.top + box.height / 2 });
      location.replace(window.HackuleanKnowledge.url());
    }
    on(startButton, "click", () => {
      phase = "fighting";
      health = 3; hits = 0; elapsed = 0; immuneUntil = 0; nextAttack = 1.5; attackNumber = 0;
      emitters.forEach(emitter => { emitter.readyAt = 0; emitter.button.disabled = false; });
      clearHazards();
      startButton.hidden = true;
      showStatus();
    });
    function tick(now) {
      const dt = Math.min(.05, Math.max(0, (now - last) / 1000));
      last = now;
      if ((phase === "fighting" || phase === "finisher") && active()) {
        elapsed += dt;
        if (phase === "fighting") {
          boss = { x: .5 + Math.sin(elapsed * .8) * .3, y: .24 + Math.cos(elapsed) * .08 };
          if (elapsed >= nextAttack) { addAttack(); nextAttack = elapsed + 1.1; }
          emitters.forEach(emitter => {
            emitter.button.disabled = elapsed < emitter.readyAt;
            emitter.button.classList.toggle("sf-cooling", elapsed < emitter.readyAt);
          });
          const bounds = board.getBoundingClientRect();
          for (const hazard of [...hazards]) {
            const age = elapsed - hazard.born;
            if (age > .75) {
              hazard.element.classList.remove("sf-warning");
              if (!hazard.spike) { hazard.x += hazard.dx * dt * .42; hazard.y += hazard.dy * dt * .42; }
              const dx = Math.abs(pointer.x - hazard.x) * bounds.width;
              const dy = Math.abs(pointer.y - hazard.y) * bounds.height;
              if (hazard.spike ? dx < 52 && dy < 28 : Math.hypot(dx, dy) < 22) damage();
              if (phase !== "fighting") break;
            }
            place(hazard.element, hazard.x, hazard.y);
            if (age > (hazard.spike ? 2.3 : 4)) {
              hazard.element.remove();
              hazards = hazards.filter(entry => entry !== hazard);
            }
          }
        } else {
          aura.hidden = false;
          place(aura, pointer.x, pointer.y);
          const bounds = board.getBoundingClientRect();
          if (Math.hypot((pointer.x - boss.x) * bounds.width, (pointer.y - boss.y) * bounds.height) < 42) finish();
        }
        place(target, boss.x, boss.y);
      } else aura.hidden = true;
      for (let i = beams.length - 1; i >= 0; i--) {
        if (elapsed >= beams[i].expires || phase === "ready") { beams[i].element.remove(); beams.splice(i, 1); }
      }
      if (phase === "fighting") showStatus();
      frame = requestAnimationFrame(tick);
    }
    place(target, boss.x, boss.y);
    if (story.read().stage === "finisher") { startButton.hidden = true; armFinisher(); }
    else showStatus();
    frame = requestAnimationFrame(tick);
    on(window, "pagehide", () => { cancelAnimationFrame(frame); controls.abort(); });
  }
  window.HackuleanSpiderBoss = Object.freeze({ start });
})();
