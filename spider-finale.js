(() => {
  const KEY = "hackulean_spider_finale";
  const stages = ["dormant", "portal", "quiz", "boss", "finisher", "victory", "restored"];
  let memory = { stage: "dormant", solved: [] };
  function read() {
    try {
      const data = JSON.parse(localStorage.getItem(KEY));
      if (data && stages.includes(data.stage)) memory = { stage: data.stage, solved: Array.isArray(data.solved) ? [...new Set(data.solved.filter(id => Number.isInteger(id) && id >= 0 && id < 10))] : [] };
    } catch (_) {}
    return { ...memory, solved: [...memory.solved] };
  }
  function save(stage, details = {}) {
    memory = { ...read(), ...details, stage };
    try { localStorage.setItem(KEY, JSON.stringify(memory)); } catch (_) {}
  }
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  const portalMarkup = '<i></i><i></i><i></i><b></b>';
  const spiderMarkup = '<svg viewBox="0 0 64 64" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="3"><path d="M26 25 12 12 4 22M25 30 9 25 2 35M25 36 10 42 4 53M27 42 19 53 20 62M38 25 52 12 60 22M39 30 55 25 62 35M39 36 54 42 60 53M37 42 45 53 44 62"/></g><ellipse cx="32" cy="36" rx="11" ry="16" fill="currentColor"/><circle cx="32" cy="18" r="8" fill="currentColor"/></svg>';
  let started = false;
  async function lockBottom(animate = false) {
    const startY = window.scrollY;
    document.documentElement.classList.add("sf-scroll-lock");
    document.body.classList.add("sf-scroll-lock");
    const bottom = () => Math.max(0, document.documentElement.scrollHeight - innerHeight);
    if (animate && Math.abs(bottom() - startY) > 1) {
      const startedAt = performance.now();
      await new Promise(resolve => {
        function scrollFrame(now) {
          const progress = Math.min(1, (now - startedAt) / 1200);
          const eased = progress < .5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
          window.scrollTo({ top: startY + (bottom() - startY) * eased, behavior: "instant" });
          if (progress < 1) requestAnimationFrame(scrollFrame);
          else resolve();
        }
        requestAnimationFrame(scrollFrame);
      });
    }
    window.scrollTo({ top: bottom(), behavior: "instant" });
  }
  function center(element) {
    const box = element.getBoundingClientRect();
    return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
  }
  function makePortal(logo) {
    const portal = document.createElement("button");
    portal.type = "button";
    portal.className = "sf-portal";
    portal.setAttribute("aria-label", "Enter altered Knowledge Test portal");
    portal.innerHTML = portalMarkup;
    document.body.append(portal);
    const position = () => {
      const point = center(logo);
      portal.style.left = `${point.x}px`;
      portal.style.top = `${point.y}px`;
    };
    position();
    window.addEventListener("resize", position);
    window.addEventListener("pagehide", () => window.removeEventListener("resize", position), { once: true });
    return portal;
  }
  async function beginPortal(original) {
    if (started) return;
    started = true;
    const card = document.querySelector('[data-puzzle-id="09-knowledge-test"]');
    const logo = card.querySelector(".icon-frame");
    if (read().stage === "dormant") {
      await wait(1000);
      await lockBottom(true);
      const spider = original.cloneNode(true);
      spider.removeAttribute("data-spider-id");
      spider.className = "sf-story-spider";
      const source = center(original);
      original.hidden = true;
      document.body.append(spider);
      const move = async (point, duration) => {
        spider.style.transition = `left ${duration}ms ease-in-out, top ${duration}ms ease-in-out`;
        spider.style.left = `${point.x}px`;
        spider.style.top = `${point.y}px`;
        await wait(duration);
      };
      await move(source, 0);
      const cracks = document.createElement("span");
      cracks.className = "sf-cracks";
      cracks.innerHTML = '<svg viewBox="0 0 64 64"><path d="M32 0 25 22 34 31 21 44 26 64"/><path d="M0 14 25 22 15 32 0 39"/><path d="M34 31 50 20 64 25"/><path d="M21 44 44 46 52 64M44 46 49 34 64 38"/></svg>';
      logo.append(cracks);
      for (let hit = 1; hit <= 4; hit++) {
        const target = center(logo);
        await move({ x: target.x + 85, y: target.y - 12 }, 330);
        await move(target, 170);
        logo.dataset.cracks = String(hit);
        card.classList.remove("sf-impact");
        void card.offsetWidth;
        card.classList.add("sf-impact");
        await wait(220);
      }
      const point = center(logo);
      const retreat = move({ x: point.x + 140, y: point.y - 65 }, 180);
      const portal = makePortal(logo);
      portal.disabled = true;
      portal.classList.add("sf-forming");
      cracks.classList.add("sf-cracks-absorbing");
      await retreat;
      await wait(850);
      cracks.remove();
      delete logo.dataset.cracks;
      const label = card.querySelector(".puzzle-state").getBoundingClientRect();
      const copy = card.querySelector(".puzzle-copy").getBoundingClientRect();
      const bounds = card.getBoundingClientRect();
      await move({ x: Math.min(label.left - 22, Math.max(copy.right + 12, bounds.left + bounds.width * .65)), y: bounds.top + bounds.height * .68 }, 650);
      spider.classList.add("sf-merging");
      card.classList.add("sf-merging-card");
      await wait(750);
      spider.remove();
      card.classList.remove("sf-merging-card");
      card.classList.remove("sf-impact");
      card.classList.add("sf-after-merge");
      await wait(650);
      card.classList.remove("sf-after-merge");
      save("portal");
      enablePortal(portal);
    } else {
      original.hidden = true;
      lockBottom();
      enablePortal(makePortal(logo));
    }
  }
  function enablePortal(portal) {
    portal.disabled = false;
    portal.classList.remove("sf-forming");
    portal.addEventListener("click", async () => {
      portal.disabled = true;
      if (read().stage === "portal") save("quiz");
      portal.classList.add("sf-portal-expand");
      await wait(1100);
      location.href = window.HackuleanKnowledge.url("knowledgetest/");
    }, { once: true });
  }
  async function shockwave(point, onReach = () => {}) {
    const wave = document.createElement("div");
    wave.className = "sf-shockwave";
    wave.style.left = `${point.x}px`;
    wave.style.top = `${point.y}px`;
    document.body.append(wave);
    const radius = Math.hypot(Math.max(point.x, innerWidth - point.x), Math.max(point.y, innerHeight - point.y), document.documentElement.scrollHeight);
    const start = performance.now();
    await new Promise(resolve => {
      function frame(now) {
        const progress = Math.min(1, (now - start) / 2400);
        const size = radius * progress;
        wave.style.width = wave.style.height = `${size * 2}px`;
        wave.style.opacity = String(1 - progress * .6);
        onReach(size);
        if (progress < 1) requestAnimationFrame(frame);
        else resolve();
      }
      requestAnimationFrame(frame);
    });
    wave.remove();
  }
  async function restoreHub() {
    const shell = document.querySelector(".shell");
    shell.inert = true;
    lockBottom();
    const card = document.querySelector('[data-puzzle-id="09-knowledge-test"]');
    const portal = makePortal(card.querySelector(".icon-frame"));
    portal.disabled = true;
    await wait(400);
    const point = center(portal);
    const cards = [...document.querySelectorAll(".puzzle-card")];
    await shockwave(point, radius => {
      cards.forEach(node => {
        if (node.classList.contains("sf-restored")) return;
        const target = center(node);
        if (Math.hypot(target.x - point.x, target.y - point.y) > radius) return;
        node.classList.add("sf-restored");
        node.querySelector(".puzzle-state").textContent = node.classList.contains("puzzle-card-complete") ? "PUZZLE COMPLETE" : "RESTORED";
      });
    });
    portal.classList.add("sf-sealed");
    await wait(600);
    // Write completion before committing the restored checkpoint so reloads can replay an interrupted wave.
    try {
      const map = JSON.parse(localStorage.getItem("hackulean_puzzle_completion_map") || "{}");
      map["09-knowledge-test"] = true;
      localStorage.setItem("hackulean_puzzle_completion_map", JSON.stringify(map));
    } catch (_) {}
    window.HackuleanKnowledge.save("restored");
    save("restored");
    location.replace(window.HackuleanKnowledge.url());
  }
  window.HackuleanSpiderFinale = Object.freeze({ read, save, beginPortal, restoreHub, shockwave, spiderMarkup });
})();
