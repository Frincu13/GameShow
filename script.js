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

const SHOW_SCREEN_IDS = [
  "show-home",
  "game-select",
  "game-intro",
  "roster-management",
  "live-round",
  "reveal-result",
  "end-of-game",
  "leaderboard",
  "end-screen"
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
const GAME_FLOW_DEFINITIONS = {
  trivia: {
    states: [
      {
        id: "topic-select",
        label: "Topic Select",
        description: "Active team picks one topic card.",
        visible: ["active team", "topic tiles", "used topic status"],
        actions: ["select topic"]
      },
      {
        id: "bet-screen",
        label: "Bet Screen",
        description: "Set and confirm bet for the active team.",
        visible: ["selected topic", "max bet", "bet input"],
        actions: ["set bet", "confirm bet"]
      },
      {
        id: "question-screen",
        label: "Question + Answers",
        description: "Question stays visible while timer runs and team locks one answer.",
        visible: ["question prompt", "multiple choice options", "live timer", "confirm answer"],
        actions: ["pick option", "confirm/lock answer"],
        payout: true
      },
      {
        id: "result-screen",
        label: "Result Screen",
        description: "Auto-check answer and show money impact.",
        visible: ["correct/wrong verdict", "money delta", "team total"],
        actions: ["next topic"]
      }
    ],
    payoutStateId: "question-screen",
    roundReturn: "After result, turn switches and flow returns to Topic Select.",
    gameEnd: "Game ends when all topics are used, then returns to Game Select."
  },
  "pretul-corect": {
    states: [
      {
        id: "item-brief",
        label: "Item Brief",
        description: "Select item, set both bets, and prepare both teams.",
        visible: ["item card", "team answers", "team bets", "lineup from Game Intro"],
        actions: ["set item", "set answers", "set bets"]
      },
      {
        id: "estimate-live",
        label: "Estimate Live",
        description: "Collect final estimates and keep timer visible.",
        visible: ["estimate board", "timer", "distance context"],
        actions: ["adjust estimates", "timer control"]
      },
      {
        id: "confirm-winner",
        label: "Confirm Winner",
        description: "Lock answer and run auto winner detection.",
        visible: ["real price", "auto winner preview", "lock answer"],
        actions: ["lock answer", "auto detect winner", "open reveal"],
        payout: true
      }
    ],
    payoutStateId: "confirm-winner",
    roundReturn: "After reveal, use Next round for next item.",
    gameEnd: "Game ends when all configured items are used, then returns to Game Select."
  },
  "film-joc-franciza-fun-fact": {
    states: [
      {
        id: "round-brief",
        label: "Round Brief",
        description: "Choose round image, team, and bet.",
        visible: ["round image", "team in play", "bet", "lineup from Game Intro"],
        actions: ["team select", "set bet"]
      },
      {
        id: "clue-reveal",
        label: "Clue Reveal",
        description: "Reveal Character, Franchise, and Fun Fact cards.",
        visible: ["image", "reveal cards", "component board"],
        actions: ["reveal components", "timer control"]
      },
      {
        id: "component-judge",
        label: "Component Judge",
        description: "Lock answer and score each component.",
        visible: ["component outcomes", "2/3 bet rule", "partial payout preview"],
        actions: ["lock answer", "mark correct/wrong", "apply result", "open reveal"],
        payout: true
      }
    ],
    payoutStateId: "component-judge",
    roundReturn: "After reveal, Next round moves to next image round.",
    gameEnd: "Game ends when all configured rounds are used, then returns to Game Select."
  },
  "cel-mai-bun-samsar": {
    states: [
      {
        id: "persona-brief",
        label: "Persona Brief",
        description: "Present round persona using the confirmed lineup.",
        visible: ["persona card", "lineup snapshot", "round info"],
        actions: ["open substitution if needed"]
      },
      {
        id: "negotiation-live",
        label: "Negotiation Live",
        description: "Teams play the negotiation phase.",
        visible: ["persona requirements", "timer", "active duel"],
        actions: ["timer control", "lock selection"]
      },
      {
        id: "score-judge",
        label: "Score Judge",
        description: "Lock answer and input final scores.",
        visible: ["score inputs", "winner preview", "lock answer"],
        actions: ["lock answer", "apply score result", "open reveal"],
        payout: true
      }
    ],
    payoutStateId: "score-judge",
    roundReturn: "After reveal, Next round moves to next samsar round.",
    gameEnd: "Game ends automatically after round 6, then returns to Game Select."
  },
  "guess-right-order": {
    states: [
      {
        id: "order-brief",
        label: "Order Brief",
        description: "Set matchup and bets for the confirmed game lineup.",
        visible: ["matchup board", "bets", "lineup snapshot"],
        actions: ["set bets"]
      },
      {
        id: "order-live",
        label: "Order Live",
        description: "Play the order challenge live.",
        visible: ["timer", "order challenge board", "scoreline"],
        actions: ["timer control", "round live control"]
      },
      {
        id: "order-judge",
        label: "Order Judge",
        description: "Lock answer and apply result (team1/team2/draw).",
        visible: ["score inputs", "winner preview", "lock answer"],
        actions: ["lock answer", "apply result", "open reveal"],
        payout: true
      }
    ],
    payoutStateId: "order-judge",
    roundReturn: "After reveal, use Next round for the next order challenge.",
    gameEnd: "Game end is manual from End of Game when host decides."
  },
  "beer-pong": {
    states: [
      {
        id: "beer-brief",
        label: "Match Brief",
        description: "Set bets for both teams using the confirmed lineup.",
        visible: ["team cards", "bets", "lineup snapshot"],
        actions: ["set bets", "lock selection"]
      },
      {
        id: "beer-live",
        label: "Beer Pong Live",
        description: "Play live with timer and visible scoreline.",
        visible: ["timer", "scoreline", "round context"],
        actions: ["timer control", "round live control"]
      },
      {
        id: "beer-judge",
        label: "Result Judge",
        description: "Lock answer and apply final result.",
        visible: ["score inputs", "winner/draw preview", "lock answer"],
        actions: ["lock answer", "apply result", "open reveal"],
        payout: true
      }
    ],
    payoutStateId: "beer-judge",
    roundReturn: "After reveal, Next round starts the next beer pong round.",
    gameEnd: "Game end is manual from End of Game when host decides."
  },
  "shot-fake": {
    states: [
      {
        id: "shot-brief",
        label: "Side Bet Brief",
        description: "Prepare base bets, side bets, and multiplier for confirmed lineup.",
        visible: ["side bet list", "multiplier", "lineup snapshot"],
        actions: ["set bets", "add/remove side bets"]
      },
      {
        id: "shot-live",
        label: "Shot Live",
        description: "Run live round with transfer preview.",
        visible: ["special transfer preview", "timer", "scoreline"],
        actions: ["timer control", "live tracking"]
      },
      {
        id: "shot-settle",
        label: "Settle Round",
        description: "Lock answer and apply bet-only settlement.",
        visible: ["net preview", "lock answer", "settlement controls"],
        actions: ["lock answer", "apply settlement", "open reveal"],
        payout: true
      }
    ],
    payoutStateId: "shot-settle",
    roundReturn: "After reveal, Next round starts next Shot Fake round.",
    gameEnd: "Game end is manual from End of Game when host decides."
  },
  "curse-de-cai": {
    states: [
      {
        id: "race-brief",
        label: "Race Brief",
        description: "Set multi-bets and bettors for the confirmed lineup.",
        visible: ["horse roster", "multi-bet board", "lineup snapshot"],
        actions: ["set bets", "set bettors"]
      },
      {
        id: "race-live",
        label: "Race Live",
        description: "Move horses manually and track leader.",
        visible: ["visual track", "move controls", "leader preview"],
        actions: ["move horse", "timer control", "race control"]
      },
      {
        id: "race-settle",
        label: "Settle Payout",
        description: "Lock answer and apply winner-horse payout x4.",
        visible: ["winner horse", "net payout preview", "lock answer"],
        actions: ["lock answer", "apply payout", "open reveal"],
        payout: true
      }
    ],
    payoutStateId: "race-settle",
    roundReturn: "After reveal, Next round starts the next race.",
    gameEnd: "Game end is manual from End of Game when host decides."
  }
};
const DEFAULT_RESULT_SUMMARY = "Niciun rezultat aplicat inca.";
const DEFAULT_TRIVIA_CATEGORIES = [
  {
    id: "trivia-cat-1",
    title: "Geografie",
    question: "Care este capitala Australiei?",
    options: ["Sydney", "Melbourne", "Canberra", "Perth"],
    correctOptionIndex: 2,
    answer: "Canberra"
  },
  {
    id: "trivia-cat-2",
    title: "Istorie",
    question: "In ce an a cazut Zidul Berlinului?",
    options: ["1987", "1989", "1991", "1993"],
    correctOptionIndex: 1,
    answer: "1989"
  },
  {
    id: "trivia-cat-3",
    title: "Filme si seriale",
    question: "Cum se numeste continentul fictiv din Black Panther?",
    options: ["Genovia", "Wakanda", "Latveria", "Narnia"],
    correctOptionIndex: 1,
    answer: "Wakanda"
  },
  {
    id: "trivia-cat-4",
    title: "Sport si jocuri",
    question: "Cate piese are un jucator la inceputul unei partide de sah?",
    options: ["12", "14", "16", "18"],
    correctOptionIndex: 2,
    answer: "16"
  }
];
const DEFAULT_PRETUL_ITEMS = [
  {
    id: "pretul-item-1",
    name: "HyperX Cloud III (casti gaming)",
    referencePrice: 120
  },
  {
    id: "pretul-item-2",
    name: "Philips 2200 (espressor automat)",
    referencePrice: 420
  },
  {
    id: "pretul-item-3",
    name: "Anker Nebula Capsule (mini proiector)",
    referencePrice: 520
  },
  {
    id: "pretul-item-4",
    name: "Garmin Venu Sq 2 (smartwatch)",
    referencePrice: 260
  }
];
const FILM_FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 960 540'><defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0' stop-color='%23111a33'/><stop offset='1' stop-color='%2328386d'/></linearGradient></defs><rect width='960' height='540' fill='url(%23g)'/><text x='50%25' y='45%25' fill='%23f5f7ff' font-size='42' font-family='Arial' text-anchor='middle'>DEMO ROUND IMAGE</text><text x='50%25' y='56%25' fill='%23d4dcff' font-size='24' font-family='Arial' text-anchor='middle'>Replace with your real round visual</text></svg>";
const FILM_COMPONENT_KEYS = ["character", "franchise", "funFact"];
const FILM_COMPONENT_WEIGHTS = {
  character: 1,
  franchise: 1,
  funFact: 3
};
const DEFAULT_FILM_ITEMS = [
  {
    id: "film-item-1",
    title: "Runda 1 - Film clasic",
    imageUrl: FILM_FALLBACK_IMAGE,
    imageAlt: "Imagine demo runda 1",
    characterPrompt: "Hermione Granger",
    franchisePrompt: "Harry Potter",
    funFactPrompt: "Prima carte Harry Potter a fost publicata in 1997."
  },
  {
    id: "film-item-2",
    title: "Runda 2 - Joc video",
    imageUrl: FILM_FALLBACK_IMAGE,
    imageAlt: "Imagine demo runda 2",
    characterPrompt: "Kratos",
    franchisePrompt: "God of War",
    funFactPrompt: "Seria God of War a debutat pe PlayStation 2 in 2005."
  },
  {
    id: "film-item-3",
    title: "Runda 3 - Franciza blockbuster",
    imageUrl: FILM_FALLBACK_IMAGE,
    imageAlt: "Imagine demo runda 3",
    characterPrompt: "Tony Stark / Iron Man",
    franchisePrompt: "Marvel Cinematic Universe",
    funFactPrompt: "Primul film MCU a fost Iron Man (2008)."
  }
];
const DEFAULT_SAMSAR_ROUNDS = [
  {
    id: "samsar-round-1",
    personaTitle: "Familie cu doi copii",
    personaRequirements:
      "Buget maxim 16.000, minim 2018, portbagaj mare si consum redus pentru drumuri de weekend."
  },
  {
    id: "samsar-round-2",
    personaTitle: "Student in oras",
    personaRequirements:
      "Buget maxim 7.000, intretinere ieftina, masina compacta si usor de parcat."
  },
  {
    id: "samsar-round-3",
    personaTitle: "Commuter zilnic",
    personaRequirements:
      "Face 70 km pe zi, vrea confort la drum lung, cutie automata si minim 130 CP."
  },
  {
    id: "samsar-round-4",
    personaTitle: "Fan performanta",
    personaRequirements:
      "Cauta masina sportiva sub 20.000, 0-100 sub 7 secunde si istoric service clar."
  },
  {
    id: "samsar-round-5",
    personaTitle: "Primul SUV",
    personaRequirements:
      "Vrea SUV pentru familie, minim 2017, dotari de siguranta bune si costuri previzibile."
  },
  {
    id: "samsar-round-6",
    personaTitle: "Executive premium",
    personaRequirements:
      "Buget 28.000, confort premium, interior de calitate si reputatie buna pe fiabilitate."
  }
];
const DEFAULT_CURSE_HORSES = [
  {
    id: "horse-1",
    name: "Storm Arrow",
    symbol: ">>",
    story:
      "Storm Arrow porneste mai lent, dar recupereaza puternic in a doua jumatate a cursei. " +
      "The horse is known for steady rhythm and late acceleration."
  },
  {
    id: "horse-2",
    name: "Crimson Dust",
    symbol: "**",
    story:
      "Crimson Dust forteaza startul si castiga rapid teren in primele mutari. " +
      "The horse can lose momentum near the finish if timing is not controlled."
  },
  {
    id: "horse-3",
    name: "Night Echo",
    symbol: "##",
    story:
      "Night Echo raspunde bine la presiune si performeaza in curse tactice. " +
      "The horse is favored in rounds with many close lane collisions."
  },
  {
    id: "horse-4",
    name: "Silver Bolt",
    symbol: "!!",
    story:
      "Silver Bolt este cel mai constant cal din grup, cu ritm echilibrat. " +
      "This horse is reliable for conservative bet strategies."
  },
  {
    id: "horse-5",
    name: "Iron Comet",
    symbol: "$$",
    story:
      "Iron Comet devine periculos pe final cand pista este libera. " +
      "The horse is hard to stop once it reaches mid-track advantage."
  },
  {
    id: "horse-6",
    name: "Wild Orbit",
    symbol: "@@",
    story:
      "Wild Orbit este imprevizibil si poate avea atat runde slabe, cat si runde dominante. " +
      "Hosts usually keep this horse for high-variance moments."
  }
];
const DEFAULT_MANUAL_SIDEBET = {
  id: "shot-side-1",
  label: "Duel 1v1",
  amount: 50,
  winner: "draw"
};
const FIXED_TITLE_PLAYER_NAME = "Frincu";
const FIXED_TITLE_LABEL = "F1 Gypsy King";
const PLAYER_STATS_SCHEMA_VERSION = 1;
const SECTION_NOTES_DEFAULTS = {
  triviaRules:
    "- O singura echipa joaca runda.\n- Doar echipa activa pariaza (max 10%, rotunjit la 10).\n- Corect: bonus fix + castig din bet.\n- Gresit: pierdere bet.\n- Categoriile folosite se marcheaza automat.",
  pretulRules:
    "- Ambele echipe dau raspuns si pariu (max 15%, rotunjit la 10).\n- Introdu pretul real la finalul rundei.\n- Castigatorul este detectat automat dupa distanta fata de pretul real.\n- Distanta egala = tie, pariurile se returneaza.",
  filmJocRules:
    "- O singura echipa joaca runda.\n- Componente: Character/Title x1, Franchise x1, Fun Fact x3.\n- Payout partial pe componente, nu all-or-nothing.\n- Bet-ul se activeaza doar la minim 2/3 corecte.",
  samsarRules:
    "- Joc in 6 runde, fiecare cu persona si cerinte clare.\n- Fiecare echipa trimite un jucator activ.\n- Scor mai mare castiga, scor egal = draw.\n- Payout standard Samsar cu limita de bet a jocului.",
  manualMatchups:
    "Guess the Right Order - team vs team, payout standard, draw permis.\nBeer Pong - team vs team, payout standard, draw permis.\nShot Fake - bet-only, draw permis, side bets + regula x * jucatori activi adversi.",
  curseBets:
    "- Bet-only mode, fara bonus fix.\n- Multi-bet permis pe mai multi cai.\n- Doar pariul pe calul castigator plateste x4.\n- Restul pariurilor se pierd.\n- Limita de echipa ramane 30%, rotunjit la 10."
};
const LEGACY_SECTION_NOTES = {
  triviaRules: "Seteaza timeout, modul de challenge si regula de tie-break.",
  pretulRules: "Defineste ordinea raspunsurilor, limitele si regula de departajare.",
  filmJocRules: "Defineste ordinea reveal-urilor si punctajul pe componente.",
  samsarRules: "Defineste regulile de evaluare si validare a castigului pe runda.",
  manualMatchups: "Configurari rapide pentru Guess the Right Order, Beer Pong si Shot Fake.",
  curseBets: "Noteaza optiunile de pariere, multiplicatorii si momentul payout-ului."
};

const DEFAULT_STATE = {
  activeSection: "home",
  showUi: {
    activeScreen: "show-home",
    liveRoundStep: "topic-select",
    gameNightStarted: false,
    completedGameIds: [],
    lineupReadyByGame: {},
    answerLocked: false,
    hostPanelOpen: false,
    adminAdvancedOpen: false
  },
  settings: {
    showTitle: "GameShow Friday Night",
    hostName: "Alex",
    currencySymbol: "$"
  },
  teams: {
    teamA: {
      name: "Lupii",
      score: 0,
      money: TEAM_START_MONEY,
      players: [
        { id: "teamA-p1", name: "Andrei", status: "available" },
        { id: "teamA-p2", name: "Mara", status: "available" },
        { id: "teamA-p3", name: "Stefan", status: "available" },
        { id: "teamA-p4", name: "Bianca", status: "available" },
        { id: "teamA-p5", name: "Frincu", status: "available" }
      ]
    },
    teamB: {
      name: "Vulturii",
      score: 0,
      money: TEAM_START_MONEY,
      players: [
        { id: "teamB-p1", name: "Vlad", status: "available" },
        { id: "teamB-p2", name: "Ioana", status: "available" },
        { id: "teamB-p3", name: "Radu", status: "available" },
        { id: "teamB-p4", name: "Daria", status: "available" }
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
    turnTeamKey: "teamA",
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
      "20:00 Intro + prezentare echipe\n20:10 Trivia\n20:30 Pretul Corect\n20:50 Pauza scurta\n21:00 Jocuri rapide + final",
    homeEmergencyPlan:
      "Daca apare o problema tehnica: ruleaza o runda rapida de trivia pe telefon si continua scorul manual.",
    triviaQuestionBank:
      "Q1: Capitala Australiei? (Canberra)\nQ2: In ce an a cazut Zidul Berlinului? (1989)\nQ3: Cate piese are un jucator la inceput in sah? (16)\nQ4: Cine l-a interpretat pe Iron Man? (Robert Downey Jr.)",
    triviaRules:
      SECTION_NOTES_DEFAULTS.triviaRules,
    pretulItems:
      "HyperX Cloud III | Pret real: 120\nPhilips 2200 Espressor | Pret real: 420\nAnker Nebula Capsule | Pret real: 520\nGarmin Venu Sq 2 | Pret real: 260",
    pretulRules:
      SECTION_NOTES_DEFAULTS.pretulRules,
    filmJocBoard:
      "R1: Hermione Granger | Harry Potter | Carte lansata in 1997\nR2: Kratos | God of War | Debut PS2 in 2005\nR3: Tony Stark | MCU | Primul film MCU: Iron Man (2008)",
    filmJocRules:
      SECTION_NOTES_DEFAULTS.filmJocRules,
    samsarInventory:
      "Card A: Hatchback economic\nCard B: SUV familie\nCard C: Sedan premium\nCard special: Bonus daca alegi masina sub buget",
    samsarRules:
      SECTION_NOTES_DEFAULTS.samsarRules,
    manualMatchups:
      SECTION_NOTES_DEFAULTS.manualMatchups,
    manualLog:
      "Log arbitraj: noteaza deciziile manuale, contestatiile si ajustarile finale de scor.",
    curseTrack:
      "Pista: 12 pasi pana la finish\nEveniment optional: la pasul 6 se poate aplica boost +1 pentru un cal ales manual",
    curseBets:
      SECTION_NOTES_DEFAULTS.curseBets,
    awardsCategories:
      "MVP\nHigh Roller\nComeback Hero\nBest Team Strategy\nBest Samsar",
    finalTitles:
      "Multumim tuturor pentru seara de GameShow! Echipa castigatoare ridica trofeul, iar Frincu primeste titlul F1 Gypsy King."
  },
  updatedAt: null
};

const elements = {
  showShell: document.querySelector(".show-shell"),
  showHeader: document.querySelector(".show-header"),
  showStage: document.querySelector(".show-stage"),
  showScreenButtons: Array.from(document.querySelectorAll("[data-show-screen-target]")),
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
  hostPanelToggleBtn: document.getElementById("hostPanelToggleBtn"),
  hostPanelCloseBtn: document.getElementById("hostPanelCloseBtn"),
  hostPanelOverlay: document.getElementById("hostPanelOverlay"),
  hostDrawer: document.getElementById("hostDrawer"),
  hostWorkspace: document.getElementById("hostWorkspace"),
  hostAdminAdvancedBtn: document.getElementById("hostAdminAdvancedBtn"),
  adminUndoBtn: document.getElementById("adminUndoBtn"),
  adminUnlockSelectionBtn: document.getElementById("adminUnlockSelectionBtn"),
  adminForceRevealBtn: document.getElementById("adminForceRevealBtn"),
  adminNextRoundBtn: document.getElementById("adminNextRoundBtn"),
  adminNextGameBtn: document.getElementById("adminNextGameBtn"),
  adminMoneyTeamAInput: document.getElementById("adminMoneyTeamAInput"),
  adminMoneyTeamBInput: document.getElementById("adminMoneyTeamBInput"),
  adminApplyMoneyBtn: document.getElementById("adminApplyMoneyBtn"),
  adminResetMoneyBtn: document.getElementById("adminResetMoneyBtn"),
  adminGameSelect: document.getElementById("adminGameSelect"),
  adminRoundInput: document.getElementById("adminRoundInput"),
  adminApplyStateBtn: document.getElementById("adminApplyStateBtn"),
  adminResetGameBtn: document.getElementById("adminResetGameBtn"),
  adminFullResetBtn: document.getElementById("adminFullResetBtn"),
  adminTimerDurationInput: document.getElementById("adminTimerDurationInput"),
  adminTimerRemainingInput: document.getElementById("adminTimerRemainingInput"),
  adminApplyTimerBtn: document.getElementById("adminApplyTimerBtn"),
  adminPauseTimerBtn: document.getElementById("adminPauseTimerBtn"),
  adminResetTimerBtn: document.getElementById("adminResetTimerBtn"),
  adminFixTeamSelect: document.getElementById("adminFixTeamSelect"),
  adminFixActionSelect: document.getElementById("adminFixActionSelect"),
  adminFixPlayerSelect: document.getElementById("adminFixPlayerSelect"),
  adminApplyPlayerFixBtn: document.getElementById("adminApplyPlayerFixBtn"),
  adminSummaryInput: document.getElementById("adminSummaryInput"),
  adminApplySummaryBtn: document.getElementById("adminApplySummaryBtn"),
  adminExportSaveBtn: document.getElementById("adminExportSaveBtn"),
  adminImportSaveBtn: document.getElementById("adminImportSaveBtn"),
  showStageGameLabel: document.getElementById("showStageGameLabel"),
  showStageRoundLabel: document.getElementById("showStageRoundLabel"),
  showStageTimer: document.getElementById("showStageTimer"),
  showActivePlayersTeamA: document.getElementById("showActivePlayersTeamA"),
  showActivePlayersTeamB: document.getElementById("showActivePlayersTeamB"),
  showScreenTitle: document.getElementById("showScreenTitle"),
  showScreenContent: document.getElementById("showScreenContent"),
  showResultCard: document.getElementById("showResultCard"),
  showLatestResult: document.getElementById("showLatestResult"),
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
  if (typeof value !== "string") {
    return fallback;
  }
  if (!/PLACEHOLDER/i.test(value)) {
    return value;
  }
  const cleaned = value.replace(/PLACEHOLDER\s*:?\s*/gi, "").replace(/\s{2,}/g, " ").trim();
  return cleaned || fallback;
}

function normalizeTextToken(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function matchesAnyLegacyPattern(value, patterns) {
  const token = normalizeTextToken(value);
  if (!token) {
    return false;
  }
  return patterns.some((pattern) => pattern.test(token));
}

function isLegacyGenericShowTitle(value) {
  return matchesAnyLegacyPattern(value, [/^gameshow$/, /^gameshow season \d+$/, /^season \d+$/, /^show title$/]);
}

function isLegacyGenericHostName(value) {
  return matchesAnyLegacyPattern(value, [/^host$/, /^host name$/, /^nume host$/, /^active host$/]);
}

function isLegacyGenericTeamName(value, teamKey) {
  if (matchesAnyLegacyPattern(value, [/^team [ab]$/, /^team [12]$/, /^echipa [ab]$/, /^echipa [12]$/])) {
    return true;
  }
  if (teamKey === "teamA") {
    return matchesAnyLegacyPattern(value, [/^team a$/, /^team 1$/, /^echipa a$/, /^echipa 1$/]);
  }
  return matchesAnyLegacyPattern(value, [/^team b$/, /^team 2$/, /^echipa b$/, /^echipa 2$/]);
}

function isLegacyGenericPlayerName(value, teamKey) {
  if (
    matchesAnyLegacyPattern(value, [
      /^player \d+$/,
      /^jucator \d+$/,
      /^participant \d+$/,
      /^membru \d+$/,
      /^player team [ab] \d+$/,
      /^jucator echipa [ab] \d+$/
    ])
  ) {
    return true;
  }
  if (teamKey === "teamA") {
    return matchesAnyLegacyPattern(value, [/^team a player \d+$/, /^team 1 player \d+$/, /^echipa a jucator \d+$/, /^echipa 1 jucator \d+$/]);
  }
  return matchesAnyLegacyPattern(value, [/^team b player \d+$/, /^team 2 player \d+$/, /^echipa b jucator \d+$/, /^echipa 2 jucator \d+$/]);
}

function shouldUseDemoRoster(players, teamKey) {
  if (!Array.isArray(players) || players.length === 0) {
    return true;
  }
  return players.length <= 12 && players.every((player) => isLegacyGenericPlayerName(player?.name, teamKey));
}

function shouldUseDemoTriviaData(categories) {
  if (!Array.isArray(categories) || categories.length === 0) {
    return true;
  }
  return categories.every((category) => {
    const title = normalizeTextToken(category?.title);
    const question = normalizeTextToken(category?.question);
    const answer = normalizeTextToken(category?.answer);
    const genericTitle =
      /^categoria \d+$/.test(title) ||
      /^category \d+$/.test(title) ||
      title.includes("placeholder");
    const genericQuestion =
      !question ||
      question.includes("placeholder") ||
      question === "intrebare demo pentru aceasta categorie." ||
      /^question text for category \d+\.?$/.test(question);
    const genericAnswer =
      !answer ||
      answer.includes("placeholder") ||
      answer === "raspuns demo pentru aceasta categorie." ||
      /^answer text for category \d+\.?$/.test(answer);
    return genericTitle || (genericQuestion && genericAnswer);
  });
}

function shouldUseDemoPretulItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return true;
  }
  return items.every((item) => {
    const name = normalizeTextToken(item?.name);
    const genericName =
      /^item \d+$/.test(name) || /^produs \d+$/.test(name) || /^product \d+$/.test(name) || name.includes("placeholder");
    return genericName;
  });
}

function isGenericFilmPrompt(value) {
  const token = normalizeTextToken(value);
  return (
    !token ||
    token.includes("placeholder") ||
    token === "text reveal character/title." ||
    token === "text reveal franchise." ||
    token === "text reveal fun fact." ||
    /^character \/ title reveal text for round \d+\.?$/.test(token) ||
    /^franchise reveal text for round \d+\.?$/.test(token) ||
    /^fun fact reveal text for round \d+\.?$/.test(token)
  );
}

function shouldUseDemoFilmItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return true;
  }
  return items.every((item) => {
    const title = normalizeTextToken(item?.title);
    const genericTitle =
      /^runda \d+$/.test(title) ||
      /^round \d+$/.test(title) ||
      /^round \d+ - movie character$/.test(title) ||
      /^round \d+ - game character$/.test(title) ||
      /^round \d+ - franchise scene$/.test(title) ||
      title.includes("placeholder");
    return (
      genericTitle ||
      (isGenericFilmPrompt(item?.characterPrompt) &&
        isGenericFilmPrompt(item?.franchisePrompt) &&
        isGenericFilmPrompt(item?.funFactPrompt))
    );
  });
}

function shouldUseDemoSamsarRounds(roundsData) {
  if (!Array.isArray(roundsData) || roundsData.length === 0) {
    return true;
  }
  return roundsData.every((round) => {
    const title = normalizeTextToken(round?.personaTitle);
    const requirements = normalizeTextToken(round?.personaRequirements);
    const genericTitle = /^runda \d+$/.test(title) || /^round \d+$/.test(title) || title.includes("persona");
    const genericRequirements = !requirements || requirements.includes("placeholder") || requirements.includes("cerinte");
    return genericTitle && genericRequirements;
  });
}

function shouldUseDemoHorseSet(horses) {
  if (!Array.isArray(horses) || horses.length < 4) {
    return true;
  }
  return horses.every((horse) => {
    const name = normalizeTextToken(horse?.name);
    const story = normalizeTextToken(horse?.story);
    const genericName = /^horse \d+$/.test(name) || /^cal \d+$/.test(name) || name.includes("placeholder");
    return genericName || story.includes("placeholder");
  });
}

function applyMeaningfulContentMigration(clean) {
  const defaults = cloneDefaultState();

  if (isLegacyGenericShowTitle(clean.settings.showTitle)) {
    clean.settings.showTitle = defaults.settings.showTitle;
  }
  if (isLegacyGenericHostName(clean.settings.hostName)) {
    clean.settings.hostName = defaults.settings.hostName;
  }

  if (isLegacyGenericTeamName(clean.teams.teamA.name, "teamA")) {
    clean.teams.teamA.name = defaults.teams.teamA.name;
  }
  if (isLegacyGenericTeamName(clean.teams.teamB.name, "teamB")) {
    clean.teams.teamB.name = defaults.teams.teamB.name;
  }

  if (shouldUseDemoRoster(clean.teams.teamA.players, "teamA")) {
    clean.teams.teamA.players = defaults.teams.teamA.players.map((player) => ({ ...player }));
  }
  if (shouldUseDemoRoster(clean.teams.teamB.players, "teamB")) {
    clean.teams.teamB.players = defaults.teams.teamB.players.map((player) => ({ ...player }));
  }

  if (shouldUseDemoTriviaData(clean.trivia.categories)) {
    clean.trivia.categories = defaults.trivia.categories.map((category) => ({ ...category }));
  }
  if (shouldUseDemoPretulItems(clean.pretul.items)) {
    clean.pretul.items = defaults.pretul.items.map((item) => ({ ...item }));
  }
  if (shouldUseDemoFilmItems(clean.filmGame.items)) {
    clean.filmGame.items = defaults.filmGame.items.map((item) => ({ ...item }));
  }
  if (shouldUseDemoSamsarRounds(clean.samsarGame.roundsData)) {
    clean.samsarGame.roundsData = defaults.samsarGame.roundsData.map((round) => ({ ...round }));
  }
  if (shouldUseDemoHorseSet(clean.curseRace.horses)) {
    clean.curseRace.horses = defaults.curseRace.horses.map((horse) => ({ ...horse }));
  }

  if (normalizeTextToken(clean.progress.lastResultSummary).includes("placeholder")) {
    clean.progress.lastResultSummary = DEFAULT_RESULT_SUMMARY;
  }

  for (const sectionKey of Object.keys(defaults.sections)) {
    const normalized = normalizeTextToken(clean.sections[sectionKey]);
    if (!normalized || normalized.includes("placeholder")) {
      clean.sections[sectionKey] = defaults.sections[sectionKey];
    }
  }
}

function reconcileStateAfterMigration(clean) {
  const teamAIds = new Set(clean.teams.teamA.players.map((player) => player.id));
  const teamBIds = new Set(clean.teams.teamB.players.map((player) => player.id));
  const allPlayerIds = new Set([...teamAIds, ...teamBIds]);

  const seenLive = new Set();
  const normalizeActiveLane = (lane = []) =>
    lane
      .filter((playerId) => {
        if (!allPlayerIds.has(playerId) || seenLive.has(playerId)) {
          return false;
        }
        seenLive.add(playerId);
        return true;
      })
      .slice(0, MAX_ACTIVE_PER_TEAM);

  clean.roundSelection.activeByTeam.teamA = normalizeActiveLane(clean.roundSelection.activeByTeam.teamA);
  clean.roundSelection.activeByTeam.teamB = normalizeActiveLane(clean.roundSelection.activeByTeam.teamB);
  clean.roundSelection.jokerAssignment = "out";

  for (const snapshot of Object.values(clean.roundSelection.history)) {
    const seenSnapshot = new Set();
    const normalizeSnapshotLane = (lane = []) =>
      lane
        .filter((playerId) => {
          if (!allPlayerIds.has(playerId) || seenSnapshot.has(playerId)) {
            return false;
          }
          seenSnapshot.add(playerId);
          return true;
        })
        .slice(0, MAX_ACTIVE_PER_TEAM);
    snapshot.activeByTeam.teamA = normalizeSnapshotLane(snapshot.activeByTeam.teamA);
    snapshot.activeByTeam.teamB = normalizeSnapshotLane(snapshot.activeByTeam.teamB);
    snapshot.jokerAssignment = "out";
  }

  const triviaCategoryIds = new Set(clean.trivia.categories.map((category) => category.id));
  for (const [roundKey, rawRound] of Object.entries(clean.trivia.rounds)) {
    const safeRound = sanitizeTriviaRoundState(rawRound);
    safeRound.usedCategoryIds = safeRound.usedCategoryIds.filter((id) => triviaCategoryIds.has(id));
    if (!triviaCategoryIds.has(safeRound.selectedCategoryId)) {
      safeRound.selectedCategoryId = clean.trivia.categories[0]?.id || "";
    }
    clean.trivia.rounds[roundKey] = safeRound;
  }

  const pretulItemIds = new Set(clean.pretul.items.map((item) => item.id));
  for (const [roundKey, rawRound] of Object.entries(clean.pretul.rounds)) {
    const safeRound = sanitizePretulRoundState(rawRound);
    safeRound.usedItemIds = safeRound.usedItemIds.filter((id) => pretulItemIds.has(id));
    if (!pretulItemIds.has(safeRound.selectedItemId)) {
      safeRound.selectedItemId = clean.pretul.items[0]?.id || "";
    }
    clean.pretul.rounds[roundKey] = safeRound;
  }

  const filmItemIds = new Set(clean.filmGame.items.map((item) => item.id));
  for (const [roundKey, rawRound] of Object.entries(clean.filmGame.rounds)) {
    const safeRound = sanitizeFilmRoundState(rawRound);
    safeRound.usedItemIds = safeRound.usedItemIds.filter((id) => filmItemIds.has(id));
    if (!filmItemIds.has(safeRound.selectedItemId)) {
      safeRound.selectedItemId = clean.filmGame.items[0]?.id || "";
    }
    clean.filmGame.rounds[roundKey] = safeRound;
  }

  for (const rawRound of Object.values(clean.samsarGame.rounds)) {
    if (!teamAIds.has(rawRound.activePlayerTeamAId)) {
      rawRound.activePlayerTeamAId = "";
    }
    if (!teamBIds.has(rawRound.activePlayerTeamBId)) {
      rawRound.activePlayerTeamBId = "";
    }
  }

  const horseIds = clean.curseRace.horses.map((horse) => horse.id);
  for (const [roundKey, rawRound] of Object.entries(clean.curseRace.rounds)) {
    const safeRound = sanitizeCurseRoundState(rawRound, horseIds);
    if (!teamAIds.has(safeRound.bets.teamA.bettorId)) {
      safeRound.bets.teamA.bettorId = "";
    }
    if (!teamBIds.has(safeRound.bets.teamB.bettorId)) {
      safeRound.bets.teamB.bettorId = "";
    }
    clean.curseRace.rounds[roundKey] = safeRound;
  }
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
    const rawOptions = Array.isArray(rawCategory?.options)
      ? rawCategory.options.map((option) => sanitizeString(option, "").trim()).filter((option) => option.length > 0)
      : [];

    if (!title && !question && !answer) {
      continue;
    }

    let id = sanitizeString(rawCategory?.id, "").trim();
    if (!id || seenIds.has(id)) {
      id = `trivia-cat-${sanitized.length + 1}`;
    }
    seenIds.add(id);

    let options = rawOptions.slice(0, 6);
    if (options.length < 2) {
      options = ["Optiunea A", "Optiunea B", "Optiunea C", "Optiunea D"];
    }
    if (answer && !options.includes(answer)) {
      options = [answer].concat(options.filter((option) => option !== answer)).slice(0, 6);
    }

    let correctOptionIndex = Math.round(sanitizeNumber(rawCategory?.correctOptionIndex, 0));
    if (correctOptionIndex < 0 || correctOptionIndex >= options.length) {
      correctOptionIndex = options.findIndex((option) => normalizeTextToken(option) === normalizeTextToken(answer));
    }
    if (correctOptionIndex < 0 || correctOptionIndex >= options.length) {
      correctOptionIndex = 0;
    }

    sanitized.push({
      id,
      title: title || `Categoria ${sanitized.length + 1}`,
      question: question || "Intrebare demo pentru aceasta categorie.",
      options,
      correctOptionIndex,
      answer: options[correctOptionIndex] || answer || "Raspuns demo pentru aceasta categorie."
    });
  }

  return sanitized.length > 0 ? sanitized : fallback;
}

function sanitizeTriviaRoundState(rawRoundState) {
  const safeState = {
    teamKey: "teamA",
    usedCategoryIds: [],
    selectedCategoryId: "",
    betAmount: 100,
    selectedOptionIndex: -1,
    lockedOptionIndex: -1,
    resultChecked: false,
    isCorrect: null,
    lastDelta: 0,
    resultCategoryId: "",
    lastResult: ""
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
  safeState.betAmount = normalizeBetAmount(rawRoundState.betAmount);
  safeState.selectedOptionIndex = Math.round(sanitizeNumber(rawRoundState.selectedOptionIndex, -1));
  safeState.lockedOptionIndex = Math.round(sanitizeNumber(rawRoundState.lockedOptionIndex, -1));
  safeState.resultChecked = Boolean(rawRoundState.resultChecked);
  safeState.isCorrect =
    rawRoundState.isCorrect === true ? true : rawRoundState.isCorrect === false ? false : null;
  safeState.lastDelta = Math.round(sanitizeNumber(rawRoundState.lastDelta, 0));
  safeState.resultCategoryId = sanitizeString(rawRoundState.resultCategoryId, "");
  safeState.lastResult = sanitizeString(rawRoundState.lastResult, "");
  return safeState;
}

function getTriviaRoundKey(roundNumber = state.progress.currentRound) {
  return `trivia::R${roundNumber}`;
}

function getOrCreateTriviaRoundState(roundNumber = state.progress.currentRound) {
  const roundKey = getTriviaRoundKey(roundNumber);
  if (!state.trivia.rounds[roundKey]) {
    const previousRoundKey = getTriviaRoundKey(Math.max(1, roundNumber - 1));
    const previousRound = sanitizeTriviaRoundState(state.trivia.rounds[previousRoundKey]);
    const inferredTurn =
      ["teamA", "teamB"].includes(state.trivia.turnTeamKey)
        ? state.trivia.turnTeamKey
        : previousRound.teamKey === "teamA"
          ? "teamB"
          : "teamA";
    const carryUsed = Array.isArray(previousRound.usedCategoryIds) ? [...previousRound.usedCategoryIds] : [];
    const nextAvailable = state.trivia.categories.find((category) => !carryUsed.includes(category.id));
    state.trivia.rounds[roundKey] = sanitizeTriviaRoundState({
      teamKey: inferredTurn,
      usedCategoryIds: carryUsed,
      selectedCategoryId: nextAvailable?.id || state.trivia.categories[0]?.id || "",
      betAmount: elements.triviaBetAmountInput?.value || 100,
      selectedOptionIndex: -1,
      lockedOptionIndex: -1,
      resultChecked: false,
      isCorrect: null,
      lastDelta: 0,
      resultCategoryId: "",
      lastResult: ""
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
      imageAlt: sanitizeString(rawItem?.imageAlt, "Imagine demo runda").trim() || "Imagine demo runda",
      characterPrompt:
        sanitizeString(rawItem?.characterPrompt, "Text reveal Character/Title.").trim() ||
        "Text reveal Character/Title.",
      franchisePrompt:
        sanitizeString(rawItem?.franchisePrompt, "Text reveal Franchise.").trim() ||
        "Text reveal Franchise.",
      funFactPrompt:
        sanitizeString(rawItem?.funFactPrompt, "Text reveal Fun Fact.").trim() ||
        "Text reveal Fun Fact."
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
    label: safeLabel || `Side bet ${index + 1}`,
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

function getGameLineupKey(gameId = state.progress.currentGame) {
  return `${gameId}::LINEUP`;
}

function isRoundHistoryKey(key) {
  return /::R\d+$/i.test(String(key || ""));
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
  base.jokerAssignment = "out";

  return base;
}

function sanitizeState(rawState) {
  const clean = cloneDefaultState();
  const source = rawState || {};

  if (SECTION_IDS.includes(source.activeSection)) {
    clean.activeSection = source.activeSection;
  }
  if (SHOW_SCREEN_IDS.includes(source.showUi?.activeScreen)) {
    clean.showUi.activeScreen = source.showUi.activeScreen;
  }
  clean.showUi.liveRoundStep = sanitizeString(source.showUi?.liveRoundStep, clean.showUi.liveRoundStep).trim() || clean.showUi.liveRoundStep;
  clean.showUi.gameNightStarted = Boolean(source.showUi?.gameNightStarted);
  clean.showUi.completedGameIds = Array.isArray(source.showUi?.completedGameIds)
    ? Array.from(new Set(source.showUi.completedGameIds.filter((gameId) => GAME_ORDER.includes(gameId))))
    : [];
  clean.showUi.lineupReadyByGame = {};
  if (source.showUi?.lineupReadyByGame && typeof source.showUi.lineupReadyByGame === "object") {
    for (const gameId of GAME_ORDER) {
      clean.showUi.lineupReadyByGame[gameId] = Boolean(source.showUi.lineupReadyByGame[gameId]);
    }
  } else {
    for (const gameId of GAME_ORDER) {
      clean.showUi.lineupReadyByGame[gameId] = false;
    }
  }
  clean.showUi.answerLocked = Boolean(source.showUi?.answerLocked);
  clean.showUi.hostPanelOpen = Boolean(source.showUi?.hostPanelOpen);
  clean.showUi.adminAdvancedOpen = Boolean(source.showUi?.adminAdvancedOpen);

  clean.settings.showTitle =
    sanitizeString(source.settings?.showTitle, clean.settings.showTitle).trim() || clean.settings.showTitle;
  clean.settings.hostName =
    sanitizeString(source.settings?.hostName, clean.settings.hostName).trim() || clean.settings.hostName;
  clean.settings.currencySymbol =
    sanitizeString(source.settings?.currencySymbol, clean.settings.currencySymbol).trim().slice(0, 3) || "$";

  clean.teams.teamA.name = sanitizeString(source.teams?.teamA?.name, clean.teams.teamA.name).trim() || clean.teams.teamA.name;
  clean.teams.teamB.name = sanitizeString(source.teams?.teamB?.name, clean.teams.teamB.name).trim() || clean.teams.teamB.name;
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
  clean.trivia.turnTeamKey = ["teamA", "teamB"].includes(source.trivia?.turnTeamKey)
    ? source.trivia.turnTeamKey
    : clean.trivia.turnTeamKey;
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
  clean.roundSelection.jokerAssignment = "out";
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

  applyMeaningfulContentMigration(clean);
  reconcileStateAfterMigration(clean);

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

  existing.displayName = displayName || existing.displayName || "";
  existing.lastTeamKey = lastTeamKey;
  state.playerStats.byPlayerId[playerId] = existing;
  return existing;
}

function findPlayerRecordById(playerId) {
  if (typeof playerId !== "string" || !playerId) {
    return null;
  }
  for (const teamKey of ["teamA", "teamB"]) {
    const player = state.teams[teamKey].players.find((entry) => entry.id === playerId);
    if (player) {
      return {
        teamKey,
        player
      };
    }
  }
  return null;
}

function getActiveParticipantsForTeam(teamKey) {
  const participants = [];
  const seen = new Set();

  for (const playerId of state.roundSelection.activeByTeam[teamKey]) {
    const record = findPlayerRecordById(playerId);
    if (!record?.player || seen.has(playerId) || record.player.status !== "available") {
      continue;
    }
    seen.add(playerId);
    participants.push({
      id: record.player.id,
      displayName: record.player.name,
      teamKey
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
      teamKey
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
  const allIds = new Set([...Object.keys(statsById), ...liveById.keys()]);
  const players = [];

  for (const playerId of allIds) {
    const live = liveById.get(playerId);
    const stats = getPlayerStatsEntryView(playerId);
    const name = live?.name || stats.displayName || "Unknown Player";
    const teamKey = live?.teamKey || (["teamA", "teamB"].includes(stats.lastTeamKey) ? stats.lastTeamKey : "");
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
  if (!["teamA", "teamB"].includes(player.teamKey)) {
    return player.name;
  }
  const teamName = state.teams[player.teamKey]?.name || player.teamKey;
  return `${player.name} (${teamName})`;
}

function getFixedTitlePlayer() {
  const players = getAwardsPlayerPool();
  const normalizedTarget = normalizeTextToken(FIXED_TITLE_PLAYER_NAME);
  const exact = players.find((player) => normalizeTextToken(player.name) === normalizedTarget);
  if (exact) {
    return exact;
  }
  return null;
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
    const fixedPlayer = getFixedTitlePlayer();
    if (fixedPlayer) {
      elements.jokerFixedAwardLine.textContent =
        `Player: ${fixedPlayer.name} | Reason: Fixed special title, always guaranteed | ` +
        `Main stat: ${FIXED_TITLE_LABEL}, rounds played ${fixedPlayer.stats.roundsPlayed}.`;
    } else {
      elements.jokerFixedAwardLine.textContent =
        `Player: ${FIXED_TITLE_PLAYER_NAME} | Reason: Fixed special title, always guaranteed | ` +
        `Main stat: ${FIXED_TITLE_LABEL}. Add player to roster to track stats.`;
    }
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

  const fixedPlayer = getFixedTitlePlayer();
  if (fixedPlayer) {
    elements.endJokerTitleLine.textContent =
      `${fixedPlayer.name} - ${FIXED_TITLE_LABEL} (fixed). Rounds played: ${fixedPlayer.stats.roundsPlayed}, net money: ${formatSignedMoney(
        fixedPlayer.stats.netMoney
      )}.`;
  } else {
    elements.endJokerTitleLine.textContent =
      `${FIXED_TITLE_PLAYER_NAME} - ${FIXED_TITLE_LABEL} (fixed). Player not found in roster stats.`;
  }
  elements.endFinalTitlesScript.textContent =
    (state.sections.finalTitles || "").trim() || "Multumim pentru participare! Felicitari echipei castigatoare!";
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
}

function enforceFilmRoundTeamRestrictions() {
  if (state.progress.currentGame !== "film-joc-franciza-fun-fact") {
    return;
  }

  const filmRoundState = getOrCreateFilmRoundState();
  const playingTeam = filmRoundState.teamKey;
  const otherTeam = playingTeam === "teamA" ? "teamB" : "teamA";

  state.roundSelection.activeByTeam[otherTeam] = [];
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
  const availableIds = new Set(
    [...state.teams.teamA.players, ...state.teams.teamB.players]
      .filter((player) => player.status === "available")
      .map((player) => player.id)
  );

  const seen = new Set();
  const normalizeLane = (ids = []) =>
    ids.filter((id) => {
      if (!availableIds.has(id) || seen.has(id)) {
        return false;
      }
      seen.add(id);
      return true;
    });

  state.roundSelection.activeByTeam.teamA = normalizeLane(state.roundSelection.activeByTeam.teamA);
  state.roundSelection.activeByTeam.teamB = normalizeLane(state.roundSelection.activeByTeam.teamB);

  for (const teamKey of ["teamA", "teamB"]) {
    if (state.roundSelection.activeByTeam[teamKey].length > MAX_ACTIVE_PER_TEAM) {
      state.roundSelection.activeByTeam[teamKey] = state.roundSelection.activeByTeam[teamKey].slice(0, MAX_ACTIVE_PER_TEAM);
    }
  }

  state.roundSelection.jokerAssignment = "out";
}

function saveCurrentRoundSnapshot() {
  ensureCurrentRoundSelectionValid();
  const snapshot = {
    activeByTeam: {
      teamA: [...state.roundSelection.activeByTeam.teamA],
      teamB: [...state.roundSelection.activeByTeam.teamB]
    },
    jokerAssignment: "out"
  };
  state.roundSelection.history[getRoundKey()] = snapshot;
  state.roundSelection.history[getGameLineupKey()] = sanitizeHistorySnapshot(snapshot);
}

function loadCurrentRoundSnapshot() {
  const roundSnapshot = state.roundSelection.history[getRoundKey()];
  const lineupSnapshot = state.roundSelection.history[getGameLineupKey()];
  const snapshot = lineupSnapshot || roundSnapshot;
  if (snapshot) {
    const safe = sanitizeHistorySnapshot(snapshot);
    state.roundSelection.activeByTeam.teamA = [...safe.activeByTeam.teamA];
    state.roundSelection.activeByTeam.teamB = [...safe.activeByTeam.teamB];
    state.roundSelection.jokerAssignment = "out";
  } else {
    state.roundSelection.activeByTeam.teamA = [];
    state.roundSelection.activeByTeam.teamB = [];
    state.roundSelection.jokerAssignment = "out";
  }
  ensureCurrentRoundSelectionValid();
  state.roundSelection.history[getGameLineupKey()] = sanitizeHistorySnapshot({
    activeByTeam: {
      teamA: [...state.roundSelection.activeByTeam.teamA],
      teamB: [...state.roundSelection.activeByTeam.teamB]
    },
    jokerAssignment: "out"
  });
}

function countActiveWithJoker(teamKey) {
  return state.roundSelection.activeByTeam[teamKey].length;
}

function getShowScreenTitle(screenId = state.showUi?.activeScreen) {
  const labels = {
    "show-home": "Show Home",
    "game-select": "Game Select",
    "game-intro": "Game Intro",
    "roster-management": "Manage Players / Roster",
    "live-round": "Live Round",
    "reveal-result": "Reveal / Result",
    "end-of-game": "End of Game",
    leaderboard: "Leaderboard",
    "end-screen": "End Screen"
  };
  return labels[screenId] || labels["show-home"];
}

function getSectionForShowScreen(screenId) {
  if (screenId === "show-home" || screenId === "game-select" || screenId === "end-of-game") {
    return "home";
  }
  if (screenId === "leaderboard") {
    return "leaderboard";
  }
  if (screenId === "roster-management") {
    return "players-teams";
  }
  if (screenId === "end-screen") {
    return "end-screen";
  }
  if (["game-intro", "live-round", "reveal-result"].includes(screenId)) {
    return getGameSection(state.progress.currentGame);
  }
  return "home";
}

function getGameFlowDefinition(gameId) {
  return GAME_FLOW_DEFINITIONS[gameId] || GAME_FLOW_DEFINITIONS.trivia;
}

function getGameFlowStates(gameId) {
  const flow = getGameFlowDefinition(gameId);
  return Array.isArray(flow.states) && flow.states.length > 0 ? flow.states : GAME_FLOW_DEFINITIONS.trivia.states;
}

function getGameFlowState(gameId, stepId) {
  return getGameFlowStates(gameId).find((stateEntry) => stateEntry.id === stepId) || null;
}

function getDefaultFlowStateId(gameId) {
  return getGameFlowStates(gameId)[0]?.id || "topic-select";
}

function getLiveRoundStep(gameId = state.progress.currentGame) {
  const step = state.showUi?.liveRoundStep;
  if (getGameFlowState(gameId, step)) {
    return step;
  }
  return getDefaultFlowStateId(gameId);
}

function getLiveStepLabel(gameId, stepId) {
  return getGameFlowState(gameId, stepId)?.label || "Flow Step";
}

function getLiveStepDescription(gameId, stepId) {
  return getGameFlowState(gameId, stepId)?.description || "Flow-ul rundei este pregatit pentru acest joc.";
}

function getNextLiveRoundStep(gameId, currentStep) {
  const states = getGameFlowStates(gameId);
  const index = states.findIndex((entry) => entry.id === currentStep);
  if (index < 0 || index >= states.length - 1) {
    return states[states.length - 1]?.id || getDefaultFlowStateId(gameId);
  }
  return states[index + 1].id;
}

function getPrevLiveRoundStep(gameId, currentStep) {
  const states = getGameFlowStates(gameId);
  const index = states.findIndex((entry) => entry.id === currentStep);
  if (index <= 0) {
    return states[0]?.id || getDefaultFlowStateId(gameId);
  }
  return states[index - 1].id;
}

function getFlowPayoutStateId(gameId) {
  const flow = getGameFlowDefinition(gameId);
  return flow.payoutStateId || getGameFlowStates(gameId)[getGameFlowStates(gameId).length - 1]?.id || getDefaultFlowStateId(gameId);
}

function getFlowRoundReturn(gameId) {
  return getGameFlowDefinition(gameId).roundReturn || "Use Next round to continue.";
}

function getFlowGameEndRule(gameId) {
  return getGameFlowDefinition(gameId).gameEnd || "Use End of Game screen when this game is complete.";
}

function isGameFlowComplete(gameId) {
  if (gameId === "trivia") {
    const roundState = getOrCreateTriviaRoundState();
    const total = Math.max(0, state.trivia.categories.length);
    return total > 0 && roundState.usedCategoryIds.length >= total;
  }
  if (gameId === "pretul-corect") {
    const roundState = getOrCreatePretulRoundState();
    const total = Math.max(0, state.pretul.items.length);
    return total > 0 && roundState.usedItemIds.length >= total;
  }
  if (gameId === "film-joc-franciza-fun-fact") {
    const roundState = getOrCreateFilmRoundState();
    const total = Math.max(0, state.filmGame.items.length);
    return total > 0 && roundState.usedItemIds.length >= total;
  }
  if (gameId === "cel-mai-bun-samsar") {
    const totalRounds = Math.max(1, state.samsarGame.roundsData?.length || 6);
    return state.progress.currentRound >= totalRounds;
  }
  return false;
}

function ensureShowUiState() {
  if (!state.showUi || typeof state.showUi !== "object") {
    state.showUi = {
      ...DEFAULT_STATE.showUi,
      completedGameIds: [...DEFAULT_STATE.showUi.completedGameIds],
      lineupReadyByGame: { ...DEFAULT_STATE.showUi.lineupReadyByGame }
    };
  }
  if (!SHOW_SCREEN_IDS.includes(state.showUi.activeScreen)) {
    state.showUi.activeScreen = DEFAULT_STATE.showUi.activeScreen;
  }
  const currentGameId = GAME_ORDER.includes(state.progress?.currentGame)
    ? state.progress.currentGame
    : DEFAULT_STATE.progress.currentGame;
  if (!getGameFlowState(currentGameId, state.showUi.liveRoundStep)) {
    state.showUi.liveRoundStep = getDefaultFlowStateId(currentGameId);
  }
  if (!Array.isArray(state.showUi.completedGameIds)) {
    state.showUi.completedGameIds = [];
  }
  state.showUi.completedGameIds = Array.from(
    new Set(state.showUi.completedGameIds.filter((gameId) => GAME_ORDER.includes(gameId)))
  );
  if (!state.showUi.lineupReadyByGame || typeof state.showUi.lineupReadyByGame !== "object") {
    state.showUi.lineupReadyByGame = {};
  }
  for (const gameId of GAME_ORDER) {
    if (typeof state.showUi.lineupReadyByGame[gameId] !== "boolean") {
      state.showUi.lineupReadyByGame[gameId] = false;
    }
  }
  if (typeof state.showUi.gameNightStarted !== "boolean") {
    state.showUi.gameNightStarted = false;
  }
  if (typeof state.showUi.answerLocked !== "boolean") {
    state.showUi.answerLocked = false;
  }
  if (state.showUi.activeScreen === "live-round" && !Boolean(state.showUi.lineupReadyByGame[currentGameId])) {
    state.showUi.activeScreen = "game-intro";
  }
}

function isGameLineupReady(gameId = state.progress.currentGame) {
  ensureShowUiState();
  return Boolean(state.showUi.lineupReadyByGame[gameId]);
}

function setGameLineupReady(gameId, nextReady) {
  if (!GAME_ORDER.includes(gameId)) {
    return;
  }
  ensureShowUiState();
  state.showUi.lineupReadyByGame[gameId] = Boolean(nextReady);
}

function hasAnyCurrentGameLineupMembers() {
  return countActiveWithJoker("teamA") > 0 || countActiveWithJoker("teamB") > 0;
}

function isOverlayAnswerLocked() {
  ensureShowUiState();
  return Boolean(state.showUi.answerLocked);
}

function setOverlayAnswerLocked(nextLocked, options = {}) {
  const persist = options.persist !== false;
  ensureShowUiState();
  state.showUi.answerLocked = Boolean(nextLocked);
  renderShowUi();
  if (persist) {
    saveState(state.showUi.answerLocked ? "Answer locked from overlay." : "Answer unlocked from overlay.");
  }
}

function isGameCompleted(gameId) {
  ensureShowUiState();
  return state.showUi.completedGameIds.includes(gameId);
}

function getCompletedGameCount() {
  ensureShowUiState();
  return state.showUi.completedGameIds.length;
}

function getRemainingGameCount() {
  return GAME_ORDER.length - getCompletedGameCount();
}

function isGameNightComplete() {
  return getCompletedGameCount() >= GAME_ORDER.length;
}

function getNextUnfinishedGameId() {
  ensureShowUiState();
  return GAME_ORDER.find((gameId) => !state.showUi.completedGameIds.includes(gameId)) || GAME_ORDER[0];
}

function startGameNightFlow(options = {}) {
  const persist = options.persist !== false;
  ensureShowUiState();
  state.showUi.gameNightStarted = true;
  state.showUi.completedGameIds = [];
  for (const gameId of GAME_ORDER) {
    state.showUi.lineupReadyByGame[gameId] = false;
  }
  const nextGameId = getNextUnfinishedGameId();
  switchRoundContext(nextGameId, 1, { navigateToSection: false });
  state.showUi.activeScreen = "game-select";
  setLastResultSummary("Game night started. Pick the first mini-game.");
  renderAll();
  if (persist) {
    saveState("Game night started.");
  }
}

function finishCurrentGameAndReturn(options = {}) {
  const persist = options.persist !== false;
  ensureShowUiState();
  const finishedGameId = state.progress.currentGame;
  if (!state.showUi.completedGameIds.includes(finishedGameId)) {
    state.showUi.completedGameIds.push(finishedGameId);
  }
  state.showUi.lineupReadyByGame[finishedGameId] = false;
  if (isGameNightComplete()) {
    state.showUi.activeScreen = "end-screen";
    setLastResultSummary("All games complete. Opening Final End Screen.");
    renderAll();
    if (persist) {
      saveState("Game night complete.");
    }
    return;
  }

  const nextGameId = getNextUnfinishedGameId();
  switchRoundContext(nextGameId, 1, { navigateToSection: false });
  state.showUi.activeScreen = "game-select";
  setLastResultSummary(`${getGameLabel(nextGameId)} is next. Choose when ready.`);
  renderAll();
  if (persist) {
    saveState(`Game finished: ${getGameLabel(finishedGameId)}.`);
  }
}

function setLiveRoundStep(nextStep, options = {}) {
  const persist = options.persist !== false;
  const currentGameId = state.progress.currentGame;
  if (!getGameFlowState(currentGameId, nextStep)) {
    return;
  }
  ensureShowUiState();
  state.showUi.liveRoundStep = nextStep;
  renderShowUi();
  if (persist) {
    saveState(`Live round step: ${getLiveStepLabel(currentGameId, nextStep)}.`);
  }
}

function getTeamActivePlayersLabel(teamKey) {
  const participants = getActiveParticipantsForTeam(teamKey);
  if (participants.length === 0) {
    return "Active: none";
  }
  const names = participants.map((entry) => entry.displayName).filter((name) => typeof name === "string" && name.trim());
  return names.length > 0 ? `Active: ${names.join(", ")}` : "Active: none";
}

function getTeamLineupHudHtml(teamKey) {
  const participants = getActiveParticipantsForTeam(teamKey);
  const lineupReady = isGameLineupReady(state.progress.currentGame);
  if (participants.length === 0) {
    return `<p class="show-team-lineup-empty">${
      lineupReady ? "Bench this game." : "Lineup not set. Confirm in Game Intro."
    }</p>`;
  }
  const chips = participants
    .map((entry) => `<span class="show-team-chip">${escapeHtml(entry.displayName)}</span>`)
    .join("");
  if (!lineupReady) {
    return `
      <div class="show-team-chip-list">${chips}</div>
      <p class="show-team-lineup-empty">Lineup pending confirmation.</p>
    `;
  }
  return `<div class="show-team-chip-list">${chips}</div>`;
}

function renderLiveRoundTeamSummary(teamKey) {
  const team = state.teams[teamKey];
  return `
    <article class="show-live-team-compact show-live-team-${teamKey}">
      <p class="show-info-label">${escapeHtml(team.name)}</p>
      <p class="show-live-team-money">${formatMoney(team.money)}</p>
      <div class="show-live-team-lineup">
        ${getTeamLineupHudHtml(teamKey)}
      </div>
    </article>
  `;
}

function getCurrentRoundResultForShow(gameId) {
  if (gameId === "trivia") {
    return getOrCreateTriviaRoundState().lastResult || state.progress.lastResultSummary || "";
  }
  if (gameId === "pretul-corect") {
    return getOrCreatePretulRoundState().lastResult || "";
  }
  if (gameId === "film-joc-franciza-fun-fact") {
    return getOrCreateFilmRoundState().lastResult || "";
  }
  if (gameId === "cel-mai-bun-samsar") {
    return getOrCreateSamsarRoundState(getSamsarRoundNumber()).lastResult || "";
  }
  if (isManualMatchGame(gameId)) {
    return getOrCreateManualMatchRoundState(getCurrentManualMatchGame(), state.progress.currentRound).lastResult || "";
  }
  if (gameId === "curse-de-cai") {
    return getOrCreateCurseRoundState(state.progress.currentRound).lastResult || "";
  }
  return "";
}

function getGameIntroRules(gameId) {
  if (gameId === "trivia") {
    return [
      "One team plays each round; turn switches automatically after result.",
      "Flow: Topic Select -> Bet -> Question+Answers (timer live) -> Result -> next topic.",
      "Multiple choice topics are disabled after use; correct gives bonus + bet win."
    ];
  }
  if (gameId === "pretul-corect") {
    return [
      "Both teams submit a price estimate and a bet.",
      "Winner is auto-detected by closest distance to real price.",
      "Equal distance is a tie and both bets are returned."
    ];
  }
  if (gameId === "film-joc-franciza-fun-fact") {
    return [
      "One image round with Character/Title, Franchise, and Fun Fact components.",
      "Partial payout is based on component scores (1/1/3).",
      "Bet activates only with minimum 2 of 3 components correct."
    ];
  }
  if (gameId === "cel-mai-bun-samsar") {
    return [
      "Each team uses its game lineup; host can still override in debug.",
      "Higher manual score wins the round; tie is draw.",
      "Standard Samsar payout is applied with cap rules."
    ];
  }
  if (gameId === "guess-right-order") {
    return [
      "Team vs team manual result entry.",
      "Standard payout with draw allowed.",
      "Game lineup is selected once at game start (max 6 per team)."
    ];
  }
  if (gameId === "beer-pong") {
    return [
      "Team vs team manual result entry.",
      "Standard payout with draw allowed.",
      "Game lineup is selected once at game start (max 6 per team)."
    ];
  }
  if (gameId === "shot-fake") {
    return [
      "Bet-only mode with no fixed round bonus.",
      "Round can include multiple side bets.",
      "Special transfer uses x * active players from both teams in current game lineup."
    ];
  }
  if (gameId === "curse-de-cai") {
    return [
      "Bet-only horse race with manual movement by symbol.",
      "Multiple horse bets are allowed per team.",
      "Only the winning horse bet pays x4; all others lose."
    ];
  }
  return ["Regulile acestui joc pot fi completate din Settings."];
}

function shouldShowLiveStageControls(gameId, liveStep) {
  const _gameId = gameId;
  const _liveStep = liveStep;
  void _gameId;
  void _liveStep;
  return true;
}

function renderShowStageControls(gameId = state.progress.currentGame, liveStep = getLiveRoundStep(gameId)) {
  if (!shouldShowLiveStageControls(gameId, liveStep)) {
    return "";
  }

  const triviaTeam = state.progress.currentGame === "trivia" ? getCurrentTriviaTeam() : "";
  const filmTeam = state.progress.currentGame === "film-joc-franciza-fun-fact" ? getCurrentFilmTeam() : "";
  const activeGameTeam = triviaTeam || filmTeam;
  const infoLabel = activeGameTeam
    ? `One-team mode: ${state.teams[activeGameTeam].name}`
    : "Team-vs-team mode";
  const compactStatus = `${getGameLabel(gameId)} | Round ${state.progress.currentRound}`;
  const timerTone = state.timer.remaining <= 10 ? "is-danger" : "";

  return `
    <div class="show-control-strip">
      <div class="show-control-context">
        <p class="show-control-subnote">${escapeHtml(compactStatus)}</p>
        <p class="show-control-note">${escapeHtml(infoLabel)}</p>
      </div>
      <div class="show-live-timer-core ${timerTone}" data-show-live-timer-core>${formatTimer(state.timer.remaining)}</div>
      <div class="show-control-buttons">
        <button class="pill-btn" type="button" data-show-action="timer-start">Start</button>
        <button class="pill-btn" type="button" data-show-action="timer-pause">Pause</button>
        <button class="pill-btn" type="button" data-show-action="timer-reset">Reset</button>
        <button class="pill-btn" type="button" data-show-action="timer-minus-10">-10s</button>
        <button class="pill-btn" type="button" data-show-action="timer-plus-10">+10s</button>
      </div>
    </div>
  `;
}

function renderShowJokerControl(options = {}) {
  void options;
  return "";
}

function getShowPlayerLane(playerId) {
  if (state.roundSelection.activeByTeam.teamA.includes(playerId)) {
    return "teamA";
  }
  if (state.roundSelection.activeByTeam.teamB.includes(playerId)) {
    return "teamB";
  }
  return "out";
}

function canAssignShowPlayerToTeam(playerId, targetTeamKey) {
  if (!["teamA", "teamB"].includes(targetTeamKey)) {
    return false;
  }
  const currentLane = getShowPlayerLane(playerId);
  if (currentLane === targetTeamKey) {
    return true;
  }
  const record = findPlayerRecordById(playerId);
  if (!record?.player || record.player.status !== "available") {
    return false;
  }
  return countActiveWithJoker(targetTeamKey) < MAX_ACTIVE_PER_TEAM;
}

function assignShowPlayerToLane(playerId, targetLane) {
  if (state.roundSelection.locked) {
    setLastResultSummary("Game lineup is locked. Unlock to move players.");
    saveState("Show assignment blocked while locked.");
    return;
  }
  if (!["teamA", "teamB", "out"].includes(targetLane)) {
    return;
  }

  const record = findPlayerRecordById(playerId);
  if (!record?.player) {
    return;
  }

  const currentLane = getShowPlayerLane(playerId);
  if (currentLane === targetLane) {
    return;
  }

  if (targetLane !== "out") {
    if (record.player.status !== "available") {
      setLastResultSummary(`${record.player.name} is ${record.player.status} and cannot join a team.`);
      saveState("Show assignment rejected: player unavailable.");
      return;
    }
    if (!canAssignShowPlayerToTeam(playerId, targetLane)) {
      setLastResultSummary(`${state.teams[targetLane].name} reached max ${MAX_ACTIVE_PER_TEAM} active players.`);
      saveState("Show assignment rejected: active limit reached.");
      return;
    }
  }

  state.roundSelection.activeByTeam.teamA = state.roundSelection.activeByTeam.teamA.filter((id) => id !== playerId);
  state.roundSelection.activeByTeam.teamB = state.roundSelection.activeByTeam.teamB.filter((id) => id !== playerId);

  if (targetLane === "teamA") {
    state.roundSelection.activeByTeam.teamA.push(playerId);
  } else if (targetLane === "teamB") {
    state.roundSelection.activeByTeam.teamB.push(playerId);
  }

  saveCurrentRoundSnapshot();
  renderRoundSelection();
  setLastResultSummary(`${record.player.name} moved to ${targetLane === "out" ? "Bench" : state.teams[targetLane].name}.`);
  saveState("Show assignment updated.");
}

function renderShowPlayerAssignmentBoard() {
  const isLocked = state.roundSelection.locked;
  const tokens = [
    ...state.teams.teamA.players.map((player) => ({
      id: player.id,
      name: player.name,
      status: player.status,
      sourceTeamKey: "teamA"
    })),
    ...state.teams.teamB.players.map((player) => ({
      id: player.id,
      name: player.name,
      status: player.status,
      sourceTeamKey: "teamB"
    }))
  ];

  const laneBuckets = {
    teamA: [],
    out: [],
    teamB: []
  };

  for (const token of tokens) {
    const lane = getShowPlayerLane(token.id);
    const currentLane = lane === "teamA" || lane === "teamB" ? lane : "out";
    const teamAReady = canAssignShowPlayerToTeam(token.id, "teamA");
    const teamBReady = canAssignShowPlayerToTeam(token.id, "teamB");
    const laneLabel = currentLane === "out" ? "Bench" : state.teams[currentLane].name;
    const statusLabel =
      token.status === "available" ? `Roster: ${state.teams[token.sourceTeamKey].name}` : token.status;
    const disabledTeamA = isLocked || (!teamAReady && currentLane !== "teamA") ? "disabled" : "";
    const disabledTeamB = isLocked || (!teamBReady && currentLane !== "teamB") ? "disabled" : "";
    const disabledBench = isLocked ? "disabled" : "";
    laneBuckets[currentLane].push(`
      <article class="show-assignment-token ${token.status === "unavailable" ? "is-unavailable" : ""}">
        <div class="show-assignment-token-head">
          <p class="show-assignment-name">${escapeHtml(token.name)}</p>
          <p class="show-assignment-meta">${escapeHtml(statusLabel)} | Now: ${escapeHtml(laneLabel)}</p>
        </div>
        <div class="show-assignment-token-controls">
          <button class="pill-btn ${currentLane === "teamA" ? "is-active" : ""}" type="button" data-show-player-assign data-player-id="${
            token.id
          }" data-target-lane="teamA" ${disabledTeamA} title="Move left to ${escapeHtml(state.teams.teamA.name)}">L</button>
          <button class="pill-btn ${currentLane === "out" ? "is-active" : ""}" type="button" data-show-player-assign data-player-id="${
            token.id
          }" data-target-lane="out" ${disabledBench} title="Move to bench">Bench</button>
          <button class="pill-btn ${currentLane === "teamB" ? "is-active" : ""}" type="button" data-show-player-assign data-player-id="${
            token.id
          }" data-target-lane="teamB" ${disabledTeamB} title="Move right to ${escapeHtml(state.teams.teamB.name)}">R</button>
        </div>
      </article>
    `);
  }

  const laneCards = [
    {
      lane: "teamA",
      title: state.teams.teamA.name,
      subtitle: `${countActiveWithJoker("teamA")}/${MAX_ACTIVE_PER_TEAM} active`
    },
    {
      lane: "out",
      title: "Bench / Inactive",
      subtitle: `${laneBuckets.out.length} tokens`
    },
    {
      lane: "teamB",
      title: state.teams.teamB.name,
      subtitle: `${countActiveWithJoker("teamB")}/${MAX_ACTIVE_PER_TEAM} active`
    }
  ]
    .map((laneCard) => {
      const tokensHtml = laneBuckets[laneCard.lane].join("");
      return `
        <section class="show-assignment-lane show-assignment-lane-${laneCard.lane}">
          <div class="show-assignment-lane-head">
            <p class="show-info-label">${escapeHtml(laneCard.title)}</p>
            <p class="show-info-sub">${escapeHtml(laneCard.subtitle)}</p>
          </div>
          <div class="show-assignment-lane-body">${tokensHtml || '<p class="show-round-copy">No players here.</p>'}</div>
        </section>
      `;
    })
    .join("");

  return `
    <article class="show-player-assignment-board">
      <div class="show-player-assignment-head">
        <h3>Lineup Board</h3>
        <p class="show-control-note">${
          isLocked
            ? "Lineup is locked. Unlock to move tokens."
            : "Move tokens Left / Bench / Right. This lineup stays active for the whole game."
        }</p>
      </div>
      <div class="show-assignment-grid">${laneCards}</div>
    </article>
  `;
}

function renderShowRosterManagementTeam(teamKey) {
  const team = state.teams[teamKey];
  const rows = team.players
    .map((player) => {
      return `
        <article class="show-roster-row" data-team="${teamKey}" data-player-id="${player.id}">
          <input
            class="text-input"
            type="text"
            value="${escapeHtml(player.name)}"
            data-show-roster-name
          >
          <select class="text-input compact-input" data-show-roster-status>
            <option value="available" ${player.status === "available" ? "selected" : ""}>Available</option>
            <option value="bench" ${player.status === "bench" ? "selected" : ""}>Bench</option>
            <option value="unavailable" ${player.status === "unavailable" ? "selected" : ""}>Unavailable</option>
          </select>
          <button class="pill-btn" type="button" data-show-roster-remove>Remove</button>
        </article>
      `;
    })
    .join("");

  return `
    <article class="show-control-card show-roster-team-card" data-team="${teamKey}">
      <h3>${escapeHtml(team.name)} roster</h3>
      <div class="show-roster-add-row">
        <input class="text-input" type="text" placeholder="Add new player..." data-show-roster-add-name data-team="${teamKey}">
        <button class="primary-btn" type="button" data-show-roster-add data-team="${teamKey}">Add Player</button>
      </div>
      <div class="show-roster-list">
        ${rows || '<p class="show-round-copy">No players yet.</p>'}
      </div>
    </article>
  `;
}

function renderShowPlayerSelectionBlock(teamKey, options = {}) {
  const team = state.teams[teamKey];
  const activeIds = new Set(state.roundSelection.activeByTeam[teamKey]);
  const activeCount = countActiveWithJoker(teamKey);
  const isLocked = state.roundSelection.locked;
  const allowStatus = options.allowStatus === true;
  const clearAction = options.clearAction || "clear-team-active";

  return `
    <article class="show-player-card">
      <div class="show-player-head">
        <p class="show-info-label">${escapeHtml(team.name)} active</p>
        <p class="show-info-sub">${activeCount}/${MAX_ACTIVE_PER_TEAM}</p>
      </div>
      <div class="show-player-actions">
        <button
          class="pill-btn"
          type="button"
          data-show-action="${clearAction}"
          data-team="${teamKey}"
          ${isLocked ? "disabled" : ""}
        >
          Deselect all
        </button>
      </div>
      <div class="show-player-list">
        ${team.players
          .map((player) => {
            const isActive = activeIds.has(player.id);
            const disabledToggle = isLocked || player.status !== "available" ? "disabled" : "";
            const statusOptions = ["available", "bench", "unavailable"]
              .map((status) => `<option value="${status}" ${player.status === status ? "selected" : ""}>${status}</option>`)
              .join("");
            return `
              <label class="show-player-item ${isActive ? "is-active" : ""}">
                <input
                  type="checkbox"
                  data-show-player-toggle
                  data-team="${teamKey}"
                  data-player-id="${player.id}"
                  ${isActive ? "checked" : ""}
                  ${disabledToggle}
                >
                <span>${escapeHtml(player.name)}</span>
                <small>${player.status}</small>
                ${
                  allowStatus
                    ? `<select class="text-input show-player-status" data-show-player-status data-team="${teamKey}" data-player-id="${player.id}" ${
                        isLocked ? "disabled" : ""
                      }>${statusOptions}</select>`
                    : ""
                }
              </label>
            `;
          })
          .join("")}
      </div>
    </article>
  `;
}

function renderShowActionFooter() {
  return `
    <div class="show-action-footer">
      <button class="primary-btn" type="button" data-show-action="go-reveal">Reveal / Result</button>
      <button class="secondary-btn" type="button" data-show-action="next-round">Next round</button>
      <button class="secondary-btn" type="button" data-show-action="next-game">Next game</button>
    </div>
  `;
}

function buildLegacyLiveRoundContent(gameId, options = {}) {
  const minimal = options.minimal === true;
  const stageControls = renderShowStageControls();
  const jokerControl = renderShowJokerControl();
  const topBlock = minimal ? "" : `${stageControls}\n      ${jokerControl}`;
  const playerSelectionOptions = { allowStatus: !minimal };

  if (gameId === "trivia") {
    const roundState = getOrCreateTriviaRoundState();
    const category = state.trivia.categories.find((entry) => entry.id === roundState.selectedCategoryId);
    const playingTeam = state.teams[roundState.teamKey];
    const usedCount = roundState.usedCategoryIds.length;
    const totalCount = state.trivia.categories.length;
    const maxBet = getMaxBetAmount(playingTeam.money, "trivia");
    const categoryOptions = state.trivia.categories
      .map((entry) => {
        const isUsed = roundState.usedCategoryIds.includes(entry.id);
        return `<option value="${entry.id}" ${roundState.selectedCategoryId === entry.id ? "selected" : ""} ${
          isUsed ? "disabled" : ""
        }>${escapeHtml(entry.title)}${isUsed ? " (USED)" : ""}</option>`;
      })
      .join("");

    return `
      ${topBlock}
      <div class="show-info-grid">
        <div class="show-info-card">
          <p class="show-info-label">Team In Play</p>
          <p class="show-info-value">${escapeHtml(playingTeam.name)}</p>
        </div>
        <div class="show-info-card">
          <p class="show-info-label">Category Usage</p>
          <p class="show-info-value">${usedCount} / ${totalCount}</p>
        </div>
      </div>
      <div class="show-round-card">
        <p class="show-info-label">Category</p>
        <p class="show-round-title">${escapeHtml(category?.title || "No category selected")}</p>
        <p class="show-round-copy">${escapeHtml(category?.question || "Intrebarea curenta va fi afisata aici.")}</p>
      </div>
      <div class="show-overlay-grid two-col">
        <article class="show-control-card">
          <h3>Round Controls</h3>
          <label class="show-info-label" for="showTriviaTeamSelect">Playing team</label>
          <select id="showTriviaTeamSelect" class="text-input" data-show-trivia-team>
            <option value="teamA" ${roundState.teamKey === "teamA" ? "selected" : ""}>${escapeHtml(state.teams.teamA.name)}</option>
            <option value="teamB" ${roundState.teamKey === "teamB" ? "selected" : ""}>${escapeHtml(state.teams.teamB.name)}</option>
          </select>

          <label class="show-info-label spaced" for="showTriviaCategorySelect">Category</label>
          <select id="showTriviaCategorySelect" class="text-input" data-show-trivia-category>${categoryOptions}</select>

          <label class="show-info-label spaced" for="showTriviaBetInput">Bet (max ${formatMoney(maxBet)})</label>
          <input id="showTriviaBetInput" class="text-input compact-input" type="number" min="0" step="10" value="${roundState.betAmount}" data-show-trivia-bet>

          ${
            minimal
              ? ""
              : `
            <label class="show-info-label spaced" for="showTriviaBonusInput">Fixed bonus</label>
            <input id="showTriviaBonusInput" class="text-input compact-input" type="number" min="0" step="10" value="${Math.max(
              0,
              Math.round(sanitizeNumber(state.trivia.fixedBonus, 100))
            )}" data-show-trivia-bonus>

            <div class="show-action-footer">
              <button class="primary-btn" type="button" data-show-action="trivia-correct">Correct</button>
              <button class="danger-btn" type="button" data-show-action="trivia-wrong">Wrong</button>
              <button class="secondary-btn" type="button" data-show-action="trivia-reset-used">Reset used</button>
            </div>
          `
          }
        </article>
        ${renderShowPlayerSelectionBlock(roundState.teamKey, playerSelectionOptions)}
      </div>
      ${minimal ? "" : renderShowActionFooter()}
    `;
  }

  if (gameId === "pretul-corect") {
    const roundState = getOrCreatePretulRoundState();
    const item = state.pretul.items.find((entry) => entry.id === roundState.selectedItemId);
    const itemOptions = state.pretul.items
      .map((entry) => {
        const isUsed = roundState.usedItemIds.includes(entry.id);
        return `<option value="${entry.id}" ${roundState.selectedItemId === entry.id ? "selected" : ""} ${
          isUsed ? "disabled" : ""
        }>${escapeHtml(entry.name)}${isUsed ? " (USED)" : ""}</option>`;
      })
      .join("");
    const maxBetA = getMaxBetAmount(state.teams.teamA.money, "pretul-corect");
    const maxBetB = getMaxBetAmount(state.teams.teamB.money, "pretul-corect");

    return `
      ${topBlock}
      <div class="show-round-card">
        <p class="show-info-label">Item In Round</p>
        <p class="show-round-title">${escapeHtml(item?.name || "No item selected")}</p>
      </div>
      <div class="show-info-grid">
        <div class="show-info-card">
          <p class="show-info-label">${escapeHtml(state.teams.teamA.name)} answer</p>
          <p class="show-info-value">${formatMoney(roundState.answerTeamA)}</p>
        </div>
        <div class="show-info-card">
          <p class="show-info-label">${escapeHtml(state.teams.teamB.name)} answer</p>
          <p class="show-info-value">${formatMoney(roundState.answerTeamB)}</p>
        </div>
      </div>
      <p class="show-round-copy">Real price is set in host controls and revealed during result screen.</p>
      <div class="show-overlay-grid two-col">
        <article class="show-control-card">
          <h3>Round Controls</h3>
          <label class="show-info-label" for="showPretulItem">Current item</label>
          <select id="showPretulItem" class="text-input" data-show-pretul-item>${itemOptions}</select>
          <div class="show-mini-grid">
            <div>
              <label class="show-info-label" for="showPretulAnswerA">${escapeHtml(state.teams.teamA.name)} answer</label>
              <input id="showPretulAnswerA" class="text-input compact-input" type="number" min="0" step="1" value="${roundState.answerTeamA}" data-show-pretul-answer-teama>
            </div>
            <div>
              <label class="show-info-label" for="showPretulBetA">${escapeHtml(state.teams.teamA.name)} bet (max ${formatMoney(
                maxBetA
              )})</label>
              <input id="showPretulBetA" class="text-input compact-input" type="number" min="0" step="10" value="${roundState.betTeamA}" data-show-pretul-bet-teama>
            </div>
            <div>
              <label class="show-info-label" for="showPretulAnswerB">${escapeHtml(state.teams.teamB.name)} answer</label>
              <input id="showPretulAnswerB" class="text-input compact-input" type="number" min="0" step="1" value="${roundState.answerTeamB}" data-show-pretul-answer-teamb>
            </div>
            <div>
              <label class="show-info-label" for="showPretulBetB">${escapeHtml(state.teams.teamB.name)} bet (max ${formatMoney(
                maxBetB
              )})</label>
              <input id="showPretulBetB" class="text-input compact-input" type="number" min="0" step="10" value="${roundState.betTeamB}" data-show-pretul-bet-teamb>
            </div>
          </div>
          <label class="show-info-label spaced" for="showPretulRealPrice">Real price</label>
          <input id="showPretulRealPrice" class="text-input compact-input" type="number" min="0" step="1" value="${roundState.realPrice}" data-show-pretul-real-price>
          <div class="show-action-footer">
            <button class="primary-btn" type="button" data-show-action="pretul-evaluate">Detect winner & apply</button>
            ${minimal ? "" : '<button class="secondary-btn" type="button" data-show-action="pretul-reset-used">Reset used items</button>'}
          </div>
        </article>
        <div class="show-control-card">
          ${renderShowPlayerSelectionBlock("teamA", playerSelectionOptions)}
          ${renderShowPlayerSelectionBlock("teamB", playerSelectionOptions)}
        </div>
      </div>
      ${minimal ? "" : renderShowActionFooter()}
    `;
  }

  if (gameId === "film-joc-franciza-fun-fact") {
    const roundState = getOrCreateFilmRoundState();
    const item = state.filmGame.items.find((entry) => entry.id === roundState.selectedItemId);
    const breakdown = getFilmRoundBreakdown(roundState, roundState.betAmount);
    const maxBet = getMaxBetAmount(state.teams[roundState.teamKey].money, "film-joc-franciza-fun-fact");
    const itemOptions = state.filmGame.items
      .map((entry) => {
        const isUsed = roundState.usedItemIds.includes(entry.id);
        return `<option value="${entry.id}" ${roundState.selectedItemId === entry.id ? "selected" : ""} ${
          isUsed ? "disabled" : ""
        }>${escapeHtml(entry.title)}${isUsed ? " (USED)" : ""}</option>`;
      })
      .join("");
    const formatComponent = (key, label) => {
      const revealed = roundState.revealed[key] ? "Revealed" : "Hidden";
      const outcome = roundState.outcomes[key] === "correct" ? "Correct" : roundState.outcomes[key] === "wrong" ? "Wrong" : "Pending";
      return `
        <div class="show-info-card">
          <p class="show-info-label">${label}</p>
          <p class="show-info-value">${revealed}</p>
          <p class="show-info-sub">${outcome}</p>
        </div>
      `;
    };
    return `
      ${topBlock}
      <div class="show-round-card">
        <p class="show-info-label">Round Card</p>
        <p class="show-round-title">${escapeHtml(item?.title || "No round item selected")}</p>
        <p class="show-round-copy">Component score: ${breakdown.totalPoints}/${breakdown.maxPoints} | Correct: ${breakdown.correctCount}/3</p>
      </div>
      <div class="show-info-grid">
        ${formatComponent("character", "Character / Title")}
        ${formatComponent("franchise", "Franchise")}
        ${formatComponent("funFact", "Fun Fact")}
      </div>
      <div class="show-overlay-grid two-col">
        <article class="show-control-card">
          <h3>Round Controls</h3>
          <label class="show-info-label" for="showFilmTeam">Playing team</label>
          <select id="showFilmTeam" class="text-input" data-show-film-team>
            <option value="teamA" ${roundState.teamKey === "teamA" ? "selected" : ""}>${escapeHtml(state.teams.teamA.name)}</option>
            <option value="teamB" ${roundState.teamKey === "teamB" ? "selected" : ""}>${escapeHtml(state.teams.teamB.name)}</option>
          </select>

          <label class="show-info-label spaced" for="showFilmItem">Round item</label>
          <select id="showFilmItem" class="text-input" data-show-film-item>${itemOptions}</select>

          <label class="show-info-label spaced" for="showFilmBet">Bet (max ${formatMoney(maxBet)})</label>
          <input id="showFilmBet" class="text-input compact-input" type="number" min="0" step="10" value="${roundState.betAmount}" data-show-film-bet>

          <div class="show-mini-grid">
            <button class="pill-btn" type="button" data-show-film-reveal="character">Reveal Character/Title</button>
            <button class="pill-btn" type="button" data-show-film-reveal="franchise">Reveal Franchise</button>
            <button class="pill-btn" type="button" data-show-film-reveal="funFact">Reveal Fun Fact</button>
          </div>

          <div class="show-mini-grid">
            <button class="pill-btn" type="button" data-show-film-outcome="character:correct">Character Correct</button>
            <button class="pill-btn" type="button" data-show-film-outcome="character:wrong">Character Wrong</button>
            <button class="pill-btn" type="button" data-show-film-outcome="franchise:correct">Franchise Correct</button>
            <button class="pill-btn" type="button" data-show-film-outcome="franchise:wrong">Franchise Wrong</button>
            <button class="pill-btn" type="button" data-show-film-outcome="funFact:correct">Fun Fact Correct</button>
            <button class="pill-btn" type="button" data-show-film-outcome="funFact:wrong">Fun Fact Wrong</button>
          </div>

          <div class="show-action-footer">
            <button class="primary-btn" type="button" data-show-action="film-apply">Apply round result</button>
            ${minimal ? "" : '<button class="secondary-btn" type="button" data-show-action="film-reset-used">Reset used rounds</button>'}
          </div>
        </article>
        ${renderShowPlayerSelectionBlock(roundState.teamKey, playerSelectionOptions)}
      </div>
      ${minimal ? "" : renderShowActionFooter()}
    `;
  }

  if (gameId === "cel-mai-bun-samsar") {
    const roundNumber = getSamsarRoundNumber();
    const roundState = getOrCreateSamsarRoundState(roundNumber);
    const template = state.samsarGame.roundsData[roundNumber - 1] || {
      personaTitle: "Persona demo",
      personaRequirements: "Cerintele pentru aceasta persona apar aici."
    };
    const playerA = state.teams.teamA.players.find((player) => player.id === roundState.activePlayerTeamAId);
    const playerB = state.teams.teamB.players.find((player) => player.id === roundState.activePlayerTeamBId);
    const optionsA = ['<option value="">Select active</option>']
      .concat(
        state.teams.teamA.players
          .filter((player) => player.status === "available")
          .map(
            (player) =>
              `<option value="${player.id}" ${roundState.activePlayerTeamAId === player.id ? "selected" : ""}>${escapeHtml(
                player.name
              )}</option>`
          )
      )
      .join("");
    const optionsB = ['<option value="">Select active</option>']
      .concat(
        state.teams.teamB.players
          .filter((player) => player.status === "available")
          .map(
            (player) =>
              `<option value="${player.id}" ${roundState.activePlayerTeamBId === player.id ? "selected" : ""}>${escapeHtml(
                player.name
              )}</option>`
          )
      )
      .join("");

    return `
      ${topBlock}
      <div class="show-round-card">
        <p class="show-info-label">Persona</p>
        <p class="show-round-title">${escapeHtml(template.personaTitle)}</p>
        <p class="show-round-copy">${escapeHtml(template.personaRequirements)}</p>
      </div>
      <div class="show-info-grid">
        <div class="show-info-card">
          <p class="show-info-label">${escapeHtml(state.teams.teamA.name)} active</p>
          <p class="show-info-value">${escapeHtml(playerA?.name || "Not selected")}</p>
          <p class="show-info-sub">Score: ${roundState.scoreTeamA}</p>
        </div>
        <div class="show-info-card">
          <p class="show-info-label">${escapeHtml(state.teams.teamB.name)} active</p>
          <p class="show-info-value">${escapeHtml(playerB?.name || "Not selected")}</p>
          <p class="show-info-sub">Score: ${roundState.scoreTeamB}</p>
        </div>
      </div>
      <div class="show-overlay-grid two-col">
        <article class="show-control-card">
          <h3>Samsar Controls</h3>
          <label class="show-info-label" for="showSamsarPlayerA">${escapeHtml(state.teams.teamA.name)} active player</label>
          <select id="showSamsarPlayerA" class="text-input" data-show-samsar-player-teama>${optionsA}</select>
          <label class="show-info-label spaced" for="showSamsarPlayerB">${escapeHtml(state.teams.teamB.name)} active player</label>
          <select id="showSamsarPlayerB" class="text-input" data-show-samsar-player-teamb>${optionsB}</select>
          <div class="show-mini-grid">
            <div>
              <label class="show-info-label" for="showSamsarScoreA">Score Team 1</label>
              <input id="showSamsarScoreA" class="text-input compact-input" type="number" min="0" step="1" value="${roundState.scoreTeamA}" data-show-samsar-score-teama>
            </div>
            <div>
              <label class="show-info-label" for="showSamsarScoreB">Score Team 2</label>
              <input id="showSamsarScoreB" class="text-input compact-input" type="number" min="0" step="1" value="${roundState.scoreTeamB}" data-show-samsar-score-teamb>
            </div>
          </div>
          <div class="show-action-footer">
            <button class="primary-btn" type="button" data-show-action="samsar-apply">Apply result</button>
            ${minimal ? "" : '<button class="secondary-btn" type="button" data-show-action="go-reveal">Go reveal</button>'}
          </div>
        </article>
      </div>
      ${minimal ? "" : renderShowActionFooter()}
    `;
  }

  if (isManualMatchGame(gameId)) {
    const manualGameId = getCurrentManualMatchGame();
    const roundState = getOrCreateManualMatchRoundState(manualGameId, state.progress.currentRound);
    const settlement = calculateManualMatchSettlement(manualGameId, roundState);
    const maxBetA = getMaxBetAmount(state.teams.teamA.money, manualGameId);
    const maxBetB = getMaxBetAmount(state.teams.teamB.money, manualGameId);
    const winnerLabel =
      settlement.winner === "teamA"
        ? state.teams.teamA.name
        : settlement.winner === "teamB"
          ? state.teams.teamB.name
          : "Draw";
    const capLine = `Bet cap: ${escapeHtml(state.teams.teamA.name)} ${formatMoney(maxBetA)} | ${escapeHtml(
      state.teams.teamB.name
    )} ${formatMoney(maxBetB)}`;
    const shotFakeLine =
      manualGameId === "shot-fake"
        ? `<p class="show-round-copy">Shot Fake transfer preview: ${formatMoney(settlement.specialTransfer)} (x${roundState.shotFake.multiplier}, active ${settlement.activeCountA} vs ${settlement.activeCountB}).</p>`
        : "";
    const sideBetsBlock =
      manualGameId === "shot-fake"
        ? `
          <div class="show-sidebets">
            <div class="show-player-head">
              <p class="show-info-label">Side bets</p>
              <button class="pill-btn" type="button" data-show-action="manual-sidebet-add">Add side bet</button>
            </div>
            ${roundState.shotFake.sideBets
              .map((sideBet) => {
                return `
                  <div class="show-sidebet-row" data-show-shot-sidebet-id="${sideBet.id}">
                    <input class="text-input" data-show-shot-sidebet-label value="${escapeHtml(sideBet.label)}">
                    <input class="text-input compact-input" data-show-shot-sidebet-amount type="number" min="0" step="10" value="${sideBet.amount}">
                    <select class="text-input compact-input" data-show-shot-sidebet-winner>
                      <option value="draw" ${sideBet.winner === "draw" ? "selected" : ""}>Draw</option>
                      <option value="teamA" ${sideBet.winner === "teamA" ? "selected" : ""}>Team 1</option>
                      <option value="teamB" ${sideBet.winner === "teamB" ? "selected" : ""}>Team 2</option>
                    </select>
                    <button class="pill-btn" type="button" data-show-action="manual-sidebet-remove" data-sidebet-id="${sideBet.id}">Remove</button>
                  </div>
                `;
              })
              .join("")}
          </div>
        `
        : "";
    return `
      ${topBlock}
      <div class="show-round-card">
        <p class="show-info-label">${escapeHtml(getGameLabel(manualGameId))}</p>
        <p class="show-round-title">${escapeHtml(state.teams.teamA.name)} ${roundState.scoreTeamA} - ${roundState.scoreTeamB} ${escapeHtml(state.teams.teamB.name)}</p>
        <p class="show-round-copy">Winner preview: ${escapeHtml(winnerLabel)} | Bets: ${formatMoney(settlement.effectiveBetA)} / ${formatMoney(settlement.effectiveBetB)}</p>
        <p class="show-round-copy">${capLine}</p>
        ${shotFakeLine}
      </div>
      <div class="show-overlay-grid two-col">
        <article class="show-control-card">
          <h3>Manual Match Controls</h3>
          <label class="show-info-label" for="showManualGame">Game</label>
          <select id="showManualGame" class="text-input" data-show-manual-game>
            <option value="guess-right-order" ${manualGameId === "guess-right-order" ? "selected" : ""}>Guess the Right Order</option>
            <option value="beer-pong" ${manualGameId === "beer-pong" ? "selected" : ""}>Beer Pong</option>
            <option value="shot-fake" ${manualGameId === "shot-fake" ? "selected" : ""}>Shot Fake</option>
          </select>
          <label class="show-info-label spaced" for="showManualRound">Round</label>
          <input id="showManualRound" class="text-input compact-input" type="number" min="1" step="1" value="${state.progress.currentRound}" data-show-manual-round>
          <div class="show-mini-grid">
            <div>
              <label class="show-info-label" for="showManualScoreA">${escapeHtml(state.teams.teamA.name)} score</label>
              <input id="showManualScoreA" class="text-input compact-input" type="number" min="0" step="1" value="${roundState.scoreTeamA}" data-show-manual-score-teama>
            </div>
            <div>
              <label class="show-info-label" for="showManualScoreB">${escapeHtml(state.teams.teamB.name)} score</label>
              <input id="showManualScoreB" class="text-input compact-input" type="number" min="0" step="1" value="${roundState.scoreTeamB}" data-show-manual-score-teamb>
            </div>
            <div>
              <label class="show-info-label" for="showManualBetA">${escapeHtml(state.teams.teamA.name)} bet (max ${formatMoney(
                maxBetA
              )})</label>
              <input id="showManualBetA" class="text-input compact-input" type="number" min="0" step="10" max="${maxBetA}" value="${roundState.betTeamA}" data-show-manual-bet-teama>
            </div>
            <div>
              <label class="show-info-label" for="showManualBetB">${escapeHtml(state.teams.teamB.name)} bet (max ${formatMoney(
                maxBetB
              )})</label>
              <input id="showManualBetB" class="text-input compact-input" type="number" min="0" step="10" max="${maxBetB}" value="${roundState.betTeamB}" data-show-manual-bet-teamb>
            </div>
          </div>
          ${
            manualGameId === "shot-fake"
              ? `
            <div class="show-mini-grid">
              <div>
                <label class="show-info-label" for="showShotFakeMultiplier">Multiplier x</label>
                <input id="showShotFakeMultiplier" class="text-input compact-input" type="number" min="0" step="1" value="${roundState.shotFake.multiplier}" data-show-shot-multiplier>
              </div>
              <div>
                <label class="show-info-label" for="showShotAdjustA">Manual adjust Team 1</label>
                <input id="showShotAdjustA" class="text-input compact-input" type="number" step="10" value="${roundState.shotFake.manualAdjustTeamA}" data-show-shot-adjust-teama>
              </div>
              <div>
                <label class="show-info-label" for="showShotAdjustB">Manual adjust Team 2</label>
                <input id="showShotAdjustB" class="text-input compact-input" type="number" step="10" value="${roundState.shotFake.manualAdjustTeamB}" data-show-shot-adjust-teamb>
              </div>
            </div>
            ${sideBetsBlock}
          `
              : ""
          }
          <div class="show-action-footer">
            <button class="primary-btn" type="button" data-show-action="manual-apply">Apply result</button>
          </div>
        </article>
        <div class="show-control-card">
          ${renderShowPlayerSelectionBlock("teamA", playerSelectionOptions)}
          ${renderShowPlayerSelectionBlock("teamB", playerSelectionOptions)}
        </div>
      </div>
      ${minimal ? "" : renderShowActionFooter()}
    `;
  }

  if (gameId === "curse-de-cai") {
    const roundState = getOrCreateCurseRoundState(state.progress.currentRound);
    const maxBetA = getMaxBetAmount(state.teams.teamA.money, "curse-de-cai");
    const maxBetB = getMaxBetAmount(state.teams.teamB.money, "curse-de-cai");
    const totalBetA = getCurseTeamBetTotal(roundState, "teamA");
    const totalBetB = getCurseTeamBetTotal(roundState, "teamB");
    const overCapA = totalBetA > maxBetA;
    const overCapB = totalBetB > maxBetB;
    const horsePositions = state.curseRace.horses.map((horse) => ({
      horse,
      position: Math.max(0, Math.round(sanitizeNumber(roundState.positions?.[horse.id], 0)))
    }));
    horsePositions.sort((left, right) => right.position - left.position);
    const leader = horsePositions[0];
    const winnerHorse = state.curseRace.horses.find((horse) => horse.id === roundState.winnerHorseId);
    const horseOptions = state.curseRace.horses
      .map(
        (horse) =>
          `<option value="${horse.id}" ${roundState.moveHorseId === horse.id ? "selected" : ""}>${escapeHtml(horse.symbol)} ${escapeHtml(
            horse.name
          )}</option>`
      )
      .join("");
    const bettorOptionsA = getCurseBettorOptions("teamA")
      .map((option) => `<option value="${option.id}" ${roundState.bets.teamA.bettorId === option.id ? "selected" : ""}>${escapeHtml(option.label)}</option>`)
      .join("");
    const bettorOptionsB = getCurseBettorOptions("teamB")
      .map((option) => `<option value="${option.id}" ${roundState.bets.teamB.bettorId === option.id ? "selected" : ""}>${escapeHtml(option.label)}</option>`)
      .join("");
    return `
      ${topBlock}
      <div class="show-round-card">
        <p class="show-info-label">Race Status</p>
        <p class="show-round-title">${winnerHorse ? `Winner: ${winnerHorse.symbol} ${winnerHorse.name}` : "Race in progress"}</p>
        <p class="show-round-copy">Leader: ${leader ? `${leader.horse.symbol} ${leader.horse.name} (${leader.position}/${state.curseRace.trackLength})` : "No movement yet"}.</p>
      </div>
      <div class="show-info-grid">
        <div class="show-info-card">
          <p class="show-info-label">${escapeHtml(state.teams.teamA.name)} bet total</p>
          <p class="show-info-value">${formatMoney(totalBetA)}</p>
          <p class="show-info-sub ${overCapA ? "is-error" : ""}">Max ${formatMoney(maxBetA)}</p>
        </div>
        <div class="show-info-card">
          <p class="show-info-label">${escapeHtml(state.teams.teamB.name)} bet total</p>
          <p class="show-info-value">${formatMoney(totalBetB)}</p>
          <p class="show-info-sub ${overCapB ? "is-error" : ""}">Max ${formatMoney(maxBetB)}</p>
        </div>
      </div>
      <div class="show-overlay-grid two-col">
        <article class="show-control-card">
          <h3>Race Controls</h3>
          <label class="show-info-label" for="showCurseRound">Round</label>
          <input id="showCurseRound" class="text-input compact-input" type="number" min="1" step="1" value="${state.progress.currentRound}" data-show-curse-round>
          <div class="show-mini-grid">
            <div>
              <label class="show-info-label" for="showCurseHorse">Horse</label>
              <select id="showCurseHorse" class="text-input compact-input" data-show-curse-move-horse>${horseOptions}</select>
            </div>
            <div>
              <label class="show-info-label" for="showCurseSteps">Steps</label>
              <input id="showCurseSteps" class="text-input compact-input" type="number" min="1" step="1" value="${roundState.moveSteps}" data-show-curse-move-steps>
            </div>
          </div>
          <div class="show-action-footer">
            <button class="secondary-btn" type="button" data-show-action="curse-move">Move horse</button>
            <button class="primary-btn" type="button" data-show-action="curse-apply">Apply payout</button>
            <button class="secondary-btn" type="button" data-show-action="curse-reset">Reset race</button>
          </div>

          <label class="show-info-label spaced" for="showCurseBettorA">${escapeHtml(state.teams.teamA.name)} bettor</label>
          <select id="showCurseBettorA" class="text-input compact-input" data-show-curse-bettor-teama>
            <option value="">No bettor principal</option>${bettorOptionsA}
          </select>
          <label class="show-info-label spaced" for="showCurseBettorB">${escapeHtml(state.teams.teamB.name)} bettor</label>
          <select id="showCurseBettorB" class="text-input compact-input" data-show-curse-bettor-teamb>
            <option value="">No bettor principal</option>${bettorOptionsB}
          </select>
        </article>
        <article class="show-control-card">
          <h3>Horse Bets</h3>
          <p class="show-control-note">Bet cap: ${escapeHtml(state.teams.teamA.name)} ${formatMoney(maxBetA)} | ${escapeHtml(
            state.teams.teamB.name
          )} ${formatMoney(maxBetB)}</p>
          <div class="show-bet-list">
            ${state.curseRace.horses
              .map((horse) => {
                const betA = normalizeOptionalBetAmount(roundState.bets.teamA.horseBets[horse.id]);
                const betB = normalizeOptionalBetAmount(roundState.bets.teamB.horseBets[horse.id]);
                return `
                  <div class="show-bet-row">
                    <p class="show-info-sub">${escapeHtml(horse.symbol)} ${escapeHtml(horse.name)}</p>
                    <input class="text-input compact-input" type="number" min="0" step="10" max="${maxBetA}" value="${betA}" data-show-curse-bet data-team="teamA" data-horse-id="${horse.id}">
                    <input class="text-input compact-input" type="number" min="0" step="10" max="${maxBetB}" value="${betB}" data-show-curse-bet data-team="teamB" data-horse-id="${horse.id}">
                  </div>
                `;
              })
              .join("")}
          </div>
        </article>
      </div>
      <div class="show-overlay-grid two-col">
        ${renderShowPlayerSelectionBlock("teamA", playerSelectionOptions)}
        ${renderShowPlayerSelectionBlock("teamB", playerSelectionOptions)}
      </div>
      ${minimal ? "" : renderShowActionFooter()}
    `;
  }

  return `
    ${topBlock}
    <p class="show-round-copy">Continutul rundei pentru ${escapeHtml(getGameLabel(gameId))} apare aici.</p>
    ${minimal ? "" : renderShowActionFooter()}
  `;
}

function renderFlowActionButtons(buttons) {
  if (!Array.isArray(buttons) || buttons.length === 0) {
    return "";
  }
  return `
    <div class="show-action-footer show-flow-actions">
      ${buttons
        .map((button) => {
          const tone = button.tone || "secondary-btn";
          return `<button class="${tone}" type="button" data-show-action="${button.action}">${escapeHtml(button.label)}</button>`;
        })
        .join("")}
    </div>
  `;
}

function renderLiveRoundFlowRail(gameId, liveStep) {
  const flowStates = getGameFlowStates(gameId);
  const stepButtons = flowStates.map((stateEntry) => {
    const stepId = stateEntry.id;
    const isActive = stepId === liveStep ? "is-active" : "";
    return `
      <button class="show-step-btn ${isActive}" type="button" data-show-action="live-step-${stepId}">
        ${escapeHtml(stateEntry.label)}
      </button>
    `;
  }).join("");
  return `
    <div class="show-step-rail">
      <p class="show-info-label">Mini-Game Flow</p>
      <div class="show-step-buttons">${stepButtons}</div>
      <p class="show-control-note">${escapeHtml(getLiveStepDescription(gameId, liveStep))}</p>
      <p class="show-control-note">Payout: ${escapeHtml(getLiveStepLabel(gameId, getFlowPayoutStateId(gameId)))} | ${escapeHtml(
        getFlowRoundReturn(gameId)
      )}</p>
      <p class="show-control-note">Game end: ${escapeHtml(getFlowGameEndRule(gameId))}</p>
    </div>
  `;
}

function renderGameFlowBlueprint(gameId, liveStep) {
  const states = getGameFlowStates(gameId);
  const stateRows = states
    .map((stateEntry, index) => {
      const isActive = stateEntry.id === liveStep ? "is-active" : "";
      const isPayout = stateEntry.payout === true ? "is-payout" : "";
      return `
        <article class="show-flow-state ${isActive} ${isPayout}">
          <p class="show-info-label">Step ${index + 1}</p>
          <p class="show-info-value">${escapeHtml(stateEntry.label)}</p>
          <p class="show-info-sub">${escapeHtml(stateEntry.description)}</p>
          <p class="show-info-sub">Visible: ${escapeHtml((stateEntry.visible || []).join(", "))}</p>
          <p class="show-info-sub">Actions: ${escapeHtml((stateEntry.actions || []).join(", "))}</p>
          <p class="show-info-sub">${stateEntry.payout ? "Payout triggers here." : "No payout on this step."}</p>
        </article>
      `;
    })
    .join("");

  return `
    <article class="show-flow-blueprint">
      <h3>${escapeHtml(getGameLabel(gameId))} Flow Blueprint</h3>
      <div class="show-flow-grid">${stateRows}</div>
      <p class="show-control-note"><strong>Payout:</strong> ${escapeHtml(getLiveStepLabel(gameId, getFlowPayoutStateId(gameId)))}</p>
      <p class="show-control-note"><strong>Round return:</strong> ${escapeHtml(getFlowRoundReturn(gameId))}</p>
      <p class="show-control-note"><strong>Game return:</strong> ${escapeHtml(getFlowGameEndRule(gameId))}</p>
    </article>
  `;
}

function renderFlowStateCapabilities(gameId, liveStep) {
  const flowState = getGameFlowState(gameId, liveStep);
  if (!flowState) {
    return "";
  }

  const visible = Array.isArray(flowState.visible) ? flowState.visible : [];
  const actions = Array.isArray(flowState.actions) ? flowState.actions : [];
  const chips = (items) => items.map((item) => `<span class="show-flow-chip">${escapeHtml(item)}</span>`).join("");

  return `
    <article class="show-flow-capabilities">
      <h3>${escapeHtml(flowState.label)} / Live view</h3>
      <p class="show-control-note">${escapeHtml(flowState.description || "")}</p>
      <div class="show-flow-cap-grid">
        <div>
          <p class="show-info-label">On screen now</p>
          <div class="show-flow-chip-row">${chips(visible)}</div>
        </div>
        <div>
          <p class="show-info-label">Allowed actions now</p>
          <div class="show-flow-chip-row">${chips(actions)}</div>
        </div>
      </div>
      <p class="show-control-note">${
        flowState.payout ? "Payout is executed on this state." : "Payout is not executed on this state."
      }</p>
    </article>
  `;
}

function buildLiveRoundExperienceContent(gameId, liveStep) {
  return `
    <section class="show-game-experience show-game-${escapeHtml(gameId)}">
      ${buildLiveRoundFocusContent(gameId, liveStep)}
    </section>
  `;
}

function buildLiveRoundFocusContent(gameId, liveStep) {
  if (gameId === "trivia") {
    const roundState = getOrCreateTriviaRoundState();
    const playingTeam = state.teams[roundState.teamKey];
    const maxBet = getMaxBetAmount(playingTeam.money, "trivia");
    const triviaBet = normalizeBetAmount(
      roundState.betAmount || elements.triviaBetAmountInput?.value || 100
    );
    const categoryId =
      liveStep === "result-screen" && roundState.resultCategoryId
        ? roundState.resultCategoryId
        : roundState.selectedCategoryId;
    const category = state.trivia.categories.find((entry) => entry.id === categoryId);
    const options = getTriviaCategoryOptions(category);
    const correctIndex = getTriviaCorrectOptionIndex(category);
    const selectedOptionIndex =
      liveStep === "result-screen" ? roundState.lockedOptionIndex : roundState.selectedOptionIndex;
    const selectedOptionText =
      selectedOptionIndex >= 0 && selectedOptionIndex < options.length ? options[selectedOptionIndex] : "";
    const betPresets = Array.from(
      new Set(
        [
          BET_ROUNDING_STEP,
          Math.round(maxBet * 0.25),
          Math.round(maxBet * 0.5),
          Math.round(maxBet * 0.75),
          maxBet
        ]
          .map((amount) => normalizeBetAmount(amount))
          .filter((amount) => amount > 0 && amount <= maxBet)
      )
    ).sort((left, right) => left - right);

    if (liveStep === "topic-select") {
      const topicTiles = state.trivia.categories
        .map((entry) => {
          const isUsed = roundState.usedCategoryIds.includes(entry.id);
          const isSelected = entry.id === roundState.selectedCategoryId;
          const statusLabel = isUsed ? "USED" : "TOPIC";
          return `
            <button class="show-trivia-topic-tile ${isSelected ? "is-selected" : ""}" type="button" data-show-trivia-topic="${
              entry.id
            }" ${isUsed ? "disabled" : ""}>
              <span class="show-trivia-topic-status ${isUsed ? "is-used" : ""}">${statusLabel}</span>
              <span class="show-trivia-topic-title">${escapeHtml(entry.title)}</span>
            </button>
          `;
        })
        .join("");
      return `
        <div class="show-round-card show-trivia-turn-card">
          <p class="show-info-label">Active Team</p>
          <p class="show-round-title show-trivia-turn-team">${escapeHtml(playingTeam.name)}</p>
          <p class="show-round-copy">Pick one topic card.</p>
        </div>
        <div class="show-trivia-topic-grid">${topicTiles}</div>
      `;
    }

    if (liveStep === "bet-screen") {
      return `
        <article class="show-control-card show-trivia-bet-stage">
          <p class="show-info-label">Bet Screen</p>
          <p class="show-round-title show-trivia-topic-focus">${escapeHtml(category?.title || "Select topic first")}</p>
          <p class="show-round-copy show-trivia-bet-team">Team in play: ${escapeHtml(playingTeam.name)}</p>
          <div class="show-trivia-bet-core">
            <label class="show-info-label show-trivia-bet-label" for="showTriviaBetFlow">Bet amount</label>
            <input id="showTriviaBetFlow" class="text-input show-trivia-bet-input" type="number" min="0" step="10" value="${triviaBet}" data-show-trivia-bet>
            <p class="show-control-note show-trivia-bet-max">Max bet: ${formatMoney(maxBet)}</p>
          </div>
          <div class="show-trivia-bet-presets">
            ${betPresets
              .map(
                (preset) =>
                  `<button class="pill-btn show-trivia-bet-chip" type="button" data-show-trivia-bet-preset="${preset}">${formatMoney(
                    preset
                  )}</button>`
              )
              .join("")}
          </div>
        </article>
      `;
    }

    if (liveStep === "question-screen") {
      return `
        <section class="show-trivia-qa-stage">
          <p class="show-info-label">Question Round</p>
          <p class="show-round-title">${escapeHtml(category?.title || "No topic selected")}</p>
          <p class="show-round-copy show-trivia-question">${escapeHtml(category?.question || "Select a topic to continue.")}</p>
          <div class="show-trivia-options-grid">
            ${options
              .map((option, index) => {
                const selected = selectedOptionIndex === index ? "is-selected" : "";
                return `
                  <button class="show-trivia-answer-btn ${selected}" type="button" data-show-trivia-option="${index}">
                    <span>${String.fromCharCode(65 + index)}</span>
                    <span>${escapeHtml(option)}</span>
                  </button>
                `;
              })
              .join("")}
          </div>
        </section>
      `;
    }

    const deltaLabel =
      roundState.lastDelta >= 0
        ? `+${formatMoney(roundState.lastDelta)}`
        : `-${formatMoney(Math.abs(roundState.lastDelta))}`;
    const verdictLabel =
      roundState.isCorrect === true
        ? "CORECT"
        : roundState.isCorrect === false
          ? "GRESIT"
          : "RESULT PENDING";
    const verdictTone = roundState.isCorrect === true ? "is-correct" : roundState.isCorrect === false ? "is-wrong" : "";
    const deltaTone = roundState.lastDelta >= 0 ? "is-positive" : "is-negative";
    return `
      <div class="show-round-card show-trivia-result-stage ${verdictTone}">
        <p class="show-trivia-verdict">${verdictLabel}</p>
        <div class="show-trivia-answer-compare">
          <p class="show-info-label">Selected</p>
          <p class="show-round-copy">${escapeHtml(selectedOptionText || "No answer selected")}</p>
        </div>
        <div class="show-trivia-answer-compare">
          <p class="show-info-label">Correct</p>
          <p class="show-round-copy">${escapeHtml(options[correctIndex] || category?.answer || "N/A")}</p>
        </div>
        <p class="show-trivia-delta ${deltaTone}">${deltaLabel}</p>
        <p class="show-round-copy">${escapeHtml(playingTeam.name)} now has ${formatMoney(playingTeam.money)}.</p>
      </div>
    `;
  }
  if (gameId === "pretul-corect") {
    const roundState = getOrCreatePretulRoundState();
    const item = state.pretul.items.find((entry) => entry.id === roundState.selectedItemId);
    const diffA = Math.abs(roundState.answerTeamA - roundState.realPrice);
    const diffB = Math.abs(roundState.answerTeamB - roundState.realPrice);
    const winnerLabel =
      diffA < diffB ? state.teams.teamA.name : diffB < diffA ? state.teams.teamB.name : "Tie (equal distance)";

    if (liveStep === "item-brief") {
      return `
        <div class="show-round-card">
          <p class="show-info-label">Item brief</p>
          <p class="show-round-title">${escapeHtml(item?.name || "Selecteaza item")}</p>
          <p class="show-round-copy">Set both bets before answer phase. Lineup comes from Game Intro.</p>
        </div>
      `;
    }

    if (liveStep === "estimate-live") {
      return `
        <div class="show-round-card">
          <p class="show-info-label">Estimate live</p>
          <p class="show-round-title">${escapeHtml(state.teams.teamA.name)} ${formatMoney(roundState.answerTeamA)} | ${escapeHtml(
            state.teams.teamB.name
          )} ${formatMoney(roundState.answerTeamB)}</p>
          <p class="show-round-copy">Real price set: ${formatMoney(roundState.realPrice)}.</p>
        </div>
      `;
    }

    return `
      <div class="show-round-card">
        <p class="show-info-label">Confirm winner</p>
        <p class="show-round-title">${escapeHtml(item?.name || "Selecteaza item")}</p>
        <p class="show-round-copy">Auto winner: ${escapeHtml(winnerLabel)}.</p>
        <p class="show-round-copy">${escapeHtml(state.teams.teamA.name)} distance ${formatMoney(diffA)} | ${escapeHtml(
          state.teams.teamB.name
        )} distance ${formatMoney(diffB)}</p>
      </div>
    `;
  }
  if (gameId === "film-joc-franciza-fun-fact") {
    const roundState = getOrCreateFilmRoundState();
    const item = state.filmGame.items.find((entry) => entry.id === roundState.selectedItemId);
    const breakdown = getFilmRoundBreakdown(roundState, roundState.betAmount);

    if (liveStep === "round-brief") {
      return `
        <div class="show-round-card">
          <p class="show-info-label">Round brief</p>
          <p class="show-round-title">${escapeHtml(item?.title || "Selecteaza item")}</p>
          <p class="show-round-copy">Set team and bet before reveals. Lineup stays from Game Intro.</p>
        </div>
      `;
    }

    if (liveStep === "clue-reveal") {
      return `
        <div class="show-round-card">
          <p class="show-info-label">Clue reveal</p>
          <p class="show-round-title">${escapeHtml(item?.title || "Selecteaza item")}</p>
          <p class="show-round-copy">Reveal Character/Title, Franchise, then Fun Fact.</p>
          <p class="show-round-copy">Current reveals: ${
            roundState.revealed.character ? "Character " : ""
          }${roundState.revealed.franchise ? "Franchise " : ""}${roundState.revealed.funFact ? "Fun Fact" : ""}</p>
        </div>
      `;
    }

    return `
      <div class="show-round-card">
        <p class="show-info-label">Component judge</p>
        <p class="show-round-title">${escapeHtml(item?.title || "Selecteaza item")}</p>
        <p class="show-round-copy">Scor componente: ${breakdown.totalPoints}/${breakdown.maxPoints} | corecte ${breakdown.correctCount}/3.</p>
        <p class="show-round-copy">Bet is active only with minimum 2/3 correct.</p>
      </div>
    `;
  }
  if (gameId === "cel-mai-bun-samsar") {
    const roundNumber = getSamsarRoundNumber();
    const roundState = getOrCreateSamsarRoundState(roundNumber);
    const template = state.samsarGame.roundsData[roundNumber - 1];

    if (liveStep === "persona-brief") {
      return `
        <div class="show-round-card">
          <p class="show-info-label">Persona brief</p>
          <p class="show-round-title">${escapeHtml(template?.personaTitle || "Persona runda")}</p>
          <p class="show-round-copy">${escapeHtml(template?.personaRequirements || "Completeaza cerintele pentru persona.")}</p>
        </div>
      `;
    }

    if (liveStep === "negotiation-live") {
      return `
        <div class="show-round-card">
          <p class="show-info-label">Negotiation live</p>
          <p class="show-round-title">${escapeHtml(template?.personaTitle || "Persona runda")}</p>
          <p class="show-round-copy">Ruleaza duelul live, apoi introdu scorurile in etapa de judge.</p>
        </div>
      `;
    }

    return `
      <div class="show-round-card">
        <p class="show-info-label">Score judge</p>
        <p class="show-round-title">${escapeHtml(state.teams.teamA.name)} ${roundState.scoreTeamA} - ${roundState.scoreTeamB} ${escapeHtml(
          state.teams.teamB.name
        )}</p>
        <p class="show-round-copy">Higher score wins. Equal score is draw.</p>
      </div>
    `;
  }
  if (isManualMatchGame(gameId)) {
    const manualGameId = gameId;
    const roundState = getOrCreateManualMatchRoundState(manualGameId, state.progress.currentRound);
    const settlement = calculateManualMatchSettlement(manualGameId, roundState);

    if (liveStep === "order-brief" || liveStep === "beer-brief" || liveStep === "shot-brief") {
      return `
        <div class="show-round-card">
          <p class="show-info-label">${escapeHtml(getGameLabel(manualGameId))} setup</p>
          <p class="show-round-title">Round ${state.progress.currentRound}</p>
          <p class="show-round-copy">Set bets before live phase. Lineup stays from Game Intro.</p>
        </div>
      `;
    }

    if (liveStep === "order-live" || liveStep === "beer-live" || liveStep === "shot-live") {
      return `
        <div class="show-round-card">
          <p class="show-info-label">${escapeHtml(getGameLabel(manualGameId))} live</p>
          <p class="show-round-title">${escapeHtml(state.teams.teamA.name)} ${roundState.scoreTeamA} - ${roundState.scoreTeamB} ${escapeHtml(
            state.teams.teamB.name
          )}</p>
          <p class="show-round-copy">${
            manualGameId === "shot-fake"
              ? `Shot Fake transfer preview: ${formatMoney(settlement.specialTransfer)}.`
              : "Team-vs-team round in progress."
          }</p>
        </div>
      `;
    }

    return `
      <div class="show-round-card">
        <p class="show-info-label">${escapeHtml(getGameLabel(manualGameId))} judge</p>
        <p class="show-round-title">${escapeHtml(state.teams.teamA.name)} ${roundState.scoreTeamA} - ${roundState.scoreTeamB} ${escapeHtml(
          state.teams.teamB.name
        )}</p>
        <p class="show-round-copy">Ready to apply payout. Draw is allowed for this game.</p>
      </div>
    `;
  }
  if (gameId === "curse-de-cai") {
    const roundState = getOrCreateCurseRoundState(state.progress.currentRound);
    const winnerHorse = state.curseRace.horses.find((horse) => horse.id === roundState.winnerHorseId);

    if (liveStep === "race-brief") {
      return `
        <div class="show-round-card">
          <p class="show-info-label">Race brief</p>
          <p class="show-round-title">${state.curseRace.horses.length} horses ready</p>
          <p class="show-round-copy">Configure multi-bets and bettors, then move into race live.</p>
        </div>
      `;
    }

    if (liveStep === "race-live") {
      return `
        <div class="show-round-card">
          <p class="show-info-label">Race live</p>
          <p class="show-round-title">${winnerHorse ? `Winner set: ${winnerHorse.symbol} ${winnerHorse.name}` : "Race in progress"}</p>
          <p class="show-round-copy">Move horses manually by symbol and handle push-back collisions.</p>
        </div>
      `;
    }

    return `
      <div class="show-round-card">
        <p class="show-info-label">Settle payout</p>
        <p class="show-round-title">${winnerHorse ? `Winner: ${winnerHorse.symbol} ${winnerHorse.name}` : "Select winner by race outcome"}</p>
        <p class="show-round-copy">Only winning-horse bet pays x${state.curseRace.payoutMultiplier}. All other horse bets lose.</p>
      </div>
    `;
  }
  return `
    <div class="show-round-card">
      <p class="show-info-label">${escapeHtml(getGameLabel(gameId))}</p>
      <p class="show-round-title">${escapeHtml(getLiveStepLabel(gameId, liveStep))}</p>
      <p class="show-round-copy">${escapeHtml(getLiveStepDescription(gameId, liveStep))}</p>
    </div>
  `;
}

function buildLiveRoundQuickActions(gameId, liveStep) {
  const flowStates = getGameFlowStates(gameId);
  const firstStateId = flowStates[0]?.id;
  const payoutStateId = getFlowPayoutStateId(gameId);
  const lastStateId = flowStates[flowStates.length - 1]?.id;
  const nextStateId = getNextLiveRoundStep(gameId, liveStep);
  const prevStateId = getPrevLiveRoundStep(gameId, liveStep);
  const answerLocked = isOverlayAnswerLocked();
  const lockLabel = answerLocked ? "Unlock answer" : "Lock answer";
  const actions = [];

  if (gameId === "trivia") {
    const triviaRoundState = getOrCreateTriviaRoundState();
    const selectedCategory = state.trivia.categories.find((entry) => entry.id === triviaRoundState.selectedCategoryId);
    const isUsedCategory =
      selectedCategory && triviaRoundState.usedCategoryIds.includes(selectedCategory.id);
    const hasTopic = Boolean(selectedCategory && !isUsedCategory);
    const flowComplete = isGameFlowComplete("trivia");

    if (liveStep === "topic-select") {
      if (hasTopic) {
        actions.push({ tone: "primary-btn", action: "live-step-bet-screen", label: "Continue to Bet" });
      }
      actions.push({ tone: "secondary-btn", action: "trivia-reset-used", label: "Reset topics" });
    } else if (liveStep === "bet-screen") {
      actions.push({ tone: "primary-btn", action: "trivia-confirm-bet", label: "Confirm Bet" });
      actions.push({ tone: "secondary-btn", action: "live-step-topic-select", label: "Back to Topics" });
    } else if (liveStep === "question-screen") {
      actions.push({ tone: "primary-btn", action: "trivia-confirm-answer", label: "Confirm Answer" });
    } else if (liveStep === "result-screen") {
      actions.push({
        tone: "primary-btn",
        action: flowComplete ? "finish-game-return" : "trivia-next-topic",
        label: flowComplete ? "Finish Trivia" : "Next Topic"
      });
    }
    if (!["question-screen", "result-screen"].includes(liveStep)) {
      actions.push({ tone: "secondary-btn", action: "go-game-intro", label: "Lineup substitution" });
    }
    return renderFlowActionButtons(actions);
  }

  if (liveStep === firstStateId) {
    actions.push({
      tone: "primary-btn",
      action: "live-step-next",
      label: `Start ${getLiveStepLabel(gameId, nextStateId)}`
    });
  } else if (liveStep !== payoutStateId && liveStep !== lastStateId) {
    actions.push({
      tone: "primary-btn",
      action: "live-step-next",
      label: `Go to ${getLiveStepLabel(gameId, nextStateId)}`
    });
  } else {
    actions.push({ tone: "secondary-btn", action: "toggle-answer-lock", label: lockLabel });
    if (gameId === "trivia") {
      actions.push({ tone: "primary-btn", action: "trivia-correct", label: "Confirm correct" });
      actions.push({ tone: "danger-btn", action: "trivia-wrong", label: "Confirm wrong" });
    } else if (gameId === "pretul-corect") {
      actions.push({ tone: "primary-btn", action: "pretul-evaluate", label: "Confirm answer" });
    } else if (gameId === "film-joc-franciza-fun-fact") {
      actions.push({ tone: "primary-btn", action: "film-apply", label: "Confirm answer" });
    } else if (gameId === "cel-mai-bun-samsar") {
      actions.push({ tone: "primary-btn", action: "samsar-apply", label: "Confirm answer" });
    } else if (isManualMatchGame(gameId)) {
      actions.push({ tone: "primary-btn", action: "manual-apply", label: "Confirm answer" });
    } else if (gameId === "curse-de-cai") {
      actions.push({ tone: "primary-btn", action: "curse-apply", label: "Confirm answer" });
    }
    actions.push({ tone: "secondary-btn", action: "go-reveal", label: "Reveal" });
  }
  if (liveStep !== firstStateId && prevStateId !== liveStep) {
    actions.push({ tone: "secondary-btn", action: "live-step-prev", label: `Back to ${getLiveStepLabel(gameId, prevStateId)}` });
  }
  if (liveStep !== lastStateId && liveStep !== payoutStateId && nextStateId !== liveStep) {
    actions.push({ tone: "secondary-btn", action: "live-step-next", label: "Next step" });
  }
  actions.push({ tone: "secondary-btn", action: "go-game-intro", label: "Lineup substitution" });
  return renderFlowActionButtons(actions);
}

function buildLiveRoundHostDrawer(gameId) {
  const liveStep = getLiveRoundStep(gameId);
  const latestResult = state.progress.lastResultSummary || DEFAULT_RESULT_SUMMARY;
  return `
    <details class="show-host-drawer">
      <summary>Host / Debug panel</summary>
      <div class="show-host-drawer-content">
        <article class="show-control-card">
          <h3>Debug Snapshot</h3>
          <p class="show-control-note">Current step: ${escapeHtml(getLiveStepLabel(gameId, liveStep))}</p>
          <p class="show-control-note">Latest result: ${escapeHtml(latestResult)}</p>
        </article>
        ${renderShowJokerControl()}
        ${renderLiveRoundFlowRail(gameId, liveStep)}
        ${renderFlowStateCapabilities(gameId, liveStep)}
        ${renderGameFlowBlueprint(gameId, liveStep)}
        ${buildLegacyLiveRoundContent(gameId, { minimal: true })}
      </div>
    </details>
  `;
}

function buildLiveRoundContent(gameId) {
  const liveStep = getLiveRoundStep(gameId);
  const stageControls = renderShowStageControls(gameId, liveStep);
  const stageExperience = buildLiveRoundExperienceContent(gameId, liveStep);
  const stageActions = buildLiveRoundQuickActions(gameId, liveStep);
  return `
    <section class="show-live-screen show-shared-game-stage" data-game-stage="${escapeHtml(gameId)}">
      <div class="show-live-top-layout">
        ${renderLiveRoundTeamSummary("teamA")}
        <section class="show-live-control-hub">
          ${stageControls}
        </section>
        ${renderLiveRoundTeamSummary("teamB")}
      </div>
      <section class="show-live-stage-main">
        ${stageExperience}
      </section>
      <footer class="show-live-bottom-actions">
        ${stageActions}
      </footer>
    </section>
  `;
}

function buildShowScreenContent(screenId) {
  const gameId = state.progress.currentGame;
  const gameLabel = getGameLabel(gameId);
  const summary = state.progress.lastResultSummary || DEFAULT_RESULT_SUMMARY;

  if (screenId === "show-home") {
    const hasStarted = Boolean(state.showUi.gameNightStarted);
    const completed = getCompletedGameCount();
    const total = GAME_ORDER.length;
    const remaining = getRemainingGameCount();
    const statusLine = isGameNightComplete()
      ? "Toate jocurile sunt completate. Poti deschide End Screen."
      : hasStarted
        ? `Progres game night: ${completed}/${total} jocuri complete (${remaining} ramase).`
        : "Apasa Start Game Night pentru a intra in loop-ul global.";
    return `
      <div class="show-round-card">
        <p class="show-info-label">Game Night</p>
        <p class="show-round-title">${escapeHtml(state.settings.showTitle)}</p>
        <p class="show-round-copy">${escapeHtml(statusLine)}</p>
      </div>
      <div class="show-info-grid">
        <div class="show-info-card">
          <p class="show-info-label">${escapeHtml(state.teams.teamA.name)}</p>
          <p class="show-info-value">${formatMoney(state.teams.teamA.money)}</p>
          <p class="show-info-sub">Score: ${state.teams.teamA.score}</p>
        </div>
        <div class="show-info-card">
          <p class="show-info-label">${escapeHtml(state.teams.teamB.name)}</p>
          <p class="show-info-value">${formatMoney(state.teams.teamB.money)}</p>
          <p class="show-info-sub">Score: ${state.teams.teamB.score}</p>
        </div>
      </div>
      <div class="show-action-footer">
        <button class="primary-btn" type="button" data-show-action="start-game-night">${
          hasStarted ? "Restart Game Night" : "Start Game Night"
        }</button>
        <button class="secondary-btn" type="button" data-show-action="go-game-select">Open Game Select</button>
        <button class="secondary-btn" type="button" data-show-action="go-roster-management">Manage Players / Roster</button>
        <button class="secondary-btn" type="button" data-show-action="go-end-screen">Final End Screen</button>
      </div>
    `;
  }

  if (screenId === "game-select") {
    const completedGameIds = state.showUi.completedGameIds;
    const completedCount = completedGameIds.length;
    const totalCount = GAME_ORDER.length;
    const progressLine = `Complete: ${completedCount}/${totalCount} jocuri`;
    const gameCards = GAME_CONFIG.map((game) => {
      const isCurrent = game.id === state.progress.currentGame;
      const isDone = completedGameIds.includes(game.id);
      const currentClass = isCurrent ? "show-leader-row is-leading show-game-card" : "show-leader-row show-game-card";
      const statusLabel = isDone ? "DONE" : "READY";
      return `
        <button class="${currentClass}" type="button" data-show-select-game="${game.id}">
          <p class="show-info-label">${escapeHtml(game.label)}</p>
          <p class="show-info-value">${statusLabel}</p>
          <p class="show-info-sub">Max bet: ${game.maxBetPercent}%</p>
        </button>
      `;
    }).join("");

    return `
      <div class="show-control-card">
        <h3>Select Next Mini-Game</h3>
        <p class="show-control-note">${progressLine}</p>
        <p class="show-control-note">Alege un card de joc pentru a intra direct in flow-ul lui.</p>
      </div>
      <div class="show-leaderboard show-game-select-grid">${gameCards}</div>
      <div class="show-action-footer">
        <button class="secondary-btn" type="button" data-show-action="go-show-home">Back to Show Home</button>
        <button class="primary-btn" type="button" data-show-action="go-game-intro">Continue with current game</button>
        <button class="secondary-btn" type="button" data-show-action="go-end-screen">Open Final End Screen</button>
      </div>
    `;
  }

  if (screenId === "game-intro") {
    const maxBet = getBetPercent(gameId);
    const lineupReady = isGameLineupReady(gameId);
    const lineupHasMembers = hasAnyCurrentGameLineupMembers();
    const rules = getGameIntroRules(gameId)
      .map((line) => `<li>${escapeHtml(line)}</li>`)
      .join("");
    return `
      <div class="show-round-card">
        <p class="show-info-label">Now Playing</p>
        <p class="show-round-title">${escapeHtml(gameLabel)}</p>
        <p class="show-round-copy">Max bet cap: ${maxBet}% (rounded to ${BET_ROUNDING_STEP}).</p>
      </div>
      <ul class="show-rule-list">${rules}</ul>
      <div class="show-round-card">
        <p class="show-info-label">Game Lineup</p>
        <p class="show-round-copy">Assign tokens once for this mini-game. This lineup stays active on every round.</p>
        <p class="show-round-copy">${
          lineupReady
            ? "Lineup confirmed for this game."
            : "Lineup not confirmed yet. Confirm before entering Live Round."
        }</p>
      </div>
      ${renderShowPlayerAssignmentBoard()}
      <div class="show-action-footer">
        <button class="primary-btn" type="button" data-show-action="confirm-lineup-start" ${
          lineupHasMembers ? "" : "disabled"
        }>Confirm Lineup & Start</button>
        <button class="secondary-btn" type="button" data-show-action="go-live-round" ${
          lineupReady ? "" : "disabled"
        }>Start live round</button>
        <button class="secondary-btn" type="button" data-show-action="go-roster-management">Manage Players / Roster</button>
        <button class="secondary-btn" type="button" data-show-action="go-game-select">Change game</button>
      </div>
    `;
  }

  if (screenId === "roster-management") {
    return `
      <div class="show-round-card">
        <p class="show-info-label">Manage Players / Roster</p>
        <p class="show-round-title">Total Player Pool</p>
        <p class="show-round-copy">Use this screen to add, remove, rename, or mark players unavailable. Lineup assignment for a game stays in Game Intro.</p>
      </div>
      <div class="show-overlay-grid two-col">
        ${renderShowRosterManagementTeam("teamA")}
        ${renderShowRosterManagementTeam("teamB")}
      </div>
      <div class="show-action-footer">
        <button class="primary-btn" type="button" data-show-action="save-roster">Save roster</button>
        <button class="secondary-btn" type="button" data-show-action="go-game-intro">Back to Game Intro</button>
      </div>
    `;
  }

  if (screenId === "live-round") {
    return buildLiveRoundContent(gameId);
  }

  if (screenId === "reveal-result") {
    const gameResult = getCurrentRoundResultForShow(gameId);
    const gameFinishedByRule = isGameFlowComplete(gameId);
    const detailText =
      gameResult && gameResult !== summary
        ? gameResult
        : "Round detail is aligned with the latest summary.";
    return `
      <div class="show-round-card">
        <p class="show-info-label">Latest Outcome</p>
        <p class="show-round-title">${escapeHtml(summary)}</p>
        <p class="show-round-copy">${escapeHtml(detailText)}</p>
        <p class="show-round-copy">${escapeHtml(
          gameFinishedByRule
            ? `Game flow complete for ${getGameLabel(gameId)}. Use Finish game to return to Game Select.`
            : getFlowRoundReturn(gameId)
        )}</p>
      </div>
      <div class="show-action-footer">
        <button class="primary-btn" type="button" data-show-action="${gameFinishedByRule ? "finish-game-return" : "next-round"}">${
          gameFinishedByRule ? "Finish game" : "Next round"
        }</button>
        <button class="secondary-btn" type="button" data-show-action="go-end-of-game">End this game</button>
        <button class="secondary-btn" type="button" data-show-action="go-leaderboard">Open leaderboard</button>
        <button class="secondary-btn" type="button" data-show-action="go-live-round">Back to live round</button>
      </div>
    `;
  }

  if (screenId === "end-of-game") {
    const gameTitle = getGameLabel(gameId);
    const scoreLine = `${escapeHtml(state.teams.teamA.name)} ${state.teams.teamA.score} - ${state.teams.teamB.score} ${escapeHtml(
      state.teams.teamB.name
    )}`;
    const moneyLine = `${escapeHtml(state.teams.teamA.name)} ${formatMoney(state.teams.teamA.money)} | ${escapeHtml(
      state.teams.teamB.name
    )} ${formatMoney(state.teams.teamB.money)}`;
    let completionHint = "Finalizeaza jocul curent si revino la Game Select pentru urmatorul mini-game.";
    if (gameId === "cel-mai-bun-samsar") {
      const totalRounds = Math.max(1, state.samsarGame?.roundsData?.length || 6);
      completionHint =
        state.progress.currentRound >= totalRounds
          ? "Samsar a ajuns la finalul celor 6 runde. Poti merge direct la Game Select."
          : `Samsar are ${totalRounds} runde totale. Inca esti la runda ${state.progress.currentRound}.`;
    }
    return `
      <div class="show-round-card">
        <p class="show-info-label">End of Game</p>
        <p class="show-round-title">${escapeHtml(gameTitle)} complete</p>
        <p class="show-round-copy">${escapeHtml(completionHint)}</p>
      </div>
      <div class="show-info-grid">
        <div class="show-info-card">
          <p class="show-info-label">Score snapshot</p>
          <p class="show-info-value">${scoreLine}</p>
        </div>
        <div class="show-info-card">
          <p class="show-info-label">Money snapshot</p>
          <p class="show-info-value">${moneyLine}</p>
        </div>
      </div>
      <div class="show-action-footer">
        <button class="primary-btn" type="button" data-show-action="finish-game-return">Finish game & return to Game Select</button>
        <button class="secondary-btn" type="button" data-show-action="go-game-select">Back to Game Select</button>
        <button class="secondary-btn" type="button" data-show-action="go-end-screen">Open Final End Screen</button>
      </div>
    `;
  }

  if (screenId === "leaderboard") {
    const teams = [
      {
        key: "teamA",
        name: state.teams.teamA.name,
        money: state.teams.teamA.money,
        score: state.teams.teamA.score
      },
      {
        key: "teamB",
        name: state.teams.teamB.name,
        money: state.teams.teamB.money,
        score: state.teams.teamB.score
      }
    ].sort((left, right) => {
      if (right.money !== left.money) {
        return right.money - left.money;
      }
      return right.score - left.score;
    });

    return `
      <div class="show-leaderboard">
        ${teams
          .map((entry, index) => {
            return `
              <article class="show-leader-row ${index === 0 ? "is-leading" : ""}">
                <p class="show-info-label">${index + 1}. ${escapeHtml(entry.name)}</p>
                <p class="show-info-value">${formatMoney(entry.money)}</p>
                <p class="show-info-sub">Score: ${entry.score}</p>
              </article>
            `;
          })
          .join("")}
      </div>
      <div class="show-action-footer">
        <button class="secondary-btn" type="button" data-show-action="go-live-round">Return to live round</button>
        <button class="primary-btn" type="button" data-show-action="go-end-screen">Open end screen</button>
      </div>
    `;
  }

  if (screenId === "end-screen") {
    const winner = getEndScreenWinnerSummary();
    const players = getAwardsPlayerPool();
    const highlights = computeGeneralAwards(players).slice(0, 3);
    return `
      <div class="show-round-card">
        <p class="show-info-label">Final Winner</p>
        <p class="show-round-title">${escapeHtml(winner.title)}</p>
        <p class="show-round-copy">${escapeHtml(winner.reason)}</p>
      </div>
      <div class="show-leaderboard">
        ${highlights
          .map((card) => {
            return `
              <article class="show-leader-row">
                <p class="show-info-label">${escapeHtml(card.title)}</p>
                <p class="show-info-value">${escapeHtml(card.playerName)}</p>
                <p class="show-info-sub">${escapeHtml(card.primaryStat)}</p>
              </article>
            `;
          })
          .join("")}
      </div>
      <p class="show-round-copy">${escapeHtml(FIXED_TITLE_PLAYER_NAME)}: ${escapeHtml(FIXED_TITLE_LABEL)} (fixed title).</p>
      <div class="show-action-footer">
        <button class="secondary-btn" type="button" data-show-action="go-show-home">Back to show home</button>
      </div>
    `;
  }

  return `<p class="show-round-copy">Continutul acestui ecran va fi afisat aici.</p>`;
}

function renderHostPanelState() {
  const isOpen = Boolean(state.showUi?.hostPanelOpen);
  const isAdvanced = Boolean(state.showUi?.adminAdvancedOpen);
  document.body.classList.toggle("host-panel-open", isOpen);
  document.body.classList.toggle("host-advanced-open", isOpen && isAdvanced);

  if (elements.hostPanelOverlay) {
    elements.hostPanelOverlay.setAttribute("aria-hidden", isOpen ? "false" : "true");
  }
  if (elements.hostDrawer) {
    elements.hostDrawer.setAttribute("aria-hidden", isOpen ? "false" : "true");
  }
  if (elements.hostWorkspace) {
    elements.hostWorkspace.setAttribute("aria-hidden", isOpen && isAdvanced ? "false" : "true");
  }
  if (elements.hostPanelToggleBtn) {
    elements.hostPanelToggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }
  if (elements.hostAdminAdvancedBtn) {
    elements.hostAdminAdvancedBtn.textContent = isAdvanced ? "Hide god mode panels" : "Open god mode panels";
  }
}

function getAdminFixTeamKey() {
  if (elements.adminFixTeamSelect?.value === "teamB") {
    return "teamB";
  }
  return "teamA";
}

function renderAdminFixPlayerOptions() {
  if (!elements.adminFixPlayerSelect) {
    return;
  }

  const teamKey = getAdminFixTeamKey();
  const team = state.teams[teamKey];
  const previousValue = elements.adminFixPlayerSelect.value;

  if (!team || !Array.isArray(team.players) || team.players.length === 0) {
    elements.adminFixPlayerSelect.innerHTML = `<option value="">No players in ${escapeHtml(team?.name || "team")}</option>`;
    elements.adminFixPlayerSelect.disabled = true;
    return;
  }

  elements.adminFixPlayerSelect.disabled = false;
  elements.adminFixPlayerSelect.innerHTML = team.players
    .map(
      (player) =>
        `<option value="${escapeHtml(player.id)}">${escapeHtml(player.name)} (${escapeHtml(player.status)})</option>`
    )
    .join("");

  const isPreviousValid = team.players.some((player) => player.id === previousValue);
  elements.adminFixPlayerSelect.value = isPreviousValid ? previousValue : team.players[0].id;
}

function applyAdminTimerOverride() {
  const nextDuration = clampNumber(
    Math.round(sanitizeNumber(elements.adminTimerDurationInput?.value, state.timer.duration)),
    10,
    600
  );
  const nextRemaining = clampNumber(
    Math.round(sanitizeNumber(elements.adminTimerRemainingInput?.value, state.timer.remaining)),
    0,
    nextDuration
  );

  state.timer.duration = nextDuration;
  state.timer.remaining = nextRemaining;
  state.timer.isRunning = false;
  state.timer.lastTickMs = null;
  stopTimerLoop();
  renderTimer();
  setLastResultSummary(`Timer override applied: ${nextRemaining}s / ${nextDuration}s.`);
  renderShowUi();
  saveState("Admin timer override applied.");
}

function applyAdminPlayerFix() {
  const teamKey = getAdminFixTeamKey();
  const team = state.teams[teamKey];
  const action = String(elements.adminFixActionSelect?.value || "activate");
  const playerId = String(elements.adminFixPlayerSelect?.value || "");

  if (!team) {
    return;
  }

  if (action === "clear-all") {
    state.roundSelection.activeByTeam.teamA = [];
    state.roundSelection.activeByTeam.teamB = [];
    saveCurrentRoundSnapshot();
    renderAll();
    setLastResultSummary("Admin fix: cleared all active players.");
    saveState("Admin player fix: clear all active.");
    return;
  }

  if (action === "clear-team") {
    state.roundSelection.activeByTeam[teamKey] = [];
    saveCurrentRoundSnapshot();
    renderAll();
    setLastResultSummary(`Admin fix: cleared active players for ${team.name}.`);
    saveState("Admin player fix: clear team active.");
    return;
  }

  const player = findPlayer(teamKey, playerId);
  if (!player) {
    setLastResultSummary("Admin fix failed: player not found.");
    saveState("Admin player fix failed.");
    return;
  }

  if (action === "activate") {
    if (player.status !== "available") {
      setLastResultSummary(`Admin fix blocked: ${player.name} is ${player.status}. Set status to available first.`);
      saveState("Admin player fix blocked.");
      return;
    }

    const activeIds = state.roundSelection.activeByTeam[teamKey];
    if (!activeIds.includes(player.id) && activeIds.length >= MAX_ACTIVE_PER_TEAM) {
      setLastResultSummary(`Admin fix blocked: ${team.name} reached max ${MAX_ACTIVE_PER_TEAM} active players.`);
      saveState("Admin player fix blocked: active limit.");
      return;
    }
    if (!activeIds.includes(player.id)) {
      activeIds.push(player.id);
    }
  } else if (action === "deactivate") {
    state.roundSelection.activeByTeam.teamA = state.roundSelection.activeByTeam.teamA.filter((id) => id !== player.id);
    state.roundSelection.activeByTeam.teamB = state.roundSelection.activeByTeam.teamB.filter((id) => id !== player.id);
  } else if (action === "status-available") {
    player.status = "available";
  } else if (action === "status-bench") {
    player.status = "bench";
    state.roundSelection.activeByTeam.teamA = state.roundSelection.activeByTeam.teamA.filter((id) => id !== player.id);
    state.roundSelection.activeByTeam.teamB = state.roundSelection.activeByTeam.teamB.filter((id) => id !== player.id);
  } else if (action === "status-unavailable") {
    player.status = "unavailable";
    state.roundSelection.activeByTeam.teamA = state.roundSelection.activeByTeam.teamA.filter((id) => id !== player.id);
    state.roundSelection.activeByTeam.teamB = state.roundSelection.activeByTeam.teamB.filter((id) => id !== player.id);
  }

  saveCurrentRoundSnapshot();
  renderAll();
  setLastResultSummary(`Admin fix applied: ${action} for ${player.name} (${team.name}).`);
  saveState("Admin player fix applied.");
}

function renderHostAdminPanel() {
  if (elements.adminMoneyTeamAInput) {
    elements.adminMoneyTeamAInput.value = String(Math.max(0, Math.round(sanitizeNumber(state.teams.teamA.money, 0))));
  }
  if (elements.adminMoneyTeamBInput) {
    elements.adminMoneyTeamBInput.value = String(Math.max(0, Math.round(sanitizeNumber(state.teams.teamB.money, 0))));
  }
  if (elements.adminGameSelect) {
    elements.adminGameSelect.value = state.progress.currentGame;
  }
  if (elements.adminRoundInput) {
    elements.adminRoundInput.value = String(state.progress.currentRound);
  }
  if (elements.adminTimerDurationInput) {
    elements.adminTimerDurationInput.value = String(state.timer.duration);
  }
  if (elements.adminTimerRemainingInput) {
    elements.adminTimerRemainingInput.value = String(state.timer.remaining);
  }
  if (elements.adminFixTeamSelect) {
    const selected = getAdminFixTeamKey();
    elements.adminFixTeamSelect.innerHTML = `
      <option value="teamA">${escapeHtml(state.teams.teamA.name)}</option>
      <option value="teamB">${escapeHtml(state.teams.teamB.name)}</option>
    `;
    elements.adminFixTeamSelect.value = selected;
  }
  renderAdminFixPlayerOptions();
}

function renderShowUi() {
  ensureShowUiState();
  if (isGameLineupReady(state.progress.currentGame) && !hasAnyCurrentGameLineupMembers()) {
    setGameLineupReady(state.progress.currentGame, false);
  }

  const activeScreen = state.showUi.activeScreen;
  const isLiveRoundFocus = activeScreen === "live-round";
  const hideHudTimer = isLiveRoundFocus;

  if (elements.showShell) {
    elements.showShell.classList.toggle("is-live-round-focus", isLiveRoundFocus);
    elements.showShell.classList.toggle("hide-hud-timer", hideHudTimer);
  }

  elements.showScreenButtons.forEach((button) => {
    const target = button.dataset.showScreenTarget;
    const isActive = target === activeScreen;
    const blockedByLiveLock =
      isLiveRoundFocus &&
      !["live-round", "game-intro", "reveal-result"].includes(target);
    button.classList.toggle("is-active", isActive);
    button.disabled = blockedByLiveLock;
  });

  if (elements.showStageGameLabel) {
    elements.showStageGameLabel.textContent = getGameLabel(state.progress.currentGame);
  }
  if (elements.showStageRoundLabel) {
    elements.showStageRoundLabel.textContent = String(state.progress.currentRound);
  }
  if (elements.showStageTimer) {
    elements.showStageTimer.textContent = formatTimer(state.timer.remaining);
  }
  if (elements.showActivePlayersTeamA) {
    elements.showActivePlayersTeamA.innerHTML = getTeamLineupHudHtml("teamA");
  }
  if (elements.showActivePlayersTeamB) {
    elements.showActivePlayersTeamB.innerHTML = getTeamLineupHudHtml("teamB");
  }
  if (elements.showLatestResult) {
    elements.showLatestResult.textContent = state.progress.lastResultSummary || DEFAULT_RESULT_SUMMARY;
  }
  if (elements.showResultCard) {
    const showResultCard = activeScreen === "reveal-result";
    elements.showResultCard.classList.toggle("is-hidden", !showResultCard);
  }
  if (elements.showScreenTitle) {
    elements.showScreenTitle.textContent = getShowScreenTitle(activeScreen);
  }
  if (elements.showScreenContent) {
    elements.showScreenContent.innerHTML = buildShowScreenContent(activeScreen);
  }

  renderHostAdminPanel();
  renderHostPanelState();
}

function setHostPanelOpen(nextOpen, options = {}) {
  const persist = options.persist !== false;
  ensureShowUiState();
  state.showUi.hostPanelOpen = Boolean(nextOpen);
  if (!state.showUi.hostPanelOpen) {
    state.showUi.adminAdvancedOpen = false;
  }
  renderHostPanelState();
  if (persist) {
    saveState(state.showUi.hostPanelOpen ? "Host controls opened." : "Host controls closed.");
  }
}

function setHostAdvancedOpen(nextOpen, options = {}) {
  const persist = options.persist !== false;
  ensureShowUiState();
  state.showUi.adminAdvancedOpen = Boolean(nextOpen);
  renderHostPanelState();
  if (persist) {
    saveState(state.showUi.adminAdvancedOpen ? "God mode panels opened." : "God mode panels hidden.");
  }
}

function setShowScreen(screenId, options = {}) {
  if (!SHOW_SCREEN_IDS.includes(screenId)) {
    return;
  }
  const persist = options.persist !== false;
  const syncSection = options.syncSection !== false;
  const allowIncompleteEndScreen = options.allowIncompleteEndScreen === true;
  const source = typeof options.source === "string" ? options.source : "flow";
  const activeScreen = state.showUi?.activeScreen || "show-home";

  const blockedFromTopNavDuringLive =
    source === "top-nav" &&
    activeScreen === "live-round" &&
    !["live-round", "game-intro", "reveal-result"].includes(screenId);
  if (blockedFromTopNavDuringLive) {
    setLastResultSummary("Live round is in progress. Use in-round controls to continue the flow.");
    renderShowUi();
    if (persist) {
      saveState("Top navigation locked during live round.");
    }
    return;
  }

  if (screenId === "end-screen" && !allowIncompleteEndScreen && !isGameNightComplete()) {
    setLastResultSummary("End Screen final se deschide dupa ce termini toate jocurile.");
    screenId = "game-select";
  }
  if (screenId === "live-round" && !isGameLineupReady(state.progress.currentGame)) {
    setLastResultSummary("Confirm lineup in Game Intro before starting the round.");
    screenId = "game-intro";
  }

  ensureShowUiState();
  state.showUi.activeScreen = screenId;

  if (syncSection) {
    const linkedSection = getSectionForShowScreen(screenId);
    if (SECTION_IDS.includes(linkedSection) && state.activeSection !== linkedSection) {
      setActiveSection(linkedSection, { persist: false });
    }
  }

  renderShowUi();
  if (persist) {
    saveState(`Show screen: ${getShowScreenTitle(screenId)}.`);
  }
}

function setTeamMoneyAbsolute(teamKey, rawAmount) {
  if (!["teamA", "teamB"].includes(teamKey)) {
    return;
  }
  const normalized = Math.max(0, Math.round(sanitizeNumber(rawAmount, state.teams[teamKey].money)));
  state.teams[teamKey].money = normalized;
}

function clearActiveTeamFromOverlay(teamKey) {
  if (!["teamA", "teamB"].includes(teamKey)) {
    return;
  }
  if (state.roundSelection.locked) {
    setLastResultSummary("Game lineup is locked. Unlock to clear active players.");
    saveState("Overlay clear active blocked while locked.");
    return;
  }
  state.roundSelection.activeByTeam[teamKey] = [];
  saveCurrentRoundSnapshot();
  renderRoundSelection();
  renderShowUi();
  saveState(`Cleared active players for ${state.teams[teamKey].name}.`);
}

function syncPretulOverlayIntoState() {
  const root = elements.showScreenContent;
  if (!root) {
    return;
  }
  const roundState = getOrCreatePretulRoundState();
  const readNumber = (selector, fallback = 0) => {
    const node = root.querySelector(selector);
    return Math.round(sanitizeNumber(node?.value, fallback));
  };
  const readBet = (selector, fallback = 0) => normalizeBetAmount(readNumber(selector, fallback));
  const selectedItemId = root.querySelector("[data-show-pretul-item]")?.value || roundState.selectedItemId;
  if (state.pretul.items.some((item) => item.id === selectedItemId) && !roundState.usedItemIds.includes(selectedItemId)) {
    roundState.selectedItemId = selectedItemId;
  }
  roundState.answerTeamA = Math.max(0, readNumber("[data-show-pretul-answer-teama]", roundState.answerTeamA));
  roundState.answerTeamB = Math.max(0, readNumber("[data-show-pretul-answer-teamb]", roundState.answerTeamB));
  roundState.realPrice = Math.max(0, readNumber("[data-show-pretul-real-price]", roundState.realPrice));
  roundState.betTeamA = Math.max(0, readBet("[data-show-pretul-bet-teama]", roundState.betTeamA));
  roundState.betTeamB = Math.max(0, readBet("[data-show-pretul-bet-teamb]", roundState.betTeamB));

  if (elements.pretulItemSelect) {
    elements.pretulItemSelect.value = roundState.selectedItemId;
  }
  if (elements.pretulAnswerTeamAInput) {
    elements.pretulAnswerTeamAInput.value = String(roundState.answerTeamA);
  }
  if (elements.pretulAnswerTeamBInput) {
    elements.pretulAnswerTeamBInput.value = String(roundState.answerTeamB);
  }
  if (elements.pretulRealPriceInput) {
    elements.pretulRealPriceInput.value = String(roundState.realPrice);
  }
  if (elements.pretulBetTeamAInput) {
    elements.pretulBetTeamAInput.value = String(roundState.betTeamA);
  }
  if (elements.pretulBetTeamBInput) {
    elements.pretulBetTeamBInput.value = String(roundState.betTeamB);
  }
}

function syncSamsarOverlayIntoHostInputs() {
  const roundState = getOrCreateSamsarRoundState(getSamsarRoundNumber());
  if (elements.samsarScoreTeamAInput) {
    elements.samsarScoreTeamAInput.value = String(roundState.scoreTeamA);
  }
  if (elements.samsarScoreTeamBInput) {
    elements.samsarScoreTeamBInput.value = String(roundState.scoreTeamB);
  }
}

function syncManualOverlayIntoHostInputs() {
  const gameId = getCurrentManualMatchGame();
  const roundState = getOrCreateManualMatchRoundState(gameId, state.progress.currentRound);
  if (elements.manualScoreTeamAInput) {
    elements.manualScoreTeamAInput.value = String(roundState.scoreTeamA);
  }
  if (elements.manualScoreTeamBInput) {
    elements.manualScoreTeamBInput.value = String(roundState.scoreTeamB);
  }
  if (elements.manualBetTeamAInput) {
    elements.manualBetTeamAInput.value = String(roundState.betTeamA);
  }
  if (elements.manualBetTeamBInput) {
    elements.manualBetTeamBInput.value = String(roundState.betTeamB);
  }
  if (elements.shotFakeMultiplierInput) {
    elements.shotFakeMultiplierInput.value = String(roundState.shotFake.multiplier);
  }
  if (elements.shotFakeManualAdjustTeamAInput) {
    elements.shotFakeManualAdjustTeamAInput.value = String(roundState.shotFake.manualAdjustTeamA);
  }
  if (elements.shotFakeManualAdjustTeamBInput) {
    elements.shotFakeManualAdjustTeamBInput.value = String(roundState.shotFake.manualAdjustTeamB);
  }
}

function tryForceRevealForCurrentGame() {
  const gameId = state.progress.currentGame;
  if (gameId === "film-joc-franciza-fun-fact") {
    const roundState = getOrCreateFilmRoundState();
    roundState.revealed.character = true;
    roundState.revealed.franchise = true;
    roundState.revealed.funFact = true;
    renderFilmControls();
    renderShowUi();
    saveState("Force reveal used for Film/Joc round.");
    return;
  }
  setLastResultSummary("Force reveal is currently available for Film/Joc rounds.");
  renderShowUi();
  saveState("Force reveal not applicable in current game.");
}

function handleShowOverlayAction(action, trigger) {
  if (!action) {
    return;
  }
  const answerResultActions = new Set([
    "trivia-correct",
    "trivia-wrong",
    "pretul-evaluate",
    "film-apply",
    "samsar-apply",
    "manual-apply",
    "curse-apply"
  ]);

  if (action === "go-show-home") {
    setShowScreen("show-home");
    return;
  }
  if (action === "start-game-night") {
    startGameNightFlow();
    return;
  }
  if (action === "go-game-select") {
    setShowScreen("game-select");
    return;
  }
  if (action === "go-game-intro") {
    setShowScreen("game-intro");
    return;
  }
  if (action === "go-roster-management") {
    setShowScreen("roster-management");
    return;
  }
  if (action === "go-live-round") {
    setShowScreen("live-round");
    return;
  }
  if (action === "confirm-lineup-start") {
    const gameId = state.progress.currentGame;
    if (!hasAnyCurrentGameLineupMembers()) {
      setLastResultSummary("Assign at least one player token before confirming lineup.");
      renderShowUi();
      saveState("Lineup confirmation blocked: no assigned tokens.");
      return;
    }
    setGameLineupReady(gameId, true);
    setLastResultSummary(`Lineup confirmed for ${getGameLabel(gameId)}. Live round ready.`);
    setShowScreen("live-round", { persist: false });
    saveState(`Lineup confirmed: ${getGameLabel(gameId)}.`);
    return;
  }
  if (action === "save-roster") {
    setLastResultSummary("Roster saved.");
    saveState("Roster saved from overlay.");
    renderShowUi();
    return;
  }
  if (action === "go-end-of-game") {
    setShowScreen("end-of-game");
    return;
  }
  if (action === "go-reveal") {
    setShowScreen("reveal-result");
    return;
  }
  if (action === "go-leaderboard") {
    setShowScreen("leaderboard");
    return;
  }
  if (action === "go-end-screen") {
    if (!isGameNightComplete()) {
      setLastResultSummary("Finalizeaza toate jocurile din Game Select pentru End Screen final.");
      setShowScreen("game-select", { persist: false });
      saveState("End screen blocked: game night not complete.");
      return;
    }
    setShowScreen("end-screen");
    return;
  }
  if (action === "finish-game-return") {
    finishCurrentGameAndReturn();
    return;
  }
  if (action === "timer-start") {
    startTimer();
    return;
  }
  if (action === "timer-pause") {
    pauseTimer();
    return;
  }
  if (action === "timer-reset") {
    resetTimer();
    return;
  }
  if (action === "timer-plus-10") {
    adjustTimerRemaining(10);
    return;
  }
  if (action === "timer-minus-10") {
    adjustTimerRemaining(-10);
    return;
  }
  if (action === "toggle-round-lock") {
    toggleRoundSelectionLock();
    return;
  }
  if (action === "toggle-answer-lock") {
    setOverlayAnswerLocked(!isOverlayAnswerLocked());
    return;
  }
  if (action === "trivia-confirm-bet") {
    confirmTriviaBetAndContinue();
    return;
  }
  if (action === "trivia-start-round") {
    startTriviaQuestionRound();
    return;
  }
  if (action === "trivia-confirm-answer") {
    confirmTriviaAnswerFromOverlay();
    return;
  }
  if (action === "trivia-next-topic") {
    advanceTriviaToNextTopic();
    return;
  }
  if (action === "live-step-next") {
    const currentGameId = state.progress.currentGame;
    setLiveRoundStep(getNextLiveRoundStep(currentGameId, getLiveRoundStep(currentGameId)));
    return;
  }
  if (action === "live-step-prev") {
    const currentGameId = state.progress.currentGame;
    setLiveRoundStep(getPrevLiveRoundStep(currentGameId, getLiveRoundStep(currentGameId)));
    return;
  }
  if (action.startsWith("live-step-")) {
    const stepId = action.replace("live-step-", "");
    if (getGameFlowState(state.progress.currentGame, stepId)) {
      setLiveRoundStep(stepId);
    }
    return;
  }
  if (action === "next-round") {
    const currentGameId = state.progress.currentGame;
    if (currentGameId === "trivia" && getLiveRoundStep(currentGameId) === "result-screen") {
      advanceTriviaToNextTopic();
      return;
    }
    if (isGameFlowComplete(currentGameId)) {
      setLastResultSummary(`${getGameLabel(currentGameId)} reached its flow end. Returning to Game Select.`);
      finishCurrentGameAndReturn();
      return;
    }
    setCurrentRound(state.progress.currentRound + 1);
    setShowScreen("live-round", { persist: false });
    saveState("Next round opened.");
    return;
  }
  if (action === "next-game") {
    nextGame();
    return;
  }
  if (answerResultActions.has(action) && !isOverlayAnswerLocked()) {
    setLastResultSummary("Lock answer first, then confirm result.");
    renderShowUi();
    saveState("Overlay confirm blocked: answer not locked.");
    return;
  }
  if (action === "clear-team-active") {
    const teamKey = trigger?.getAttribute("data-team");
    clearActiveTeamFromOverlay(teamKey);
    return;
  }
  if (action === "trivia-correct") {
    const triviaRoundState = getOrCreateTriviaRoundState();
    applyTriviaRoundResult(true, { selectedOptionIndex: triviaRoundState.selectedOptionIndex });
    setOverlayAnswerLocked(false, { persist: false });
    setLiveRoundStep("result-screen", { persist: false });
    setShowScreen("live-round", { persist: false });
    return;
  }
  if (action === "trivia-wrong") {
    const triviaRoundState = getOrCreateTriviaRoundState();
    applyTriviaRoundResult(false, { selectedOptionIndex: triviaRoundState.selectedOptionIndex });
    setOverlayAnswerLocked(false, { persist: false });
    setLiveRoundStep("result-screen", { persist: false });
    setShowScreen("live-round", { persist: false });
    return;
  }
  if (action === "trivia-reset-used") {
    resetTriviaUsedCategories();
    return;
  }
  if (action === "pretul-evaluate") {
    syncPretulOverlayIntoState();
    applyPretulRoundResult();
    setOverlayAnswerLocked(false, { persist: false });
    setShowScreen("reveal-result", { persist: false });
    return;
  }
  if (action === "pretul-reset-used") {
    resetPretulUsedItems();
    return;
  }
  if (action === "film-apply") {
    applyFilmRoundResult();
    setOverlayAnswerLocked(false, { persist: false });
    setShowScreen("reveal-result", { persist: false });
    return;
  }
  if (action === "film-reset-used") {
    resetFilmUsedItems();
    return;
  }
  if (action === "samsar-apply") {
    syncSamsarOverlayIntoHostInputs();
    applySamsarRoundResult();
    setOverlayAnswerLocked(false, { persist: false });
    setShowScreen("reveal-result", { persist: false });
    return;
  }
  if (action === "manual-apply") {
    syncManualOverlayIntoHostInputs();
    applyManualMatchRoundResult();
    setOverlayAnswerLocked(false, { persist: false });
    setShowScreen("reveal-result", { persist: false });
    return;
  }
  if (action === "manual-sidebet-add") {
    addShotFakeSideBet();
    return;
  }
  if (action === "manual-sidebet-remove") {
    const sideBetId = trigger?.getAttribute("data-sidebet-id");
    if (sideBetId) {
      removeShotFakeSideBet(sideBetId);
    }
    return;
  }
  if (action === "curse-move") {
    moveCurseHorseBySymbol();
    return;
  }
  if (action === "curse-apply") {
    applyCurseRacePayout();
    setOverlayAnswerLocked(false, { persist: false });
    setShowScreen("reveal-result", { persist: false });
    return;
  }
  if (action === "curse-reset") {
    resetCurseRace();
    return;
  }
}

function handleShowOverlayChange(target) {
  if (!target) {
    return;
  }

  if (target.matches("[data-show-current-game]")) {
    setCurrentGame(target.value, { keepRound: true, navigateToSection: false });
    setShowScreen("game-intro", { persist: false });
    return;
  }
  if (target.matches("[data-show-current-round]")) {
    setCurrentRound(target.value);
    return;
  }
  if (target.matches("[data-show-timer-duration]")) {
    if (elements.roundDuration) {
      elements.roundDuration.value = String(target.value);
    }
    updateRoundDuration();
    return;
  }
  if (target.matches("[data-show-timer-remaining]")) {
    setTimerRemaining(target.value);
    return;
  }
  if (target.matches("[data-show-player-toggle]")) {
    const teamKey = target.getAttribute("data-team");
    const playerId = target.getAttribute("data-player-id");
    togglePlayerActive(teamKey, playerId, target.checked);
    return;
  }
  if (target.matches("[data-show-player-status]")) {
    const teamKey = target.getAttribute("data-team");
    const playerId = target.getAttribute("data-player-id");
    updatePlayerStatus(teamKey, playerId, target.value);
    return;
  }
  if (target.matches("[data-show-roster-name]")) {
    const row = target.closest("[data-team][data-player-id]");
    const teamKey = row?.getAttribute("data-team");
    const playerId = row?.getAttribute("data-player-id");
    if (!["teamA", "teamB"].includes(teamKey) || !playerId) {
      return;
    }
    updatePlayerName(teamKey, playerId, target.value);
    return;
  }
  if (target.matches("[data-show-roster-status]")) {
    const row = target.closest("[data-team][data-player-id]");
    const teamKey = row?.getAttribute("data-team");
    const playerId = row?.getAttribute("data-player-id");
    if (!["teamA", "teamB"].includes(teamKey) || !playerId) {
      return;
    }
    updatePlayerStatus(teamKey, playerId, target.value, { ignoreLock: true });
    return;
  }
  if (target.matches("[data-show-trivia-team]")) {
    setTriviaPlayingTeam(target.value);
    return;
  }
  if (target.matches("[data-show-trivia-category]")) {
    setTriviaSelectedCategory(target.value);
    return;
  }
  if (target.matches("[data-show-trivia-bet]")) {
    setTriviaBetAmount(target.value, { persist: true, render: true });
    return;
  }
  if (target.matches("[data-show-trivia-bonus]")) {
    state.trivia.fixedBonus = Math.max(0, Math.round(sanitizeNumber(target.value, state.trivia.fixedBonus)));
    if (elements.triviaFixedBonusInput) {
      elements.triviaFixedBonusInput.value = String(state.trivia.fixedBonus);
    }
    renderTriviaControls();
    saveState("Trivia bonus adjusted from overlay.");
    return;
  }
  if (target.matches("[data-show-pretul-item]")) {
    setPretulSelectedItem(target.value);
    return;
  }
  if (
    target.matches("[data-show-pretul-answer-teama]") ||
    target.matches("[data-show-pretul-answer-teamb]") ||
    target.matches("[data-show-pretul-bet-teama]") ||
    target.matches("[data-show-pretul-bet-teamb]") ||
    target.matches("[data-show-pretul-real-price]")
  ) {
    syncPretulOverlayIntoState();
    renderPretulControls();
    saveState("Pretul controls updated from overlay.");
    return;
  }
  if (target.matches("[data-show-film-team]")) {
    setFilmPlayingTeam(target.value);
    return;
  }
  if (target.matches("[data-show-film-item]")) {
    setFilmSelectedItem(target.value);
    return;
  }
  if (target.matches("[data-show-film-bet]")) {
    setFilmBetAmount(target.value);
    return;
  }
  if (target.matches("[data-show-samsar-player-teama]")) {
    setSamsarActivePlayer("teamA", target.value);
    return;
  }
  if (target.matches("[data-show-samsar-player-teamb]")) {
    setSamsarActivePlayer("teamB", target.value);
    return;
  }
  if (target.matches("[data-show-samsar-score-teama]")) {
    setSamsarScore("teamA", target.value);
    return;
  }
  if (target.matches("[data-show-samsar-score-teamb]")) {
    setSamsarScore("teamB", target.value);
    return;
  }
  if (target.matches("[data-show-manual-game]")) {
    setManualMatchGame(target.value);
    return;
  }
  if (target.matches("[data-show-manual-round]")) {
    setManualMatchRound(target.value);
    return;
  }
  if (target.matches("[data-show-manual-score-teama]")) {
    setManualRoundScore("teamA", target.value);
    return;
  }
  if (target.matches("[data-show-manual-score-teamb]")) {
    setManualRoundScore("teamB", target.value);
    return;
  }
  if (target.matches("[data-show-manual-bet-teama]")) {
    setManualRoundBet("teamA", target.value);
    return;
  }
  if (target.matches("[data-show-manual-bet-teamb]")) {
    setManualRoundBet("teamB", target.value);
    return;
  }
  if (target.matches("[data-show-shot-multiplier]")) {
    setShotFakeMultiplier(target.value);
    return;
  }
  if (target.matches("[data-show-shot-adjust-teama]")) {
    setShotFakeManualAdjust("teamA", target.value);
    return;
  }
  if (target.matches("[data-show-shot-adjust-teamb]")) {
    setShotFakeManualAdjust("teamB", target.value);
    return;
  }
  if (target.matches("[data-show-shot-sidebet-label]") || target.matches("[data-show-shot-sidebet-amount]") || target.matches("[data-show-shot-sidebet-winner]")) {
    const sideBetRow = target.closest("[data-show-shot-sidebet-id]");
    const sideBetId = sideBetRow?.getAttribute("data-show-shot-sidebet-id");
    if (!sideBetId) {
      return;
    }
    if (target.matches("[data-show-shot-sidebet-label]")) {
      updateShotFakeSideBet(sideBetId, "label", target.value);
    } else if (target.matches("[data-show-shot-sidebet-amount]")) {
      updateShotFakeSideBet(sideBetId, "amount", target.value);
    } else if (target.matches("[data-show-shot-sidebet-winner]")) {
      updateShotFakeSideBet(sideBetId, "winner", target.value);
    }
    return;
  }
  if (target.matches("[data-show-curse-round]")) {
    setCurseRound(target.value);
    return;
  }
  if (target.matches("[data-show-curse-move-horse]")) {
    setCurseMoveHorse(target.value);
    return;
  }
  if (target.matches("[data-show-curse-move-steps]")) {
    setCurseMoveSteps(target.value);
    return;
  }
  if (target.matches("[data-show-curse-bet]")) {
    const teamKey = target.getAttribute("data-team");
    const horseId = target.getAttribute("data-horse-id");
    setCurseBetAmount(teamKey, horseId, target.value);
    return;
  }
  if (target.matches("[data-show-curse-bettor-teama]")) {
    setCurseBettor("teamA", target.value);
    return;
  }
  if (target.matches("[data-show-curse-bettor-teamb]")) {
    setCurseBettor("teamB", target.value);
    return;
  }
}

function handleShowOverlayClick(event) {
  const selectGameButton = event.target.closest("[data-show-select-game]");
  if (selectGameButton) {
    const gameId = selectGameButton.getAttribute("data-show-select-game");
    if (GAME_ORDER.includes(gameId)) {
      ensureShowUiState();
      state.showUi.gameNightStarted = true;
      setCurrentGame(gameId, { keepRound: true, navigateToSection: false });
      setShowScreen("game-intro", { persist: false });
      saveState(`Game selected from overlay: ${getGameLabel(gameId)}.`);
    }
    return;
  }

  const assignPlayerButton = event.target.closest("[data-show-player-assign]");
  if (assignPlayerButton) {
    const playerId = assignPlayerButton.getAttribute("data-player-id");
    const targetLane = assignPlayerButton.getAttribute("data-target-lane");
    assignShowPlayerToLane(playerId, targetLane);
    return;
  }

  const addRosterButton = event.target.closest("[data-show-roster-add]");
  if (addRosterButton) {
    const teamKey = addRosterButton.getAttribute("data-team");
    const input = elements.showScreenContent?.querySelector(`[data-show-roster-add-name][data-team="${teamKey}"]`);
    if (!["teamA", "teamB"].includes(teamKey) || !input) {
      return;
    }
    addPlayer(teamKey, input, { ignoreLock: true });
    return;
  }

  const removeRosterButton = event.target.closest("[data-show-roster-remove]");
  if (removeRosterButton) {
    const row = removeRosterButton.closest("[data-team][data-player-id]");
    const teamKey = row?.getAttribute("data-team");
    const playerId = row?.getAttribute("data-player-id");
    if (!["teamA", "teamB"].includes(teamKey) || !playerId) {
      return;
    }
    removePlayer(teamKey, playerId, { ignoreLock: true });
    return;
  }

  const triviaTopicButton = event.target.closest("[data-show-trivia-topic]");
  if (triviaTopicButton) {
    const topicId = triviaTopicButton.getAttribute("data-show-trivia-topic");
    selectTriviaTopicFromOverlay(topicId);
    return;
  }

  const triviaAnswerButton = event.target.closest("[data-show-trivia-option]");
  if (triviaAnswerButton) {
    const optionIndex = triviaAnswerButton.getAttribute("data-show-trivia-option");
    setTriviaSelectedOption(optionIndex);
    return;
  }

  const triviaPresetButton = event.target.closest("[data-show-trivia-bet-preset]");
  if (triviaPresetButton) {
    const presetValue = triviaPresetButton.getAttribute("data-show-trivia-bet-preset");
    setTriviaBetAmount(presetValue, { persist: true, render: true });
    return;
  }

  const revealButton = event.target.closest("[data-show-film-reveal]");
  if (revealButton) {
    const componentKey = revealButton.getAttribute("data-show-film-reveal");
    toggleFilmReveal(componentKey);
    return;
  }

  const outcomeButton = event.target.closest("[data-show-film-outcome]");
  if (outcomeButton) {
    const value = outcomeButton.getAttribute("data-show-film-outcome") || "";
    const [componentKey, outcome] = value.split(":");
    if (!FILM_COMPONENT_KEYS.includes(componentKey)) {
      return;
    }
    setFilmComponentOutcome(componentKey, outcome === "correct" ? "correct" : "wrong");
    return;
  }

  const actionButton = event.target.closest("[data-show-action]");
  if (actionButton) {
    const action = actionButton.getAttribute("data-show-action");
    handleShowOverlayAction(action, actionButton);
  }
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
    teamA: state.teams.teamA.name || DEFAULT_STATE.teams.teamA.name,
    teamB: state.teams.teamB.name || DEFAULT_STATE.teams.teamB.name
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
  if (elements.roundDuration) {
    elements.roundDuration.value = String(state.timer.duration);
  }
  if (elements.timerDisplay) {
    elements.timerDisplay.textContent = formatTimer(state.timer.remaining);
  }
  if (elements.showStageTimer) {
    elements.showStageTimer.textContent = formatTimer(state.timer.remaining);
  }
  if (elements.showScreenContent) {
    const liveTimerCore = elements.showScreenContent.querySelector("[data-show-live-timer-core]");
    if (liveTimerCore) {
      liveTimerCore.textContent = formatTimer(state.timer.remaining);
      liveTimerCore.classList.toggle("is-danger", state.timer.remaining <= 10);
    }
    const quickRemainingInput = elements.showScreenContent.querySelector("[data-show-timer-remaining]");
    if (quickRemainingInput) {
      quickRemainingInput.value = String(Math.max(0, Math.round(sanitizeNumber(state.timer.remaining, 0))));
    }
  }
  if (elements.startTimerBtn) {
    elements.startTimerBtn.disabled = state.timer.isRunning;
  }
  if (elements.pauseTimerBtn) {
    elements.pauseTimerBtn.disabled = !state.timer.isRunning;
  }
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
  if (elements.showStageGameLabel) {
    elements.showStageGameLabel.textContent = gameLabel;
  }
  if (elements.showStageRoundLabel) {
    elements.showStageRoundLabel.textContent = String(state.progress.currentRound);
  }
  if (elements.showLatestResult) {
    elements.showLatestResult.textContent = state.progress.lastResultSummary || DEFAULT_RESULT_SUMMARY;
  }
  renderShowUi();
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
    "Trivia de grup: one-team-per-round with automatic turn switch. Active team picks a multiple-choice topic, places bet, answers under timer, and result is auto-checked.";
  elements.settingsPretulRuleLine.textContent =
    "Pretul corect: both teams submit answer + bet, and winner is auto-detected by closest value to real price; equal distance is tie.";
  elements.settingsFilmRuleLine.textContent =
    "Film/Joc/Franciza/Fun Fact: one-team-only, component weights 1/1/3, partial payout per component, and bet is active only at minimum 2/3 correct.";
  elements.settingsSamsarRuleLine.textContent =
    "Cel mai bun samsar: 6 rounds cu persona/cerinte editabile, no link fields, one active player selector per team, higher score wins, equal score draw.";
  elements.settingsShotFakeRuleLine.textContent =
    "Shot Fake: bet-only team-vs-team mode with no fixed bonus, draw allowed, multiple side bets, and special x * active opponents transfer.";
  elements.settingsCurseRuleLine.textContent =
    "Curse de cai: bet-only race mode, multi-bet on horses enabled, only winning-horse bet pays x4, other horse bets are lost, winner is auto-detected.";
  elements.settingsSelectionRuleLine.textContent =
    "Player selection: game lineup model (selected once per game), up to 6 active players per team, fast deselect controls, plus Bench/Unavailable status support.";
  elements.settingsMultiBetRuleLine.textContent =
    "Lock game lineup is available to prevent accidental edits. Multi-bet is available in Shot Fake (side bets) and Curse de cai (horse board).";
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
  const normalizedBet = Math.min(
    normalizeBetAmount(triviaRoundState.betAmount || elements.triviaBetAmountInput.value || 100),
    maxAllowedBet
  );
  triviaRoundState.betAmount = normalizedBet;

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
    `Only ${playingTeam.name} can bet this Trivia round (auto turn mode). Max 10% and rounded to 10. ` +
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
      const options = getTriviaCategoryOptions(category);
      const correctIndex = getTriviaCorrectOptionIndex(category);
      return `
        <article class="${cardClass}">
          <h4>${category.title}</h4>
          <p><strong>Q:</strong> ${category.question}</p>
          <p><strong>Options:</strong> ${options
            .map((option, index) => `${String.fromCharCode(65 + index)}. ${escapeHtml(option)}`)
            .join(" | ")}</p>
          <p><strong>Correct:</strong> ${String.fromCharCode(65 + correctIndex)}. ${escapeHtml(options[correctIndex])}</p>
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
  renderShowUi();
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
    roundState.lastResult || "Rezultatul rundei va aparea aici.";
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
          <p class="muted">Reference real price: <strong>${formatMoney(item.referencePrice)}</strong></p>
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
  renderShowUi();
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
    setLastResultSummary("Game lineup is locked. Unlock to clear active players.");
    saveState("Pretul clear active blocked while locked.");
    return;
  }

  state.roundSelection.activeByTeam[teamKey] = [];
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
    roundState.lastResult = "No available item left. Reset used items or add new round items.";
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
  elements.filmRoundImage.alt = selectedItem?.imageAlt || "Imagine runda";
  elements.filmRoundImageCaption.textContent =
    selectedItem?.title || "No available round item. Reset used rounds or add new round items.";

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
  elements.filmRoundResult.textContent = roundState.lastResult || "Rezultatul rundei va aparea aici.";

  const activeCount = countActiveWithJoker(playingTeamKey);
  elements.filmActiveSelectionInfo.textContent =
    `${playingTeam.name} is active for this round (${activeCount}/${MAX_ACTIVE_PER_TEAM}). ` +
    `Only this team can be selected while this game is active.`;
  const hasAnyActive =
    state.roundSelection.activeByTeam[playingTeamKey].length > 0;
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
  renderShowUi();
}

function setFilmPlayingTeam(teamKey) {
  if (!["teamA", "teamB"].includes(teamKey)) {
    return;
  }

  const roundState = getOrCreateFilmRoundState();
  roundState.teamKey = teamKey;
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
    setLastResultSummary("Game lineup is locked. Unlock to clear active players.");
    saveState("Film clear active blocked while locked.");
    return;
  }

  const roundState = getOrCreateFilmRoundState();
  const teamKey = roundState.teamKey;
  state.roundSelection.activeByTeam[teamKey] = [];
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
    roundState.lastResult = "No available round item. Reset used rounds or add new round items.";
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
    personaTitle: "Persona curenta",
    personaRequirements: "Cerintele curente vor fi afisate aici."
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
  elements.samsarRoundResult.textContent = roundState.lastResult || "Rezultatul rundei va aparea aici.";

  if (elements.samsarRoundButtons) {
    elements.samsarRoundButtons.forEach((button) => {
      const buttonRound = Number(button.dataset.samsarRound || "0");
      button.classList.toggle("is-active", buttonRound === roundNumber);
    });
  }
  renderShowUi();
}

function setSamsarActivePlayer(teamKey, playerId) {
  if (!["teamA", "teamB"].includes(teamKey)) {
    return;
  }
  if (state.roundSelection.locked) {
    setLastResultSummary("Game lineup is locked. Unlock to change active players.");
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
  elements.manualRoundResult.textContent = roundState.lastResult || "Rezultatul rundei va aparea aici.";

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
  renderShowUi();
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
    setLastResultSummary("Game lineup is locked. Unlock to clear active players.");
    saveState("Manual clear active blocked while locked.");
    return;
  }
  state.roundSelection.activeByTeam[teamKey] = [];
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
    label: "Side bet nou",
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
  elements.curseRoundResult.textContent = roundState.lastResult || "Rezultatul cursei va aparea aici.";

  renderCurseTrackBoard(roundState);
  renderCurseBetBoard(roundState);
  renderCurseActiveList("teamA", elements.curseActiveTeamAList);
  renderCurseActiveList("teamB", elements.curseActiveTeamBList);
  renderCurseBettorSelect("teamA", elements.curseBettorTeamASelect, roundState);
  renderCurseBettorSelect("teamB", elements.curseBettorTeamBSelect, roundState);

  const overCap = totalBetA > maxBetA || totalBetB > maxBetB;
  elements.curseMoveBtn.disabled = Boolean(roundState.winnerHorseId);
  elements.curseApplyPayoutBtn.disabled = !roundState.winnerHorseId || roundState.payoutApplied || overCap;
  renderShowUi();
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
    setLastResultSummary("Game lineup is locked. Unlock to clear active players.");
    saveState("Curse clear active blocked while locked.");
    return;
  }
  state.roundSelection.activeByTeam[teamKey] = [];
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
  state.trivia.turnTeamKey = teamKey;
  const triviaRoundState = getOrCreateTriviaRoundState();
  triviaRoundState.teamKey = teamKey;
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
  triviaRoundState.selectedOptionIndex = -1;
  triviaRoundState.lockedOptionIndex = -1;
  triviaRoundState.resultChecked = false;
  triviaRoundState.isCorrect = null;
  triviaRoundState.lastDelta = 0;
  triviaRoundState.resultCategoryId = "";
  triviaRoundState.lastResult = "";
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
  for (const roundState of Object.values(state.trivia.rounds)) {
    const safeRound = sanitizeTriviaRoundState(roundState);
    safeRound.usedCategoryIds = [];
    safeRound.selectedCategoryId = state.trivia.categories[0]?.id || "";
    safeRound.selectedOptionIndex = -1;
    safeRound.lockedOptionIndex = -1;
    safeRound.resultChecked = false;
    safeRound.isCorrect = null;
    safeRound.lastDelta = 0;
    safeRound.resultCategoryId = "";
    safeRound.lastResult = "";
  }
  state.trivia.turnTeamKey = "teamA";
  const triviaRoundState = getOrCreateTriviaRoundState();
  triviaRoundState.teamKey = state.trivia.turnTeamKey;
  triviaRoundState.usedCategoryIds = [];
  triviaRoundState.selectedCategoryId = state.trivia.categories[0]?.id || "";
  triviaRoundState.selectedOptionIndex = -1;
  triviaRoundState.lockedOptionIndex = -1;
  triviaRoundState.resultChecked = false;
  triviaRoundState.isCorrect = null;
  triviaRoundState.lastDelta = 0;
  triviaRoundState.resultCategoryId = "";
  triviaRoundState.lastResult = "";
  if (elements.triviaBetAmountInput) {
    elements.triviaBetAmountInput.value = "100";
  }
  setLiveRoundStep("topic-select", { persist: false });
  renderTriviaControls();
  setLastResultSummary("Trivia used categories reset for current round.");
  saveState("Trivia categories reset.");
}

function getTriviaCategoryOptions(category) {
  const rawOptions = Array.isArray(category?.options)
    ? category.options.map((option) => sanitizeString(option, "").trim()).filter((option) => option.length > 0)
    : [];
  if (rawOptions.length >= 2) {
    return rawOptions;
  }
  const fallbackAnswer = sanitizeString(category?.answer, "Raspuns demo").trim() || "Raspuns demo";
  return [fallbackAnswer, "Optiunea B", "Optiunea C", "Optiunea D"];
}

function getTriviaCorrectOptionIndex(category) {
  const options = getTriviaCategoryOptions(category);
  let index = Math.round(sanitizeNumber(category?.correctOptionIndex, -1));
  if (index < 0 || index >= options.length) {
    const answer = sanitizeString(category?.answer, "").trim();
    index = options.findIndex((option) => normalizeTextToken(option) === normalizeTextToken(answer));
  }
  if (index < 0 || index >= options.length) {
    index = 0;
  }
  return index;
}

function setTriviaBetAmount(rawBetAmount, options = {}) {
  const persist = options.persist !== false;
  const render = options.render !== false;
  const triviaRoundState = getOrCreateTriviaRoundState();
  const playingTeam = state.teams[triviaRoundState.teamKey];
  const maxAllowedBet = getMaxBetAmount(playingTeam.money, "trivia");
  const normalized = normalizeBetAmount(rawBetAmount);
  const effective = maxAllowedBet > 0 ? Math.min(normalized, maxAllowedBet) : 0;
  triviaRoundState.betAmount = effective;
  if (elements.triviaBetAmountInput) {
    elements.triviaBetAmountInput.value = String(effective);
  }
  if (render) {
    renderTriviaControls();
    renderShowUi();
  }
  if (persist) {
    saveState("Trivia bet amount updated.");
  }
}

function selectTriviaTopicFromOverlay(categoryId) {
  const triviaRoundState = getOrCreateTriviaRoundState();
  if (!state.trivia.categories.some((category) => category.id === categoryId)) {
    return;
  }
  if (triviaRoundState.usedCategoryIds.includes(categoryId)) {
    return;
  }
  triviaRoundState.selectedCategoryId = categoryId;
  triviaRoundState.selectedOptionIndex = -1;
  triviaRoundState.lockedOptionIndex = -1;
  triviaRoundState.resultChecked = false;
  triviaRoundState.isCorrect = null;
  triviaRoundState.lastDelta = 0;
  triviaRoundState.resultCategoryId = "";
  triviaRoundState.lastResult = "";
  setOverlayAnswerLocked(false, { persist: false });
  setLiveRoundStep("bet-screen", { persist: false });
  renderTriviaControls();
  renderShowUi();
  saveState(`Trivia topic selected: ${categoryId}.`);
}

function confirmTriviaBetAndContinue() {
  const triviaRoundState = getOrCreateTriviaRoundState();
  const category = state.trivia.categories.find((entry) => entry.id === triviaRoundState.selectedCategoryId);
  if (!category) {
    setLastResultSummary("Selecteaza un topic valid inainte de bet.");
    renderShowUi();
    saveState("Trivia bet confirm blocked: no topic selected.");
    return;
  }
  setTriviaBetAmount(
    elements.triviaBetAmountInput?.value || triviaRoundState.betAmount || 100,
    { persist: false, render: false }
  );
  const playingTeam = state.teams[triviaRoundState.teamKey];
  if (triviaRoundState.betAmount <= 0 || playingTeam.money <= 0) {
    setLastResultSummary(`${playingTeam.name} nu poate paria in aceasta runda.`);
    renderShowUi();
    saveState("Trivia bet confirm blocked: no valid bet.");
    return;
  }
  resetTimer();
  startTimer();
  setOverlayAnswerLocked(false, { persist: false });
  setLiveRoundStep("question-screen", { persist: false });
  setLastResultSummary(`${playingTeam.name} confirmed bet ${formatMoney(triviaRoundState.betAmount)}. Timer started.`);
  renderShowUi();
  saveState("Trivia bet confirmed.");
}

function startTriviaQuestionRound() {
  const triviaRoundState = getOrCreateTriviaRoundState();
  if (!triviaRoundState.selectedCategoryId) {
    setLastResultSummary("Selecteaza topicul inainte sa pornesti timerul.");
    renderShowUi();
    saveState("Trivia start blocked: no topic.");
    return;
  }
  resetTimer();
  setOverlayAnswerLocked(false, { persist: false });
  startTimer();
  setLiveRoundStep("question-screen", { persist: false });
  setLastResultSummary("Trivia timer started.");
  renderShowUi();
  saveState("Trivia round started.");
}

function setTriviaSelectedOption(optionIndex) {
  const triviaRoundState = getOrCreateTriviaRoundState();
  const category = state.trivia.categories.find((entry) => entry.id === triviaRoundState.selectedCategoryId);
  const options = getTriviaCategoryOptions(category);
  const safeIndex = Math.round(sanitizeNumber(optionIndex, -1));
  if (safeIndex < 0 || safeIndex >= options.length) {
    return;
  }
  triviaRoundState.selectedOptionIndex = safeIndex;
  renderShowUi();
  saveState(`Trivia answer option selected: ${safeIndex + 1}.`);
}

function confirmTriviaAnswerFromOverlay() {
  const triviaRoundState = getOrCreateTriviaRoundState();
  const category = state.trivia.categories.find((entry) => entry.id === triviaRoundState.selectedCategoryId);
  if (!category) {
    setLastResultSummary("Topic invalid pentru answer confirm.");
    renderShowUi();
    saveState("Trivia answer confirm blocked: invalid topic.");
    return;
  }
  const options = getTriviaCategoryOptions(category);
  const selectedIndex = Math.round(sanitizeNumber(triviaRoundState.selectedOptionIndex, -1));
  if (selectedIndex < 0 || selectedIndex >= options.length) {
    setLastResultSummary("Alege un raspuns inainte sa confirmi.");
    renderShowUi();
    saveState("Trivia answer confirm blocked: no selected option.");
    return;
  }

  triviaRoundState.lockedOptionIndex = selectedIndex;
  setOverlayAnswerLocked(true, { persist: false });
  pauseTimer();

  const correctIndex = getTriviaCorrectOptionIndex(category);
  const isCorrect = selectedIndex === correctIndex;
  applyTriviaRoundResult(isCorrect, { selectedOptionIndex: selectedIndex });
  setLiveRoundStep("result-screen", { persist: false });
  setShowScreen("live-round", { persist: false });
  renderShowUi();
  saveState("Trivia answer confirmed.");
}

function advanceTriviaToNextTopic() {
  if (isGameFlowComplete("trivia")) {
    setLastResultSummary("Trivia complete. Returning to Game Select.");
    finishCurrentGameAndReturn();
    return;
  }

  const currentRoundState = getOrCreateTriviaRoundState();
  const currentTeam = currentRoundState.teamKey === "teamA" ? "teamA" : "teamB";
  const nextTeam = currentTeam === "teamA" ? "teamB" : "teamA";
  const nextRound = state.progress.currentRound + 1;

  state.trivia.turnTeamKey = nextTeam;
  switchRoundContext("trivia", nextRound, { navigateToSection: false });
  const nextRoundState = getOrCreateTriviaRoundState(nextRound);
  nextRoundState.teamKey = nextTeam;
  nextRoundState.betAmount = 100;
  nextRoundState.selectedOptionIndex = -1;
  nextRoundState.lockedOptionIndex = -1;
  nextRoundState.resultChecked = false;
  nextRoundState.isCorrect = null;
  nextRoundState.lastDelta = 0;
  nextRoundState.resultCategoryId = "";
  nextRoundState.lastResult = "";

  setOverlayAnswerLocked(false, { persist: false });
  resetTimer();
  if (elements.triviaBetAmountInput) {
    elements.triviaBetAmountInput.value = "100";
  }
  setLiveRoundStep("topic-select", { persist: false });
  setShowScreen("live-round", { persist: false });
  setLastResultSummary(`Next Trivia round: ${state.teams[nextTeam].name} chooses the next topic.`);
  renderAll();
  saveState("Trivia moved to next topic.");
}

function applyTriviaRoundResult(isCorrect, options = {}) {
  if (state.progress.currentGame !== "trivia") {
    switchRoundContext("trivia", state.progress.currentRound, { navigateToSection: false });
  }

  const triviaRoundState = getOrCreateTriviaRoundState();
  const selectedCategory = state.trivia.categories.find((entry) => entry.id === triviaRoundState.selectedCategoryId);
  if (!selectedCategory) {
    setLastResultSummary("Selecteaza un topic valid inainte de rezultat.");
    renderTriviaControls();
    renderShowUi();
    saveState("Trivia result blocked: no category selected.");
    return;
  }

  const playingTeamKey = triviaRoundState.teamKey;
  const playingTeam = state.teams[playingTeamKey];
  const bonus = Math.max(
    0,
    Math.round(sanitizeNumber(elements.triviaFixedBonusInput?.value, state.trivia.fixedBonus))
  );
  state.trivia.fixedBonus = bonus;

  const sourceBet =
    options.betAmount ??
    triviaRoundState.betAmount ??
    normalizeBetAmount(elements.triviaBetAmountInput?.value || 100);
  const normalizedBet = normalizeBetAmount(sourceBet);
  const maxAllowedBet = getMaxBetAmount(playingTeam.money, "trivia");
  if (maxAllowedBet <= 0) {
    setLastResultSummary(`${playingTeam.name} cannot place Trivia bet now (max allowed is 0).`);
    renderTriviaControls();
    renderShowUi();
    saveState("Trivia bet blocked.");
    return;
  }

  const effectiveBet = Math.min(normalizedBet, maxAllowedBet);
  triviaRoundState.betAmount = effectiveBet;
  if (elements.triviaBetAmountInput) {
    elements.triviaBetAmountInput.value = String(effectiveBet);
  }
  const teamDelta = isCorrect ? effectiveBet + bonus : -effectiveBet;
  pushResultUndoSnapshot("Trivia round result");

  const selectedCategoryId = triviaRoundState.selectedCategoryId;
  if (selectedCategoryId && !triviaRoundState.usedCategoryIds.includes(selectedCategoryId)) {
    triviaRoundState.usedCategoryIds.push(selectedCategoryId);
  }

  const selectedOptionIndex = Math.round(
    sanitizeNumber(options.selectedOptionIndex, triviaRoundState.selectedOptionIndex)
  );
  triviaRoundState.lockedOptionIndex = selectedOptionIndex;
  triviaRoundState.resultCategoryId = selectedCategoryId;
  triviaRoundState.resultChecked = true;
  triviaRoundState.isCorrect = Boolean(isCorrect);
  triviaRoundState.lastDelta = teamDelta;
  state.trivia.turnTeamKey = playingTeamKey === "teamA" ? "teamB" : "teamA";

  if (isCorrect) {
    const gain = effectiveBet + bonus;
    playingTeam.money += gain;
    triviaRoundState.lastResult =
      `${playingTeam.name} answered Trivia correctly: +${formatMoney(bonus)} bonus +${formatMoney(
        effectiveBet
      )} bet win. Total money ${formatMoney(playingTeam.money)}.`;
    setLastResultSummary(triviaRoundState.lastResult);
  } else {
    playingTeam.money = Math.max(0, playingTeam.money - effectiveBet);
    triviaRoundState.lastResult =
      `${playingTeam.name} answered Trivia wrong: -${formatMoney(effectiveBet)} bet. ` +
        `Total money ${formatMoney(playingTeam.money)}.`;
    setLastResultSummary(triviaRoundState.lastResult);
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
  saveCurrentRoundSnapshot();
  renderTeams();
  renderRoundSelection();
  renderBettingInfo();
  renderTriviaControls();
  renderShowUi();
  saveState(isCorrect ? "Trivia correct payout applied." : "Trivia wrong payout applied.");
}

function computeFixedTitlePlayerSnapshot() {
  const fixedPlayer = getFixedTitlePlayer();
  if (!fixedPlayer) {
    return {
      playerName: FIXED_TITLE_PLAYER_NAME,
      roundsActive: 0,
      roundsTeamA: 0,
      roundsTeamB: 0,
      roundsOut: 0,
      gamesPlayed: 0,
      roundsWon: 0,
      roundsLost: 0,
      netMoney: 0,
      betsWon: 0,
      betsLost: 0
    };
  }

  const roundsTeamA = getPlayerActiveRounds("teamA", fixedPlayer.id);
  const roundsTeamB = getPlayerActiveRounds("teamB", fixedPlayer.id);
  const roundsActive = roundsTeamA + roundsTeamB;
  const snapshots = Object.entries(state.roundSelection.history)
    .filter(([key]) => isRoundHistoryKey(key))
    .map(([, snapshot]) => snapshot);
  const roundsOut = Math.max(0, snapshots.length - roundsActive);

  return {
    playerName: fixedPlayer.name,
    roundsActive,
    roundsTeamA,
    roundsTeamB,
    roundsOut,
    gamesPlayed: fixedPlayer.stats.gamesPlayed,
    roundsWon: fixedPlayer.stats.roundsWon,
    roundsLost: fixedPlayer.stats.roundsLost,
    netMoney: fixedPlayer.stats.netMoney,
    betsWon: fixedPlayer.stats.betsWon,
    betsLost: fixedPlayer.stats.betsLost
  };
}

function getPlayerActiveRounds(teamKey, playerId) {
  let roundsActive = 0;
  for (const [historyKey, snapshot] of Object.entries(state.roundSelection.history)) {
    if (!isRoundHistoryKey(historyKey)) {
      continue;
    }
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

  container.innerHTML = state.teams[teamKey].players
    .map((player) => {
      const isSelected = selectedIds.has(player.id);
      const canBeActive = player.status === "available" && !isLocked;
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

  const lockText = state.roundSelection.locked ? "Game lineup locked." : "Game lineup unlocked.";
  if (elements.selectionLockStatus) {
    elements.selectionLockStatus.textContent =
      `${lockText} Current game lineup stays active on all rounds until game ends.`;
  }
  if (elements.lockRoundSelectionBtn) {
    elements.lockRoundSelectionBtn.textContent = state.roundSelection.locked
      ? "Unlock game lineup"
      : "Lock game lineup";
  }
  if (elements.clearActiveSelectionBtn) {
    elements.clearActiveSelectionBtn.disabled = state.roundSelection.locked;
  }

  const countA = countActiveWithJoker("teamA");
  const countB = countActiveWithJoker("teamB");
  if (elements.activeCountTeamA) {
    elements.activeCountTeamA.textContent = `${countA}/${MAX_ACTIVE_PER_TEAM}`;
  }
  if (elements.activeCountTeamB) {
    elements.activeCountTeamB.textContent = `${countB}/${MAX_ACTIVE_PER_TEAM}`;
  }

  renderTeamPlayersList("teamA");
  renderTeamPlayersList("teamB");

  const fixedTitleStats = computeFixedTitlePlayerSnapshot();
  if (elements.jokerRoundsActive) {
    elements.jokerRoundsActive.textContent = String(fixedTitleStats.roundsActive);
  }
  if (elements.jokerRoundsTeamA) {
    elements.jokerRoundsTeamA.textContent = String(fixedTitleStats.roundsTeamA);
  }
  if (elements.jokerRoundsTeamB) {
    elements.jokerRoundsTeamB.textContent = String(fixedTitleStats.roundsTeamB);
  }
  if (elements.jokerRoundsOut) {
    elements.jokerRoundsOut.textContent = String(fixedTitleStats.roundsOut);
  }
  if (elements.jokerAwardSummary) {
    elements.jokerAwardSummary.textContent =
      `${fixedTitleStats.playerName} stats: active ${fixedTitleStats.roundsActive} rounds (Team 1: ${fixedTitleStats.roundsTeamA}, ` +
      `Team 2: ${fixedTitleStats.roundsTeamB}, Bench/Out: ${fixedTitleStats.roundsOut}). Games played ${fixedTitleStats.gamesPlayed}. ` +
      `Rounds W/L ${fixedTitleStats.roundsWon}/${fixedTitleStats.roundsLost}, money net ${formatSignedMoney(
        fixedTitleStats.netMoney
      )}, bets W/L ${fixedTitleStats.betsWon}/${fixedTitleStats.betsLost}. Fixed title stays ${FIXED_TITLE_LABEL}.`;
  }
  renderAwardsTitles();
  renderShowUi();
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
  renderShowUi();
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
  const previousGameId = state.progress.currentGame;
  const gameChanged = previousGameId !== nextGameId;
  saveCurrentRoundSnapshot();

  state.progress.currentGame = nextGameId;
  state.progress.currentRound = Math.max(1, Math.round(sanitizeNumber(nextRound, 1)));
  if (gameChanged) {
    state.roundSelection.locked = false;
  }
  ensureShowUiState();
  state.showUi.liveRoundStep = getDefaultFlowStateId(nextGameId);
  state.showUi.answerLocked = false;

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
  setGameLineupReady(nextGameId, false);
  switchRoundContext(nextGameId, 1, { navigateToSection: true });
  state.showUi.activeScreen = "game-intro";
  setLastResultSummary(`Moved to ${getGameLabel(nextGameId)}. Round reset to 1.`);
  renderAll();
  saveState(`Next game: ${getGameLabel(nextGameId)}`);
}

function openLeaderboard() {
  setActiveSection("leaderboard", { persist: false });
  state.showUi.activeScreen = "leaderboard";
  setLastResultSummary("Leaderboard opened from Control Center.");
  renderShowUi();
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
  if (currentGameId === "trivia") {
    state.trivia.rounds = {};
    state.trivia.turnTeamKey = "teamA";
    if (elements.triviaBetAmountInput) {
      elements.triviaBetAmountInput.value = "100";
    }
  }
  for (const key of Object.keys(state.roundSelection.history)) {
    if (key.startsWith(`${currentGameId}::`)) {
      delete state.roundSelection.history[key];
    }
  }
  setGameLineupReady(currentGameId, false);

  switchRoundContext(currentGameId, 1, { navigateToSection: false });
  setActiveSection("home", { persist: false });
  state.showUi.activeScreen = "show-home";
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

function addPlayer(teamKey, inputElement, options = {}) {
  const ignoreLock = options.ignoreLock === true;
  if (state.roundSelection.locked && !ignoreLock) {
    setLastResultSummary("Game lineup is locked. Unlock to add players.");
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

function removePlayer(teamKey, playerId, options = {}) {
  const ignoreLock = options.ignoreLock === true;
  if (state.roundSelection.locked && !ignoreLock) {
    setLastResultSummary("Game lineup is locked. Unlock to remove players.");
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

  state.roundSelection.activeByTeam.teamA = state.roundSelection.activeByTeam.teamA.filter((id) => id !== playerId);
  state.roundSelection.activeByTeam.teamB = state.roundSelection.activeByTeam.teamB.filter((id) => id !== playerId);
  for (const snapshot of Object.values(state.roundSelection.history)) {
    snapshot.activeByTeam.teamA = snapshot.activeByTeam.teamA.filter((id) => id !== playerId);
    snapshot.activeByTeam.teamB = snapshot.activeByTeam.teamB.filter((id) => id !== playerId);
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

function updatePlayerStatus(teamKey, playerId, nextStatus, options = {}) {
  const ignoreLock = options.ignoreLock === true;
  if (state.roundSelection.locked && !ignoreLock) {
    setLastResultSummary("Game lineup is locked. Unlock to update statuses.");
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
    state.roundSelection.activeByTeam.teamA = state.roundSelection.activeByTeam.teamA.filter((id) => id !== playerId);
    state.roundSelection.activeByTeam.teamB = state.roundSelection.activeByTeam.teamB.filter((id) => id !== playerId);
  }

  saveCurrentRoundSnapshot();
  renderRoundSelection();
  setLastResultSummary(`${player.name} status set to ${nextStatus}.`);
  saveState("Player status updated.");
}

function togglePlayerActive(teamKey, playerId, shouldBeActive) {
  if (state.roundSelection.locked) {
    setLastResultSummary("Game lineup is locked. Unlock to change active players.");
    saveState("Active toggle blocked while locked.");
    return;
  }

  const player = findPlayer(teamKey, playerId);
  if (!player) {
    return;
  }

  if (state.progress.currentGame === "cel-mai-bun-samsar") {
    setLastResultSummary("Samsar specific selectors can still override lineup from Host/Debug if needed.");
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
        setLastResultSummary(`${state.teams[teamKey].name} reached max ${MAX_ACTIVE_PER_TEAM} active players for this game.`);
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
  setLastResultSummary(`${player.name} lineup state updated for ${getGameLabel(state.progress.currentGame)}.`);
  saveState("Active selection updated.");
}

function setJokerAssignment(nextAssignment) {
  void nextAssignment;
  state.roundSelection.jokerAssignment = "out";
  setLastResultSummary("Special Joker assignment was removed. Use normal lineup tokens for all players.");
  renderRoundSelection();
  saveState("Legacy Joker assignment ignored.");
}

function toggleRoundSelectionLock() {
  state.roundSelection.locked = !state.roundSelection.locked;
  if (state.roundSelection.locked) {
    saveCurrentRoundSnapshot();
    setLastResultSummary("Game lineup locked.");
    saveState("Game lineup locked.");
  } else {
    setLastResultSummary("Game lineup unlocked.");
    saveState("Game lineup unlocked.");
  }
  renderRoundSelection();
}

function clearActiveSelection() {
  if (state.roundSelection.locked) {
    setLastResultSummary("Game lineup is locked. Unlock to clear active players.");
    saveState("Clear active blocked while locked.");
    return;
  }

  state.roundSelection.activeByTeam.teamA = [];
  state.roundSelection.activeByTeam.teamB = [];
  saveCurrentRoundSnapshot();
  renderRoundSelection();
  setLastResultSummary("Game lineup cleared for both teams.");
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

function setTimerRemaining(nextSeconds) {
  const normalized = clampNumber(Math.round(sanitizeNumber(nextSeconds, state.timer.remaining)), 0, 600);
  const wasRunning = state.timer.isRunning;
  state.timer.remaining = normalized;
  if (state.timer.remaining === 0) {
    state.timer.isRunning = false;
    state.timer.lastTickMs = null;
    stopTimerLoop();
  } else if (wasRunning) {
    state.timer.lastTickMs = Date.now();
  }
  renderTimer();
  saveState(`Timer set to ${state.timer.remaining}s.`);
}

function adjustTimerRemaining(deltaSeconds) {
  const delta = Math.round(sanitizeNumber(deltaSeconds, 0));
  if (delta === 0) {
    return;
  }
  setTimerRemaining(state.timer.remaining + delta);
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
  const accepted = window.confirm("Reset all dashboard data and restore demo sample content?");
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
  saveState("Session reset to demo sample content.");
}

function handleBoundInput(field) {
  const path = field.dataset.bind;
  if (!path) {
    return;
  }

  let value = field.value;
  if (path === "teams.teamA.name") {
    value = value.trim() || DEFAULT_STATE.teams.teamA.name;
  } else if (path === "teams.teamB.name") {
    value = value.trim() || DEFAULT_STATE.teams.teamB.name;
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
  elements.showScreenButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.showScreenTarget;
      if (!SHOW_SCREEN_IDS.includes(target)) {
        return;
      }
      setShowScreen(target, { source: "top-nav" });
    });
  });

  if (elements.hostPanelToggleBtn) {
    elements.hostPanelToggleBtn.addEventListener("click", () => {
      setHostPanelOpen(!state.showUi?.hostPanelOpen);
    });
  }
  if (elements.hostPanelCloseBtn) {
    elements.hostPanelCloseBtn.addEventListener("click", () => {
      setHostPanelOpen(false);
    });
  }
  if (elements.hostPanelOverlay) {
    elements.hostPanelOverlay.addEventListener("click", () => {
      setHostPanelOpen(false);
    });
  }
  if (elements.hostAdminAdvancedBtn) {
    elements.hostAdminAdvancedBtn.addEventListener("click", () => {
      setHostAdvancedOpen(!state.showUi?.adminAdvancedOpen);
    });
  }
  if (elements.showScreenContent) {
    elements.showScreenContent.addEventListener("click", (event) => {
      handleShowOverlayClick(event);
    });
    elements.showScreenContent.addEventListener("change", (event) => {
      handleShowOverlayChange(event.target);
    });
  }

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
      if (sectionId === "leaderboard") {
        state.showUi.activeScreen = "leaderboard";
      } else if (sectionId === "end-screen") {
        state.showUi.activeScreen = "end-screen";
      } else if (sectionId === "home") {
        state.showUi.activeScreen = "show-home";
      }
      setLastResultSummary(`Opened ${button.textContent?.trim() || sectionId}.`);
      renderShowUi();
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
      state.showUi.activeScreen = isGameLineupReady(gameId) ? "live-round" : "game-intro";
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
  if (elements.adminUndoBtn) {
    elements.adminUndoBtn.addEventListener("click", () => {
      undoLastAppliedResult();
    });
  }
  if (elements.adminUnlockSelectionBtn) {
    elements.adminUnlockSelectionBtn.addEventListener("click", () => {
      if (state.roundSelection.locked) {
        toggleRoundSelectionLock();
      } else {
        setLastResultSummary("Round selection is already unlocked.");
        saveState("Selection already unlocked.");
      }
    });
  }
  if (elements.adminForceRevealBtn) {
    elements.adminForceRevealBtn.addEventListener("click", () => {
      tryForceRevealForCurrentGame();
    });
  }
  if (elements.adminNextRoundBtn) {
    elements.adminNextRoundBtn.addEventListener("click", () => {
      setCurrentRound(state.progress.currentRound + 1);
      setShowScreen("game-intro", { persist: false });
    });
  }
  if (elements.adminNextGameBtn) {
    elements.adminNextGameBtn.addEventListener("click", () => {
      nextGame();
    });
  }
  if (elements.adminApplyMoneyBtn) {
    elements.adminApplyMoneyBtn.addEventListener("click", () => {
      setTeamMoneyAbsolute("teamA", elements.adminMoneyTeamAInput?.value);
      setTeamMoneyAbsolute("teamB", elements.adminMoneyTeamBInput?.value);
      renderAll();
      setLastResultSummary("Money override applied from admin panel.");
      saveState("Admin money override applied.");
    });
  }
  if (elements.adminResetMoneyBtn) {
    elements.adminResetMoneyBtn.addEventListener("click", () => {
      resetMoney();
    });
  }
  if (elements.adminApplyStateBtn) {
    elements.adminApplyStateBtn.addEventListener("click", () => {
      const gameId = elements.adminGameSelect?.value || state.progress.currentGame;
      const roundNumber = elements.adminRoundInput?.value || state.progress.currentRound;
      setCurrentGame(gameId, { keepRound: true, navigateToSection: false });
      setCurrentRound(roundNumber);
      setShowScreen("game-intro", { persist: false });
      saveState("Admin game/round override applied.");
    });
  }
  if (elements.adminResetGameBtn) {
    elements.adminResetGameBtn.addEventListener("click", () => {
      resetCurrentGame();
    });
  }
  if (elements.adminFullResetBtn) {
    elements.adminFullResetBtn.addEventListener("click", () => {
      resetSession();
    });
  }
  if (elements.adminApplyTimerBtn) {
    elements.adminApplyTimerBtn.addEventListener("click", () => {
      applyAdminTimerOverride();
    });
  }
  if (elements.adminPauseTimerBtn) {
    elements.adminPauseTimerBtn.addEventListener("click", () => {
      pauseTimer();
      setLastResultSummary("Timer paused from host panel.");
      saveState("Admin timer paused.");
    });
  }
  if (elements.adminResetTimerBtn) {
    elements.adminResetTimerBtn.addEventListener("click", () => {
      resetTimer();
      setLastResultSummary("Timer reset from host panel.");
      saveState("Admin timer reset.");
    });
  }
  if (elements.adminFixTeamSelect) {
    elements.adminFixTeamSelect.addEventListener("change", () => {
      renderAdminFixPlayerOptions();
    });
  }
  if (elements.adminApplyPlayerFixBtn) {
    elements.adminApplyPlayerFixBtn.addEventListener("click", () => {
      applyAdminPlayerFix();
    });
  }
  if (elements.adminApplySummaryBtn) {
    elements.adminApplySummaryBtn.addEventListener("click", () => {
      const summaryText = String(elements.adminSummaryInput?.value || "").trim();
      if (!summaryText) {
        setLastResultSummary("Summary override requires text.");
        saveState("Summary override blocked.");
        return;
      }
      setLastResultSummary(summaryText);
      saveState("Summary override applied.");
    });
  }
  if (elements.adminExportSaveBtn) {
    elements.adminExportSaveBtn.addEventListener("click", () => {
      exportSaveData();
    });
  }
  if (elements.adminImportSaveBtn) {
    elements.adminImportSaveBtn.addEventListener("click", () => {
      handleImportSaveAction();
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
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.showUi?.hostPanelOpen) {
      setHostPanelOpen(false);
    }
  });
}

function init() {
  state = sanitizeState(state);
  ensureShowUiState();
  state.showUi.hostPanelOpen = false;
  state.showUi.adminAdvancedOpen = false;
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


