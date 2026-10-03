(() => {
  function start(originalQuestions) {
    const story = window.HackuleanSpiderFinale;
    const get = id => document.getElementById(id);
    if (["victory", "restored"].includes(story.read().stage)) {
      location.replace(window.HackuleanKnowledge.url());
      return;
    }
    if (["boss", "finisher"].includes(story.read().stage)) {
      window.HackuleanSpiderBoss.start();
      return;
    }
    if (story.read().stage === "portal") story.save("quiz");
    const questions = originalQuestions.map(question => ({ ...question, answers: [...question.answers] }));
    questions[6] = { category: "RECOVERY", text: "Which recovery option accepted the spider's infected update?", answers: ["Apply update from ADB", "Wipe cache partition", "Power off", "Reboot system now"], correct: 0 };
    questions.push(
      { category: "IMPOSSIBLE ARCHIVE", text: "Which netwrok contains the infinte last number?", typos: ["netwrok", "infinte"], answers: ["Zero", "Infinity", "The archive", "The last number"] },
      { category: "IMPOSSIBLE CLOCK", text: "What seccond comes before the begining of all time?", typos: ["seccond", "begining"], answers: ["Yesterday", "Minus one", "Midnight", "The first second"] },
      { category: "IMPOSSIBLE SIGNAL", text: "Which answwer is both entirley true and entirely false?", typos: ["answwer", "entirley"], answers: ["This one", "Every answer", "Neither", "All signals"] },
    );
    let solved = new Set(story.read().solved);
    const order = [0, 1, 7, 2, 3, 8, 4, 5, 9, 6].filter(id => !solved.has(id));
    let current = null;
    let timer = 0;
    let deadline = 0;
    let interferenceAt = 0;
    let interfered = false;
    let selectedTypos = new Set();
    const controls = new AbortController();
    let miniFrame = 0;
    let minis = [];
    const pointer = { x: 0, y: 0, inside: false };
    const trackPointer = event => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.inside = true;
    };
    const on = (target, event, handler) => target.addEventListener(event, handler, { signal: controls.signal });
    on(document, "pointermove", trackPointer);
    on(document, "pointerdown", trackPointer);
    on(document.documentElement, "pointerleave", () => { pointer.inside = false; });
    on(window, "blur", () => { pointer.inside = false; });
    on(document, "pointercancel", () => { pointer.inside = false; });
    on(document, "pointerup", event => { if (event.pointerType !== "mouse") pointer.inside = false; });
    const intruder = document.createElement("div");
    intruder.className = "sf-quiz-spider";
    intruder.innerHTML = story.spiderMarkup;
    intruder.hidden = true;
    document.body.append(intruder);
    get("quiz").hidden = false;
    get("quiz").inert = false;
    document.body.classList.add("sf-altered-quiz");
    const shuffle = items => {
      for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
      }
      return items;
    };
    function clearMinis() {
      cancelAnimationFrame(miniFrame);
      minis.forEach(spider => spider.element.remove());
      minis = [];
    }
    function shuffleAnswers() {
      const buttons = [...get("answers").children];
      const previous = new Map(buttons.map(button => [button, button.getBoundingClientRect()]));
      const rearranged = shuffle([...buttons]);
      if (rearranged.every((button, index) => button === buttons[index])) rearranged.push(rearranged.shift());
      get("answers").replaceChildren(...rearranged);
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      rearranged.forEach(button => {
        const before = previous.get(button);
        const after = button.getBoundingClientRect();
        button.animate([
          { transform: `translate(${before.left - after.left}px, ${before.top - after.top}px)` },
          { transform: "translate(0, 0)" },
        ], { duration: 380, easing: "ease-in-out" });
      });
    }
    function spawnMinis() {
      clearMinis();
      const starts = [[.94, .18], [.94, .5], [.06, .25]];
      minis = starts.map(([x, y], index) => {
        const element = document.createElement("div");
        element.className = "sf-mini-spider";
        element.setAttribute("aria-hidden", "true");
        element.innerHTML = story.spiderMarkup;
        document.body.append(element);
        return { element, x: x * innerWidth, y: y * innerHeight, speed: 95 + index * 14 };
      });
      const position = spider => {
        spider.x = Math.max(14, Math.min(innerWidth - 14, spider.x));
        spider.y = Math.max(14, Math.min(innerHeight - 14, spider.y));
        spider.element.style.transform = `translate3d(${spider.x - 14}px, ${spider.y - 14}px, 0)`;
      };
      minis.forEach(position);
      let last = performance.now();
      const graceUntil = last + 600;
      function chase(now) {
        const dt = Math.max(0, Math.min(.05, (now - last) / 1000));
        last = now;
        if (pointer.inside && !document.hidden && document.hasFocus()) {
          for (const spider of minis) {
            const dx = pointer.x - spider.x;
            const dy = pointer.y - spider.y;
            const distance = Math.hypot(dx, dy);
            const step = Math.min(distance, spider.speed * dt);
            if (distance > 0) {
              spider.x += dx / distance * step;
              spider.y += dy / distance * step;
            }
            position(spider);
            if (now >= graceUntil && Math.hypot(pointer.x - spider.x, pointer.y - spider.y) <= 13) {
              render("A mini-spider caught your cursor. Retrying this question.");
              return;
            }
          }
        }
        miniFrame = requestAnimationFrame(chase);
      }
      miniFrame = requestAnimationFrame(chase);
    }
    function dispose() {
      clearInterval(timer);
      clearMinis();
      controls.abort();
      intruder.remove();
    }
    function advance() {
      solved.add(current);
      story.save("quiz", { solved: [...solved] });
      current = null;
      if (!order.length) {
        dispose();
        get("quiz").hidden = true;
        story.save("boss");
        window.HackuleanSpiderBoss.start();
      } else render();
    }
    function answerButton(text, correct) {
      const button = document.createElement("button");
      button.className = "answer";
      button.type = "button";
      button.textContent = text;
      button.addEventListener("click", () => {
        if (performance.now() >= deadline) { render("Time expired. Retrying this question."); return; }
        if (correct) advance();
        else render("Signal rejected. Try this question again.");
      });
      get("answers").append(button);
    }
    function render(message = "") {
      clearInterval(timer);
      clearMinis();
      if (current === null) current = order.shift();
      const question = questions[current];
      selectedTypos = new Set();
      intruder.hidden = true;
      get("question").replaceChildren();
      question.text.split(/(\s+)/).forEach(word => {
        if (!question.typos?.includes(word)) { get("question").append(document.createTextNode(word)); return; }
        const typo = document.createElement("button");
        typo.type = "button";
        typo.className = "sf-typo";
        typo.textContent = word;
        typo.addEventListener("click", () => {
          if (performance.now() >= deadline) { render("Time expired. Retrying this question."); return; }
          selectedTypos.add(word);
          typo.classList.add("sf-typo-found");
          typo.disabled = true;
          if (selectedTypos.size === question.typos.length) advance();
        });
        get("question").append(typo);
      });
      get("score").textContent = String(solved.size);
      get("number").textContent = `${solved.size + 1} / 10`;
      get("category").textContent = question.category;
      get("feedback").textContent = message || (question.typos && ![7, 8, 9].some(id => solved.has(id)) ? "Something in the wording is wrong." : "");
      get("answers").replaceChildren();
      shuffle(question.answers.map((text, index) => ({ text, correct: index === question.correct }))).forEach(answer => answerButton(answer.text, answer.correct));
      deadline = performance.now() + 20000;
      interferenceAt = performance.now() + 2200 + Math.random() * 2500;
      interfered = Math.random() > .7;
      timer = setInterval(() => {
        const now = performance.now();
        const remaining = Math.max(0, deadline - now);
        get("clock").textContent = `${Math.ceil(remaining / 1000)}s`;
        get("question-fill").style.width = `${remaining / 200}%`;
        get("question-progress").setAttribute("aria-valuenow", String(remaining / 1000));
        if (!remaining) { render("Time expired. Retrying this question."); return; }
        if (!interfered && now >= interferenceAt) {
          interfered = true;
          intruder.hidden = false;
          intruder.classList.remove("sf-jump");
          void intruder.offsetWidth;
          intruder.classList.add("sf-jump");
          if (Math.random() < .5) {
            shuffleAnswers();
            get("feedback").textContent = "The spider shuffled your answers.";
          } else {
            spawnMinis();
            get("feedback").textContent = "Mini-spiders incoming! Answer before they catch your cursor.";
          }
        }
      }, 50);
    }
    window.addEventListener("pagehide", dispose, { once: true, signal: controls.signal });
    if (!order.length) {
      dispose();
      get("quiz").hidden = true;
      story.save("boss");
      window.HackuleanSpiderBoss.start();
    } else render();
  }
  window.HackuleanAlteredQuiz = Object.freeze({ start });
})();
