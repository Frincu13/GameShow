const STORAGE_KEY = "gameshow-host-dashboard-v3";
const LEGACY_STORAGE_KEYS = ["gameshow-host-dashboard-v2", "gameshow-host-dashboard-v1"];
const TEAM_START_MONEY = 1000;
const MAX_ACTIVE_PER_TEAM = 6;
const BET_ROUNDING_STEP = 10;
const SAMSAR_STANDARD_BET = 100;
const RESULT_UNDO_LIMIT = 30;
const SAVE_EXPORT_FORMAT_VERSION = 1;

const SECTION_IDS = [
  "home",
  "leaderboard",
  "trivia",
  "pretul-corect",
  "film-joc-franciza",
  "cel-mai-bun-samsar",
  "manual-match",
  "curse-de-cai",
  "players-teams",
  "awards-final-titles",
  "end-screen",
  "settings"
];

const GAME_CONFIG = [
  { id: "trivia", label: "Trivia de grup", section: "trivia", maxBetPercent: 10 },
  { id: "guess-right-order", label: "Guess the Right Order", section: "manual-match", maxBetPercent: 10 },
  { id: "pretul-corect", label: "Pretul corect", section: "pretul-corect", maxBetPercent: 15 },
  {
    id: "film-joc-franciza-fun-fact",
    label: "Film / Joc / Franciza / Fun Fact",
    section: "film-joc-franciza",
    maxBetPercent: 15
  },
  { id: "cel-mai-bun-samsar", label: "Cel mai bun samsar", section: "cel-mai-bun-samsar", maxBetPercent: 20 },
  { id: "beer-pong", label: "Beer Pong", section: "manual-match", maxBetPercent: 20 },
  { id: "shot-fake", label: "Shot Fake", section: "manual-match", maxBetPercent: 25 },
  { id: "curse-de-cai", label: "Curse de cai", section: "curse-de-cai", maxBetPercent: 30 }
];

const GAME_ORDER = GAME_CONFIG.map((game) => game.id);
const MANUAL_MATCH_GAME_IDS = ["guess-right-order", "beer-pong", "shot-fake"];
const DEFAULT_RESULT_SUMMARY = "PLACEHOLDER: Nu exista rezultat aplicat inca.";
const DEFAULT_TRIVIA_CATEGORIES = [
  {
    id: "trivia-cat-1",
    title: "PLACEHOLDER: General Knowledge",
    question: "PLACEHOLDER: Question text for category 1.",
    answer: "PLACEHOLDER: Answer text for category 1."
  },
  {
    id: "trivia-cat-2",
    title: "PLACEHOLDER: History & Culture",
    question: "PLACEHOLDER: Question text for category 2.",
    answer: "PLACEHOLDER: Answer text for category 2."
  },
  {
    id: "trivia-cat-3",
    title: "PLACEHOLDER: Movies & Series",
    question: "PLACEHOLDER: Question text for category 3.",
    answer: "PLACEHOLDER: Answer text for category 3."
  },
  {
    id: "trivia-cat-4",
    title: "PLACEHOLDER: Sports & Games",
    question: "PLACEHOLDER: Question text for category 4.",
    answer: "PLACEHOLDER: Answer text for category 4."
  }
];
const DEFAULT_PRETUL_ITEMS = [
  {
    id: "pretul-item-1",
    name: "PLACEHOLDER: Wireless gaming headset",
    referencePrice: 320
  },
  {
    id: "pretul-item-2",
    name: "PLACEHOLDER: Smart coffee machine",
    referencePrice: 540
  },
  {
    id: "pretul-item-3",
    name: "PLACEHOLDER: Mini projector",
    referencePrice: 880
  },
  {
    id: "pretul-item-4",
    name: "PLACEHOLDER: Fitness smartwatch",
    referencePrice: 410
  }
];
const FILM_FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 960 540'><defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0' stop-color='%23111a33'/><stop offset='1' stop-color='%2328386d'/></linearGradient></defs><rect width='960' height='540' fill='url(%23g)'/><text x='50%25' y='45%25' fill='%23f5f7ff' font-size='42' font-family='Arial' text-anchor='middle'>PLACEHOLDER IMAGE</text><text x='50%25' y='56%25' fill='%23d4dcff' font-size='24' font-family='Arial' text-anchor='middle'>Replace with your round visual</text></svg>";
const FILM_COMPONENT_KEYS = ["character", "franchise", "funFact"];
const FILM_COMPONENT_WEIGHTS = {
  character: 1,
  franchise: 1,
  funFact: 3
};
const DEFAULT_FILM_ITEMS = [
  {
    id: "film-item-1",
    title: "PLACEHOLDER: Round 1 - Movie Character",
    imageUrl: FILM_FALLBACK_IMAGE,
    imageAlt: "PLACEHOLDER round image 1",
    characterPrompt: "PLACEHOLDER: Character / Title reveal text for round 1.",
    franchisePrompt: "PLACEHOLDER: Franchise reveal text for round 1.",
    funFactPrompt: "PLACEHOLDER: Fun Fact reveal text for round 1."
  },
  {
    id: "film-item-2",
    title: "PLACEHOLDER: Round 2 - Game Character",
    imageUrl: FILM_FALLBACK_IMAGE,
    imageAlt: "PLACEHOLDER round image 2",
    characterPrompt: "PLACEHOLDER: Character / Title reveal text for round 2.",
    franchisePrompt: "PLACEHOLDER: Franchise reveal text for round 2.",
    funFactPrompt: "PLACEHOLDER: Fun Fact reveal text for round 2."
  },
  {
    id: "film-item-3",
    title: "PLACEHOLDER: Round 3 - Franchise Scene",
    imageUrl: FILM_FALLBACK_IMAGE,
    imageAlt: "PLACEHOLDER round image 3",
    characterPrompt: "PLACEHOLDER: Character / Title reveal text for round 3.",
    franchisePrompt: "PLACEHOLDER: Franchise reveal text for round 3.",
    funFactPrompt: "PLACEHOLDER: Fun Fact reveal text for round 3."
  }
];
const DEFAULT_SAMSAR_ROUNDS = [
  {
    id: "samsar-round-1",
    personaTitle: "PLACEHOLDER: Family Driver",
    personaRequirements:
      "PLACEHOLDER: Needs low fuel consumption, cheap maintenance, and enough space for 2 kids."
  },
  {
    id: "samsar-round-2",
    personaTitle: "PLACEHOLDER: Weekend Explorer",
    personaRequirements:
      "PLACEHOLDER: Wants comfort for long road trips, modern tech, and balanced budget."
  },
  {
    id: "samsar-round-3",
    personaTitle: "PLACEHOLDER: City Commuter",
    personaRequirements:
      "PLACEHOLDER: Prioritizes compact size, parking ease, and low monthly running costs."
  },
  {
    id: "samsar-round-4",
    personaTitle: "PLACEHOLDER: Performance Fan",
    personaRequirements:
      "PLACEHOLDER: Wants strong acceleration, sporty look, and reliable daily use."
  },
  {
    id: "samsar-round-5",
    personaTitle: "PLACEHOLDER: First-Time Buyer",
    personaRequirements:
      "PLACEHOLDER: Needs beginner-friendly option, safety features, and predictable ownership costs."
  },
  {
    id: "samsar-round-6",
    personaTitle: "PLACEHOLDER: Premium Executive",
    personaRequirements:
      "PLACEHOLDER: Expects premium comfort, prestige, and high-quality interior features."
  }
];
const DEFAULT_CURSE_HORSES = [
  {
    id: "horse-1",
    name: "PLACEHOLDER: Storm Arrow",
    symbol: ">>",
    story:
      "PLACEHOLDER: Storm Arrow starts slow and usually recovers in the second half of the race. " +
      "The horse is known for steady rhythm and late acceleration."
  },
  {
    id: "horse-2",
    name: "PLACEHOLDER: Crimson Dust",
    symbol: "**",
    story:
      "PLACEHOLDER: Crimson Dust is aggressive in the first turns and pushes hard early. " +
      "The horse can lose momentum near the finish if timing is not controlled."
  },
  {
    id: "horse-3",
    name: "PLACEHOLDER: Night Echo",
    symbol: "##",
    story:
      "PLACEHOLDER: Night Echo adapts quickly to pressure and does best in tactical races. " +
      "The horse is favored in rounds with many close lane collisions."
  },
  {
    id: "horse-4",
    name: "PLACEHOLDER: Silver Bolt",
    symbol: "!!",
    story:
      "PLACEHOLDER: Silver Bolt is a consistent all-rounder with balanced pace. " +
      "This horse is reliable for conservative bet strategies."
  },
  {
    id: "horse-5",
    name: "PLACEHOLDER: Iron Comet",
    symbol: "$$",
    story:
      "PLACEHOLDER: Iron Comet performs better as the lane opens up. " +
      "The horse is hard to stop once it reaches mid-track advantage."
  },
  {
    id: "horse-6",
    name: "PLACEHOLDER: Wild Orbit",
    symbol: "@@",
    story:
      "PLACEHOLDER: Wild Orbit is unpredictable and can swing between weak and dominant rounds. " +
      "Hosts usually keep this horse for high-variance moments."
  }
];
const DEFAULT_MANUAL_SIDEBET = {
  id: "shot-side-1",
  label: "PLACEHOLDER: Side bet",
  amount: 50,
  winner: "draw"
};
const JOKER_PLAYER_ID = "joker-player";
const PLAYER_STATS_SCHEMA_VERSION = 1;
const SECTION_NOTES_DEFAULTS = {
  triviaRules:
    "PLACEHOLDER:\n- One team plays each round (Team 1 or Team 2).\n- Only active team places the bet (max 10%, rounded to 10).\n- Correct answer: fixed bonus + bet win.\n- Wrong answer: lose bet.\n- Used category should be marked and disabled.",
  pretulRules:
    "PLACEHOLDER:\n- Both teams submit answer + bet (max 15%, rounded to 10).\n- Enter real price each round.\n- Winner is auto-detected by closest distance.\n- Equal distance = tie.\n- Used item remains marked as used.",
  filmJocRules:
    "PLACEHOLDER:\n- One team plays each round.\n- Components: Character/Title x1, Franchise x1, Fun Fact x3.\n- Component payout is partial (not all-or-nothing).\n- Bet is active only with minimum 2/3 correct.\n- Under 2/3 correct, the bet is lost.",
  samsarRules:
    "PLACEHOLDER:\n- Keep 6 rounds with persona/requirements text.\n- No link fields; score-only flow.\n- Select one active player per team.\n- Higher score wins, equal score is draw.\n- Standard Samsar payout applies with game cap rules.",
  manualMatchups:
    "PLACEHOLDER:\nGuess the Right Order - team vs team, standard payout, draw allowed.\nBeer Pong - team vs team, standard payout, draw allowed.\nShot Fake - bet-only mode, draw allowed, side bets + x * active opponents rule.",
  curseBets:
    "PLACEHOLDER:\n- Bet-only mode (no fixed bonus).\n- Multi-bet allowed on multiple horses.\n- Only winning-horse bet pays x4.\n- All losing-horse bets are lost.\n- Team cap remains 30%, rounded to 10."
};
const LEGACY_SECTION_NOTES = {
  triviaRules: "PLACEHOLDER: Define answer timeout, bonus points, tie-break rule, and challenge policy.",
  pretulRules: "PLACEHOLDER: Explain bidding order, max bids, and exact/closest-win behavior.",
  filmJocRules: "PLACEHOLDER: Define clue reveal flow and points for correct/incorrect answers.",
  samsarRules: "PLACEHOLDER: Negotiation limits, veto rules, and final deal validation process.",
  manualMatchups: "PLACEHOLDER:\nGuess the Right Order setup\nBeer Pong setup\nShot Fake setup",
  curseBets: "PLACEHOLDER: Bet options, multipliers, and payout timing notes."
};

const DEFAULT_STATE = {
  activeSection: "home",
  settings: {
    showTitle: "PLACEHOLDER: GameShow Season 1",
    hostName: "PLACEHOLDER: Host Name",
    currencySymbol: "$"
  },
  teams: {
    teamA: {
      name: "Team 1",
      score: 0,
      money: TEAM_START_MONEY,
      players: [
        { id: "teamA-p1", name: "PLACEHOLDER: Team A Player 1", status: "available" },
        { id: "teamA-p2", name: "PLACEHOLDER: Team A Player 2", status: "available" }
      ]
    },
    teamB: {
      name: "Team 2",
      score: 0,
      money: TEAM_START_MONEY,
      players: [
        { id: "teamB-p1", name: "PLACEHOLDER: Team B Player 1", status: "available" },
        { id: "teamB-p2", name: "PLACEHOLDER: Team B Player 2", status: "available" }
      ]
    }
  },
  timer: {
    duration: 60,
    remaining: 60,
    isRunning: false,
    lastTickMs: null
  },
  progress: {
    currentGame: "trivia",
    currentRound: 1,
    lastResultSummary: DEFAULT_RESULT_SUMMARY
  },
  roundSelection: {
    locked: false,
    jokerAssignment: "out",
    activeByTeam: {
      teamA: [],
      teamB: []
    },
    history: {}
  },
  trivia: {
    fixedBonus: 100,
    categories: DEFAULT_TRIVIA_CATEGORIES,
    rounds: {}
  },
  pretul: {
    items: DEFAULT_PRETUL_ITEMS,
    rounds: {}
  },
  filmGame: {
    items: DEFAULT_FILM_ITEMS,
    rounds: {}
  },
  samsarGame: {
    roundsData: DEFAULT_SAMSAR_ROUNDS,
    rounds: {}
  },
  manualMatch: {
    selectedGame: "guess-right-order",
    rounds: {}
  },
  playerStats: {
    schemaVersion: PLAYER_STATS_SCHEMA_VERSION,
    byPlayerId: {}
  },
  curseRace: {
    trackLength: 12,
    payoutMultiplier: 4,
    horses: DEFAULT_CURSE_HORSES,
    rounds: {}
  },
  sections: {
    homeRunOfShow:
      "PLACEHOLDER: Opening credits -> host intro -> explain format -> start first round.",
    homeEmergencyPlan:
      "PLACEHOLDER: If technical issue appears, run a backup mini-round for 3 minutes.",
    triviaQuestionBank:
      "PLACEHOLDER:\nQ1: ...\nQ2: ...\nQ3: ...\nUse this block as the primary trivia queue.",
    triviaRules:
      SECTION_NOTES_DEFAULTS.triviaRules,
    pretulItems:
      "PLACEHOLDER:\nItem: ... | Hidden price: ...\nItem: ... | Hidden price: ...",
    pretulRules:
      SECTION_NOTES_DEFAULTS.pretulRules,
    filmJocBoard:
      "PLACEHOLDER:\nMovie clue: ...\nGame clue: ...\nFranchise clue: ...\nFun fact clue: ...",
    filmJocRules:
      SECTION_NOTES_DEFAULTS.filmJocRules,
    samsarInventory:
      "PLACEHOLDER:\nDeal card A: ...\nDeal card B: ...\nSpecial event card: ...",
    samsarRules:
      SECTION_NOTES_DEFAULTS.samsarRules,
    manualMatchups:
      SECTION_NOTES_DEFAULTS.manualMatchups,
    manualLog:
      "PLACEHOLDER: Track manual rulings, disputes, and final adjustments.",
    curseTrack:
      "PLACEHOLDER:\nLane 1 horse: ...\nLane 2 horse: ...\nLane boosts/events: ...",
    curseBets:
      SECTION_NOTES_DEFAULTS.curseBets,
    awardsCategories:
      "PLACEHOLDER:\nBest Team Strategy\nBest Comeback\nMost Valuable Player",
    finalTitles:
      "PLACEHOLDER: Closing speech, sponsor mentions, and final winner title line."
  },
  updatedAt: null
};

const elements = {
  navButtons: Array.from(document.querySelectorAll("[data-section-target]")),
  quickOpenSectionButtons: Array.from(document.querySelectorAll("[data-open-section]")),
  quickOpenGameButtons: Array.from(document.querySelectorAll("[data-open-game]")),
  pageSections: Array.from(document.querySelectorAll("[data-section]")),
  boundFields: Array.from(document.querySelectorAll("[data-bind]")),
  teamNameTargets: Array.from(document.querySelectorAll("[data-team-name]")),
  teamScoreTargets: Array.from(document.querySelectorAll("[data-team-score]")),
  teamMoneyTargets: Array.from(document.querySelectorAll("[data-team-money]")),
  showTitleTargets: Array.from(document.querySelectorAll("[data-show-title]")),
  hostNameTargets: Array.from(document.querySelectorAll("[data-host-name]")),
  metricButtons: Array.from(document.querySelectorAll("[data-team][data-metric][data-delta]")),
  leaderByScore: document.getElementById("leaderByScore"),
  leaderByMoney: document.getElementById("leaderByMoney"),
  roundDuration: document.getElementById("roundDuration"),
  timerDisplay: document.getElementById("timerDisplay"),
  currentGameSelect: document.getElementById("currentGameSelect"),
  currentRoundInput: document.getElementById("currentRoundInput"),
  currentGameLabel: document.getElementById("currentGameLabel"),
  currentRoundLabel: document.getElementById("currentRoundLabel"),
  lastResultSummary: document.getElementById("lastResultSummary"),
  nextGameBtn: document.getElementById("nextGameBtn"),
  openLeaderboardBtn: document.getElementById("openLeaderboardBtn"),
  undoLastResultBtn: document.getElementById("undoLastResultBtn"),
  resetGameBtn: document.getElementById("resetGameBtn"),
  resetMoneyBtn: document.getElementById("resetMoneyBtn"),
  betTeamSelect: document.getElementById("betTeamSelect"),
  betGameSelect: document.getElementById("betGameSelect"),
  betAmountInput: document.getElementById("betAmountInput"),
  betRuleInfo: document.getElementById("betRuleInfo"),
  betWinBtn: document.getElementById("betWinBtn"),
  betLoseBtn: document.getElementById("betLoseBtn"),
  triviaPlayingTeamSelect: document.getElementById("triviaPlayingTeamSelect"),
  triviaCategorySelect: document.getElementById("triviaCategorySelect"),
  triviaBetAmountInput: document.getElementById("triviaBetAmountInput"),
  triviaFixedBonusInput: document.getElementById("triviaFixedBonusInput"),
  triviaBetRuleInfo: document.getElementById("triviaBetRuleInfo"),
  triviaCorrectBtn: document.getElementById("triviaCorrectBtn"),
  triviaWrongBtn: document.getElementById("triviaWrongBtn"),
  triviaResetUsedBtn: document.getElementById("triviaResetUsedBtn"),
  triviaActiveSelectionInfo: document.getElementById("triviaActiveSelectionInfo"),
  triviaCategoriesBoard: document.getElementById("triviaCategoriesBoard"),
  pretulItemSelect: document.getElementById("pretulItemSelect"),
  pretulAnswerTeamAInput: document.getElementById("pretulAnswerTeamAInput"),
  pretulAnswerTeamBInput: document.getElementById("pretulAnswerTeamBInput"),
  pretulBetTeamAInput: document.getElementById("pretulBetTeamAInput"),
  pretulBetTeamBInput: document.getElementById("pretulBetTeamBInput"),
  pretulRealPriceInput: document.getElementById("pretulRealPriceInput"),
  pretulRuleInfo: document.getElementById("pretulRuleInfo"),
  pretulEvaluateBtn: document.getElementById("pretulEvaluateBtn"),
  pretulResetUsedBtn: document.getElementById("pretulResetUsedBtn"),
  pretulRoundResult: document.getElementById("pretulRoundResult"),
  pretulActiveTeamAList: document.getElementById("pretulActiveTeamAList"),
  pretulActiveTeamBList: document.getElementById("pretulActiveTeamBList"),
  pretulItemsBoard: document.getElementById("pretulItemsBoard"),
  filmPlayingTeamSelect: document.getElementById("filmPlayingTeamSelect"),
  filmRoundSelect: document.getElementById("filmRoundSelect"),
  filmBetAmountInput: document.getElementById("filmBetAmountInput"),
  filmRuleInfo: document.getElementById("filmRuleInfo"),
  filmApplyRoundBtn: document.getElementById("filmApplyRoundBtn"),
  filmResetUsedBtn: document.getElementById("filmResetUsedBtn"),
  filmRoundResult: document.getElementById("filmRoundResult"),
  filmRoundImage: document.getElementById("filmRoundImage"),
  filmRoundImageCaption: document.getElementById("filmRoundImageCaption"),
  filmRevealBoard: document.getElementById("filmRevealBoard"),
  filmCharacterContent: document.getElementById("filmCharacterContent"),
  filmFranchiseContent: document.getElementById("filmFranchiseContent"),
  filmFunFactContent: document.getElementById("filmFunFactContent"),
  filmStatusCharacter: document.getElementById("filmStatusCharacter"),
  filmStatusFranchise: document.getElementById("filmStatusFranchise"),
  filmStatusFunFact: document.getElementById("filmStatusFunFact"),
  filmScoreCharacter: document.getElementById("filmScoreCharacter"),
  filmScoreFranchise: document.getElementById("filmScoreFranchise"),
  filmScoreFunFact: document.getElementById("filmScoreFunFact"),
  filmScoreTotal: document.getElementById("filmScoreTotal"),
  filmCorrectCount: document.getElementById("filmCorrectCount"),
  filmBetEligibility: document.getElementById("filmBetEligibility"),
  filmActiveSelectionInfo: document.getElementById("filmActiveSelectionInfo"),
  filmActivePlayingTeamList: document.getElementById("filmActivePlayingTeamList"),
  filmClearActiveBtn: document.getElementById("filmClearActiveBtn"),
  filmRoundsBoard: document.getElementById("filmRoundsBoard"),
  samsarRoundBadge: document.getElementById("samsarRoundBadge"),
  samsarPersonaTitle: document.getElementById("samsarPersonaTitle"),
  samsarPersonaRequirements: document.getElementById("samsarPersonaRequirements"),
  samsarPlayerTeamASelect: document.getElementById("samsarPlayerTeamASelect"),
  samsarPlayerTeamBSelect: document.getElementById("samsarPlayerTeamBSelect"),
  samsarScoreTeamAInput: document.getElementById("samsarScoreTeamAInput"),
  samsarScoreTeamBInput: document.getElementById("samsarScoreTeamBInput"),
  samsarRuleInfo: document.getElementById("samsarRuleInfo"),
  samsarApplyResultBtn: document.getElementById("samsarApplyResultBtn"),
  samsarRoundResult: document.getElementById("samsarRoundResult"),
  samsarRoundButtons: Array.from(document.querySelectorAll("[data-samsar-round]")),
  manualGameSelect: document.getElementById("manualGameSelect"),
  manualRoundInput: document.getElementById("manualRoundInput"),
  manualBetRuleInfo: document.getElementById("manualBetRuleInfo"),
  manualActiveTeamAList: document.getElementById("manualActiveTeamAList"),
  manualActiveTeamBList: document.getElementById("manualActiveTeamBList"),
  manualScoreTeamAInput: document.getElementById("manualScoreTeamAInput"),
  manualScoreTeamBInput: document.getElementById("manualScoreTeamBInput"),
  manualBetTeamAInput: document.getElementById("manualBetTeamAInput"),
  manualBetTeamBInput: document.getElementById("manualBetTeamBInput"),
  manualApplyResultBtn: document.getElementById("manualApplyResultBtn"),
  manualRoundResult: document.getElementById("manualRoundResult"),
  shotFakePanel: document.getElementById("shotFakePanel"),
  shotFakeMultiplierInput: document.getElementById("shotFakeMultiplierInput"),
  shotFakeManualAdjustTeamAInput: document.getElementById("shotFakeManualAdjustTeamAInput"),
  shotFakeManualAdjustTeamBInput: document.getElementById("shotFakeManualAdjustTeamBInput"),
  shotFakeAddSideBetBtn: document.getElementById("shotFakeAddSideBetBtn"),
  shotFakeSideBetsList: document.getElementById("shotFakeSideBetsList"),
  shotFakeRulePreview: document.getElementById("shotFakeRulePreview"),
  curseRoundInput: document.getElementById("curseRoundInput"),
  curseRuleInfo: document.getElementById("curseRuleInfo"),
  curseWinnerInfo: document.getElementById("curseWinnerInfo"),
  curseMoveHorseSelect: document.getElementById("curseMoveHorseSelect"),
  curseMoveStepsInput: document.getElementById("curseMoveStepsInput"),
  curseMoveBtn: document.getElementById("curseMoveBtn"),
  curseApplyPayoutBtn: document.getElementById("curseApplyPayoutBtn"),
  curseResetRaceBtn: document.getElementById("curseResetRaceBtn"),
  curseTrackBoard: document.getElementById("curseTrackBoard"),
  curseBetBoard: document.getElementById("curseBetBoard"),
  curseTeamABetTotal: document.getElementById("curseTeamABetTotal"),
  curseTeamBBetTotal: document.getElementById("curseTeamBBetTotal"),
  curseBettorTeamASelect: document.getElementById("curseBettorTeamASelect"),
  curseBettorTeamBSelect: document.getElementById("curseBettorTeamBSelect"),
  curseActiveTeamAList: document.getElementById("curseActiveTeamAList"),
  curseActiveTeamBList: document.getElementById("curseActiveTeamBList"),
  curseRoundResult: document.getElementById("curseRoundResult"),
  playersCurrentGameLabel: document.getElementById("playersCurrentGameLabel"),
  playersCurrentRoundLabel: document.getElementById("playersCurrentRoundLabel"),
  jokerAssignmentSelect: document.getElementById("jokerAssignmentSelect"),
  lockRoundSelectionBtn: document.getElementById("lockRoundSelectionBtn"),
  clearActiveSelectionBtn: document.getElementById("clearActiveSelectionBtn"),
  selectionLockStatus: document.getElementById("selectionLockStatus"),
  activeCountTeamA: document.getElementById("activeCountTeamA"),
  activeCountTeamB: document.getElementById("activeCountTeamB"),
  addPlayerTeamAInput: document.getElementById("addPlayerTeamAInput"),
  addPlayerTeamABtn: document.getElementById("addPlayerTeamABtn"),
  addPlayerTeamBInput: document.getElementById("addPlayerTeamBInput"),
  addPlayerTeamBBtn: document.getElementById("addPlayerTeamBBtn"),
  teamAPlayersList: document.getElementById("teamAPlayersList"),
  teamBPlayersList: document.getElementById("teamBPlayersList"),
  jokerRoundsActive: document.getElementById("jokerRoundsActive"),
  jokerRoundsTeamA: document.getElementById("jokerRoundsTeamA"),
  jokerRoundsTeamB: document.getElementById("jokerRoundsTeamB"),
  jokerRoundsOut: document.getElementById("jokerRoundsOut"),
  jokerAwardSummary: document.getElementById("jokerAwardSummary"),
  jokerFixedAwardLine: document.getElementById("jokerFixedAwardLine"),
  awardsGeneralTitlesBoard: document.getElementById("awardsGeneralTitlesBoard"),
  awardsGameTitlesBoard: document.getElementById("awardsGameTitlesBoard"),
  refreshAwardsBtn: document.getElementById("refreshAwardsBtn"),
  endWinningTeamName: document.getElementById("endWinningTeamName"),
  endWinningTeamReason: document.getElementById("endWinningTeamReason"),
  endTeamACard: document.getElementById("endTeamACard"),
  endTeamBCard: document.getElementById("endTeamBCard"),
  endTeamAMoney: document.getElementById("endTeamAMoney"),
  endTeamBMoney: document.getElementById("endTeamBMoney"),
  endTeamAScore: document.getElementById("endTeamAScore"),
  endTeamBScore: document.getElementById("endTeamBScore"),
  endAwardsGeneralBoard: document.getElementById("endAwardsGeneralBoard"),
  endAwardsGameBoard: document.getElementById("endAwardsGameBoard"),
  endJokerTitleLine: document.getElementById("endJokerTitleLine"),
  endFinalTitlesScript: document.getElementById("endFinalTitlesScript"),
  exportSaveBtn: document.getElementById("exportSaveBtn"),
  importSaveBtn: document.getElementById("importSaveBtn"),
  importSaveFileInput: document.getElementById("importSaveFileInput"),
  saveTransferArea: document.getElementById("saveTransferArea"),
  saveTransferStatus: document.getElementById("saveTransferStatus"),
  fullscreenToggleBtn: document.getElementById("fullscreenToggleBtn"),
  startTimerBtn: document.getElementById("startTimerBtn"),
  pauseTimerBtn: document.getElementById("pauseTimerBtn"),
  resetTimerBtn: document.getElementById("resetTimerBtn"),
  saveNowBtn: document.getElementById("saveNowBtn"),
  resetAllBtn: document.getElementById("resetAllBtn"),
  saveStatus: document.getElementById("saveStatus"),
  settingsBetCapsLine: document.getElementById("settingsBetCapsLine"),
  settingsBonusesLine: document.getElementById("settingsBonusesLine"),
  settingsTriviaRuleLine: document.getElementById("settingsTriviaRuleLine"),
  settingsPretulRuleLine: document.getElementById("settingsPretulRuleLine"),
  settingsFilmRuleLine: document.getElementById("settingsFilmRuleLine"),
  settingsSamsarRuleLine: document.getElementById("settingsSamsarRuleLine"),
  settingsShotFakeRuleLine: document.getElementById("settingsShotFakeRuleLine"),
  settingsCurseRuleLine: document.getElementById("settingsCurseRuleLine"),
  settingsSelectionRuleLine: document.getElementById("settingsSelectionRuleLine"),
  settingsMultiBetRuleLine: document.getElementById("settingsMultiBetRuleLine")
};

let state = loadState();
let timerIntervalId = null;
let lastSavedTimerSecond = null;
let resultUndoStack = [];

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

function sanitizeString(value, fallback) {
  return typeof value === "string" ? value : fallback;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getGameConfig(gameId) {
  return GAME_CONFIG.find((game) => game.id === gameId) || GAME_CONFIG[0];
}

function isManualMatchGame(gameId) {
  return MANUAL_MATCH_GAME_IDS.includes(gameId);
}

function getGameLabel(gameId) {
  return getGameConfig(gameId).label;
}

function getGameSection(gameId) {
  return getGameConfig(gameId).section;
}

function getBetPercent(gameId) {
  return getGameConfig(gameId).maxBetPercent;
}

function makePlayerId(teamKey) {
  return `${teamKey}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function sanitizePlayerList(rawPlayers, teamKey) {
  const fallbackPlayers = cloneDefaultState().teams[teamKey].players;
  if (!Array.isArray(rawPlayers) || rawPlayers.length === 0) {
    return fallbackPlayers;
  }

  const seenIds = new Set();
  const sanitized = [];

  for (const player of rawPlayers) {
    const rawName = sanitizeString(player?.name, "").trim();
    if (!rawName) {
      continue;
    }
    let id = sanitizeString(player?.id, "").trim();
    if (!id || seenIds.has(id)) {
      id = makePlayerId(teamKey);
    }
    seenIds.add(id);
    const status = ["available", "bench", "unavailable"].includes(player?.status) ? player.status : "available";
    sanitized.push({ id, name: rawName, status });
  }

  return sanitized.length > 0 ? sanitized : fallbackPlayers;
}

function createEmptyPlayerStatsEntry() {
  return {
    displayName: "",
    lastTeamKey: "",
    isJoker: false,
    roundsPlayed: 0,
    roundsWon: 0,
    roundsLost: 0,
    gamesPlayed: 0,
    totalMoneyWon: 0,
    totalMoneyLost: 0,
    netMoney: 0,
    totalBetAmount: 0,
    betsWon: 0,
    betsLost: 0,
    biggestWin: 0,
    biggestLoss: 0,
    winsPerGameType: {},
    participationsPerGameType: {}
  };
}

function sanitizePerGameCounterMap(rawMap) {
  if (!rawMap || typeof rawMap !== "object") {
    return {};
  }
  const safeMap = {};
  for (const [gameId, value] of Object.entries(rawMap)) {
    if (typeof gameId !== "string" || !GAME_ORDER.includes(gameId)) {
      continue;
    }
    const normalized = Math.max(0, Math.round(sanitizeNumber(value, 0)));
    if (normalized > 0) {
      safeMap[gameId] = normalized;
    }
  }
  return safeMap;
}

function sanitizePlayerStatsEntry(rawEntry) {
  const safe = createEmptyPlayerStatsEntry();
  if (!rawEntry || typeof rawEntry !== "object") {
    return safe;
  }

  safe.displayName = sanitizeString(rawEntry.displayName, "").trim();
  safe.lastTeamKey = ["teamA", "teamB", ""].includes(rawEntry.lastTeamKey) ? rawEntry.lastTeamKey : "";
  safe.isJoker = Boolean(rawEntry.isJoker);
  safe.roundsPlayed = Math.max(0, Math.round(sanitizeNumber(rawEntry.roundsPlayed, 0)));
  safe.roundsWon = Math.max(0, Math.round(sanitizeNumber(rawEntry.roundsWon, 0)));
  safe.roundsLost = Math.max(0, Math.round(sanitizeNumber(rawEntry.roundsLost, 0)));
  safe.gamesPlayed = Math.max(0, Math.round(sanitizeNumber(rawEntry.gamesPlayed, 0)));
  safe.totalMoneyWon = Math.max(0, Math.round(sanitizeNumber(rawEntry.totalMoneyWon, 0)));
  safe.totalMoneyLost = Math.max(0, Math.round(sanitizeNumber(rawEntry.totalMoneyLost, 0)));
  safe.netMoney = Math.round(sanitizeNumber(rawEntry.netMoney, safe.totalMoneyWon - safe.totalMoneyLost));
  safe.totalBetAmount = Math.max(0, Math.round(sanitizeNumber(rawEntry.totalBetAmount, 0)));
  safe.betsWon = Math.max(0, Math.round(sanitizeNumber(rawEntry.betsWon, 0)));
  safe.betsLost = Math.max(0, Math.round(sanitizeNumber(rawEntry.betsLost, 0)));
  safe.biggestWin = Math.max(0, Math.round(sanitizeNumber(rawEntry.biggestWin, 0)));
  safe.biggestLoss = Math.max(0, Math.round(sanitizeNumber(rawEntry.biggestLoss, 0)));
  safe.winsPerGameType = sanitizePerGameCounterMap(rawEntry.winsPerGameType);
  safe.participationsPerGameType = sanitizePerGameCounterMap(rawEntry.participationsPerGameType);
  return safe;
}

function sanitizePlayerStatsState(rawStatsState) {
  const safeState = {
    schemaVersion: PLAYER_STATS_SCHEMA_VERSION,
    byPlayerId: {}
  };

  if (!rawStatsState || typeof rawStatsState !== "object") {
    return safeState;
  }

  safeState.schemaVersion = Math.max(PLAYER_STATS_SCHEMA_VERSION, Math.round(sanitizeNumber(rawStatsState.schemaVersion, 1)));
  if (!rawStatsState.byPlayerId || typeof rawStatsState.byPlayerId !== "object") {
    return safeState;
  }

  for (const [playerId, rawEntry] of Object.entries(rawStatsState.byPlayerId)) {
    if (typeof playerId !== "string" || playerId.trim() === "") {
      continue;
    }
    safeState.byPlayerId[playerId] = sanitizePlayerStatsEntry(rawEntry);
  }

  return safeState;
}

function rosterTextToPlayers(rosterText, teamKey) {
  if (typeof rosterText !== "string") {
    return [];
  }
  const lines = rosterText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return lines.map((name) => ({
    id: makePlayerId(teamKey),
    name,
    status: "available"
  }));
}

function sanitizeTriviaCategories(rawCategories) {
  const fallback = cloneDefaultState().trivia.categories;
  if (!Array.isArray(rawCategories) || rawCategories.length === 0) {
    return fallback;
  }

  const seenIds = new Set();
  const sanitized = [];

  for (const rawCategory of rawCategories) {
    const title = sanitizeString(rawCategory?.title, "").trim();
    const question = sanitizeString(rawCategory?.question, "").trim();
    const answer = sanitizeString(rawCategory?.answer, "").trim();

    if (!title && !question && !answer) {
      continue;
    }

    let id = sanitizeString(rawCategory?.id, "").trim();
    if (!id || seenIds.has(id)) {
      id = `trivia-cat-${sanitized.length + 1}`;
    }
    seenIds.add(id);

    sanitized.push({
      id,
      title: title || `PLACEHOLDER: Category ${sanitized.length + 1}`,
      question: question || "PLACEHOLDER: Question text.",
      answer: answer || "PLACEHOLDER: Answer text."
    });
  }

  return sanitized.length > 0 ? sanitized : fallback;
}

function sanitizeTriviaRoundState(rawRoundState) {
  const safeState = {
    teamKey: "teamA",
    usedCategoryIds: [],
    selectedCategoryId: ""
  };

  if (!rawRoundState || typeof rawRoundState !== "object") {
    return safeState;
  }

  if (["teamA", "teamB"].includes(rawRoundState.teamKey)) {
    safeState.teamKey = rawRoundState.teamKey;
  }

  if (Array.isArray(rawRoundState.usedCategoryIds)) {
    safeState.usedCategoryIds = Array.from(
      new Set(rawRoundState.usedCategoryIds.filter((id) => typeof id === "string"))
    );
  }

  safeState.selectedCategoryId = sanitizeString(rawRoundState.selectedCategoryId, "");
  return safeState;
}

function getTriviaRoundKey(roundNumber = state.progress.currentRound) {
  return `trivia::R${roundNumber}`;
}

function getOrCreateTriviaRoundState(roundNumber = state.progress.currentRound) {
  const roundKey = getTriviaRoundKey(roundNumber);
  if (!state.trivia.rounds[roundKey]) {
    state.trivia.rounds[roundKey] = sanitizeTriviaRoundState({
      teamKey: "teamA",
      usedCategoryIds: [],
      selectedCategoryId: state.trivia.categories[0]?.id || ""
    });
  }
  const roundState = sanitizeTriviaRoundState(state.trivia.rounds[roundKey]);
  state.trivia.rounds[roundKey] = roundState;
  return roundState;
}

function getCurrentTriviaTeam() {
  return getOrCreateTriviaRoundState().teamKey;
}

function sanitizePretulItems(rawItems) {
  const fallback = cloneDefaultState().pretul.items;
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return fallback;
  }

  const seenIds = new Set();
  const sanitized = [];

  for (const rawItem of rawItems) {
    const name = sanitizeString(rawItem?.name, "").trim();
    if (!name) {
      continue;
    }

    let id = sanitizeString(rawItem?.id, "").trim();
    if (!id || seenIds.has(id)) {
      id = `pretul-item-${sanitized.length + 1}`;
    }
    seenIds.add(id);

    const referencePrice = Math.max(0, Math.round(sanitizeNumber(rawItem?.referencePrice, 0)));
    sanitized.push({
      id,
      name,
      referencePrice
    });
  }

  return sanitized.length > 0 ? sanitized : fallback;
}

function sanitizePretulRoundState(rawRoundState) {
  const safeState = {
    selectedItemId: "",
    usedItemIds: [],
    answerTeamA: 0,
    answerTeamB: 0,
    realPrice: 0,
    betTeamA: 100,
    betTeamB: 100,
    lastResult: ""
  };

  if (!rawRoundState || typeof rawRoundState !== "object") {
    return safeState;
  }

  safeState.selectedItemId = sanitizeString(rawRoundState.selectedItemId, "");
  safeState.usedItemIds = Array.isArray(rawRoundState.usedItemIds)
    ? Array.from(new Set(rawRoundState.usedItemIds.filter((id) => typeof id === "string")))
    : [];
  safeState.answerTeamA = Math.max(0, Math.round(sanitizeNumber(rawRoundState.answerTeamA, 0)));
  safeState.answerTeamB = Math.max(0, Math.round(sanitizeNumber(rawRoundState.answerTeamB, 0)));
  safeState.realPrice = Math.max(0, Math.round(sanitizeNumber(rawRoundState.realPrice, 0)));
  safeState.betTeamA = normalizeBetAmount(rawRoundState.betTeamA);
  safeState.betTeamB = normalizeBetAmount(rawRoundState.betTeamB);
  safeState.lastResult = sanitizeString(rawRoundState.lastResult, "");
  return safeState;
}

function getPretulRoundKey(roundNumber = state.progress.currentRound) {
  return `pretul::R${roundNumber}`;
}

function getOrCreatePretulRoundState(roundNumber = state.progress.currentRound) {
  const roundKey = getPretulRoundKey(roundNumber);
  if (!state.pretul.rounds[roundKey]) {
    state.pretul.rounds[roundKey] = sanitizePretulRoundState({
      selectedItemId: state.pretul.items[0]?.id || "",
      usedItemIds: [],
      answerTeamA: 0,
      answerTeamB: 0,
      realPrice: state.pretul.items[0]?.referencePrice || 0,
      betTeamA: 100,
      betTeamB: 100,
      lastResult: ""
    });
  }
  const roundState = sanitizePretulRoundState(state.pretul.rounds[roundKey]);
  state.pretul.rounds[roundKey] = roundState;
  return roundState;
}

function sanitizeFilmItems(rawItems) {
  const fallback = cloneDefaultState().filmGame.items;
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return fallback;
  }

  const seenIds = new Set();
  const sanitized = [];

  for (const rawItem of rawItems) {
    const title = sanitizeString(rawItem?.title, "").trim();
    if (!title) {
      continue;
    }

    let id = sanitizeString(rawItem?.id, "").trim();
    if (!id || seenIds.has(id)) {
      id = `film-item-${sanitized.length + 1}`;
    }
    seenIds.add(id);

    sanitized.push({
      id,
      title,
      imageUrl: sanitizeString(rawItem?.imageUrl, FILM_FALLBACK_IMAGE).trim() || FILM_FALLBACK_IMAGE,
      imageAlt: sanitizeString(rawItem?.imageAlt, "PLACEHOLDER round image").trim() || "PLACEHOLDER round image",
      characterPrompt:
        sanitizeString(rawItem?.characterPrompt, "PLACEHOLDER: Character / Title reveal text.").trim() ||
        "PLACEHOLDER: Character / Title reveal text.",
      franchisePrompt:
        sanitizeString(rawItem?.franchisePrompt, "PLACEHOLDER: Franchise reveal text.").trim() ||
        "PLACEHOLDER: Franchise reveal text.",
      funFactPrompt:
        sanitizeString(rawItem?.funFactPrompt, "PLACEHOLDER: Fun Fact reveal text.").trim() ||
        "PLACEHOLDER: Fun Fact reveal text."
    });
  }

  return sanitized.length > 0 ? sanitized : fallback;
}

function sanitizeFilmRoundState(rawRoundState) {
  const safeState = {
    teamKey: "teamA",
    selectedItemId: "",
    usedItemIds: [],
    betAmount: 100,
    revealed: {
      character: false,
      franchise: false,
      funFact: false
    },
    outcomes: {
      character: null,
      franchise: null,
      funFact: null
    },
    lastResult: ""
  };

  if (!rawRoundState || typeof rawRoundState !== "object") {
    return safeState;
  }

  if (["teamA", "teamB"].includes(rawRoundState.teamKey)) {
    safeState.teamKey = rawRoundState.teamKey;
  }

  safeState.selectedItemId = sanitizeString(rawRoundState.selectedItemId, "");
  safeState.usedItemIds = Array.isArray(rawRoundState.usedItemIds)
    ? Array.from(new Set(rawRoundState.usedItemIds.filter((id) => typeof id === "string")))
    : [];
  safeState.betAmount = normalizeBetAmount(rawRoundState.betAmount);
  safeState.lastResult = sanitizeString(rawRoundState.lastResult, "");

  for (const key of FILM_COMPONENT_KEYS) {
    safeState.revealed[key] = Boolean(rawRoundState.revealed?.[key]);
    const outcome = rawRoundState.outcomes?.[key];
    safeState.outcomes[key] = ["correct", "wrong"].includes(outcome) ? outcome : null;
  }

  return safeState;
}

function getFilmRoundKey(roundNumber = state.progress.currentRound) {
  return `film::R${roundNumber}`;
}

function getOrCreateFilmRoundState(roundNumber = state.progress.currentRound) {
  const roundKey = getFilmRoundKey(roundNumber);
  if (!state.filmGame.rounds[roundKey]) {
    state.filmGame.rounds[roundKey] = sanitizeFilmRoundState({
      teamKey: "teamA",
      selectedItemId: state.filmGame.items[0]?.id || "",
      usedItemIds: [],
      betAmount: 100,
      revealed: {
        character: false,
        franchise: false,
        funFact: false
      },
      outcomes: {
        character: null,
        franchise: null,
        funFact: null
      },
      lastResult: ""
    });
  }
  const roundState = sanitizeFilmRoundState(state.filmGame.rounds[roundKey]);
  state.filmGame.rounds[roundKey] = roundState;
  return roundState;
}

function getCurrentFilmTeam() {
  return getOrCreateFilmRoundState().teamKey;
}

function sanitizeSamsarRoundsData(rawRoundsData) {
  const fallback = cloneDefaultState().samsarGame.roundsData;
  if (!Array.isArray(rawRoundsData) || rawRoundsData.length === 0) {
    return fallback;
  }

  const sanitized = [];
  const maxRounds = 6;

  for (let i = 0; i < maxRounds; i += 1) {
    const rawRound = rawRoundsData[i];
    if (!rawRound || typeof rawRound !== "object") {
      sanitized.push({ ...fallback[i] });
      continue;
    }

    const personaTitle = sanitizeString(rawRound.personaTitle, "").trim();
    const personaRequirements = sanitizeString(rawRound.personaRequirements, "").trim();
    sanitized.push({
      id: sanitizeString(rawRound.id, `samsar-round-${i + 1}`).trim() || `samsar-round-${i + 1}`,
      personaTitle: personaTitle || fallback[i].personaTitle,
      personaRequirements: personaRequirements || fallback[i].personaRequirements
    });
  }

  return sanitized;
}

function sanitizeSamsarRoundState(rawRoundState) {
  const safeState = {
    activePlayerTeamAId: "",
    activePlayerTeamBId: "",
    scoreTeamA: 0,
    scoreTeamB: 0,
    lastResult: ""
  };

  if (!rawRoundState || typeof rawRoundState !== "object") {
    return safeState;
  }

  safeState.activePlayerTeamAId = sanitizeString(rawRoundState.activePlayerTeamAId, "");
  safeState.activePlayerTeamBId = sanitizeString(rawRoundState.activePlayerTeamBId, "");
  safeState.scoreTeamA = Math.max(0, Math.round(sanitizeNumber(rawRoundState.scoreTeamA, 0)));
  safeState.scoreTeamB = Math.max(0, Math.round(sanitizeNumber(rawRoundState.scoreTeamB, 0)));
  safeState.lastResult = sanitizeString(rawRoundState.lastResult, "");
  return safeState;
}

function getSamsarRoundNumber(roundNumber = state.progress.currentRound) {
  const maxRounds = Math.max(1, state.samsarGame?.roundsData?.length || 6);
  return clampNumber(Math.round(sanitizeNumber(roundNumber, 1)), 1, maxRounds);
}

function getSamsarRoundKey(roundNumber = state.progress.currentRound) {
  return `samsar::R${getSamsarRoundNumber(roundNumber)}`;
}

function getOrCreateSamsarRoundState(roundNumber = state.progress.currentRound) {
  const safeRoundNumber = getSamsarRoundNumber(roundNumber);
  const roundKey = getSamsarRoundKey(safeRoundNumber);
  if (!state.samsarGame.rounds[roundKey]) {
    state.samsarGame.rounds[roundKey] = sanitizeSamsarRoundState({
      activePlayerTeamAId: "",
      activePlayerTeamBId: "",
      scoreTeamA: 0,
      scoreTeamB: 0,
      lastResult: ""
    });
  }
  const roundState = sanitizeSamsarRoundState(state.samsarGame.rounds[roundKey]);
  state.samsarGame.rounds[roundKey] = roundState;
  return roundState;
}

function makeSideBetId() {
  return `shot-side-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function sanitizeShotFakeSideBet(rawSideBet, index = 0) {
  const safeLabel = sanitizeString(rawSideBet?.label, "").trim();
  const safeAmount = Math.max(0, Math.round(sanitizeNumber(rawSideBet?.amount, DEFAULT_MANUAL_SIDEBET.amount)));
  const safeWinner = ["teamA", "teamB", "draw"].includes(rawSideBet?.winner) ? rawSideBet.winner : "draw";
  const safeId = sanitizeString(rawSideBet?.id, "").trim() || `shot-side-${index + 1}`;
  return {
    id: safeId,
    label: safeLabel || `PLACEHOLDER: Side bet ${index + 1}`,
    amount: safeAmount,
    winner: safeWinner
  };
}

function sanitizeManualMatchRoundState(rawRoundState) {
  const safeState = {
    scoreTeamA: 0,
    scoreTeamB: 0,
    betTeamA: 100,
    betTeamB: 100,
    lastResult: "",
    shotFake: {
      multiplier: 10,
      manualAdjustTeamA: 0,
      manualAdjustTeamB: 0,
      sideBets: [{ ...DEFAULT_MANUAL_SIDEBET }]
    }
  };

  if (!rawRoundState || typeof rawRoundState !== "object") {
    return safeState;
  }

  safeState.scoreTeamA = Math.max(0, Math.round(sanitizeNumber(rawRoundState.scoreTeamA, 0)));
  safeState.scoreTeamB = Math.max(0, Math.round(sanitizeNumber(rawRoundState.scoreTeamB, 0)));
  safeState.betTeamA = normalizeBetAmount(rawRoundState.betTeamA);
  safeState.betTeamB = normalizeBetAmount(rawRoundState.betTeamB);
  safeState.lastResult = sanitizeString(rawRoundState.lastResult, "");
  safeState.shotFake.multiplier = Math.max(0, Math.round(sanitizeNumber(rawRoundState.shotFake?.multiplier, 10)));
  safeState.shotFake.manualAdjustTeamA = Math.round(sanitizeNumber(rawRoundState.shotFake?.manualAdjustTeamA, 0));
  safeState.shotFake.manualAdjustTeamB = Math.round(sanitizeNumber(rawRoundState.shotFake?.manualAdjustTeamB, 0));

  if (Array.isArray(rawRoundState.shotFake?.sideBets) && rawRoundState.shotFake.sideBets.length > 0) {
    safeState.shotFake.sideBets = rawRoundState.shotFake.sideBets
      .map((sideBet, index) => sanitizeShotFakeSideBet(sideBet, index))
      .slice(0, 20);
  }

  if (safeState.shotFake.sideBets.length === 0) {
    safeState.shotFake.sideBets = [{ ...DEFAULT_MANUAL_SIDEBET, id: makeSideBetId() }];
  }

  return safeState;
}

function getManualMatchRoundKey(gameId = state.progress.currentGame, roundNumber = state.progress.currentRound) {
  const safeGameId = isManualMatchGame(gameId) ? gameId : "guess-right-order";
  return `manual::${safeGameId}::R${Math.max(1, Math.round(sanitizeNumber(roundNumber, 1)))}`;
}

function getOrCreateManualMatchRoundState(gameId = state.progress.currentGame, roundNumber = state.progress.currentRound) {
  const safeGameId = isManualMatchGame(gameId) ? gameId : "guess-right-order";
  const roundKey = getManualMatchRoundKey(safeGameId, roundNumber);
  if (!state.manualMatch.rounds[roundKey]) {
    state.manualMatch.rounds[roundKey] = sanitizeManualMatchRoundState({
      scoreTeamA: 0,
      scoreTeamB: 0,
      betTeamA: 100,
      betTeamB: 100,
      lastResult: "",
      shotFake: {
        multiplier: 10,
        manualAdjustTeamA: 0,
        manualAdjustTeamB: 0,
        sideBets: [{ ...DEFAULT_MANUAL_SIDEBET, id: makeSideBetId() }]
      }
    });
  }
  const roundState = sanitizeManualMatchRoundState(state.manualMatch.rounds[roundKey]);
  state.manualMatch.rounds[roundKey] = roundState;
  return roundState;
}

function getCurrentManualMatchGame() {
  if (isManualMatchGame(state.progress.currentGame)) {
    return state.progress.currentGame;
  }
  if (isManualMatchGame(state.manualMatch.selectedGame)) {
    return state.manualMatch.selectedGame;
  }
  return "guess-right-order";
}

function sanitizeCurseHorse(rawHorse, index = 0) {
  const fallbackHorses = cloneDefaultState().curseRace.horses;
  const fallbackHorse = fallbackHorses[index % fallbackHorses.length];
  const safeId = sanitizeString(rawHorse?.id, "").trim() || `horse-${index + 1}`;
  const safeName = sanitizeString(rawHorse?.name, "").trim() || fallbackHorse.name;
  const safeSymbol = sanitizeString(rawHorse?.symbol, "").trim().slice(0, 6) || fallbackHorse.symbol;
  const safeStory = sanitizeString(rawHorse?.story, "").trim() || fallbackHorse.story;
  return {
    id: safeId,
    name: safeName,
    symbol: safeSymbol,
    story: safeStory
  };
}

function sanitizeCurseHorses(rawHorses) {
  const fallback = cloneDefaultState().curseRace.horses;
  if (!Array.isArray(rawHorses) || rawHorses.length === 0) {
    return fallback;
  }

  const sanitized = [];
  const seen = new Set();
  for (let i = 0; i < rawHorses.length; i += 1) {
    const horse = sanitizeCurseHorse(rawHorses[i], i);
    if (!horse.id || seen.has(horse.id)) {
      continue;
    }
    seen.add(horse.id);
    sanitized.push(horse);
  }

  return sanitized.length >= 4 ? sanitized : fallback;
}

function normalizeOptionalBetAmount(rawAmount) {
  const numeric = Math.max(0, Math.round(sanitizeNumber(rawAmount, 0)));
  if (numeric === 0) {
    return 0;
  }
  return Math.round(Math.max(BET_ROUNDING_STEP, numeric) / BET_ROUNDING_STEP) * BET_ROUNDING_STEP;
}

function sanitizeCurseTeamBetState(rawTeamState, horseIds) {
  const safe = {
    bettorId: "",
    horseBets: {}
  };
  safe.bettorId = sanitizeString(rawTeamState?.bettorId, "").trim();
  for (const horseId of horseIds) {
    safe.horseBets[horseId] = normalizeOptionalBetAmount(rawTeamState?.horseBets?.[horseId] ?? 0);
  }
  return safe;
}

function sanitizeCurseRoundState(rawRoundState, horseIds = state.curseRace?.horses?.map((horse) => horse.id) || []) {
  const safeHorseIds = Array.isArray(horseIds) ? horseIds : [];
  const fallbackHorseId = safeHorseIds[0] || "";
  const safe = {
    positions: {},
    moveHorseId: fallbackHorseId,
    moveSteps: 1,
    winnerHorseId: "",
    payoutApplied: false,
    lastResult: "",
    bets: {
      teamA: sanitizeCurseTeamBetState(null, safeHorseIds),
      teamB: sanitizeCurseTeamBetState(null, safeHorseIds)
    }
  };

  if (!rawRoundState || typeof rawRoundState !== "object") {
    return safe;
  }

  for (const horseId of safeHorseIds) {
    safe.positions[horseId] = Math.max(0, Math.round(sanitizeNumber(rawRoundState.positions?.[horseId], 0)));
  }
  safe.moveHorseId = safeHorseIds.includes(rawRoundState.moveHorseId) ? rawRoundState.moveHorseId : fallbackHorseId;
  safe.moveSteps = Math.max(1, Math.round(sanitizeNumber(rawRoundState.moveSteps, 1)));
  safe.winnerHorseId = safeHorseIds.includes(rawRoundState.winnerHorseId) ? rawRoundState.winnerHorseId : "";
  safe.payoutApplied = Boolean(rawRoundState.payoutApplied) && Boolean(safe.winnerHorseId);
  safe.lastResult = sanitizeString(rawRoundState.lastResult, "");
  safe.bets.teamA = sanitizeCurseTeamBetState(rawRoundState.bets?.teamA, safeHorseIds);
  safe.bets.teamB = sanitizeCurseTeamBetState(rawRoundState.bets?.teamB, safeHorseIds);
  return safe;
}

function getCurseRoundKey(roundNumber = state.progress.currentRound) {
  return `curse::R${Math.max(1, Math.round(sanitizeNumber(roundNumber, 1)))}`;
}

function getOrCreateCurseRoundState(roundNumber = state.progress.currentRound) {
  const roundKey = getCurseRoundKey(roundNumber);
  const horseIds = state.curseRace.horses.map((horse) => horse.id);
  if (!state.curseRace.rounds[roundKey]) {
    state.curseRace.rounds[roundKey] = sanitizeCurseRoundState(
      {
        positions: {},
        moveHorseId: horseIds[0] || "",
        moveSteps: 1,
        winnerHorseId: "",
        payoutApplied: false,
        lastResult: "",
        bets: {
          teamA: { bettorId: "", horseBets: {} },
          teamB: { bettorId: "", horseBets: {} }
        }
      },
      horseIds
    );
  }
  const safe = sanitizeCurseRoundState(state.curseRace.rounds[roundKey], horseIds);
  state.curseRace.rounds[roundKey] = safe;
  return safe;
}

function getRoundKey(gameId = state.progress.currentGame, roundNumber = state.progress.currentRound) {
  return `${gameId}::R${roundNumber}`;
}

function sanitizeHistorySnapshot(snapshot) {
  const base = {
    activeByTeam: { teamA: [], teamB: [] },
    jokerAssignment: "out"
  };

  if (!snapshot || typeof snapshot !== "object") {
    return base;
  }

  base.activeByTeam.teamA = Array.isArray(snapshot.activeByTeam?.teamA)
    ? snapshot.activeByTeam.teamA.filter((id) => typeof id === "string")
    : [];
  base.activeByTeam.teamB = Array.isArray(snapshot.activeByTeam?.teamB)
    ? snapshot.activeByTeam.teamB.filter((id) => typeof id === "string")
    : [];
  base.jokerAssignment = ["teamA", "teamB", "out"].includes(snapshot.jokerAssignment)
    ? snapshot.jokerAssignment
    : "out";

  return base;
}

function sanitizeState(rawState) {
  const clean = cloneDefaultState();
  const source = rawState || {};

  if (SECTION_IDS.includes(source.activeSection)) {
    clean.activeSection = source.activeSection;
  }

  clean.settings.showTitle =
    sanitizeString(source.settings?.showTitle, clean.settings.showTitle).trim() || clean.settings.showTitle;
  clean.settings.hostName =
    sanitizeString(source.settings?.hostName, clean.settings.hostName).trim() || clean.settings.hostName;
  clean.settings.currencySymbol =
    sanitizeString(source.settings?.currencySymbol, clean.settings.currencySymbol).trim().slice(0, 3) || "$";

  clean.teams.teamA.name = sanitizeString(source.teams?.teamA?.name, clean.teams.teamA.name).trim() || "Team 1";
  clean.teams.teamB.name = sanitizeString(source.teams?.teamB?.name, clean.teams.teamB.name).trim() || "Team 2";
  clean.teams.teamA.score = Math.max(0, sanitizeNumber(source.teams?.teamA?.score, 0));
  clean.teams.teamB.score = Math.max(0, sanitizeNumber(source.teams?.teamB?.score, 0));
  clean.teams.teamA.money = Math.max(0, sanitizeNumber(source.teams?.teamA?.money, TEAM_START_MONEY));
  clean.teams.teamB.money = Math.max(0, sanitizeNumber(source.teams?.teamB?.money, TEAM_START_MONEY));
  const teamAPlayersSource = Array.isArray(source.teams?.teamA?.players)
    ? source.teams.teamA.players
    : rosterTextToPlayers(source.teams?.teamA?.roster, "teamA");
  const teamBPlayersSource = Array.isArray(source.teams?.teamB?.players)
    ? source.teams.teamB.players
    : rosterTextToPlayers(source.teams?.teamB?.roster, "teamB");

  clean.teams.teamA.players = sanitizePlayerList(teamAPlayersSource, "teamA");
  clean.teams.teamB.players = sanitizePlayerList(teamBPlayersSource, "teamB");

  if (GAME_ORDER.includes(source.progress?.currentGame)) {
    clean.progress.currentGame = source.progress.currentGame;
  }
  clean.progress.currentRound = Math.max(1, Math.round(sanitizeNumber(source.progress?.currentRound, 1)));
  clean.progress.lastResultSummary =
    sanitizeString(source.progress?.lastResultSummary, DEFAULT_RESULT_SUMMARY) || DEFAULT_RESULT_SUMMARY;

  clean.timer.duration = clampNumber(Math.round(sanitizeNumber(source.timer?.duration, 60)), 10, 600);
  clean.timer.remaining = clampNumber(
    Math.round(sanitizeNumber(source.timer?.remaining, clean.timer.duration)),
    0,
    clean.timer.duration
  );
  clean.timer.isRunning = Boolean(source.timer?.isRunning);
  clean.timer.lastTickMs = source.timer?.lastTickMs ? Number(source.timer.lastTickMs) : null;

  clean.trivia.fixedBonus = Math.max(0, Math.round(sanitizeNumber(source.trivia?.fixedBonus, 100)));
  clean.trivia.categories = sanitizeTriviaCategories(source.trivia?.categories);
  const categoryIdSet = new Set(clean.trivia.categories.map((category) => category.id));

  if (source.trivia?.rounds && typeof source.trivia.rounds === "object") {
    for (const [roundKey, rawRoundState] of Object.entries(source.trivia.rounds)) {
      const safeRoundState = sanitizeTriviaRoundState(rawRoundState);
      safeRoundState.usedCategoryIds = safeRoundState.usedCategoryIds.filter((id) => categoryIdSet.has(id));
      if (!categoryIdSet.has(safeRoundState.selectedCategoryId)) {
        safeRoundState.selectedCategoryId = clean.trivia.categories[0]?.id || "";
      }
      clean.trivia.rounds[roundKey] = safeRoundState;
    }
  }

  clean.pretul.items = sanitizePretulItems(source.pretul?.items);
  const pretulItemIdSet = new Set(clean.pretul.items.map((item) => item.id));

  if (source.pretul?.rounds && typeof source.pretul.rounds === "object") {
    for (const [roundKey, rawRoundState] of Object.entries(source.pretul.rounds)) {
      const safeRoundState = sanitizePretulRoundState(rawRoundState);
      safeRoundState.usedItemIds = safeRoundState.usedItemIds.filter((id) => pretulItemIdSet.has(id));
      if (!pretulItemIdSet.has(safeRoundState.selectedItemId)) {
        safeRoundState.selectedItemId = clean.pretul.items[0]?.id || "";
      }
      clean.pretul.rounds[roundKey] = safeRoundState;
    }
  }

  clean.filmGame.items = sanitizeFilmItems(source.filmGame?.items);
  const filmItemIdSet = new Set(clean.filmGame.items.map((item) => item.id));

  if (source.filmGame?.rounds && typeof source.filmGame.rounds === "object") {
    for (const [roundKey, rawRoundState] of Object.entries(source.filmGame.rounds)) {
      const safeRoundState = sanitizeFilmRoundState(rawRoundState);
      safeRoundState.usedItemIds = safeRoundState.usedItemIds.filter((id) => filmItemIdSet.has(id));
      if (!filmItemIdSet.has(safeRoundState.selectedItemId)) {
        safeRoundState.selectedItemId = clean.filmGame.items[0]?.id || "";
      }
      clean.filmGame.rounds[roundKey] = safeRoundState;
    }
  }

  clean.samsarGame.roundsData = sanitizeSamsarRoundsData(source.samsarGame?.roundsData);
  if (source.samsarGame?.rounds && typeof source.samsarGame.rounds === "object") {
    for (const [roundKey, rawRoundState] of Object.entries(source.samsarGame.rounds)) {
      clean.samsarGame.rounds[roundKey] = sanitizeSamsarRoundState(rawRoundState);
    }
  }

  clean.manualMatch.selectedGame = isManualMatchGame(source.manualMatch?.selectedGame)
    ? source.manualMatch.selectedGame
    : clean.manualMatch.selectedGame;
  if (source.manualMatch?.rounds && typeof source.manualMatch.rounds === "object") {
    for (const [roundKey, rawRoundState] of Object.entries(source.manualMatch.rounds)) {
      clean.manualMatch.rounds[roundKey] = sanitizeManualMatchRoundState(rawRoundState);
    }
  }

  clean.playerStats = sanitizePlayerStatsState(source.playerStats);

  clean.curseRace.trackLength = clampNumber(Math.round(sanitizeNumber(source.curseRace?.trackLength, 12)), 6, 40);
  clean.curseRace.payoutMultiplier = Math.max(2, Math.round(sanitizeNumber(source.curseRace?.payoutMultiplier, 4)));
  clean.curseRace.horses = sanitizeCurseHorses(source.curseRace?.horses);
  const curseHorseIds = clean.curseRace.horses.map((horse) => horse.id);
  if (source.curseRace?.rounds && typeof source.curseRace.rounds === "object") {
    for (const [roundKey, rawRoundState] of Object.entries(source.curseRace.rounds)) {
      clean.curseRace.rounds[roundKey] = sanitizeCurseRoundState(rawRoundState, curseHorseIds);
    }
  }

  clean.roundSelection.locked = Boolean(source.roundSelection?.locked);
  clean.roundSelection.jokerAssignment = ["teamA", "teamB", "out"].includes(source.roundSelection?.jokerAssignment)
    ? source.roundSelection.jokerAssignment
    : "out";
  clean.roundSelection.activeByTeam.teamA = Array.isArray(source.roundSelection?.activeByTeam?.teamA)
    ? source.roundSelection.activeByTeam.teamA.filter((id) => typeof id === "string")
    : [];
  clean.roundSelection.activeByTeam.teamB = Array.isArray(source.roundSelection?.activeByTeam?.teamB)
    ? source.roundSelection.activeByTeam.teamB.filter((id) => typeof id === "string")
    : [];

  if (source.roundSelection?.history && typeof source.roundSelection.history === "object") {
    for (const [key, snapshot] of Object.entries(source.roundSelection.history)) {
      clean.roundSelection.history[key] = sanitizeHistorySnapshot(snapshot);
    }
  }

  for (const key of Object.keys(clean.sections)) {
    clean.sections[key] = sanitizeString(source.sections?.[key], clean.sections[key]);
  }
  for (const [sectionKey, legacyText] of Object.entries(LEGACY_SECTION_NOTES)) {
    if (clean.sections[sectionKey] === legacyText || !String(clean.sections[sectionKey] || "").trim()) {
      clean.sections[sectionKey] = SECTION_NOTES_DEFAULTS[sectionKey];
    }
  }

  clean.updatedAt = source.updatedAt || null;
  return clean;
}

function loadState() {
  try {
    const keysToTry = [STORAGE_KEY, ...LEGACY_STORAGE_KEYS];
    for (const key of keysToTry) {
      const stored = localStorage.getItem(key);
      if (!stored) {
        continue;
      }
      const parsed = JSON.parse(stored);
      return sanitizeState(parsed);
    }
    return cloneDefaultState();
  } catch (error) {
    return cloneDefaultState();
  }
}

function getByPath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
}

function setByPath(obj, path, value) {
  const keys = path.split(".");
  let cursor = obj;
  for (let i = 0; i < keys.length - 1; i += 1) {
    const key = keys[i];
    if (typeof cursor[key] !== "object" || cursor[key] === null) {
      cursor[key] = {};
    }
    cursor = cursor[key];
  }
  cursor[keys[keys.length - 1]] = value;
}

function formatMoney(value) {
  const symbol = state.settings.currencySymbol || "$";
  return `${symbol}${value.toLocaleString("en-US")}`;
}

function transferMoney(fromTeamKey, toTeamKey, amount) {
  const safeAmount = Math.max(0, Math.round(sanitizeNumber(amount, 0)));
  if (safeAmount <= 0 || fromTeamKey === toTeamKey) {
    return 0;
  }
  const fromTeam = state.teams[fromTeamKey];
  const toTeam = state.teams[toTeamKey];
  if (!fromTeam || !toTeam) {
    return 0;
  }
  const paid = Math.min(safeAmount, fromTeam.money);
  fromTeam.money -= paid;
  toTeam.money += paid;
  return paid;
}

function getPlayerStatsEntryView(playerId) {
  return sanitizePlayerStatsEntry(state.playerStats?.byPlayerId?.[playerId]);
}

function ensurePlayerStatsEntry(playerId, context = {}) {
  if (!state.playerStats || typeof state.playerStats !== "object") {
    state.playerStats = {
      schemaVersion: PLAYER_STATS_SCHEMA_VERSION,
      byPlayerId: {}
    };
  }
  if (!state.playerStats.byPlayerId || typeof state.playerStats.byPlayerId !== "object") {
    state.playerStats.byPlayerId = {};
  }

  const existing = sanitizePlayerStatsEntry(state.playerStats.byPlayerId[playerId]);
  const displayName = sanitizeString(context.displayName, "").trim();
  const lastTeamKey = ["teamA", "teamB"].includes(context.teamKey) ? context.teamKey : existing.lastTeamKey;

  existing.displayName = displayName || existing.displayName || (playerId === JOKER_PLAYER_ID ? "Joker Player" : "");
  existing.isJoker = playerId === JOKER_PLAYER_ID || Boolean(existing.isJoker) || Boolean(context.isJoker);
  existing.lastTeamKey = existing.isJoker ? "" : lastTeamKey;
  state.playerStats.byPlayerId[playerId] = existing;
  return existing;
}

function getActiveParticipantsForTeam(teamKey) {
  const participants = [];
  const seen = new Set();
  const teamPlayersById = new Map(state.teams[teamKey].players.map((player) => [player.id, player]));

  for (const playerId of state.roundSelection.activeByTeam[teamKey]) {
    const player = teamPlayersById.get(playerId);
    if (!player || seen.has(player.id)) {
      continue;
    }
    seen.add(player.id);
    participants.push({
      id: player.id,
      displayName: player.name,
      teamKey,
      isJoker: false
    });
  }

  if (state.roundSelection.jokerAssignment === teamKey && !seen.has(JOKER_PLAYER_ID)) {
    participants.push({
      id: JOKER_PLAYER_ID,
      displayName: "Joker Player",
      teamKey,
      isJoker: true
    });
  }

  return participants;
}

function splitAmountAcrossParticipants(totalAmount, participantCount) {
  const count = Math.max(0, Math.round(sanitizeNumber(participantCount, 0)));
  if (count <= 0) {
    return [];
  }

  const roundedTotal = Math.round(sanitizeNumber(totalAmount, 0));
  if (roundedTotal === 0) {
    return Array.from({ length: count }, () => 0);
  }

  const sign = roundedTotal >= 0 ? 1 : -1;
  const absolute = Math.abs(roundedTotal);
  const base = Math.floor(absolute / count);
  const remainder = absolute % count;
  const shares = Array.from({ length: count }, (_, index) => {
    const withRemainder = index < remainder ? base + 1 : base;
    return withRemainder * sign;
  });
  return shares;
}

function incrementPerGameCounter(counterMap, gameId, amount = 1) {
  if (!GAME_ORDER.includes(gameId)) {
    return;
  }
  const current = Math.max(0, Math.round(sanitizeNumber(counterMap[gameId], 0)));
  const next = current + Math.max(0, Math.round(sanitizeNumber(amount, 0)));
  if (next > 0) {
    counterMap[gameId] = next;
  }
}

function applyTeamParticipantStats({
  gameId,
  teamKey,
  participants,
  roundOutcome,
  teamNetDelta,
  teamBetAmount,
  betOutcome
}) {
  if (!Array.isArray(participants) || participants.length === 0) {
    return;
  }

  const netShares = splitAmountAcrossParticipants(teamNetDelta, participants.length);
  const betShares = splitAmountAcrossParticipants(Math.max(0, Math.round(sanitizeNumber(teamBetAmount, 0))), participants.length);

  for (let i = 0; i < participants.length; i += 1) {
    const participant = participants[i];
    const entry = ensurePlayerStatsEntry(participant.id, {
      displayName: participant.displayName,
      teamKey,
      isJoker: participant.isJoker
    });

    entry.roundsPlayed += 1;
    entry.gamesPlayed += 1;
    incrementPerGameCounter(entry.participationsPerGameType, gameId, 1);

    if (roundOutcome === "win") {
      entry.roundsWon += 1;
      incrementPerGameCounter(entry.winsPerGameType, gameId, 1);
    } else if (roundOutcome === "loss") {
      entry.roundsLost += 1;
    }

    const moneyShare = Math.round(sanitizeNumber(netShares[i], 0));
    if (moneyShare > 0) {
      entry.totalMoneyWon += moneyShare;
      entry.biggestWin = Math.max(entry.biggestWin, moneyShare);
    } else if (moneyShare < 0) {
      const loss = Math.abs(moneyShare);
      entry.totalMoneyLost += loss;
      entry.biggestLoss = Math.max(entry.biggestLoss, loss);
    }
    entry.netMoney = entry.totalMoneyWon - entry.totalMoneyLost;

    const betShare = Math.max(0, Math.round(sanitizeNumber(betShares[i], 0)));
    entry.totalBetAmount += betShare;
    if (betShare > 0) {
      if (betOutcome === "win") {
        entry.betsWon += 1;
      } else if (betOutcome === "loss") {
        entry.betsLost += 1;
      }
    }
  }
}

function applyRoundPlayerStats({ gameId, teamA, teamB }) {
  if (!GAME_ORDER.includes(gameId)) {
    return;
  }
  if (teamA) {
    applyTeamParticipantStats({
      gameId,
      teamKey: "teamA",
      participants: teamA.participants || [],
      roundOutcome: teamA.roundOutcome || "draw",
      teamNetDelta: Math.round(sanitizeNumber(teamA.teamNetDelta, 0)),
      teamBetAmount: Math.max(0, Math.round(sanitizeNumber(teamA.teamBetAmount, 0))),
      betOutcome: teamA.betOutcome || "draw"
    });
  }
  if (teamB) {
    applyTeamParticipantStats({
      gameId,
      teamKey: "teamB",
      participants: teamB.participants || [],
      roundOutcome: teamB.roundOutcome || "draw",
      teamNetDelta: Math.round(sanitizeNumber(teamB.teamNetDelta, 0)),
      teamBetAmount: Math.max(0, Math.round(sanitizeNumber(teamB.teamBetAmount, 0))),
      betOutcome: teamB.betOutcome || "draw"
    });
  }
}

function getOutcomeForTeamFromWinner(winner, teamKey) {
  if (winner === "draw") {
    return "draw";
  }
  if (winner === teamKey) {
    return "win";
  }
  return "loss";
}

function formatPerGameStatsInline(counterMap) {
  const entries = Object.entries(counterMap || {}).filter((entry) => GAME_ORDER.includes(entry[0]) && entry[1] > 0);
  if (entries.length === 0) {
    return "none";
  }
  return entries
    .map(([gameId, value]) => `${getGameLabel(gameId)}:${value}`)
    .join(" | ");
}

function formatSignedMoney(value) {
  const normalized = Math.round(sanitizeNumber(value, 0));
  if (normalized >= 0) {
    return `+${formatMoney(normalized)}`;
  }
  return `-${formatMoney(Math.abs(normalized))}`;
}

function getAwardsPlayerPool() {
  const liveById = new Map();
  for (const teamKey of ["teamA", "teamB"]) {
    for (const player of state.teams[teamKey].players) {
      liveById.set(player.id, {
        id: player.id,
        name: player.name,
        teamKey
      });
    }
  }

  const statsById = state.playerStats?.byPlayerId || {};
  const allIds = new Set([...Object.keys(statsById), ...liveById.keys(), JOKER_PLAYER_ID]);
  const players = [];

  for (const playerId of allIds) {
    const live = liveById.get(playerId);
    const stats = getPlayerStatsEntryView(playerId);
    const name =
      playerId === JOKER_PLAYER_ID
        ? "Joker Player"
        : live?.name || stats.displayName || "Unknown Player";
    const teamKey =
      playerId === JOKER_PLAYER_ID
        ? ""
        : live?.teamKey || (["teamA", "teamB"].includes(stats.lastTeamKey) ? stats.lastTeamKey : "");
    players.push({
      id: playerId,
      name,
      teamKey,
      stats
    });
  }

  return players;
}

function formatAwardPlayerName(player) {
  if (!player) {
    return "N/A";
  }
  if (player.id === JOKER_PLAYER_ID || !["teamA", "teamB"].includes(player.teamKey)) {
    return player.name;
  }
  const teamName = state.teams[player.teamKey]?.name || player.teamKey;
  return `${player.name} (${teamName})`;
}

function pickTopAwardPlayer(players, options = {}) {
  const metricFn = typeof options.metricFn === "function" ? options.metricFn : () => 0;
  const filterFn = typeof options.filterFn === "function" ? options.filterFn : () => true;
  const minValue = options.minValue;
  const candidates = [];

  for (const player of players) {
    if (!filterFn(player)) {
      continue;
    }
    const score = sanitizeNumber(metricFn(player), Number.NaN);
    if (!Number.isFinite(score)) {
      continue;
    }
    if (typeof minValue === "number" && score < minValue) {
      continue;
    }
    candidates.push({
      player,
      score
    });
  }

  if (candidates.length === 0) {
    return null;
  }

  candidates.sort((left, right) => {
    if (right.score !== left.score) {
      return right.score - left.score;
    }
    if (right.player.stats.roundsWon !== left.player.stats.roundsWon) {
      return right.player.stats.roundsWon - left.player.stats.roundsWon;
    }
    if (right.player.stats.totalMoneyWon !== left.player.stats.totalMoneyWon) {
      return right.player.stats.totalMoneyWon - left.player.stats.totalMoneyWon;
    }
    if (right.player.stats.roundsPlayed !== left.player.stats.roundsPlayed) {
      return right.player.stats.roundsPlayed - left.player.stats.roundsPlayed;
    }
    return left.player.name.localeCompare(right.player.name);
  });

  return candidates[0];
}

function makeAwardCardModel(title, winner, modelConfig = {}) {
  if (!winner) {
    return {
      title,
      playerName: "N/A",
      reason: "No eligible stats yet.",
      primaryStat: "No data"
    };
  }

  const player = winner.player;
  const score = winner.score;
  const statBuilder = typeof modelConfig.statBuilder === "function" ? modelConfig.statBuilder : () => String(score);
  const reasonBuilder =
    typeof modelConfig.reasonBuilder === "function"
      ? modelConfig.reasonBuilder
      : () => "Calculated automatically from available statistics.";

  return {
    title,
    playerName: formatAwardPlayerName(player),
    reason: reasonBuilder(player, score),
    primaryStat: statBuilder(player, score)
  };
}

function renderAwardCardHtml(card) {
  return `
    <article class="award-card">
      <h4>${escapeHtml(card.title)}</h4>
      <p><strong>Player:</strong> ${escapeHtml(card.playerName)}</p>
      <p><strong>Main stat:</strong> <span class="award-main-stat">${escapeHtml(card.primaryStat)}</span></p>
      <p class="muted"><strong>Reason:</strong> ${escapeHtml(card.reason)}</p>
    </article>
  `;
}

function computeGeneralAwards(players) {
  const definitions = [
    {
      title: "MVP",
      metricFn: (player) => player.stats.roundsWon,
      minValue: 1,
      statBuilder: (_, score) => `${score} rounds won`,
      reasonBuilder: () => "Most rounds won across all games."
    },
    {
      title: "High Roller",
      metricFn: (player) => player.stats.biggestWin,
      minValue: 1,
      statBuilder: (player) => formatMoney(player.stats.biggestWin),
      reasonBuilder: () => "Largest single-round positive money result."
    },
    {
      title: "Unlucky",
      metricFn: (player) => player.stats.totalMoneyLost,
      minValue: 1,
      statBuilder: (player) => formatMoney(player.stats.totalMoneyLost),
      reasonBuilder: () => "Highest total money lost."
    },
    {
      title: "The Gambler",
      metricFn: (player) => player.stats.totalBetAmount,
      minValue: 1,
      statBuilder: (player) => formatMoney(player.stats.totalBetAmount),
      reasonBuilder: () => "Most money committed in bets."
    },
    {
      title: "Clutch King",
      metricFn: (player) => player.stats.betsWon,
      minValue: 1,
      statBuilder: (player) => `${player.stats.betsWon} bets won`,
      reasonBuilder: () => "Highest number of winning bets."
    },
    {
      title: "Safe Hands",
      metricFn: (player) => -player.stats.totalMoneyLost,
      filterFn: (player) => player.stats.totalBetAmount > 0,
      statBuilder: (player) => formatMoney(player.stats.totalMoneyLost),
      reasonBuilder: () => "Lowest money lost among players who placed bets."
    },
    {
      title: "Comeback Hero",
      metricFn: (player) => player.stats.netMoney,
      filterFn: (player) => player.stats.roundsLost > 0 && player.stats.netMoney > 0,
      minValue: 1,
      statBuilder: (player) => formatSignedMoney(player.stats.netMoney),
      reasonBuilder: () => "Positive net money despite recorded lost rounds."
    },
    {
      title: "Coin Vacuum",
      metricFn: (player) => player.stats.totalMoneyWon,
      minValue: 1,
      statBuilder: (player) => formatMoney(player.stats.totalMoneyWon),
      reasonBuilder: () => "Most total money won."
    }
  ];

  return definitions.map((definition) =>
    makeAwardCardModel(
      definition.title,
      pickTopAwardPlayer(players, {
        metricFn: definition.metricFn,
        filterFn: definition.filterFn,
        minValue: definition.minValue
      }),
      {
        statBuilder: definition.statBuilder,
        reasonBuilder: definition.reasonBuilder
      }
    )
  );
}

function computePerGameAwards(players) {
  const definitions = [
    { title: "Trivia Brain", gameId: "trivia" },
    { title: "Price Wizard", gameId: "pretul-corect" },
    { title: "Franchise Nerd", gameId: "film-joc-franciza-fun-fact" },
    { title: "Best Samsar", gameId: "cel-mai-bun-samsar" },
    { title: "Beer Pong Sniper", gameId: "beer-pong" },
    { title: "Shot Fake Master", gameId: "shot-fake" },
    { title: "Horse Whisperer", gameId: "curse-de-cai" }
  ];

  return definitions.map((definition) => {
    const winner = pickTopAwardPlayer(players, {
      metricFn: (player) => Math.max(0, Math.round(sanitizeNumber(player.stats.winsPerGameType?.[definition.gameId], 0))),
      minValue: 1
    });

    return makeAwardCardModel(definition.title, winner, {
      statBuilder: (player) => {
        const wins = Math.max(0, Math.round(sanitizeNumber(player.stats.winsPerGameType?.[definition.gameId], 0)));
        return `${wins} wins`;
      },
      reasonBuilder: (player) => {
        const wins = Math.max(0, Math.round(sanitizeNumber(player.stats.winsPerGameType?.[definition.gameId], 0)));
        const participations = Math.max(
          0,
          Math.round(sanitizeNumber(player.stats.participationsPerGameType?.[definition.gameId], 0))
        );
        return `Most wins in ${getGameLabel(definition.gameId)} (${wins} wins in ${participations} participations).`;
      }
    });
  });
}

function renderAwardsTitles() {
  if (!elements.awardsGeneralTitlesBoard || !elements.awardsGameTitlesBoard) {
    return;
  }

  const players = getAwardsPlayerPool();
  const generalCards = computeGeneralAwards(players);
  const gameCards = computePerGameAwards(players);

  elements.awardsGeneralTitlesBoard.innerHTML = generalCards.map((card) => renderAwardCardHtml(card)).join("");
  elements.awardsGameTitlesBoard.innerHTML = gameCards.map((card) => renderAwardCardHtml(card)).join("");

  if (elements.jokerFixedAwardLine) {
    const jokerStats = getPlayerStatsEntryView(JOKER_PLAYER_ID);
    elements.jokerFixedAwardLine.textContent =
      `Player: Joker Player | Reason: Fixed special title, always guaranteed | ` +
      `Main stat: F1 Gipsy King (locked title), rounds played ${jokerStats.roundsPlayed}.`;
  }
}

function getEndScreenWinnerSummary() {
  const moneyA = state.teams.teamA.money;
  const moneyB = state.teams.teamB.money;
  const scoreA = state.teams.teamA.score;
  const scoreB = state.teams.teamB.score;

  if (moneyA > moneyB) {
    return {
      teamKey: "teamA",
      title: `${state.teams.teamA.name} wins`,
      reason: `Higher final money: ${formatMoney(moneyA)} vs ${formatMoney(moneyB)}.`
    };
  }
  if (moneyB > moneyA) {
    return {
      teamKey: "teamB",
      title: `${state.teams.teamB.name} wins`,
      reason: `Higher final money: ${formatMoney(moneyB)} vs ${formatMoney(moneyA)}.`
    };
  }
  if (scoreA > scoreB) {
    return {
      teamKey: "teamA",
      title: `${state.teams.teamA.name} wins`,
      reason: `Money tie at ${formatMoney(moneyA)}. Score tie-break: ${scoreA} vs ${scoreB}.`
    };
  }
  if (scoreB > scoreA) {
    return {
      teamKey: "teamB",
      title: `${state.teams.teamB.name} wins`,
      reason: `Money tie at ${formatMoney(moneyA)}. Score tie-break: ${scoreB} vs ${scoreA}.`
    };
  }
  return {
    teamKey: "draw",
    title: "Final draw",
    reason: `Money tie ${formatMoney(moneyA)} and score tie ${scoreA}-${scoreB}.`
  };
}

function renderEndScreen() {
  if (
    !elements.endWinningTeamName ||
    !elements.endWinningTeamReason ||
    !elements.endTeamAMoney ||
    !elements.endTeamBMoney ||
    !elements.endTeamAScore ||
    !elements.endTeamBScore ||
    !elements.endAwardsGeneralBoard ||
    !elements.endAwardsGameBoard ||
    !elements.endJokerTitleLine ||
    !elements.endFinalTitlesScript
  ) {
    return;
  }

  const summary = getEndScreenWinnerSummary();
  elements.endWinningTeamName.textContent = summary.title;
  elements.endWinningTeamReason.textContent = summary.reason;
  elements.endTeamAMoney.textContent = formatMoney(state.teams.teamA.money);
  elements.endTeamBMoney.textContent = formatMoney(state.teams.teamB.money);
  elements.endTeamAScore.textContent = `Score: ${state.teams.teamA.score}`;
  elements.endTeamBScore.textContent = `Score: ${state.teams.teamB.score}`;

  if (elements.endTeamACard && elements.endTeamBCard) {
    elements.endTeamACard.classList.toggle("end-team-winning", summary.teamKey === "teamA");
    elements.endTeamBCard.classList.toggle("end-team-winning", summary.teamKey === "teamB");
  }

  const players = getAwardsPlayerPool();
  const generalCards = computeGeneralAwards(players);
  const gameCards = computePerGameAwards(players);
  elements.endAwardsGeneralBoard.innerHTML = generalCards.map((card) => renderAwardCardHtml(card)).join("");
  elements.endAwardsGameBoard.innerHTML = gameCards.map((card) => renderAwardCardHtml(card)).join("");

  const jokerStats = getPlayerStatsEntryView(JOKER_PLAYER_ID);
  elements.endJokerTitleLine.textContent =
    `Joker Player - F1 Gipsy King (fixed). Rounds played: ${jokerStats.roundsPlayed}, net money: ${formatSignedMoney(
      jokerStats.netMoney
    )}.`;
  elements.endFinalTitlesScript.textContent =
    (state.sections.finalTitles || "").trim() || "PLACEHOLDER: Closing speech, sponsor mentions, and final winner title line.";
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

function setSaveTransferStatus(message, isError = false) {
  if (!elements.saveTransferStatus) {
    return;
  }
  elements.saveTransferStatus.textContent = message;
  elements.saveTransferStatus.classList.toggle("is-error", Boolean(isError));
}

function renderUndoControlState() {
  if (!elements.undoLastResultBtn) {
    return;
  }
  const hasUndo = resultUndoStack.length > 0;
  elements.undoLastResultBtn.disabled = !hasUndo;
  elements.undoLastResultBtn.textContent = "Undo last result";
  elements.undoLastResultBtn.title = hasUndo ? `Last: ${resultUndoStack[resultUndoStack.length - 1].label}` : "No result to undo yet.";
}

function pushResultUndoSnapshot(label) {
  try {
    resultUndoStack.push({
      label: (label || "Applied result").trim(),
      snapshot: JSON.stringify(state),
      capturedAt: new Date().toISOString()
    });
    if (resultUndoStack.length > RESULT_UNDO_LIMIT) {
      resultUndoStack.shift();
    }
  } catch (error) {
    // If snapshot fails, we skip undo capture but keep main flow stable.
  }
  renderUndoControlState();
}

function syncTimerLoopWithState() {
  stopTimerLoop();
  if (state.timer.isRunning) {
    state.timer.lastTickMs = Date.now();
    startTimerLoop();
  }
}

function undoLastAppliedResult() {
  if (resultUndoStack.length === 0) {
    setLastResultSummary("No result to undo yet.");
    renderUndoControlState();
    saveState("Undo skipped: stack empty.");
    return;
  }

  const undoEntry = resultUndoStack.pop();
  renderUndoControlState();

  try {
    stopTimerLoop();
    state = sanitizeState(JSON.parse(undoEntry.snapshot));
    loadCurrentRoundSnapshot();
    applyElapsedTime();
    renderAll();
    syncTimerLoopWithState();

    const message = `Undo applied for: ${undoEntry.label}.`;
    setLastResultSummary(message);
    setSaveTransferStatus(message);
    saveState(message);
  } catch (error) {
    setLastResultSummary("Undo failed because snapshot restore could not be completed.");
    saveState("Undo failed.");
  }
}

function renderFullscreenToggleLabel() {
  if (!elements.fullscreenToggleBtn) {
    return;
  }
  const isFullscreen = Boolean(document.fullscreenElement);
  elements.fullscreenToggleBtn.textContent = isFullscreen ? "Exit fullscreen" : "Fullscreen";
}

async function toggleFullscreenMode() {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
  } catch (error) {
    setLastResultSummary("Fullscreen request failed in this browser context.");
    saveState("Fullscreen toggle failed.");
  } finally {
    renderFullscreenToggleLabel();
  }
}

function buildSaveExportPayload() {
  saveCurrentRoundSnapshot();
  return {
    app: "gameshow-host-dashboard",
    formatVersion: SAVE_EXPORT_FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    state: sanitizeState(JSON.parse(JSON.stringify(state)))
  };
}

function exportSaveData() {
  try {
    const payload = buildSaveExportPayload();
    const serialized = JSON.stringify(payload, null, 2);

    if (elements.saveTransferArea) {
      elements.saveTransferArea.value = serialized;
    }

    const safeStamp = payload.exportedAt.replaceAll(":", "-").replaceAll(".", "-");
    const fileName = `gameshow-save-${safeStamp}.json`;
    const blob = new Blob([serialized], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);

    setSaveTransferStatus(`Exported save at ${payload.exportedAt}.`);
    saveState("Save exported.");
  } catch (error) {
    setSaveTransferStatus("Export failed. Could not serialize current state.", true);
    saveState("Save export failed.");
  }
}

function importSaveDataFromText(rawText) {
  const source = String(rawText || "").trim();
  if (!source) {
    setSaveTransferStatus("Import failed: no JSON content provided.", true);
    return;
  }

  try {
    const parsed = JSON.parse(source);
    const importedState =
      parsed && typeof parsed === "object" && parsed.state && typeof parsed.state === "object"
        ? parsed.state
        : parsed;
    if (!importedState || typeof importedState !== "object") {
      throw new Error("Invalid payload");
    }

    stopTimerLoop();
    state = sanitizeState(importedState);
    loadCurrentRoundSnapshot();
    applyElapsedTime();
    resultUndoStack = [];
    renderAll();
    syncTimerLoopWithState();
    renderFullscreenToggleLabel();
    renderUndoControlState();

    const exportStamp =
      parsed && typeof parsed === "object" && typeof parsed.exportedAt === "string"
        ? ` (exported ${parsed.exportedAt})`
        : "";
    setLastResultSummary(`Save imported successfully${exportStamp}.`);
    setSaveTransferStatus(`Import successful${exportStamp}.`);
    saveState("Save imported.");
  } catch (error) {
    setSaveTransferStatus("Import failed: invalid JSON format.", true);
    saveState("Save import failed.");
  }
}

function handleImportSaveAction() {
  const pasted = elements.saveTransferArea?.value?.trim() || "";
  if (pasted) {
    importSaveDataFromText(pasted);
    return;
  }
  if (elements.importSaveFileInput) {
    elements.importSaveFileInput.value = "";
    elements.importSaveFileInput.click();
    return;
  }
  setSaveTransferStatus("Import unavailable: no file picker or JSON content found.", true);
}

function handleImportSaveFileSelection() {
  const selectedFile = elements.importSaveFileInput?.files?.[0];
  if (!selectedFile) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const content = typeof reader.result === "string" ? reader.result : "";
    if (elements.saveTransferArea) {
      elements.saveTransferArea.value = content;
    }
    importSaveDataFromText(content);
  };
  reader.onerror = () => {
    setSaveTransferStatus("Import failed: could not read file.", true);
    saveState("Save import failed: file read error.");
  };
  reader.readAsText(selectedFile);
}

function enforceTriviaRoundTeamRestrictions() {
  if (state.progress.currentGame !== "trivia") {
    return;
  }

  const triviaRoundState = getOrCreateTriviaRoundState();
  const playingTeam = triviaRoundState.teamKey;
  const otherTeam = playingTeam === "teamA" ? "teamB" : "teamA";

  state.roundSelection.activeByTeam[otherTeam] = [];
  if (state.roundSelection.jokerAssignment === otherTeam) {
    state.roundSelection.jokerAssignment = "out";
  }
}

function enforceFilmRoundTeamRestrictions() {
  if (state.progress.currentGame !== "film-joc-franciza-fun-fact") {
    return;
  }

  const filmRoundState = getOrCreateFilmRoundState();
  const playingTeam = filmRoundState.teamKey;
  const otherTeam = playingTeam === "teamA" ? "teamB" : "teamA";

  state.roundSelection.activeByTeam[otherTeam] = [];
  if (state.roundSelection.jokerAssignment === otherTeam) {
    state.roundSelection.jokerAssignment = "out";
  }
}

function enforceSamsarRoundTeamSelection() {
  if (state.progress.currentGame !== "cel-mai-bun-samsar") {
    return;
  }

  const roundState = getOrCreateSamsarRoundState(getSamsarRoundNumber());
  const availableByTeam = {
    teamA: new Set(
      state.teams.teamA.players.filter((player) => player.status === "available").map((player) => player.id)
    ),
    teamB: new Set(
      state.teams.teamB.players.filter((player) => player.status === "available").map((player) => player.id)
    )
  };

  if (!availableByTeam.teamA.has(roundState.activePlayerTeamAId)) {
    roundState.activePlayerTeamAId = "";
  }
  if (!availableByTeam.teamB.has(roundState.activePlayerTeamBId)) {
    roundState.activePlayerTeamBId = "";
  }

  state.roundSelection.activeByTeam.teamA = roundState.activePlayerTeamAId ? [roundState.activePlayerTeamAId] : [];
  state.roundSelection.activeByTeam.teamB = roundState.activePlayerTeamBId ? [roundState.activePlayerTeamBId] : [];
}

function ensureCurrentRoundSelectionValid() {
  const availableIdSets = {
    teamA: new Set(
      state.teams.teamA.players.filter((player) => player.status === "available").map((player) => player.id)
    ),
    teamB: new Set(
      state.teams.teamB.players.filter((player) => player.status === "available").map((player) => player.id)
    )
  };

  state.roundSelection.activeByTeam.teamA = state.roundSelection.activeByTeam.teamA.filter((id) =>
    availableIdSets.teamA.has(id)
  );
  state.roundSelection.activeByTeam.teamB = state.roundSelection.activeByTeam.teamB.filter((id) =>
    availableIdSets.teamB.has(id)
  );

  enforceTriviaRoundTeamRestrictions();
  enforceFilmRoundTeamRestrictions();
  enforceSamsarRoundTeamSelection();

  for (const teamKey of ["teamA", "teamB"]) {
    const jokerSlot = state.roundSelection.jokerAssignment === teamKey ? 1 : 0;
    const allowed = Math.max(0, MAX_ACTIVE_PER_TEAM - jokerSlot);
    if (state.roundSelection.activeByTeam[teamKey].length > allowed) {
      state.roundSelection.activeByTeam[teamKey] = state.roundSelection.activeByTeam[teamKey].slice(0, allowed);
    }
  }
}

function saveCurrentRoundSnapshot() {
  ensureCurrentRoundSelectionValid();
  state.roundSelection.history[getRoundKey()] = {
    activeByTeam: {
      teamA: [...state.roundSelection.activeByTeam.teamA],
      teamB: [...state.roundSelection.activeByTeam.teamB]
    },
    jokerAssignment: state.roundSelection.jokerAssignment
  };
}

function loadCurrentRoundSnapshot() {
  const snapshot = state.roundSelection.history[getRoundKey()];
  if (snapshot) {
    const safe = sanitizeHistorySnapshot(snapshot);
    state.roundSelection.activeByTeam.teamA = [...safe.activeByTeam.teamA];
    state.roundSelection.activeByTeam.teamB = [...safe.activeByTeam.teamB];
    state.roundSelection.jokerAssignment = safe.jokerAssignment;
  } else {
    state.roundSelection.activeByTeam.teamA = [];
    state.roundSelection.activeByTeam.teamB = [];
    state.roundSelection.jokerAssignment = "out";
  }
  ensureCurrentRoundSelectionValid();
}

function countActiveWithJoker(teamKey) {
  const baseCount = state.roundSelection.activeByTeam[teamKey].length;
  const jokerCount = state.roundSelection.jokerAssignment === teamKey ? 1 : 0;
  return baseCount + jokerCount;
}

function renderNavigation() {
  elements.navButtons.forEach((button) => {
    const isActive = button.dataset.sectionTarget === state.activeSection;
    button.classList.toggle("is-active", isActive);
  });

  elements.pageSections.forEach((section) => {
    const isActive = section.dataset.section === state.activeSection;
    section.classList.toggle("is-active", isActive);
  });
}

function renderHeaderIdentity() {
  const showTitle = state.settings.showTitle || "GameShow";
  const hostName = state.settings.hostName || "Host";

  elements.showTitleTargets.forEach((node) => {
    node.textContent = showTitle;
  });
  elements.hostNameTargets.forEach((node) => {
    node.textContent = hostName;
  });
}

function renderLeaders() {
  if (!elements.leaderByScore || !elements.leaderByMoney) {
    return;
  }

  const scoreA = state.teams.teamA.score;
  const scoreB = state.teams.teamB.score;
  const moneyA = state.teams.teamA.money;
  const moneyB = state.teams.teamB.money;

  if (scoreA === scoreB) {
    elements.leaderByScore.textContent = `Tie (${scoreA})`;
  } else if (scoreA > scoreB) {
    elements.leaderByScore.textContent = `${state.teams.teamA.name} (${scoreA})`;
  } else {
    elements.leaderByScore.textContent = `${state.teams.teamB.name} (${scoreB})`;
  }

  if (moneyA === moneyB) {
    elements.leaderByMoney.textContent = `Tie (${formatMoney(moneyA)})`;
  } else if (moneyA > moneyB) {
    elements.leaderByMoney.textContent = `${state.teams.teamA.name} (${formatMoney(moneyA)})`;
  } else {
    elements.leaderByMoney.textContent = `${state.teams.teamB.name} (${formatMoney(moneyB)})`;
  }
}

function renderTeams() {
  const names = {
    teamA: state.teams.teamA.name || "Team 1",
    teamB: state.teams.teamB.name || "Team 2"
  };

  elements.teamNameTargets.forEach((node) => {
    const teamKey = node.dataset.teamName;
    node.textContent = names[teamKey] || "Unknown Team";
  });

  elements.teamScoreTargets.forEach((node) => {
    const teamKey = node.dataset.teamScore;
    node.textContent = String(state.teams[teamKey]?.score ?? 0);
  });

  elements.teamMoneyTargets.forEach((node) => {
    const teamKey = node.dataset.teamMoney;
    node.textContent = formatMoney(state.teams[teamKey]?.money ?? 0);
  });

  if (elements.betTeamSelect) {
    const selectedTeam = elements.betTeamSelect.value || "teamA";
    elements.betTeamSelect.options[0].text = state.teams.teamA.name;
    elements.betTeamSelect.options[1].text = state.teams.teamB.name;
    elements.betTeamSelect.value = ["teamA", "teamB"].includes(selectedTeam) ? selectedTeam : "teamA";
  }

  renderLeaders();
}

function renderBoundFields() {
  elements.boundFields.forEach((field) => {
    const path = field.dataset.bind;
    const currentValue = getByPath(state, path);
    field.value = typeof currentValue === "string" ? currentValue : String(currentValue ?? "");
  });
}

function renderTimer() {
  elements.roundDuration.value = String(state.timer.duration);
  elements.timerDisplay.textContent = formatTimer(state.timer.remaining);
  elements.startTimerBtn.disabled = state.timer.isRunning;
  elements.pauseTimerBtn.disabled = !state.timer.isRunning;
}

function renderProgress() {
  const gameId = state.progress.currentGame;
  const gameLabel = getGameLabel(gameId);

  if (elements.currentGameSelect) {
    elements.currentGameSelect.value = gameId;
  }
  if (elements.currentRoundInput) {
    elements.currentRoundInput.value = String(state.progress.currentRound);
  }
  if (elements.currentGameLabel) {
    elements.currentGameLabel.textContent = gameLabel;
  }
  if (elements.currentRoundLabel) {
    elements.currentRoundLabel.textContent = String(state.progress.currentRound);
  }
  if (elements.lastResultSummary) {
    elements.lastResultSummary.textContent = state.progress.lastResultSummary;
  }
  if (elements.playersCurrentGameLabel) {
    elements.playersCurrentGameLabel.textContent = gameLabel;
  }
  if (elements.playersCurrentRoundLabel) {
    elements.playersCurrentRoundLabel.textContent = String(state.progress.currentRound);
  }
  if (elements.betGameSelect) {
    elements.betGameSelect.value = gameId;
  }
}

function normalizeBetAmount(rawAmount) {
  const amount = Math.max(BET_ROUNDING_STEP, Math.round(sanitizeNumber(rawAmount, BET_ROUNDING_STEP)));
  return Math.round(amount / BET_ROUNDING_STEP) * BET_ROUNDING_STEP;
}

function getMaxBetAmount(teamMoney, gameId) {
  const capPercent = getBetPercent(gameId);
  const maxByPercent = Math.floor(((teamMoney * capPercent) / 100) / BET_ROUNDING_STEP) * BET_ROUNDING_STEP;
  return Math.max(0, maxByPercent);
}

function renderBettingInfo() {
  if (!elements.betRuleInfo || !elements.betTeamSelect || !elements.betGameSelect || !elements.betAmountInput) {
    return;
  }

  const teamKey = elements.betTeamSelect.value;
  const gameId = elements.betGameSelect.value;
  const teamMoney = state.teams[teamKey]?.money ?? 0;
  const maxAllowed = getMaxBetAmount(teamMoney, gameId);
  const roundedInput = normalizeBetAmount(elements.betAmountInput.value);

  elements.betAmountInput.value = String(roundedInput);
  elements.betRuleInfo.textContent =
    `Rule: max ${getBetPercent(gameId)}% for ${getGameLabel(gameId)}. ` +
    `Rounded to ${BET_ROUNDING_STEP}. Max now: ${formatMoney(maxAllowed)}.`;
}

function renderSettingsRulesSnapshot() {
  if (
    !elements.settingsBetCapsLine ||
    !elements.settingsBonusesLine ||
    !elements.settingsTriviaRuleLine ||
    !elements.settingsPretulRuleLine ||
    !elements.settingsFilmRuleLine ||
    !elements.settingsSamsarRuleLine ||
    !elements.settingsShotFakeRuleLine ||
    !elements.settingsCurseRuleLine ||
    !elements.settingsSelectionRuleLine ||
    !elements.settingsMultiBetRuleLine
  ) {
    return;
  }

  const betCapsSummary = GAME_CONFIG.map((game) => `${game.label}: ${game.maxBetPercent}%`).join(" | ");
  const triviaBonus = Math.max(0, Math.round(sanitizeNumber(state.trivia.fixedBonus, 0)));

  elements.settingsBetCapsLine.textContent = `Bet caps: ${betCapsSummary} (all rounded to ${BET_ROUNDING_STEP}).`;
  elements.settingsBonusesLine.textContent =
    `Fixed bonus: Trivia +${formatMoney(triviaBonus)} on correct answer. ` +
    "No fixed bonus for Guess the Right Order, Pretul corect, Film/Joc/Franciza/Fun Fact, Cel mai bun samsar, Beer Pong, Shot Fake, or Curse de cai.";
  elements.settingsTriviaRuleLine.textContent =
    "Trivia de grup: one-team-only round. Only the selected team bets and plays; correct gives fixed bonus + bet win, wrong loses the bet; used categories are disabled.";
  elements.settingsPretulRuleLine.textContent =
    "Pretul corect: both teams submit answer + bet, and winner is auto-detected by closest value to real price; equal distance is tie.";
  elements.settingsFilmRuleLine.textContent =
    "Film/Joc/Franciza/Fun Fact: one-team-only, component weights 1/1/3, partial payout per component, and bet is active only at minimum 2/3 correct.";
  elements.settingsSamsarRuleLine.textContent =
    "Cel mai bun samsar: 6 rounds, persona placeholders, no link fields, one active player selector per team, higher score wins, equal score draw.";
  elements.settingsShotFakeRuleLine.textContent =
    "Shot Fake: bet-only team-vs-team mode with no fixed bonus, draw allowed, multiple side bets, and special x * active opponents transfer.";
  elements.settingsCurseRuleLine.textContent =
    "Curse de cai: bet-only race mode, multi-bet on horses enabled, only winning-horse bet pays x4, other horse bets are lost, winner is auto-detected.";
  elements.settingsSelectionRuleLine.textContent =
    "Player selection: manual per round, up to 6 active players per team, fast deselect controls, plus Bench/Unavailable status support.";
  elements.settingsMultiBetRuleLine.textContent =
    "Lock round selection is available to prevent accidental edits. Multi-bet is available in Shot Fake (side bets) and Curse de cai (horse board).";
}

function renderTriviaControls() {
  if (
    !elements.triviaPlayingTeamSelect ||
    !elements.triviaCategorySelect ||
    !elements.triviaBetAmountInput ||
    !elements.triviaFixedBonusInput ||
    !elements.triviaBetRuleInfo ||
    !elements.triviaCategoriesBoard
  ) {
    return;
  }

  const triviaRoundState = getOrCreateTriviaRoundState();
  const playingTeamKey = triviaRoundState.teamKey;
  const playingTeam = state.teams[playingTeamKey];
  const maxAllowedBet = getMaxBetAmount(playingTeam.money, "trivia");
  const normalizedBet = normalizeBetAmount(elements.triviaBetAmountInput.value);

  elements.triviaPlayingTeamSelect.options[0].text = state.teams.teamA.name;
  elements.triviaPlayingTeamSelect.options[1].text = state.teams.teamB.name;
  elements.triviaPlayingTeamSelect.value = playingTeamKey;

  const categoryOptions = state.trivia.categories
    .map((category) => {
      const isUsed = triviaRoundState.usedCategoryIds.includes(category.id);
      const selected = category.id === triviaRoundState.selectedCategoryId ? "selected" : "";
      const disabled = isUsed ? "disabled" : "";
      const usedTag = isUsed ? " (USED)" : "";
      return `<option value="${category.id}" ${selected} ${disabled}>${category.title}${usedTag}</option>`;
    })
    .join("");
  elements.triviaCategorySelect.innerHTML = categoryOptions;

  if (!elements.triviaCategorySelect.value) {
    const firstAvailable = state.trivia.categories.find(
      (category) => !triviaRoundState.usedCategoryIds.includes(category.id)
    );
    triviaRoundState.selectedCategoryId = firstAvailable?.id || "";
    elements.triviaCategorySelect.value = triviaRoundState.selectedCategoryId;
  }

  const bonus = Math.max(0, Math.round(sanitizeNumber(state.trivia.fixedBonus, 100)));
  elements.triviaFixedBonusInput.value = String(bonus);
  elements.triviaBetAmountInput.value = String(normalizedBet);
  elements.triviaBetRuleInfo.textContent =
    `Only ${playingTeam.name} can bet this Trivia round. Max 10% and rounded to 10. ` +
    `Max now: ${formatMoney(maxAllowedBet)}. Correct payout: +${formatMoney(bonus)} bonus + bet win.`;

  if (elements.triviaActiveSelectionInfo) {
    const playingCount = countActiveWithJoker(playingTeamKey);
    const otherTeamKey = playingTeamKey === "teamA" ? "teamB" : "teamA";
    const otherCount = countActiveWithJoker(otherTeamKey);
    elements.triviaActiveSelectionInfo.textContent =
      `${playingTeam.name} is active for this round (${playingCount}/${MAX_ACTIVE_PER_TEAM}). ` +
      `${state.teams[otherTeamKey].name} is inactive (${otherCount}/${MAX_ACTIVE_PER_TEAM}).`;
  }

  elements.triviaCategoriesBoard.innerHTML = state.trivia.categories
    .map((category) => {
      const isUsed = triviaRoundState.usedCategoryIds.includes(category.id);
      const cardClass = isUsed ? "trivia-category-card is-used" : "trivia-category-card";
      return `
        <article class="${cardClass}">
          <h4>${category.title}</h4>
          <p><strong>Q:</strong> ${category.question}</p>
          <p><strong>A:</strong> ${category.answer}</p>
          <button
            class="pill-btn"
            type="button"
            data-trivia-mark-used="${category.id}"
            ${isUsed ? "disabled" : ""}
          >
            ${isUsed ? "Used" : "Mark used"}
          </button>
        </article>
      `;
    })
    .join("");
}

function renderPretulActiveList(teamKey, container) {
  if (!container) {
    return;
  }

  const team = state.teams[teamKey];
  const activeIds = new Set(state.roundSelection.activeByTeam[teamKey]);
  const isLocked = state.roundSelection.locked;
  const activeCount = countActiveWithJoker(teamKey);

  container.innerHTML = `
    <div class="pretul-active-toolbar">
      <p class="muted"><strong>${activeCount}/${MAX_ACTIVE_PER_TEAM}</strong> active</p>
      <button
        class="pill-btn"
        type="button"
        data-pretul-clear-team="${teamKey}"
        ${isLocked || activeIds.size === 0 ? "disabled" : ""}
      >
        Deselect all
      </button>
    </div>
    <div class="pretul-active-rows">
      ${team.players
        .map((player) => {
          const isActive = activeIds.has(player.id);
          const isAvailable = player.status === "available";
          const disabled = isLocked || !isAvailable ? "disabled" : "";
          return `
            <label class="pretul-active-option ${isActive ? "is-active" : ""}">
              <input
                type="checkbox"
                data-pretul-player-active
                data-team="${teamKey}"
                data-player-id="${player.id}"
                ${isActive ? "checked" : ""}
                ${disabled}
              >
              <span>${escapeHtml(player.name)}</span>
              <small>${player.status}</small>
            </label>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderPretulControls() {
  if (
    !elements.pretulItemSelect ||
    !elements.pretulAnswerTeamAInput ||
    !elements.pretulAnswerTeamBInput ||
    !elements.pretulBetTeamAInput ||
    !elements.pretulBetTeamBInput ||
    !elements.pretulRealPriceInput ||
    !elements.pretulRuleInfo ||
    !elements.pretulRoundResult ||
    !elements.pretulItemsBoard
  ) {
    return;
  }

  const roundState = getOrCreatePretulRoundState();
  const teamA = state.teams.teamA;
  const teamB = state.teams.teamB;
  const maxBetA = getMaxBetAmount(teamA.money, "pretul-corect");
  const maxBetB = getMaxBetAmount(teamB.money, "pretul-corect");
  const itemIdSet = new Set(state.pretul.items.map((item) => item.id));

  roundState.usedItemIds = roundState.usedItemIds.filter((id) => itemIdSet.has(id));
  if (
    !itemIdSet.has(roundState.selectedItemId) ||
    roundState.usedItemIds.includes(roundState.selectedItemId)
  ) {
    const firstAvailable = state.pretul.items.find((item) => !roundState.usedItemIds.includes(item.id));
    roundState.selectedItemId = firstAvailable?.id || "";
  }

  roundState.betTeamA = maxBetA <= 0 ? 0 : Math.min(normalizeBetAmount(roundState.betTeamA), maxBetA);
  roundState.betTeamB = maxBetB <= 0 ? 0 : Math.min(normalizeBetAmount(roundState.betTeamB), maxBetB);
  roundState.answerTeamA = Math.max(0, Math.round(sanitizeNumber(roundState.answerTeamA, 0)));
  roundState.answerTeamB = Math.max(0, Math.round(sanitizeNumber(roundState.answerTeamB, 0)));
  roundState.realPrice = Math.max(0, Math.round(sanitizeNumber(roundState.realPrice, 0)));

  const selectedItem = state.pretul.items.find((item) => item.id === roundState.selectedItemId);
  if (selectedItem && roundState.realPrice === 0 && selectedItem.referencePrice > 0) {
    roundState.realPrice = selectedItem.referencePrice;
  }

  elements.pretulItemSelect.innerHTML = state.pretul.items
    .map((item) => {
      const isUsed = roundState.usedItemIds.includes(item.id);
      const isSelected = item.id === roundState.selectedItemId ? "selected" : "";
      const disabled = isUsed ? "disabled" : "";
      return `
        <option value="${item.id}" ${isSelected} ${disabled}>
          ${escapeHtml(item.name)}${isUsed ? " (USED)" : ""}
        </option>
      `;
    })
    .join("");

  elements.pretulAnswerTeamAInput.value = String(roundState.answerTeamA);
  elements.pretulAnswerTeamBInput.value = String(roundState.answerTeamB);
  elements.pretulBetTeamAInput.value = String(roundState.betTeamA);
  elements.pretulBetTeamBInput.value = String(roundState.betTeamB);
  elements.pretulRealPriceInput.value = String(roundState.realPrice);
  elements.pretulRoundResult.textContent =
    roundState.lastResult || "PLACEHOLDER: Round result appears here.";
  elements.pretulRuleInfo.textContent =
    `Auto winner = closest answer to real price. Tie when distances are equal. ` +
    `Bet cap is 15%, rounded to ${BET_ROUNDING_STEP}. ` +
    `${teamA.name} max now: ${formatMoney(maxBetA)} | ${teamB.name} max now: ${formatMoney(maxBetB)}.`;

  renderPretulActiveList("teamA", elements.pretulActiveTeamAList);
  renderPretulActiveList("teamB", elements.pretulActiveTeamBList);

  elements.pretulItemsBoard.innerHTML = state.pretul.items
    .map((item) => {
      const isUsed = roundState.usedItemIds.includes(item.id);
      return `
        <article class="pretul-item-card ${isUsed ? "is-used" : ""}">
          <h4>${escapeHtml(item.name)}</h4>
          <p class="muted">Placeholder real price: <strong>${formatMoney(item.referencePrice)}</strong></p>
          <button
            class="pill-btn"
            type="button"
            data-pretul-mark-used="${item.id}"
            ${isUsed ? "disabled" : ""}
          >
            ${isUsed ? "Used" : "Mark used"}
          </button>
        </article>
      `;
    })
    .join("");
}

function setPretulSelectedItem(itemId) {
  const roundState = getOrCreatePretulRoundState();
  if (!state.pretul.items.some((item) => item.id === itemId)) {
    return;
  }
  if (roundState.usedItemIds.includes(itemId)) {
    return;
  }

  roundState.selectedItemId = itemId;
  const selectedItem = state.pretul.items.find((item) => item.id === itemId);
  if (selectedItem && roundState.realPrice === 0) {
    roundState.realPrice = selectedItem.referencePrice;
  }

  renderPretulControls();
  saveState("Pretul item selected.");
}

function updatePretulRoundInputs() {
  const roundState = getOrCreatePretulRoundState();
  const teamA = state.teams.teamA;
  const teamB = state.teams.teamB;
  const maxBetA = getMaxBetAmount(teamA.money, "pretul-corect");
  const maxBetB = getMaxBetAmount(teamB.money, "pretul-corect");

  roundState.answerTeamA = Math.max(0, Math.round(sanitizeNumber(elements.pretulAnswerTeamAInput.value, roundState.answerTeamA)));
  roundState.answerTeamB = Math.max(0, Math.round(sanitizeNumber(elements.pretulAnswerTeamBInput.value, roundState.answerTeamB)));
  roundState.realPrice = Math.max(0, Math.round(sanitizeNumber(elements.pretulRealPriceInput.value, roundState.realPrice)));
  roundState.betTeamA = maxBetA <= 0 ? 0 : Math.min(normalizeBetAmount(elements.pretulBetTeamAInput.value), maxBetA);
  roundState.betTeamB = maxBetB <= 0 ? 0 : Math.min(normalizeBetAmount(elements.pretulBetTeamBInput.value), maxBetB);
}

function markPretulItemUsed(itemId) {
  const roundState = getOrCreatePretulRoundState();
  if (!state.pretul.items.some((item) => item.id === itemId)) {
    return;
  }
  if (!roundState.usedItemIds.includes(itemId)) {
    roundState.usedItemIds.push(itemId);
  }
  if (roundState.selectedItemId === itemId) {
    const firstAvailable = state.pretul.items.find((item) => !roundState.usedItemIds.includes(item.id));
    roundState.selectedItemId = firstAvailable?.id || "";
  }
  renderPretulControls();
  saveState("Pretul item marked used.");
}

function resetPretulUsedItems() {
  const roundState = getOrCreatePretulRoundState();
  roundState.usedItemIds = [];
  roundState.selectedItemId = state.pretul.items[0]?.id || "";
  roundState.lastResult = "";
  renderPretulControls();
  setLastResultSummary("Pretul corect used items reset for current round.");
  saveState("Pretul items reset.");
}

function clearPretulActiveTeam(teamKey) {
  if (state.roundSelection.locked) {
    setLastResultSummary("Round selection is locked. Unlock to clear active players.");
    saveState("Pretul clear active blocked while locked.");
    return;
  }

  state.roundSelection.activeByTeam[teamKey] = [];
  if (state.roundSelection.jokerAssignment === teamKey) {
    state.roundSelection.jokerAssignment = "out";
  }
  saveCurrentRoundSnapshot();
  renderRoundSelection();
  renderPretulControls();
  setLastResultSummary(`Cleared active players for ${state.teams[teamKey].name}.`);
  saveState("Pretul active players cleared.");
}

function applyPretulRoundResult() {
  if (state.progress.currentGame !== "pretul-corect") {
    switchRoundContext("pretul-corect", state.progress.currentRound, { navigateToSection: false });
  }

  const roundState = getOrCreatePretulRoundState();
  updatePretulRoundInputs();

  const selectedItemId = roundState.selectedItemId;
  if (!selectedItemId) {
    roundState.lastResult = "No available item left. Reset used items or add new placeholders.";
    renderPretulControls();
    setLastResultSummary(roundState.lastResult);
    saveState("Pretul evaluate blocked: no item.");
    return;
  }

  const answerA = roundState.answerTeamA;
  const answerB = roundState.answerTeamB;
  const realPrice = roundState.realPrice;
  const distanceA = Math.abs(answerA - realPrice);
  const distanceB = Math.abs(answerB - realPrice);
  const maxBetA = getMaxBetAmount(state.teams.teamA.money, "pretul-corect");
  const maxBetB = getMaxBetAmount(state.teams.teamB.money, "pretul-corect");
  const betA = Math.min(roundState.betTeamA, maxBetA);
  const betB = Math.min(roundState.betTeamB, maxBetB);

  roundState.betTeamA = betA;
  roundState.betTeamB = betB;

  const item = state.pretul.items.find((entry) => entry.id === selectedItemId);
  const itemLabel = item?.name || "selected item";
  let resultText = "";
  let winnerTeam = "draw";
  let deltaA = 0;
  let deltaB = 0;
  pushResultUndoSnapshot("Pretul corect round result");

  if (distanceA === distanceB) {
    resultText =
      `Tie on ${itemLabel}: ${state.teams.teamA.name} and ${state.teams.teamB.name} are both ` +
      `${formatMoney(distanceA)} away from ${formatMoney(realPrice)}. No payout applied.`;
  } else if (distanceA < distanceB) {
    state.teams.teamA.money += betA;
    state.teams.teamB.money = Math.max(0, state.teams.teamB.money - betB);
    winnerTeam = "teamA";
    deltaA = betA;
    deltaB = -betB;
    resultText =
      `${state.teams.teamA.name} wins ${itemLabel}: distance ${formatMoney(distanceA)} vs ${formatMoney(distanceB)}. ` +
      `${state.teams.teamA.name} +${formatMoney(betA)}, ${state.teams.teamB.name} -${formatMoney(betB)}.`;
  } else {
    state.teams.teamB.money += betB;
    state.teams.teamA.money = Math.max(0, state.teams.teamA.money - betA);
    winnerTeam = "teamB";
    deltaA = -betA;
    deltaB = betB;
    resultText =
      `${state.teams.teamB.name} wins ${itemLabel}: distance ${formatMoney(distanceB)} vs ${formatMoney(distanceA)}. ` +
      `${state.teams.teamB.name} +${formatMoney(betB)}, ${state.teams.teamA.name} -${formatMoney(betA)}.`;
  }

  const teamAOutcome = getOutcomeForTeamFromWinner(winnerTeam, "teamA");
  const teamBOutcome = getOutcomeForTeamFromWinner(winnerTeam, "teamB");
  const teamABetOutcome = betA > 0 ? teamAOutcome : "draw";
  const teamBBetOutcome = betB > 0 ? teamBOutcome : "draw";
  applyRoundPlayerStats({
    gameId: "pretul-corect",
    teamA: {
      participants: getActiveParticipantsForTeam("teamA"),
      roundOutcome: teamAOutcome,
      teamNetDelta: deltaA,
      teamBetAmount: betA,
      betOutcome: teamABetOutcome
    },
    teamB: {
      participants: getActiveParticipantsForTeam("teamB"),
      roundOutcome: teamBOutcome,
      teamNetDelta: deltaB,
      teamBetAmount: betB,
      betOutcome: teamBBetOutcome
    }
  });

  if (!roundState.usedItemIds.includes(selectedItemId)) {
    roundState.usedItemIds.push(selectedItemId);
  }
  const nextAvailable = state.pretul.items.find((entry) => !roundState.usedItemIds.includes(entry.id));
  roundState.selectedItemId = nextAvailable?.id || "";
  roundState.lastResult = resultText;

  saveCurrentRoundSnapshot();
  setLastResultSummary(resultText);
  renderProgress();
  renderTeams();
  renderBettingInfo();
  renderRoundSelection();
  renderPretulControls();
  saveState("Pretul round evaluated.");
}

function getFilmRoundBreakdown(roundState, betAmount) {
  const points = {
    character: roundState.outcomes.character === "correct" ? FILM_COMPONENT_WEIGHTS.character : 0,
    franchise: roundState.outcomes.franchise === "correct" ? FILM_COMPONENT_WEIGHTS.franchise : 0,
    funFact: roundState.outcomes.funFact === "correct" ? FILM_COMPONENT_WEIGHTS.funFact : 0
  };
  const totalPoints = points.character + points.franchise + points.funFact;
  const maxPoints = FILM_COMPONENT_WEIGHTS.character + FILM_COMPONENT_WEIGHTS.franchise + FILM_COMPONENT_WEIGHTS.funFact;
  const correctCount = FILM_COMPONENT_KEYS.reduce((count, key) => {
    return count + (roundState.outcomes[key] === "correct" ? 1 : 0);
  }, 0);
  const betEligible = correctCount >= 2;
  const componentPayout = Math.max(0, Math.round((betAmount * totalPoints) / maxPoints));
  const betDelta = betEligible ? betAmount : -betAmount;
  const totalDelta = componentPayout + betDelta;

  return {
    points,
    totalPoints,
    maxPoints,
    correctCount,
    betEligible,
    componentPayout,
    betDelta,
    totalDelta
  };
}

function renderFilmOutcomeStatus(element, outcome) {
  if (!element) {
    return;
  }
  if (outcome === "correct") {
    element.textContent = "Status: Correct";
    element.className = "film-status is-correct";
  } else if (outcome === "wrong") {
    element.textContent = "Status: Wrong";
    element.className = "film-status is-wrong";
  } else {
    element.textContent = "Status: not checked";
    element.className = "film-status";
  }
}

function renderFilmControls() {
  if (
    !elements.filmPlayingTeamSelect ||
    !elements.filmRoundSelect ||
    !elements.filmBetAmountInput ||
    !elements.filmRuleInfo ||
    !elements.filmRoundResult ||
    !elements.filmRoundImage ||
    !elements.filmRoundImageCaption ||
    !elements.filmCharacterContent ||
    !elements.filmFranchiseContent ||
    !elements.filmFunFactContent ||
    !elements.filmScoreCharacter ||
    !elements.filmScoreFranchise ||
    !elements.filmScoreFunFact ||
    !elements.filmScoreTotal ||
    !elements.filmCorrectCount ||
    !elements.filmBetEligibility ||
    !elements.filmActiveSelectionInfo ||
    !elements.filmActivePlayingTeamList ||
    !elements.filmClearActiveBtn ||
    !elements.filmRoundsBoard
  ) {
    return;
  }

  const roundState = getOrCreateFilmRoundState();
  const itemIdSet = new Set(state.filmGame.items.map((item) => item.id));
  roundState.usedItemIds = roundState.usedItemIds.filter((id) => itemIdSet.has(id));

  if (!itemIdSet.has(roundState.selectedItemId) || roundState.usedItemIds.includes(roundState.selectedItemId)) {
    const firstAvailable = state.filmGame.items.find((item) => !roundState.usedItemIds.includes(item.id));
    roundState.selectedItemId = firstAvailable?.id || "";
  }

  const playingTeamKey = ["teamA", "teamB"].includes(roundState.teamKey) ? roundState.teamKey : "teamA";
  roundState.teamKey = playingTeamKey;
  const playingTeam = state.teams[playingTeamKey];
  const maxBet = getMaxBetAmount(playingTeam.money, "film-joc-franciza-fun-fact");
  roundState.betAmount = maxBet <= 0 ? 0 : Math.min(normalizeBetAmount(roundState.betAmount), maxBet);

  elements.filmPlayingTeamSelect.options[0].text = state.teams.teamA.name;
  elements.filmPlayingTeamSelect.options[1].text = state.teams.teamB.name;
  elements.filmPlayingTeamSelect.value = playingTeamKey;

  elements.filmRoundSelect.innerHTML = state.filmGame.items
    .map((item) => {
      const isUsed = roundState.usedItemIds.includes(item.id);
      return `
        <option value="${item.id}" ${item.id === roundState.selectedItemId ? "selected" : ""} ${isUsed ? "disabled" : ""}>
          ${escapeHtml(item.title)}${isUsed ? " (USED)" : ""}
        </option>
      `;
    })
    .join("");

  elements.filmBetAmountInput.value = String(roundState.betAmount);

  const selectedItem = state.filmGame.items.find((item) => item.id === roundState.selectedItemId);
  elements.filmRoundImage.src = selectedItem?.imageUrl || FILM_FALLBACK_IMAGE;
  elements.filmRoundImage.alt = selectedItem?.imageAlt || "PLACEHOLDER round image";
  elements.filmRoundImageCaption.textContent =
    selectedItem?.title || "No available round item. Reset used rounds or add new placeholders.";

  elements.filmCharacterContent.textContent =
    selectedItem && roundState.revealed.character
      ? selectedItem.characterPrompt
      : "Hidden. Press reveal when ready.";
  elements.filmFranchiseContent.textContent =
    selectedItem && roundState.revealed.franchise
      ? selectedItem.franchisePrompt
      : "Hidden. Press reveal when ready.";
  elements.filmFunFactContent.textContent =
    selectedItem && roundState.revealed.funFact
      ? selectedItem.funFactPrompt
      : "Hidden. Press reveal when ready.";

  renderFilmOutcomeStatus(elements.filmStatusCharacter, roundState.outcomes.character);
  renderFilmOutcomeStatus(elements.filmStatusFranchise, roundState.outcomes.franchise);
  renderFilmOutcomeStatus(elements.filmStatusFunFact, roundState.outcomes.funFact);

  const breakdown = getFilmRoundBreakdown(roundState, roundState.betAmount);
  const betDeltaLabel = breakdown.betDelta >= 0 ? `+${formatMoney(breakdown.betDelta)}` : `-${formatMoney(Math.abs(breakdown.betDelta))}`;
  const totalDeltaLabel =
    breakdown.totalDelta >= 0 ? `+${formatMoney(breakdown.totalDelta)}` : `-${formatMoney(Math.abs(breakdown.totalDelta))}`;

  elements.filmScoreCharacter.textContent = `${breakdown.points.character} / ${FILM_COMPONENT_WEIGHTS.character}`;
  elements.filmScoreFranchise.textContent = `${breakdown.points.franchise} / ${FILM_COMPONENT_WEIGHTS.franchise}`;
  elements.filmScoreFunFact.textContent = `${breakdown.points.funFact} / ${FILM_COMPONENT_WEIGHTS.funFact}`;
  elements.filmScoreTotal.textContent = `${breakdown.totalPoints} / ${breakdown.maxPoints}`;
  elements.filmCorrectCount.textContent = `${breakdown.correctCount} / 3`;
  elements.filmBetEligibility.textContent = breakdown.betEligible ? "Bet active" : "Bet inactive";
  elements.filmRuleInfo.textContent =
    `Weights: Character/Title x1, Franchise x1, Fun Fact x3. Component payout preview: +${formatMoney(
      breakdown.componentPayout
    )}. Bet preview: ${betDeltaLabel}. Net preview: ${totalDeltaLabel}. ` +
    `Bet cap is 15%, rounded to ${BET_ROUNDING_STEP}. Max now for ${playingTeam.name}: ${formatMoney(maxBet)}.`;
  elements.filmRoundResult.textContent = roundState.lastResult || "PLACEHOLDER: Round result appears here.";

  const activeCount = countActiveWithJoker(playingTeamKey);
  elements.filmActiveSelectionInfo.textContent =
    `${playingTeam.name} is active for this round (${activeCount}/${MAX_ACTIVE_PER_TEAM}). ` +
    `Only this team can be selected while this game is active.`;
  const hasAnyActive =
    state.roundSelection.activeByTeam[playingTeamKey].length > 0 || state.roundSelection.jokerAssignment === playingTeamKey;
  elements.filmClearActiveBtn.disabled = state.roundSelection.locked || !hasAnyActive;

  elements.filmActivePlayingTeamList.innerHTML = playingTeam.players
    .map((player) => {
      const isActive = state.roundSelection.activeByTeam[playingTeamKey].includes(player.id);
      const canToggle = !state.roundSelection.locked && player.status === "available";
      return `
        <label class="film-active-option ${isActive ? "is-active" : ""}">
          <input
            type="checkbox"
            data-film-player-active
            data-team="${playingTeamKey}"
            data-player-id="${player.id}"
            ${isActive ? "checked" : ""}
            ${canToggle ? "" : "disabled"}
          >
          <span>${escapeHtml(player.name)}</span>
          <small>${player.status}</small>
        </label>
      `;
    })
    .join("");

  elements.filmRoundsBoard.innerHTML = state.filmGame.items
    .map((item) => {
      const isUsed = roundState.usedItemIds.includes(item.id);
      return `
        <article class="film-round-item ${isUsed ? "is-used" : ""}">
          <h4>${escapeHtml(item.title)}</h4>
          <button
            class="pill-btn"
            type="button"
            data-film-mark-used="${item.id}"
            ${isUsed ? "disabled" : ""}
          >
            ${isUsed ? "Used" : "Mark used"}
          </button>
        </article>
      `;
    })
    .join("");

  if (elements.filmApplyRoundBtn) {
    elements.filmApplyRoundBtn.disabled = !selectedItem;
  }
}

function setFilmPlayingTeam(teamKey) {
  if (!["teamA", "teamB"].includes(teamKey)) {
    return;
  }

  const roundState = getOrCreateFilmRoundState();
  roundState.teamKey = teamKey;
  enforceFilmRoundTeamRestrictions();
  saveCurrentRoundSnapshot();
  renderRoundSelection();
  renderFilmControls();
  setLastResultSummary(`Film round team set to ${state.teams[teamKey].name}.`);
  saveState("Film round team updated.");
}

function setFilmSelectedItem(itemId) {
  const roundState = getOrCreateFilmRoundState();
  if (!state.filmGame.items.some((item) => item.id === itemId)) {
    return;
  }
  if (roundState.usedItemIds.includes(itemId)) {
    return;
  }

  roundState.selectedItemId = itemId;
  roundState.revealed = {
    character: false,
    franchise: false,
    funFact: false
  };
  roundState.outcomes = {
    character: null,
    franchise: null,
    funFact: null
  };

  renderFilmControls();
  saveState("Film round item selected.");
}

function setFilmBetAmount(rawBetAmount) {
  const roundState = getOrCreateFilmRoundState();
  const maxBet = getMaxBetAmount(state.teams[roundState.teamKey].money, "film-joc-franciza-fun-fact");
  roundState.betAmount = maxBet <= 0 ? 0 : Math.min(normalizeBetAmount(rawBetAmount), maxBet);
  renderFilmControls();
  saveState("Film round bet adjusted.");
}

function toggleFilmReveal(componentKey) {
  if (!FILM_COMPONENT_KEYS.includes(componentKey)) {
    return;
  }
  const roundState = getOrCreateFilmRoundState();
  roundState.revealed[componentKey] = !roundState.revealed[componentKey];
  renderFilmControls();
  saveState("Film component reveal toggled.");
}

function setFilmComponentOutcome(componentKey, nextOutcome) {
  if (!FILM_COMPONENT_KEYS.includes(componentKey)) {
    return;
  }
  if (!["correct", "wrong", null].includes(nextOutcome)) {
    return;
  }
  const roundState = getOrCreateFilmRoundState();
  roundState.outcomes[componentKey] = nextOutcome;
  renderFilmControls();
  saveState("Film component outcome updated.");
}

function markFilmItemUsed(itemId) {
  const roundState = getOrCreateFilmRoundState();
  if (!state.filmGame.items.some((item) => item.id === itemId)) {
    return;
  }

  if (!roundState.usedItemIds.includes(itemId)) {
    roundState.usedItemIds.push(itemId);
  }
  if (roundState.selectedItemId === itemId) {
    const nextAvailable = state.filmGame.items.find((item) => !roundState.usedItemIds.includes(item.id));
    roundState.selectedItemId = nextAvailable?.id || "";
  }
  renderFilmControls();
  saveState("Film round item marked used.");
}

function resetFilmUsedItems() {
  const roundState = getOrCreateFilmRoundState();
  roundState.usedItemIds = [];
  roundState.selectedItemId = state.filmGame.items[0]?.id || "";
  roundState.revealed = {
    character: false,
    franchise: false,
    funFact: false
  };
  roundState.outcomes = {
    character: null,
    franchise: null,
    funFact: null
  };
  roundState.lastResult = "";
  renderFilmControls();
  setLastResultSummary("Film/Joc/Franciza/Fun Fact used rounds reset for current round.");
  saveState("Film used rounds reset.");
}

function clearFilmActivePlayers() {
  if (state.roundSelection.locked) {
    setLastResultSummary("Round selection is locked. Unlock to clear active players.");
    saveState("Film clear active blocked while locked.");
    return;
  }

  const roundState = getOrCreateFilmRoundState();
  const teamKey = roundState.teamKey;
  state.roundSelection.activeByTeam[teamKey] = [];
  if (state.roundSelection.jokerAssignment === teamKey) {
    state.roundSelection.jokerAssignment = "out";
  }
  saveCurrentRoundSnapshot();
  renderRoundSelection();
  renderFilmControls();
  setLastResultSummary(`Cleared active players for ${state.teams[teamKey].name}.`);
  saveState("Film active players cleared.");
}

function applyFilmRoundResult() {
  if (state.progress.currentGame !== "film-joc-franciza-fun-fact") {
    switchRoundContext("film-joc-franciza-fun-fact", state.progress.currentRound, { navigateToSection: false });
  }

  const roundState = getOrCreateFilmRoundState();
  const selectedItem = state.filmGame.items.find((item) => item.id === roundState.selectedItemId);
  if (!selectedItem) {
    roundState.lastResult = "No available round item. Reset used rounds or add new placeholders.";
    renderFilmControls();
    setLastResultSummary(roundState.lastResult);
    saveState("Film round blocked: no item.");
    return;
  }

  const missingComponents = FILM_COMPONENT_KEYS.filter((key) => roundState.outcomes[key] === null);
  if (missingComponents.length > 0) {
    const missingLabel = missingComponents.join(", ");
    roundState.lastResult = `Mark all components before payout. Missing: ${missingLabel}.`;
    renderFilmControls();
    setLastResultSummary(roundState.lastResult);
    saveState("Film round blocked: incomplete outcomes.");
    return;
  }

  const playingTeam = state.teams[roundState.teamKey];
  const maxBet = getMaxBetAmount(playingTeam.money, "film-joc-franciza-fun-fact");
  if (maxBet <= 0) {
    roundState.lastResult = `${playingTeam.name} cannot place a Film/Joc bet right now (max allowed is 0).`;
    renderFilmControls();
    setLastResultSummary(roundState.lastResult);
    saveState("Film round blocked: bet cap zero.");
    return;
  }

  const effectiveBet = Math.min(roundState.betAmount, maxBet);
  roundState.betAmount = effectiveBet;
  const breakdown = getFilmRoundBreakdown(roundState, effectiveBet);

  pushResultUndoSnapshot("Film/Joc/Franciza/Fun Fact round result");
  const moneyBefore = playingTeam.money;
  playingTeam.money = Math.max(0, playingTeam.money + breakdown.totalDelta);
  const appliedDelta = playingTeam.money - moneyBefore;
  const roundOutcome = appliedDelta > 0 ? "win" : appliedDelta < 0 ? "loss" : "draw";
  const betOutcome = effectiveBet > 0 ? (breakdown.betEligible ? "win" : "loss") : "draw";
  const playingParticipants = getActiveParticipantsForTeam(roundState.teamKey);
  const teamPayload = {
    participants: playingParticipants,
    roundOutcome,
    teamNetDelta: appliedDelta,
    teamBetAmount: effectiveBet,
    betOutcome
  };
  applyRoundPlayerStats({
    gameId: "film-joc-franciza-fun-fact",
    teamA: roundState.teamKey === "teamA" ? teamPayload : null,
    teamB: roundState.teamKey === "teamB" ? teamPayload : null
  });

  if (!roundState.usedItemIds.includes(selectedItem.id)) {
    roundState.usedItemIds.push(selectedItem.id);
  }
  const nextAvailable = state.filmGame.items.find((item) => !roundState.usedItemIds.includes(item.id));
  roundState.selectedItemId = nextAvailable?.id || "";
  roundState.revealed = {
    character: false,
    franchise: false,
    funFact: false
  };
  roundState.outcomes = {
    character: null,
    franchise: null,
    funFact: null
  };

  const componentText = `components ${breakdown.totalPoints}/${breakdown.maxPoints} (correct ${breakdown.correctCount}/3)`;
  const componentPayoutText = `component payout +${formatMoney(breakdown.componentPayout)}`;
  const betResultText = breakdown.betEligible ? `bet +${formatMoney(effectiveBet)} (2/3 rule met)` : `bet -${formatMoney(effectiveBet)} (under 2/3)`;
  const totalText = appliedDelta >= 0 ? `total +${formatMoney(appliedDelta)}` : `total -${formatMoney(Math.abs(appliedDelta))}`;
  roundState.lastResult =
    `${playingTeam.name} on ${selectedItem.title}: ${componentText}; ${componentPayoutText}; ${betResultText}; ${totalText}.`;

  saveCurrentRoundSnapshot();
  setLastResultSummary(roundState.lastResult);
  renderProgress();
  renderTeams();
  renderBettingInfo();
  renderRoundSelection();
  renderFilmControls();
  saveState("Film round payout applied.");
}

function renderSamsarControls() {
  if (
    !elements.samsarRoundBadge ||
    !elements.samsarPersonaTitle ||
    !elements.samsarPersonaRequirements ||
    !elements.samsarPlayerTeamASelect ||
    !elements.samsarPlayerTeamBSelect ||
    !elements.samsarScoreTeamAInput ||
    !elements.samsarScoreTeamBInput ||
    !elements.samsarRuleInfo ||
    !elements.samsarRoundResult
  ) {
    return;
  }

  const roundNumber = getSamsarRoundNumber();
  const roundTemplate = state.samsarGame.roundsData[roundNumber - 1] || {
    personaTitle: "PLACEHOLDER: Persona title",
    personaRequirements: "PLACEHOLDER: Persona requirements"
  };
  const roundState = getOrCreateSamsarRoundState(roundNumber);

  const availableTeamA = state.teams.teamA.players.filter((player) => player.status === "available");
  const availableTeamB = state.teams.teamB.players.filter((player) => player.status === "available");

  if (!availableTeamA.some((player) => player.id === roundState.activePlayerTeamAId)) {
    roundState.activePlayerTeamAId = "";
  }
  if (!availableTeamB.some((player) => player.id === roundState.activePlayerTeamBId)) {
    roundState.activePlayerTeamBId = "";
  }

  elements.samsarRoundBadge.textContent = `Round ${roundNumber} / 6`;
  elements.samsarPersonaTitle.textContent = roundTemplate.personaTitle;
  elements.samsarPersonaRequirements.textContent = roundTemplate.personaRequirements;

  const optionsA = ['<option value="">Select active player</option>']
    .concat(availableTeamA.map((player) => `<option value="${player.id}">${escapeHtml(player.name)}</option>`))
    .join("");
  const optionsB = ['<option value="">Select active player</option>']
    .concat(availableTeamB.map((player) => `<option value="${player.id}">${escapeHtml(player.name)}</option>`))
    .join("");

  elements.samsarPlayerTeamASelect.innerHTML = optionsA;
  elements.samsarPlayerTeamBSelect.innerHTML = optionsB;
  elements.samsarPlayerTeamASelect.value = roundState.activePlayerTeamAId;
  elements.samsarPlayerTeamBSelect.value = roundState.activePlayerTeamBId;
  elements.samsarPlayerTeamASelect.disabled = state.roundSelection.locked;
  elements.samsarPlayerTeamBSelect.disabled = state.roundSelection.locked;

  roundState.scoreTeamA = Math.max(0, Math.round(sanitizeNumber(roundState.scoreTeamA, 0)));
  roundState.scoreTeamB = Math.max(0, Math.round(sanitizeNumber(roundState.scoreTeamB, 0)));
  elements.samsarScoreTeamAInput.value = String(roundState.scoreTeamA);
  elements.samsarScoreTeamBInput.value = String(roundState.scoreTeamB);

  const maxBetA = getMaxBetAmount(state.teams.teamA.money, "cel-mai-bun-samsar");
  const maxBetB = getMaxBetAmount(state.teams.teamB.money, "cel-mai-bun-samsar");
  const stakeA = maxBetA <= 0 ? 0 : Math.min(SAMSAR_STANDARD_BET, maxBetA);
  const stakeB = maxBetB <= 0 ? 0 : Math.min(SAMSAR_STANDARD_BET, maxBetB);
  elements.samsarRuleInfo.textContent =
    `Rule: higher score wins, equal score is draw. Standard Samsar payout uses base ${formatMoney(
      SAMSAR_STANDARD_BET
    )}, capped at 20% per team. ` +
    `${state.teams.teamA.name} stake now: ${formatMoney(stakeA)} | ${state.teams.teamB.name} stake now: ${formatMoney(stakeB)}.`;
  elements.samsarRoundResult.textContent = roundState.lastResult || "PLACEHOLDER: Round result appears here.";

  if (elements.samsarRoundButtons) {
    elements.samsarRoundButtons.forEach((button) => {
      const buttonRound = Number(button.dataset.samsarRound || "0");
      button.classList.toggle("is-active", buttonRound === roundNumber);
    });
  }
}

function setSamsarActivePlayer(teamKey, playerId) {
  if (!["teamA", "teamB"].includes(teamKey)) {
    return;
  }
  if (state.roundSelection.locked) {
    setLastResultSummary("Round selection is locked. Unlock to change active players.");
    renderSamsarControls();
    saveState("Samsar active player blocked while locked.");
    return;
  }

  const roundState = getOrCreateSamsarRoundState(getSamsarRoundNumber());
  const playerField = teamKey === "teamA" ? "activePlayerTeamAId" : "activePlayerTeamBId";

  if (!playerId) {
    roundState[playerField] = "";
    state.roundSelection.activeByTeam[teamKey] = [];
    saveCurrentRoundSnapshot();
    renderRoundSelection();
    renderSamsarControls();
    saveState("Samsar active player cleared.");
    return;
  }

  const player = state.teams[teamKey].players.find((entry) => entry.id === playerId);
  if (!player || player.status !== "available") {
    setLastResultSummary("Selected player is not available for this round.");
    renderSamsarControls();
    saveState("Samsar active player rejected.");
    return;
  }

  roundState[playerField] = player.id;
  state.roundSelection.activeByTeam[teamKey] = [player.id];
  saveCurrentRoundSnapshot();
  renderRoundSelection();
  renderSamsarControls();
  saveState("Samsar active player updated.");
}

function setSamsarScore(teamKey, rawScore) {
  const roundState = getOrCreateSamsarRoundState(getSamsarRoundNumber());
  const normalizedScore = Math.max(0, Math.round(sanitizeNumber(rawScore, 0)));
  if (teamKey === "teamA") {
    roundState.scoreTeamA = normalizedScore;
  } else if (teamKey === "teamB") {
    roundState.scoreTeamB = normalizedScore;
  } else {
    return;
  }
  renderSamsarControls();
  saveState("Samsar score updated.");
}

function goToSamsarRound(roundNumber) {
  const targetRound = clampNumber(Math.round(sanitizeNumber(roundNumber, 1)), 1, 6);
  switchRoundContext("cel-mai-bun-samsar", targetRound, { navigateToSection: false });
  setLastResultSummary(`Samsar round changed to ${targetRound}.`);
  renderAll();
  saveState(`Samsar round ${targetRound} selected.`);
}

function applySamsarRoundResult() {
  if (state.progress.currentGame !== "cel-mai-bun-samsar") {
    switchRoundContext("cel-mai-bun-samsar", state.progress.currentRound, { navigateToSection: false });
  }

  const roundNumber = getSamsarRoundNumber();
  const roundState = getOrCreateSamsarRoundState(roundNumber);
  roundState.scoreTeamA = Math.max(0, Math.round(sanitizeNumber(elements.samsarScoreTeamAInput.value, roundState.scoreTeamA)));
  roundState.scoreTeamB = Math.max(0, Math.round(sanitizeNumber(elements.samsarScoreTeamBInput.value, roundState.scoreTeamB)));

  const maxBetA = getMaxBetAmount(state.teams.teamA.money, "cel-mai-bun-samsar");
  const maxBetB = getMaxBetAmount(state.teams.teamB.money, "cel-mai-bun-samsar");
  const stakeA = maxBetA <= 0 ? 0 : Math.min(SAMSAR_STANDARD_BET, maxBetA);
  const stakeB = maxBetB <= 0 ? 0 : Math.min(SAMSAR_STANDARD_BET, maxBetB);

  let resultText = "";
  let winnerTeam = "draw";
  let deltaA = 0;
  let deltaB = 0;
  pushResultUndoSnapshot("Cel mai bun samsar round result");

  if (roundState.scoreTeamA > roundState.scoreTeamB) {
    state.teams.teamA.money += stakeA;
    state.teams.teamB.money = Math.max(0, state.teams.teamB.money - stakeB);
    winnerTeam = "teamA";
    deltaA = stakeA;
    deltaB = -stakeB;
    resultText =
      `${state.teams.teamA.name} wins Samsar round ${roundNumber} (${roundState.scoreTeamA} - ${roundState.scoreTeamB}). ` +
      `${state.teams.teamA.name} +${formatMoney(stakeA)}, ${state.teams.teamB.name} -${formatMoney(stakeB)}.`;
  } else if (roundState.scoreTeamB > roundState.scoreTeamA) {
    state.teams.teamB.money += stakeB;
    state.teams.teamA.money = Math.max(0, state.teams.teamA.money - stakeA);
    winnerTeam = "teamB";
    deltaA = -stakeA;
    deltaB = stakeB;
    resultText =
      `${state.teams.teamB.name} wins Samsar round ${roundNumber} (${roundState.scoreTeamB} - ${roundState.scoreTeamA}). ` +
      `${state.teams.teamB.name} +${formatMoney(stakeB)}, ${state.teams.teamA.name} -${formatMoney(stakeA)}.`;
  } else {
    resultText =
      `Samsar round ${roundNumber} is draw (${roundState.scoreTeamA} - ${roundState.scoreTeamB}). ` +
      "No payout applied.";
  }

  const teamAOutcome = getOutcomeForTeamFromWinner(winnerTeam, "teamA");
  const teamBOutcome = getOutcomeForTeamFromWinner(winnerTeam, "teamB");
  const teamABetOutcome = stakeA > 0 ? teamAOutcome : "draw";
  const teamBBetOutcome = stakeB > 0 ? teamBOutcome : "draw";
  applyRoundPlayerStats({
    gameId: "cel-mai-bun-samsar",
    teamA: {
      participants: getActiveParticipantsForTeam("teamA"),
      roundOutcome: teamAOutcome,
      teamNetDelta: deltaA,
      teamBetAmount: stakeA,
      betOutcome: teamABetOutcome
    },
    teamB: {
      participants: getActiveParticipantsForTeam("teamB"),
      roundOutcome: teamBOutcome,
      teamNetDelta: deltaB,
      teamBetAmount: stakeB,
      betOutcome: teamBBetOutcome
    }
  });

  roundState.lastResult = resultText;
  saveCurrentRoundSnapshot();
  setLastResultSummary(resultText);
  renderProgress();
  renderTeams();
  renderBettingInfo();
  renderRoundSelection();
  renderSamsarControls();
  saveState("Samsar round result applied.");
}

function normalizeManualMatchRoundState(gameId, roundState) {
  const maxBetA = getMaxBetAmount(state.teams.teamA.money, gameId);
  const maxBetB = getMaxBetAmount(state.teams.teamB.money, gameId);
  roundState.scoreTeamA = Math.max(0, Math.round(sanitizeNumber(roundState.scoreTeamA, 0)));
  roundState.scoreTeamB = Math.max(0, Math.round(sanitizeNumber(roundState.scoreTeamB, 0)));
  roundState.betTeamA = maxBetA <= 0 ? 0 : Math.min(normalizeBetAmount(roundState.betTeamA), maxBetA);
  roundState.betTeamB = maxBetB <= 0 ? 0 : Math.min(normalizeBetAmount(roundState.betTeamB), maxBetB);
  roundState.shotFake.multiplier = Math.max(0, Math.round(sanitizeNumber(roundState.shotFake.multiplier, 0)));
  roundState.shotFake.manualAdjustTeamA = Math.round(sanitizeNumber(roundState.shotFake.manualAdjustTeamA, 0));
  roundState.shotFake.manualAdjustTeamB = Math.round(sanitizeNumber(roundState.shotFake.manualAdjustTeamB, 0));
  roundState.shotFake.sideBets = roundState.shotFake.sideBets
    .map((sideBet, index) => sanitizeShotFakeSideBet(sideBet, index))
    .slice(0, 20);
  if (roundState.shotFake.sideBets.length === 0) {
    roundState.shotFake.sideBets = [{ ...DEFAULT_MANUAL_SIDEBET, id: makeSideBetId() }];
  }
}

function calculateManualMatchSettlement(gameId, roundState) {
  const normalizedRoundState = sanitizeManualMatchRoundState(roundState);
  normalizeManualMatchRoundState(gameId, normalizedRoundState);

  const maxBetA = getMaxBetAmount(state.teams.teamA.money, gameId);
  const maxBetB = getMaxBetAmount(state.teams.teamB.money, gameId);
  const effectiveBetA = Math.min(normalizedRoundState.betTeamA, maxBetA);
  const effectiveBetB = Math.min(normalizedRoundState.betTeamB, maxBetB);

  let winner = "draw";
  if (normalizedRoundState.scoreTeamA > normalizedRoundState.scoreTeamB) {
    winner = "teamA";
  } else if (normalizedRoundState.scoreTeamB > normalizedRoundState.scoreTeamA) {
    winner = "teamB";
  }

  let simulatedMoneyA = state.teams.teamA.money;
  let simulatedMoneyB = state.teams.teamB.money;
  let deltaA = 0;
  let deltaB = 0;

  const addToTeam = (teamKey, amount) => {
    const safeAmount = Math.max(0, Math.round(sanitizeNumber(amount, 0)));
    if (safeAmount <= 0) {
      return 0;
    }
    if (teamKey === "teamA") {
      simulatedMoneyA += safeAmount;
      deltaA += safeAmount;
    } else {
      simulatedMoneyB += safeAmount;
      deltaB += safeAmount;
    }
    return safeAmount;
  };

  const deductFromTeam = (teamKey, amount) => {
    const safeAmount = Math.max(0, Math.round(sanitizeNumber(amount, 0)));
    if (safeAmount <= 0) {
      return 0;
    }
    if (teamKey === "teamA") {
      const paid = Math.min(safeAmount, simulatedMoneyA);
      simulatedMoneyA -= paid;
      deltaA -= paid;
      return paid;
    }
    const paid = Math.min(safeAmount, simulatedMoneyB);
    simulatedMoneyB -= paid;
    deltaB -= paid;
    return paid;
  };

  const transferBetweenTeams = (fromTeamKey, toTeamKey, amount) => {
    const paid = deductFromTeam(fromTeamKey, amount);
    addToTeam(toTeamKey, paid);
    return paid;
  };

  if (winner === "teamA") {
    addToTeam("teamA", effectiveBetA);
    deductFromTeam("teamB", effectiveBetB);
  } else if (winner === "teamB") {
    addToTeam("teamB", effectiveBetB);
    deductFromTeam("teamA", effectiveBetA);
  }

  const activeCountA = countActiveWithJoker("teamA");
  const activeCountB = countActiveWithJoker("teamB");
  let specialTransfer = 0;

  if (gameId === "shot-fake") {
    if (winner === "teamA") {
      const amount = normalizedRoundState.shotFake.multiplier * activeCountA * activeCountB;
      specialTransfer = transferBetweenTeams("teamB", "teamA", amount);
    } else if (winner === "teamB") {
      const amount = normalizedRoundState.shotFake.multiplier * activeCountA * activeCountB;
      specialTransfer = transferBetweenTeams("teamA", "teamB", amount);
    }

    for (const sideBet of normalizedRoundState.shotFake.sideBets) {
      if (sideBet.winner === "teamA") {
        transferBetweenTeams("teamB", "teamA", sideBet.amount);
      } else if (sideBet.winner === "teamB") {
        transferBetweenTeams("teamA", "teamB", sideBet.amount);
      }
    }

    if (normalizedRoundState.shotFake.manualAdjustTeamA >= 0) {
      addToTeam("teamA", normalizedRoundState.shotFake.manualAdjustTeamA);
    } else {
      deductFromTeam("teamA", Math.abs(normalizedRoundState.shotFake.manualAdjustTeamA));
    }
    if (normalizedRoundState.shotFake.manualAdjustTeamB >= 0) {
      addToTeam("teamB", normalizedRoundState.shotFake.manualAdjustTeamB);
    } else {
      deductFromTeam("teamB", Math.abs(normalizedRoundState.shotFake.manualAdjustTeamB));
    }
  }

  return {
    winner,
    maxBetA,
    maxBetB,
    effectiveBetA,
    effectiveBetB,
    activeCountA,
    activeCountB,
    specialTransfer,
    deltaA,
    deltaB,
    roundState: normalizedRoundState
  };
}

function renderManualActiveList(teamKey, container) {
  if (!container) {
    return;
  }
  const team = state.teams[teamKey];
  const activeIds = new Set(state.roundSelection.activeByTeam[teamKey]);
  const isLocked = state.roundSelection.locked;
  const activeCount = countActiveWithJoker(teamKey);

  container.innerHTML = `
    <div class="manual-active-toolbar">
      <p class="muted"><strong>${activeCount}/${MAX_ACTIVE_PER_TEAM}</strong> active</p>
      <button
        class="pill-btn"
        type="button"
        data-manual-clear-team="${teamKey}"
        ${isLocked || activeIds.size === 0 ? "disabled" : ""}
      >
        Deselect all
      </button>
    </div>
    <div class="manual-active-rows">
      ${team.players
        .map((player) => {
          const isActive = activeIds.has(player.id);
          const canToggle = !isLocked && player.status === "available";
          return `
            <label class="manual-active-option ${isActive ? "is-active" : ""}">
              <input
                type="checkbox"
                data-manual-player-active
                data-team="${teamKey}"
                data-player-id="${player.id}"
                ${isActive ? "checked" : ""}
                ${canToggle ? "" : "disabled"}
              >
              <span>${escapeHtml(player.name)}</span>
              <small>${player.status}</small>
            </label>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderShotFakeSideBets(roundState) {
  if (!elements.shotFakeSideBetsList) {
    return;
  }
  elements.shotFakeSideBetsList.innerHTML = roundState.shotFake.sideBets
    .map((sideBet) => {
      return `
        <div class="shot-sidebet-row" data-shot-sidebet-id="${sideBet.id}">
          <input class="text-input" data-shot-sidebet-label value="${escapeHtml(sideBet.label)}">
          <input class="text-input compact-input" data-shot-sidebet-amount type="number" min="0" step="10" value="${sideBet.amount}">
          <select class="text-input" data-shot-sidebet-winner>
            <option value="draw" ${sideBet.winner === "draw" ? "selected" : ""}>Draw / none</option>
            <option value="teamA" ${sideBet.winner === "teamA" ? "selected" : ""}>Team 1 wins side bet</option>
            <option value="teamB" ${sideBet.winner === "teamB" ? "selected" : ""}>Team 2 wins side bet</option>
          </select>
          <button class="pill-btn" type="button" data-shot-sidebet-remove>Remove</button>
        </div>
      `;
    })
    .join("");
}

function renderManualMatchControls() {
  if (
    !elements.manualGameSelect ||
    !elements.manualRoundInput ||
    !elements.manualBetRuleInfo ||
    !elements.manualScoreTeamAInput ||
    !elements.manualScoreTeamBInput ||
    !elements.manualBetTeamAInput ||
    !elements.manualBetTeamBInput ||
    !elements.manualRoundResult
  ) {
    return;
  }

  const gameId = getCurrentManualMatchGame();
  state.manualMatch.selectedGame = gameId;
  const roundNumber = Math.max(1, Math.round(sanitizeNumber(state.progress.currentRound, 1)));
  const roundState = getOrCreateManualMatchRoundState(gameId, roundNumber);
  normalizeManualMatchRoundState(gameId, roundState);
  const settlement = calculateManualMatchSettlement(gameId, roundState);

  elements.manualGameSelect.value = gameId;
  elements.manualRoundInput.value = String(roundNumber);
  elements.manualScoreTeamAInput.value = String(roundState.scoreTeamA);
  elements.manualScoreTeamBInput.value = String(roundState.scoreTeamB);
  elements.manualBetTeamAInput.value = String(settlement.effectiveBetA);
  elements.manualBetTeamBInput.value = String(settlement.effectiveBetB);
  if (gameId === "shot-fake") {
    elements.manualBetRuleInfo.textContent =
      `Shot Fake max bet: Team 1 ${formatMoney(settlement.maxBetA)}, Team 2 ${formatMoney(settlement.maxBetB)}. ` +
      "Draw is allowed. Bet-only mode (no fixed bonus) with base bets + side bets + special x * active opponents transfer.";
  } else {
    elements.manualBetRuleInfo.textContent =
      `${getGameLabel(gameId)} max bet: Team 1 ${formatMoney(settlement.maxBetA)}, Team 2 ${formatMoney(
        settlement.maxBetB
      )}. ` +
      "Draw is allowed. Standard payout applies.";
  }
  elements.manualRoundResult.textContent = roundState.lastResult || "PLACEHOLDER: Round result appears here.";

  renderManualActiveList("teamA", elements.manualActiveTeamAList);
  renderManualActiveList("teamB", elements.manualActiveTeamBList);

  const showShotFake = gameId === "shot-fake";
  if (elements.shotFakePanel) {
    elements.shotFakePanel.style.display = showShotFake ? "block" : "none";
  }

  if (showShotFake) {
    if (elements.shotFakeMultiplierInput) {
      elements.shotFakeMultiplierInput.value = String(roundState.shotFake.multiplier);
    }
    if (elements.shotFakeManualAdjustTeamAInput) {
      elements.shotFakeManualAdjustTeamAInput.value = String(roundState.shotFake.manualAdjustTeamA);
    }
    if (elements.shotFakeManualAdjustTeamBInput) {
      elements.shotFakeManualAdjustTeamBInput.value = String(roundState.shotFake.manualAdjustTeamB);
    }
    renderShotFakeSideBets(roundState);
    if (elements.shotFakeRulePreview) {
      const previewDeltaA = settlement.deltaA >= 0 ? `+${formatMoney(settlement.deltaA)}` : `-${formatMoney(Math.abs(settlement.deltaA))}`;
      const previewDeltaB = settlement.deltaB >= 0 ? `+${formatMoney(settlement.deltaB)}` : `-${formatMoney(Math.abs(settlement.deltaB))}`;
      elements.shotFakeRulePreview.textContent =
        `Special transfer preview: ${formatMoney(settlement.specialTransfer)} based on active counts ` +
        `(${settlement.activeCountA} vs ${settlement.activeCountB}) and x=${roundState.shotFake.multiplier}. ` +
        `Net preview: Team 1 ${previewDeltaA}, Team 2 ${previewDeltaB}.`;
    }
  } else if (elements.shotFakeRulePreview) {
    elements.shotFakeRulePreview.textContent =
      "Shot Fake preview appears when Shot Fake is selected from the game dropdown.";
  }
}

function setManualMatchGame(gameId) {
  if (!isManualMatchGame(gameId)) {
    return;
  }
  state.manualMatch.selectedGame = gameId;
  setCurrentGame(gameId, { keepRound: true, navigateToSection: false });
  renderManualMatchControls();
  saveState(`Manual game changed: ${getGameLabel(gameId)}.`);
}

function setManualMatchRound(rawRoundValue) {
  const roundNumber = Math.max(1, Math.round(sanitizeNumber(rawRoundValue, state.progress.currentRound)));
  const targetGame = getCurrentManualMatchGame();
  if (!isManualMatchGame(state.progress.currentGame)) {
    switchRoundContext(targetGame, roundNumber, { navigateToSection: false });
    setLastResultSummary(`Round set to ${roundNumber} for ${getGameLabel(targetGame)}.`);
    renderAll();
    saveState("Manual round changed.");
    return;
  }
  setCurrentRound(roundNumber);
}

function setManualRoundScore(teamKey, rawScore) {
  const gameId = getCurrentManualMatchGame();
  const roundState = getOrCreateManualMatchRoundState(gameId, state.progress.currentRound);
  const normalized = Math.max(0, Math.round(sanitizeNumber(rawScore, 0)));
  if (teamKey === "teamA") {
    roundState.scoreTeamA = normalized;
  } else if (teamKey === "teamB") {
    roundState.scoreTeamB = normalized;
  } else {
    return;
  }
  renderManualMatchControls();
  saveState("Manual score updated.");
}

function setManualRoundBet(teamKey, rawBet) {
  const gameId = getCurrentManualMatchGame();
  const roundState = getOrCreateManualMatchRoundState(gameId, state.progress.currentRound);
  const maxBet = getMaxBetAmount(state.teams[teamKey].money, gameId);
  const normalized = maxBet <= 0 ? 0 : Math.min(normalizeBetAmount(rawBet), maxBet);
  if (teamKey === "teamA") {
    roundState.betTeamA = normalized;
  } else if (teamKey === "teamB") {
    roundState.betTeamB = normalized;
  } else {
    return;
  }
  renderManualMatchControls();
  saveState("Manual bet updated.");
}

function clearManualActiveTeam(teamKey) {
  if (state.roundSelection.locked) {
    setLastResultSummary("Round selection is locked. Unlock to clear active players.");
    saveState("Manual clear active blocked while locked.");
    return;
  }
  state.roundSelection.activeByTeam[teamKey] = [];
  if (state.roundSelection.jokerAssignment === teamKey) {
    state.roundSelection.jokerAssignment = "out";
  }
  saveCurrentRoundSnapshot();
  renderRoundSelection();
  renderManualMatchControls();
  setLastResultSummary(`Cleared active players for ${state.teams[teamKey].name}.`);
  saveState("Manual active team cleared.");
}

function addShotFakeSideBet() {
  const gameId = getCurrentManualMatchGame();
  if (gameId !== "shot-fake") {
    return;
  }
  const roundState = getOrCreateManualMatchRoundState(gameId, state.progress.currentRound);
  roundState.shotFake.sideBets.push({
    id: makeSideBetId(),
    label: "PLACEHOLDER: Side bet",
    amount: 50,
    winner: "draw"
  });
  renderManualMatchControls();
  saveState("Shot Fake side bet added.");
}

function updateShotFakeSideBet(sideBetId, field, value) {
  const gameId = getCurrentManualMatchGame();
  if (gameId !== "shot-fake") {
    return;
  }
  const roundState = getOrCreateManualMatchRoundState(gameId, state.progress.currentRound);
  const target = roundState.shotFake.sideBets.find((sideBet) => sideBet.id === sideBetId);
  if (!target) {
    return;
  }

  if (field === "label") {
    target.label = String(value || "").trim() || target.label;
  } else if (field === "amount") {
    target.amount = Math.max(0, Math.round(sanitizeNumber(value, target.amount)));
  } else if (field === "winner" && ["teamA", "teamB", "draw"].includes(value)) {
    target.winner = value;
  } else {
    return;
  }

  renderManualMatchControls();
  saveState("Shot Fake side bet updated.");
}

function removeShotFakeSideBet(sideBetId) {
  const gameId = getCurrentManualMatchGame();
  if (gameId !== "shot-fake") {
    return;
  }
  const roundState = getOrCreateManualMatchRoundState(gameId, state.progress.currentRound);
  roundState.shotFake.sideBets = roundState.shotFake.sideBets.filter((sideBet) => sideBet.id !== sideBetId);
  if (roundState.shotFake.sideBets.length === 0) {
    roundState.shotFake.sideBets.push({ ...DEFAULT_MANUAL_SIDEBET, id: makeSideBetId() });
  }
  renderManualMatchControls();
  saveState("Shot Fake side bet removed.");
}

function setShotFakeMultiplier(rawMultiplier) {
  const gameId = getCurrentManualMatchGame();
  if (gameId !== "shot-fake") {
    return;
  }
  const roundState = getOrCreateManualMatchRoundState(gameId, state.progress.currentRound);
  roundState.shotFake.multiplier = Math.max(0, Math.round(sanitizeNumber(rawMultiplier, roundState.shotFake.multiplier)));
  renderManualMatchControls();
  saveState("Shot Fake multiplier updated.");
}

function setShotFakeManualAdjust(teamKey, rawValue) {
  const gameId = getCurrentManualMatchGame();
  if (gameId !== "shot-fake") {
    return;
  }
  const roundState = getOrCreateManualMatchRoundState(gameId, state.progress.currentRound);
  const normalized = Math.round(sanitizeNumber(rawValue, 0));
  if (teamKey === "teamA") {
    roundState.shotFake.manualAdjustTeamA = normalized;
  } else if (teamKey === "teamB") {
    roundState.shotFake.manualAdjustTeamB = normalized;
  } else {
    return;
  }
  renderManualMatchControls();
  saveState("Shot Fake manual adjust updated.");
}

function applyManualMatchRoundResult() {
  const gameId = getCurrentManualMatchGame();
  if (!isManualMatchGame(state.progress.currentGame)) {
    switchRoundContext(gameId, state.progress.currentRound, { navigateToSection: false });
  }
  state.manualMatch.selectedGame = gameId;

  const roundState = getOrCreateManualMatchRoundState(gameId, state.progress.currentRound);
  roundState.scoreTeamA = Math.max(0, Math.round(sanitizeNumber(elements.manualScoreTeamAInput?.value, roundState.scoreTeamA)));
  roundState.scoreTeamB = Math.max(0, Math.round(sanitizeNumber(elements.manualScoreTeamBInput?.value, roundState.scoreTeamB)));
  roundState.betTeamA = normalizeBetAmount(elements.manualBetTeamAInput?.value);
  roundState.betTeamB = normalizeBetAmount(elements.manualBetTeamBInput?.value);

  if (gameId === "shot-fake") {
    roundState.shotFake.multiplier = Math.max(
      0,
      Math.round(sanitizeNumber(elements.shotFakeMultiplierInput?.value, roundState.shotFake.multiplier))
    );
    roundState.shotFake.manualAdjustTeamA = Math.round(
      sanitizeNumber(elements.shotFakeManualAdjustTeamAInput?.value, roundState.shotFake.manualAdjustTeamA)
    );
    roundState.shotFake.manualAdjustTeamB = Math.round(
      sanitizeNumber(elements.shotFakeManualAdjustTeamBInput?.value, roundState.shotFake.manualAdjustTeamB)
    );
  }

  normalizeManualMatchRoundState(gameId, roundState);
  const settlement = calculateManualMatchSettlement(gameId, roundState);

  pushResultUndoSnapshot(`${getGameLabel(gameId)} round result`);
  state.teams.teamA.money = Math.max(0, state.teams.teamA.money + settlement.deltaA);
  state.teams.teamB.money = Math.max(0, state.teams.teamB.money + settlement.deltaB);

  const winnerLabel =
    settlement.winner === "teamA"
      ? `${state.teams.teamA.name} win`
      : settlement.winner === "teamB"
        ? `${state.teams.teamB.name} win`
        : "Draw";
  const deltaLabelA = settlement.deltaA >= 0 ? `+${formatMoney(settlement.deltaA)}` : `-${formatMoney(Math.abs(settlement.deltaA))}`;
  const deltaLabelB = settlement.deltaB >= 0 ? `+${formatMoney(settlement.deltaB)}` : `-${formatMoney(Math.abs(settlement.deltaB))}`;
  const shotFakeSuffix =
    gameId === "shot-fake"
      ? ` Special transfer: ${formatMoney(settlement.specialTransfer)} (${settlement.activeCountA} vs ${settlement.activeCountB} active).`
      : "";

  const teamAOutcome = getOutcomeForTeamFromWinner(settlement.winner, "teamA");
  const teamBOutcome = getOutcomeForTeamFromWinner(settlement.winner, "teamB");
  applyRoundPlayerStats({
    gameId,
    teamA: {
      participants: getActiveParticipantsForTeam("teamA"),
      roundOutcome: teamAOutcome,
      teamNetDelta: settlement.deltaA,
      teamBetAmount: settlement.effectiveBetA,
      betOutcome: settlement.effectiveBetA > 0 ? teamAOutcome : "draw"
    },
    teamB: {
      participants: getActiveParticipantsForTeam("teamB"),
      roundOutcome: teamBOutcome,
      teamNetDelta: settlement.deltaB,
      teamBetAmount: settlement.effectiveBetB,
      betOutcome: settlement.effectiveBetB > 0 ? teamBOutcome : "draw"
    }
  });

  roundState.lastResult =
    `${getGameLabel(gameId)} round ${state.progress.currentRound}: ${winnerLabel} ` +
    `(${roundState.scoreTeamA}-${roundState.scoreTeamB}). Team 1 ${deltaLabelA}, Team 2 ${deltaLabelB}.${shotFakeSuffix}`;

  saveCurrentRoundSnapshot();
  setLastResultSummary(roundState.lastResult);
  renderProgress();
  renderTeams();
  renderBettingInfo();
  renderRoundSelection();
  renderManualMatchControls();
  saveState("Manual match round result applied.");
}

function ensureCurseRoundContext() {
  if (state.progress.currentGame === "curse-de-cai") {
    return;
  }
  switchRoundContext("curse-de-cai", state.progress.currentRound, { navigateToSection: false });
  renderProgress();
  renderRoundSelection();
}

function getCurseTeamBetTotal(roundState, teamKey) {
  const horseIds = state.curseRace.horses.map((horse) => horse.id);
  return horseIds.reduce((sum, horseId) => sum + normalizeOptionalBetAmount(roundState.bets?.[teamKey]?.horseBets?.[horseId]), 0);
}

function getCurseBettorOptions(teamKey) {
  const activeIds = new Set(state.roundSelection.activeByTeam[teamKey]);
  const activePlayers = state.teams[teamKey].players.filter(
    (player) => player.status === "available" && activeIds.has(player.id)
  );
  const fallbackPlayers = state.teams[teamKey].players.filter((player) => player.status === "available");
  const base = (activePlayers.length > 0 ? activePlayers : fallbackPlayers).map((player) => ({
    id: player.id,
    label: player.name
  }));

  if (state.roundSelection.jokerAssignment === teamKey) {
    base.unshift({
      id: "joker",
      label: "Joker Player"
    });
  }

  const seen = new Set();
  return base.filter((option) => {
    if (seen.has(option.id)) {
      return false;
    }
    seen.add(option.id);
    return true;
  });
}

function renderCurseActiveList(teamKey, container) {
  if (!container) {
    return;
  }
  const team = state.teams[teamKey];
  const activeIds = new Set(state.roundSelection.activeByTeam[teamKey]);
  const isLocked = state.roundSelection.locked;
  const activeCount = countActiveWithJoker(teamKey);

  container.innerHTML = `
    <div class="curse-active-toolbar">
      <p class="muted"><strong>${activeCount}/${MAX_ACTIVE_PER_TEAM}</strong> active</p>
      <button
        class="pill-btn"
        type="button"
        data-curse-clear-team="${teamKey}"
        ${isLocked || activeIds.size === 0 ? "disabled" : ""}
      >
        Deselect all
      </button>
    </div>
    <div class="curse-active-rows">
      ${team.players
        .map((player) => {
          const isActive = activeIds.has(player.id);
          const canToggle = !isLocked && player.status === "available";
          return `
            <label class="curse-active-option ${isActive ? "is-active" : ""}">
              <input
                type="checkbox"
                data-curse-player-active
                data-team="${teamKey}"
                data-player-id="${player.id}"
                ${isActive ? "checked" : ""}
                ${canToggle ? "" : "disabled"}
              >
              <span>${escapeHtml(player.name)}</span>
              <small>${player.status}</small>
            </label>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderCurseBettorSelect(teamKey, selectElement, roundState) {
  if (!selectElement || !roundState?.bets?.[teamKey]) {
    return;
  }
  const options = getCurseBettorOptions(teamKey);
  const current = roundState.bets[teamKey].bettorId;
  const isValidCurrent = options.some((option) => option.id === current);
  if (!isValidCurrent) {
    roundState.bets[teamKey].bettorId = "";
  }

  selectElement.innerHTML = `
    <option value="">No bettor principal</option>
    ${options
      .map((option) => `<option value="${option.id}">${escapeHtml(option.label)}</option>`)
      .join("")}
  `;
  selectElement.value = roundState.bets[teamKey].bettorId;
  selectElement.disabled = state.roundSelection.locked;
}

function renderCurseTrackBoard(roundState) {
  if (!elements.curseTrackBoard) {
    return;
  }
  const trackLength = state.curseRace.trackLength;
  elements.curseTrackBoard.innerHTML = state.curseRace.horses
    .map((horse) => {
      const position = Math.max(0, Math.round(roundState.positions?.[horse.id] || 0));
      const capped = Math.min(position, trackLength);
      const percent = trackLength === 0 ? 0 : Math.round((capped / trackLength) * 100);
      const isWinner = roundState.winnerHorseId === horse.id;
      return `
        <article class="curse-lane ${isWinner ? "is-winner" : ""}">
          <div class="curse-lane-head">
            <h4>${escapeHtml(horse.symbol)} ${escapeHtml(horse.name)}</h4>
            <p class="muted">Position ${position}/${trackLength}</p>
          </div>
          <div class="curse-track">
            <div class="curse-track-fill" style="width:${percent}%"></div>
            <span class="curse-track-token" style="left:${percent}%">${escapeHtml(horse.symbol)}</span>
          </div>
          <p class="muted">${escapeHtml(horse.story)}</p>
        </article>
      `;
    })
    .join("");
}

function renderCurseBetBoard(roundState) {
  if (!elements.curseBetBoard) {
    return;
  }
  elements.curseBetBoard.innerHTML = state.curseRace.horses
    .map((horse) => {
      const betA = normalizeOptionalBetAmount(roundState.bets?.teamA?.horseBets?.[horse.id]);
      const betB = normalizeOptionalBetAmount(roundState.bets?.teamB?.horseBets?.[horse.id]);
      return `
        <div class="curse-bet-row">
          <div class="curse-bet-horse">
            <strong>${escapeHtml(horse.symbol)} ${escapeHtml(horse.name)}</strong>
          </div>
          <input
            class="text-input compact-input"
            type="number"
            min="0"
            step="10"
            value="${betA}"
            data-curse-bet-team="teamA"
            data-horse-id="${horse.id}"
          >
          <input
            class="text-input compact-input"
            type="number"
            min="0"
            step="10"
            value="${betB}"
            data-curse-bet-team="teamB"
            data-horse-id="${horse.id}"
          >
        </div>
      `;
    })
    .join("");
}

function renderCurseControls() {
  if (
    !elements.curseRoundInput ||
    !elements.curseRuleInfo ||
    !elements.curseWinnerInfo ||
    !elements.curseMoveHorseSelect ||
    !elements.curseMoveStepsInput ||
    !elements.curseMoveBtn ||
    !elements.curseApplyPayoutBtn ||
    !elements.curseResetRaceBtn ||
    !elements.curseRoundResult
  ) {
    return;
  }

  const roundNumber = Math.max(1, Math.round(sanitizeNumber(state.progress.currentRound, 1)));
  const roundState = getOrCreateCurseRoundState(roundNumber);
  if (!roundState.winnerHorseId) {
    detectCurseWinner(roundState);
  }
  const maxBetA = getMaxBetAmount(state.teams.teamA.money, "curse-de-cai");
  const maxBetB = getMaxBetAmount(state.teams.teamB.money, "curse-de-cai");
  const totalBetA = getCurseTeamBetTotal(roundState, "teamA");
  const totalBetB = getCurseTeamBetTotal(roundState, "teamB");
  const winnerHorse = state.curseRace.horses.find((horse) => horse.id === roundState.winnerHorseId);

  elements.curseRoundInput.value = String(roundNumber);
  elements.curseMoveHorseSelect.innerHTML = state.curseRace.horses
    .map((horse) => `<option value="${horse.id}">${escapeHtml(horse.symbol)} ${escapeHtml(horse.name)}</option>`)
    .join("");
  elements.curseMoveHorseSelect.value =
    state.curseRace.horses.some((horse) => horse.id === roundState.moveHorseId)
      ? roundState.moveHorseId
      : state.curseRace.horses[0]?.id || "";
  roundState.moveHorseId = elements.curseMoveHorseSelect.value;
  elements.curseMoveStepsInput.value = String(roundState.moveSteps);

  const betALabel = totalBetA > maxBetA ? `OVER CAP by ${formatMoney(totalBetA - maxBetA)}` : `${formatMoney(totalBetA)}`;
  const betBLabel = totalBetB > maxBetB ? `OVER CAP by ${formatMoney(totalBetB - maxBetB)}` : `${formatMoney(totalBetB)}`;
  if (elements.curseTeamABetTotal) {
    elements.curseTeamABetTotal.textContent = `${state.teams.teamA.name} total: ${betALabel} / max ${formatMoney(maxBetA)}`;
  }
  if (elements.curseTeamBBetTotal) {
    elements.curseTeamBBetTotal.textContent = `${state.teams.teamB.name} total: ${betBLabel} / max ${formatMoney(maxBetB)}`;
  }

  elements.curseRuleInfo.textContent =
    `No fixed bonus. Multi-bet allowed. Only the winning horse bet pays x${state.curseRace.payoutMultiplier}. ` +
    `All other horse bets are lost. Max bet cap stays 30% per team, rounded to ${BET_ROUNDING_STEP}.`;
  elements.curseWinnerInfo.textContent = winnerHorse
    ? `Winner detected: ${winnerHorse.symbol} ${winnerHorse.name}.`
    : "No winner yet. Move horses using extracted symbol.";
  elements.curseRoundResult.textContent = roundState.lastResult || "PLACEHOLDER: Race result appears here.";

  renderCurseTrackBoard(roundState);
  renderCurseBetBoard(roundState);
  renderCurseActiveList("teamA", elements.curseActiveTeamAList);
  renderCurseActiveList("teamB", elements.curseActiveTeamBList);
  renderCurseBettorSelect("teamA", elements.curseBettorTeamASelect, roundState);
  renderCurseBettorSelect("teamB", elements.curseBettorTeamBSelect, roundState);

  const overCap = totalBetA > maxBetA || totalBetB > maxBetB;
  elements.curseMoveBtn.disabled = Boolean(roundState.winnerHorseId);
  elements.curseApplyPayoutBtn.disabled = !roundState.winnerHorseId || roundState.payoutApplied || overCap;
}

function setCurseRound(rawRoundValue) {
  const roundNumber = Math.max(1, Math.round(sanitizeNumber(rawRoundValue, state.progress.currentRound)));
  if (state.progress.currentGame !== "curse-de-cai") {
    switchRoundContext("curse-de-cai", roundNumber, { navigateToSection: false });
    setLastResultSummary(`Curse de cai round set to ${roundNumber}.`);
    renderAll();
    saveState("Curse round changed.");
    return;
  }
  setCurrentRound(roundNumber);
}

function setCurseMoveHorse(horseId) {
  const roundState = getOrCreateCurseRoundState();
  if (!state.curseRace.horses.some((horse) => horse.id === horseId)) {
    return;
  }
  roundState.moveHorseId = horseId;
  renderCurseControls();
  saveState("Curse move horse selected.");
}

function setCurseMoveSteps(rawSteps) {
  const roundState = getOrCreateCurseRoundState();
  roundState.moveSteps = Math.max(1, Math.round(sanitizeNumber(rawSteps, 1)));
  renderCurseControls();
  saveState("Curse move steps updated.");
}

function setCurseBetAmount(teamKey, horseId, rawAmount) {
  if (!["teamA", "teamB"].includes(teamKey)) {
    return;
  }
  if (!state.curseRace.horses.some((horse) => horse.id === horseId)) {
    return;
  }
  const roundState = getOrCreateCurseRoundState();
  roundState.bets[teamKey].horseBets[horseId] = normalizeOptionalBetAmount(rawAmount);
  renderCurseControls();
  saveState("Curse bet updated.");
}

function setCurseBettor(teamKey, bettorId) {
  if (!["teamA", "teamB"].includes(teamKey)) {
    return;
  }
  const roundState = getOrCreateCurseRoundState();
  const options = getCurseBettorOptions(teamKey);
  const isValid = options.some((option) => option.id === bettorId);
  roundState.bets[teamKey].bettorId = isValid ? bettorId : "";
  renderCurseControls();
  saveState("Curse bettor updated.");
}

function clearCurseActiveTeam(teamKey) {
  if (state.roundSelection.locked) {
    setLastResultSummary("Round selection is locked. Unlock to clear active players.");
    saveState("Curse clear active blocked while locked.");
    return;
  }
  state.roundSelection.activeByTeam[teamKey] = [];
  if (state.roundSelection.jokerAssignment === teamKey) {
    state.roundSelection.jokerAssignment = "out";
  }
  saveCurrentRoundSnapshot();
  renderRoundSelection();
  renderCurseControls();
  setLastResultSummary(`Cleared active players for ${state.teams[teamKey].name}.`);
  saveState("Curse active team cleared.");
}

function detectCurseWinner(roundState, priorityHorseId = "") {
  const finishLine = state.curseRace.trackLength;
  const candidates = state.curseRace.horses
    .map((horse) => ({
      id: horse.id,
      position: Math.max(0, Math.round(roundState.positions?.[horse.id] || 0))
    }))
    .filter((entry) => entry.position >= finishLine);

  if (candidates.length === 0) {
    roundState.winnerHorseId = "";
    return "";
  }

  let winner = candidates[0];
  for (const candidate of candidates.slice(1)) {
    if (candidate.position > winner.position) {
      winner = candidate;
      continue;
    }
    if (candidate.position === winner.position && candidate.id === priorityHorseId) {
      winner = candidate;
    }
  }
  roundState.winnerHorseId = winner.id;
  return winner.id;
}

function moveCurseHorseBySymbol() {
  ensureCurseRoundContext();
  const roundState = getOrCreateCurseRoundState();
  if (roundState.winnerHorseId) {
    setLastResultSummary("Race already has a winner. Use Reset Race for a new run.");
    renderCurseControls();
    saveState("Curse move blocked: race already finished.");
    return;
  }

  const horseId = state.curseRace.horses.some((horse) => horse.id === roundState.moveHorseId)
    ? roundState.moveHorseId
    : state.curseRace.horses[0]?.id || "";
  if (!horseId) {
    return;
  }

  const steps = Math.max(1, Math.round(sanitizeNumber(roundState.moveSteps, 1)));
  roundState.positions[horseId] = Math.max(0, Math.round(sanitizeNumber(roundState.positions[horseId], 0))) + steps;
  const movedPosition = roundState.positions[horseId];
  const pushedBack = [];

  for (const horse of state.curseRace.horses) {
    if (horse.id === horseId) {
      continue;
    }
    const currentPosition = Math.max(0, Math.round(sanitizeNumber(roundState.positions[horse.id], 0)));
    if (currentPosition === movedPosition) {
      roundState.positions[horse.id] = Math.max(0, currentPosition - 1);
      pushedBack.push(horse);
    }
  }

  const winnerId = detectCurseWinner(roundState, horseId);
  const movedHorse = state.curseRace.horses.find((horse) => horse.id === horseId);
  const winnerHorse = state.curseRace.horses.find((horse) => horse.id === winnerId);
  const pushedLabel =
    pushedBack.length > 0
      ? ` Push-back: ${pushedBack.map((horse) => `${horse.symbol} ${horse.name}`).join(", ")} moved back by 1.`
      : "";
  const winnerLabel = winnerHorse ? ` Winner detected: ${winnerHorse.symbol} ${winnerHorse.name}.` : "";

  setLastResultSummary(
    `Moved ${movedHorse?.symbol || ""} ${movedHorse?.name || "horse"} by ${steps}.${pushedLabel}${winnerLabel}`.trim()
  );
  renderCurseControls();
  saveState("Curse horse moved.");
}

function calculateCursePayout(roundState) {
  const winnerHorseId = roundState.winnerHorseId;
  const teamAWinningBet = normalizeOptionalBetAmount(roundState.bets.teamA.horseBets[winnerHorseId]);
  const teamBWinningBet = normalizeOptionalBetAmount(roundState.bets.teamB.horseBets[winnerHorseId]);
  const teamATotalBet = getCurseTeamBetTotal(roundState, "teamA");
  const teamBTotalBet = getCurseTeamBetTotal(roundState, "teamB");
  const multiplier = state.curseRace.payoutMultiplier;

  const payoutA = teamAWinningBet * multiplier;
  const payoutB = teamBWinningBet * multiplier;
  const netA = payoutA - teamATotalBet;
  const netB = payoutB - teamBTotalBet;

  return {
    winnerHorseId,
    teamATotalBet,
    teamBTotalBet,
    teamAWinningBet,
    teamBWinningBet,
    payoutA,
    payoutB,
    netA,
    netB
  };
}

function applyCurseRacePayout() {
  ensureCurseRoundContext();
  const roundState = getOrCreateCurseRoundState();
  if (!roundState.winnerHorseId) {
    setLastResultSummary("No winner detected yet. Move horses first.");
    renderCurseControls();
    saveState("Curse payout blocked: no winner.");
    return;
  }
  if (roundState.payoutApplied) {
    setLastResultSummary("Payout already applied for this race.");
    renderCurseControls();
    saveState("Curse payout blocked: already applied.");
    return;
  }

  const maxBetA = getMaxBetAmount(state.teams.teamA.money, "curse-de-cai");
  const maxBetB = getMaxBetAmount(state.teams.teamB.money, "curse-de-cai");
  const totalA = getCurseTeamBetTotal(roundState, "teamA");
  const totalB = getCurseTeamBetTotal(roundState, "teamB");
  if (totalA > maxBetA || totalB > maxBetB) {
    setLastResultSummary("Adjust bets first. One or both teams are above max bet cap.");
    renderCurseControls();
    saveState("Curse payout blocked: over cap.");
    return;
  }

  pushResultUndoSnapshot("Curse de cai payout");
  const settlement = calculateCursePayout(roundState);
  state.teams.teamA.money = Math.max(0, state.teams.teamA.money + settlement.netA);
  state.teams.teamB.money = Math.max(0, state.teams.teamB.money + settlement.netB);

  const teamAOutcome = settlement.netA > settlement.netB ? "win" : settlement.netA < settlement.netB ? "loss" : "draw";
  const teamBOutcome = teamAOutcome === "win" ? "loss" : teamAOutcome === "loss" ? "win" : "draw";
  const teamABetOutcome =
    settlement.teamATotalBet > 0
      ? settlement.teamAWinningBet > 0
        ? "win"
        : "loss"
      : "draw";
  const teamBBetOutcome =
    settlement.teamBTotalBet > 0
      ? settlement.teamBWinningBet > 0
        ? "win"
        : "loss"
      : "draw";
  applyRoundPlayerStats({
    gameId: "curse-de-cai",
    teamA: {
      participants: getActiveParticipantsForTeam("teamA"),
      roundOutcome: teamAOutcome,
      teamNetDelta: settlement.netA,
      teamBetAmount: settlement.teamATotalBet,
      betOutcome: teamABetOutcome
    },
    teamB: {
      participants: getActiveParticipantsForTeam("teamB"),
      roundOutcome: teamBOutcome,
      teamNetDelta: settlement.netB,
      teamBetAmount: settlement.teamBTotalBet,
      betOutcome: teamBBetOutcome
    }
  });

  const winnerHorse = state.curseRace.horses.find((horse) => horse.id === settlement.winnerHorseId);
  const netALabel = settlement.netA >= 0 ? `+${formatMoney(settlement.netA)}` : `-${formatMoney(Math.abs(settlement.netA))}`;
  const netBLabel = settlement.netB >= 0 ? `+${formatMoney(settlement.netB)}` : `-${formatMoney(Math.abs(settlement.netB))}`;
  roundState.payoutApplied = true;
  roundState.lastResult =
    `Curse de cai round ${state.progress.currentRound}: winner ${winnerHorse?.symbol || ""} ${winnerHorse?.name || "Horse"}. ` +
    `${state.teams.teamA.name} net ${netALabel}, ${state.teams.teamB.name} net ${netBLabel}. ` +
    `Only winner-horse bets paid x${state.curseRace.payoutMultiplier}.`;

  saveCurrentRoundSnapshot();
  setLastResultSummary(roundState.lastResult);
  renderTeams();
  renderBettingInfo();
  renderRoundSelection();
  renderCurseControls();
  saveState("Curse payout applied.");
}

function resetCurseRace() {
  ensureCurseRoundContext();
  const roundState = getOrCreateCurseRoundState();
  for (const horse of state.curseRace.horses) {
    roundState.positions[horse.id] = 0;
    roundState.bets.teamA.horseBets[horse.id] = 0;
    roundState.bets.teamB.horseBets[horse.id] = 0;
  }
  roundState.moveHorseId = state.curseRace.horses[0]?.id || "";
  roundState.moveSteps = 1;
  roundState.winnerHorseId = "";
  roundState.payoutApplied = false;
  roundState.bets.teamA.bettorId = "";
  roundState.bets.teamB.bettorId = "";
  roundState.lastResult = "";
  renderCurseControls();
  setLastResultSummary(`Curse race reset for round ${state.progress.currentRound}.`);
  saveState("Curse race reset.");
}

function setTriviaPlayingTeam(teamKey) {
  if (!["teamA", "teamB"].includes(teamKey)) {
    return;
  }
  const triviaRoundState = getOrCreateTriviaRoundState();
  triviaRoundState.teamKey = teamKey;
  enforceTriviaRoundTeamRestrictions();
  saveCurrentRoundSnapshot();
  renderRoundSelection();
  renderTriviaControls();
  setLastResultSummary(`Trivia round team set to ${state.teams[teamKey].name}.`);
  saveState("Trivia team updated.");
}

function setTriviaSelectedCategory(categoryId) {
  const triviaRoundState = getOrCreateTriviaRoundState();
  if (!state.trivia.categories.some((category) => category.id === categoryId)) {
    return;
  }
  if (triviaRoundState.usedCategoryIds.includes(categoryId)) {
    return;
  }
  triviaRoundState.selectedCategoryId = categoryId;
  renderTriviaControls();
  saveState("Trivia category selected.");
}

function markTriviaCategoryUsed(categoryId) {
  const triviaRoundState = getOrCreateTriviaRoundState();
  if (!state.trivia.categories.some((category) => category.id === categoryId)) {
    return;
  }
  if (!triviaRoundState.usedCategoryIds.includes(categoryId)) {
    triviaRoundState.usedCategoryIds.push(categoryId);
  }

  if (triviaRoundState.selectedCategoryId === categoryId) {
    const nextAvailable = state.trivia.categories.find(
      (category) => !triviaRoundState.usedCategoryIds.includes(category.id)
    );
    triviaRoundState.selectedCategoryId = nextAvailable?.id || "";
  }

  renderTriviaControls();
  saveState("Trivia category marked used.");
}

function resetTriviaUsedCategories() {
  const triviaRoundState = getOrCreateTriviaRoundState();
  triviaRoundState.usedCategoryIds = [];
  triviaRoundState.selectedCategoryId = state.trivia.categories[0]?.id || "";
  renderTriviaControls();
  setLastResultSummary("Trivia used categories reset for current round.");
  saveState("Trivia categories reset.");
}

function applyTriviaRoundResult(isCorrect) {
  if (state.progress.currentGame !== "trivia") {
    switchRoundContext("trivia", state.progress.currentRound, { navigateToSection: false });
  }

  const triviaRoundState = getOrCreateTriviaRoundState();
  const playingTeamKey = triviaRoundState.teamKey;
  const playingTeam = state.teams[playingTeamKey];
  const bonus = Math.max(0, Math.round(sanitizeNumber(elements.triviaFixedBonusInput.value, state.trivia.fixedBonus)));
  state.trivia.fixedBonus = bonus;

  const normalizedBet = normalizeBetAmount(elements.triviaBetAmountInput.value);
  const maxAllowedBet = getMaxBetAmount(playingTeam.money, "trivia");
  if (maxAllowedBet <= 0) {
    setLastResultSummary(`${playingTeam.name} cannot place Trivia bet now (max allowed is 0).`);
    renderTriviaControls();
    saveState("Trivia bet blocked.");
    return;
  }

  const effectiveBet = Math.min(normalizedBet, maxAllowedBet);
  elements.triviaBetAmountInput.value = String(effectiveBet);
  const teamDelta = isCorrect ? effectiveBet + bonus : -effectiveBet;
  pushResultUndoSnapshot("Trivia round result");

  const selectedCategoryId = triviaRoundState.selectedCategoryId;
  if (selectedCategoryId && !triviaRoundState.usedCategoryIds.includes(selectedCategoryId)) {
    triviaRoundState.usedCategoryIds.push(selectedCategoryId);
  }

  if (isCorrect) {
    const gain = effectiveBet + bonus;
    playingTeam.money += gain;
    setLastResultSummary(
      `${playingTeam.name} answered Trivia correctly: +${formatMoney(bonus)} bonus +${formatMoney(
        effectiveBet
      )} bet win. Total money ${formatMoney(playingTeam.money)}.`
    );
  } else {
    playingTeam.money = Math.max(0, playingTeam.money - effectiveBet);
    setLastResultSummary(
      `${playingTeam.name} answered Trivia wrong: -${formatMoney(effectiveBet)} bet. ` +
        `Total money ${formatMoney(playingTeam.money)}.`
    );
  }

  applyRoundPlayerStats({
    gameId: "trivia",
    teamA:
      playingTeamKey === "teamA"
        ? {
            participants: getActiveParticipantsForTeam("teamA"),
            roundOutcome: isCorrect ? "win" : "loss",
            teamNetDelta: teamDelta,
            teamBetAmount: effectiveBet,
            betOutcome: isCorrect ? "win" : "loss"
          }
        : null,
    teamB:
      playingTeamKey === "teamB"
        ? {
            participants: getActiveParticipantsForTeam("teamB"),
            roundOutcome: isCorrect ? "win" : "loss",
            teamNetDelta: teamDelta,
            teamBetAmount: effectiveBet,
            betOutcome: isCorrect ? "win" : "loss"
          }
        : null
  });

  const nextAvailable = state.trivia.categories.find(
    (category) => !triviaRoundState.usedCategoryIds.includes(category.id)
  );
  triviaRoundState.selectedCategoryId = nextAvailable?.id || "";

  enforceTriviaRoundTeamRestrictions();
  saveCurrentRoundSnapshot();
  renderTeams();
  renderRoundSelection();
  renderBettingInfo();
  renderTriviaControls();
  saveState(isCorrect ? "Trivia correct payout applied." : "Trivia wrong payout applied.");
}

function computeJokerStats() {
  const snapshots = Object.values(state.roundSelection.history);
  let roundsTeamA = 0;
  let roundsTeamB = 0;
  let roundsOut = 0;

  for (const snapshot of snapshots) {
    if (snapshot.jokerAssignment === "teamA") {
      roundsTeamA += 1;
    } else if (snapshot.jokerAssignment === "teamB") {
      roundsTeamB += 1;
    } else {
      roundsOut += 1;
    }
  }

  return {
    roundsActive: roundsTeamA + roundsTeamB,
    roundsTeamA,
    roundsTeamB,
    roundsOut
  };
}

function getPlayerActiveRounds(teamKey, playerId) {
  let roundsActive = 0;
  for (const snapshot of Object.values(state.roundSelection.history)) {
    if (snapshot.activeByTeam?.[teamKey]?.includes(playerId)) {
      roundsActive += 1;
    }
  }
  return roundsActive;
}

function renderTeamPlayersList(teamKey) {
  const container = teamKey === "teamA" ? elements.teamAPlayersList : elements.teamBPlayersList;
  if (!container) {
    return;
  }

  const isLocked = state.roundSelection.locked;
  const selectedIds = new Set(state.roundSelection.activeByTeam[teamKey]);
  const triviaPlayingTeam = state.progress.currentGame === "trivia" ? getCurrentTriviaTeam() : null;
  const filmPlayingTeam =
    state.progress.currentGame === "film-joc-franciza-fun-fact" ? getCurrentFilmTeam() : null;
  const blockedByGameTeamRule = Boolean(
    (triviaPlayingTeam && triviaPlayingTeam !== teamKey) || (filmPlayingTeam && filmPlayingTeam !== teamKey)
  );

  container.innerHTML = state.teams[teamKey].players
    .map((player) => {
      const isSelected = selectedIds.has(player.id);
      const canBeActive = player.status === "available" && !isLocked && !blockedByGameTeamRule;
      const disabledActive = !canBeActive ? "disabled" : "";
      const disabledEdit = isLocked ? "disabled" : "";
      const roundsActive = getPlayerActiveRounds(teamKey, player.id);
      const stats = getPlayerStatsEntryView(player.id);
      const netLabel = stats.netMoney >= 0 ? `+${formatMoney(stats.netMoney)}` : `-${formatMoney(Math.abs(stats.netMoney))}`;
      const winsPerGameLabel = formatPerGameStatsInline(stats.winsPerGameType);
      const participationsPerGameLabel = formatPerGameStatsInline(stats.participationsPerGameType);
      return `
        <div class="player-row ${isSelected ? "is-active" : ""}" data-team="${teamKey}" data-player-id="${player.id}">
          <input class="text-input player-name-input" data-player-name value="${player.name.replace(/"/g, "&quot;")}" ${disabledEdit}>
          <select class="text-input player-status-select" data-player-status ${disabledEdit}>
            <option value="available" ${player.status === "available" ? "selected" : ""}>Available</option>
            <option value="bench" ${player.status === "bench" ? "selected" : ""}>Bench</option>
            <option value="unavailable" ${player.status === "unavailable" ? "selected" : ""}>Unavailable</option>
          </select>
          <label class="player-active-label">
            <input type="checkbox" data-player-active ${isSelected ? "checked" : ""} ${disabledActive}>
            Active
          </label>
          <p class="muted player-stat">Rounds active: ${roundsActive} | Rounds played: ${stats.roundsPlayed} | Games played: ${stats.gamesPlayed} | W/L: ${stats.roundsWon}/${stats.roundsLost}</p>
          <p class="muted player-stat">Money W/L: ${formatMoney(stats.totalMoneyWon)}/${formatMoney(stats.totalMoneyLost)} | Net: ${netLabel}</p>
          <p class="muted player-stat">Bets total: ${formatMoney(stats.totalBetAmount)} | Bets W/L: ${stats.betsWon}/${stats.betsLost}</p>
          <p class="muted player-stat">Biggest W/L: ${formatMoney(stats.biggestWin)}/${formatMoney(stats.biggestLoss)}</p>
          <p class="muted player-stat">Wins/game: ${winsPerGameLabel}</p>
          <p class="muted player-stat">Participations/game: ${participationsPerGameLabel}</p>
          <button class="pill-btn player-remove-btn" data-player-remove type="button" ${disabledEdit}>Remove</button>
        </div>
      `;
    })
    .join("");
}

function renderRoundSelection() {
  ensureCurrentRoundSelectionValid();

  const lockText = state.roundSelection.locked ? "Selection locked." : "Selection unlocked.";
  if (state.progress.currentGame === "trivia") {
    const triviaTeamName = state.teams[getCurrentTriviaTeam()].name;
    elements.selectionLockStatus.textContent = `${lockText} Trivia active team: ${triviaTeamName}.`;
  } else if (state.progress.currentGame === "film-joc-franciza-fun-fact") {
    const filmTeamName = state.teams[getCurrentFilmTeam()].name;
    elements.selectionLockStatus.textContent = `${lockText} Film/Joc active team: ${filmTeamName}.`;
  } else if (state.progress.currentGame === "cel-mai-bun-samsar") {
    elements.selectionLockStatus.textContent = `${lockText} Samsar uses one active player selector per team.`;
  } else if (isManualMatchGame(state.progress.currentGame)) {
    elements.selectionLockStatus.textContent = `${lockText} Manual Match supports both teams active (max 6 each).`;
  } else if (state.progress.currentGame === "curse-de-cai") {
    elements.selectionLockStatus.textContent = `${lockText} Curse de cai supports both teams active (max 6 each).`;
  } else {
    elements.selectionLockStatus.textContent = lockText;
  }
  elements.lockRoundSelectionBtn.textContent = state.roundSelection.locked
    ? "Unlock round selection"
    : "Lock round selection";
  elements.jokerAssignmentSelect.value = state.roundSelection.jokerAssignment;
  elements.jokerAssignmentSelect.disabled = state.roundSelection.locked;
  elements.clearActiveSelectionBtn.disabled = state.roundSelection.locked;

  const countA = countActiveWithJoker("teamA");
  const countB = countActiveWithJoker("teamB");
  elements.activeCountTeamA.textContent = `${countA}/${MAX_ACTIVE_PER_TEAM}`;
  elements.activeCountTeamB.textContent = `${countB}/${MAX_ACTIVE_PER_TEAM}`;

  renderTeamPlayersList("teamA");
  renderTeamPlayersList("teamB");

  const jokerStats = computeJokerStats();
  elements.jokerRoundsActive.textContent = String(jokerStats.roundsActive);
  elements.jokerRoundsTeamA.textContent = String(jokerStats.roundsTeamA);
  elements.jokerRoundsTeamB.textContent = String(jokerStats.roundsTeamB);
  elements.jokerRoundsOut.textContent = String(jokerStats.roundsOut);
  const jokerPlayerStats = getPlayerStatsEntryView(JOKER_PLAYER_ID);
  const jokerNetLabel =
    jokerPlayerStats.netMoney >= 0
      ? `+${formatMoney(jokerPlayerStats.netMoney)}`
      : `-${formatMoney(Math.abs(jokerPlayerStats.netMoney))}`;
  elements.jokerAwardSummary.textContent =
    `Joker stats: active ${jokerStats.roundsActive} rounds (Team 1: ${jokerStats.roundsTeamA}, ` +
    `Team 2: ${jokerStats.roundsTeamB}, Out: ${jokerStats.roundsOut}). Games played ${jokerPlayerStats.gamesPlayed}. ` +
    `Rounds W/L ${jokerPlayerStats.roundsWon}/${jokerPlayerStats.roundsLost}, money net ${jokerNetLabel}, ` +
    `bets W/L ${jokerPlayerStats.betsWon}/${jokerPlayerStats.betsLost}. Final title stays F1 Gipsy King.`;
  renderAwardsTitles();
}

function renderAll() {
  renderNavigation();
  renderHeaderIdentity();
  renderTeams();
  renderBoundFields();
  renderTimer();
  renderProgress();
  renderBettingInfo();
  renderRoundSelection();
  renderTriviaControls();
  renderPretulControls();
  renderFilmControls();
  renderSamsarControls();
  renderManualMatchControls();
  renderCurseControls();
  renderAwardsTitles();
  renderEndScreen();
  renderSettingsRulesSnapshot();
  renderUndoControlState();
  renderFullscreenToggleLabel();
}
function setActiveSection(sectionId, options = {}) {
  const persist = options.persist !== false;
  if (!SECTION_IDS.includes(sectionId)) {
    return;
  }
  state.activeSection = sectionId;
  renderNavigation();
  if (sectionId === "trivia") {
    renderTriviaControls();
  } else if (sectionId === "pretul-corect") {
    renderPretulControls();
  } else if (sectionId === "film-joc-franciza") {
    renderFilmControls();
  } else if (sectionId === "cel-mai-bun-samsar") {
    renderSamsarControls();
  } else if (sectionId === "manual-match") {
    if (!isManualMatchGame(state.progress.currentGame)) {
      switchRoundContext(getCurrentManualMatchGame(), state.progress.currentRound, { navigateToSection: false });
      renderProgress();
      renderRoundSelection();
    }
    renderManualMatchControls();
  } else if (sectionId === "curse-de-cai") {
    if (state.progress.currentGame !== "curse-de-cai") {
      switchRoundContext("curse-de-cai", state.progress.currentRound, { navigateToSection: false });
      renderProgress();
      renderRoundSelection();
    }
    renderCurseControls();
  } else if (sectionId === "players-teams") {
    renderRoundSelection();
  } else if (sectionId === "awards-final-titles") {
    renderAwardsTitles();
  } else if (sectionId === "end-screen") {
    renderEndScreen();
  } else if (sectionId === "settings") {
    renderSettingsRulesSnapshot();
  }
  if (persist) {
    saveState(`Section: ${sectionId}`);
  }
}

function setLastResultSummary(summaryText) {
  state.progress.lastResultSummary = summaryText;
  renderProgress();
}

function updateTeamMetric(teamKey, metricKey, delta) {
  const team = state.teams[teamKey];
  if (!team || typeof team[metricKey] !== "number") {
    return;
  }

  team[metricKey] = Math.max(0, team[metricKey] + delta);
  renderTeams();
  renderBettingInfo();

  if (metricKey === "money") {
    const absDelta = Math.abs(delta).toLocaleString("en-US");
    const sign = delta >= 0 ? "+" : "-";
    setLastResultSummary(`${team.name} money ${sign}${state.settings.currencySymbol}${absDelta}. Total ${formatMoney(team.money)}.`);
  } else {
    const signed = delta > 0 ? `+${delta}` : `${delta}`;
    setLastResultSummary(`${team.name} score ${signed}. Total ${team.score}.`);
  }

  saveState();
}

function switchRoundContext(nextGameId, nextRound, options = {}) {
  const navigateToSection = options.navigateToSection === true;
  saveCurrentRoundSnapshot();

  state.progress.currentGame = nextGameId;
  state.progress.currentRound = Math.max(1, Math.round(sanitizeNumber(nextRound, 1)));
  state.roundSelection.locked = false;

  loadCurrentRoundSnapshot();

  if (navigateToSection) {
    setActiveSection(getGameSection(nextGameId), { persist: false });
  }
}

function setCurrentGame(gameId, options = {}) {
  if (!GAME_ORDER.includes(gameId)) {
    return;
  }
  if (isManualMatchGame(gameId)) {
    state.manualMatch.selectedGame = gameId;
  }
  const keepRound = options.keepRound === true;
  const nextRound = keepRound ? state.progress.currentRound : 1;
  switchRoundContext(gameId, nextRound, { navigateToSection: options.navigateToSection === true });
  setLastResultSummary(`Current game set to ${getGameLabel(gameId)}.`);
  renderAll();
  saveState(`Current game: ${getGameLabel(gameId)}`);
}

function setCurrentRound(nextRoundValue) {
  const nextRound = Math.max(1, Math.round(sanitizeNumber(nextRoundValue, state.progress.currentRound)));
  switchRoundContext(state.progress.currentGame, nextRound, { navigateToSection: false });
  setLastResultSummary(`Current round set to ${nextRound}.`);
  renderAll();
  saveState(`Current round: ${nextRound}`);
}

function nextGame() {
  const currentIndex = GAME_ORDER.indexOf(state.progress.currentGame);
  const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % GAME_ORDER.length : 0;
  const nextGameId = GAME_ORDER[nextIndex];
  if (isManualMatchGame(nextGameId)) {
    state.manualMatch.selectedGame = nextGameId;
  }
  switchRoundContext(nextGameId, 1, { navigateToSection: true });
  setLastResultSummary(`Moved to ${getGameLabel(nextGameId)}. Round reset to 1.`);
  renderAll();
  saveState(`Next game: ${getGameLabel(nextGameId)}`);
}

function openLeaderboard() {
  setActiveSection("leaderboard", { persist: false });
  setLastResultSummary("Leaderboard opened from Control Center.");
  saveState("Opened leaderboard.");
}

function resetMoney() {
  state.teams.teamA.money = TEAM_START_MONEY;
  state.teams.teamB.money = TEAM_START_MONEY;
  renderTeams();
  renderBettingInfo();
  setLastResultSummary(`Money reset to ${formatMoney(TEAM_START_MONEY)} for both teams.`);
  saveState("Money reset.");
}

function resetCurrentGame() {
  const currentGameId = state.progress.currentGame;
  for (const key of Object.keys(state.roundSelection.history)) {
    if (key.startsWith(`${currentGameId}::`)) {
      delete state.roundSelection.history[key];
    }
  }

  switchRoundContext(currentGameId, 1, { navigateToSection: false });
  setActiveSection("home", { persist: false });
  setLastResultSummary(`Game progress reset for ${getGameLabel(currentGameId)}. Round set to 1.`);
  renderAll();
  saveState("Game progress reset.");
}

function applyBetResult(isWin) {
  const teamKey = elements.betTeamSelect.value;
  const gameId = elements.betGameSelect.value;
  const team = state.teams[teamKey];
  if (!team || !GAME_ORDER.includes(gameId)) {
    return;
  }

  if (gameId === "trivia") {
    setCurrentGame("trivia", { keepRound: true, navigateToSection: false });
    setTriviaPlayingTeam(teamKey);
    if (elements.triviaBetAmountInput) {
      elements.triviaBetAmountInput.value = String(normalizeBetAmount(elements.betAmountInput.value));
    }
    applyTriviaRoundResult(isWin);
    return;
  }

  const roundedAmount = normalizeBetAmount(elements.betAmountInput.value);
  const maxAllowed = getMaxBetAmount(team.money, gameId);
  if (maxAllowed <= 0) {
    setLastResultSummary(`${team.name} cannot place a bet now (max allowed is 0).`);
    renderProgress();
    saveState("Bet blocked.");
    return;
  }

  const betAmount = Math.min(roundedAmount, maxAllowed);
  elements.betAmountInput.value = String(betAmount);

  pushResultUndoSnapshot(`Quick bet ${isWin ? "win" : "loss"} on ${getGameLabel(gameId)}`);
  if (isWin) {
    team.money += betAmount;
  } else {
    team.money = Math.max(0, team.money - betAmount);
  }

  switchRoundContext(gameId, state.progress.currentRound, { navigateToSection: false });
  applyRoundPlayerStats({
    gameId,
    teamA:
      teamKey === "teamA"
        ? {
            participants: getActiveParticipantsForTeam("teamA"),
            roundOutcome: isWin ? "win" : "loss",
            teamNetDelta: isWin ? betAmount : -betAmount,
            teamBetAmount: betAmount,
            betOutcome: isWin ? "win" : "loss"
          }
        : null,
    teamB:
      teamKey === "teamB"
        ? {
            participants: getActiveParticipantsForTeam("teamB"),
            roundOutcome: isWin ? "win" : "loss",
            teamNetDelta: isWin ? betAmount : -betAmount,
            teamBetAmount: betAmount,
            betOutcome: isWin ? "win" : "loss"
          }
        : null
  });
  renderTeams();
  renderBettingInfo();

  const resultLabel = isWin ? "WIN" : "LOSS";
  setLastResultSummary(
    `${team.name} ${resultLabel} bet ${formatMoney(betAmount)} on ${getGameLabel(gameId)}. ` +
      `Money now ${formatMoney(team.money)}.`
  );
  saveState(`Bet ${resultLabel.toLowerCase()} applied.`);
}

function findPlayer(teamKey, playerId) {
  return state.teams[teamKey].players.find((player) => player.id === playerId);
}

function addPlayer(teamKey, inputElement) {
  if (state.roundSelection.locked) {
    setLastResultSummary("Round selection is locked. Unlock to add players.");
    saveState("Add player blocked while locked.");
    return;
  }

  const playerName = inputElement.value.trim();
  if (!playerName) {
    return;
  }

  state.teams[teamKey].players.push({
    id: makePlayerId(teamKey),
    name: playerName,
    status: "available"
  });
  inputElement.value = "";
  renderRoundSelection();
  setLastResultSummary(`Added player ${playerName} to ${state.teams[teamKey].name}.`);
  saveState("Player added.");
}

function removePlayer(teamKey, playerId) {
  if (state.roundSelection.locked) {
    setLastResultSummary("Round selection is locked. Unlock to remove players.");
    saveState("Remove player blocked while locked.");
    return;
  }

  const players = state.teams[teamKey].players;
  const playerIndex = players.findIndex((player) => player.id === playerId);
  if (playerIndex < 0) {
    return;
  }

  const removed = players[playerIndex];
  players.splice(playerIndex, 1);

  state.roundSelection.activeByTeam[teamKey] = state.roundSelection.activeByTeam[teamKey].filter((id) => id !== playerId);
  for (const snapshot of Object.values(state.roundSelection.history)) {
    snapshot.activeByTeam[teamKey] = snapshot.activeByTeam[teamKey].filter((id) => id !== playerId);
  }

  renderRoundSelection();
  setLastResultSummary(`Removed player ${removed.name} from ${state.teams[teamKey].name}.`);
  saveState("Player removed.");
}

function updatePlayerName(teamKey, playerId, newName) {
  const player = findPlayer(teamKey, playerId);
  if (!player) {
    return;
  }
  const safeName = newName.trim();
  if (!safeName) {
    return;
  }
  player.name = safeName;
  renderRoundSelection();
  saveState();
}

function updatePlayerStatus(teamKey, playerId, nextStatus) {
  if (state.roundSelection.locked) {
    setLastResultSummary("Round selection is locked. Unlock to update statuses.");
    saveState("Status change blocked while locked.");
    return;
  }

  if (!["available", "bench", "unavailable"].includes(nextStatus)) {
    return;
  }

  const player = findPlayer(teamKey, playerId);
  if (!player) {
    return;
  }

  player.status = nextStatus;
  if (nextStatus !== "available") {
    state.roundSelection.activeByTeam[teamKey] = state.roundSelection.activeByTeam[teamKey].filter((id) => id !== playerId);
  }

  saveCurrentRoundSnapshot();
  renderRoundSelection();
  setLastResultSummary(`${player.name} status set to ${nextStatus}.`);
  saveState("Player status updated.");
}

function togglePlayerActive(teamKey, playerId, shouldBeActive) {
  if (state.roundSelection.locked) {
    setLastResultSummary("Round selection is locked. Unlock to change active players.");
    saveState("Active toggle blocked while locked.");
    return;
  }

  const player = findPlayer(teamKey, playerId);
  if (!player) {
    return;
  }

  if (state.progress.currentGame === "trivia" && teamKey !== getCurrentTriviaTeam()) {
    setLastResultSummary("In Trivia rounds, only the selected playing team can have active players.");
    renderRoundSelection();
    saveState("Trivia team-only selection enforced.");
    return;
  }

  if (state.progress.currentGame === "film-joc-franciza-fun-fact" && teamKey !== getCurrentFilmTeam()) {
    setLastResultSummary("In Film/Joc rounds, only the selected playing team can have active players.");
    renderRoundSelection();
    renderFilmControls();
    saveState("Film team-only selection enforced.");
    return;
  }

  if (state.progress.currentGame === "cel-mai-bun-samsar") {
    setLastResultSummary("In Cel mai bun samsar, use the per-team active player selectors from that game section.");
    renderRoundSelection();
    renderSamsarControls();
    saveState("Samsar active selection enforced.");
    return;
  }

  const activeIds = state.roundSelection.activeByTeam[teamKey];
  const isAlreadyActive = activeIds.includes(playerId);

  if (shouldBeActive) {
    if (player.status !== "available") {
      setLastResultSummary(`${player.name} is ${player.status} and cannot be active.`);
      renderRoundSelection();
      saveState("Active toggle rejected.");
      return;
    }
    if (!isAlreadyActive) {
      if (countActiveWithJoker(teamKey) >= MAX_ACTIVE_PER_TEAM) {
        setLastResultSummary(`${state.teams[teamKey].name} reached max ${MAX_ACTIVE_PER_TEAM} active players for this round.`);
        renderRoundSelection();
        saveState("Active limit reached.");
        return;
      }
      activeIds.push(playerId);
    }
  } else if (isAlreadyActive) {
    state.roundSelection.activeByTeam[teamKey] = activeIds.filter((id) => id !== playerId);
  }

  saveCurrentRoundSnapshot();
  renderRoundSelection();
  setLastResultSummary(`${player.name} active state updated.`);
  saveState("Active selection updated.");
}

function setJokerAssignment(nextAssignment) {
  if (state.roundSelection.locked) {
    setLastResultSummary("Round selection is locked. Unlock to move Joker Player.");
    saveState("Joker move blocked while locked.");
    return;
  }

  if (!["teamA", "teamB", "out"].includes(nextAssignment)) {
    return;
  }

  if (
    state.progress.currentGame === "trivia" &&
    nextAssignment !== "out" &&
    nextAssignment !== getCurrentTriviaTeam()
  ) {
    setLastResultSummary("In Trivia rounds, Joker can only join the playing team or be out.");
    renderRoundSelection();
    saveState("Trivia Joker restriction enforced.");
    return;
  }

  if (
    state.progress.currentGame === "film-joc-franciza-fun-fact" &&
    nextAssignment !== "out" &&
    nextAssignment !== getCurrentFilmTeam()
  ) {
    setLastResultSummary("In Film/Joc rounds, Joker can only join the playing team or be out.");
    renderRoundSelection();
    renderFilmControls();
    saveState("Film Joker restriction enforced.");
    return;
  }

  if (nextAssignment === "teamA" && state.roundSelection.activeByTeam.teamA.length >= MAX_ACTIVE_PER_TEAM) {
    setLastResultSummary("Cannot move Joker to Team 1: active limit reached.");
    renderRoundSelection();
    saveState("Joker assignment rejected.");
    return;
  }
  if (nextAssignment === "teamB" && state.roundSelection.activeByTeam.teamB.length >= MAX_ACTIVE_PER_TEAM) {
    setLastResultSummary("Cannot move Joker to Team 2: active limit reached.");
    renderRoundSelection();
    saveState("Joker assignment rejected.");
    return;
  }

  state.roundSelection.jokerAssignment = nextAssignment;
  saveCurrentRoundSnapshot();
  renderRoundSelection();
  setLastResultSummary(`Joker Player assignment updated: ${nextAssignment}.`);
  saveState("Joker assignment updated.");
}

function toggleRoundSelectionLock() {
  state.roundSelection.locked = !state.roundSelection.locked;
  if (state.roundSelection.locked) {
    saveCurrentRoundSnapshot();
    setLastResultSummary("Round selection locked.");
    saveState("Round selection locked.");
  } else {
    setLastResultSummary("Round selection unlocked.");
    saveState("Round selection unlocked.");
  }
  renderRoundSelection();
}

function clearActiveSelection() {
  if (state.roundSelection.locked) {
    setLastResultSummary("Round selection is locked. Unlock to clear active players.");
    saveState("Clear active blocked while locked.");
    return;
  }

  state.roundSelection.activeByTeam.teamA = [];
  state.roundSelection.activeByTeam.teamB = [];
  state.roundSelection.jokerAssignment = "out";
  saveCurrentRoundSnapshot();
  renderRoundSelection();
  setLastResultSummary("Active players cleared for both teams. Joker moved out.");
  saveState("Active selection cleared.");
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
  state.timer.lastTickMs += elapsedSeconds * 1000;

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
  lastSavedTimerSecond = state.timer.remaining;

  timerIntervalId = setInterval(() => {
    applyElapsedTime();
    renderTimer();

    if (!state.timer.isRunning) {
      stopTimerLoop();
      saveState("Timer ended.");
      return;
    }

    if (state.timer.remaining !== lastSavedTimerSecond) {
      lastSavedTimerSecond = state.timer.remaining;
      saveState();
    }
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

function updateRoundDuration() {
  const nextDuration = clampNumber(Math.round(sanitizeNumber(elements.roundDuration.value, 60)), 10, 600);
  state.timer.duration = nextDuration;
  state.timer.remaining = nextDuration;
  state.timer.isRunning = false;
  state.timer.lastTickMs = null;
  stopTimerLoop();
  renderTimer();
  saveState("Round duration updated.");
}

function resetSession() {
  const accepted = window.confirm("Reset all dashboard data and restore placeholders?");
  if (!accepted) {
    return;
  }
  stopTimerLoop();
  state = cloneDefaultState();
  resultUndoStack = [];
  loadCurrentRoundSnapshot();
  renderAll();
  setSaveTransferStatus("Session reset. Export/import area cleared.");
  if (elements.saveTransferArea) {
    elements.saveTransferArea.value = "";
  }
  saveState("Session reset to placeholders.");
}

function handleBoundInput(field) {
  const path = field.dataset.bind;
  if (!path) {
    return;
  }

  let value = field.value;
  if (path === "teams.teamA.name") {
    value = value.trim() || "Team 1";
  } else if (path === "teams.teamB.name") {
    value = value.trim() || "Team 2";
  } else if (path === "settings.showTitle") {
    value = value.trim() || DEFAULT_STATE.settings.showTitle;
  } else if (path === "settings.hostName") {
    value = value.trim() || DEFAULT_STATE.settings.hostName;
  } else if (path === "settings.currencySymbol") {
    value = value.trim().slice(0, 3) || "$";
    field.value = value;
  }

  setByPath(state, path, value);

  if (path.startsWith("teams.") || path.startsWith("settings.")) {
    renderHeaderIdentity();
    renderTeams();
    renderRoundSelection();
    renderBettingInfo();
    renderManualMatchControls();
    renderCurseControls();
    renderSettingsRulesSnapshot();
    renderEndScreen();
  } else if (path === "sections.finalTitles") {
    renderEndScreen();
  }

  saveState();
}

function onPlayersListInteraction(event, teamKey) {
  const row = event.target.closest(".player-row");
  if (!row) {
    return;
  }
  const playerId = row.dataset.playerId;
  if (!playerId) {
    return;
  }

  if (event.target.matches("[data-player-name]")) {
    updatePlayerName(teamKey, playerId, event.target.value);
    return;
  }

  if (event.target.matches("[data-player-status]")) {
    updatePlayerStatus(teamKey, playerId, event.target.value);
    return;
  }

  if (event.target.matches("[data-player-active]")) {
    togglePlayerActive(teamKey, playerId, event.target.checked);
    return;
  }

  if (event.target.matches("[data-player-remove]")) {
    removePlayer(teamKey, playerId);
  }
}
function bindEvents() {
  elements.navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setActiveSection(button.dataset.sectionTarget);
    });
  });

  elements.quickOpenSectionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const sectionId = button.dataset.openSection;
      if (!SECTION_IDS.includes(sectionId)) {
        return;
      }
      setActiveSection(sectionId, { persist: false });
      setLastResultSummary(`Opened ${button.textContent?.trim() || sectionId}.`);
      saveState(`Section: ${sectionId}`);
    });
  });

  elements.quickOpenGameButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const gameId = button.dataset.openGame;
      if (!GAME_ORDER.includes(gameId)) {
        return;
      }
      if (isManualMatchGame(gameId)) {
        state.manualMatch.selectedGame = gameId;
      }
      switchRoundContext(gameId, state.progress.currentRound, { navigateToSection: true });
      setLastResultSummary(`Opened ${getGameLabel(gameId)}.`);
      renderAll();
      saveState(`Opened game: ${getGameLabel(gameId)}`);
    });
  });

  elements.metricButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const teamKey = button.dataset.team;
      const metricKey = button.dataset.metric;
      const delta = Number(button.dataset.delta);
      updateTeamMetric(teamKey, metricKey, delta);
    });
  });

  elements.boundFields.forEach((field) => {
    field.addEventListener("input", () => {
      handleBoundInput(field);
    });
  });

  if (elements.currentGameSelect) {
    elements.currentGameSelect.addEventListener("change", () => {
      setCurrentGame(elements.currentGameSelect.value, { keepRound: true, navigateToSection: false });
    });
  }

  if (elements.currentRoundInput) {
    elements.currentRoundInput.addEventListener("change", () => {
      setCurrentRound(elements.currentRoundInput.value);
    });
  }

  if (elements.nextGameBtn) {
    elements.nextGameBtn.addEventListener("click", nextGame);
  }
  if (elements.openLeaderboardBtn) {
    elements.openLeaderboardBtn.addEventListener("click", openLeaderboard);
  }
  if (elements.undoLastResultBtn) {
    elements.undoLastResultBtn.addEventListener("click", undoLastAppliedResult);
  }
  if (elements.resetGameBtn) {
    elements.resetGameBtn.addEventListener("click", resetCurrentGame);
  }
  if (elements.resetMoneyBtn) {
    elements.resetMoneyBtn.addEventListener("click", resetMoney);
  }
  if (elements.fullscreenToggleBtn) {
    elements.fullscreenToggleBtn.addEventListener("click", () => {
      toggleFullscreenMode();
    });
  }
  document.addEventListener("fullscreenchange", renderFullscreenToggleLabel);

  if (elements.betTeamSelect) {
    elements.betTeamSelect.addEventListener("change", renderBettingInfo);
  }
  if (elements.betGameSelect) {
    elements.betGameSelect.addEventListener("change", () => {
      renderBettingInfo();
      setCurrentGame(elements.betGameSelect.value, { keepRound: true, navigateToSection: false });
    });
  }
  if (elements.betAmountInput) {
    elements.betAmountInput.addEventListener("change", renderBettingInfo);
  }
  if (elements.betWinBtn) {
    elements.betWinBtn.addEventListener("click", () => applyBetResult(true));
  }
  if (elements.betLoseBtn) {
    elements.betLoseBtn.addEventListener("click", () => applyBetResult(false));
  }

  if (elements.triviaPlayingTeamSelect) {
    elements.triviaPlayingTeamSelect.addEventListener("change", () => {
      setCurrentGame("trivia", { keepRound: true, navigateToSection: false });
      setTriviaPlayingTeam(elements.triviaPlayingTeamSelect.value);
    });
  }
  if (elements.triviaCategorySelect) {
    elements.triviaCategorySelect.addEventListener("change", () => {
      setTriviaSelectedCategory(elements.triviaCategorySelect.value);
    });
  }
  if (elements.triviaBetAmountInput) {
    elements.triviaBetAmountInput.addEventListener("change", () => {
      elements.triviaBetAmountInput.value = String(normalizeBetAmount(elements.triviaBetAmountInput.value));
      renderTriviaControls();
      saveState("Trivia bet adjusted.");
    });
  }
  if (elements.triviaFixedBonusInput) {
    elements.triviaFixedBonusInput.addEventListener("change", () => {
      state.trivia.fixedBonus = Math.max(0, Math.round(sanitizeNumber(elements.triviaFixedBonusInput.value, 100)));
      renderTriviaControls();
      renderSettingsRulesSnapshot();
      saveState("Trivia bonus updated.");
    });
  }
  if (elements.triviaCorrectBtn) {
    elements.triviaCorrectBtn.addEventListener("click", () => applyTriviaRoundResult(true));
  }
  if (elements.triviaWrongBtn) {
    elements.triviaWrongBtn.addEventListener("click", () => applyTriviaRoundResult(false));
  }
  if (elements.triviaResetUsedBtn) {
    elements.triviaResetUsedBtn.addEventListener("click", resetTriviaUsedCategories);
  }
  if (elements.triviaCategoriesBoard) {
    elements.triviaCategoriesBoard.addEventListener("click", (event) => {
      const button = event.target.closest("[data-trivia-mark-used]");
      if (!button) {
        return;
      }
      const categoryId = button.getAttribute("data-trivia-mark-used");
      markTriviaCategoryUsed(categoryId);
    });
  }

  if (elements.pretulItemSelect) {
    elements.pretulItemSelect.addEventListener("change", () => {
      setPretulSelectedItem(elements.pretulItemSelect.value);
    });
  }
  if (elements.pretulAnswerTeamAInput) {
    elements.pretulAnswerTeamAInput.addEventListener("change", () => {
      updatePretulRoundInputs();
      renderPretulControls();
      saveState("Pretul Team 1 answer updated.");
    });
  }
  if (elements.pretulAnswerTeamBInput) {
    elements.pretulAnswerTeamBInput.addEventListener("change", () => {
      updatePretulRoundInputs();
      renderPretulControls();
      saveState("Pretul Team 2 answer updated.");
    });
  }
  if (elements.pretulBetTeamAInput) {
    elements.pretulBetTeamAInput.addEventListener("change", () => {
      updatePretulRoundInputs();
      renderPretulControls();
      saveState("Pretul Team 1 bet updated.");
    });
  }
  if (elements.pretulBetTeamBInput) {
    elements.pretulBetTeamBInput.addEventListener("change", () => {
      updatePretulRoundInputs();
      renderPretulControls();
      saveState("Pretul Team 2 bet updated.");
    });
  }
  if (elements.pretulRealPriceInput) {
    elements.pretulRealPriceInput.addEventListener("change", () => {
      updatePretulRoundInputs();
      renderPretulControls();
      saveState("Pretul real price updated.");
    });
  }
  if (elements.pretulEvaluateBtn) {
    elements.pretulEvaluateBtn.addEventListener("click", applyPretulRoundResult);
  }
  if (elements.pretulResetUsedBtn) {
    elements.pretulResetUsedBtn.addEventListener("click", resetPretulUsedItems);
  }
  if (elements.pretulItemsBoard) {
    elements.pretulItemsBoard.addEventListener("click", (event) => {
      const button = event.target.closest("[data-pretul-mark-used]");
      if (!button) {
        return;
      }
      const itemId = button.getAttribute("data-pretul-mark-used");
      markPretulItemUsed(itemId);
    });
  }
  if (elements.pretulActiveTeamAList) {
    elements.pretulActiveTeamAList.addEventListener("change", (event) => {
      const checkbox = event.target.closest("[data-pretul-player-active]");
      if (!checkbox) {
        return;
      }
      togglePlayerActive("teamA", checkbox.getAttribute("data-player-id"), checkbox.checked);
      renderPretulControls();
    });
    elements.pretulActiveTeamAList.addEventListener("click", (event) => {
      const clearBtn = event.target.closest("[data-pretul-clear-team]");
      if (!clearBtn) {
        return;
      }
      clearPretulActiveTeam("teamA");
    });
  }
  if (elements.pretulActiveTeamBList) {
    elements.pretulActiveTeamBList.addEventListener("change", (event) => {
      const checkbox = event.target.closest("[data-pretul-player-active]");
      if (!checkbox) {
        return;
      }
      togglePlayerActive("teamB", checkbox.getAttribute("data-player-id"), checkbox.checked);
      renderPretulControls();
    });
    elements.pretulActiveTeamBList.addEventListener("click", (event) => {
      const clearBtn = event.target.closest("[data-pretul-clear-team]");
      if (!clearBtn) {
        return;
      }
      clearPretulActiveTeam("teamB");
    });
  }

  if (elements.filmPlayingTeamSelect) {
    elements.filmPlayingTeamSelect.addEventListener("change", () => {
      setCurrentGame("film-joc-franciza-fun-fact", { keepRound: true, navigateToSection: false });
      setFilmPlayingTeam(elements.filmPlayingTeamSelect.value);
    });
  }
  if (elements.filmRoundSelect) {
    elements.filmRoundSelect.addEventListener("change", () => {
      setFilmSelectedItem(elements.filmRoundSelect.value);
    });
  }
  if (elements.filmBetAmountInput) {
    elements.filmBetAmountInput.addEventListener("change", () => {
      setFilmBetAmount(elements.filmBetAmountInput.value);
    });
  }
  if (elements.filmApplyRoundBtn) {
    elements.filmApplyRoundBtn.addEventListener("click", applyFilmRoundResult);
  }
  if (elements.filmResetUsedBtn) {
    elements.filmResetUsedBtn.addEventListener("click", resetFilmUsedItems);
  }
  if (elements.filmRevealBoard) {
    elements.filmRevealBoard.addEventListener("click", (event) => {
      const revealBtn = event.target.closest("[data-film-reveal]");
      if (revealBtn) {
        toggleFilmReveal(revealBtn.getAttribute("data-film-reveal"));
        return;
      }

      const outcomeBtn = event.target.closest("[data-film-set-outcome]");
      if (!outcomeBtn) {
        return;
      }
      const value = outcomeBtn.getAttribute("data-film-set-outcome") || "";
      const [componentKey, outcomeRaw] = value.split(":");
      if (!FILM_COMPONENT_KEYS.includes(componentKey)) {
        return;
      }
      const nextOutcome = outcomeRaw === "clear" ? null : outcomeRaw;
      if (!["correct", "wrong", null].includes(nextOutcome)) {
        return;
      }
      setFilmComponentOutcome(componentKey, nextOutcome);
    });
  }
  if (elements.filmRoundsBoard) {
    elements.filmRoundsBoard.addEventListener("click", (event) => {
      const button = event.target.closest("[data-film-mark-used]");
      if (!button) {
        return;
      }
      markFilmItemUsed(button.getAttribute("data-film-mark-used"));
    });
  }
  if (elements.filmActivePlayingTeamList) {
    elements.filmActivePlayingTeamList.addEventListener("change", (event) => {
      const checkbox = event.target.closest("[data-film-player-active]");
      if (!checkbox) {
        return;
      }
      const teamKey = checkbox.getAttribute("data-team");
      const playerId = checkbox.getAttribute("data-player-id");
      if (!["teamA", "teamB"].includes(teamKey) || !playerId) {
        return;
      }
      togglePlayerActive(teamKey, playerId, checkbox.checked);
      renderFilmControls();
    });
  }
  if (elements.filmClearActiveBtn) {
    elements.filmClearActiveBtn.addEventListener("click", clearFilmActivePlayers);
  }

  if (elements.manualGameSelect) {
    elements.manualGameSelect.addEventListener("change", () => {
      setManualMatchGame(elements.manualGameSelect.value);
    });
  }
  if (elements.manualRoundInput) {
    elements.manualRoundInput.addEventListener("change", () => {
      setManualMatchRound(elements.manualRoundInput.value);
    });
  }
  if (elements.manualScoreTeamAInput) {
    elements.manualScoreTeamAInput.addEventListener("change", () => {
      setManualRoundScore("teamA", elements.manualScoreTeamAInput.value);
    });
  }
  if (elements.manualScoreTeamBInput) {
    elements.manualScoreTeamBInput.addEventListener("change", () => {
      setManualRoundScore("teamB", elements.manualScoreTeamBInput.value);
    });
  }
  if (elements.manualBetTeamAInput) {
    elements.manualBetTeamAInput.addEventListener("change", () => {
      setManualRoundBet("teamA", elements.manualBetTeamAInput.value);
    });
  }
  if (elements.manualBetTeamBInput) {
    elements.manualBetTeamBInput.addEventListener("change", () => {
      setManualRoundBet("teamB", elements.manualBetTeamBInput.value);
    });
  }
  if (elements.manualApplyResultBtn) {
    elements.manualApplyResultBtn.addEventListener("click", applyManualMatchRoundResult);
  }
  if (elements.manualActiveTeamAList) {
    elements.manualActiveTeamAList.addEventListener("change", (event) => {
      const checkbox = event.target.closest("[data-manual-player-active]");
      if (!checkbox) {
        return;
      }
      const playerId = checkbox.getAttribute("data-player-id");
      togglePlayerActive("teamA", playerId, checkbox.checked);
      renderManualMatchControls();
    });
    elements.manualActiveTeamAList.addEventListener("click", (event) => {
      const clearBtn = event.target.closest("[data-manual-clear-team]");
      if (!clearBtn) {
        return;
      }
      clearManualActiveTeam("teamA");
    });
  }
  if (elements.manualActiveTeamBList) {
    elements.manualActiveTeamBList.addEventListener("change", (event) => {
      const checkbox = event.target.closest("[data-manual-player-active]");
      if (!checkbox) {
        return;
      }
      const playerId = checkbox.getAttribute("data-player-id");
      togglePlayerActive("teamB", playerId, checkbox.checked);
      renderManualMatchControls();
    });
    elements.manualActiveTeamBList.addEventListener("click", (event) => {
      const clearBtn = event.target.closest("[data-manual-clear-team]");
      if (!clearBtn) {
        return;
      }
      clearManualActiveTeam("teamB");
    });
  }
  if (elements.shotFakeMultiplierInput) {
    elements.shotFakeMultiplierInput.addEventListener("change", () => {
      setShotFakeMultiplier(elements.shotFakeMultiplierInput.value);
    });
  }
  if (elements.shotFakeManualAdjustTeamAInput) {
    elements.shotFakeManualAdjustTeamAInput.addEventListener("change", () => {
      setShotFakeManualAdjust("teamA", elements.shotFakeManualAdjustTeamAInput.value);
    });
  }
  if (elements.shotFakeManualAdjustTeamBInput) {
    elements.shotFakeManualAdjustTeamBInput.addEventListener("change", () => {
      setShotFakeManualAdjust("teamB", elements.shotFakeManualAdjustTeamBInput.value);
    });
  }
  if (elements.shotFakeAddSideBetBtn) {
    elements.shotFakeAddSideBetBtn.addEventListener("click", addShotFakeSideBet);
  }
  if (elements.shotFakeSideBetsList) {
    elements.shotFakeSideBetsList.addEventListener("change", (event) => {
      const row = event.target.closest("[data-shot-sidebet-id]");
      if (!row) {
        return;
      }
      const sideBetId = row.getAttribute("data-shot-sidebet-id");
      if (event.target.matches("[data-shot-sidebet-label]")) {
        updateShotFakeSideBet(sideBetId, "label", event.target.value);
      } else if (event.target.matches("[data-shot-sidebet-amount]")) {
        updateShotFakeSideBet(sideBetId, "amount", event.target.value);
      } else if (event.target.matches("[data-shot-sidebet-winner]")) {
        updateShotFakeSideBet(sideBetId, "winner", event.target.value);
      }
    });
    elements.shotFakeSideBetsList.addEventListener("click", (event) => {
      const removeBtn = event.target.closest("[data-shot-sidebet-remove]");
      if (!removeBtn) {
        return;
      }
      const row = removeBtn.closest("[data-shot-sidebet-id]");
      if (!row) {
        return;
      }
      removeShotFakeSideBet(row.getAttribute("data-shot-sidebet-id"));
    });
  }

  if (elements.curseRoundInput) {
    elements.curseRoundInput.addEventListener("change", () => {
      setCurseRound(elements.curseRoundInput.value);
    });
  }
  if (elements.curseMoveHorseSelect) {
    elements.curseMoveHorseSelect.addEventListener("change", () => {
      setCurseMoveHorse(elements.curseMoveHorseSelect.value);
    });
  }
  if (elements.curseMoveStepsInput) {
    elements.curseMoveStepsInput.addEventListener("change", () => {
      setCurseMoveSteps(elements.curseMoveStepsInput.value);
    });
  }
  if (elements.curseMoveBtn) {
    elements.curseMoveBtn.addEventListener("click", moveCurseHorseBySymbol);
  }
  if (elements.curseApplyPayoutBtn) {
    elements.curseApplyPayoutBtn.addEventListener("click", applyCurseRacePayout);
  }
  if (elements.curseResetRaceBtn) {
    elements.curseResetRaceBtn.addEventListener("click", resetCurseRace);
  }
  if (elements.curseBetBoard) {
    elements.curseBetBoard.addEventListener("change", (event) => {
      const input = event.target.closest("[data-curse-bet-team][data-horse-id]");
      if (!input) {
        return;
      }
      const teamKey = input.getAttribute("data-curse-bet-team");
      const horseId = input.getAttribute("data-horse-id");
      setCurseBetAmount(teamKey, horseId, input.value);
    });
  }
  if (elements.curseBettorTeamASelect) {
    elements.curseBettorTeamASelect.addEventListener("change", () => {
      setCurseBettor("teamA", elements.curseBettorTeamASelect.value);
    });
  }
  if (elements.curseBettorTeamBSelect) {
    elements.curseBettorTeamBSelect.addEventListener("change", () => {
      setCurseBettor("teamB", elements.curseBettorTeamBSelect.value);
    });
  }
  if (elements.curseActiveTeamAList) {
    elements.curseActiveTeamAList.addEventListener("change", (event) => {
      const checkbox = event.target.closest("[data-curse-player-active]");
      if (!checkbox) {
        return;
      }
      ensureCurseRoundContext();
      togglePlayerActive("teamA", checkbox.getAttribute("data-player-id"), checkbox.checked);
      renderCurseControls();
    });
    elements.curseActiveTeamAList.addEventListener("click", (event) => {
      const clearBtn = event.target.closest("[data-curse-clear-team]");
      if (!clearBtn) {
        return;
      }
      clearCurseActiveTeam("teamA");
    });
  }
  if (elements.curseActiveTeamBList) {
    elements.curseActiveTeamBList.addEventListener("change", (event) => {
      const checkbox = event.target.closest("[data-curse-player-active]");
      if (!checkbox) {
        return;
      }
      ensureCurseRoundContext();
      togglePlayerActive("teamB", checkbox.getAttribute("data-player-id"), checkbox.checked);
      renderCurseControls();
    });
    elements.curseActiveTeamBList.addEventListener("click", (event) => {
      const clearBtn = event.target.closest("[data-curse-clear-team]");
      if (!clearBtn) {
        return;
      }
      clearCurseActiveTeam("teamB");
    });
  }

  if (elements.samsarPlayerTeamASelect) {
    elements.samsarPlayerTeamASelect.addEventListener("change", () => {
      setCurrentGame("cel-mai-bun-samsar", { keepRound: true, navigateToSection: false });
      setSamsarActivePlayer("teamA", elements.samsarPlayerTeamASelect.value);
    });
  }
  if (elements.samsarPlayerTeamBSelect) {
    elements.samsarPlayerTeamBSelect.addEventListener("change", () => {
      setCurrentGame("cel-mai-bun-samsar", { keepRound: true, navigateToSection: false });
      setSamsarActivePlayer("teamB", elements.samsarPlayerTeamBSelect.value);
    });
  }
  if (elements.samsarScoreTeamAInput) {
    elements.samsarScoreTeamAInput.addEventListener("change", () => {
      setSamsarScore("teamA", elements.samsarScoreTeamAInput.value);
    });
  }
  if (elements.samsarScoreTeamBInput) {
    elements.samsarScoreTeamBInput.addEventListener("change", () => {
      setSamsarScore("teamB", elements.samsarScoreTeamBInput.value);
    });
  }
  if (elements.samsarApplyResultBtn) {
    elements.samsarApplyResultBtn.addEventListener("click", applySamsarRoundResult);
  }
  if (elements.samsarRoundButtons) {
    elements.samsarRoundButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const roundNumber = Number(button.dataset.samsarRound || "1");
        goToSamsarRound(roundNumber);
      });
    });
  }

  if (elements.jokerAssignmentSelect) {
    elements.jokerAssignmentSelect.addEventListener("change", () => {
      setJokerAssignment(elements.jokerAssignmentSelect.value);
    });
  }
  if (elements.lockRoundSelectionBtn) {
    elements.lockRoundSelectionBtn.addEventListener("click", toggleRoundSelectionLock);
  }
  if (elements.clearActiveSelectionBtn) {
    elements.clearActiveSelectionBtn.addEventListener("click", clearActiveSelection);
  }

  if (elements.addPlayerTeamABtn) {
    elements.addPlayerTeamABtn.addEventListener("click", () => addPlayer("teamA", elements.addPlayerTeamAInput));
  }
  if (elements.addPlayerTeamBBtn) {
    elements.addPlayerTeamBBtn.addEventListener("click", () => addPlayer("teamB", elements.addPlayerTeamBInput));
  }

  if (elements.addPlayerTeamAInput) {
    elements.addPlayerTeamAInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        addPlayer("teamA", elements.addPlayerTeamAInput);
      }
    });
  }
  if (elements.addPlayerTeamBInput) {
    elements.addPlayerTeamBInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        addPlayer("teamB", elements.addPlayerTeamBInput);
      }
    });
  }

  if (elements.teamAPlayersList) {
    elements.teamAPlayersList.addEventListener("input", (event) => onPlayersListInteraction(event, "teamA"));
    elements.teamAPlayersList.addEventListener("change", (event) => onPlayersListInteraction(event, "teamA"));
    elements.teamAPlayersList.addEventListener("click", (event) => onPlayersListInteraction(event, "teamA"));
  }
  if (elements.teamBPlayersList) {
    elements.teamBPlayersList.addEventListener("input", (event) => onPlayersListInteraction(event, "teamB"));
    elements.teamBPlayersList.addEventListener("change", (event) => onPlayersListInteraction(event, "teamB"));
    elements.teamBPlayersList.addEventListener("click", (event) => onPlayersListInteraction(event, "teamB"));
  }

  elements.roundDuration.addEventListener("change", updateRoundDuration);
  elements.startTimerBtn.addEventListener("click", startTimer);
  elements.pauseTimerBtn.addEventListener("click", pauseTimer);
  elements.resetTimerBtn.addEventListener("click", resetTimer);
  if (elements.refreshAwardsBtn) {
    elements.refreshAwardsBtn.addEventListener("click", () => {
      renderAwardsTitles();
      renderEndScreen();
      saveState("Awards refreshed.");
    });
  }
  if (elements.exportSaveBtn) {
    elements.exportSaveBtn.addEventListener("click", exportSaveData);
  }
  if (elements.importSaveBtn) {
    elements.importSaveBtn.addEventListener("click", handleImportSaveAction);
  }
  if (elements.importSaveFileInput) {
    elements.importSaveFileInput.addEventListener("change", handleImportSaveFileSelection);
  }
  elements.saveNowBtn.addEventListener("click", () => saveState("Saved manually."));
  elements.resetAllBtn.addEventListener("click", resetSession);

  window.addEventListener("beforeunload", () => {
    saveCurrentRoundSnapshot();
    saveState();
  });
}

function init() {
  state = sanitizeState(state);
  if (state.activeSection === "manual-match" && !isManualMatchGame(state.progress.currentGame)) {
    switchRoundContext(getCurrentManualMatchGame(), state.progress.currentRound, { navigateToSection: false });
  } else if (state.activeSection === "curse-de-cai" && state.progress.currentGame !== "curse-de-cai") {
    switchRoundContext("curse-de-cai", state.progress.currentRound, { navigateToSection: false });
  }
  loadCurrentRoundSnapshot();
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
