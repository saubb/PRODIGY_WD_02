let startTime = 0, elapsed = 0, timer = null;

const display = document.getElementById("display");
const startStopBtn = document.getElementById("startStopBtn");
const lapBtn = document.getElementById("lapBtn");
const resetBtn = document.getElementById("resetBtn");
const lapsList = document.getElementById("laps");
const modeToggle = document.getElementById("modeToggle");
const body = document.body;

function format(ms) {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const msRem = ms % 1000;
  return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}.${String(msRem).padStart(3,"0")}`;
}

function updateDisplay() {
  const now = Date.now();
  const diff = now - startTime + elapsed;
  display.textContent = format(diff);
}

function startStop() {
  if (timer) {
    clearInterval(timer);
    elapsed += Date.now() - startTime;
    timer = null;
    startStopBtn.textContent = "Start";
    lapBtn.disabled = true;
  } else {
    startTime = Date.now();
    timer = setInterval(updateDisplay, 10);
    startStopBtn.textContent = "Pause";
    lapBtn.disabled = false;
  }
}

function reset() {
  clearInterval(timer);
  timer = null;
  elapsed = 0;
  display.textContent = "00:00.000";
  startStopBtn.textContent = "Start";
  lapBtn.disabled = true;
  lapsList.innerHTML = "";
  localStorage.removeItem("stopwatchLaps");
}

function lap() {
  const timeStr = display.textContent;
  const li = document.createElement("li");
  li.textContent = `Lap ${lapsList.children.length + 1}: ${timeStr}`;
  lapsList.prepend(li);
  saveLaps();
}

function saveLaps() {
  const laps = Array.from(lapsList.children).map(li => li.textContent);
  localStorage.setItem("stopwatchLaps", JSON.stringify(laps));
}

function loadLaps() {
  const stored = JSON.parse(localStorage.getItem("stopwatchLaps") || "[]");
  stored.forEach(text => {
    const li = document.createElement("li");
    li.textContent = text;
    lapsList.append(li);
  });
}

function toggleMode() {
  const isDark = body.getAttribute("data-theme") === "dark";
  if (isDark) {
    body.removeAttribute("data-theme");
    modeToggle.textContent = "Switch to Dark Mode";
    localStorage.setItem("theme", "light");
  } else {
    body.setAttribute("data-theme", "dark");
    modeToggle.textContent = "Switch to Light Mode";
    localStorage.setItem("theme", "dark");
  }
}

window.addEventListener("load", () => {
  const theme = localStorage.getItem("theme") || "light";
  if (theme === "dark") {
    body.setAttribute("data-theme", "dark");
    modeToggle.textContent = "Switch to Light Mode";
  }
  loadLaps();
});

// Bind Events
startStopBtn.addEventListener("click", startStop);
resetBtn.addEventListener("click", reset);
lapBtn.addEventListener("click", lap);
modeToggle.addEventListener("click", toggleMode);
