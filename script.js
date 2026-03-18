const challenges = [
  "Name 5 countries that start with the letter B in 20 seconds.",
  "Act out a famous movie scene without speaking.",
  "Solve this: 144 / 12 + 7 x 3.",
  "Give 3 true facts about space in under 15 seconds.",
  "Spell 'extraordinary' backwards.",
  "List 6 foods that are yellow.",
  "Answer: Which planet is known as the red planet?",
  "Create a 5-word slogan for a superhero toothpaste."
];

const challengeText = document.getElementById("challengeText");
const nextChallengeBtn = document.getElementById("nextChallenge");
const timerEl = document.getElementById("timer");
const resetBtn = document.getElementById("resetScores");

let timerId = null;
let secondsLeft = 30;
let lastChallenge = "";

function startTimer() {
  clearInterval(timerId);
  secondsLeft = 30;
  timerEl.textContent = `${secondsLeft}s`;

  timerId = setInterval(() => {
    secondsLeft -= 1;
    timerEl.textContent = `${secondsLeft}s`;
    if (secondsLeft <= 0) {
      clearInterval(timerId);
      challengeText.textContent = "Time up. Next team to the podium.";
    }
  }, 1000);
}

function pickChallenge() {
  let picked = challenges[Math.floor(Math.random() * challenges.length)];
  if (challenges.length > 1) {
    while (picked === lastChallenge) {
      picked = challenges[Math.floor(Math.random() * challenges.length)];
    }
  }
  lastChallenge = picked;
  challengeText.textContent = picked;
  startTimer();
}

function updateScore(targetKey, delta) {
  const scoreEl = document.getElementById(`score-${targetKey}`);
  const current = Number(scoreEl.textContent);
  scoreEl.textContent = Math.max(0, current + delta);
}

nextChallengeBtn.addEventListener("click", pickChallenge);

document.querySelectorAll("[data-score-target]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.getAttribute("data-score-target");
    const delta = Number(button.getAttribute("data-delta"));
    updateScore(target, delta);
  });
});

resetBtn.addEventListener("click", () => {
  document.querySelectorAll(".score").forEach((score) => {
    score.textContent = "0";
  });
  challengeText.textContent = 'Scores reset. Press "Next Challenge" for a new round.';
  clearInterval(timerId);
  timerEl.textContent = "30s";
});
