(() => {
  const state = window.HackuleanKnowledge;
  const get = (id) => document.getElementById(id);
  const CHALLENGE_DURATION_MS = 20000;
  const questions = [
    { category: "HACKPRETEND", text: "What was the abandoned network you infiltrated in HackPretend?", answers: ["World Tunnel", "Sky Bridge", "Neon Vault", "Cloud Harbor"], correct: 0 },
    { category: "DESTROY DATABASE", text: "What sensitive information was stored in the rogue database?", answers: ["Weather forecasts", "IP addresses and passwords", "Music playlists", "Satellite images"], correct: 1 },
    { category: "RESTORE FILES", text: "After defeating the virus, what still needed to be recovered?", answers: ["The hacker's account", "A satellite", "Your files", "The quiz scores"], correct: 2 },
    { category: "HACKPRETEND", text: "Which terminal command overloaded the relay with an oversized transfer?", answers: ["whoami", "ls", "echo", "send_data"], correct: 3 },
    { category: "STAGE 2", text: "Which tool scans records for active threat signatures?", answers: ["Memory Viewer", "Virus Scanner", "System Clock", "File Browser"], correct: 1 },
    { category: "STAGE 2", text: "What is the Quarantine Bot responsible for?", answers: ["Keeping isolated payloads sealed", "Changing the clock", "Generating passwords", "Opening the quiz"], correct: 0 },
    { category: "NETWORK", text: "Which signal can still be trusted?", answers: ["Root", "Archive", "Recovery", "None"], correct: -1 },
  ];
  let timer = 0;
  let deadline = 0;
  let questionIndex = state.read().question;
  let hackPercent = state.read().hackPercent || 0;
  let cancelWave = () => {};

  get("back-link").href = state.url();
  function show(view) {
    window.clearInterval(timer);
    ["quiz", "challenge", "locked"].forEach((id) => { get(id).hidden = id !== view; });
    if (view === "challenge") {
      questionIndex = 6;
      renderQuestion("", true);
      get("quiz").hidden = false;
      get("quiz").inert = true;
      document.body.classList.add("virus-active");
    }
  }

  function renderQuestion(message = "", background = false) {
    if (!background) show("quiz");
    const question = questions[questionIndex];
    const corruption = Math.max(0, questionIndex - 2);
    if (!background) {
      if (questionIndex === 6) state.save("stranded", 6);
      else state.save("quiz", questionIndex);
    }
    get("question").textContent = question.text;
    get("score").textContent = String(questionIndex);
    get("category").textContent = question.category;
    get("number").textContent = `${String(questionIndex + 1).padStart(2, "0")} / 07`;
    ["score-panel", "category-panel", "number-panel"].forEach((id, index) => {
      get(id).classList.toggle("blank", index < corruption);
    });
    get("feedback").textContent = message;
    get("answers").replaceChildren();
    let corruptedCount = 0;
    question.answers.forEach((answer, index) => {
      const corrupted = index !== question.correct && corruptedCount < corruption;
      if (corrupted) corruptedCount++;
      const button = document.createElement("button");
      button.type = "button";
      button.className = `answer${corrupted ? " corrupted" : ""}`;
      const symbol = document.createElement("span");
      symbol.className = "answer-symbol";
      symbol.setAttribute("aria-hidden", "true");
      symbol.textContent = ["▲", "◆", "●", "■"][index];
      const label = document.createElement("span");
      label.textContent = corrupted ? "[CORRUPTED]" : answer;
      button.append(symbol, label);
      button.addEventListener("click", () => {
        if (performance.now() >= deadline) { renderQuestion("Time expired. Retrying the same question."); return; }
        if (index !== question.correct || corrupted) {
          renderQuestion(questionIndex === 6 ? "SIGNAL REJECTED. Restarting question..." : "Incorrect signal. Try this question again.");
          return;
        }
        questionIndex++;
        renderQuestion();
      });
      get("answers").appendChild(button);
    });
    if (background) {
      get("clock").textContent = "ERR";
      get("question-fill").style.width = "0%";
      get("question-progress").setAttribute("aria-valuenow", "0");
      return;
    }
    deadline = performance.now() + 20000;
    updateQuizClock();
    timer = window.setInterval(updateQuizClock, 100);
  }

  function updateQuizClock() {
    const seconds = Math.max(0, (deadline - performance.now()) / 1000);
    get("clock").textContent = `${Math.ceil(seconds)}s`;
    get("question-fill").style.width = `${seconds * 5}%`;
    get("question-progress").setAttribute("aria-valuenow", seconds.toFixed(1));
    if (seconds <= 0) renderQuestion("Time expired. Retrying the same question.");
  }

  function renderHackProgress(percent) {
    hackPercent = Math.min(100, percent);
    get("hack-percent").textContent = `${Math.floor(hackPercent)}%`;
    get("hack-fill").style.width = `${hackPercent}%`;
    get("hack-progress").setAttribute("aria-valuenow", String(Math.floor(hackPercent)));
  }

  function updateHackClock() {
    renderHackProgress((1 - (deadline - performance.now()) / CHALLENGE_DURATION_MS) * 100);
    if (hackPercent >= 100) {
      window.clearInterval(timer);
      cancelWave();
      state.save("spread");
      location.href = state.url();
      return false;
    }
    return true;
  }

  function startChallenge() {
    show("challenge");
    state.save("challenge");
    deadline = performance.now() + CHALLENGE_DURATION_MS;
    get("stop-virus").hidden = true;
    renderHackProgress(0);
    get("challenge-status").textContent = "VIRUS DETECTED // 0 / 10 errors acknowledged";
    cancelWave = window.HackuleanCorruptionUI.errorWave({
      onDismiss: (count) => {
        if (!updateHackClock()) return false;
        get("challenge-status").textContent = `VIRUS DETECTED // ${count} / 10 errors acknowledged`;
        return true;
      },
      onComplete: showStopButton,
    });
    timer = window.setInterval(updateHackClock, 50);
  }

  function showStopButton() {
    show("challenge");
    state.save("cleared", undefined, { hackPercent });
    renderHackProgress(hackPercent);
    get("stop-virus").hidden = false;
    get("challenge-status").textContent = "All errors acknowledged. Emergency containment available.";
    get("stop-virus").focus();
  }

  function stopVirus() {
    show("challenge");
    state.save("stopping", undefined, { hackPercent });
    get("stop-virus").hidden = true;
    renderHackProgress(hackPercent);
    get("challenge-status").textContent = "";
  }
  get("stop-virus").addEventListener("click", stopVirus);

  let unlocked = false;
  try { unlocked = Boolean(JSON.parse(localStorage.getItem("hackulean_puzzle_completion_map") || "{}")?.["08-metapuzzle-2"]); } catch (_error) {}
  if (!unlocked) { show("locked"); return; }
  if (window.HackuleanSpiderFinale.read().stage !== "dormant") {
    window.HackuleanAlteredQuiz.start(questions);
    return;
  }
  const phase = state.read().phase;
  if (["recovery", "hub-collapse", "overrun"].includes(phase)) location.replace(state.url());
  else if (phase === "stopping") stopVirus();
  else if (phase === "cleared") showStopButton();
  else if (phase === "spread" || phase === "challenge") startChallenge();
  else renderQuestion();

  window.addEventListener("pagehide", () => { window.clearInterval(timer); cancelWave(); });
  window.addEventListener("pageshow", (event) => { if (event.persisted) location.reload(); });
})();
