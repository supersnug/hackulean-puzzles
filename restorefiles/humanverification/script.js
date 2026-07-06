const VERIFICATION_KEY = "restore_files_verification_complete";
const arena = document.getElementById("arena");
const sentinel = document.getElementById("sentinel");
const heartsElement = document.getElementById("hearts");
const bossFill = document.getElementById("boss-fill");
const instructions = document.getElementById("instructions");
const message = document.getElementById("message");
const restartButton = document.getElementById("restart-button");

let pointer = { x: window.innerWidth / 2, y: window.innerHeight * .75 };
let boss = { x: window.innerWidth / 2, y: window.innerHeight / 2, vx: 42, vy: 34 };
let hearts = 3;
let bossHits = 0;
let combatStarted = false;
let gameOver = false;
let damageCooldown = false;
let lastFrame = performance.now();
let redSpawnTimer = 0;
let blueSpawnTimer = 0;
const jetpacks = [];

window.addEventListener("pointermove", (event) => {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
});

sentinel.addEventListener("click", startCombat);
sentinel.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") startCombat();
});
restartButton.addEventListener("click", () => window.location.reload());

function startCombat() {
  if (combatStarted || gameOver) return;
  combatStarted = true;
  damageCooldown = true;
  window.setTimeout(() => { damageCooldown = false; }, 800);
  instructions.classList.add("hidden");
  sentinel.classList.add("hostile");
  redSpawnTimer = window.setInterval(() => spawnJetpack("red"), 1800);
  window.setTimeout(() => {
    if (!gameOver) {
      spawnJetpack("blue");
      blueSpawnTimer = window.setInterval(() => spawnJetpack("blue"), 2400);
    }
  }, 10000);
}

function spawnJetpack(type) {
  const element = document.createElement("span");
  element.className = `jetpack ${type} wiggle`;
  const edge = Math.floor(Math.random() * 4);
  const position = edgePosition(edge);
  const jetpack = { element, type, x: position.x, y: position.y, state: "wiggle", started: performance.now(), vx: 0, vy: 0 };
  element.style.left = `${jetpack.x}px`;
  element.style.top = `${jetpack.y}px`;
  if (type === "blue") element.addEventListener("click", () => launchBlueJetpack(jetpack));
  arena.appendChild(element);
  jetpacks.push(jetpack);
  window.setTimeout(() => {
    if (jetpack.state === "wiggle") {
      element.classList.remove("wiggle");
      if (type === "red") {
        const direction = normalized(pointer.x - jetpack.x, pointer.y - jetpack.y);
        jetpack.vx = direction.x * 480;
        jetpack.vy = direction.y * 480;
        element.style.rotate = `${Math.atan2(direction.y, direction.x) * 180 / Math.PI}deg`;
        jetpack.state = "charge-linear";
      } else {
        jetpack.state = "drift";
      }
    }
  }, 1000);
}

function edgePosition(edge) {
  if (edge === 0) return { x: 15, y: 90 + Math.random() * (window.innerHeight - 110) };
  if (edge === 1) return { x: window.innerWidth - 15, y: 90 + Math.random() * (window.innerHeight - 110) };
  if (edge === 2) return { x: 15 + Math.random() * (window.innerWidth - 30), y: 82 };
  return { x: 15 + Math.random() * (window.innerWidth - 30), y: window.innerHeight - 15 };
}

function launchBlueJetpack(jetpack) {
  if (jetpack.type !== "blue" || jetpack.state === "attack-boss") return;
  jetpack.state = "attack-boss";
  jetpack.element.classList.remove("wiggle");
}

function update(now) {
  const elapsed = Math.min(.04, (now - lastFrame) / 1000);
  lastFrame = now;
  if (!gameOver) {
    updateBoss(elapsed);
    updateJetpacks(elapsed);
  }
  sentinel.style.left = `${boss.x}px`;
  sentinel.style.top = `${boss.y}px`;
  window.requestAnimationFrame(update);
}

function updateBoss(elapsed) {
  if (combatStarted && bossHits < 5) {
    const direction = normalized(pointer.x - boss.x, pointer.y - boss.y);
    boss.vx = direction.x * 215;
    boss.vy = direction.y * 215;
  }
  boss.x += boss.vx * elapsed;
  boss.y += boss.vy * elapsed;
  if (!combatStarted) bounceBoss();
  else if (bossHits < 5 && distance(boss, pointer) < 34) damageCursor();
}

function bounceBoss() {
  if (boss.x < 30 || boss.x > window.innerWidth - 30) boss.vx *= -1;
  if (boss.y < 95 || boss.y > window.innerHeight - 30) boss.vy *= -1;
  boss.x = Math.max(30, Math.min(window.innerWidth - 30, boss.x));
  boss.y = Math.max(95, Math.min(window.innerHeight - 30, boss.y));
}

function updateJetpacks(elapsed) {
  for (const jetpack of [...jetpacks]) {
    if (jetpack.state === "charge-linear") {
      jetpack.x += jetpack.vx * elapsed;
      jetpack.y += jetpack.vy * elapsed;
    }
    if (jetpack.state === "drift") moveToward(jetpack, { x: window.innerWidth / 2, y: window.innerHeight / 2 }, 45, elapsed);
    if (jetpack.state === "attack-boss") moveToward(jetpack, boss, 520, elapsed);
    jetpack.element.style.left = `${jetpack.x}px`;
    jetpack.element.style.top = `${jetpack.y}px`;
    if (jetpack.state === "charge-linear" && distance(jetpack, pointer) < 18) {
      removeJetpack(jetpack);
      damageCursor();
    } else if (jetpack.state === "attack-boss" && distance(jetpack, boss) < 35) {
      removeJetpack(jetpack);
      damageBoss();
    } else if (
      jetpack.state === "charge-linear" &&
      (jetpack.x < -50 || jetpack.x > window.innerWidth + 50 || jetpack.y < -50 || jetpack.y > window.innerHeight + 50)
    ) {
      removeJetpack(jetpack);
    }
  }
}

function moveToward(entity, target, speed, elapsed) {
  const direction = normalized(target.x - entity.x, target.y - entity.y);
  entity.x += direction.x * speed * elapsed;
  entity.y += direction.y * speed * elapsed;
}

function normalized(x, y) {
  const length = Math.hypot(x, y) || 1;
  return { x: x / length, y: y / length };
}

function distance(first, second) {
  return Math.hypot(first.x - second.x, first.y - second.y);
}

function damageCursor() {
  if (damageCooldown || gameOver) return;
  damageCooldown = true;
  hearts -= 1;
  heartsElement.textContent = `${"♥ ".repeat(hearts)}${"♡ ".repeat(3 - hearts)}`.trim();
  document.body.animate([{ filter: "none" }, { filter: "sepia(1) saturate(4) hue-rotate(320deg)" }, { filter: "none" }], { duration: 260 });
  window.setTimeout(() => { damageCooldown = false; }, 700);
  if (hearts <= 0) loseVerification();
}

function damageBoss() {
  bossHits += 1;
  bossFill.style.width = `${100 - bossHits * 20}%`;
  if (bossHits >= 5) winVerification();
}

function removeJetpack(jetpack) {
  jetpack.element.remove();
  const index = jetpacks.indexOf(jetpack);
  if (index >= 0) jetpacks.splice(index, 1);
}

function stopSpawns() {
  window.clearInterval(redSpawnTimer);
  window.clearInterval(blueSpawnTimer);
  jetpacks.splice(0).forEach((jetpack) => jetpack.element.remove());
}

function loseVerification() {
  gameOver = true;
  stopSpawns();
  message.textContent = "VERIFICATION FAILED";
  message.classList.remove("hidden");
  restartButton.classList.remove("hidden");
}

async function winVerification() {
  gameOver = true;
  stopSpawns();
  sentinel.classList.remove("hostile");
  sentinel.classList.add("defeated");
  message.classList.remove("hidden");
  message.textContent = "HUMAN VERIFICATION COMPLETE";
  for (let count = 3; count >= 1; count--) {
    await wait(1000);
    message.textContent = `HUMAN VERIFICATION COMPLETE\nRETURNING IN ${count}`;
  }
  try { window.localStorage.setItem(VERIFICATION_KEY, "1"); } catch (_error) {}
  window.location.href = "/restorefiles";
}

function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

window.requestAnimationFrame(update);
