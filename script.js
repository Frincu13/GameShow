const STORAGE_KEY = "gameshow-host-dashboard-v1";

const DEFAULT_STATE = {
  teams: {
    teamA: { name: "Team 1", score: 0, money: 0 },
    teamB: { name: "Team 2", score: 0, money: 0 }
  },
  activeGame: "game1",
  notes: {
    game1: "",
    game2: "",
    game3: "",
    host: ""
  },
  timer: {
    duration: 60,
    remaining: 60,
    isRunning: false,
    lastTickMs: null
  },
  updatedAt: null
};

const elements = {
  teamAName: document.getElementById("teamAName"),
  teamBName: document.getElementById("teamBName"),
  teamAScore: document.getElementById("teamAScore"),
  teamBScore: document.getElementById("teamBScore"),
  teamAMoney: document.getElementById("teamAMoney"),
  teamBMoney: document.getElementById("teamBMoney"),
  gameTabs: Array.from(document.querySelectorAll("[data-game-tab]")),
  gamePanes: Array.from(document.querySelectorAll("[data-game-pane]")),
  game1Notes: document.getElementById("game1Notes"),
  game2Notes: document.getElementById("game2Notes"),
  game3Notes: document.getElementById("game3Notes"),
  hostNotes: document.getElementById("hostNotes"),
  roundDuration: document.getElementById("roundDuration"),
  timerDisplay: document.getElementById("timerDisplay"),
  startTimerBtn: document.getElementById("startTimerBtn"),
  pauseTimerBtn: document.getElementById("pauseTimerBtn"),
  resetTimerBtn: document.getElementById("resetTimerBtn"),
  saveNowBtn: document.getElementById("saveNowBtn"),
  resetAllBtn: document.getElementById("resetAllBtn"),
  saveStatus: document.getElementById("saveStatus"),
  metricButtons: Array.from(document.querySelectorAll("[data-team][data-metric][data-delta]"))
};

let state = loadState();
let timerIntervalId = null;

function cloneDefaultState() {
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function sanitizeNumber(value, fallback) {
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return fallback;
  }
  return num;
}

function clampNumber(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function sanitizeState(rawState) {
  const clean = cloneDefaultState();
  const source = rawState || {};

  clean.teams.teamA.name = String(source.teams?.teamA?.name || clean.teams.teamA.name);
  clean.teams.teamB.name = String(source.teams?.teamB?.name || clean.teams.teamB.name);
  clean.teams.teamA.score = Math.max(0, sanitizeNumber(source.teams?.teamA?.score, 0));
  clean.teams.teamB.score = Math.max(0, sanitizeNumber(source.teams?.teamB?.score, 0));
  clean.teams.teamA.money = Math.max(0, sanitizeNumber(source.teams?.teamA?.money, 0));
  clean.teams.teamB.money = Math.max(0, sanitizeNumber(source.teams?.teamB?.money, 0));

  if (["game1", "game2", "game3"].includes(source.activeGame)) {
    clean.activeGame = source.activeGame;
  }

  clean.notes.game1 = String(source.notes?.game1 || "");
  clean.notes.game2 = String(source.notes?.game2 || "");
  clean.notes.game3 = String(source.notes?.game3 || "");
  clean.notes.host = String(source.notes?.host || "");

  clean.timer.duration = clampNumber(Math.round(sanitizeNumber(source.timer?.duration, 60)), 10, 600);
  clean.timer.remaining = clampNumber(
    Math.round(sanitizeNumber(source.timer?.remaining, clean.timer.duration)),
    0,
    clean.timer.duration
  );
  clean.timer.isRunning = Boolean(source.timer?.isRunning);
  clean.timer.lastTickMs = source.timer?.lastTickMs ? Number(source.timer.lastTickMs) : null;
  clean.updatedAt = source.updatedAt || null;

  return clean;
}

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return cloneDefaultState();
    }
    const parsed = JSON.parse(stored);
    return sanitizeState(parsed);
  } catch (error) {
    return cloneDefaultState();
  }
}

function formatMoney(value) {
  return `$${value.toLocaleString("en-US")}`;
}

function formatTimer(totalSeconds) {
  const seconds = Math.max(0, Math.round(totalSeconds));
  const minutesPart = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secondsPart = String(seconds % 60).padStart(2, "0");
  return `${minutesPart}:${secondsPart}`;
}

function setSaveStatus(message) {
  elements.saveStatus.textContent = message;
}

function saveState(statusMessage) {
  try {
    state.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    const label =
      statusMessage ||
      `Saved at ${new Date(state.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`;
    setSaveStatus(label);
  } catch (error) {
    setSaveStatus("Save failed. Check browser storage permissions.");
  }
}

function renderTeams() {
  elements.teamAName.value = state.teams.teamA.name;
  elements.teamBName.value = state.teams.teamB.name;
  elements.teamAScore.textContent = String(state.teams.teamA.score);
  elements.teamBScore.textContent = String(state.teams.teamB.score);
  elements.teamAMoney.textContent = formatMoney(state.teams.teamA.money);
  elements.teamBMoney.textContent = formatMoney(state.teams.teamB.money);
}

function renderTabs() {
  elements.gameTabs.forEach((tab) => {
    const isActive = tab.dataset.gameTab === state.activeGame;
    tab.classList.toggle("is-active", isActive);
  });
  elements.gamePanes.forEach((pane) => {
    const isActive = pane.dataset.gamePane === state.activeGame;
    pane.classList.toggle("is-active", isActive);
  });
}

function renderNotes() {
  elements.game1Notes.value = state.notes.game1;
  elements.game2Notes.value = state.notes.game2;
  elements.game3Notes.value = state.notes.game3;
  elements.hostNotes.value = state.notes.host;
}

function renderTimer() {
  elements.roundDuration.value = String(state.timer.duration);
  elements.timerDisplay.textContent = formatTimer(state.timer.remaining);
}

function renderAll() {
  renderTeams();
  renderTabs();
  renderNotes();
  renderTimer();
}

function updateTeamMetric(teamKey, metricKey, delta) {
  const team = state.teams[teamKey];
  if (!team) {
    return;
  }
  const nextValue = Math.max(0, team[metricKey] + delta);
  team[metricKey] = nextValue;
  renderTeams();
  saveState();
}

function setActiveGame(gameKey) {
  if (!["game1", "game2", "game3"].includes(gameKey)) {
    return;
  }
  state.activeGame = gameKey;
  renderTabs();
  saveState();
}

function applyElapsedTime() {
  if (!state.timer.isRunning || !state.timer.lastTickMs) {
    return;
  }
  const now = Date.now();
  const elapsedSeconds = Math.floor((now - state.timer.lastTickMs) / 1000);
  if (elapsedSeconds <= 0) {
    return;
  }
  state.timer.remaining = Math.max(0, state.timer.remaining - elapsedSeconds);
  state.timer.lastTickMs = state.timer.lastTickMs + elapsedSeconds * 1000;
  if (state.timer.remaining === 0) {
    state.timer.isRunning = false;
    state.timer.lastTickMs = null;
  }
}

function stopTimerLoop() {
  if (timerIntervalId) {
    clearInterval(timerIntervalId);
    timerIntervalId = null;
  }
}

function startTimerLoop() {
  stopTimerLoop();
  timerIntervalId = setInterval(() => {
    applyElapsedTime();
    renderTimer();
    if (!state.timer.isRunning) {
      stopTimerLoop();
      saveState("Timer ended.");
      return;
    }
    saveState();
  }, 250);
}

function startTimer() {
  if (state.timer.remaining <= 0) {
    state.timer.remaining = state.timer.duration;
  }
  state.timer.isRunning = true;
  state.timer.lastTickMs = Date.now();
  startTimerLoop();
  renderTimer();
  saveState("Timer started.");
}

function pauseTimer() {
  applyElapsedTime();
  state.timer.isRunning = false;
  state.timer.lastTickMs = null;
  stopTimerLoop();
  renderTimer();
  saveState("Timer paused.");
}

function resetTimer() {
  state.timer.isRunning = false;
  state.timer.lastTickMs = null;
  state.timer.remaining = state.timer.duration;
  stopTimerLoop();
  renderTimer();
  saveState("Timer reset.");
}

function resetSession() {
  const shouldReset = window.confirm("Reset all dashboard data for both teams and all notes?");
  if (!shouldReset) {
    return;
  }
  stopTimerLoop();
  state = cloneDefaultState();
  renderAll();
  saveState("Session reset.");
}

function handleDurationChange() {
  const nextDuration = clampNumber(
    Math.round(sanitizeNumber(elements.roundDuration.value, state.timer.duration)),
    10,
    600
  );
  state.timer.duration = nextDuration;
  state.timer.remaining = nextDuration;
  state.timer.isRunning = false;
  state.timer.lastTickMs = null;
  stopTimerLoop();
  renderTimer();
  saveState("Round duration updated.");
}

function bindEvents() {
  elements.teamAName.addEventListener("input", () => {
    state.teams.teamA.name = elements.teamAName.value.trim() || "Team 1";
    saveState();
  });

  elements.teamBName.addEventListener("input", () => {
    state.teams.teamB.name = elements.teamBName.value.trim() || "Team 2";
    saveState();
  });

  elements.metricButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const teamKey = button.dataset.team;
      const metricKey = button.dataset.metric;
      const delta = Number(button.dataset.delta);
      updateTeamMetric(teamKey, metricKey, delta);
    });
  });

  elements.gameTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      setActiveGame(tab.dataset.gameTab);
    });
  });

  elements.game1Notes.addEventListener("input", () => {
    state.notes.game1 = elements.game1Notes.value;
    saveState();
  });

  elements.game2Notes.addEventListener("input", () => {
    state.notes.game2 = elements.game2Notes.value;
    saveState();
  });

  elements.game3Notes.addEventListener("input", () => {
    state.notes.game3 = elements.game3Notes.value;
    saveState();
  });

  elements.hostNotes.addEventListener("input", () => {
    state.notes.host = elements.hostNotes.value;
    saveState();
  });

  elements.roundDuration.addEventListener("change", handleDurationChange);
  elements.startTimerBtn.addEventListener("click", startTimer);
  elements.pauseTimerBtn.addEventListener("click", pauseTimer);
  elements.resetTimerBtn.addEventListener("click", resetTimer);
  elements.saveNowBtn.addEventListener("click", () => saveState("Saved manually."));
  elements.resetAllBtn.addEventListener("click", resetSession);

  window.addEventListener("beforeunload", () => {
    saveState();
  });
}

function init() {
  state = sanitizeState(state);
  applyElapsedTime();
  if (state.timer.remaining === 0) {
    state.timer.isRunning = false;
    state.timer.lastTickMs = null;
  }
  renderAll();
  bindEvents();
  if (state.timer.isRunning) {
    startTimerLoop();
  }
  saveState("Autosave active.");
}

init();
