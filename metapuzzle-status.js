(() => {
  if (window.HACKULEAN_SUPPRESS_MP1_STATUS) return;

  const ACTIVE_KEY = "hackulean_metapuzzle_1_active";
  const STARTED_AT_KEY = "hackulean_metapuzzle_1_started_at";

  function readStartTime() {
    try {
      if (localStorage.getItem(ACTIVE_KEY) !== "1") return 0;

      const stored = Number(localStorage.getItem(STARTED_AT_KEY));
      if (Number.isFinite(stored) && stored > 0) return stored;

      const migratedStartTime = Date.now();
      localStorage.setItem(STARTED_AT_KEY, String(migratedStartTime));
      return migratedStartTime;
    } catch (_error) {
      return 0;
    }
  }

  function formatElapsed(milliseconds) {
    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds]
      .map((value) => String(value).padStart(2, "0"))
      .join(":");
  }

  function mountTimer(startTime) {
    const host = document.createElement("div");
    host.id = "metapuzzle-one-status";
    host.setAttribute("aria-label", "Metapuzzle 1 total elapsed time");
    const shadow = host.attachShadow({ mode: "closed" });

    const style = document.createElement("style");
    style.textContent = `
      :host {
        position: fixed;
        top: 14px;
        right: 14px;
        z-index: 2147483647;
        pointer-events: none;
        font-family: "Courier New", Courier, monospace;
      }
      .timer {
        min-width: 150px;
        padding: 9px 12px;
        border: 1px solid rgba(126, 242, 154, .72);
        border-radius: 8px;
        color: #e6f6ff;
        background: rgba(3, 11, 19, .92);
        box-shadow: 0 0 20px rgba(126, 242, 154, .16);
        backdrop-filter: blur(7px);
        text-align: right;
      }
      .label {
        display: block;
        margin-bottom: 3px;
        color: #7ef29a;
        font-size: 9px;
        letter-spacing: .12em;
        white-space: nowrap;
      }
      time {
        font-size: 16px;
        font-weight: 700;
        letter-spacing: .08em;
        text-shadow: 0 0 10px rgba(126, 242, 154, .25);
      }
      @media (max-width: 520px) {
        :host { top: 8px; right: 8px; }
        .timer { min-width: 128px; padding: 7px 9px; }
        .label { font-size: 8px; }
        time { font-size: 13px; }
      }
    `;

    const timer = document.createElement("div");
    timer.className = "timer";
    timer.innerHTML = '<span class="label">METAPUZZLE 1 // ACTIVE</span><time datetime="PT0S">00:00:00</time>';
    const output = timer.querySelector("time");
    shadow.append(style, timer);
    document.body.appendChild(host);

    const update = () => {
      const elapsedMilliseconds = Date.now() - startTime;
      const elapsedSeconds = Math.max(0, Math.floor(elapsedMilliseconds / 1000));
      output.textContent = formatElapsed(elapsedMilliseconds);
      output.dateTime = `PT${elapsedSeconds}S`;
    };

    update();
    const interval = window.setInterval(update, 1000);
    window.addEventListener("pagehide", () => window.clearInterval(interval), { once: true });
  }

  const startTime = readStartTime();
  if (startTime) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => mountTimer(startTime), { once: true });
    } else {
      mountTimer(startTime);
    }
  }
})();
