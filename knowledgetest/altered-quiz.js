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
    function dispose() {
      clearInterval(timer);
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
          if (Math.random() < .5 && order.length > 1) {
            // Shuffle only unanswered real questions, preserving fake-question interruptions.
            const real = shuffle(order.filter(id => id < 7));
            let index = 0;
            order.forEach((id, slot) => { if (id < 7) order[slot] = real[index++]; });
            get("feedback").textContent = "The spider rearranged the remaining archive.";
          } else {
            ["The spider knows", "[SIGNAL MISSING]", "Ask the void"].forEach(text => answerButton(text, false));
            get("feedback").textContent = "The spider injected more answers.";
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
