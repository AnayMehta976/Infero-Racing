/* Lights Out — a start-light reaction trainer, based on the one Inferno Racing
 * built for the season. Five lights come on at uneven intervals, hold for a
 * random (exponentially distributed) time, then go out together. React as fast
 * as you can; pressing during the hold is a jump start.
 */
(function () {
  "use strict";

  var rig = document.getElementById("rig");
  if (!rig) return;

  var pods = rig.querySelectorAll(".rig__pod");
  var startBtn = document.getElementById("rig-start");
  var timeEl = document.getElementById("rig-time");
  var msgEl = document.getElementById("rig-msg");
  var bestEl = document.getElementById("stat-best");
  var medianEl = document.getElementById("stat-median");
  var runsEl = document.getElementById("stat-runs");
  var jumpsEl = document.getElementById("stat-jumps");
  var logEl = document.getElementById("stat-log");

  var STORE = "ir-lights-out-v1";
  var state = "idle"; // idle | sequence | hold | go | done
  var timers = [];
  var offAt = 0;
  var runs = [];
  var jumps = 0;

  try {
    var saved = JSON.parse(localStorage.getItem(STORE) || "null");
    if (saved && Array.isArray(saved.runs)) {
      runs = saved.runs.slice(-50);
      jumps = saved.jumps | 0;
    }
  } catch (e) { /* storage unavailable: session-only stats */ }

  function save() {
    try { localStorage.setItem(STORE, JSON.stringify({ runs: runs.slice(-50), jumps: jumps })); } catch (e) { /* ignore */ }
  }

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function setLights(n) {
    for (var i = 0; i < pods.length; i++) pods[i].classList.toggle("on", i < n);
  }

  function fmt(ms) { return (ms / 1000).toFixed(3); }

  function median(a) {
    if (!a.length) return null;
    var s = a.slice().sort(function (x, y) { return x - y; });
    var m = Math.floor(s.length / 2);
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  }

  function render(lastMs) {
    var best = runs.length ? Math.min.apply(null, runs) : null;
    bestEl.textContent = best == null ? "–" : fmt(best);
    var med = median(runs);
    medianEl.textContent = med == null ? "–" : fmt(med);
    runsEl.textContent = runs.length;
    jumpsEl.textContent = jumps;
    logEl.innerHTML = "";
    runs.slice(-6).reverse().forEach(function (r) {
      var li = document.createElement("li");
      li.textContent = fmt(r) + " s";
      logEl.appendChild(li);
    });
    if (lastMs != null) timeEl.innerHTML = fmt(lastMs) + "<small> s</small>";
  }

  function message(text, cls) {
    msgEl.textContent = text;
    msgEl.className = "rig__msg" + (cls ? " " + cls : "");
  }

  // Exponential hold: memoryless, so waiting longer tells you nothing.
  function holdMs() {
    var mean = 1300;
    var min = 200;
    var max = 8000;
    var t = min - mean * Math.log(1 - Math.random());
    return Math.min(t, max);
  }

  function begin() {
    clearTimers();
    setLights(0);
    state = "sequence";
    startBtn.textContent = "Restart";
    message("Watch the lights…");
    timeEl.innerHTML = "0.000<small> s</small>";
    var t = 500;
    for (var i = 1; i <= 5; i++) {
      (function (n) {
        timers.push(setTimeout(function () {
          setLights(n);
          if (n === 5) {
            state = "hold";
            timers.push(setTimeout(lightsOut, holdMs()));
          }
        }, t));
      })(i);
      t += 750 + Math.random() * 450; // uneven, so there's no rhythm to count
    }
  }

  function lightsOut() {
    // Switch off inside a frame callback and time from that frame.
    requestAnimationFrame(function (frameTime) {
      setLights(0);
      offAt = frameTime;
      state = "go";
    });
  }

  function react(eventTime) {
    if (state === "sequence" || state === "hold") {
      clearTimers();
      setLights(0);
      state = "done";
      jumps++;
      save();
      render(null);
      message("Jump start! Wait for every light to go out.", "jump");
      timeEl.innerHTML = "JUMP";
      return;
    }
    if (state !== "go") return;
    var ms = Math.max(0, eventTime - offAt);
    state = "done";
    var prevBest = runs.length ? Math.min.apply(null, runs) : Infinity;
    runs.push(ms);
    save();
    render(ms);
    if (ms < prevBest) message("Personal best! Go again.", "pb");
    else if (ms < 200) message("Rapid. That’s race-start pace.");
    else if (ms < 280) message("Solid launch. Again?");
    else message("Bit slow off the line. Again?");
  }

  function trigger(e) {
    var t = e && e.timeStamp ? e.timeStamp : performance.now();
    if (state === "idle" || state === "done") begin();
    else react(t);
  }

  startBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    begin();
  });

  rig.addEventListener("pointerdown", function (e) {
    if (e.target === startBtn || startBtn.contains(e.target)) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    trigger(e);
  });

  // Space / Enter while the trainer is on screen.
  var onScreen = false;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      onScreen = entries[0].isIntersecting;
    }, { threshold: 0.4 }).observe(rig);
  }
  document.addEventListener("keydown", function (e) {
    if (!onScreen || e.repeat) return;
    if (e.code === "Space" || e.key === " ") {
      e.preventDefault();
      trigger(e);
    } else if (e.key === "Enter" && document.activeElement !== startBtn) {
      trigger(e);
    }
  });

  // Gamepad: any button counts.
  var padDown = false;
  function pollPad() {
    var pads = navigator.getGamepads ? navigator.getGamepads() : [];
    var pressed = false;
    for (var i = 0; i < pads.length; i++) {
      var p = pads[i];
      if (!p) continue;
      for (var b = 0; b < p.buttons.length; b++) if (p.buttons[b].pressed) pressed = true;
    }
    if (pressed && !padDown && onScreen) trigger({ timeStamp: performance.now() });
    padDown = pressed;
    if (pads.length) requestAnimationFrame(pollPad);
  }
  window.addEventListener("gamepadconnected", function () { requestAnimationFrame(pollPad); });

  render(null);
})();
