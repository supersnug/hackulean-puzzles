(() => {
  function create({ layer, spiders, onRemove }) {
    const state = window.HackuleanKnowledge;
    const living = [...spiders];
    const controls = new AbortController();
    const pointer = { x: innerWidth / 2, y: innerHeight / 2, inside: false };
    let focused = document.hasFocus();
    let phase = "roaming";
    let readySeconds = 1;
    let dodgeSeconds = 30;
    let newlyActive = false;
    const aura = document.createElement("div");
    aura.className = "hk-cursor-glitch";
    aura.hidden = true;
    aura.setAttribute("aria-hidden", "true");
    document.body.append(aura);

    const on = (target, name, handler) => target.addEventListener(name, handler, { signal: controls.signal });
    const track = (event) => {
      if (!pointer.inside) newlyActive = true;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.inside = pointer.x >= 0 && pointer.y >= 0 && pointer.x <= innerWidth && pointer.y <= innerHeight;
    };
    on(document, "pointermove", track);
    on(document, "pointerdown", track);
    on(document, "pointerup", (event) => { if (event.pointerType !== "mouse") pointer.inside = false; });
    on(document, "pointercancel", () => { pointer.inside = false; });
    on(document.documentElement, "pointerleave", () => { pointer.inside = false; });
    on(window, "blur", () => { focused = false; });
    on(window, "focus", () => { focused = true; newlyActive = true; });
    on(document, "visibilitychange", () => { newlyActive = true; });

    function setPhase(next) {
      phase = next;
      layer.dataset.huntPhase = phase;
      document.body.classList.toggle("hk-spider-hunt-active", phase === "ready" || phase === "chasing" || phase === "fleeing");
      if (phase === "last") {
        aura.hidden = true;
        living[0]?.element.classList.add("hk-last-spider");
        if (living[0]) window.HackuleanSpiderFinale.beginPortal(living[0].element);
      }
    }

    function resetChase() {
      living.forEach((spider) => {
        spider.x = Math.max(0, (innerWidth - spider.width) / 2);
        spider.y = Math.max(0, (innerHeight - spider.height) / 2);
      });
      readySeconds = 1;
      dodgeSeconds = 30;
      setPhase("ready");
    }

    function startGlitch(spider, now) {
      // Reserve one survivor even when several spiders are touched in one frame.
      if (spider.dyingAt !== undefined || living.filter((entry) => entry.dyingAt === undefined).length <= 1) return;
      spider.dyingAt = now;
      spider.element.classList.add("hk-spider-glitched");
    }

    function updateExplosions(now) {
      for (let index = living.length - 1; index >= 0; index--) {
        const spider = living[index];
        if (spider.dyingAt === undefined) continue;
        const elapsed = now - spider.dyingAt;
        if (elapsed >= 450) spider.element.classList.add("hk-spider-exploding");
        if (elapsed < 850) continue;
        const destroyed = new Set(state.read().destroyedSpiders || []);
        destroyed.add(spider.spiderId);
        state.save("overrun", undefined, { destroyedSpiders: [...destroyed] });
        living.splice(index, 1);
        spider.element.remove();
        onRemove(spider);
      }
    }

    function step(seconds, now, enabled) {
      if (!enabled) return false;
      if (phase === "roaming") {
        setPhase(living.length <= 1 ? "last" : state.read().spiderGlitchUnlocked ? "fleeing" : "ready");
      }
      if (phase === "last") return true;
      updateExplosions(now);
      if (living.length <= 1) { setPhase("last"); return true; }

      const active = pointer.inside && focused && !document.hidden;
      layer.dataset.huntPaused = String(!active);
      aura.hidden = phase !== "fleeing" || !active;
      aura.style.transform = `translate3d(${pointer.x - 19}px, ${pointer.y - 19}px, 0)`;
      const elapsed = newlyActive ? 0 : seconds;
      newlyActive = false;
      if (phase === "ready") {
        if (active) readySeconds = Math.max(0, readySeconds - elapsed);
        if (readySeconds <= 0) {
          dodgeSeconds = 30;
          setPhase("chasing");
        }
        return true;
      }
      if (!active) {
        return true;
      }

      for (let index = 0; index < living.length; index++) {
        const spider = living[index];
        if (spider.dyingAt !== undefined) continue;
        const centerX = spider.x + spider.width / 2;
        const centerY = spider.y + spider.height / 2;
        const dx = pointer.x - centerX;
        const dy = pointer.y - centerY;
        const distance = Math.hypot(dx, dy);
        if (distance <= 24) {
          if (phase === "chasing") { resetChase(); return true; }
          startGlitch(spider, now);
          continue;
        }
        const speed = phase === "chasing" ? 105 + index * 9 : 125 + index * 7;
        const direction = phase === "chasing" ? 1 : -1;
        const sway = phase === "chasing" ? Math.sin(index * 1.7 + now / 600) * Math.min(28, distance * .18) : 0;
        const targetX = dx + (-dy / distance) * sway;
        const targetY = dy + (dx / distance) * sway;
        const targetDistance = Math.hypot(targetX, targetY);
        const movement = Math.min(distance, speed * elapsed);
        spider.x += targetX / targetDistance * movement * direction;
        spider.y += targetY / targetDistance * movement * direction;
        spider.x = Math.max(0, Math.min(innerWidth - spider.width, spider.x));
        spider.y = Math.max(0, Math.min(innerHeight - spider.height, spider.y));
        if (phase === "chasing" && Math.hypot(pointer.x - spider.x - spider.width / 2, pointer.y - spider.y - spider.height / 2) <= 24) {
          resetChase();
          return true;
        }
      }
      if (phase === "chasing") {
        dodgeSeconds = Math.max(0, dodgeSeconds - elapsed);
        if (dodgeSeconds <= 0) {
          state.save("overrun", undefined, { spiderGlitchUnlocked: true });
          setPhase("fleeing");
          aura.hidden = false;
        }
      }
      return true;
    }

    return {
      step,
      destroy: () => {
        controls.abort();
        aura.remove();
        document.body.classList.remove("hk-spider-hunt-active");
      },
    };
  }

  window.HackuleanSpiderHunt = Object.freeze({ create });
})();
