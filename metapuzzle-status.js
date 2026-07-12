(() => {
  const metapuzzles = [
    {
      number: 2,
      activeKey: "hackulean_metapuzzle_2_active",
      startedAtKey: "hackulean_metapuzzle_2_started_at",
      accent: "#51d1ff",
    },
    {
      number: 1,
      activeKey: "hackulean_metapuzzle_1_active",
      startedAtKey: "hackulean_metapuzzle_1_started_at",
      accent: "#7ef29a",
    },
  ];

  function readActiveMetapuzzle() {
    try {
      const metapuzzle = metapuzzles.find(({ activeKey }) => localStorage.getItem(activeKey) === "1");
      if (!metapuzzle) return null;
      if (metapuzzle.number === 1 && window.HACKULEAN_SUPPRESS_MP1_STATUS) return null;

      const stored = Number(localStorage.getItem(metapuzzle.startedAtKey));
      if (Number.isFinite(stored) && stored > 0) return { ...metapuzzle, startTime: stored };

      const migratedStartTime = Date.now();
      localStorage.setItem(metapuzzle.startedAtKey, String(migratedStartTime));
      return { ...metapuzzle, startTime: migratedStartTime };
    } catch (_error) {
      return null;
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

  function mountTimer({ number, accent, startTime }) {
    const host = document.createElement("div");
    host.id = number === 1 ? "metapuzzle-one-status" : "metapuzzle-two-status";
    host.setAttribute("aria-label", `Metapuzzle ${number} total elapsed time`);
    const shadow = host.attachShadow({ mode: "closed" });

    const style = document.createElement("style");
    style.textContent = `
      :host {
        --timer-accent: ${accent};
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
        border: 1px solid var(--timer-accent);
        border-radius: 8px;
        color: #e6f6ff;
        background: rgba(3, 11, 19, .92);
        box-shadow: 0 0 20px color-mix(in srgb, var(--timer-accent) 22%, transparent);
        backdrop-filter: blur(7px);
        text-align: right;
      }
      .label {
        display: block;
        margin-bottom: 3px;
        color: var(--timer-accent);
        font-size: 9px;
        letter-spacing: .12em;
        white-space: nowrap;
      }
      time {
        font-size: 16px;
        font-weight: 700;
        letter-spacing: .08em;
        text-shadow: 0 0 10px var(--timer-accent);
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
    timer.innerHTML = `<span class="label">METAPUZZLE ${number} // ACTIVE</span><time datetime="PT0S">00:00:00</time>`;
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

  const activeMetapuzzle = readActiveMetapuzzle();
  if (activeMetapuzzle) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => mountTimer(activeMetapuzzle), { once: true });
    } else {
      mountTimer(activeMetapuzzle);
    }
  }
})();
