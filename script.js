const STORAGE_KEY = "gameshow-host-dashboard-v3";
const LEGACY_STORAGE_KEYS = ["gameshow-host-dashboard-v2", "gameshow-host-dashboard-v1"];
const TEAM_START_MONEY = 1000;
const MAX_ACTIVE_PER_TEAM = 6;
const BET_ROUNDING_STEP = 10;
const SAMSAR_STANDARD_BET = 100;
const RESULT_UNDO_LIMIT = 30;
const SAVE_EXPORT_FORMAT_VERSION = 1;
const CURSE_RACE_TICK_MS = 520;
const CURSE_RACE_FINISH_REVEAL_DELAY_MS = 1500;

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
const STANDARD_FIXED_BONUS_BY_GAME = {
  trivia: 50,
  "guess-right-order": 50,
  "pretul-corect": 50,
  "cel-mai-bun-samsar": 100,
  "beer-pong": 100,
  "shot-fake": 100,
  "curse-de-cai": 0
};
const GAME_ROUND_LIMITS = {
  trivia: 18,
  "guess-right-order": 3,
  "pretul-corect": 12,
  "film-joc-franciza-fun-fact": 12,
  "cel-mai-bun-samsar": 6,
  "beer-pong": 3,
  "shot-fake": 6,
  "curse-de-cai": 3
};
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
        description: "Question stays visible while team locks one answer.",
        visible: ["question prompt", "multiple choice options", "confirm answer"],
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
        id: "topic-select",
        label: "Topic Select",
        description: "Choose the product/topic for this round.",
        visible: ["topic cards", "used status"],
        actions: ["select topic"]
      },
      {
        id: "bet-screen",
        label: "Bet Screen",
        description: "Both teams place bets for the selected product.",
        visible: ["team bet inputs", "max bet info"],
        actions: ["set bets", "confirm bets"]
      },
      {
        id: "product-reveal",
        label: "Product + Guesses",
        description: "Show product image and enter both guesses on the same stage.",
        visible: ["product image", "both guesses", "hidden real price source"],
        actions: ["auto winner + payout"]
      },
      {
        id: "auto-winner",
        label: "Auto Winner",
        description: "Automatic winner detection and payout result.",
        visible: ["winner/tie", "money delta", "used topic update"],
        actions: ["next topic / finish game"],
        payout: true
      }
    ],
    payoutStateId: "auto-winner",
    roundReturn: "After payout, flow returns to Topic Select.",
    gameEnd: "Game ends when all configured items are used, then returns to Game Select."
  },
  "film-joc-franciza-fun-fact": {
    states: [
      {
        id: "topic-select",
        label: "Topic Select",
        description: "Active team picks one unused category card.",
        visible: ["active team", "category cards", "used status"],
        actions: ["select category"]
      },
      {
        id: "bet-screen",
        label: "Bet Screen",
        description: "Only active team places bet for this round.",
        visible: ["selected category", "active team bet", "max bet info"],
        actions: ["set bet"]
      },
      {
        id: "card-reveal",
        label: "Card Reveal",
        description: "Image + reveal cards on one screen for active team evaluation.",
        visible: ["large image", "3 reveal cards", "mark correct/wrong"],
        actions: ["reveal cards", "set outcomes", "calculate result"]
      },
      {
        id: "breakdown-result",
        label: "Breakdown Result",
        description: "Show weighted breakdown and payout for active team.",
        visible: ["component breakdown", "bet activation", "money delta"],
        actions: ["next round / finish game"],
        payout: true
      }
    ],
    payoutStateId: "breakdown-result",
    roundReturn: "After result, flow returns to Topic Select with automatic team turn switch.",
    gameEnd: "Game ends when all 12 configured rounds are used, then returns to Game Select."
  },
  "cel-mai-bun-samsar": {
    states: [
      {
        id: "bet-screen",
        label: "Bet Screen",
        description: "Prepare duel stakes for both teams.",
        visible: ["stake preview", "round number"],
        actions: ["continue to live duel"]
      },
      {
        id: "live-duel",
        label: "Live Duel",
        description: "Show persona, pick duelists, and run the live 1v1.",
        visible: ["persona card", "duelist selectors"],
        actions: ["select duelists", "continue to result"]
      },
      {
        id: "result-screen",
        label: "Result + Payout",
        description: "Winner, payout, and round outcome summary.",
        visible: ["score entry", "winner/draw", "money delta"],
        actions: ["next round / finish game"],
        payout: true
      }
    ],
    payoutStateId: "result-screen",
    roundReturn: "After reveal, Next round moves to next samsar round.",
    gameEnd: "Game ends automatically after round 6, then returns to Game Select."
  },
  "guess-right-order": {
    states: [
      {
        id: "bet-screen",
        label: "Bet Screen",
        description: "Set team bets for this challenge round.",
        visible: ["team bets", "lineup snapshot"],
        actions: ["set bets"]
      },
      {
        id: "live-round",
        label: "Live Round",
        description: "Play the order challenge live.",
        visible: ["challenge focus"],
        actions: ["continue to result"]
      },
      {
        id: "result-screen",
        label: "Result Screen",
        description: "Pick winner or draw and apply payout.",
        visible: ["winner controls", "money delta"],
        actions: ["apply result", "next round / finish game"],
        payout: true
      }
    ],
    payoutStateId: "result-screen",
    roundReturn: "After reveal, use Next round for the next order challenge.",
    gameEnd: "Game ends after 3 rounds, then returns to Game Select."
  },
  "beer-pong": {
    states: [
      {
        id: "bet-screen",
        label: "Bet Screen",
        description: "Set bets for both teams using the confirmed lineup.",
        visible: ["team cards", "bets", "lineup snapshot"],
        actions: ["set bets"]
      },
      {
        id: "live-round",
        label: "Live Round",
        description: "Play live with visible scoreline.",
        visible: ["matchup focus"],
        actions: ["continue to result"]
      },
      {
        id: "result-screen",
        label: "Result Screen",
        description: "Lock answer and apply final result.",
        visible: ["winner/draw controls", "money delta"],
        actions: ["apply result", "next round / finish game"],
        payout: true
      }
    ],
    payoutStateId: "result-screen",
    roundReturn: "After reveal, Next round starts the next beer pong round.",
    gameEnd: "Game ends after 3 rounds, then returns to Game Select."
  },
  "shot-fake": {
    states: [
      {
        id: "sidebet-setup",
        label: "Side Bet Setup",
        description: "Prepare base bets and side bets for confirmed lineup.",
        visible: ["side bet list", "active-player multipliers", "lineup snapshot"],
        actions: ["set bets", "add/remove side bets"]
      },
      {
        id: "live-round",
        label: "Live Round",
        description: "Run live round with payout preview.",
        visible: ["bet x active-opponents preview", "scoreline"],
        actions: ["continue to result"]
      },
      {
        id: "result-screen",
        label: "Result Screen",
        description: "Lock answer and apply settlement (winner bonus + bet multiplier + side bets).",
        visible: ["net preview", "settlement controls"],
        actions: ["apply settlement", "next round / finish game"],
        payout: true
      }
    ],
    payoutStateId: "result-screen",
    roundReturn: "After reveal, Next round starts next Shot Fake round.",
    gameEnd: "Game ends after 6 rounds, then returns to Game Select."
  },
  "curse-de-cai": {
    states: [
      {
        id: "race-intro",
        label: "Race Intro",
        description: "Present horses, symbols, and race stories.",
        visible: ["horse roster", "mini stories"],
        actions: ["continue to bets"]
      },
      {
        id: "bet-screen",
        label: "Bet Screen",
        description: "Set multi-bets for both teams before the race starts.",
        visible: ["multi-bet board", "team totals"],
        actions: ["set bets", "continue to race"]
      },
      {
        id: "race-screen",
        label: "Race Screen",
        description: "Run automatic race simulation with card draws and push-back logic.",
        visible: ["visual track", "draw log", "leader"],
        actions: ["run race"]
      },
      {
        id: "winner-screen",
        label: "Winner Screen",
        description: "Show detected winner horse before payout.",
        visible: ["winner horse", "race summary"],
        actions: ["continue to payout"]
      },
      {
        id: "payout-screen",
        label: "Payout Screen",
        description: "Apply x4 payout only for bets on winner horse.",
        visible: ["net payout preview", "money delta"],
        actions: ["apply payout", "next race / finish game"],
        payout: true
      }
    ],
    payoutStateId: "payout-screen",
    roundReturn: "After reveal, Next round starts the next race.",
    gameEnd: "Game ends after 3 races, then returns to Game Select."
  }
};
const DEFAULT_RESULT_SUMMARY = "Niciun rezultat aplicat inca.";
const DEFAULT_TRIVIA_CATEGORIES = [
  {
    id: "0",
    title: "Chimie & skincare",
    question: "Ce ingredient activ este cunoscut pentru exfoliere chimica si este des folosit in produse anti-acnee?",
    options: ["Ceramide", "Acid salicilic", "Squalane", "Niacinamida"],
    correctAnswerIndex: 1,
    answer: "Acid salicilic"
  },
  {
    id: "1",
    title: "Arta & curente",
    question: "Care dintre urmatoarele caracterizeaza cel mai bine stilul baroc?",
    options: [
      "Dramatism, ornament bogat si contrast puternic",
      "Linii simple si decor minim",
      "Forme industriale si beton aparent",
      "Simetrie rigida fara decoratiuni"
    ],
    correctAnswerIndex: 0,
    answer: "Dramatism, ornament bogat si contrast puternic"
  },
  {
    id: "2",
    title: "Sah",
    question: "Cum se numeste situatia in care este randul tau sa muti, dar orice mutare legala iti inrautateste pozitia?",
    options: ["Pat", "Remiza prin repetare", "Mat", "Zugzwang"],
    correctAnswerIndex: 3,
    answer: "Zugzwang"
  },
  {
    id: "3",
    title: "Medicina & dinti",
    question: "Care este stratul cel mai dur din corpul uman?",
    options: ["Dentina", "Osul cortical", "Cementul dentar", "Smaltul dentar"],
    correctAnswerIndex: 3,
    answer: "Smaltul dentar"
  },
  {
    id: "4",
    title: "Catan",
    question: "In varianta clasica de Catan, cate orase are la dispozitie fiecare jucator in culoarea sa?",
    options: ["4", "3", "5", "6"],
    correctAnswerIndex: 0,
    answer: "4"
  },
  {
    id: "5",
    title: "Animatie",
    question: "In Frozen, cum se numeste renul lui Kristoff?",
    options: ["Olaf", "Hans", "Pabbie", "Sven"],
    correctAnswerIndex: 3,
    answer: "Sven"
  },
  {
    id: "6",
    title: "Al Doilea Razboi Mondial",
    question: "Cum se numea planul german pentru invadarea Uniunii Sovietice in 1941?",
    options: ["Operatiunea Torch", "Operatiunea Overlord", "Operatiunea Barbarossa", "Operatiunea Market Garden"],
    correctAnswerIndex: 2,
    answer: "Operatiunea Barbarossa"
  },
  {
    id: "7",
    title: "Europa & giganti",
    question: "Ce echipa i-a invins in UEFA Champions League de 10 ori pe Barcelona si de 11 ori pe Real Madrid?",
    options: ["Liverpool", "AC Milan", "Bayern Munchen", "Juventus"],
    correctAnswerIndex: 2,
    answer: "Bayern Munchen"
  },
  {
    id: "8",
    title: "Franta 2016",
    question: "Cine a invins Franta in finala EURO 2016?",
    options: ["Italia", "Portugalia", "Germania", "Spania"],
    correctAnswerIndex: 1,
    answer: "Portugalia"
  },
  {
    id: "9",
    title: "Motoare & BMW",
    question: "BMW B58 este cunoscut in principal ca fiind ce tip de motor?",
    options: [
      "L4 turbo de 2.0 litri",
      "V6 biturbo de 3.0 litri",
      "L6 turbo de 3.0 litri",
      "V8 aspirat de 4.0 litri"
    ],
    correctAnswerIndex: 2,
    answer: "L6 turbo de 3.0 litri"
  },
  {
    id: "10",
    title: "F1 & citate",
    question: "Cine a spus despre Max Verstappen ca este \"clar unul dintre cei mai mari din toate timpurile\"?",
    options: ["Fernando Alonso", "Sebastian Vettel", "Adrian Newey", "Helmut Marko"],
    correctAnswerIndex: 2,
    answer: "Adrian Newey"
  },
  {
    id: "11",
    title: "Romania & cultura",
    question: "In ce an a fost publicat pentru prima data romanul \"Maitreyi\" de Mircea Eliade?",
    options: ["1933", "1928", "1940", "1956"],
    correctAnswerIndex: 0,
    answer: "1933"
  },
  {
    id: "12",
    title: "Vedete & replici",
    question: "La ce persoana face referire citatul: \"Cand spui <<...>>, spui o personalitate\"?",
    options: ["Sanziana Buruiana", "Andreea Tonciu", "Daniela Crudu", "Ana Maria Prodan"],
    correctAnswerIndex: 1,
    answer: "Andreea Tonciu"
  },
  {
    id: "13",
    title: "Pictura & muzee",
    question: "In ce muzeu se afla astazi celebra lucrare \"Noaptea instelata\" de Vincent van Gogh?",
    options: ["Louvre, Paris", "Van Gogh Museum, Amsterdam", "MoMA, New York", "Tate Modern, Londra"],
    correctAnswerIndex: 2,
    answer: "MoMA, New York"
  },
  {
    id: "14",
    title: "Business",
    question:
      "Cum se numeste strategia prin care un produs este lansat la pret mare, apoi pretul este redus treptat pentru a atrage si alte segmente de clienti?",
    options: ["Cross-selling", "Bundling", "Penetrare de piata", "Skimming"],
    correctAnswerIndex: 3,
    answer: "Skimming"
  },
  {
    id: "15",
    title: "F1 piloti",
    question: "La ce echipa a debutat Max Verstappen in Formula 1?",
    options: ["Toro Rosso", "Red Bull", "Ferrari", "Renault"],
    correctAnswerIndex: 0,
    answer: "Toro Rosso"
  },
  {
    id: "16",
    title: "Sasii din Transilvania",
    question:
      "Cum se numea decretul din 1224 prin care sasii din Transilvania au primit privilegii importante din partea coroanei maghiare?",
    options: ["Unio Trium Nationum", "Andreanum", "Diploma Leopoldinum", "Bula de Aur"],
    correctAnswerIndex: 1,
    answer: "Andreanum"
  },
  {
    id: "17",
    title: "Lumina & atmosfera",
    question: "Ce schimbare face de obicei o camera sa para mai plata si fara atmosfera?",
    options: [
      "Mai multe surse de lumina, pe zone diferite",
      "Lumina de accent pe texturi si colturi",
      "Layered lighting cu intensitati diferite",
      "O singura lumina centrala foarte puternica"
    ],
    correctAnswerIndex: 3,
    answer: "O singura lumina centrala foarte puternica"
  }
];
const PRETUL_PRODUCT_PLACEHOLDER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 960 540'><defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0' stop-color='%23131f43'/><stop offset='1' stop-color='%232b3c7c'/></linearGradient></defs><rect width='960' height='540' fill='url(%23g)'/><text x='50%25' y='46%25' fill='%23f5f7ff' font-size='40' font-family='Arial' text-anchor='middle'>PRETUL CORECT</text><text x='50%25' y='57%25' fill='%23d4dcff' font-size='24' font-family='Arial' text-anchor='middle'>Product reveal placeholder</text></svg>";
const PRETUL_PRODUCT_IMAGE_BY_URL = {
  "https://www.emag.ro/televizor-samsung-qled-50q7f2-125-cm-smart-4k-ultra-hd-clasa-g-model-2025-qe50q7f2auxxh/pd/DN3GRT3BM/":
    "https://s13emagst.akamaized.net/products/93125/93124846/images/res_6f60c0330dea93a9f6ba8c519d2d75ae.jpg?width=450&height=450&hash=0111B5BA1055588FBE2D814F5CD5A9E8",
  "https://www.emag.ro/espressor-automat-philips-seria-2300-lattego-4-tipuri-de-bauturi-ecran-tactil-intuitiv-tehnologie-noua-silentbrew-aplicatie-homeid-rasnita-ceramica-negru-mat-ep2330-10/pd/D3PXSMYBM/":
    "https://s13emagst.akamaized.net/products/58702/58701138/images/res_9ac4ef3d77054707198c7db0c602879a.jpg?width=450&height=450&hash=1BDC6F7D23B9D4B4E829A54FC7F15A25",
  "https://www.emag.ro/legor-icons-flori-de-prun-10369-327-piese-5702017719696/pd/DVQRNFYBM/":
    "https://s13emagst.akamaized.net/products/71405/71404023/images/res_ea213341bba17269064c3bab7b9cb547.jpg?width=450&height=450&hash=234469978DD876EDA56036F3B648B55E",
  "https://www.emag.ro/laptop-gaming-lenovo-loq-15arp10e-cu-procesor-amd-ryzentm-7-7735hs-pana-la-4-75ghz-15-6-full-hd-ips-144hz-16gb-ddr5-ram-512gb-ssd-nvidiar-geforce-rtxtm-4050-6gb-gddr6-no-os-luna-grey-83s0002rrm/pd/DZY2BG3BM/":
    "https://s13emagst.akamaized.net/products/112674/112673490/images/res_cb4a8b0c25566bf25a3168c7a72ce6e6.png?width=450&height=450&hash=4B46DCA4F30FF19FC5F9D60423485228",
  "https://www.emag.ro/robot-de-aspirare-xiaomi-s40-wi-fi-10000pa-5200mah-aspirare-spalare-simultana-sistem-de-navigatie-lds-520ml-rezervor-pentru-praf-si-270ml-rezervor-de-apa-alb-bhr084aeu/pd/DH9NNS3BM/":
    "https://s13emagst.akamaized.net/products/101865/101864523/images/res_8f6c89564b88ec0f66b0dc66920a52bc.jpg?width=450&height=450&hash=1F99399C4F58918368CD0D92C2915581",
  "https://www.emag.ro/friteuza-cu-aer-cald-ninja-flex-drawer-2470-w-10-4-l-capacitate-mancare-2-kg-interval-temperatura-40-240-c-doua-zone-de-gatit-7-programe-negru-af500eu/pd/DD4DV0YBM/":
    "https://s13emagst.akamaized.net/products/67037/67036111/images/res_73e45582c1fe55bae38b36f8f9a2f123.jpg?width=450&height=450&hash=7621761D2CE2B6B98FAA2AF78B66DFE9",
  "https://www.emag.ro/apa-de-parfum-lattafa-opulent-musk-unisex-100-ml-6291107450445/pd/D0530WBBM/":
    "https://s13emagst.akamaized.net/products/28008/28007239/images/res_499aa4b6ceb9cd7c4a59946380005e5e.jpg?width=450&height=450&hash=1D56A81C829E621D81FD890DCF43D0F1",
  "https://www.emag.ro/telefon-mobil-samsung-galaxy-s24-fe-dual-sim-8gb-ram-128gb-5g-graphite-sm-s721bzkdeue/pd/D0J1YZYBM/":
    "https://s13emagst.akamaized.net/products/77658/77657955/images/res_ff11f356f99b3af89e0e67b5537d3fa6.jpg?width=450&height=450&hash=A6592347AE5ED88F8E74F3B853F67744",
  "https://www.emag.ro/consola-playstation-5-digital-edition-ps5-slim-825gb-ssd-e-chassis-1000049751/pd/D4LQQL3BM/":
    "https://s13emagst.akamaized.net/products/64933/64932189/images/res_b51e79599e34411e9f4ff16d3266e32f.jpg?width=450&height=450&hash=1A8234F59CED8C9A3094B94FA160C471",
  "https://www.emag.ro/casti-apple-airpods-pro-3-carcasa-magsafe-usb-c-mfhp4zm-a/pd/DZ68XV3BM/":
    "https://s13emagst.akamaized.net/products/102926/102925881/images/res_9ece9931dcc5bbfd309ee2bb6bcadb79.jpg?width=450&height=450&hash=B11AE26DED82E9D6514A1060B98E336C",
  "https://www.emag.ro/smartwatch-xiaomi-watch-5-green-bhr07wpgl/pd/D8VWHB2BM/":
    "https://s13emagst.akamaized.net/products/114874/114873721/images/res_7b57979b60386f2f0ceed0dbe5390072.jpg?width=450&height=450&hash=4E7B03DBE88A1F428F11D47C80C52E32",
  "https://www.emag.ro/mixer-planetar-cu-bol-din-inox-goldmann-2800-w-10-l-inox-5-accesorii-6-viteze-cu-pulse-angrenaje-metalice-carcasa-din-inox-argintiu-gm-1115ed/pd/D89KY13BM/":
    "https://s13emagst.akamaized.net/products/107197/107196168/images/res_f9522c9f8802a2c9376bc70594f0b72e.jpg?width=450&height=450&hash=2854E270543A02B01A882015C557BC66"
};
const DEFAULT_PRETUL_ITEMS = [
  {
    id: "0",
    category: "TV & entertainment",
    productTitle: "Televizor Samsung QLED 50Q7F2, 125 cm, Smart 4K",
    productUrl:
      "https://www.emag.ro/televizor-samsung-qled-50q7f2-125-cm-smart-4k-ultra-hd-clasa-g-model-2025-qe50q7f2auxxh/pd/DN3GRT3BM/",
    imageUrl:
      "https://s13emagst.akamaized.net/products/93125/93124846/images/res_6f60c0330dea93a9f6ba8c519d2d75ae.jpg?width=450&height=450&hash=0111B5BA1055588FBE2D814F5CD5A9E8",
    actualPriceLei: 1799.99,
    imageHint: "TV Samsung QLED pe fundal luminos",
    quickSpecs: ["125 cm", "QLED", "Smart TV", "4K UHD"]
  },
  {
    id: "1",
    category: "Cafea & electrocasnice",
    productTitle: "Espressor automat Philips Seria 2300 LatteGo EP2330/10",
    productUrl:
      "https://www.emag.ro/espressor-automat-philips-seria-2300-lattego-4-tipuri-de-bauturi-ecran-tactil-intuitiv-tehnologie-noua-silentbrew-aplicatie-homeid-rasnita-ceramica-negru-mat-ep2330-10/pd/D3PXSMYBM/",
    imageUrl:
      "https://s13emagst.akamaized.net/products/58702/58701138/images/res_9ac4ef3d77054707198c7db0c602879a.jpg?width=450&height=450&hash=1BDC6F7D23B9D4B4E829A54FC7F15A25",
    actualPriceLei: 1599.3,
    imageHint: "Espressor automat negru Philips",
    quickSpecs: ["LatteGo", "4 bauturi", "ecran tactil", "rasnita ceramica"]
  },
  {
    id: "2",
    category: "LEGO & hobby",
    productTitle: "LEGO Icons Flori de prun 10369, 327 piese",
    productUrl:
      "https://www.emag.ro/legor-icons-flori-de-prun-10369-327-piese-5702017719696/pd/DVQRNFYBM/",
    imageUrl:
      "https://s13emagst.akamaized.net/products/71405/71404023/images/res_ea213341bba17269064c3bab7b9cb547.jpg?width=450&height=450&hash=234469978DD876EDA56036F3B648B55E",
    actualPriceLei: 127.99,
    imageHint: "Set LEGO floral decorativ",
    quickSpecs: ["327 piese", "LEGO Icons", "decor floral", "set adult"]
  },
  {
    id: "3",
    category: "Gaming laptop",
    productTitle: "Laptop gaming Lenovo LOQ 15ARP10E, Ryzen 7 7735HS, RTX 4050",
    productUrl:
      "https://www.emag.ro/laptop-gaming-lenovo-loq-15arp10e-cu-procesor-amd-ryzentm-7-7735hs-pana-la-4-75ghz-15-6-full-hd-ips-144hz-16gb-ddr5-ram-512gb-ssd-nvidiar-geforce-rtxtm-4050-6gb-gddr6-no-os-luna-grey-83s0002rrm/pd/DZY2BG3BM/",
    imageUrl:
      "https://s13emagst.akamaized.net/products/112674/112673490/images/res_cb4a8b0c25566bf25a3168c7a72ce6e6.png?width=450&height=450&hash=4B46DCA4F30FF19FC5F9D60423485228",
    actualPriceLei: 3799.99,
    imageHint: "Laptop gaming Lenovo LOQ deschis",
    quickSpecs: ["15.6 inch", "144Hz", "RTX 4050", "16GB RAM"]
  },
  {
    id: "4",
    category: "Casa smart",
    productTitle: "Robot de aspirare Xiaomi S40, aspirare + spalare",
    productUrl:
      "https://www.emag.ro/robot-de-aspirare-xiaomi-s40-wi-fi-10000pa-5200mah-aspirare-spalare-simultana-sistem-de-navigatie-lds-520ml-rezervor-pentru-praf-si-270ml-rezervor-de-apa-alb-bhr084aeu/pd/DH9NNS3BM/",
    imageUrl:
      "https://s13emagst.akamaized.net/products/101865/101864523/images/res_8f6c89564b88ec0f66b0dc66920a52bc.jpg?width=450&height=450&hash=1F99399C4F58918368CD0D92C2915581",
    actualPriceLei: 905.2,
    imageHint: "Robot aspirator alb Xiaomi",
    quickSpecs: ["10000Pa", "5200mAh", "LDS", "aspirare + spalare"]
  },
  {
    id: "5",
    category: "Bucatarie",
    productTitle: "Friteuza cu aer cald Ninja FlexDrawer AF500EU, 10.4 L",
    productUrl:
      "https://www.emag.ro/friteuza-cu-aer-cald-ninja-flex-drawer-2470-w-10-4-l-capacitate-mancare-2-kg-interval-temperatura-40-240-c-doua-zone-de-gatit-7-programe-negru-af500eu/pd/DD4DV0YBM/",
    imageUrl:
      "https://s13emagst.akamaized.net/products/67037/67036111/images/res_73e45582c1fe55bae38b36f8f9a2f123.jpg?width=450&height=450&hash=7621761D2CE2B6B98FAA2AF78B66DFE9",
    actualPriceLei: 951.4,
    imageHint: "Air fryer Ninja negru, capacitate mare",
    quickSpecs: ["10.4 L", "2470W", "2 zone", "7 programe"]
  },
  {
    id: "6",
    category: "Parfumuri",
    productTitle: "Apa de parfum Lattafa Opulent Musk, Unisex, 100 ml",
    productUrl:
      "https://www.emag.ro/apa-de-parfum-lattafa-opulent-musk-unisex-100-ml-6291107450445/pd/D0530WBBM/",
    imageUrl:
      "https://s13emagst.akamaized.net/products/28008/28007239/images/res_499aa4b6ceb9cd7c4a59946380005e5e.jpg?width=450&height=450&hash=1D56A81C829E621D81FD890DCF43D0F1",
    actualPriceLei: 70.13,
    imageHint: "Sticla de parfum eleganta",
    quickSpecs: ["100 ml", "unisex", "eau de parfum", "Lattafa"]
  },
  {
    id: "7",
    category: "Telefoane",
    productTitle: "Samsung Galaxy S24 FE, 8GB RAM, 128GB, 5G",
    productUrl:
      "https://www.emag.ro/telefon-mobil-samsung-galaxy-s24-fe-dual-sim-8gb-ram-128gb-5g-graphite-sm-s721bzkdeue/pd/D0J1YZYBM/",
    imageUrl:
      "https://s13emagst.akamaized.net/products/77658/77657955/images/res_ff11f356f99b3af89e0e67b5537d3fa6.jpg?width=450&height=450&hash=A6592347AE5ED88F8E74F3B853F67744",
    actualPriceLei: 2319.0,
    imageHint: "Telefon Samsung Galaxy S24 FE",
    quickSpecs: ["128GB", "8GB RAM", "5G", "Dual SIM"]
  },
  {
    id: "8",
    category: "Console",
    productTitle: "Consola PlayStation 5 Digital Edition Slim, 825GB SSD",
    productUrl:
      "https://www.emag.ro/consola-playstation-5-digital-edition-ps5-slim-825gb-ssd-e-chassis-1000049751/pd/D4LQQL3BM/",
    imageUrl:
      "https://s13emagst.akamaized.net/products/64933/64932189/images/res_b51e79599e34411e9f4ff16d3266e32f.jpg?width=450&height=450&hash=1A8234F59CED8C9A3094B94FA160C471",
    actualPriceLei: 2299.0,
    imageHint: "PS5 Slim Digital Edition",
    quickSpecs: ["Digital Edition", "825GB SSD", "PS5 Slim", "Sony"]
  },
  {
    id: "9",
    category: "Audio premium",
    productTitle: "Casti Apple AirPods Pro 3, carcasa MagSafe USB-C",
    productUrl:
      "https://www.emag.ro/casti-apple-airpods-pro-3-carcasa-magsafe-usb-c-mfhp4zm-a/pd/DZ68XV3BM/",
    imageUrl:
      "https://s13emagst.akamaized.net/products/102926/102925881/images/res_9ece9931dcc5bbfd309ee2bb6bcadb79.jpg?width=450&height=450&hash=B11AE26DED82E9D6514A1060B98E336C",
    actualPriceLei: 1249.99,
    imageHint: "AirPods Pro cu carcasa alba",
    quickSpecs: ["MagSafe", "USB-C", "true wireless", "Apple"]
  },
  {
    id: "10",
    category: "Wearables",
    productTitle: "Smartwatch Xiaomi Watch 5, Green",
    productUrl: "https://www.emag.ro/smartwatch-xiaomi-watch-5-green-bhr07wpgl/pd/D8VWHB2BM/",
    imageUrl:
      "https://s13emagst.akamaized.net/products/114874/114873721/images/res_7b57979b60386f2f0ceed0dbe5390072.jpg?width=450&height=450&hash=4E7B03DBE88A1F428F11D47C80C52E32",
    actualPriceLei: 1299.0,
    imageHint: "Smartwatch Xiaomi verde",
    quickSpecs: ["smartwatch", "Xiaomi", "green", "wearable"]
  },
  {
    id: "11",
    category: "Mixer & baking",
    productTitle: "Mixer planetar Goldmann, 2800 W, bol inox 10 L",
    productUrl:
      "https://www.emag.ro/mixer-planetar-cu-bol-din-inox-goldmann-2800-w-10-l-inox-5-accesorii-6-viteze-cu-pulse-angrenaje-metalice-carcasa-din-inox-argintiu-gm-1115ed/pd/D89KY13BM/",
    imageUrl:
      "https://s13emagst.akamaized.net/products/107197/107196168/images/res_f9522c9f8802a2c9376bc70594f0b72e.jpg?width=450&height=450&hash=2854E270543A02B01A882015C557BC66",
    actualPriceLei: 599.99,
    imageHint: "Mixer planetar mare cu bol inox",
    quickSpecs: ["2800W", "10 L", "inox", "6 viteze"]
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
const DEFAULT_FILM_ROUND_LIBRARY = [
  {
    id: 0,
    category: "Character / Franchise / Wild Fact",
    imageSourcePageUrl: "https://peaky-blinders.fandom.com/wiki/Thomas_Shelby",
    imageSearchHint: "Thomas Shelby Peaky Blinders portrait",
    characterOrTitle: {
      answer: "Thomas Shelby",
      imageSourcePageUrl: "https://peaky-blinders.fandom.com/wiki/Thomas_Shelby",
      imageSearchHint: "Thomas Shelby Peaky Blinders portrait"
    },
    franchise: {
      answer: "Peaky Blinders",
      imageSourcePageUrl: "https://www.netflix.com/tudum/articles/peaky-blinders-real-life-true-story",
      imageSearchHint: "Peaky Blinders official promo"
    },
    funFact: {
      targetFact: "Pentru Thomas Shelby, Cillian Murphy a tras mii de tigari din plante la filmari.",
      imageSourcePageUrl: "https://peaky-blinders.fandom.com/wiki/Thomas_Shelby",
      imageSearchHint: "Thomas Shelby smoking Peaky Blinders still"
    }
  },
  {
    id: 1,
    category: "Character / Franchise / Wild Fact",
    imageSourcePageUrl: "https://breakingbad.fandom.com/wiki/Jesse_Pinkman",
    imageSearchHint: "Jesse Pinkman Breaking Bad portrait",
    characterOrTitle: {
      answer: "Jesse Pinkman",
      imageSourcePageUrl: "https://breakingbad.fandom.com/wiki/Jesse_Pinkman",
      imageSearchHint: "Jesse Pinkman Breaking Bad portrait"
    },
    franchise: {
      answer: "Breaking Bad",
      imageSourcePageUrl: "https://breakingbad.fandom.com/wiki/Breaking_Bad",
      imageSearchHint: "Breaking Bad official poster"
    },
    funFact: {
      targetFact: "Jesse trebuia sa moara in sezonul 1.",
      imageSourcePageUrl: "https://breakingbad.fandom.com/wiki/Jesse_Pinkman",
      imageSearchHint: "Jesse Pinkman Breaking Bad promo"
    }
  },
  {
    id: 2,
    category: "Character / Franchise / Wild Fact",
    imageSourcePageUrl: "https://strangerthings.fandom.com/wiki/Dustin_Henderson",
    imageSearchHint: "Dustin Henderson Stranger Things portrait",
    characterOrTitle: {
      answer: "Dustin Henderson",
      imageSourcePageUrl: "https://strangerthings.fandom.com/wiki/Dustin_Henderson",
      imageSearchHint: "Dustin Henderson Stranger Things portrait"
    },
    franchise: {
      answer: "Stranger Things",
      imageSourcePageUrl: "https://www.netflix.com/tudum/articles/stranger-things-steve-harrington-joe-keery",
      imageSearchHint: "Stranger Things official poster"
    },
    funFact: {
      targetFact: "Actorul lui Dustin chiar are aceeasi boala rara ca personajul: cleidocranial dysplasia.",
      imageSourcePageUrl: "https://strangerthings.fandom.com/wiki/Dustin_Henderson",
      imageSearchHint: "Dustin Henderson close up Stranger Things"
    }
  },
  {
    id: 3,
    category: "Character / Franchise / Wild Fact",
    imageSourcePageUrl: "https://addamsfamily.fandom.com/wiki/Enid_Sinclair",
    imageSearchHint: "Enid Sinclair Wednesday portrait",
    characterOrTitle: {
      answer: "Enid Sinclair",
      imageSourcePageUrl: "https://addamsfamily.fandom.com/wiki/Enid_Sinclair",
      imageSearchHint: "Enid Sinclair Wednesday portrait"
    },
    franchise: {
      answer: "Wednesday",
      imageSourcePageUrl: "https://www.netflix.com/tudum/articles/wednesday-character-cast-guide-season-1",
      imageSearchHint: "Wednesday Netflix official poster"
    },
    funFact: {
      targetFact: "Jenna Ortega si-a inventat singura dansul viral.",
      imageSourcePageUrl: "https://www.netflix.com/tudum/articles/wednesday-character-cast-guide-season-1",
      imageSearchHint: "Wednesday dance scene Jenna Ortega"
    }
  },
  {
    id: 4,
    category: "Character / Franchise / Wild Fact",
    imageSourcePageUrl: "https://theoffice.fandom.com/wiki/Angela_Martin",
    imageSearchHint: "Angela Martin The Office portrait",
    characterOrTitle: {
      answer: "Angela Martin",
      imageSourcePageUrl: "https://theoffice.fandom.com/wiki/Angela_Martin",
      imageSearchHint: "Angela Martin The Office portrait"
    },
    franchise: {
      answer: "The Office",
      imageSourcePageUrl: "https://theoffice.fandom.com/wiki/The_Office_(US)",
      imageSearchHint: "The Office US cast promo"
    },
    funFact: {
      targetFact: "Pisica aruncata in tavan in The Office era un fake de 12.000 de dolari.",
      imageSourcePageUrl: "https://theoffice.fandom.com/wiki/Stress_Relief",
      imageSearchHint: "The Office Stress Relief cat scene"
    }
  },
  {
    id: 5,
    category: "Character / Franchise / Wild Fact",
    imageSourcePageUrl: "https://naruto.fandom.com/wiki/Tenten",
    imageSearchHint: "Tenten Naruto portrait",
    characterOrTitle: {
      answer: "Tenten",
      imageSourcePageUrl: "https://naruto.fandom.com/wiki/Tenten",
      imageSearchHint: "Tenten Naruto portrait"
    },
    franchise: {
      answer: "Naruto",
      imageSourcePageUrl: "https://naruto.fandom.com/wiki/Naruto_(series)",
      imageSearchHint: "Naruto anime official poster"
    },
    funFact: {
      targetFact: "Potrivit unor numaratori facute de fani, Tenten ar avea mai putin screen time decat swing-kun.",
      imageSourcePageUrl: "https://naruto.fandom.com/wiki/Tenten",
      imageSearchHint: "Tenten Naruto anime still"
    }
  },
  {
    id: 6,
    category: "Character / Franchise / Wild Fact",
    imageSourcePageUrl: "https://gta.fandom.com/wiki/Lester_Crest",
    imageSearchHint: "Lester Crest GTA 5 artwork",
    characterOrTitle: {
      answer: "Lester Crest",
      imageSourcePageUrl: "https://gta.fandom.com/wiki/Lester_Crest",
      imageSearchHint: "Lester Crest GTA 5 artwork"
    },
    franchise: {
      answer: "GTA 5",
      imageSourcePageUrl: "https://gta.fandom.com/wiki/Grand_Theft_Auto_V",
      imageSearchHint: "GTA 5 official key art"
    },
    funFact: {
      targetFact: "GTA 5 a facut peste 800 de milioane de dolari chiar din prima zi.",
      imageSourcePageUrl: "https://gta.fandom.com/wiki/Grand_Theft_Auto_V",
      imageSearchHint: "GTA 5 launch artwork"
    }
  },
  {
    id: 7,
    category: "Character / Franchise / Wild Fact",
    imageSourcePageUrl: "https://bridgerton.fandom.com/wiki/Queen_Charlotte",
    imageSearchHint: "Queen Charlotte Bridgerton portrait",
    characterOrTitle: {
      answer: "Queen Charlotte",
      imageSourcePageUrl: "https://bridgerton.fandom.com/wiki/Queen_Charlotte",
      imageSearchHint: "Queen Charlotte Bridgerton portrait"
    },
    franchise: {
      answer: "Bridgerton",
      imageSourcePageUrl: "https://www.netflix.com/tudum/articles/queen-charlotte-bridgerton-cast-guide",
      imageSearchHint: "Bridgerton official poster"
    },
    funFact: {
      targetFact: "Queen Charlotte a adus Pomeranianii in Anglia.",
      imageSourcePageUrl: "https://www.netflix.com/tudum/articles/queen-charlotte-bridgerton-cast-guide",
      imageSearchHint: "Queen Charlotte Pomeranian Bridgerton"
    }
  },
  {
    id: 8,
    category: "Character / Franchise / Wild Fact",
    imageSourcePageUrl: "https://emilyinparis.fandom.com/wiki/Mindy_Chen",
    imageSearchHint: "Mindy Chen Emily in Paris portrait",
    characterOrTitle: {
      answer: "Mindy Chen",
      imageSourcePageUrl: "https://emilyinparis.fandom.com/wiki/Mindy_Chen",
      imageSearchHint: "Mindy Chen Emily in Paris portrait"
    },
    franchise: {
      answer: "Emily in Paris",
      imageSourcePageUrl: "https://www.netflix.com/tudum/articles/emily-in-paris-season-5-ending-explained-recap",
      imageSearchHint: "Emily in Paris official poster"
    },
    funFact: {
      targetFact: "Mindy si Emily sunt aproape sogorite: au impartit acelasi barbat, pe Alfie.",
      imageSourcePageUrl: "https://www.netflix.com/tudum/articles/emily-in-paris-season-5-ending-explained-recap",
      imageSearchHint: "Mindy Chen Alfie Emily in Paris still"
    }
  },
  {
    id: 9,
    category: "Character / Franchise / Wild Fact",
    imageSourcePageUrl: "https://marvel.fandom.com/wiki/Virginia_Potts_(Earth-199999)",
    imageSearchHint: "Pepper Potts Iron Man movie portrait",
    characterOrTitle: {
      answer: "Pepper Potts",
      imageSourcePageUrl: "https://marvel.fandom.com/wiki/Virginia_Potts_(Earth-199999)",
      imageSearchHint: "Pepper Potts Iron Man movie portrait"
    },
    franchise: {
      answer: "Iron Man",
      imageSourcePageUrl: "https://www.marvel.com/characters/iron-man-tony-stark",
      imageSearchHint: "Iron Man official movie poster"
    },
    funFact: {
      targetFact: "Daca Iron Man nu era un succes, MCU-ul putea sa dea faliment.",
      imageSourcePageUrl: "https://www.marvel.com/characters/iron-man-tony-stark",
      imageSearchHint: "Iron Man 2008 movie still"
    }
  },
  {
    id: 10,
    category: "Character / Franchise / Wild Fact",
    imageSourcePageUrl: "https://the-blacklist.fandom.com/wiki/Dembe_Zuma",
    imageSearchHint: "Dembe Zuma The Blacklist portrait",
    characterOrTitle: {
      answer: "Dembe Zuma",
      imageSourcePageUrl: "https://the-blacklist.fandom.com/wiki/Dembe_Zuma",
      imageSearchHint: "Dembe Zuma The Blacklist portrait"
    },
    franchise: {
      answer: "The Blacklist",
      imageSourcePageUrl: "https://the-blacklist.fandom.com/wiki/The_Blacklist",
      imageSearchHint: "The Blacklist official poster"
    },
    funFact: {
      targetFact: "James Spader a intrat pe rolul lui Red cu doar 3 zile inainte de filmari.",
      imageSourcePageUrl: "https://the-blacklist.fandom.com/wiki/Raymond_Reddington",
      imageSearchHint: "Raymond Reddington The Blacklist promo"
    }
  },
  {
    id: 11,
    category: "Character / Franchise / Wild Fact",
    imageSourcePageUrl: "https://high-school-musical.fandom.com/wiki/Sharpay_Evans",
    imageSearchHint: "Sharpay Evans High School Musical promo",
    characterOrTitle: {
      answer: "Sharpay Evans",
      imageSourcePageUrl: "https://high-school-musical.fandom.com/wiki/Sharpay_Evans",
      imageSearchHint: "Sharpay Evans High School Musical promo"
    },
    franchise: {
      answer: "High School Musical",
      imageSourcePageUrl: "https://www.eonline.com/photos/29378/25-high-school-musical-secrets-revealed",
      imageSearchHint: "High School Musical official poster"
    },
    funFact: {
      targetFact: "Ashley Tisdale a dat prima proba pentru Gabriella, nu pentru Sharpay.",
      imageSourcePageUrl: "https://www.eonline.com/photos/29378/25-high-school-musical-secrets-revealed",
      imageSearchHint: "Ashley Tisdale High School Musical audition era"
    }
  }
];

const DEFAULT_FILM_ITEMS = DEFAULT_FILM_ROUND_LIBRARY.map((entry, index) => ({
  id: `film-item-${index + 1}`,
  title: `Card ${index + 1}`,
  imageUrl: FILM_FALLBACK_IMAGE,
  imageAlt: entry.imageSearchHint || `Round ${index + 1} image`,
  imageSourcePageUrl: entry.imageSourcePageUrl || "",
  imageSearchHint: entry.imageSearchHint || "",
  characterPrompt: entry.characterOrTitle?.answer || "Text reveal Character/Title.",
  characterSourcePageUrl: entry.characterOrTitle?.imageSourcePageUrl || "",
  characterImageHint: entry.characterOrTitle?.imageSearchHint || "",
  franchisePrompt: entry.franchise?.answer || "Text reveal Franchise.",
  franchiseSourcePageUrl: entry.franchise?.imageSourcePageUrl || "",
  franchiseImageHint: entry.franchise?.imageSearchHint || "",
  funFactPrompt: entry.funFact?.targetFact || "Text reveal Fun Fact.",
  funFactSourcePageUrl: entry.funFact?.imageSourcePageUrl || "",
  funFactImageHint: entry.funFact?.imageSearchHint || ""
}));
const DEFAULT_SAMSAR_ROUNDS = [
  {
    id: "samsar-round-1",
    personaTitle: "Persoana 1 - Andrei Pavel",
    personaRequirements:
      "Profil: masculin, 29 ani, sales consultant, oras mare, ~24.000 km/an (oras + interurban), condus des seara, uzual 1-2 pasageri, bagaje frecvente: laptop/rucsac/acte/troler mic. " +
      "Buget tinta 16.000-23.000 EUR, maxim absolut 25.000 EUR; Price Fit se noteaza separat 0-10 in media finala. " +
      "Top 6 criterii: costuri de rulare, risc sh, business look, practic, confort drum lung, usurinta in oras. " +
      "Surprize codate: fdusodb, fdphud."
  },
  {
    id: "samsar-round-2",
    personaTitle: "Persoana 2 - Bianca Ionescu",
    personaRequirements:
      "Profil: feminin, 34 ani, marketing manager, oras mare, ~18.000 km/an, birou + evenimente + escapade de weekend, condus des seara, de regula singura sau cu 1 pasager, bagaje: laptop + cumparaturi + bagaj weekend. " +
      "Buget tinta 38.000-52.000 EUR, maxim absolut 58.000 EUR; Price Fit separat 0-10 in media finala. " +
      "Top 6 criterii: business look, rafinament interior, confort drum lung, usurinta in oras, risc sh, tehnologie utila. " +
      "Surprize codate: fdphud, fdusodb."
  },
  {
    id: "samsar-round-3",
    personaTitle: "Persoana 3 - Radu Muresan",
    personaRequirements:
      "Profil: masculin, 36 ani, arhitect senior, oras mare, ~22.000 km/an, mult oras + drumuri lungi pe autostrada, condus frecvent seara/noaptea, uneori transporta clienti, bagaje: laptop/planuri/geanta/troler mic. " +
      "Buget tinta 42.000-58.000 EUR, maxim absolut 64.000 EUR; Price Fit separat 0-10 in media finala. " +
      "Top 6 criterii: business look, confort drum lung, rafinament interior, lumini/vizibilitate noaptea, risc sh, costuri de rulare. " +
      "Surprize codate: fdusodb, kxg."
  },
  {
    id: "samsar-round-4",
    personaTitle: "Persoana 4 - Mihai Dragomir",
    personaRequirements:
      "Profil: masculin, 41 ani, antreprenor, ~26.000 km/an, mix oras/autostrada, iarna merge la munte, condus si noaptea, de obicei 2-3 persoane (uneori familie completa), bagaje de familie + echipament sport + obiecte voluminoase. " +
      "Buget tinta 50.000-68.000 EUR, maxim absolut 72.000 EUR; Price Fit separat 0-10 in media finala. " +
      "Top 6 criterii: confort drum lung, practic, iarna/aderenta, risc sh, costuri de rulare, business look. " +
      "Surprize codate: dzg, wudsd sdqrudplfd."
  },
  {
    id: "samsar-round-5",
    personaTitle: "Persoana 5 - Alexandra Toma",
    personaRequirements:
      "Profil: feminin, 38 ani, fondatoare agentie de design, ~20.000 km/an, mix oras/autostrada, condus des seara, de regula singura sau cu 1 pasager, bagaje: laptop/materiale prezentare/bagaj cabina. " +
      "Buget tinta 76.000-92.000 EUR, maxim absolut 100.000 EUR; Price Fit separat 0-10 in media finala. " +
      "Top 6 criterii: business look, rafinament interior, confort drum lung, tehnologie utila, lumini/vizibilitate noaptea, risc sh. " +
      "Surprize codate: pdvdm, kdupdq ndugrq."
  },
  {
    id: "samsar-round-6",
    personaTitle: "Persoana 6 - Victor Ene",
    personaRequirements:
      "Profil: masculin, 43 ani, tech investor, ~14.000 km/an, mix oras/autostrada, iesiri de placere, condus si noaptea, de regula singur sau cu 1 pasager, bagaje putine (weekend + laptop). " +
      "Buget tinta 120.000-165.000 EUR, maxim absolut 190.000 EUR; Price Fit separat 0-10 in media finala. " +
      "Top 6 criterii: fun, business look, ostentativ, rafinament interior, confort drum lung, tehnologie utila. " +
      "Surprize codate: kxg, vfdxqh yhqwlodwh."
  }
];
const DEFAULT_CURSE_HORSES = [
  {
    id: "horse-1",
    name: "Thunder Hoof",
    symbol: "🐎",
    story:
      "Thunder Hoof pleaca exploziv si se simte excelent pe starturile rapide. " +
      "Daca prinde culoar liber, poate inchide cursa in cateva carti."
  },
  {
    id: "horse-2",
    name: "Blaze Runner",
    symbol: "🔥",
    story:
      "Blaze Runner iubeste rundele haotice si urca agresiv cand ritmul devine intens. " +
      "Este periculos cand primeste carti consecutive de sprint."
  },
  {
    id: "horse-3",
    name: "Frost Dash",
    symbol: "❄️",
    story:
      "Frost Dash este calm si constant, recuperand teren mutare dupa mutare. " +
      "Rareori domina startul, dar termina puternic pe final."
  },
  {
    id: "horse-4",
    name: "Lucky Star",
    symbol: "⭐",
    story:
      "Lucky Star este imprevizibil: poate ramane in spate sau poate face un comeback nebun. " +
      "Cand norocul tine cu el, urca instant in frunte."
  }
];
const CURSE_RACE_CARD_DECK = [
  { label: "Sprint", emoji: "🃏", steps: 1 },
  { label: "Turbo", emoji: "⚡", steps: 2 },
  { label: "Nitro", emoji: "🚀", steps: 3 },
  { label: "Slipstream", emoji: "💨", steps: 2 },
  { label: "Steady Pace", emoji: "🎴", steps: 1 }
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
    "- Ambele echipe dau raspuns si pariu (max 15%, rotunjit la 10).\n- Pretul real vine din itemul selectat si ramane ascuns pana la reveal.\n- Castigatorul este detectat automat dupa distanta fata de pretul real.\n- Distanta egala = tie, pariurile se returneaza.",
  filmJocRules:
    "- O singura echipa joaca pe runda (alternare automata Team 1 / Team 2).\n- Echipa activa alege o categorie/card nefolosit(a).\n- Componente: Character/Title x1, Franchise x1, Fun Fact x3.\n- Payout partial pe componente, nu all-or-nothing.\n- Bet-ul echipei active se activeaza la minim 2/3 corecte.",
  samsarRules:
    "- Joc in 6 runde, fiecare cu persona si cerinte clare.\n- Fiecare echipa trimite un jucator activ.\n- Scor mai mare castiga, scor egal = draw.\n- Payout standard Samsar cu limita de bet a jocului.",
  manualMatchups:
    "Guess the Right Order - team vs team, payout standard, draw permis.\nBeer Pong - team vs team, payout standard, draw permis.\nShot Fake - o echipa ia shot (fara bet), cealalta pune bet pentru discover; discover corect = bonus fix + bet x adversari, altfel shot team ia doar bonus fix.",
  curseBets:
    "- Bet-only mode, fara bonus fix.\n- Multi-bet permis pe mai multi cai.\n- Cursa ruleaza automat prin card draw.\n- Doar pariul pe calul castigator plateste x4.\n- Restul pariurilor se pierd.\n- Limita de echipa ramane 30%, rotunjit la 10."
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
    fixedBonus: getStandardFixedBonus("trivia"),
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
      "Pista: 12 pasi pana la finish\nCursa ruleaza automat prin card draw si afiseaza un log al cartilor extrase.",
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
  showActivePlayersTeamA: document.getElementById("showActivePlayersTeamA"),
  showActivePlayersTeamB: document.getElementById("showActivePlayersTeamB"),
  showScreenTitle: document.getElementById("showScreenTitle"),
  showScreenContent: document.getElementById("showScreenContent"),
  showResultCard: document.getElementById("showResultCard"),
  showLatestResult: document.getElementById("showLatestResult"),
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
  samsarBetTeamAInput: document.getElementById("samsarBetTeamAInput"),
  samsarBetTeamBInput: document.getElementById("samsarBetTeamBInput"),
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
let resultUndoStack = [];
let curseRaceRuntime = {
  intervalId: null,
  isRunning: false,
  roundKey: "",
  finishTimeoutId: null
};

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

function isPlaceholderImageUrl(value) {
  const token = sanitizeString(value, "").trim();
  if (!token) {
    return true;
  }
  if (token.startsWith("data:image/svg+xml")) {
    return true;
  }
  return /placeholder|demo round image|product reveal placeholder/i.test(token);
}

function buildWebPreviewImageUrl(pageUrl, width = 1200) {
  const safeUrl = sanitizeString(pageUrl, "").trim();
  if (!safeUrl) {
    return "";
  }
  const safeWidth = Math.max(360, Math.round(sanitizeNumber(width, 1200)));
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(safeUrl)}?w=${safeWidth}`;
}

function resolveFilmImageUrl(primaryUrl, sourcePageUrl, fallbackUrl = FILM_FALLBACK_IMAGE) {
  const cleanPrimary = sanitizeString(primaryUrl, "").trim();
  if (cleanPrimary && !isPlaceholderImageUrl(cleanPrimary)) {
    return cleanPrimary;
  }
  const sourcePreview = buildWebPreviewImageUrl(sourcePageUrl, 1200);
  if (sourcePreview) {
    return sourcePreview;
  }
  return fallbackUrl;
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

  const minimumTriviaCategories = Math.max(1, Math.round(sanitizeNumber(GAME_ROUND_LIMITS.trivia, 18)));
  const missingQuestionCount = categories.reduce((count, category) => {
    const question = normalizeTextToken(category?.question);
    return count + (question ? 0 : 1);
  }, 0);
  const missingOptionsCount = categories.reduce((count, category) => {
    const options = Array.isArray(category?.options) ? category.options : [];
    return count + (options.length >= 2 ? 0 : 1);
  }, 0);
  const appearsIncomplete =
    categories.length < minimumTriviaCategories ||
    missingQuestionCount >= Math.ceil(categories.length * 0.4) ||
    missingOptionsCount >= Math.ceil(categories.length * 0.4);
  if (appearsIncomplete) {
    return true;
  }

  const legacyTriviaTitleTokens = new Set([
    "geografie",
    "istorie",
    "filme si seriale",
    "sport si jocuri",
    "stiinta",
    "tehnologie",
    "muzica",
    "cultura generala",
    "romania",
    "gaming",
    "sport",
    "business"
  ]);
  const legacyTitleMatches = categories.reduce((count, category) => {
    const token = normalizeTextToken(category?.title);
    return count + (legacyTriviaTitleTokens.has(token) ? 1 : 0);
  }, 0);
  const isLegacyBuiltInSet = categories.length === 12 && legacyTitleMatches >= 10;

  if (isLegacyBuiltInSet) {
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

  const legacyPretulCategories = new Set([
    "audio essentials",
    "coffee corner",
    "home cinema",
    "smart fitness",
    "collector build",
    "office comfort",
    "travel speaker",
    "reading tech",
    "pro controller",
    "kitchen upgrade",
    "storage speed",
    "action camera"
  ]);
  const legacyMatches = items.reduce((count, item) => {
    const token = normalizeTextToken(item?.categoryTitle || item?.category);
    return count + (legacyPretulCategories.has(token) ? 1 : 0);
  }, 0);
  const hasModernPriceFields = items.some((item) => sanitizeNumber(item?.actualPriceLei, 0) > 0);
  if (items.length === 12 && legacyMatches >= 8 && !hasModernPriceFields) {
    return true;
  }

  return items.every((item) => {
    const name = normalizeTextToken(item?.name);
    const productTitle = normalizeTextToken(item?.productTitle);
    const candidateName = productTitle || name;
    const genericName =
      /^item \d+$/.test(candidateName) ||
      /^produs \d+$/.test(candidateName) ||
      /^product \d+$/.test(candidateName) ||
      candidateName.includes("placeholder");
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

  const legacyFilmTitles = new Set([
    "runda 1 - wizard school",
    "runda 2 - god of war",
    "runda 3 - mcu",
    "runda 4 - gotham",
    "runda 5 - mushroom kingdom",
    "runda 6 - galaxy saga",
    "runda 7 - post apocalyptic",
    "runda 8 - ring quest",
    "runda 9 - racing legend",
    "runda 10 - assassin",
    "runda 11 - magic world",
    "runda 12 - pirate adventure"
  ]);
  const legacyMatches = items.reduce((count, item) => {
    const token = normalizeTextToken(item?.title);
    return count + (legacyFilmTitles.has(token) ? 1 : 0);
  }, 0);
  if (items.length === 12 && legacyMatches >= 8) {
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
  if (!Array.isArray(horses) || horses.length !== 4) {
    return true;
  }
  return horses.every((horse) => {
    const name = normalizeTextToken(horse?.name);
    const story = normalizeTextToken(horse?.story);
    const symbol = normalizeTextToken(horse?.symbol);
    const genericName = /^horse \d+$/.test(name) || /^cal \d+$/.test(name) || name.includes("placeholder");
    const legacyAsciiSymbol = /^[><*!#@$]+$/.test(symbol);
    return genericName || story.includes("placeholder") || legacyAsciiSymbol;
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

function isScorelessManualMatchGame(gameId) {
  return gameId === "guess-right-order" || gameId === "beer-pong";
}

function getGameLabel(gameId) {
  return getGameConfig(gameId).label;
}

function getGameSection(gameId) {
  return getGameConfig(gameId).section;
}

function isGameLineupRequired(gameId) {
  return gameId !== "curse-de-cai";
}

function getBetPercent(gameId) {
  return getGameConfig(gameId).maxBetPercent;
}

function getStandardFixedBonus(gameId) {
  return Math.max(0, Math.round(sanitizeNumber(STANDARD_FIXED_BONUS_BY_GAME[gameId], 0)));
}

function getGameRoundLimit(gameId) {
  return Math.max(1, Math.round(sanitizeNumber(GAME_ROUND_LIMITS[gameId], 1)));
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
  const minimumTriviaCategories = Math.max(1, Math.round(sanitizeNumber(GAME_ROUND_LIMITS.trivia, 18)));
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
      id = `trivia-cat-${sanitized.length}`;
    }
    seenIds.add(id);

    let options = rawOptions.slice(0, 6);
    if (options.length < 2) {
      options = ["Optiunea A", "Optiunea B", "Optiunea C", "Optiunea D"];
    }
    if (answer && !options.includes(answer)) {
      options = [answer].concat(options.filter((option) => option !== answer)).slice(0, 6);
    }

    let correctAnswerIndex = Math.round(
      sanitizeNumber(rawCategory?.correctAnswerIndex, sanitizeNumber(rawCategory?.correctOptionIndex, 0))
    );
    if (correctAnswerIndex < 0 || correctAnswerIndex >= options.length) {
      correctAnswerIndex = options.findIndex((option) => normalizeTextToken(option) === normalizeTextToken(answer));
    }
    if (correctAnswerIndex < 0 || correctAnswerIndex >= options.length) {
      correctAnswerIndex = 0;
    }

    sanitized.push({
      id,
      title: title || `Categoria ${sanitized.length + 1}`,
      question: question || "Intrebare demo pentru aceasta categorie.",
      options,
      correctAnswerIndex,
      correctOptionIndex: correctAnswerIndex,
      answer: options[correctAnswerIndex] || answer || "Raspuns demo pentru aceasta categorie."
    });
  }

  if (sanitized.length === 0) {
    return fallback;
  }

  if (sanitized.length < minimumTriviaCategories) {
    const existingIdSet = new Set(sanitized.map((entry) => entry.id));
    const existingTitleSet = new Set(sanitized.map((entry) => normalizeTextToken(entry.title)));
    for (const fallbackCategory of fallback) {
      if (sanitized.length >= minimumTriviaCategories) {
        break;
      }
      const fallbackTitleToken = normalizeTextToken(fallbackCategory.title);
      if (existingTitleSet.has(fallbackTitleToken)) {
        continue;
      }
      let nextId = sanitizeString(fallbackCategory.id, "").trim();
      if (!nextId || existingIdSet.has(nextId)) {
        nextId = `trivia-cat-${sanitized.length}`;
      }
      existingIdSet.add(nextId);
      existingTitleSet.add(fallbackTitleToken);
      sanitized.push({
        ...fallbackCategory,
        id: nextId
      });
    }
  }

  return sanitized;
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
    betDelta: 0,
    bonusDelta: 0,
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
  safeState.betDelta = Math.round(sanitizeNumber(rawRoundState.betDelta, 0));
  safeState.bonusDelta = Math.round(sanitizeNumber(rawRoundState.bonusDelta, 0));
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
      betDelta: 0,
      bonusDelta: 0,
      lastDelta: 0,
      resultCategoryId: "",
      lastResult: ""
    });
  }
  const roundState = sanitizeTriviaRoundState(state.trivia.rounds[roundKey]);
  const validCategoryIds = new Set(state.trivia.categories.map((category) => category.id));
  roundState.usedCategoryIds = roundState.usedCategoryIds.filter((id) => validCategoryIds.has(id));
  if (!validCategoryIds.has(roundState.selectedCategoryId) || roundState.usedCategoryIds.includes(roundState.selectedCategoryId)) {
    const nextAvailable = state.trivia.categories.find((category) => !roundState.usedCategoryIds.includes(category.id));
    roundState.selectedCategoryId = nextAvailable?.id || state.trivia.categories[0]?.id || "";
  }
  state.trivia.rounds[roundKey] = roundState;
  return roundState;
}

function getCurrentTriviaTeam() {
  return getOrCreateTriviaRoundState().teamKey;
}

function buildPretulProductPlaceholder(productTitle, imageHint) {
  const safeTitle = String(productTitle || "Pretul corect product").slice(0, 96);
  const safeHint = String(imageHint || "Placeholder image").slice(0, 112);
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 700'>
      <defs>
        <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
          <stop offset='0' stop-color='#131f43'/>
          <stop offset='1' stop-color='#2b3c7c'/>
        </linearGradient>
      </defs>
      <rect width='1200' height='700' fill='url(#g)'/>
      <rect x='80' y='90' width='1040' height='520' rx='34' fill='rgba(10,18,40,0.38)' stroke='rgba(214,224,255,0.45)'/>
      <text x='600' y='250' fill='#f5f7ff' font-size='46' font-family='Arial' text-anchor='middle'>${escapeHtml(
        safeTitle
      )}</text>
      <text x='600' y='332' fill='#d4dcff' font-size='28' font-family='Arial' text-anchor='middle'>${escapeHtml(
        safeHint
      )}</text>
      <text x='600' y='396' fill='#f5d373' font-size='25' font-family='Arial' text-anchor='middle'>Pretul Corect - Product Stage</text>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function getPretulItemCategory(item) {
  return sanitizeString(item?.categoryTitle, sanitizeString(item?.category, "Product category")).trim() || "Product category";
}

function getPretulItemTitle(item) {
  return sanitizeString(item?.productTitle, sanitizeString(item?.name, "Unknown product")).trim() || "Unknown product";
}

function getPretulItemActualPrice(item) {
  const rawPrice = sanitizeNumber(item?.actualPriceLei, sanitizeNumber(item?.referencePrice, 0));
  return Math.max(0, Math.round(rawPrice * 100) / 100);
}

function sanitizePretulItems(rawItems) {
  const fallback = cloneDefaultState().pretul.items;
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return fallback;
  }

  const seenIds = new Set();
  const sanitized = [];

  for (const rawItem of rawItems) {
    const categoryTitle = sanitizeString(rawItem?.category, sanitizeString(rawItem?.categoryTitle, "")).trim();
    const productTitle = sanitizeString(rawItem?.productTitle, sanitizeString(rawItem?.name, "")).trim();
    if (!categoryTitle || !productTitle) {
      continue;
    }

    let id = typeof rawItem?.id === "number" && Number.isFinite(rawItem.id) ? String(Math.trunc(rawItem.id)) : "";
    if (!id) {
      id = sanitizeString(rawItem?.id, "").trim();
    }
    if (!id || seenIds.has(id)) {
      id = String(sanitized.length);
    }
    seenIds.add(id);

    const actualPriceValue = sanitizeNumber(rawItem?.actualPriceLei, sanitizeNumber(rawItem?.referencePrice, 0));
    const actualPriceLei = Math.max(0, Math.round(actualPriceValue * 100) / 100);
    const productUrl = sanitizeString(rawItem?.productUrl, "").trim();
    const mappedImageUrl = PRETUL_PRODUCT_IMAGE_BY_URL[productUrl] || "";
    const imageHint =
      sanitizeString(rawItem?.imageHint, "").trim() || `Product visual placeholder for ${productTitle}`;
    const imageUrlCandidate = sanitizeString(rawItem?.imageUrl, "").trim();
    const imageUrlCandidateIsPlaceholder =
      imageUrlCandidate.startsWith("data:image/svg+xml") || imageUrlCandidate.includes("Product%20reveal%20placeholder");
    const imageUrl =
      imageUrlCandidate && !imageUrlCandidateIsPlaceholder
        ? imageUrlCandidate
        : mappedImageUrl || buildPretulProductPlaceholder(productTitle, imageHint);
    const quickSpecs = Array.isArray(rawItem?.quickSpecs)
      ? rawItem.quickSpecs
          .map((spec) => (typeof spec === "string" ? spec.trim() : ""))
          .filter((spec) => spec.length > 0)
          .slice(0, 4)
      : [];

    const normalizedSpecs =
      quickSpecs.length > 0 ? quickSpecs : [categoryTitle, imageHint].filter((spec) => spec && spec.trim()).slice(0, 4);

    sanitized.push({
      id,
      category: categoryTitle,
      categoryTitle,
      productTitle,
      name: productTitle,
      productUrl,
      actualPriceLei,
      referencePrice: actualPriceLei,
      imageHint,
      imageUrl,
      quickSpecs: normalizedSpecs
    });
  }

  return sanitized.length > 0 ? sanitized : fallback;
}

function sanitizePretulRoundState(rawRoundState) {
  const safeState = {
    selectedItemId: "",
    usedItemIds: [],
    chooserTeamKey: "teamA",
    participantsTeamA: [],
    participantsTeamB: [],
    answerTeamA: 0,
    answerTeamB: 0,
    realPrice: 0,
    betTeamA: 100,
    betTeamB: 100,
    payoutApplied: false,
    lastResult: ""
  };

  if (!rawRoundState || typeof rawRoundState !== "object") {
    return safeState;
  }

  safeState.selectedItemId = sanitizeString(rawRoundState.selectedItemId, "");
  safeState.usedItemIds = Array.isArray(rawRoundState.usedItemIds)
    ? Array.from(new Set(rawRoundState.usedItemIds.filter((id) => typeof id === "string")))
    : [];
  safeState.chooserTeamKey = ["teamA", "teamB"].includes(rawRoundState.chooserTeamKey)
    ? rawRoundState.chooserTeamKey
    : "teamA";
  safeState.participantsTeamA = sanitizeRoundParticipantIds(rawRoundState.participantsTeamA, "teamA");
  safeState.participantsTeamB = sanitizeRoundParticipantIds(rawRoundState.participantsTeamB, "teamB");
  safeState.answerTeamA = Math.max(0, Math.round(sanitizeNumber(rawRoundState.answerTeamA, 0)));
  safeState.answerTeamB = Math.max(0, Math.round(sanitizeNumber(rawRoundState.answerTeamB, 0)));
  safeState.realPrice = Math.max(0, Math.round(sanitizeNumber(rawRoundState.realPrice, 0) * 100) / 100);
  safeState.betTeamA = normalizeBetAmount(rawRoundState.betTeamA);
  safeState.betTeamB = normalizeBetAmount(rawRoundState.betTeamB);
  safeState.payoutApplied = Boolean(rawRoundState.payoutApplied);
  safeState.lastResult = sanitizeString(rawRoundState.lastResult, "");
  return safeState;
}

function getPretulUsedItemIdSet() {
  const itemIdSet = new Set(state.pretul.items.map((item) => item.id));
  const used = new Set();
  for (const rawRoundState of Object.values(state.pretul.rounds || {})) {
    const safeRoundState = sanitizePretulRoundState(rawRoundState);
    for (const itemId of safeRoundState.usedItemIds) {
      if (itemIdSet.has(itemId)) {
        used.add(itemId);
      }
    }
  }
  return used;
}

function getPretulRoundKey(roundNumber = state.progress.currentRound) {
  return `pretul::R${roundNumber}`;
}

function getOrCreatePretulRoundState(roundNumber = state.progress.currentRound) {
  const roundKey = getPretulRoundKey(roundNumber);
  if (!state.pretul.rounds[roundKey]) {
    const previousRoundKey = getPretulRoundKey(Math.max(1, roundNumber - 1));
    const previousRound = sanitizePretulRoundState(state.pretul.rounds[previousRoundKey]);
    const globalUsed = Array.from(getPretulUsedItemIdSet());
    const nextAvailable = state.pretul.items.find((item) => !globalUsed.includes(item.id));
    const defaultParticipantsA = getAvailablePlayersForTeam("teamA").map((player) => player.id);
    const defaultParticipantsB = getAvailablePlayersForTeam("teamB").map((player) => player.id);
    state.pretul.rounds[roundKey] = sanitizePretulRoundState({
      selectedItemId: nextAvailable?.id || state.pretul.items[0]?.id || "",
      usedItemIds: globalUsed,
      chooserTeamKey: Math.max(1, Math.round(sanitizeNumber(roundNumber, 1))) % 2 === 0 ? "teamB" : "teamA",
      participantsTeamA: previousRound.participantsTeamA.length > 0 ? previousRound.participantsTeamA : defaultParticipantsA,
      participantsTeamB: previousRound.participantsTeamB.length > 0 ? previousRound.participantsTeamB : defaultParticipantsB,
      answerTeamA: 0,
      answerTeamB: 0,
      realPrice: getPretulItemActualPrice(nextAvailable || state.pretul.items[0] || null),
      betTeamA: previousRound.betTeamA || 100,
      betTeamB: previousRound.betTeamB || 100,
      payoutApplied: false,
      lastResult: ""
    });
  }
  const roundState = sanitizePretulRoundState(state.pretul.rounds[roundKey]);
  const globalUsed = getPretulUsedItemIdSet();
  roundState.usedItemIds = Array.from(globalUsed);
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
    const title =
      sanitizeString(rawItem?.title, "").trim() ||
      sanitizeString(rawItem?.category, "").trim() ||
      `Card ${sanitized.length + 1}`;

    let id = sanitizeString(rawItem?.id, "").trim();
    if (!id || seenIds.has(id)) {
      id = `film-item-${sanitized.length + 1}`;
    }
    seenIds.add(id);
    const fallbackItem =
      fallback.find((entry) => entry.id === id) ||
      fallback.find((entry) => normalizeTextToken(entry.title) === normalizeTextToken(title));

    const characterPrompt =
      sanitizeString(rawItem?.characterPrompt, "").trim() ||
      sanitizeString(rawItem?.characterOrTitle?.answer, "").trim() ||
      "Text reveal Character/Title.";
    const franchisePrompt =
      sanitizeString(rawItem?.franchisePrompt, "").trim() ||
      sanitizeString(rawItem?.franchise?.answer, "").trim() ||
      "Text reveal Franchise.";
    const funFactPrompt =
      sanitizeString(rawItem?.funFactPrompt, "").trim() ||
      sanitizeString(rawItem?.funFact?.targetFact, "").trim() ||
      "Text reveal Fun Fact.";

    sanitized.push({
      id,
      title,
      imageUrl: sanitizeString(rawItem?.imageUrl, FILM_FALLBACK_IMAGE).trim() || FILM_FALLBACK_IMAGE,
      imageAlt:
        sanitizeString(rawItem?.imageAlt, "").trim() ||
        sanitizeString(fallbackItem?.imageAlt, "").trim() ||
        "Imagine demo runda",
      imageSourcePageUrl:
        sanitizeString(rawItem?.imageSourcePageUrl, "").trim() ||
        sanitizeString(fallbackItem?.imageSourcePageUrl, "").trim(),
      imageSearchHint:
        sanitizeString(rawItem?.imageSearchHint, "").trim() ||
        sanitizeString(fallbackItem?.imageSearchHint, "").trim(),
      characterPrompt,
      characterSourcePageUrl:
        sanitizeString(rawItem?.characterSourcePageUrl, "").trim() ||
        sanitizeString(rawItem?.characterOrTitle?.imageSourcePageUrl, "").trim() ||
        sanitizeString(fallbackItem?.characterSourcePageUrl, "").trim(),
      characterImageUrl:
        sanitizeString(rawItem?.characterImageUrl, "").trim() ||
        sanitizeString(fallbackItem?.characterImageUrl, "").trim(),
      characterImageHint:
        sanitizeString(rawItem?.characterImageHint, "").trim() ||
        sanitizeString(rawItem?.characterOrTitle?.imageSearchHint, "").trim() ||
        sanitizeString(fallbackItem?.characterImageHint, "").trim(),
      franchisePrompt,
      franchiseSourcePageUrl:
        sanitizeString(rawItem?.franchiseSourcePageUrl, "").trim() ||
        sanitizeString(rawItem?.franchise?.imageSourcePageUrl, "").trim() ||
        sanitizeString(fallbackItem?.franchiseSourcePageUrl, "").trim(),
      franchiseImageUrl:
        sanitizeString(rawItem?.franchiseImageUrl, "").trim() ||
        sanitizeString(fallbackItem?.franchiseImageUrl, "").trim(),
      franchiseImageHint:
        sanitizeString(rawItem?.franchiseImageHint, "").trim() ||
        sanitizeString(rawItem?.franchise?.imageSearchHint, "").trim() ||
        sanitizeString(fallbackItem?.franchiseImageHint, "").trim(),
      funFactPrompt,
      funFactSourcePageUrl:
        sanitizeString(rawItem?.funFactSourcePageUrl, "").trim() ||
        sanitizeString(rawItem?.funFact?.imageSourcePageUrl, "").trim() ||
        sanitizeString(fallbackItem?.funFactSourcePageUrl, "").trim(),
      funFactImageUrl:
        sanitizeString(rawItem?.funFactImageUrl, "").trim() ||
        sanitizeString(fallbackItem?.funFactImageUrl, "").trim(),
      funFactImageHint:
        sanitizeString(rawItem?.funFactImageHint, "").trim() ||
        sanitizeString(rawItem?.funFact?.imageSearchHint, "").trim() ||
        sanitizeString(fallbackItem?.funFactImageHint, "").trim()
    });
  }

  return sanitized.length > 0 ? sanitized : fallback;
}

function sanitizeFilmRoundState(rawRoundState) {
  const safeState = {
    teamKey: "teamA",
    selectedItemId: "",
    usedItemIds: [],
    participantsTeamA: [],
    participantsTeamB: [],
    betAmount: 100,
    betTeamA: 100,
    betTeamB: 100,
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
    outcomesByTeam: {
      teamA: {
        character: null,
        franchise: null,
        funFact: null
      },
      teamB: {
        character: null,
        franchise: null,
        funFact: null
      }
    },
    payoutApplied: false,
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
  safeState.participantsTeamA = sanitizeRoundParticipantIds(rawRoundState.participantsTeamA, "teamA");
  safeState.participantsTeamB = sanitizeRoundParticipantIds(rawRoundState.participantsTeamB, "teamB");
  const rawBetTeamA = rawRoundState.betTeamA ?? (safeState.teamKey === "teamA" ? rawRoundState.betAmount : 100);
  const rawBetTeamB = rawRoundState.betTeamB ?? (safeState.teamKey === "teamB" ? rawRoundState.betAmount : 100);
  safeState.betTeamA = normalizeBetAmount(rawBetTeamA);
  safeState.betTeamB = normalizeBetAmount(rawBetTeamB);
  safeState.payoutApplied = Boolean(rawRoundState.payoutApplied);
  safeState.lastResult = sanitizeString(rawRoundState.lastResult, "");

  for (const key of FILM_COMPONENT_KEYS) {
    safeState.revealed[key] = Boolean(rawRoundState.revealed?.[key]);
    const legacyOutcome = rawRoundState.outcomes?.[key];
    const teamAOutcome = rawRoundState.outcomesByTeam?.teamA?.[key];
    const teamBOutcome = rawRoundState.outcomesByTeam?.teamB?.[key];
    safeState.outcomesByTeam.teamA[key] = ["correct", "wrong"].includes(teamAOutcome)
      ? teamAOutcome
      : safeState.teamKey === "teamA" && ["correct", "wrong"].includes(legacyOutcome)
        ? legacyOutcome
        : null;
    safeState.outcomesByTeam.teamB[key] = ["correct", "wrong"].includes(teamBOutcome)
      ? teamBOutcome
      : safeState.teamKey === "teamB" && ["correct", "wrong"].includes(legacyOutcome)
        ? legacyOutcome
        : null;
  }
  safeState.betAmount = safeState.teamKey === "teamA" ? safeState.betTeamA : safeState.betTeamB;
  safeState.outcomes = { ...safeState.outcomesByTeam[safeState.teamKey] };

  return safeState;
}

function getFilmTeamForRound(roundNumber = state.progress.currentRound) {
  const safeRound = Math.max(1, Math.round(sanitizeNumber(roundNumber, 1)));
  return safeRound % 2 === 1 ? "teamA" : "teamB";
}

function getFilmUsedItemIdSet() {
  const itemIdSet = new Set(state.filmGame.items.map((item) => item.id));
  const used = new Set();
  for (const rawRoundState of Object.values(state.filmGame.rounds || {})) {
    const safeRoundState = sanitizeFilmRoundState(rawRoundState);
    for (const itemId of safeRoundState.usedItemIds) {
      if (itemIdSet.has(itemId)) {
        used.add(itemId);
      }
    }
  }
  return used;
}

function getFilmRoundKey(roundNumber = state.progress.currentRound) {
  return `film::R${roundNumber}`;
}

function getOrCreateFilmRoundState(roundNumber = state.progress.currentRound) {
  const safeRound = Math.max(1, Math.round(sanitizeNumber(roundNumber, 1)));
  const roundKey = getFilmRoundKey(safeRound);
  const teamForRound = getFilmTeamForRound(safeRound);
  if (!state.filmGame.rounds[roundKey]) {
    const previousRoundKey = getFilmRoundKey(Math.max(1, safeRound - 1));
    const previousRound = sanitizeFilmRoundState(state.filmGame.rounds[previousRoundKey]);
    const carryUsed = Array.from(getFilmUsedItemIdSet());
    const nextAvailable = state.filmGame.items.find((item) => !carryUsed.includes(item.id));
    const defaultParticipantsA = getAvailablePlayersForTeam("teamA").map((player) => player.id);
    const defaultParticipantsB = getAvailablePlayersForTeam("teamB").map((player) => player.id);
    state.filmGame.rounds[roundKey] = sanitizeFilmRoundState({
      teamKey: teamForRound,
      selectedItemId: nextAvailable?.id || state.filmGame.items[0]?.id || "",
      usedItemIds: carryUsed,
      participantsTeamA: previousRound.participantsTeamA?.length > 0 ? previousRound.participantsTeamA : defaultParticipantsA,
      participantsTeamB: previousRound.participantsTeamB?.length > 0 ? previousRound.participantsTeamB : defaultParticipantsB,
      betTeamA: previousRound.betTeamA || 100,
      betTeamB: previousRound.betTeamB || 100,
      revealed: {
        character: false,
        franchise: false,
        funFact: false
      },
      outcomesByTeam: {
        teamA: {
          character: null,
          franchise: null,
          funFact: null
        },
        teamB: {
          character: null,
          franchise: null,
          funFact: null
        }
      },
      outcomes: {
        character: null,
        franchise: null,
        funFact: null
      },
      payoutApplied: false,
      lastResult: ""
    });
  }
  const roundState = sanitizeFilmRoundState(state.filmGame.rounds[roundKey]);
  roundState.teamKey = teamForRound;
  roundState.betAmount = roundState.teamKey === "teamA" ? roundState.betTeamA : roundState.betTeamB;
  roundState.outcomes = { ...roundState.outcomesByTeam[roundState.teamKey] };
  roundState.usedItemIds = Array.from(getFilmUsedItemIdSet());
  if (roundState.participantsTeamA.length === 0) {
    roundState.participantsTeamA = getAvailablePlayersForTeam("teamA").map((player) => player.id);
  }
  if (roundState.participantsTeamB.length === 0) {
    roundState.participantsTeamB = getAvailablePlayersForTeam("teamB").map((player) => player.id);
  }
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
    betTeamA: SAMSAR_STANDARD_BET,
    betTeamB: SAMSAR_STANDARD_BET,
    payoutApplied: false,
    lastResult: ""
  };

  if (!rawRoundState || typeof rawRoundState !== "object") {
    return safeState;
  }

  safeState.activePlayerTeamAId = sanitizeString(rawRoundState.activePlayerTeamAId, "");
  safeState.activePlayerTeamBId = sanitizeString(rawRoundState.activePlayerTeamBId, "");
  safeState.scoreTeamA = Math.max(0, Math.round(sanitizeNumber(rawRoundState.scoreTeamA, 0)));
  safeState.scoreTeamB = Math.max(0, Math.round(sanitizeNumber(rawRoundState.scoreTeamB, 0)));
  safeState.betTeamA = Math.max(0, normalizeBetAmount(rawRoundState.betTeamA ?? SAMSAR_STANDARD_BET));
  safeState.betTeamB = Math.max(0, normalizeBetAmount(rawRoundState.betTeamB ?? SAMSAR_STANDARD_BET));
  safeState.payoutApplied = Boolean(rawRoundState.payoutApplied);
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
      betTeamA: SAMSAR_STANDARD_BET,
      betTeamB: SAMSAR_STANDARD_BET,
      payoutApplied: false,
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
    winner: "draw",
    betTeamA: 100,
    betTeamB: 100,
    participantsTeamA: [],
    participantsTeamB: [],
    payoutApplied: false,
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
  safeState.winner = ["teamA", "teamB", "draw"].includes(rawRoundState.winner) ? rawRoundState.winner : "draw";
  safeState.betTeamA = normalizeBetAmount(rawRoundState.betTeamA);
  safeState.betTeamB = normalizeBetAmount(rawRoundState.betTeamB);
  safeState.participantsTeamA = sanitizeRoundParticipantIds(rawRoundState.participantsTeamA, "teamA");
  safeState.participantsTeamB = sanitizeRoundParticipantIds(rawRoundState.participantsTeamB, "teamB");
  safeState.payoutApplied = Boolean(rawRoundState.payoutApplied);
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
    const defaultParticipantsA = getAvailablePlayersForTeam("teamA").map((player) => player.id);
    const defaultParticipantsB = getAvailablePlayersForTeam("teamB").map((player) => player.id);
    state.manualMatch.rounds[roundKey] = sanitizeManualMatchRoundState({
      scoreTeamA: 0,
      scoreTeamB: 0,
      winner: "draw",
      betTeamA: 100,
      betTeamB: 100,
      participantsTeamA: defaultParticipantsA,
      participantsTeamB: defaultParticipantsB,
      payoutApplied: false,
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

function getShotFakeRoundRoles(roundNumber = state.progress.currentRound) {
  const safeRound = Math.max(1, Math.round(sanitizeNumber(roundNumber, 1)));
  const shooterTeamKey = safeRound % 2 === 1 ? "teamA" : "teamB";
  const detectorTeamKey = shooterTeamKey === "teamA" ? "teamB" : "teamA";
  return {
    roundNumber: safeRound,
    shooterTeamKey,
    detectorTeamKey
  };
}

function getShotFakeOpponentCount(roundState, teamKey) {
  const key = teamKey === "teamA" ? "participantsTeamA" : "participantsTeamB";
  const selected = sanitizeRoundParticipantIds(roundState?.[key], teamKey).length;
  if (selected > 0) {
    return selected;
  }
  const active = countActiveWithJoker(teamKey);
  if (active > 0) {
    return active;
  }
  return Math.max(1, getAvailablePlayersForTeam(teamKey).length);
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

  if (sanitized.length < 4) {
    return fallback;
  }
  return sanitized.slice(0, 4);
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
    cardHistory: [],
    payoutApplied: false,
    lastResult: "",
    participantsTeamA: [],
    participantsTeamB: [],
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
  safe.cardHistory = Array.isArray(rawRoundState.cardHistory)
    ? rawRoundState.cardHistory
        .map((entry) => sanitizeString(entry, "").trim())
        .filter((entry) => Boolean(entry))
        .slice(-12)
    : [];
  safe.payoutApplied = Boolean(rawRoundState.payoutApplied) && Boolean(safe.winnerHorseId);
  safe.lastResult = sanitizeString(rawRoundState.lastResult, "");
  safe.participantsTeamA = sanitizeRoundParticipantIds(rawRoundState.participantsTeamA, "teamA");
  safe.participantsTeamB = sanitizeRoundParticipantIds(rawRoundState.participantsTeamB, "teamB");
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
    const defaultParticipantsA = getAvailablePlayersForTeam("teamA").map((player) => player.id);
    const defaultParticipantsB = getAvailablePlayersForTeam("teamB").map((player) => player.id);
    state.curseRace.rounds[roundKey] = sanitizeCurseRoundState(
      {
        positions: {},
        moveHorseId: horseIds[0] || "",
        moveSteps: 1,
        winnerHorseId: "",
        payoutApplied: false,
        lastResult: "",
        participantsTeamA: defaultParticipantsA,
        participantsTeamB: defaultParticipantsB,
        bets: {
          teamA: { bettorId: "", horseBets: {} },
          teamB: { bettorId: "", horseBets: {} }
        }
      },
      horseIds
    );
  }
  const safe = sanitizeCurseRoundState(state.curseRace.rounds[roundKey], horseIds);
  if (safe.participantsTeamA.length === 0) {
    safe.participantsTeamA = getAvailablePlayersForTeam("teamA").map((player) => player.id);
  }
  if (safe.participantsTeamB.length === 0) {
    safe.participantsTeamB = getAvailablePlayersForTeam("teamB").map((player) => player.id);
  }
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

  clean.trivia.fixedBonus = getStandardFixedBonus("trivia");
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

function getAvailablePlayersForTeam(teamKey) {
  if (!["teamA", "teamB"].includes(teamKey)) {
    return [];
  }
  return state.teams[teamKey].players.filter((player) => player.status === "available");
}

function sanitizeRoundParticipantIds(rawIds, teamKey) {
  const availableIds = new Set(getAvailablePlayersForTeam(teamKey).map((player) => player.id));
  if (!Array.isArray(rawIds)) {
    return [];
  }
  return Array.from(
    new Set(
      rawIds.filter((playerId) => typeof playerId === "string" && availableIds.has(playerId))
    )
  );
}

function getSelectedParticipantsForTeam(teamKey, selectedIds = []) {
  const selectedSet = new Set(sanitizeRoundParticipantIds(selectedIds, teamKey));
  if (selectedSet.size === 0) {
    return [];
  }
  return state.teams[teamKey].players
    .filter((player) => selectedSet.has(player.id))
    .map((player) => ({
      id: player.id,
      displayName: player.name,
      teamKey
    }));
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

function undoLastAppliedResult() {
  if (resultUndoStack.length === 0) {
    setLastResultSummary("No result to undo yet.");
    renderUndoControlState();
    saveState("Undo skipped: stack empty.");
    return;
  }

  stopCurseRaceSimulation({ render: false, persist: false });
  const undoEntry = resultUndoStack.pop();
  renderUndoControlState();

  try {
    state = sanitizeState(JSON.parse(undoEntry.snapshot));
    loadCurrentRoundSnapshot();
    renderAll();

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

    stopCurseRaceSimulation({ render: false, persist: false });
    state = sanitizeState(importedState);
    loadCurrentRoundSnapshot();
    resultUndoStack = [];
    renderAll();
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

function buildDefaultTeamLineupSnapshot() {
  const defaultTeamA = state.teams.teamA.players
    .filter((player) => player.status === "available")
    .slice(0, MAX_ACTIVE_PER_TEAM)
    .map((player) => player.id);
  const defaultTeamB = state.teams.teamB.players
    .filter((player) => player.status === "available")
    .slice(0, MAX_ACTIVE_PER_TEAM)
    .map((player) => player.id);
  return sanitizeHistorySnapshot({
    activeByTeam: {
      teamA: defaultTeamA,
      teamB: defaultTeamB
    },
    jokerAssignment: "out"
  });
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
    const defaultSnapshot = buildDefaultTeamLineupSnapshot();
    state.roundSelection.activeByTeam.teamA = [...defaultSnapshot.activeByTeam.teamA];
    state.roundSelection.activeByTeam.teamB = [...defaultSnapshot.activeByTeam.teamB];
    state.roundSelection.jokerAssignment = "out";
    state.roundSelection.history[getRoundKey()] = sanitizeHistorySnapshot(defaultSnapshot);
  }
  if (state.roundSelection.activeByTeam.teamA.length === 0 && state.roundSelection.activeByTeam.teamB.length === 0) {
    const defaultSnapshot = buildDefaultTeamLineupSnapshot();
    state.roundSelection.activeByTeam.teamA = [...defaultSnapshot.activeByTeam.teamA];
    state.roundSelection.activeByTeam.teamB = [...defaultSnapshot.activeByTeam.teamB];
    state.roundSelection.jokerAssignment = "out";
    state.roundSelection.history[getRoundKey()] = sanitizeHistorySnapshot(defaultSnapshot);
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

function getSelectableGameLineupPlayers(teamKey) {
  if (!["teamA", "teamB"].includes(teamKey)) {
    return [];
  }
  const activeIds = new Set(state.roundSelection.activeByTeam[teamKey] || []);
  const availablePlayers = state.teams[teamKey].players.filter((player) => player.status === "available");
  const lineupPlayers = availablePlayers.filter((player) => activeIds.has(player.id));
  return lineupPlayers.length > 0 ? lineupPlayers : availablePlayers;
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
    const total = Math.min(getGameRoundLimit("trivia"), Math.max(0, state.trivia.categories.length));
    return total > 0 && roundState.usedCategoryIds.length >= total;
  }
  if (gameId === "pretul-corect") {
    const total = Math.min(getGameRoundLimit("pretul-corect"), Math.max(0, state.pretul.items.length));
    return total > 0 && getPretulUsedItemIdSet().size >= total;
  }
  if (gameId === "film-joc-franciza-fun-fact") {
    const total = Math.min(getGameRoundLimit("film-joc-franciza-fun-fact"), Math.max(0, state.filmGame.items.length));
    return total > 0 && getFilmUsedItemIdSet().size >= total;
  }
  if (gameId === "cel-mai-bun-samsar") {
    return state.progress.currentRound >= getGameRoundLimit("cel-mai-bun-samsar");
  }
  if (gameId === "guess-right-order") {
    return state.progress.currentRound >= getGameRoundLimit("guess-right-order");
  }
  if (gameId === "beer-pong") {
    return state.progress.currentRound >= getGameRoundLimit("beer-pong");
  }
  if (gameId === "shot-fake") {
    return state.progress.currentRound >= getGameRoundLimit("shot-fake");
  }
  if (gameId === "curse-de-cai") {
    return state.progress.currentRound >= getGameRoundLimit("curse-de-cai");
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
    if (!isGameLineupRequired(gameId)) {
      state.showUi.lineupReadyByGame[gameId] = true;
    }
  }
  if (typeof state.showUi.gameNightStarted !== "boolean") {
    state.showUi.gameNightStarted = false;
  }
  if (typeof state.showUi.answerLocked !== "boolean") {
    state.showUi.answerLocked = false;
  }
  if (
    currentGameId === "film-joc-franciza-fun-fact" &&
    state.showUi.liveRoundStep === "image-reveal"
  ) {
    state.showUi.liveRoundStep = "card-reveal";
  }
  if (currentGameId === "cel-mai-bun-samsar") {
    if (state.showUi.liveRoundStep === "player-select" || state.showUi.liveRoundStep === "persona-intro") {
      state.showUi.liveRoundStep = "live-duel";
    } else if (state.showUi.liveRoundStep === "score-entry") {
      state.showUi.liveRoundStep = "result-screen";
    }
  }
  if (
    state.showUi.activeScreen === "live-round" &&
    isGameLineupRequired(currentGameId) &&
    !Boolean(state.showUi.lineupReadyByGame[currentGameId])
  ) {
    state.showUi.activeScreen = "game-intro";
  }
}

function isGameLineupReady(gameId = state.progress.currentGame) {
  ensureShowUiState();
  if (!isGameLineupRequired(gameId)) {
    return true;
  }
  return Boolean(state.showUi.lineupReadyByGame[gameId]);
}

function setGameLineupReady(gameId, nextReady) {
  if (!GAME_ORDER.includes(gameId)) {
    return;
  }
  ensureShowUiState();
  if (!isGameLineupRequired(gameId)) {
    state.showUi.lineupReadyByGame[gameId] = true;
    return;
  }
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
    state.roundSelection.history[getGameLineupKey(gameId)] = buildDefaultTeamLineupSnapshot();
  }
  state.roundSelection.activeByTeam.teamA = [];
  state.roundSelection.activeByTeam.teamB = [];
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
  state.roundSelection.history[getGameLineupKey(finishedGameId)] = buildDefaultTeamLineupSnapshot();
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
  if (currentGameId === "curse-de-cai" && isCurseRaceRunning(getCurseRoundKey(state.progress.currentRound)) && nextStep !== "race-screen") {
    stopCurseRaceSimulation({ render: false, persist: false });
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
      "Flow: Topic Select -> Bet -> Question+Answers -> Result -> next topic.",
      `Multiple choice topics are disabled after use; correct gives +${formatMoney(getStandardFixedBonus("trivia"))} bonus + bet win.`,
      `Game ends after ${getGameRoundLimit("trivia")} topics.`
    ];
  }
  if (gameId === "pretul-corect") {
    return [
      "Both teams submit a price estimate and a bet.",
      "Winner is auto-detected by closest distance to real price.",
      `Equal distance is a tie and both bets are returned. Winner payout: +${formatMoney(getStandardFixedBonus("pretul-corect"))} bonus + bet win.`,
      `Game ends after ${getGameRoundLimit("pretul-corect")} products.`
    ];
  }
  if (gameId === "film-joc-franciza-fun-fact") {
    return [
      "Team-vs-team visual round with Character/Title, Franchise, and Fun Fact components.",
      "Image and reveal cards are played together on the same live stage step.",
      "Partial payout is based on component scores (1/1/3).",
      "Bet activates only with minimum 2 of 3 components correct (per team).",
      `Game ends after ${getGameRoundLimit("film-joc-franciza-fun-fact")} rounds.`
    ];
  }
  if (gameId === "cel-mai-bun-samsar") {
    return [
      "Fast flow: Bet setup -> Live duel -> Result + payout.",
      "Round persona + duelist selection are inside Live Duel screen.",
      `Higher manual score wins the round; tie returns bets. Winner gets +${formatMoney(getStandardFixedBonus("cel-mai-bun-samsar"))} bonus + bet win.`,
      `Game ends after ${getGameRoundLimit("cel-mai-bun-samsar")} rounds.`
    ];
  }
  if (gameId === "guess-right-order") {
    return [
      "Team vs team manual result entry.",
      `Standard payout with draw allowed (+${formatMoney(getStandardFixedBonus("guess-right-order"))} winner bonus + bet win).`,
      `Game lineup is selected once at game start (max 6 per team), ${getGameRoundLimit("guess-right-order")} rounds total.`
    ];
  }
  if (gameId === "beer-pong") {
    return [
      "Team vs team manual result entry.",
      `Standard payout with draw allowed (+${formatMoney(getStandardFixedBonus("beer-pong"))} winner bonus + bet win).`,
      `Game lineup is selected once at game start (max 6 per team), ${getGameRoundLimit("beer-pong")} rounds total.`
    ];
  }
  if (gameId === "shot-fake") {
    return [
      "Round roles alternate automatically: one shot team (no bet), one detector team (places bet).",
      "If detector wins: +winner bonus + detector bet x active opponents.",
      "If shot team wins: shot team gets only winner bonus, detector loses its bet.",
      "Round can include multiple side bets and optional manual adjust.",
      `${getGameRoundLimit("shot-fake")} rounds total (3 per side).`
    ];
  }
  if (gameId === "curse-de-cai") {
    return [
      "Bet-only horse race with automatic card-draw simulation.",
      "Multiple horse bets are allowed per team.",
      "Only the winning horse bet pays x4; all others lose.",
      `${getGameRoundLimit("curse-de-cai")} races total.`
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
    ? `${state.teams[activeGameTeam].name} is up`
    : `${state.teams.teamA.name} vs ${state.teams.teamB.name}`;
  const compactStatus = `${getGameLabel(gameId)} - Round ${state.progress.currentRound}`;

  return `
    <div class="show-control-strip">
      <div class="show-control-context">
        <p class="show-control-subnote">${escapeHtml(compactStatus)}</p>
        <p class="show-control-note">${escapeHtml(infoLabel)}</p>
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
  ].sort((left, right) => left.name.localeCompare(right.name));

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
    const disabledTeamA = isLocked || (!teamAReady && currentLane !== "teamA") ? "disabled" : "";
    const disabledTeamB = isLocked || (!teamBReady && currentLane !== "teamB") ? "disabled" : "";
    const disabledBench = isLocked ? "disabled" : "";
    laneBuckets[currentLane].push(`
      <article class="show-assignment-chip ${token.status === "unavailable" ? "is-unavailable" : ""}">
        <div class="show-assignment-chip-head">
          <p class="show-assignment-name">${escapeHtml(token.name)}</p>
          <p class="show-assignment-chip-status">${escapeHtml(
            token.status === "available" ? state.teams[token.sourceTeamKey].name : token.status
          )}</p>
        </div>
        <div class="show-assignment-chip-actions">
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
          <div class="show-assignment-lane-body">${tokensHtml || '<p class="show-round-copy">No players.</p>'}</div>
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
            : "Move tokens Left / Bench / Right. Lineup stays active for this whole game."
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
        <p class="show-round-copy">${escapeHtml(category ? getTriviaCategoryQuestion(category) : "Intrebarea curenta va fi afisata aici.")}</p>
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
          <p class="show-round-copy">Real price stays hidden and is sourced from the selected product.</p>
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
    const maxBetA = getMaxBetAmount(state.teams.teamA.money, "cel-mai-bun-samsar");
    const maxBetB = getMaxBetAmount(state.teams.teamB.money, "cel-mai-bun-samsar");
    roundState.betTeamA = maxBetA <= 0 ? 0 : Math.min(normalizeBetAmount(roundState.betTeamA), maxBetA);
    roundState.betTeamB = maxBetB <= 0 ? 0 : Math.min(normalizeBetAmount(roundState.betTeamB), maxBetB);

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
            <div>
              <label class="show-info-label" for="showSamsarBetA">Bet Team 1</label>
              <input id="showSamsarBetA" class="text-input compact-input" type="number" min="0" step="10" max="${maxBetA}" value="${roundState.betTeamA}" data-show-samsar-bet-teama>
              <p class="show-info-sub">Max: ${formatMoney(maxBetA)}</p>
            </div>
            <div>
              <label class="show-info-label" for="showSamsarBetB">Bet Team 2</label>
              <input id="showSamsarBetB" class="text-input compact-input" type="number" min="0" step="10" max="${maxBetB}" value="${roundState.betTeamB}" data-show-samsar-bet-teamb>
              <p class="show-info-sub">Max: ${formatMoney(maxBetB)}</p>
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
    const shotFakeRoles = manualGameId === "shot-fake" ? getShotFakeRoundRoles(state.progress.currentRound) : null;
    if (shotFakeRoles) {
      if (shotFakeRoles.shooterTeamKey === "teamA") {
        roundState.betTeamA = 0;
      } else {
        roundState.betTeamB = 0;
      }
    }
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
        ? `<p class="show-round-copy">Shot team: ${escapeHtml(state.teams[shotFakeRoles.shooterTeamKey].name)} (no bet) | Detector: ${escapeHtml(
            state.teams[shotFakeRoles.detectorTeamKey].name
          )} (places bet).</p>`
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
              <input id="showManualBetA" class="text-input compact-input" type="number" min="0" step="10" max="${maxBetA}" value="${roundState.betTeamA}" data-show-manual-bet-teama ${
                shotFakeRoles && shotFakeRoles.detectorTeamKey !== "teamA" ? "disabled" : ""
              }>
            </div>
            <div>
              <label class="show-info-label" for="showManualBetB">${escapeHtml(state.teams.teamB.name)} bet (max ${formatMoney(
                maxBetB
              )})</label>
              <input id="showManualBetB" class="text-input compact-input" type="number" min="0" step="10" max="${maxBetB}" value="${roundState.betTeamB}" data-show-manual-bet-teamb ${
                shotFakeRoles && shotFakeRoles.detectorTeamKey !== "teamB" ? "disabled" : ""
              }>
            </div>
          </div>
          ${
            manualGameId === "shot-fake"
              ? `
            <div class="show-mini-grid">
              <div>
                <label class="show-info-label">Auto payout multiplier</label>
                <p class="show-info-sub">Detector multiplier this round: x${
                  shotFakeRoles.detectorTeamKey === "teamA" ? settlement.shotFakeBetMultiplierTeamA : settlement.shotFakeBetMultiplierTeamB
                }</p>
                <p class="show-info-sub">Discover success: +${formatMoney(settlement.fixedBonus)} + bet x multiplier</p>
                <p class="show-info-sub">Not discovered: shot team gets +${formatMoney(settlement.fixedBonus)} only</p>
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
    const latestCard =
      Array.isArray(roundState.cardHistory) && roundState.cardHistory.length > 0
        ? roundState.cardHistory[roundState.cardHistory.length - 1]
        : "No cards drawn yet.";
    return `
      ${topBlock}
      <div class="show-round-card">
        <p class="show-info-label">Race Status</p>
        <p class="show-round-title">${winnerHorse ? `Winner: ${winnerHorse.symbol} ${winnerHorse.name}` : "Race in progress"}</p>
        <p class="show-round-copy">Leader: ${leader ? `${leader.horse.symbol} ${leader.horse.name} (${leader.position}/${state.curseRace.trackLength})` : "No movement yet"}.</p>
        <p class="show-round-copy">Latest draw: ${escapeHtml(latestCard)}</p>
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
          <div class="show-action-footer">
            <button class="secondary-btn" type="button" data-show-action="curse-move">Run Auto Race</button>
            <button class="primary-btn" type="button" data-show-action="curse-apply">Apply payout</button>
            <button class="secondary-btn" type="button" data-show-action="curse-reset">Reset race</button>
          </div>
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
          const disabled = button.disabled ? "disabled" : "";
          return `<button class="${tone}" type="button" data-show-action="${button.action}" ${disabled}>${escapeHtml(button.label)}</button>`;
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

function renderSetupParticipantPicker(contextKey, teamKey, selectedIds = []) {
  const team = state.teams[teamKey];
  const availablePlayers = getAvailablePlayersForTeam(teamKey);
  const selectedSet = new Set(sanitizeRoundParticipantIds(selectedIds, teamKey));
  const selectedCount = selectedSet.size;
  const totalCount = availablePlayers.length;

  return `
    <article class="show-stage-mini-card show-participant-picker">
      <div class="show-participant-picker-head">
        <p class="show-info-label">${escapeHtml(team.name)} participants</p>
        <p class="show-info-sub">${selectedCount}/${totalCount} selected</p>
      </div>
      <div class="show-participant-picker-actions">
        <button class="pill-btn" type="button" data-show-participant-all data-context="${escapeHtml(
          contextKey
        )}" data-team="${teamKey}">
          All team
        </button>
      </div>
      <div class="show-participant-picker-grid">
        ${availablePlayers
          .map((player) => {
            const selected = selectedSet.has(player.id);
            return `
              <button
                class="pill-btn show-participant-chip ${selected ? "is-active" : ""}"
                type="button"
                data-show-participant-toggle
                data-context="${escapeHtml(contextKey)}"
                data-team="${teamKey}"
                data-player-id="${player.id}"
              >
                ${escapeHtml(player.name)}
              </button>
            `;
          })
          .join("")}
      </div>
    </article>
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
      const questionTextBase = category ? getTriviaCategoryQuestion(category) : "";
      const questionText =
        questionTextBase && questionTextBase.trim().length > 0
          ? questionTextBase
          : `Question missing for ${category?.title || "Trivia topic"}.`;
      return `
        <section class="show-trivia-qa-stage">
          <p class="show-info-label">Topic</p>
          <p class="show-trivia-category-title">${escapeHtml(category?.title || "No topic selected")}</p>
          <h2 class="show-trivia-question">${escapeHtml(questionText)}</h2>
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
    const betDeltaLabel = roundState.betDelta >= 0 ? `+${formatMoney(roundState.betDelta)}` : `-${formatMoney(Math.abs(roundState.betDelta))}`;
    const bonusDeltaLabel =
      roundState.bonusDelta >= 0 ? `+${formatMoney(roundState.bonusDelta)}` : `-${formatMoney(Math.abs(roundState.bonusDelta))}`;
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
        <p class="show-round-copy">Bet impact: <strong>${betDeltaLabel}</strong></p>
        <p class="show-round-copy">Fixed bonus impact: <strong>${bonusDeltaLabel}</strong></p>
        <p class="show-trivia-delta ${deltaTone}">${deltaLabel}</p>
        <p class="show-round-copy">${escapeHtml(playingTeam.name)} now has ${formatMoney(playingTeam.money)}.</p>
      </div>
    `;
  }
  if (gameId === "pretul-corect") {
    const roundState = getOrCreatePretulRoundState();
    const usedItemIds = getPretulUsedItemIdSet();
    if (
      !state.pretul.items.some((entry) => entry.id === roundState.selectedItemId) ||
      (usedItemIds.has(roundState.selectedItemId) && liveStep === "topic-select")
    ) {
      const firstAvailable = state.pretul.items.find((entry) => !usedItemIds.has(entry.id));
      roundState.selectedItemId = firstAvailable?.id || "";
    }
    const item = state.pretul.items.find((entry) => entry.id === roundState.selectedItemId) || null;
    const productTitle = getPretulItemTitle(item);
    const categoryTitle = getPretulItemCategory(item);
    const sourceUrl = sanitizeString(item?.productUrl, "").trim();
    const quickSpecs = Array.isArray(item?.quickSpecs)
      ? item.quickSpecs.map((spec) => sanitizeString(spec, "").trim()).filter((spec) => spec.length > 0).slice(0, 4)
      : [];
    const maxBetA = getMaxBetAmount(state.teams.teamA.money, "pretul-corect");
    const maxBetB = getMaxBetAmount(state.teams.teamB.money, "pretul-corect");
    roundState.betTeamA = maxBetA <= 0 ? 0 : Math.min(normalizeBetAmount(roundState.betTeamA), maxBetA);
    roundState.betTeamB = maxBetB <= 0 ? 0 : Math.min(normalizeBetAmount(roundState.betTeamB), maxBetB);
    if (roundState.participantsTeamA.length === 0) {
      roundState.participantsTeamA = getAvailablePlayersForTeam("teamA").map((player) => player.id);
    }
    if (roundState.participantsTeamB.length === 0) {
      roundState.participantsTeamB = getAvailablePlayersForTeam("teamB").map((player) => player.id);
    }
    roundState.chooserTeamKey = ["teamA", "teamB"].includes(roundState.chooserTeamKey) ? roundState.chooserTeamKey : "teamA";
    roundState.realPrice = getPretulItemActualPrice(item);
    const diffA = Math.abs(roundState.answerTeamA - roundState.realPrice);
    const diffB = Math.abs(roundState.answerTeamB - roundState.realPrice);
    const winnerLabel =
      diffA < diffB ? state.teams.teamA.name : diffB < diffA ? state.teams.teamB.name : "Tie (equal distance)";
    const chooserTeam = state.teams[roundState.chooserTeamKey];
    const scaleMin = Math.max(
      0,
      Math.min(roundState.answerTeamA, roundState.answerTeamB, roundState.realPrice) - 100
    );
    const scaleMax =
      Math.max(roundState.answerTeamA, roundState.answerTeamB, roundState.realPrice) + 100;
    const scaleSpan = Math.max(1, scaleMax - scaleMin);
    const markerPosition = (value) =>
      Math.max(0, Math.min(100, Math.round(((value - scaleMin) / scaleSpan) * 100)));
    const realPos = markerPosition(roundState.realPrice);
    const guessPosA = markerPosition(roundState.answerTeamA);
    const guessPosB = markerPosition(roundState.answerTeamB);

    if (liveStep === "topic-select") {
      const cards = state.pretul.items
        .map((entry) => {
          const isUsed = usedItemIds.has(entry.id);
          const isSelected = entry.id === roundState.selectedItemId;
          return `
            <button class="show-stage-topic-card ${isUsed ? "is-used" : ""} ${isSelected ? "is-selected" : ""}" type="button" data-show-pretul-item="${
              entry.id
            }" ${
              isUsed ? "disabled" : ""
            }>
              <span class="show-stage-topic-status">${isUsed ? "USED" : "TOPIC"}</span>
              <span class="show-stage-topic-title">${escapeHtml(getPretulItemCategory(entry))}</span>
            </button>
          `;
        })
        .join("");
      const hasAvailable = state.pretul.items.some((entry) => !usedItemIds.has(entry.id));
      return `
        <section class="show-stage-stack">
          <p class="show-info-label">Pretul Corect / Topic Select</p>
          <p class="show-round-title">Pick the next category</p>
          <div class="show-stage-topic-grid">${cards}</div>
          ${hasAvailable ? "" : '<p class="show-round-copy">All category cards are used. Finish game to return to Game Select.</p>'}
        </section>
      `;
    }

    if (liveStep === "bet-screen") {
      return `
        <section class="show-stage-stack">
          <p class="show-info-label">Bet Screen</p>
          <p class="show-round-title">${escapeHtml(categoryTitle || "Select category first")}</p>
          <article class="show-stage-mini-card">
            <p class="show-info-label">Category chooser</p>
            <select class="text-input" data-show-pretul-chooser-team>
              <option value="teamA" ${roundState.chooserTeamKey === "teamA" ? "selected" : ""}>${escapeHtml(
                state.teams.teamA.name
              )}</option>
              <option value="teamB" ${roundState.chooserTeamKey === "teamB" ? "selected" : ""}>${escapeHtml(
                state.teams.teamB.name
              )}</option>
            </select>
            <p class="show-info-sub">${escapeHtml(chooserTeam.name)} locked this category for the round.</p>
          </article>
          <div class="show-vs-input-grid">
            <article class="show-stage-mini-card">
              <p class="show-info-label">${escapeHtml(state.teams.teamA.name)} Bet</p>
              <input class="text-input show-stage-money-input" type="number" min="0" step="10" value="${roundState.betTeamA}" data-show-pretul-bet-teama>
              <p class="show-info-sub">Max: ${formatMoney(maxBetA)}</p>
            </article>
            <article class="show-stage-mini-card">
              <p class="show-info-label">${escapeHtml(state.teams.teamB.name)} Bet</p>
              <input class="text-input show-stage-money-input" type="number" min="0" step="10" value="${roundState.betTeamB}" data-show-pretul-bet-teamb>
              <p class="show-info-sub">Max: ${formatMoney(maxBetB)}</p>
            </article>
          </div>
          <div class="show-vs-input-grid">
            ${renderSetupParticipantPicker("pretul-corect", "teamA", roundState.participantsTeamA)}
            ${renderSetupParticipantPicker("pretul-corect", "teamB", roundState.participantsTeamB)}
          </div>
        </section>
      `;
    }

    if (["product-reveal", "answer-entry", "price-reveal"].includes(liveStep)) {
      return `
        <section class="show-stage-stack show-pretul-product-stage">
          <p class="show-info-label">Product + Guesses</p>
          <p class="show-round-title">${escapeHtml(productTitle || "No product selected")}</p>
          <p class="show-round-copy">Category: ${escapeHtml(categoryTitle || "N/A")}</p>
          <figure class="show-film-stage-figure">
            <img src="${escapeHtml(item?.imageUrl || PRETUL_PRODUCT_PLACEHOLDER)}" alt="${escapeHtml(
              productTitle || "Product reveal"
            )}">
            <figcaption>${escapeHtml(item?.imageHint || productTitle || "No product selected")}</figcaption>
          </figure>
          ${
            sourceUrl
              ? `<p class="show-round-copy">Source: <a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(
                  sourceUrl
                )}</a></p>`
              : ""
          }
          ${
            quickSpecs.length > 0
              ? `<ul class="show-pretul-spec-strip">${quickSpecs
                  .map((spec) => `<li>${escapeHtml(spec)}</li>`)
                  .join("")}</ul>`
              : ""
          }
          <div class="show-vs-input-grid">
            <article class="show-stage-mini-card">
              <p class="show-info-label">${escapeHtml(state.teams.teamA.name)} Guess</p>
              <input class="text-input show-stage-money-input" type="number" min="0" step="1" value="${roundState.answerTeamA}" data-show-pretul-answer-teama>
            </article>
            <article class="show-stage-mini-card">
              <p class="show-info-label">${escapeHtml(state.teams.teamB.name)} Guess</p>
              <input class="text-input show-stage-money-input" type="number" min="0" step="1" value="${roundState.answerTeamB}" data-show-pretul-answer-teamb>
            </article>
          </div>
          <p class="show-round-copy">Real price stays hidden until result reveal. Press <strong>Auto Winner + Payout</strong> when ready.</p>
        </section>
      `;
    }

    const fixedBonus = getStandardFixedBonus("pretul-corect");
    const winnerTeamKey = diffA < diffB ? "teamA" : diffB < diffA ? "teamB" : "draw";
    const winnerPayout = winnerTeamKey === "teamA" ? fixedBonus + roundState.betTeamA : winnerTeamKey === "teamB" ? fixedBonus + roundState.betTeamB : 0;
    const loserPayout = winnerTeamKey === "teamA" ? roundState.betTeamB : winnerTeamKey === "teamB" ? roundState.betTeamA : 0;
    const deltaA = winnerTeamKey === "teamA" ? winnerPayout : winnerTeamKey === "teamB" ? -roundState.betTeamA : 0;
    const deltaB = winnerTeamKey === "teamB" ? winnerPayout : winnerTeamKey === "teamA" ? -roundState.betTeamB : 0;
    return `
      <section class="show-stage-stack show-stage-result-card">
        <p class="show-info-label">Auto Winner</p>
        <p class="show-stage-result-headline">${escapeHtml(winnerLabel)}</p>
        <p class="show-round-copy">${escapeHtml(productTitle || "Selected product")} (${escapeHtml(
          categoryTitle || "Category"
        )})</p>
        ${
          sourceUrl
            ? `<p class="show-round-copy">Source: <a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(
                sourceUrl
              )}</a></p>`
            : ""
        }
        <div class="show-pretul-scale">
          <div class="show-pretul-scale-track"></div>
          <div class="show-pretul-scale-marker is-real" style="left:${realPos}%;">Real ${formatMoney(roundState.realPrice)}</div>
          <div class="show-pretul-scale-marker is-team-a" style="left:${guessPosA}%;">${escapeHtml(
            state.teams.teamA.name
          )}: ${formatMoney(roundState.answerTeamA)}</div>
          <div class="show-pretul-scale-marker is-team-b" style="left:${guessPosB}%;">${escapeHtml(
            state.teams.teamB.name
          )}: ${formatMoney(roundState.answerTeamB)}</div>
        </div>
        <div class="show-vs-input-grid">
          <article class="show-stage-mini-card">
            <p class="show-info-label">${escapeHtml(state.teams.teamA.name)} estimate</p>
            <p class="show-info-value">${formatMoney(roundState.answerTeamA)}</p>
            <p class="show-info-sub">Absolute distance: ${formatMoney(diffA)}</p>
          </article>
          <article class="show-stage-mini-card">
            <p class="show-info-label">${escapeHtml(state.teams.teamB.name)} estimate</p>
            <p class="show-info-value">${formatMoney(roundState.answerTeamB)}</p>
            <p class="show-info-sub">Absolute distance: ${formatMoney(diffB)}</p>
          </article>
        </div>
        <div class="show-stage-mini-card">
          <p class="show-info-label">Payout summary</p>
          ${
            winnerTeamKey === "draw"
              ? `<p class="show-round-copy">Round is draw. Distances are equal, no team payout is applied.</p>`
              : `<p class="show-round-copy"><strong>${escapeHtml(state.teams[winnerTeamKey].name)}</strong> wins <strong>+${formatMoney(
                  winnerPayout
                )}</strong> (bonus + bet), while <strong>${
                  winnerTeamKey === "teamA" ? escapeHtml(state.teams.teamB.name) : escapeHtml(state.teams.teamA.name)
                }</strong> loses <strong>-${formatMoney(loserPayout)}</strong>.</p>`
          }
          <p class="show-info-sub">${escapeHtml(state.teams.teamA.name)}: ${formatSignedMoney(deltaA)} | ${escapeHtml(
            state.teams.teamB.name
          )}: ${formatSignedMoney(deltaB)}</p>
        </div>
        <p class="show-round-copy">${escapeHtml(roundState.lastResult || "Apply payout to generate round result.")}</p>
      </section>
    `;
  }
  if (gameId === "film-joc-franciza-fun-fact") {
    const roundState = getOrCreateFilmRoundState();
    const itemIdSet = new Set(state.filmGame.items.map((entry) => entry.id));
    roundState.usedItemIds = Array.from(getFilmUsedItemIdSet()).filter((id) => itemIdSet.has(id));
    if (!itemIdSet.has(roundState.selectedItemId) || roundState.usedItemIds.includes(roundState.selectedItemId)) {
      const nextAvailable = state.filmGame.items.find((entry) => !roundState.usedItemIds.includes(entry.id));
      roundState.selectedItemId = nextAvailable?.id || "";
    }
    const playingTeamKey = getFilmTeamForRound(state.progress.currentRound);
    const otherTeamKey = playingTeamKey === "teamA" ? "teamB" : "teamA";
    const playingTeam = state.teams[playingTeamKey];
    const maxBet = getMaxBetAmount(playingTeam.money, "film-joc-franciza-fun-fact");
    roundState.teamKey = playingTeamKey;
    if (playingTeamKey === "teamA") {
      roundState.betTeamA = maxBet <= 0 ? 0 : Math.min(normalizeBetAmount(roundState.betTeamA), maxBet);
      roundState.betAmount = roundState.betTeamA;
    } else {
      roundState.betTeamB = maxBet <= 0 ? 0 : Math.min(normalizeBetAmount(roundState.betTeamB), maxBet);
      roundState.betAmount = roundState.betTeamB;
    }
    roundState.outcomes = { ...roundState.outcomesByTeam[playingTeamKey] };
    const item = state.filmGame.items.find((entry) => entry.id === roundState.selectedItemId);
    const stageImageUrl = resolveFilmImageUrl(item?.imageUrl, item?.imageSourcePageUrl, FILM_FALLBACK_IMAGE);
    const breakdown = getFilmRoundBreakdown(roundState, roundState.betAmount, playingTeamKey);
    const cardConfig = [
      {
        key: "character",
        title: "Character / Title",
        revealText: item?.characterPrompt || "Placeholder character/title",
        imageUrl: resolveFilmImageUrl(item?.characterImageUrl, item?.characterSourcePageUrl || item?.imageSourcePageUrl, stageImageUrl),
        imageAlt: item?.characterImageHint || "Character / Title visual",
        sourceUrl: item?.characterSourcePageUrl || item?.imageSourcePageUrl || ""
      },
      {
        key: "franchise",
        title: "Franchise",
        revealText: item?.franchisePrompt || "Placeholder franchise",
        imageUrl: resolveFilmImageUrl(item?.franchiseImageUrl, item?.franchiseSourcePageUrl || item?.imageSourcePageUrl, stageImageUrl),
        imageAlt: item?.franchiseImageHint || "Franchise visual",
        sourceUrl: item?.franchiseSourcePageUrl || item?.imageSourcePageUrl || ""
      },
      {
        key: "funFact",
        title: "Fun Fact",
        revealText: item?.funFactPrompt || "Placeholder fun fact",
        imageUrl: resolveFilmImageUrl(item?.funFactImageUrl, item?.funFactSourcePageUrl || item?.imageSourcePageUrl, stageImageUrl),
        imageAlt: item?.funFactImageHint || "Fun Fact visual",
        sourceUrl: item?.funFactSourcePageUrl || item?.imageSourcePageUrl || ""
      }
    ];
    const betPresets = Array.from(
      new Set(
        [BET_ROUNDING_STEP, Math.round(maxBet * 0.25), Math.round(maxBet * 0.5), Math.round(maxBet * 0.75), maxBet]
          .map((amount) => normalizeBetAmount(amount))
          .filter((amount) => amount > 0 && amount <= maxBet)
      )
    ).sort((left, right) => left - right);

    if (liveStep === "topic-select") {
      const topicTiles = state.filmGame.items
        .map((entry) => {
          const isUsed = roundState.usedItemIds.includes(entry.id);
          const isSelected = entry.id === roundState.selectedItemId;
          return `
            <button class="show-trivia-topic-tile ${isSelected ? "is-selected" : ""}" type="button" data-show-film-topic="${
              entry.id
            }" ${isUsed ? "disabled" : ""}>
              <span class="show-trivia-topic-status ${isUsed ? "is-used" : ""}">${isUsed ? "USED" : "CATEGORY"}</span>
              <span class="show-trivia-topic-title">${escapeHtml(entry.title)}</span>
            </button>
          `;
        })
        .join("");
      return `
        <div class="show-round-card show-trivia-turn-card">
          <p class="show-info-label">Active Team</p>
          <p class="show-round-title show-trivia-turn-team">${escapeHtml(playingTeam.name)}</p>
          <p class="show-round-copy">Choose one category card.</p>
        </div>
        <div class="show-trivia-topic-grid">${topicTiles}</div>
        ${
          topicTiles.trim()
            ? ""
            : `<p class="show-round-copy">No categories left. Use <strong>Finish Film/Joc</strong> to return to Game Select.</p>`
        }
      `;
    }

    if (liveStep === "bet-screen") {
      return `
        <section class="show-stage-stack show-trivia-bet-stage">
          <p class="show-info-label">Bet Screen</p>
          <p class="show-round-title show-trivia-topic-focus">${escapeHtml(item?.title || "Select category first")}</p>
          <p class="show-round-copy show-trivia-bet-team">Team in play: ${escapeHtml(playingTeam.name)}</p>
          <div class="show-trivia-bet-core">
            <label class="show-info-label show-trivia-bet-label" for="showFilmBetFlow">Bet amount</label>
            <input id="showFilmBetFlow" class="text-input show-trivia-bet-input" type="number" min="0" step="10" value="${roundState.betAmount}" data-show-film-bet>
            <p class="show-control-note show-trivia-bet-max">Max bet: ${formatMoney(maxBet)}</p>
          </div>
          <div class="show-trivia-bet-presets">
            ${betPresets
              .map(
                (preset) =>
                  `<button class="pill-btn show-trivia-bet-chip" type="button" data-show-film-bet="${preset}">${formatMoney(
                    preset
                  )}</button>`
              )
              .join("")}
          </div>
        </section>
      `;
    }

    if (liveStep === "card-reveal") {
      return `
        <section class="show-stage-stack">
          <p class="show-info-label">Image + Cards</p>
          <figure class="show-film-stage-figure">
            <img src="${escapeHtml(stageImageUrl)}" alt="${escapeHtml(item?.imageAlt || "Round image")}">
            <figcaption>${escapeHtml(item?.title || "No round item selected")}</figcaption>
          </figure>
          <div class="show-film-card-grid">
            ${cardConfig
              .map((card) => {
                const revealState = roundState.revealed[card.key];
                const activeOutcome = roundState.outcomesByTeam[playingTeamKey][card.key];
                return `
                  <article class="show-film-reveal-card ${revealState ? "is-open" : ""}">
                    <figure class="show-film-reveal-figure">
                      <img src="${escapeHtml(card.imageUrl)}" alt="${escapeHtml(card.imageAlt)}">
                    </figure>
                    <div class="show-film-card-head">
                      <p class="show-info-label">${escapeHtml(card.title)}</p>
                      <button class="pill-btn" type="button" data-show-film-reveal="${card.key}">${revealState ? "Hide" : "Reveal"}</button>
                    </div>
                    <p class="show-round-copy">${escapeHtml(revealState ? card.revealText : "Hidden until reveal")}</p>
                    ${
                      card.sourceUrl
                        ? `<p class="show-info-sub">Source: <a href="${escapeHtml(card.sourceUrl)}" target="_blank" rel="noopener noreferrer">link</a></p>`
                        : ""
                    }
                    <div class="show-film-outcome-row">
                      <span class="show-info-sub">${escapeHtml(playingTeam.name)}</span>
                      <button class="pill-btn ${activeOutcome === "correct" ? "is-active" : ""}" type="button" data-show-film-outcome="${card.key}:correct">Correct</button>
                      <button class="pill-btn ${activeOutcome === "wrong" ? "is-active" : ""}" type="button" data-show-film-outcome="${card.key}:wrong">Wrong</button>
                    </div>
                  </article>
                `;
              })
              .join("")}
          </div>
        </section>
      `;
    }

    return `
      <section class="show-stage-stack show-stage-result-card">
        <p class="show-info-label">Result / Breakdown</p>
        <div class="show-film-breakdown-grid">
          <article class="show-stage-mini-card">
            <p class="show-info-label">${escapeHtml(playingTeam.name)}</p>
            <p class="show-info-value">${breakdown.totalPoints}/${breakdown.maxPoints}</p>
            <p class="show-info-sub">Correct: ${breakdown.correctCount}/3 | Bet: ${breakdown.betEligible ? "ON" : "OFF"}</p>
            <p class="show-info-sub">Component payout: +${formatMoney(breakdown.componentPayout)}</p>
            <p class="show-info-sub">Bet delta: ${formatSignedMoney(breakdown.betDelta)}</p>
            <p class="show-info-sub">Total delta: ${formatSignedMoney(breakdown.totalDelta)}</p>
          </article>
        </div>
        <p class="show-round-copy">Only active team (${escapeHtml(playingTeam.name)}) is scored this round. Next turn goes to ${escapeHtml(
          state.teams[otherTeamKey].name
        )}.</p>
        <p class="show-round-copy">Scoring weights: Character x1, Franchise x1, Fun Fact x3.</p>
        <p class="show-round-copy">${escapeHtml(roundState.lastResult || "Apply result to generate payout breakdown.")}</p>
      </section>
    `;
  }
  if (gameId === "cel-mai-bun-samsar") {
    const roundNumber = getSamsarRoundNumber();
    const roundState = getOrCreateSamsarRoundState(roundNumber);
    const template = state.samsarGame.roundsData[roundNumber - 1];
    const selectableTeamA = getSelectableGameLineupPlayers("teamA");
    const selectableTeamB = getSelectableGameLineupPlayers("teamB");
    const teamAOptions = selectableTeamA
      .map((player) => `<option value="${player.id}" ${roundState.activePlayerTeamAId === player.id ? "selected" : ""}>${escapeHtml(player.name)}</option>`)
      .join("");
    const teamBOptions = selectableTeamB
      .map((player) => `<option value="${player.id}" ${roundState.activePlayerTeamBId === player.id ? "selected" : ""}>${escapeHtml(player.name)}</option>`)
      .join("");
    const maxBetA = getMaxBetAmount(state.teams.teamA.money, "cel-mai-bun-samsar");
    const maxBetB = getMaxBetAmount(state.teams.teamB.money, "cel-mai-bun-samsar");
    roundState.betTeamA = maxBetA <= 0 ? 0 : Math.min(normalizeBetAmount(roundState.betTeamA), maxBetA);
    roundState.betTeamB = maxBetB <= 0 ? 0 : Math.min(normalizeBetAmount(roundState.betTeamB), maxBetB);
    const duelistA = selectableTeamA.find((player) => player.id === roundState.activePlayerTeamAId);
    const duelistB = selectableTeamB.find((player) => player.id === roundState.activePlayerTeamBId);

    if (liveStep === "bet-screen") {
      return `
        <section class="show-stage-stack">
          <p class="show-info-label">Bet Screen</p>
          <p class="show-round-title">Round ${roundNumber} bets</p>
          <p class="show-round-copy">Winner gets +${formatMoney(getStandardFixedBonus("cel-mai-bun-samsar"))} bonus + bet win.</p>
          <div class="show-vs-input-grid">
            <article class="show-stage-mini-card">
              <p class="show-info-label">${escapeHtml(state.teams.teamA.name)} Bet</p>
              <input class="text-input show-stage-money-input" type="number" min="0" step="10" max="${maxBetA}" value="${roundState.betTeamA}" data-show-samsar-bet-teama>
              <p class="show-info-sub">Max: ${formatMoney(maxBetA)}</p>
            </article>
            <article class="show-stage-mini-card">
              <p class="show-info-label">${escapeHtml(state.teams.teamB.name)} Bet</p>
              <input class="text-input show-stage-money-input" type="number" min="0" step="10" max="${maxBetB}" value="${roundState.betTeamB}" data-show-samsar-bet-teamb>
              <p class="show-info-sub">Max: ${formatMoney(maxBetB)}</p>
            </article>
          </div>
        </section>
      `;
    }

    if (liveStep === "live-duel") {
      return `
        <section class="show-stage-stack">
          <p class="show-info-label">Live Duel / Round ${roundNumber}</p>
          <article class="show-stage-focus-card">
            <p class="show-round-title">${escapeHtml(template?.personaTitle || "Persona runda")}</p>
            <p class="show-round-copy">${escapeHtml(template?.personaRequirements || "Completeaza cerintele pentru persona.")}</p>
          </article>
          <div class="show-vs-input-grid">
            <article class="show-stage-mini-card">
              <p class="show-info-label">${escapeHtml(state.teams.teamA.name)} duelist</p>
              <select class="text-input" data-show-samsar-player-teama>
                <option value="">Select player</option>
                ${teamAOptions}
              </select>
            </article>
            <article class="show-stage-mini-card">
              <p class="show-info-label">${escapeHtml(state.teams.teamB.name)} duelist</p>
              <select class="text-input" data-show-samsar-player-teamb>
                <option value="">Select player</option>
                ${teamBOptions}
              </select>
            </article>
          </div>
          <div class="show-vs-focus-board">
            <article class="show-stage-mini-card">
              <p class="show-info-label">${escapeHtml(state.teams.teamA.name)}</p>
              <p class="show-info-value">${escapeHtml(duelistA?.name || "Select player")}</p>
            </article>
            <article class="show-stage-mini-card">
              <p class="show-info-label">${escapeHtml(state.teams.teamB.name)}</p>
              <p class="show-info-value">${escapeHtml(duelistB?.name || "Select player")}</p>
            </article>
          </div>
          <p class="show-round-copy">Run the live duel, then continue to result and payout.</p>
        </section>
      `;
    }

    const winnerLabel =
      roundState.scoreTeamA > roundState.scoreTeamB
        ? state.teams.teamA.name
        : roundState.scoreTeamB > roundState.scoreTeamA
          ? state.teams.teamB.name
          : "Draw";
    return `
      <section class="show-stage-stack show-stage-result-card">
        <p class="show-info-label">Result + Payout</p>
        <div class="show-vs-input-grid">
          <article class="show-stage-mini-card">
            <p class="show-info-label">${escapeHtml(state.teams.teamA.name)} Score</p>
            <input class="text-input show-stage-score-input" type="number" min="0" step="1" value="${roundState.scoreTeamA}" data-show-samsar-score-teama>
          </article>
          <article class="show-stage-mini-card">
            <p class="show-info-label">${escapeHtml(state.teams.teamB.name)} Score</p>
            <input class="text-input show-stage-score-input" type="number" min="0" step="1" value="${roundState.scoreTeamB}" data-show-samsar-score-teamb>
          </article>
        </div>
        <p class="show-stage-result-headline">${escapeHtml(winnerLabel)}</p>
        <p class="show-round-copy">${escapeHtml(state.teams.teamA.name)} ${roundState.scoreTeamA} - ${roundState.scoreTeamB} ${escapeHtml(
          state.teams.teamB.name
        )}</p>
        <p class="show-round-copy">Bets: ${escapeHtml(state.teams.teamA.name)} ${formatMoney(roundState.betTeamA)} | ${escapeHtml(
          state.teams.teamB.name
        )} ${formatMoney(roundState.betTeamB)}</p>
        <p class="show-round-copy">${escapeHtml(roundState.lastResult || "Apply result to settle round payout.")}</p>
      </section>
    `;
  }
  if (isManualMatchGame(gameId)) {
    const manualGameId = gameId;
    const roundState = getOrCreateManualMatchRoundState(manualGameId, state.progress.currentRound);
    if (roundState.participantsTeamA.length === 0) {
      roundState.participantsTeamA = getAvailablePlayersForTeam("teamA").map((player) => player.id);
    }
    if (roundState.participantsTeamB.length === 0) {
      roundState.participantsTeamB = getAvailablePlayersForTeam("teamB").map((player) => player.id);
    }
    const shotFakeRoles = manualGameId === "shot-fake" ? getShotFakeRoundRoles(state.progress.currentRound) : null;
    if (shotFakeRoles) {
      if (shotFakeRoles.shooterTeamKey === "teamA") {
        roundState.betTeamA = 0;
      } else {
        roundState.betTeamB = 0;
      }
    }
    const settlement = calculateManualMatchSettlement(manualGameId, roundState);
    const maxBetA = settlement.maxBetA;
    const maxBetB = settlement.maxBetB;
    const winnerPreview =
      roundState.winner === "teamA"
        ? `${state.teams.teamA.name} preview`
        : roundState.winner === "teamB"
          ? `${state.teams.teamB.name} preview`
          : "Draw preview";
    const resultHeadline =
      settlement.winner === "teamA"
        ? `${state.teams.teamA.name} wins`
        : settlement.winner === "teamB"
          ? `${state.teams.teamB.name} wins`
          : "Draw";

    if (manualGameId !== "shot-fake" && liveStep === "bet-screen") {
      return `
        <section class="show-stage-stack">
          <p class="show-info-label">${escapeHtml(getGameLabel(manualGameId))} / Bet Screen</p>
          <div class="show-vs-input-grid">
            <article class="show-stage-mini-card">
              <p class="show-info-label">${escapeHtml(state.teams.teamA.name)} Bet</p>
              <input class="text-input show-stage-money-input" type="number" min="0" step="10" value="${roundState.betTeamA}" data-show-manual-bet-teama>
              <p class="show-info-sub">Max: ${formatMoney(maxBetA)}</p>
            </article>
            <article class="show-stage-mini-card">
              <p class="show-info-label">${escapeHtml(state.teams.teamB.name)} Bet</p>
              <input class="text-input show-stage-money-input" type="number" min="0" step="10" value="${roundState.betTeamB}" data-show-manual-bet-teamb>
              <p class="show-info-sub">Max: ${formatMoney(maxBetB)}</p>
            </article>
          </div>
          <div class="show-vs-input-grid">
            ${renderSetupParticipantPicker("manual", "teamA", roundState.participantsTeamA)}
            ${renderSetupParticipantPicker("manual", "teamB", roundState.participantsTeamB)}
          </div>
        </section>
      `;
    }

    if (manualGameId === "shot-fake" && liveStep === "sidebet-setup") {
      return `
        <section class="show-stage-stack">
          <p class="show-info-label">Shot Fake / Side Bet Setup</p>
          <p class="show-round-copy"><strong>${escapeHtml(state.teams[shotFakeRoles.shooterTeamKey].name)}</strong> is shot team (no bet). <strong>${escapeHtml(
            state.teams[shotFakeRoles.detectorTeamKey].name
          )}</strong> is detector team (places bet this round).</p>
          <div class="show-vs-input-grid">
            <article class="show-stage-mini-card">
              <p class="show-info-label">${escapeHtml(state.teams.teamA.name)} Base Bet</p>
              <input class="text-input show-stage-money-input" type="number" min="0" step="10" value="${roundState.betTeamA}" data-show-manual-bet-teama ${
                shotFakeRoles.detectorTeamKey !== "teamA" ? "disabled" : ""
              }>
              <p class="show-info-sub">${
                shotFakeRoles.detectorTeamKey === "teamA" ? `Max: ${formatMoney(maxBetA)}` : "No bet (shot team)"
              }</p>
            </article>
            <article class="show-stage-mini-card">
              <p class="show-info-label">${escapeHtml(state.teams.teamB.name)} Base Bet</p>
              <input class="text-input show-stage-money-input" type="number" min="0" step="10" value="${roundState.betTeamB}" data-show-manual-bet-teamb ${
                shotFakeRoles.detectorTeamKey !== "teamB" ? "disabled" : ""
              }>
              <p class="show-info-sub">${
                shotFakeRoles.detectorTeamKey === "teamB" ? `Max: ${formatMoney(maxBetB)}` : "No bet (shot team)"
              }</p>
            </article>
          </div>
          <div class="show-vs-input-grid">
            ${renderSetupParticipantPicker("manual", "teamA", roundState.participantsTeamA)}
            ${renderSetupParticipantPicker("manual", "teamB", roundState.participantsTeamB)}
          </div>
          <article class="show-stage-mini-card">
            <p class="show-info-label">Round payout logic</p>
            <p class="show-round-copy">Discover success (${escapeHtml(state.teams[shotFakeRoles.detectorTeamKey].name)}): +${formatMoney(
              settlement.fixedBonus
            )} + bet x${
              shotFakeRoles.detectorTeamKey === "teamA" ? settlement.shotFakeBetMultiplierTeamA : settlement.shotFakeBetMultiplierTeamB
            }.</p>
            <p class="show-round-copy">Not discovered (${escapeHtml(state.teams[shotFakeRoles.shooterTeamKey].name)}): +${formatMoney(
              settlement.fixedBonus
            )} only; detector bet is lost.</p>
          </article>
          <div class="show-sidebet-list">
            ${roundState.shotFake.sideBets
              .map((sideBet) => {
                return `
                  <article class="show-sidebet-card" data-show-shot-sidebet-id="${sideBet.id}">
                    <input class="text-input" type="text" value="${escapeHtml(sideBet.label)}" data-show-shot-sidebet-label>
                    <div class="show-sidebet-controls">
                      <input class="text-input compact-input" type="number" min="0" step="10" value="${sideBet.amount}" data-show-shot-sidebet-amount>
                      <select class="text-input compact-input" data-show-shot-sidebet-winner>
                        <option value="draw" ${sideBet.winner === "draw" ? "selected" : ""}>Draw</option>
                        <option value="teamA" ${sideBet.winner === "teamA" ? "selected" : ""}>${escapeHtml(state.teams.teamA.name)}</option>
                        <option value="teamB" ${sideBet.winner === "teamB" ? "selected" : ""}>${escapeHtml(state.teams.teamB.name)}</option>
                      </select>
                      <button class="pill-btn" type="button" data-show-action="manual-sidebet-remove" data-sidebet-id="${sideBet.id}">Remove</button>
                    </div>
                  </article>
                `;
              })
              .join("")}
          </div>
          <button class="secondary-btn" type="button" data-show-action="manual-sidebet-add">Add Side Bet</button>
        </section>
      `;
    }

    if (liveStep === "live-round") {
      return `
        <section class="show-stage-stack show-stage-focus-card">
          <p class="show-info-label">${escapeHtml(getGameLabel(manualGameId))} / Live Round</p>
          <p class="show-round-title">${escapeHtml(state.teams.teamA.name)} vs ${escapeHtml(state.teams.teamB.name)}</p>
          <p class="show-round-copy">${
            manualGameId === "shot-fake"
              ? `${escapeHtml(state.teams[shotFakeRoles.shooterTeamKey].name)} takes the shot. ${escapeHtml(
                  state.teams[shotFakeRoles.detectorTeamKey].name
                )} can discover for +${formatMoney(settlement.fixedBonus)} + bet multiplier payout.`
              : "Play the live challenge, then move to Result Screen."
          }</p>
        </section>
      `;
    }

    return `
      <section class="show-stage-stack show-stage-result-card">
        <p class="show-info-label">${escapeHtml(getGameLabel(manualGameId))} / Result Screen</p>
        <p class="show-stage-result-headline">${escapeHtml(resultHeadline)}</p>
        ${
          isScorelessManualMatchGame(manualGameId)
            ? ""
            : `
        <div class="show-vs-input-grid">
          <article class="show-stage-mini-card">
            <p class="show-info-label">${escapeHtml(state.teams.teamA.name)} Score</p>
            <input class="text-input show-stage-score-input" type="number" min="0" step="1" value="${roundState.scoreTeamA}" data-show-manual-score-teama>
          </article>
          <article class="show-stage-mini-card">
            <p class="show-info-label">${escapeHtml(state.teams.teamB.name)} Score</p>
            <input class="text-input show-stage-score-input" type="number" min="0" step="1" value="${roundState.scoreTeamB}" data-show-manual-score-teamb>
          </article>
        </div>`
        }
        <div class="show-result-choice-row">
          <button class="pill-btn ${roundState.winner === "teamA" ? "is-active" : ""}" type="button" data-show-manual-winner="teamA">${escapeHtml(
            state.teams.teamA.name
          )} won</button>
          <button class="pill-btn ${roundState.winner === "draw" ? "is-active" : ""}" type="button" data-show-manual-winner="draw">Draw</button>
          <button class="pill-btn ${roundState.winner === "teamB" ? "is-active" : ""}" type="button" data-show-manual-winner="teamB">${escapeHtml(
            state.teams.teamB.name
          )} won</button>
        </div>
        <p class="show-round-copy">${escapeHtml(winnerPreview)}</p>
        <p class="show-round-copy">Net preview: ${escapeHtml(state.teams.teamA.name)} ${formatSignedMoney(settlement.deltaA)} | ${escapeHtml(
          state.teams.teamB.name
        )} ${formatSignedMoney(settlement.deltaB)}.</p>
        <p class="show-round-copy">${escapeHtml(roundState.lastResult || "Apply result to settle payout.")}</p>
      </section>
    `;
  }
  if (gameId === "curse-de-cai") {
    const roundState = getOrCreateCurseRoundState(state.progress.currentRound);
    if (!roundState.winnerHorseId) {
      detectCurseWinner(roundState);
    }
    const roundKey = getCurseRoundKey(state.progress.currentRound);
    const raceRunning = isCurseRaceRunning(roundKey);
    const winnerHorse = state.curseRace.horses.find((horse) => horse.id === roundState.winnerHorseId);
    const leader = state.curseRace.horses
      .map((horse) => ({
        horse,
        position: Math.max(0, Math.round(sanitizeNumber(roundState.positions?.[horse.id], 0)))
      }))
      .sort((left, right) => right.position - left.position)[0];
    const maxBetA = getMaxBetAmount(state.teams.teamA.money, "curse-de-cai");
    const maxBetB = getMaxBetAmount(state.teams.teamB.money, "curse-de-cai");
    const totalBetA = getCurseTeamBetTotal(roundState, "teamA");
    const totalBetB = getCurseTeamBetTotal(roundState, "teamB");
    const settlement = winnerHorse ? calculateCursePayout(roundState) : null;
    const trackLength = state.curseRace.trackLength;

    if (liveStep === "race-intro") {
      return `
        <section class="show-stage-stack">
          <p class="show-info-label">Race Intro</p>
          <p class="show-round-title">Meet the horses</p>
          <div class="show-stage-horse-grid">
            ${state.curseRace.horses
              .map((horse) => {
                return `
                  <article class="show-stage-horse-card">
                    <p class="show-stage-horse-symbol">${escapeHtml(horse.symbol)}</p>
                    <p class="show-stage-horse-name">${escapeHtml(horse.name)}</p>
                    <p class="show-round-copy">${escapeHtml(horse.story)}</p>
                  </article>
                `;
              })
              .join("")}
          </div>
        </section>
      `;
    }

    if (liveStep === "bet-screen") {
      return `
        <section class="show-stage-stack">
          <p class="show-info-label">Bet Screen</p>
          <p class="show-round-title">Multi-bet board</p>
          <p class="show-round-copy">Team vs Team: set bets, then run one automatic race simulation.</p>
          <div class="show-vs-input-grid">
            <article class="show-stage-mini-card">
              <p class="show-info-label">${escapeHtml(state.teams.teamA.name)} total bet</p>
              <p class="show-info-value">${formatMoney(totalBetA)}</p>
              <p class="show-info-sub">Max: ${formatMoney(maxBetA)}</p>
            </article>
            <article class="show-stage-mini-card">
              <p class="show-info-label">${escapeHtml(state.teams.teamB.name)} total bet</p>
              <p class="show-info-value">${formatMoney(totalBetB)}</p>
              <p class="show-info-sub">Max: ${formatMoney(maxBetB)}</p>
            </article>
          </div>
          <div class="show-stage-race-bets">
            ${state.curseRace.horses
              .map((horse) => {
                const betA = normalizeOptionalBetAmount(roundState.bets?.teamA?.horseBets?.[horse.id]);
                const betB = normalizeOptionalBetAmount(roundState.bets?.teamB?.horseBets?.[horse.id]);
                return `
                  <article class="show-stage-race-bet-row">
                    <p class="show-stage-race-bet-horse">${escapeHtml(horse.symbol)} ${escapeHtml(horse.name)}</p>
                    <input class="text-input show-stage-money-input" type="number" min="0" step="10" max="${maxBetA}" value="${betA}" data-show-curse-bet data-team="teamA" data-horse-id="${
                      horse.id
                    }" ${raceRunning || roundState.winnerHorseId || roundState.payoutApplied ? "disabled" : ""}>
                    <input class="text-input show-stage-money-input" type="number" min="0" step="10" max="${maxBetB}" value="${betB}" data-show-curse-bet data-team="teamB" data-horse-id="${
                      horse.id
                    }" ${raceRunning || roundState.winnerHorseId || roundState.payoutApplied ? "disabled" : ""}>
                  </article>
                `;
              })
              .join("")}
          </div>
        </section>
      `;
    }

    if (liveStep === "race-screen") {
      return `
        <section class="show-stage-stack">
          <p class="show-info-label">Race Screen</p>
          <p class="show-round-title" data-show-curse-race-title>${
            winnerHorse
              ? `Winner detected: ${escapeHtml(winnerHorse.symbol)} ${escapeHtml(winnerHorse.name)}`
              : raceRunning
                ? "Race running live..."
                : "Race ready"
          }</p>
          <p class="show-round-copy" data-show-curse-race-leader>Leader: ${
            leader ? `${escapeHtml(leader.horse.symbol)} ${escapeHtml(leader.horse.name)} (${leader.position}/${trackLength})` : "No movement yet"
          }.</p>
          <p class="show-round-copy">Race is generated by card draw. Push-back applies automatically on lane collision.</p>
          <div class="show-stage-race-track-grid">
            ${state.curseRace.horses
              .map((horse) => {
                const position = Math.max(0, Math.round(sanitizeNumber(roundState.positions?.[horse.id], 0)));
                const progress = trackLength <= 0 ? 0 : Math.min(100, Math.round((Math.min(position, trackLength) / trackLength) * 100));
                const isWinner = roundState.winnerHorseId === horse.id ? "is-winner" : "";
                return `
                  <article class="show-stage-race-track-lane ${isWinner}" data-show-curse-lane="${horse.id}">
                    <div class="show-stage-race-track-head">
                      <p class="show-info-label">${escapeHtml(horse.symbol)} ${escapeHtml(horse.name)}</p>
                      <p class="show-info-sub" data-show-curse-pos>${position}/${trackLength}</p>
                    </div>
                    <div class="show-stage-race-track-bar">
                      <span data-show-curse-fill style="width:${progress}%"></span>
                      <strong class="show-stage-race-track-token" data-show-curse-token style="left:${progress}%">${escapeHtml(
                        horse.symbol
                      )}</strong>
                    </div>
                  </article>
                `;
              })
              .join("")}
          </div>
          <div class="show-stage-race-draw-log" data-show-curse-log>
            <p class="show-info-label">Draw Log</p>
            <div data-show-curse-log-body>${
              Array.isArray(roundState.cardHistory) && roundState.cardHistory.length > 0
                ? `<ul>${roundState.cardHistory.map((entry) => `<li>${escapeHtml(entry)}</li>`).join("")}</ul>`
                : '<p class="show-round-copy">No cards drawn yet. Press "Run Auto Race".</p>'
            }</div>
          </div>
        </section>
      `;
    }

    if (liveStep === "winner-screen") {
      return `
        <section class="show-stage-stack show-stage-result-card">
          <p class="show-info-label">Winner Screen</p>
          <p class="show-stage-result-headline">${
            winnerHorse ? `${escapeHtml(winnerHorse.symbol)} ${escapeHtml(winnerHorse.name)}` : "No winner yet"
          }</p>
          <p class="show-round-copy">${
            winnerHorse
              ? "Continue to payout to settle all horse bets."
              : "Continue race until one horse reaches the finish line."
          }</p>
        </section>
      `;
    }

    return `
      <section class="show-stage-stack show-stage-result-card">
        <p class="show-info-label">Payout Screen</p>
        <p class="show-stage-result-headline">${
          winnerHorse ? `${escapeHtml(winnerHorse.symbol)} ${escapeHtml(winnerHorse.name)}` : "No winner selected"
        }</p>
        <p class="show-round-copy">Only bets on winning horse pay x${state.curseRace.payoutMultiplier}. All other horse bets lose.</p>
        <div class="show-vs-input-grid">
          <article class="show-stage-mini-card">
            <p class="show-info-label">${escapeHtml(state.teams.teamA.name)} net</p>
            <p class="show-info-value">${settlement ? formatSignedMoney(settlement.netA) : formatSignedMoney(0)}</p>
          </article>
          <article class="show-stage-mini-card">
            <p class="show-info-label">${escapeHtml(state.teams.teamB.name)} net</p>
            <p class="show-info-value">${settlement ? formatSignedMoney(settlement.netB) : formatSignedMoney(0)}</p>
          </article>
        </div>
        <p class="show-round-copy">${escapeHtml(roundState.lastResult || "Apply payout to lock race result.")}</p>
      </section>
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
  const actions = [];

  if (gameId === "trivia") {
    const triviaRoundState = getOrCreateTriviaRoundState();
    const selectedCategory = state.trivia.categories.find((entry) => entry.id === triviaRoundState.selectedCategoryId);
    const isUsedCategory = selectedCategory && triviaRoundState.usedCategoryIds.includes(selectedCategory.id);
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

  if (gameId === "pretul-corect") {
    const roundState = getOrCreatePretulRoundState();
    const flowComplete = isGameFlowComplete(gameId);
    const hasSelectableTopic = Boolean(roundState.selectedItemId) && !getPretulUsedItemIdSet().has(roundState.selectedItemId);
    if (liveStep === "topic-select") {
      if (flowComplete) {
        actions.push({ tone: "primary-btn", action: "finish-game-return", label: "Finish Pretul Corect" });
      } else if (hasSelectableTopic) {
        actions.push({ tone: "primary-btn", action: "pretul-lock-topic", label: "Lock Category" });
      }
      actions.push({ tone: "secondary-btn", action: "pretul-reset-used", label: "Reset topics" });
    } else if (liveStep === "bet-screen") {
      actions.push({ tone: "primary-btn", action: "live-step-product-reveal", label: "Continue to Product" });
      actions.push({ tone: "secondary-btn", action: "live-step-topic-select", label: "Back to Topics" });
    } else if (["product-reveal", "answer-entry", "price-reveal"].includes(liveStep)) {
      if (!roundState.payoutApplied) {
        actions.push({ tone: "primary-btn", action: "pretul-evaluate", label: "Auto Winner + Payout" });
      }
      actions.push({ tone: "secondary-btn", action: "live-step-bet-screen", label: "Back to Bet" });
    } else if (liveStep === "auto-winner") {
      actions.push({
        tone: "primary-btn",
        action: flowComplete ? "finish-game-return" : "pretul-next-topic",
        label: flowComplete ? "Finish Pretul Corect" : "Next Topic"
      });
    }
    if (!["product-reveal", "answer-entry", "price-reveal", "auto-winner"].includes(liveStep)) {
      actions.push({ tone: "secondary-btn", action: "go-game-intro", label: "Lineup substitution" });
    }
    return renderFlowActionButtons(actions);
  }

  if (gameId === "film-joc-franciza-fun-fact") {
    const roundState = getOrCreateFilmRoundState();
    const flowComplete = isGameFlowComplete(gameId);
    const hasAvailableCategory = state.filmGame.items.some((entry) => !roundState.usedItemIds.includes(entry.id));
    if (liveStep === "topic-select") {
      if (flowComplete || !hasAvailableCategory) {
        actions.push({ tone: "primary-btn", action: "finish-game-return", label: "Finish Film/Joc" });
      } else {
        actions.push({ tone: "primary-btn", action: "live-step-bet-screen", label: "Lock Category" });
      }
      actions.push({ tone: "secondary-btn", action: "film-reset-used", label: "Reset categories" });
    } else if (liveStep === "bet-screen") {
      actions.push({ tone: "primary-btn", action: "live-step-card-reveal", label: "Open Round" });
      actions.push({ tone: "secondary-btn", action: "live-step-topic-select", label: "Back to Categories" });
    } else if (liveStep === "card-reveal") {
      if (!roundState.payoutApplied) {
        actions.push({ tone: "primary-btn", action: "film-apply", label: "Calculate Result" });
      }
      actions.push({ tone: "secondary-btn", action: "live-step-bet-screen", label: "Back to Bet" });
    } else if (liveStep === "breakdown-result") {
      actions.push({
        tone: "primary-btn",
        action: flowComplete ? "finish-game-return" : "film-next-round",
        label: flowComplete ? "Finish Film/Joc" : "Next Round"
      });
    }
    if (!["card-reveal", "breakdown-result"].includes(liveStep)) {
      actions.push({ tone: "secondary-btn", action: "go-game-intro", label: "Lineup substitution" });
    }
    return renderFlowActionButtons(actions);
  }

  if (gameId === "cel-mai-bun-samsar") {
    const roundState = getOrCreateSamsarRoundState(getSamsarRoundNumber());
    const roundSettled = Boolean(roundState.payoutApplied);
    const flowComplete = isGameFlowComplete(gameId);
    if (liveStep === "bet-screen") {
      actions.push({ tone: "primary-btn", action: "live-step-live-duel", label: "Start Live Duel" });
    } else if (liveStep === "live-duel") {
      actions.push({ tone: "primary-btn", action: "live-step-result-screen", label: "Go to Result" });
    } else if (liveStep === "result-screen") {
      if (!roundSettled) {
        actions.push({ tone: "primary-btn", action: "samsar-apply", label: "Apply Result" });
      }
      if (roundSettled) {
        actions.push({
          tone: "secondary-btn",
          action: flowComplete ? "finish-game-return" : "next-round",
          label: flowComplete ? "Finish Samsar" : "Next Round"
        });
      }
    }
    if (!["live-duel", "result-screen"].includes(liveStep)) {
      actions.push({ tone: "secondary-btn", action: "go-game-intro", label: "Lineup substitution" });
    }
    return renderFlowActionButtons(actions);
  }

  if (gameId === "guess-right-order" || gameId === "beer-pong") {
    const roundState = getOrCreateManualMatchRoundState(gameId, state.progress.currentRound);
    const roundSettled = Boolean(roundState.payoutApplied);
    const flowComplete = isGameFlowComplete(gameId);
    if (liveStep === "bet-screen") {
      actions.push({ tone: "primary-btn", action: "live-step-live-round", label: "Start Live Round" });
    } else if (liveStep === "live-round") {
      actions.push({ tone: "primary-btn", action: "live-step-result-screen", label: "Open Result" });
    } else if (liveStep === "result-screen") {
      if (!roundSettled) {
        actions.push({ tone: "primary-btn", action: "manual-apply", label: "Apply Result" });
      }
      if (roundSettled) {
        actions.push({
          tone: "secondary-btn",
          action: flowComplete ? "finish-game-return" : "next-round",
          label: flowComplete ? "Finish Game" : "Next Round"
        });
      }
    }
    if (!["live-round", "result-screen"].includes(liveStep)) {
      actions.push({ tone: "secondary-btn", action: "go-game-intro", label: "Lineup substitution" });
    }
    return renderFlowActionButtons(actions);
  }

  if (gameId === "shot-fake") {
    const roundState = getOrCreateManualMatchRoundState(gameId, state.progress.currentRound);
    const roundSettled = Boolean(roundState.payoutApplied);
    const flowComplete = isGameFlowComplete(gameId);
    if (liveStep === "sidebet-setup") {
      actions.push({ tone: "primary-btn", action: "live-step-live-round", label: "Start Live Round" });
    } else if (liveStep === "live-round") {
      actions.push({ tone: "primary-btn", action: "live-step-result-screen", label: "Open Settlement" });
    } else if (liveStep === "result-screen") {
      if (!roundSettled) {
        actions.push({ tone: "primary-btn", action: "manual-apply", label: "Apply Settlement" });
      }
      if (roundSettled) {
        actions.push({
          tone: "secondary-btn",
          action: flowComplete ? "finish-game-return" : "next-round",
          label: flowComplete ? "Finish Game" : "Next Round"
        });
      }
    }
    if (liveStep === "sidebet-setup") {
      actions.push({ tone: "secondary-btn", action: "go-game-intro", label: "Lineup substitution" });
    }
    return renderFlowActionButtons(actions);
  }

  if (gameId === "curse-de-cai") {
    const roundState = getOrCreateCurseRoundState(state.progress.currentRound);
    const raceSettled = Boolean(roundState.payoutApplied);
    const raceRunning = isCurseRaceRunning(getCurseRoundKey(state.progress.currentRound));
    const flowComplete = isGameFlowComplete(gameId);
    if (liveStep === "race-intro") {
      actions.push({ tone: "primary-btn", action: "live-step-bet-screen", label: "Go to Bets" });
    } else if (liveStep === "bet-screen") {
      actions.push({ tone: "primary-btn", action: "live-step-race-screen", label: "Start Race" });
    } else if (liveStep === "race-screen") {
      if (!roundState.winnerHorseId) {
        actions.push({
          tone: raceRunning ? "secondary-btn" : "primary-btn",
          action: "curse-move",
          label: raceRunning ? "Race Running..." : "Run Auto Race",
          disabled: raceRunning
        });
      } else {
        actions.push({ tone: "secondary-btn", action: "live-step-winner-screen", label: "Open Winner" });
      }
      actions.push({ tone: "secondary-btn", action: "curse-reset", label: raceRunning ? "Stop & Reset Race" : "Reset Race" });
    } else if (liveStep === "winner-screen") {
      actions.push({ tone: "primary-btn", action: "live-step-payout-screen", label: "Continue to Payout" });
      actions.push({ tone: "secondary-btn", action: "live-step-race-screen", label: "Back to Race" });
    } else if (liveStep === "payout-screen") {
      if (!raceSettled && !raceRunning) {
        actions.push({ tone: "primary-btn", action: "curse-apply", label: "Apply Payout" });
      }
      if (raceRunning) {
        actions.push({ tone: "secondary-btn", action: "curse-move", label: "Race Running...", disabled: true });
      }
      if (raceSettled) {
        actions.push({
          tone: "secondary-btn",
          action: flowComplete ? "finish-game-return" : "next-round",
          label: flowComplete ? "Finish Game" : "Next Race"
        });
      }
    }
    return renderFlowActionButtons(actions);
  }

  const flowStates = getGameFlowStates(gameId);
  const firstStateId = flowStates[0]?.id;
  const lastStateId = flowStates[flowStates.length - 1]?.id;
  if (liveStep === firstStateId) {
    actions.push({ tone: "primary-btn", action: "live-step-next", label: "Start Round" });
  } else if (liveStep !== lastStateId) {
    actions.push({ tone: "primary-btn", action: "live-step-next", label: "Next Step" });
  } else {
    actions.push({ tone: "primary-btn", action: "next-round", label: "Next Round" });
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
    <section class="show-live-screen show-shared-game-stage" data-game-stage="${escapeHtml(gameId)}" data-live-step="${escapeHtml(
      liveStep
    )}">
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
      <div class="show-overlay-grid two-col">
        <article class="show-control-card">
          <h3>${escapeHtml(state.teams.teamA.name)} Name</h3>
          <input class="text-input" type="text" maxlength="40" value="${escapeHtml(state.teams.teamA.name)}" data-show-team-name data-team="teamA">
        </article>
        <article class="show-control-card">
          <h3>${escapeHtml(state.teams.teamB.name)} Name</h3>
          <input class="text-input" type="text" maxlength="40" value="${escapeHtml(state.teams.teamB.name)}" data-show-team-name data-team="teamB">
        </article>
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
        <p class="show-round-copy">Use this screen to rename teams, add/remove players, edit player names, or mark players unavailable.</p>
        <p class="show-round-copy">Lineup assignment for each game stays in Game Intro.</p>
      </div>
      <div class="show-overlay-grid two-col">
        <article class="show-control-card">
          <h3>${escapeHtml(state.teams.teamA.name)} team name</h3>
          <input
            class="text-input"
            type="text"
            maxlength="40"
            value="${escapeHtml(state.teams.teamA.name)}"
            data-show-team-name
            data-team="teamA"
          >
        </article>
        <article class="show-control-card">
          <h3>${escapeHtml(state.teams.teamB.name)} team name</h3>
          <input
            class="text-input"
            type="text"
            maxlength="40"
            value="${escapeHtml(state.teams.teamB.name)}"
            data-show-team-name
            data-team="teamB"
          >
        </article>
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

  if (elements.showShell) {
    elements.showShell.classList.toggle("is-live-round-focus", isLiveRoundFocus);
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

function setTeamNameFromOverlay(teamKey, rawName) {
  if (!["teamA", "teamB"].includes(teamKey)) {
    return;
  }
  const fallback = teamKey === "teamA" ? DEFAULT_STATE.teams.teamA.name : DEFAULT_STATE.teams.teamB.name;
  const nextName = sanitizeString(rawName, fallback).trim().slice(0, 40) || fallback;
  if (state.teams[teamKey].name === nextName) {
    return;
  }
  state.teams[teamKey].name = nextName;
  renderAll();
  setLastResultSummary(`Team name updated: ${nextName}.`);
  saveState(`Team name updated for ${teamKey}.`);
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
  if (state.pretul.items.some((item) => item.id === selectedItemId) && !getPretulUsedItemIdSet().has(selectedItemId)) {
    roundState.selectedItemId = selectedItemId;
  }
  roundState.answerTeamA = Math.max(0, readNumber("[data-show-pretul-answer-teama]", roundState.answerTeamA));
  roundState.answerTeamB = Math.max(0, readNumber("[data-show-pretul-answer-teamb]", roundState.answerTeamB));
  roundState.betTeamA = Math.max(0, readBet("[data-show-pretul-bet-teama]", roundState.betTeamA));
  roundState.betTeamB = Math.max(0, readBet("[data-show-pretul-bet-teamb]", roundState.betTeamB));
  const selectedItem = state.pretul.items.find((item) => item.id === roundState.selectedItemId);
  roundState.realPrice = getPretulItemActualPrice(selectedItem);

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
  const root = elements.showScreenContent;
  const readValue = (selector, fallback) => {
    if (!root) {
      return fallback;
    }
    const node = root.querySelector(selector);
    return node?.value ?? fallback;
  };
  const maxBetA = getMaxBetAmount(state.teams.teamA.money, "cel-mai-bun-samsar");
  const maxBetB = getMaxBetAmount(state.teams.teamB.money, "cel-mai-bun-samsar");
  roundState.scoreTeamA = Math.max(0, Math.round(sanitizeNumber(readValue("[data-show-samsar-score-teama]", roundState.scoreTeamA), roundState.scoreTeamA)));
  roundState.scoreTeamB = Math.max(0, Math.round(sanitizeNumber(readValue("[data-show-samsar-score-teamb]", roundState.scoreTeamB), roundState.scoreTeamB)));
  roundState.betTeamA =
    maxBetA <= 0 ? 0 : Math.min(normalizeBetAmount(readValue("[data-show-samsar-bet-teama]", roundState.betTeamA)), maxBetA);
  roundState.betTeamB =
    maxBetB <= 0 ? 0 : Math.min(normalizeBetAmount(readValue("[data-show-samsar-bet-teamb]", roundState.betTeamB)), maxBetB);
  if (elements.samsarScoreTeamAInput) {
    elements.samsarScoreTeamAInput.value = String(roundState.scoreTeamA);
  }
  if (elements.samsarScoreTeamBInput) {
    elements.samsarScoreTeamBInput.value = String(roundState.scoreTeamB);
  }
  if (elements.samsarBetTeamAInput) {
    elements.samsarBetTeamAInput.value = String(roundState.betTeamA);
  }
  if (elements.samsarBetTeamBInput) {
    elements.samsarBetTeamBInput.value = String(roundState.betTeamB);
  }
}

function syncManualOverlayIntoHostInputs() {
  const gameId = getCurrentManualMatchGame();
  const roundState = getOrCreateManualMatchRoundState(gameId, state.progress.currentRound);
  if (gameId === "shot-fake") {
    const roles = getShotFakeRoundRoles(state.progress.currentRound);
    if (roles.shooterTeamKey === "teamA") {
      roundState.betTeamA = 0;
    } else {
      roundState.betTeamB = 0;
    }
  }
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
    const settlement = calculateManualMatchSettlement(gameId, roundState);
    const roles = getShotFakeRoundRoles(state.progress.currentRound);
    const detectorMultiplier =
      roles.detectorTeamKey === "teamA" ? settlement.shotFakeBetMultiplierTeamA : settlement.shotFakeBetMultiplierTeamB;
    elements.shotFakeMultiplierInput.value = String(detectorMultiplier);
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
  const answerLockRequiredActions = new Set(["trivia-correct", "trivia-wrong"]);

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
  if (action === "pretul-lock-topic") {
    lockPretulSelectedTopic();
    return;
  }
  if (action === "pretul-next-topic") {
    if (isGameFlowComplete("pretul-corect")) {
      finishCurrentGameAndReturn();
      return;
    }
    setCurrentRound(state.progress.currentRound + 1);
    setLiveRoundStep("topic-select", { persist: false });
    setShowScreen("live-round", { persist: false });
    saveState("Pretul corect next topic.");
    return;
  }
  if (action === "film-next-round") {
    if (isGameFlowComplete("film-joc-franciza-fun-fact")) {
      finishCurrentGameAndReturn();
      return;
    }
    setCurrentRound(state.progress.currentRound + 1);
    setShowScreen("live-round", { persist: false });
    saveState("Film/Joc next round.");
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
  if (answerLockRequiredActions.has(action) && !isOverlayAnswerLocked()) {
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
    const applied = applyTriviaRoundResult(true, { selectedOptionIndex: triviaRoundState.selectedOptionIndex });
    if (!applied) {
      return;
    }
    setOverlayAnswerLocked(false, { persist: false });
    setLiveRoundStep("result-screen", { persist: false });
    setShowScreen("live-round", { persist: false });
    return;
  }
  if (action === "trivia-wrong") {
    const triviaRoundState = getOrCreateTriviaRoundState();
    const applied = applyTriviaRoundResult(false, { selectedOptionIndex: triviaRoundState.selectedOptionIndex });
    if (!applied) {
      return;
    }
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
    const applied = applyPretulRoundResult();
    if (!applied) {
      return;
    }
    setOverlayAnswerLocked(false, { persist: false });
    setLiveRoundStep("auto-winner", { persist: false });
    setShowScreen("live-round", { persist: false });
    return;
  }
  if (action === "pretul-reset-used") {
    resetPretulUsedItems();
    return;
  }
  if (action === "film-apply") {
    const applied = applyFilmRoundResult();
    if (!applied) {
      return;
    }
    setOverlayAnswerLocked(false, { persist: false });
    setLiveRoundStep("breakdown-result", { persist: false });
    setShowScreen("live-round", { persist: false });
    return;
  }
  if (action === "film-reset-used") {
    resetFilmUsedItems();
    return;
  }
  if (action === "samsar-apply") {
    syncSamsarOverlayIntoHostInputs();
    const applied = applySamsarRoundResult();
    if (!applied) {
      return;
    }
    setOverlayAnswerLocked(false, { persist: false });
    setLiveRoundStep("result-screen", { persist: false });
    setShowScreen("live-round", { persist: false });
    return;
  }
  if (action === "manual-apply") {
    syncManualOverlayIntoHostInputs();
    const applied = applyManualMatchRoundResult();
    if (!applied) {
      return;
    }
    setOverlayAnswerLocked(false, { persist: false });
    const currentManualGame = getCurrentManualMatchGame();
    if (currentManualGame === "guess-right-order") {
      if (isGameFlowComplete(currentManualGame)) {
        finishCurrentGameAndReturn();
        return;
      }
      setCurrentRound(state.progress.currentRound + 1);
      setLiveRoundStep("bet-screen", { persist: false });
      setShowScreen("live-round", { persist: false });
      saveState("Guess the Right Order auto-advanced to next round.");
      return;
    }
    setLiveRoundStep("result-screen", { persist: false });
    setShowScreen("live-round", { persist: false });
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
    const runningKey = getCurseRoundKey(state.progress.currentRound);
    if (isCurseRaceRunning(runningKey)) {
      setLastResultSummary("Race already running...");
      renderShowUi();
      saveState("Curse auto-run blocked: already running.");
      return;
    }
    const started = moveCurseHorseBySymbol();
    if (started) {
      setLiveRoundStep("race-screen", { persist: false });
      setShowScreen("live-round", { persist: false });
    }
    return;
  }
  if (action === "curse-apply") {
    if (isCurseRaceRunning(getCurseRoundKey(state.progress.currentRound))) {
      setLastResultSummary("Race still running. Apply payout after winner is locked.");
      renderShowUi();
      saveState("Curse payout blocked: race running.");
      return;
    }
    const applied = applyCurseRacePayout();
    if (!applied) {
      return;
    }
    setOverlayAnswerLocked(false, { persist: false });
    setLiveRoundStep("payout-screen", { persist: false });
    setShowScreen("live-round", { persist: false });
    return;
  }
  if (action === "curse-reset") {
    resetCurseRace();
    setLiveRoundStep("race-screen", { persist: false });
    setShowScreen("live-round", { persist: false });
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
  if (target.matches("[data-show-team-name]")) {
    const teamKey = target.getAttribute("data-team");
    setTeamNameFromOverlay(teamKey, target.value);
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
    state.trivia.fixedBonus = getStandardFixedBonus("trivia");
    if (elements.triviaFixedBonusInput) {
      elements.triviaFixedBonusInput.value = String(state.trivia.fixedBonus);
      elements.triviaFixedBonusInput.disabled = true;
    }
    setLastResultSummary(`Trivia fixed bonus is locked at ${formatMoney(state.trivia.fixedBonus)}.`);
    renderTriviaControls();
    saveState("Trivia fixed bonus remains locked.");
    return;
  }
  if (target.matches("[data-show-pretul-item]")) {
    setPretulSelectedItem(target.value);
    return;
  }
  if (target.matches("[data-show-pretul-chooser-team]")) {
    setPretulChooserTeam(target.value);
    return;
  }
  if (
    target.matches("[data-show-pretul-answer-teama]") ||
    target.matches("[data-show-pretul-answer-teamb]") ||
    target.matches("[data-show-pretul-bet-teama]") ||
    target.matches("[data-show-pretul-bet-teamb]")
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
  if (target.matches("[data-show-film-bet-team]")) {
    const teamKey = target.getAttribute("data-team");
    setFilmTeamBet(teamKey, target.value);
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
  if (target.matches("[data-show-samsar-bet-teama]")) {
    setSamsarBet("teamA", target.value);
    return;
  }
  if (target.matches("[data-show-samsar-bet-teamb]")) {
    setSamsarBet("teamB", target.value);
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

  const pretulTopicButton = event.target.closest("[data-show-pretul-item]");
  if (pretulTopicButton) {
    const itemId = pretulTopicButton.getAttribute("data-show-pretul-item");
    if (itemId) {
      setPretulSelectedItem(itemId);
    }
    return;
  }

  const filmTopicButton = event.target.closest("[data-show-film-topic]");
  if (filmTopicButton) {
    const itemId = filmTopicButton.getAttribute("data-show-film-topic");
    if (itemId) {
      setFilmSelectedItem(itemId);
    }
    return;
  }

  const filmBetPresetButton = event.target.closest("button[data-show-film-bet]");
  if (filmBetPresetButton) {
    const betValue = filmBetPresetButton.getAttribute("data-show-film-bet");
    if (betValue) {
      setFilmBetAmount(betValue);
    }
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
    const parts = value.split(":");
    let teamKey = null;
    let componentKey = "";
    let outcome = "";
    if (parts.length === 3 && ["teamA", "teamB"].includes(parts[0])) {
      [teamKey, componentKey, outcome] = parts;
    } else {
      [componentKey, outcome] = parts;
    }
    if (!FILM_COMPONENT_KEYS.includes(componentKey)) {
      return;
    }
    setFilmComponentOutcome(componentKey, outcome === "correct" ? "correct" : "wrong", teamKey);
    return;
  }

  const manualWinnerButton = event.target.closest("[data-show-manual-winner]");
  if (manualWinnerButton) {
    const winner = manualWinnerButton.getAttribute("data-show-manual-winner");
    const gameId = getCurrentManualMatchGame();
    const roundState = getOrCreateManualMatchRoundState(gameId, state.progress.currentRound);
    if (winner === "teamA" || winner === "teamB" || winner === "draw") {
      if (!isScorelessManualMatchGame(gameId)) {
        if (winner === "teamA") {
          const nextScore = Math.max(1, roundState.scoreTeamB + 1);
          setManualRoundScore("teamA", nextScore);
          setManualRoundScore("teamB", roundState.scoreTeamB);
        } else if (winner === "teamB") {
          const nextScore = Math.max(1, roundState.scoreTeamA + 1);
          setManualRoundScore("teamA", roundState.scoreTeamA);
          setManualRoundScore("teamB", nextScore);
        } else {
          const drawScore = Math.max(roundState.scoreTeamA, roundState.scoreTeamB);
          setManualRoundScore("teamA", drawScore);
          setManualRoundScore("teamB", drawScore);
        }
      }
      setManualRoundWinner(winner);
    }
    renderShowUi();
    return;
  }

  const participantToggleButton = event.target.closest("[data-show-participant-toggle]");
  if (participantToggleButton) {
    const contextKey = participantToggleButton.getAttribute("data-context");
    const teamKey = participantToggleButton.getAttribute("data-team");
    const playerId = participantToggleButton.getAttribute("data-player-id");
    if (contextKey === "manual") {
      toggleManualRoundParticipant(teamKey, playerId);
    } else if (contextKey === "pretul-corect") {
      togglePretulRoundParticipant(teamKey, playerId);
    } else if (contextKey === "film-joc-franciza-fun-fact") {
      toggleFilmRoundParticipant(teamKey, playerId);
    } else if (contextKey === "curse-de-cai") {
      toggleCurseRoundParticipant(teamKey, playerId);
    }
    return;
  }

  const participantAllButton = event.target.closest("[data-show-participant-all]");
  if (participantAllButton) {
    const contextKey = participantAllButton.getAttribute("data-context");
    const teamKey = participantAllButton.getAttribute("data-team");
    if (contextKey === "manual") {
      selectAllManualParticipants(teamKey);
    } else if (contextKey === "pretul-corect") {
      selectAllPretulParticipants(teamKey);
    } else if (contextKey === "film-joc-franciza-fun-fact") {
      selectAllFilmParticipants(teamKey);
    } else if (contextKey === "curse-de-cai") {
      selectAllCurseParticipants(teamKey);
    }
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

  elements.settingsBetCapsLine.textContent = `Bet caps: ${betCapsSummary} (all rounded to ${BET_ROUNDING_STEP}).`;
  elements.settingsBonusesLine.textContent =
    `Fixed bonuses: Trivia +${formatMoney(getStandardFixedBonus("trivia"))}, Guess the Right Order +${formatMoney(
      getStandardFixedBonus("guess-right-order")
    )}, Pretul corect +${formatMoney(getStandardFixedBonus("pretul-corect"))}, Shot Fake +${formatMoney(
      getStandardFixedBonus("shot-fake")
    )}, Cel mai bun samsar +${formatMoney(
      getStandardFixedBonus("cel-mai-bun-samsar")
    )}, Beer Pong +${formatMoney(getStandardFixedBonus("beer-pong"))}. ` +
    "Curse de cai remains bet-only (no fixed bonus).";
  elements.settingsTriviaRuleLine.textContent =
    "Trivia de grup: one-team-per-round with automatic turn switch. Active team picks a multiple-choice topic, places bet, answers, and result is auto-checked.";
  elements.settingsPretulRuleLine.textContent =
    "Pretul corect: both teams submit answer + bet, and winner is auto-detected by closest value to real price; equal distance is tie.";
  elements.settingsFilmRuleLine.textContent =
    "Film/Joc/Franciza/Fun Fact: one-team-per-round with automatic team turn switch, category pick each round, component weights 1/1/3, and active-team bet applies at minimum 2/3 correct.";
  elements.settingsSamsarRuleLine.textContent =
    "Cel mai bun samsar: 6 rounds cu persona/cerinte editabile, no link fields, one duelist per team, higher score wins, equal score draw, payout standard + fixed bonus.";
  elements.settingsShotFakeRuleLine.textContent =
    "Shot Fake: one shot team (no bet) vs one detector team (bet), discover success pays fixed bonus + detector bet x active opponents, no-discover gives only fixed bonus to shot team; side bets/manual adjust supported.";
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

  const bonus = getStandardFixedBonus("trivia");
  state.trivia.fixedBonus = bonus;
  elements.triviaFixedBonusInput.value = String(bonus);
  elements.triviaFixedBonusInput.disabled = true;
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
          <p><strong>Q:</strong> ${escapeHtml(getTriviaCategoryQuestion(category))}</p>
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
  const usedItemIds = getPretulUsedItemIdSet();
  const keepUsedSelection =
    state.progress.currentGame === "pretul-corect" && getLiveRoundStep("pretul-corect") !== "topic-select";

  roundState.usedItemIds = Array.from(usedItemIds).filter((id) => itemIdSet.has(id));
  if (
    !itemIdSet.has(roundState.selectedItemId) ||
    (usedItemIds.has(roundState.selectedItemId) && !keepUsedSelection)
  ) {
    const firstAvailable = state.pretul.items.find((item) => !usedItemIds.has(item.id));
    roundState.selectedItemId = firstAvailable?.id || "";
  }

  roundState.betTeamA = maxBetA <= 0 ? 0 : Math.min(normalizeBetAmount(roundState.betTeamA), maxBetA);
  roundState.betTeamB = maxBetB <= 0 ? 0 : Math.min(normalizeBetAmount(roundState.betTeamB), maxBetB);
  roundState.chooserTeamKey = ["teamA", "teamB"].includes(roundState.chooserTeamKey) ? roundState.chooserTeamKey : "teamA";
  roundState.participantsTeamA = sanitizeRoundParticipantIds(roundState.participantsTeamA, "teamA");
  roundState.participantsTeamB = sanitizeRoundParticipantIds(roundState.participantsTeamB, "teamB");
  if (roundState.participantsTeamA.length === 0) {
    roundState.participantsTeamA = getAvailablePlayersForTeam("teamA").map((player) => player.id);
  }
  if (roundState.participantsTeamB.length === 0) {
    roundState.participantsTeamB = getAvailablePlayersForTeam("teamB").map((player) => player.id);
  }
  roundState.answerTeamA = Math.max(0, Math.round(sanitizeNumber(roundState.answerTeamA, 0)));
  roundState.answerTeamB = Math.max(0, Math.round(sanitizeNumber(roundState.answerTeamB, 0)));
  const selectedItem = state.pretul.items.find((item) => item.id === roundState.selectedItemId);
  roundState.realPrice = getPretulItemActualPrice(selectedItem);

  elements.pretulItemSelect.innerHTML = state.pretul.items
    .map((item) => {
      const isUsed = usedItemIds.has(item.id);
      const isSelected = item.id === roundState.selectedItemId ? "selected" : "";
      const disabled = isUsed ? "disabled" : "";
      return `
        <option value="${item.id}" ${isSelected} ${disabled}>
          ${escapeHtml(item.categoryTitle || item.name)}${isUsed ? " (USED)" : ""}
        </option>
      `;
    })
    .join("");

  elements.pretulAnswerTeamAInput.value = String(roundState.answerTeamA);
  elements.pretulAnswerTeamBInput.value = String(roundState.answerTeamB);
  elements.pretulBetTeamAInput.value = String(roundState.betTeamA);
  elements.pretulBetTeamBInput.value = String(roundState.betTeamB);
  elements.pretulRealPriceInput.value = "";
  elements.pretulRealPriceInput.disabled = true;
  elements.pretulRoundResult.textContent =
    roundState.lastResult || "Rezultatul rundei va aparea aici.";
  elements.pretulRuleInfo.textContent =
    `Auto winner = closest answer to hidden item real price. Tie when distances are equal. ` +
    `Winner payout: +${formatMoney(getStandardFixedBonus("pretul-corect"))} bonus + bet win. ` +
    `Bet cap is 15%, rounded to ${BET_ROUNDING_STEP}. ` +
    `${teamA.name} max now: ${formatMoney(maxBetA)} | ${teamB.name} max now: ${formatMoney(maxBetB)}.`;

  renderPretulActiveList("teamA", elements.pretulActiveTeamAList);
  renderPretulActiveList("teamB", elements.pretulActiveTeamBList);

  elements.pretulItemsBoard.innerHTML = state.pretul.items
    .map((item) => {
      const isUsed = usedItemIds.has(item.id);
      return `
        <article class="pretul-item-card ${isUsed ? "is-used" : ""}">
          <h4>${escapeHtml(getPretulItemCategory(item))}</h4>
          <p class="muted"><strong>${isUsed ? "USED" : "READY"}</strong></p>
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
  if (getPretulUsedItemIdSet().has(itemId)) {
    return;
  }

  roundState.selectedItemId = itemId;
  roundState.payoutApplied = false;
  roundState.lastResult = "";
  const selectedItem = state.pretul.items.find((item) => item.id === itemId);
  if (selectedItem) {
    roundState.realPrice = getPretulItemActualPrice(selectedItem);
  }

  renderPretulControls();
  saveState("Pretul item selected.");
}

function lockPretulSelectedTopic() {
  if (state.progress.currentGame !== "pretul-corect") {
    switchRoundContext("pretul-corect", state.progress.currentRound, { navigateToSection: false });
  }
  const roundState = getOrCreatePretulRoundState();
  const selectedItem = state.pretul.items.find((item) => item.id === roundState.selectedItemId);
  if (!selectedItem) {
    setLastResultSummary("Select a category card before locking the round.");
    renderPretulControls();
    saveState("Pretul lock topic blocked: no selected category.");
    return false;
  }
  const usedItems = getPretulUsedItemIdSet();
  if (usedItems.has(selectedItem.id)) {
    setLastResultSummary("Selected category is already used. Pick another card.");
    renderPretulControls();
    saveState("Pretul lock topic blocked: category already used.");
    return false;
  }
  roundState.usedItemIds = Array.from(usedItems);
  roundState.usedItemIds.push(selectedItem.id);
  roundState.usedItemIds = Array.from(new Set(roundState.usedItemIds));
  roundState.realPrice = getPretulItemActualPrice(selectedItem);
  roundState.payoutApplied = false;
  roundState.lastResult = "";
  setLiveRoundStep("bet-screen", { persist: false });
  setShowScreen("live-round", { persist: false });
  saveState(`Pretul category locked: ${getPretulItemCategory(selectedItem)}.`);
  return true;
}

function setPretulChooserTeam(teamKey) {
  if (!["teamA", "teamB"].includes(teamKey)) {
    return;
  }
  const roundState = getOrCreatePretulRoundState();
  roundState.chooserTeamKey = teamKey;
  roundState.payoutApplied = false;
  roundState.lastResult = "";
  renderPretulControls();
  saveState("Pretul chooser team updated.");
}

function setPretulRoundParticipantSelection(teamKey, playerIds) {
  if (!["teamA", "teamB"].includes(teamKey)) {
    return;
  }
  const roundState = getOrCreatePretulRoundState();
  const key = teamKey === "teamA" ? "participantsTeamA" : "participantsTeamB";
  roundState[key] = sanitizeRoundParticipantIds(playerIds, teamKey);
  roundState.payoutApplied = false;
  roundState.lastResult = "";
  renderShowUi();
}

function togglePretulRoundParticipant(teamKey, playerId) {
  if (!["teamA", "teamB"].includes(teamKey)) {
    return;
  }
  const roundState = getOrCreatePretulRoundState();
  const key = teamKey === "teamA" ? "participantsTeamA" : "participantsTeamB";
  const current = new Set(sanitizeRoundParticipantIds(roundState[key], teamKey));
  if (current.has(playerId)) {
    current.delete(playerId);
  } else {
    current.add(playerId);
  }
  setPretulRoundParticipantSelection(teamKey, Array.from(current));
  saveState("Pretul participants updated.");
}

function selectAllPretulParticipants(teamKey) {
  if (!["teamA", "teamB"].includes(teamKey)) {
    return;
  }
  const allIds = getAvailablePlayersForTeam(teamKey).map((player) => player.id);
  setPretulRoundParticipantSelection(teamKey, allIds);
  saveState("Pretul participants set to all available players.");
}

function updatePretulRoundInputs(roundStateInput = null) {
  const roundState = roundStateInput || getOrCreatePretulRoundState();
  const teamA = state.teams.teamA;
  const teamB = state.teams.teamB;
  const maxBetA = getMaxBetAmount(teamA.money, "pretul-corect");
  const maxBetB = getMaxBetAmount(teamB.money, "pretul-corect");

  roundState.answerTeamA = Math.max(0, Math.round(sanitizeNumber(elements.pretulAnswerTeamAInput.value, roundState.answerTeamA)));
  roundState.answerTeamB = Math.max(0, Math.round(sanitizeNumber(elements.pretulAnswerTeamBInput.value, roundState.answerTeamB)));
  roundState.betTeamA = maxBetA <= 0 ? 0 : Math.min(normalizeBetAmount(elements.pretulBetTeamAInput.value), maxBetA);
  roundState.betTeamB = maxBetB <= 0 ? 0 : Math.min(normalizeBetAmount(elements.pretulBetTeamBInput.value), maxBetB);
  const selectedItem = state.pretul.items.find((item) => item.id === roundState.selectedItemId);
  roundState.realPrice = getPretulItemActualPrice(selectedItem);
  roundState.payoutApplied = false;
  roundState.lastResult = "";
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
  roundState.payoutApplied = false;
  roundState.lastResult = "";
  renderPretulControls();
  saveState("Pretul item marked used.");
}

function resetPretulUsedItems() {
  const roundState = getOrCreatePretulRoundState();
  for (const roundKey of Object.keys(state.pretul.rounds || {})) {
    const safeRound = sanitizePretulRoundState(state.pretul.rounds[roundKey]);
    safeRound.usedItemIds = [];
    if (safeRound.payoutApplied) {
      safeRound.payoutApplied = false;
    }
    state.pretul.rounds[roundKey] = safeRound;
  }
  roundState.usedItemIds = [];
  roundState.selectedItemId = state.pretul.items[0]?.id || "";
  roundState.chooserTeamKey = "teamA";
  roundState.participantsTeamA = getAvailablePlayersForTeam("teamA").map((player) => player.id);
  roundState.participantsTeamB = getAvailablePlayersForTeam("teamB").map((player) => player.id);
  roundState.payoutApplied = false;
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
  updatePretulRoundInputs(roundState);
  if (roundState.payoutApplied) {
    setLastResultSummary("Pretul result already applied for this round.");
    renderPretulControls();
    saveState("Pretul apply blocked: payout already applied.");
    return false;
  }

  const selectedItemId = roundState.selectedItemId;
  if (!selectedItemId) {
    roundState.lastResult = "No available item left. Reset used items or add new round items.";
    renderPretulControls();
    setLastResultSummary(roundState.lastResult);
    saveState("Pretul evaluate blocked: no item.");
    return false;
  }

  const item = state.pretul.items.find((entry) => entry.id === selectedItemId);
  const answerA = roundState.answerTeamA;
  const answerB = roundState.answerTeamB;
  const realPrice = getPretulItemActualPrice(item);
  roundState.realPrice = realPrice;
  const distanceA = Math.abs(answerA - realPrice);
  const distanceB = Math.abs(answerB - realPrice);
  const maxBetA = getMaxBetAmount(state.teams.teamA.money, "pretul-corect");
  const maxBetB = getMaxBetAmount(state.teams.teamB.money, "pretul-corect");
  const fixedBonus = getStandardFixedBonus("pretul-corect");
  const betA = Math.min(roundState.betTeamA, maxBetA);
  const betB = Math.min(roundState.betTeamB, maxBetB);

  roundState.betTeamA = betA;
  roundState.betTeamB = betB;

  const itemLabel = getPretulItemTitle(item);
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
    state.teams.teamA.money += fixedBonus + betA;
    state.teams.teamB.money = Math.max(0, state.teams.teamB.money - betB);
    winnerTeam = "teamA";
    deltaA = fixedBonus + betA;
    deltaB = -betB;
    resultText =
      `${state.teams.teamA.name} wins ${itemLabel}: distance ${formatMoney(distanceA)} vs ${formatMoney(distanceB)}. ` +
      `${state.teams.teamA.name} +${formatMoney(fixedBonus)} bonus +${formatMoney(betA)} bet, ` +
      `${state.teams.teamB.name} -${formatMoney(betB)}.`;
  } else {
    state.teams.teamB.money += fixedBonus + betB;
    state.teams.teamA.money = Math.max(0, state.teams.teamA.money - betA);
    winnerTeam = "teamB";
    deltaA = -betA;
    deltaB = fixedBonus + betB;
    resultText =
      `${state.teams.teamB.name} wins ${itemLabel}: distance ${formatMoney(distanceB)} vs ${formatMoney(distanceA)}. ` +
      `${state.teams.teamB.name} +${formatMoney(fixedBonus)} bonus +${formatMoney(betB)} bet, ` +
      `${state.teams.teamA.name} -${formatMoney(betA)}.`;
  }

  const teamAOutcome = getOutcomeForTeamFromWinner(winnerTeam, "teamA");
  const teamBOutcome = getOutcomeForTeamFromWinner(winnerTeam, "teamB");
  const teamABetOutcome = betA > 0 ? teamAOutcome : "draw";
  const teamBBetOutcome = betB > 0 ? teamBOutcome : "draw";
  const selectedParticipantsA = getSelectedParticipantsForTeam("teamA", roundState.participantsTeamA);
  const selectedParticipantsB = getSelectedParticipantsForTeam("teamB", roundState.participantsTeamB);
  applyRoundPlayerStats({
    gameId: "pretul-corect",
    teamA: {
      participants: selectedParticipantsA,
      roundOutcome: teamAOutcome,
      teamNetDelta: deltaA,
      teamBetAmount: betA,
      betOutcome: teamABetOutcome
    },
    teamB: {
      participants: selectedParticipantsB,
      roundOutcome: teamBOutcome,
      teamNetDelta: deltaB,
      teamBetAmount: betB,
      betOutcome: teamBBetOutcome
    }
  });

  if (!roundState.usedItemIds.includes(selectedItemId)) {
    roundState.usedItemIds.push(selectedItemId);
  }
  const usedItemIds = getPretulUsedItemIdSet();
  usedItemIds.add(selectedItemId);
  roundState.usedItemIds = Array.from(usedItemIds);
  roundState.payoutApplied = true;
  roundState.lastResult = resultText;

  saveCurrentRoundSnapshot();
  setLastResultSummary(resultText);
  renderProgress();
  renderTeams();
  renderBettingInfo();
  renderRoundSelection();
  renderPretulControls();
  saveState("Pretul round evaluated.");
  return true;
}

function getFilmRoundBreakdown(roundState, betAmount, teamKey = roundState?.teamKey || "teamA") {
  const sourceOutcomes =
    roundState?.outcomesByTeam?.[teamKey] && typeof roundState.outcomesByTeam[teamKey] === "object"
      ? roundState.outcomesByTeam[teamKey]
      : roundState?.outcomes || {};
  const points = {
    character: sourceOutcomes.character === "correct" ? FILM_COMPONENT_WEIGHTS.character : 0,
    franchise: sourceOutcomes.franchise === "correct" ? FILM_COMPONENT_WEIGHTS.franchise : 0,
    funFact: sourceOutcomes.funFact === "correct" ? FILM_COMPONENT_WEIGHTS.funFact : 0
  };
  const totalPoints = points.character + points.franchise + points.funFact;
  const maxPoints = FILM_COMPONENT_WEIGHTS.character + FILM_COMPONENT_WEIGHTS.franchise + FILM_COMPONENT_WEIGHTS.funFact;
  const correctCount = FILM_COMPONENT_KEYS.reduce((count, key) => {
    return count + (sourceOutcomes[key] === "correct" ? 1 : 0);
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
  const globalUsed = getFilmUsedItemIdSet();
  roundState.usedItemIds = Array.from(globalUsed).filter((id) => itemIdSet.has(id));

  if (!itemIdSet.has(roundState.selectedItemId) || roundState.usedItemIds.includes(roundState.selectedItemId)) {
    const firstAvailable = state.filmGame.items.find((item) => !roundState.usedItemIds.includes(item.id));
    roundState.selectedItemId = firstAvailable?.id || "";
  }

  const playingTeamKey = getFilmTeamForRound(state.progress.currentRound);
  roundState.teamKey = playingTeamKey;
  const playingTeam = state.teams[playingTeamKey];
  const maxBet = getMaxBetAmount(playingTeam.money, "film-joc-franciza-fun-fact");
  if (playingTeamKey === "teamA") {
    roundState.betTeamA = maxBet <= 0 ? 0 : Math.min(normalizeBetAmount(roundState.betTeamA), maxBet);
    roundState.betAmount = roundState.betTeamA;
  } else {
    roundState.betTeamB = maxBet <= 0 ? 0 : Math.min(normalizeBetAmount(roundState.betTeamB), maxBet);
    roundState.betAmount = roundState.betTeamB;
  }
  roundState.outcomes = { ...roundState.outcomesByTeam[playingTeamKey] };

  elements.filmPlayingTeamSelect.options[0].text = state.teams.teamA.name;
  elements.filmPlayingTeamSelect.options[1].text = state.teams.teamB.name;
  elements.filmPlayingTeamSelect.value = playingTeamKey;
  elements.filmPlayingTeamSelect.disabled = true;

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

  const breakdown = getFilmRoundBreakdown(roundState, roundState.betAmount, playingTeamKey);
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
    `One-team round (${playingTeam.name}). Weights: Character/Title x1, Franchise x1, Fun Fact x3. Component payout preview: +${formatMoney(
      breakdown.componentPayout
    )}. Bet preview: ${betDeltaLabel}. Net preview: ${totalDeltaLabel}. ` +
    `Bet cap is 15%, rounded to ${BET_ROUNDING_STEP}. ${playingTeam.name} max now: ${formatMoney(maxBet)}.`;
  elements.filmRoundResult.textContent = roundState.lastResult || "Rezultatul rundei va aparea aici.";

  const activeCount = countActiveWithJoker(playingTeamKey);
  elements.filmActiveSelectionInfo.textContent =
    `${playingTeam.name} lineup for this game: ${activeCount}/${MAX_ACTIVE_PER_TEAM} active. ` +
    `Lineup stays fixed for the whole mini-game unless host override is used.`;
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
  const roundState = getOrCreateFilmRoundState();
  const forcedTeamKey = getFilmTeamForRound(state.progress.currentRound);
  roundState.teamKey = forcedTeamKey;
  roundState.betAmount = forcedTeamKey === "teamA" ? roundState.betTeamA : roundState.betTeamB;
  roundState.outcomes = { ...roundState.outcomesByTeam[forcedTeamKey] };
  saveCurrentRoundSnapshot();
  renderRoundSelection();
  renderFilmControls();
  if (teamKey && teamKey !== forcedTeamKey) {
    setLastResultSummary(`Film team turn is automatic. Round ${state.progress.currentRound} plays with ${state.teams[forcedTeamKey].name}.`);
  } else {
    setLastResultSummary(`Film round active team: ${state.teams[forcedTeamKey].name}.`);
  }
  saveState("Film round team synced.");
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
  roundState.outcomesByTeam = {
    teamA: {
      character: null,
      franchise: null,
      funFact: null
    },
    teamB: {
      character: null,
      franchise: null,
      funFact: null
    }
  };
  roundState.outcomes = {
    character: null,
    franchise: null,
    funFact: null
  };
  roundState.payoutApplied = false;
  roundState.lastResult = "";

  renderFilmControls();
  saveState("Film round item selected.");
}

function setFilmBetAmount(rawBetAmount) {
  const roundState = getOrCreateFilmRoundState();
  const teamKey = roundState.teamKey;
  const maxBet = getMaxBetAmount(state.teams[teamKey].money, "film-joc-franciza-fun-fact");
  const normalized = maxBet <= 0 ? 0 : Math.min(normalizeBetAmount(rawBetAmount), maxBet);
  if (teamKey === "teamA") {
    roundState.betTeamA = normalized;
  } else {
    roundState.betTeamB = normalized;
  }
  roundState.betAmount = normalized;
  roundState.outcomes = { ...roundState.outcomesByTeam[teamKey] };
  roundState.payoutApplied = false;
  roundState.lastResult = "";
  renderFilmControls();
  saveState("Film round bet adjusted.");
}

function setFilmTeamBet(teamKey, rawBetAmount) {
  if (!["teamA", "teamB"].includes(teamKey)) {
    return;
  }
  const roundState = getOrCreateFilmRoundState();
  const maxBet = getMaxBetAmount(state.teams[teamKey].money, "film-joc-franciza-fun-fact");
  const normalized = maxBet <= 0 ? 0 : Math.min(normalizeBetAmount(rawBetAmount), maxBet);
  if (teamKey === "teamA") {
    roundState.betTeamA = normalized;
  } else {
    roundState.betTeamB = normalized;
  }
  if (roundState.teamKey === teamKey) {
    roundState.betAmount = normalized;
    roundState.outcomes = { ...roundState.outcomesByTeam[teamKey] };
  }
  roundState.payoutApplied = false;
  roundState.lastResult = "";
  renderFilmControls();
  saveState("Film round bet adjusted.");
}

function setFilmRoundParticipantSelection(teamKey, playerIds) {
  if (!["teamA", "teamB"].includes(teamKey)) {
    return;
  }
  const roundState = getOrCreateFilmRoundState();
  const key = teamKey === "teamA" ? "participantsTeamA" : "participantsTeamB";
  roundState[key] = sanitizeRoundParticipantIds(playerIds, teamKey);
  roundState.payoutApplied = false;
  roundState.lastResult = "";
  renderShowUi();
}

function toggleFilmRoundParticipant(teamKey, playerId) {
  if (!["teamA", "teamB"].includes(teamKey)) {
    return;
  }
  const roundState = getOrCreateFilmRoundState();
  const key = teamKey === "teamA" ? "participantsTeamA" : "participantsTeamB";
  const current = new Set(sanitizeRoundParticipantIds(roundState[key], teamKey));
  if (current.has(playerId)) {
    current.delete(playerId);
  } else {
    current.add(playerId);
  }
  setFilmRoundParticipantSelection(teamKey, Array.from(current));
  saveState("Film participants updated.");
}

function selectAllFilmParticipants(teamKey) {
  if (!["teamA", "teamB"].includes(teamKey)) {
    return;
  }
  const allIds = getAvailablePlayersForTeam(teamKey).map((player) => player.id);
  setFilmRoundParticipantSelection(teamKey, allIds);
  saveState("Film participants set to all available players.");
}

function toggleFilmReveal(componentKey) {
  if (!FILM_COMPONENT_KEYS.includes(componentKey)) {
    return;
  }
  const roundState = getOrCreateFilmRoundState();
  roundState.revealed[componentKey] = !roundState.revealed[componentKey];
  roundState.payoutApplied = false;
  roundState.lastResult = "";
  renderFilmControls();
  saveState("Film component reveal toggled.");
}

function setFilmComponentOutcome(componentKey, nextOutcome, teamKey = null) {
  if (!FILM_COMPONENT_KEYS.includes(componentKey)) {
    return;
  }
  if (!["correct", "wrong", null].includes(nextOutcome)) {
    return;
  }
  const roundState = getOrCreateFilmRoundState();
  const targetTeam = ["teamA", "teamB"].includes(teamKey) ? teamKey : roundState.teamKey;
  roundState.outcomesByTeam[targetTeam][componentKey] = nextOutcome;
  if (targetTeam === roundState.teamKey) {
    roundState.outcomes[componentKey] = nextOutcome;
  }
  roundState.payoutApplied = false;
  roundState.lastResult = "";
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
  roundState.betTeamA = 100;
  roundState.betTeamB = 100;
  roundState.betAmount = roundState.teamKey === "teamA" ? roundState.betTeamA : roundState.betTeamB;
  roundState.revealed = {
    character: false,
    franchise: false,
    funFact: false
  };
  roundState.outcomesByTeam = {
    teamA: {
      character: null,
      franchise: null,
      funFact: null
    },
    teamB: {
      character: null,
      franchise: null,
      funFact: null
    }
  };
  roundState.outcomes = {
    character: null,
    franchise: null,
    funFact: null
  };
  roundState.payoutApplied = false;
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
    return false;
  }
  if (roundState.payoutApplied) {
    setLastResultSummary("Film result already applied for this round.");
    renderFilmControls();
    saveState("Film apply blocked: payout already applied.");
    return false;
  }

  const playingTeamKey = getFilmTeamForRound(state.progress.currentRound);
  const otherTeamKey = playingTeamKey === "teamA" ? "teamB" : "teamA";
  const playingTeam = state.teams[playingTeamKey];
  const maxBet = getMaxBetAmount(playingTeam.money, "film-joc-franciza-fun-fact");
  roundState.teamKey = playingTeamKey;
  if (playingTeamKey === "teamA") {
    roundState.betTeamA = maxBet <= 0 ? 0 : Math.min(normalizeBetAmount(roundState.betTeamA), maxBet);
    roundState.betAmount = roundState.betTeamA;
  } else {
    roundState.betTeamB = maxBet <= 0 ? 0 : Math.min(normalizeBetAmount(roundState.betTeamB), maxBet);
    roundState.betAmount = roundState.betTeamB;
  }
  roundState.outcomes = { ...roundState.outcomesByTeam[playingTeamKey] };

  const missingComponents = FILM_COMPONENT_KEYS.filter(
    (key) => roundState.outcomesByTeam?.[playingTeamKey]?.[key] === null
  );
  if (missingComponents.length > 0) {
    roundState.lastResult = `Mark all 3 components for ${playingTeam.name} before payout. Missing: ${missingComponents.join(", ")}.`;
    renderFilmControls();
    setLastResultSummary(roundState.lastResult);
    saveState("Film round blocked: incomplete outcomes.");
    return false;
  }

  const breakdown = getFilmRoundBreakdown(roundState, roundState.betAmount, playingTeamKey);

  pushResultUndoSnapshot("Film/Joc/Franciza/Fun Fact round result");
  const moneyBefore = state.teams[playingTeamKey].money;
  state.teams[playingTeamKey].money = Math.max(0, state.teams[playingTeamKey].money + breakdown.totalDelta);
  const appliedDelta = state.teams[playingTeamKey].money - moneyBefore;
  const roundOutcome = appliedDelta > 0 ? "win" : appliedDelta < 0 ? "loss" : "draw";
  const betOutcome = roundState.betAmount > 0 ? (breakdown.betEligible ? "win" : "loss") : "draw";
  const selectedParticipants = getActiveParticipantsForTeam(playingTeamKey);
  const fallbackParticipants = getAvailablePlayersForTeam(playingTeamKey).map((player) => ({
    id: player.id,
    displayName: player.name,
    teamKey: playingTeamKey
  }));
  const participantsForStats = selectedParticipants.length > 0 ? selectedParticipants : fallbackParticipants;
  const statsPayload = {
    gameId: "film-joc-franciza-fun-fact"
  };
  statsPayload[playingTeamKey] = {
    participants: participantsForStats,
    roundOutcome,
    teamNetDelta: appliedDelta,
    teamBetAmount: roundState.betAmount,
    betOutcome
  };
  applyRoundPlayerStats(statsPayload);

  if (!roundState.usedItemIds.includes(selectedItem.id)) {
    roundState.usedItemIds.push(selectedItem.id);
  }

  roundState.lastResult =
    `${selectedItem.title}: ${playingTeam.name} scored ${breakdown.totalPoints}/${breakdown.maxPoints} ` +
    `(bet ${breakdown.betEligible ? "ON" : "OFF"}) => ${formatSignedMoney(appliedDelta)}. ` +
    `Next turn: ${state.teams[otherTeamKey].name}.`;
  roundState.payoutApplied = true;

  saveCurrentRoundSnapshot();
  setLastResultSummary(roundState.lastResult);
  renderProgress();
  renderTeams();
  renderBettingInfo();
  renderRoundSelection();
  renderFilmControls();
  saveState("Film round payout applied.");
  return true;
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
    !elements.samsarBetTeamAInput ||
    !elements.samsarBetTeamBInput ||
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

  const availableTeamA = getSelectableGameLineupPlayers("teamA");
  const availableTeamB = getSelectableGameLineupPlayers("teamB");

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
  roundState.betTeamA = maxBetA <= 0 ? 0 : Math.min(normalizeBetAmount(roundState.betTeamA), maxBetA);
  roundState.betTeamB = maxBetB <= 0 ? 0 : Math.min(normalizeBetAmount(roundState.betTeamB), maxBetB);
  elements.samsarBetTeamAInput.value = String(roundState.betTeamA);
  elements.samsarBetTeamBInput.value = String(roundState.betTeamB);
  elements.samsarBetTeamAInput.max = String(maxBetA);
  elements.samsarBetTeamBInput.max = String(maxBetB);
  const fixedBonus = getStandardFixedBonus("cel-mai-bun-samsar");
  elements.samsarRuleInfo.textContent =
    `Rule: higher score wins, equal score is draw. Winner gets +${formatMoney(fixedBonus)} bonus + bet win. ` +
    `${state.teams.teamA.name} max ${formatMoney(maxBetA)} | ${state.teams.teamB.name} max ${formatMoney(maxBetB)}.`;
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
    roundState.payoutApplied = false;
    roundState.lastResult = "";
    renderSamsarControls();
    saveState("Samsar active player cleared.");
    return;
  }

  const allowedPlayers = getSelectableGameLineupPlayers(teamKey);
  const player = allowedPlayers.find((entry) => entry.id === playerId);
  if (!player || player.status !== "available") {
    setLastResultSummary("Selected player is not available in current game lineup.");
    renderSamsarControls();
    saveState("Samsar active player rejected.");
    return;
  }

  roundState[playerField] = player.id;
  roundState.payoutApplied = false;
  roundState.lastResult = "";
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
  roundState.payoutApplied = false;
  roundState.lastResult = "";
  renderSamsarControls();
  saveState("Samsar score updated.");
}

function setSamsarBet(teamKey, rawBet) {
  if (!["teamA", "teamB"].includes(teamKey)) {
    return;
  }
  const roundState = getOrCreateSamsarRoundState(getSamsarRoundNumber());
  const maxBet = getMaxBetAmount(state.teams[teamKey].money, "cel-mai-bun-samsar");
  const normalized = maxBet <= 0 ? 0 : Math.min(normalizeBetAmount(rawBet), maxBet);

  if (teamKey === "teamA") {
    roundState.betTeamA = normalized;
  } else {
    roundState.betTeamB = normalized;
  }

  roundState.payoutApplied = false;
  roundState.lastResult = "";
  renderSamsarControls();
  saveState("Samsar bet updated.");
}

function goToSamsarRound(roundNumber) {
  const targetRound = clampNumber(
    Math.round(sanitizeNumber(roundNumber, 1)),
    1,
    getGameRoundLimit("cel-mai-bun-samsar")
  );
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
  const inputBetA = elements.samsarBetTeamAInput?.value ?? roundState.betTeamA;
  const inputBetB = elements.samsarBetTeamBInput?.value ?? roundState.betTeamB;
  const nextBetA = maxBetA <= 0 ? 0 : Math.min(normalizeBetAmount(inputBetA), maxBetA);
  const nextBetB = maxBetB <= 0 ? 0 : Math.min(normalizeBetAmount(inputBetB), maxBetB);
  if (nextBetA !== roundState.betTeamA || nextBetB !== roundState.betTeamB) {
    roundState.betTeamA = nextBetA;
    roundState.betTeamB = nextBetB;
    roundState.payoutApplied = false;
    roundState.lastResult = "";
  }
  const stakeA = roundState.betTeamA;
  const stakeB = roundState.betTeamB;

  if (roundState.payoutApplied) {
    setLastResultSummary("Samsar result already applied for this round.");
    renderSamsarControls();
    saveState("Samsar apply blocked: payout already applied.");
    return false;
  }

  const fixedBonus = getStandardFixedBonus("cel-mai-bun-samsar");

  let resultText = "";
  let winnerTeam = "draw";
  let deltaA = 0;
  let deltaB = 0;
  pushResultUndoSnapshot("Cel mai bun samsar round result");

  if (roundState.scoreTeamA > roundState.scoreTeamB) {
    state.teams.teamA.money += fixedBonus + stakeA;
    state.teams.teamB.money = Math.max(0, state.teams.teamB.money - stakeB);
    winnerTeam = "teamA";
    deltaA = fixedBonus + stakeA;
    deltaB = -stakeB;
    resultText =
      `${state.teams.teamA.name} wins Samsar round ${roundNumber} (${roundState.scoreTeamA} - ${roundState.scoreTeamB}). ` +
      `${state.teams.teamA.name} +${formatMoney(fixedBonus)} bonus +${formatMoney(stakeA)} bet, ` +
      `${state.teams.teamB.name} -${formatMoney(stakeB)}.`;
  } else if (roundState.scoreTeamB > roundState.scoreTeamA) {
    state.teams.teamB.money += fixedBonus + stakeB;
    state.teams.teamA.money = Math.max(0, state.teams.teamA.money - stakeA);
    winnerTeam = "teamB";
    deltaA = -stakeA;
    deltaB = fixedBonus + stakeB;
    resultText =
      `${state.teams.teamB.name} wins Samsar round ${roundNumber} (${roundState.scoreTeamB} - ${roundState.scoreTeamA}). ` +
      `${state.teams.teamB.name} +${formatMoney(fixedBonus)} bonus +${formatMoney(stakeB)} bet, ` +
      `${state.teams.teamA.name} -${formatMoney(stakeA)}.`;
  } else {
    resultText =
      `Samsar round ${roundNumber} is draw (${roundState.scoreTeamA} - ${roundState.scoreTeamB}). ` +
      "No payout applied.";
  }

  const teamAOutcome = getOutcomeForTeamFromWinner(winnerTeam, "teamA");
  const teamBOutcome = getOutcomeForTeamFromWinner(winnerTeam, "teamB");
  const teamABetOutcome = stakeA > 0 ? teamAOutcome : "draw";
  const teamBBetOutcome = stakeB > 0 ? teamBOutcome : "draw";
  const getDuelParticipants = (teamKey, playerId) => {
    if (!playerId) {
      return [];
    }
    const player = state.teams[teamKey].players.find((entry) => entry.id === playerId && entry.status === "available");
    if (!player) {
      return [];
    }
    return [
      {
        id: player.id,
        displayName: player.name,
        teamKey
      }
    ];
  };
  const participantsA = getDuelParticipants("teamA", roundState.activePlayerTeamAId);
  const participantsB = getDuelParticipants("teamB", roundState.activePlayerTeamBId);
  applyRoundPlayerStats({
    gameId: "cel-mai-bun-samsar",
    teamA: {
      participants: participantsA.length > 0 ? participantsA : getActiveParticipantsForTeam("teamA"),
      roundOutcome: teamAOutcome,
      teamNetDelta: deltaA,
      teamBetAmount: stakeA,
      betOutcome: teamABetOutcome
    },
    teamB: {
      participants: participantsB.length > 0 ? participantsB : getActiveParticipantsForTeam("teamB"),
      roundOutcome: teamBOutcome,
      teamNetDelta: deltaB,
      teamBetAmount: stakeB,
      betOutcome: teamBBetOutcome
    }
  });

  roundState.lastResult = resultText;
  roundState.payoutApplied = true;
  saveCurrentRoundSnapshot();
  setLastResultSummary(resultText);
  renderProgress();
  renderTeams();
  renderBettingInfo();
  renderRoundSelection();
  renderSamsarControls();
  saveState("Samsar round result applied.");
  return true;
}

function normalizeManualMatchRoundState(gameId, roundState) {
  const maxBetA = getMaxBetAmount(state.teams.teamA.money, gameId);
  const maxBetB = getMaxBetAmount(state.teams.teamB.money, gameId);
  roundState.scoreTeamA = Math.max(0, Math.round(sanitizeNumber(roundState.scoreTeamA, 0)));
  roundState.scoreTeamB = Math.max(0, Math.round(sanitizeNumber(roundState.scoreTeamB, 0)));
  roundState.winner = ["teamA", "teamB", "draw"].includes(roundState.winner) ? roundState.winner : "draw";
  roundState.betTeamA = maxBetA <= 0 ? 0 : Math.min(normalizeBetAmount(roundState.betTeamA), maxBetA);
  roundState.betTeamB = maxBetB <= 0 ? 0 : Math.min(normalizeBetAmount(roundState.betTeamB), maxBetB);
  roundState.participantsTeamA = sanitizeRoundParticipantIds(roundState.participantsTeamA, "teamA");
  roundState.participantsTeamB = sanitizeRoundParticipantIds(roundState.participantsTeamB, "teamB");
  roundState.payoutApplied = Boolean(roundState.payoutApplied);
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
  let effectiveBetA = Math.min(normalizedRoundState.betTeamA, maxBetA);
  let effectiveBetB = Math.min(normalizedRoundState.betTeamB, maxBetB);

  let winner = ["teamA", "teamB", "draw"].includes(normalizedRoundState.winner)
    ? normalizedRoundState.winner
    : "draw";

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

  const shotFakeRoles = getShotFakeRoundRoles();
  const shooterTeamKey = shotFakeRoles.shooterTeamKey;
  const detectorTeamKey = shotFakeRoles.detectorTeamKey;
  if (gameId === "shot-fake") {
    if (shooterTeamKey === "teamA") {
      effectiveBetA = 0;
    } else {
      effectiveBetB = 0;
    }
  }
  const activeCountA = getShotFakeOpponentCount(normalizedRoundState, "teamA");
  const activeCountB = getShotFakeOpponentCount(normalizedRoundState, "teamB");
  const shotFakeBetMultiplierTeamA = Math.max(1, activeCountB);
  const shotFakeBetMultiplierTeamB = Math.max(1, activeCountA);
  const fixedBonus = getStandardFixedBonus(gameId);
  let winnerBetMultiplier = 0;
  let winnerBetPayout = 0;
  let specialTransfer = 0;

  if (gameId !== "shot-fake") {
    if (winner === "teamA") {
      addToTeam("teamA", fixedBonus + effectiveBetA);
      deductFromTeam("teamB", effectiveBetB);
    } else if (winner === "teamB") {
      addToTeam("teamB", fixedBonus + effectiveBetB);
      deductFromTeam("teamA", effectiveBetA);
    }
  } else {
    const detectorBet = detectorTeamKey === "teamA" ? effectiveBetA : effectiveBetB;
    const detectorMultiplier = detectorTeamKey === "teamA" ? shotFakeBetMultiplierTeamA : shotFakeBetMultiplierTeamB;
    const shooterRoundWin = winner === shooterTeamKey;
    const detectorRoundWin = winner === detectorTeamKey;

    if (detectorRoundWin) {
      winnerBetMultiplier = detectorMultiplier;
      winnerBetPayout = detectorBet * winnerBetMultiplier;
      specialTransfer = winnerBetPayout;
      addToTeam(detectorTeamKey, fixedBonus + winnerBetPayout);
    } else if (shooterRoundWin) {
      addToTeam(shooterTeamKey, fixedBonus);
      deductFromTeam(detectorTeamKey, detectorBet);
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
    fixedBonus,
    maxBetA,
    maxBetB,
    effectiveBetA,
    effectiveBetB,
    activeCountA,
    activeCountB,
    shooterTeamKey,
    detectorTeamKey,
    shotFakeBetMultiplierTeamA,
    shotFakeBetMultiplierTeamB,
    winnerBetMultiplier,
    winnerBetPayout,
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
  const scoreInputsVisible = !isScorelessManualMatchGame(gameId);
  const shotFakeRoles = gameId === "shot-fake" ? getShotFakeRoundRoles(roundNumber) : null;

  elements.manualGameSelect.value = gameId;
  elements.manualRoundInput.value = String(roundNumber);
  elements.manualScoreTeamAInput.value = String(roundState.scoreTeamA);
  elements.manualScoreTeamBInput.value = String(roundState.scoreTeamB);
  const scoreGroupA = elements.manualScoreTeamAInput.closest("div");
  const scoreGroupB = elements.manualScoreTeamBInput.closest("div");
  if (scoreGroupA) {
    scoreGroupA.style.display = scoreInputsVisible ? "" : "none";
  }
  if (scoreGroupB) {
    scoreGroupB.style.display = scoreInputsVisible ? "" : "none";
  }
  elements.manualScoreTeamAInput.disabled = !scoreInputsVisible;
  elements.manualScoreTeamBInput.disabled = !scoreInputsVisible;
  elements.manualBetTeamAInput.value = String(settlement.effectiveBetA);
  elements.manualBetTeamBInput.value = String(settlement.effectiveBetB);
  if (gameId === "shot-fake") {
    const fixedBonus = getStandardFixedBonus("shot-fake");
    const shooterLabel = state.teams[shotFakeRoles.shooterTeamKey].name;
    const detectorLabel = state.teams[shotFakeRoles.detectorTeamKey].name;
    elements.manualBetTeamAInput.disabled = shotFakeRoles.detectorTeamKey !== "teamA";
    elements.manualBetTeamBInput.disabled = shotFakeRoles.detectorTeamKey !== "teamB";
    elements.manualBetRuleInfo.textContent =
      `Round ${roundNumber}: ${shooterLabel} takes the shot (no bet), ${detectorLabel} places the bet. ` +
      `If discover is correct -> +${formatMoney(fixedBonus)} + bet x active opponents. If not discovered -> ${shooterLabel} gets +${formatMoney(
        fixedBonus
      )} only and ${detectorLabel} loses the bet.`;
  } else {
    elements.manualBetTeamAInput.disabled = false;
    elements.manualBetTeamBInput.disabled = false;
    const fixedBonus = getStandardFixedBonus(gameId);
    elements.manualBetRuleInfo.textContent =
      `${getGameLabel(gameId)} max bet: Team 1 ${formatMoney(settlement.maxBetA)}, Team 2 ${formatMoney(
        settlement.maxBetB
      )}. ` +
      `Draw is allowed. Standard payout applies (+${formatMoney(fixedBonus)} winner bonus + bet win).` +
      `${scoreInputsVisible ? " Score fields can set winner automatically." : " Winner is selected only from Team 1 won / Draw / Team 2 won."}`;
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
      const detectorMultiplier =
        shotFakeRoles.detectorTeamKey === "teamA" ? settlement.shotFakeBetMultiplierTeamA : settlement.shotFakeBetMultiplierTeamB;
      elements.shotFakeMultiplierInput.value = String(detectorMultiplier);
      elements.shotFakeMultiplierInput.disabled = true;
      elements.shotFakeMultiplierInput.title = "Auto = active players from shot team.";
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
        `Shot team: ${state.teams[shotFakeRoles.shooterTeamKey].name}. Detector: ${state.teams[shotFakeRoles.detectorTeamKey].name}. ` +
        `Detector bet multiplier this round: x${
          shotFakeRoles.detectorTeamKey === "teamA" ? settlement.shotFakeBetMultiplierTeamA : settlement.shotFakeBetMultiplierTeamB
        }. ` +
        `Current detector payout preview: ${formatMoney(settlement.winnerBetPayout)} + bonus ${formatMoney(settlement.fixedBonus)}. ` +
        `Net preview: Team 1 ${previewDeltaA}, Team 2 ${previewDeltaB}.`;
    }
  } else if (elements.shotFakeRulePreview) {
    if (elements.shotFakeMultiplierInput) {
      elements.shotFakeMultiplierInput.disabled = false;
      elements.shotFakeMultiplierInput.title = "";
    }
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
  setCurrentGame(gameId, { keepRound: false, navigateToSection: false });
  renderManualMatchControls();
  saveState(`Manual game changed: ${getGameLabel(gameId)}.`);
}

function setManualMatchRound(rawRoundValue) {
  const targetGame = getCurrentManualMatchGame();
  const maxRounds = getGameRoundLimit(targetGame);
  const roundNumber = clampNumber(
    Math.max(1, Math.round(sanitizeNumber(rawRoundValue, state.progress.currentRound))),
    1,
    maxRounds
  );
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
  if (isScorelessManualMatchGame(gameId)) {
    return;
  }
  const roundState = getOrCreateManualMatchRoundState(gameId, state.progress.currentRound);
  const normalized = Math.max(0, Math.round(sanitizeNumber(rawScore, 0)));
  if (teamKey === "teamA") {
    roundState.scoreTeamA = normalized;
  } else if (teamKey === "teamB") {
    roundState.scoreTeamB = normalized;
  } else {
    return;
  }
  if (roundState.scoreTeamA > roundState.scoreTeamB) {
    roundState.winner = "teamA";
  } else if (roundState.scoreTeamB > roundState.scoreTeamA) {
    roundState.winner = "teamB";
  } else {
    roundState.winner = "draw";
  }
  roundState.payoutApplied = false;
  roundState.lastResult = "";
  renderManualMatchControls();
  saveState("Manual score updated.");
}

function setManualRoundBet(teamKey, rawBet) {
  const gameId = getCurrentManualMatchGame();
  const roundState = getOrCreateManualMatchRoundState(gameId, state.progress.currentRound);
  if (gameId === "shot-fake") {
    const roles = getShotFakeRoundRoles(state.progress.currentRound);
    if (teamKey === roles.shooterTeamKey) {
      if (teamKey === "teamA") {
        roundState.betTeamA = 0;
      } else {
        roundState.betTeamB = 0;
      }
      roundState.payoutApplied = false;
      roundState.lastResult = "";
      setLastResultSummary(`${state.teams[roles.shooterTeamKey].name} is shot team this round and does not place a bet.`);
      renderManualMatchControls();
      saveState("Shot Fake shooter bet blocked.");
      return;
    }
  }
  const maxBet = getMaxBetAmount(state.teams[teamKey].money, gameId);
  const normalized = maxBet <= 0 ? 0 : Math.min(normalizeBetAmount(rawBet), maxBet);
  if (teamKey === "teamA") {
    roundState.betTeamA = normalized;
  } else if (teamKey === "teamB") {
    roundState.betTeamB = normalized;
  } else {
    return;
  }
  if (gameId === "shot-fake") {
    const roles = getShotFakeRoundRoles(state.progress.currentRound);
    if (roles.shooterTeamKey === "teamA") {
      roundState.betTeamA = 0;
    } else {
      roundState.betTeamB = 0;
    }
  }
  roundState.payoutApplied = false;
  roundState.lastResult = "";
  renderManualMatchControls();
  saveState("Manual bet updated.");
}

function setManualRoundWinner(winner) {
  const gameId = getCurrentManualMatchGame();
  const roundState = getOrCreateManualMatchRoundState(gameId, state.progress.currentRound);
  if (!["teamA", "teamB", "draw"].includes(winner)) {
    return;
  }
  roundState.winner = winner;
  roundState.payoutApplied = false;
  roundState.lastResult = "";
  setLastResultSummary(
    winner === "draw"
      ? "Draw preview selected."
      : `${state.teams[winner].name} marked as winner preview.`
  );
  renderManualMatchControls();
  saveState("Manual winner selected.");
}

function setManualRoundParticipantSelection(teamKey, playerIds) {
  const gameId = getCurrentManualMatchGame();
  const roundState = getOrCreateManualMatchRoundState(gameId, state.progress.currentRound);
  if (!["teamA", "teamB"].includes(teamKey)) {
    return;
  }
  const key = teamKey === "teamA" ? "participantsTeamA" : "participantsTeamB";
  roundState[key] = sanitizeRoundParticipantIds(playerIds, teamKey);
  roundState.payoutApplied = false;
  roundState.lastResult = "";
  renderShowUi();
}

function toggleManualRoundParticipant(teamKey, playerId) {
  if (!["teamA", "teamB"].includes(teamKey)) {
    return;
  }
  const gameId = getCurrentManualMatchGame();
  const roundState = getOrCreateManualMatchRoundState(gameId, state.progress.currentRound);
  const key = teamKey === "teamA" ? "participantsTeamA" : "participantsTeamB";
  const current = new Set(sanitizeRoundParticipantIds(roundState[key], teamKey));
  if (current.has(playerId)) {
    current.delete(playerId);
  } else {
    current.add(playerId);
  }
  setManualRoundParticipantSelection(teamKey, Array.from(current));
  saveState("Manual participants updated.");
}

function selectAllManualParticipants(teamKey) {
  if (!["teamA", "teamB"].includes(teamKey)) {
    return;
  }
  const allIds = getAvailablePlayersForTeam(teamKey).map((player) => player.id);
  setManualRoundParticipantSelection(teamKey, allIds);
  saveState("Manual participants set to all available players.");
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
  roundState.payoutApplied = false;
  roundState.lastResult = "";
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

  roundState.payoutApplied = false;
  roundState.lastResult = "";
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
  roundState.payoutApplied = false;
  roundState.lastResult = "";
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
  roundState.payoutApplied = false;
  roundState.lastResult = "";
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
  roundState.payoutApplied = false;
  roundState.lastResult = "";
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
  if (isScorelessManualMatchGame(gameId)) {
    roundState.scoreTeamA = 0;
    roundState.scoreTeamB = 0;
  } else {
    roundState.scoreTeamA = Math.max(0, Math.round(sanitizeNumber(elements.manualScoreTeamAInput?.value, roundState.scoreTeamA)));
    roundState.scoreTeamB = Math.max(0, Math.round(sanitizeNumber(elements.manualScoreTeamBInput?.value, roundState.scoreTeamB)));
  }
  roundState.betTeamA = normalizeBetAmount(elements.manualBetTeamAInput?.value);
  roundState.betTeamB = normalizeBetAmount(elements.manualBetTeamBInput?.value);

  if (gameId === "shot-fake") {
    const roles = getShotFakeRoundRoles(state.progress.currentRound);
    if (roles.shooterTeamKey === "teamA") {
      roundState.betTeamA = 0;
    } else {
      roundState.betTeamB = 0;
    }
    roundState.shotFake.manualAdjustTeamA = Math.round(
      sanitizeNumber(elements.shotFakeManualAdjustTeamAInput?.value, roundState.shotFake.manualAdjustTeamA)
    );
    roundState.shotFake.manualAdjustTeamB = Math.round(
      sanitizeNumber(elements.shotFakeManualAdjustTeamBInput?.value, roundState.shotFake.manualAdjustTeamB)
    );
  }

  normalizeManualMatchRoundState(gameId, roundState);
  if (roundState.payoutApplied) {
    setLastResultSummary("Result already applied for this round. Move to the next round.");
    renderManualMatchControls();
    saveState("Manual apply blocked: payout already applied.");
    return false;
  }
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
      ? ` Shot team: ${state.teams[settlement.shooterTeamKey].name}. Detector: ${state.teams[settlement.detectorTeamKey].name}. Detector payout: ${formatMoney(
          settlement.winnerBetPayout
        )} with multiplier x${
          settlement.detectorTeamKey === "teamA" ? settlement.shotFakeBetMultiplierTeamA : settlement.shotFakeBetMultiplierTeamB
        } (active ${settlement.activeCountA} vs ${settlement.activeCountB}).`
      : "";
  const standardBonusSuffix =
    settlement.fixedBonus > 0 ? ` Fixed winner bonus: ${formatMoney(settlement.fixedBonus)}.` : "";

  const teamAOutcome = getOutcomeForTeamFromWinner(settlement.winner, "teamA");
  const teamBOutcome = getOutcomeForTeamFromWinner(settlement.winner, "teamB");
  const selectedParticipantsA = getSelectedParticipantsForTeam("teamA", roundState.participantsTeamA);
  const selectedParticipantsB = getSelectedParticipantsForTeam("teamB", roundState.participantsTeamB);
  applyRoundPlayerStats({
    gameId,
    teamA: {
      participants: selectedParticipantsA,
      roundOutcome: teamAOutcome,
      teamNetDelta: settlement.deltaA,
      teamBetAmount: settlement.effectiveBetA,
      betOutcome: settlement.effectiveBetA > 0 ? teamAOutcome : "draw"
    },
    teamB: {
      participants: selectedParticipantsB,
      roundOutcome: teamBOutcome,
      teamNetDelta: settlement.deltaB,
      teamBetAmount: settlement.effectiveBetB,
      betOutcome: settlement.effectiveBetB > 0 ? teamBOutcome : "draw"
    }
  });

  const scoreSnippet = isScorelessManualMatchGame(gameId) ? "" : ` (${roundState.scoreTeamA}-${roundState.scoreTeamB})`;
  roundState.lastResult =
    `${getGameLabel(gameId)} round ${state.progress.currentRound}: ${winnerLabel}${scoreSnippet}. ` +
    `Team 1 ${deltaLabelA}, Team 2 ${deltaLabelB}.${standardBonusSuffix}${shotFakeSuffix}`;
  roundState.payoutApplied = true;

  saveCurrentRoundSnapshot();
  setLastResultSummary(roundState.lastResult);
  renderProgress();
  renderTeams();
  renderBettingInfo();
  renderRoundSelection();
  renderManualMatchControls();
  saveState("Manual match round result applied.");
  return true;
}

function ensureCurseRoundContext() {
  if (state.progress.currentGame === "curse-de-cai") {
    return;
  }
  switchRoundContext("curse-de-cai", state.progress.currentRound, { navigateToSection: false });
  renderProgress();
  renderRoundSelection();
}

function isCurseRaceRunning(roundKey = "") {
  if (!curseRaceRuntime.isRunning) {
    return false;
  }
  if (!roundKey) {
    return true;
  }
  return curseRaceRuntime.roundKey === roundKey;
}

function stopCurseRaceSimulation(options = {}) {
  const render = options.render !== false;
  const persist = options.persist === true;
  const summary = typeof options.summary === "string" ? options.summary.trim() : "";
  const reason = typeof options.reason === "string" ? options.reason.trim() : "Curse auto race stopped.";
  const wasRunning = curseRaceRuntime.isRunning;
  if (Number.isFinite(curseRaceRuntime.intervalId)) {
    window.clearInterval(curseRaceRuntime.intervalId);
  }
  if (Number.isFinite(curseRaceRuntime.finishTimeoutId)) {
    window.clearTimeout(curseRaceRuntime.finishTimeoutId);
  }
  curseRaceRuntime.intervalId = null;
  curseRaceRuntime.finishTimeoutId = null;
  curseRaceRuntime.isRunning = false;
  curseRaceRuntime.roundKey = "";

  if (summary) {
    setLastResultSummary(summary);
  }
  if (render) {
    renderCurseControls();
  }
  if (persist && wasRunning) {
    saveState(reason);
  }
}

function pushCurseCardHistoryEntry(roundState, text) {
  const line = String(text || "").trim();
  if (!line) {
    return;
  }
  if (!Array.isArray(roundState.cardHistory)) {
    roundState.cardHistory = [];
  }
  roundState.cardHistory.push(line);
  if (roundState.cardHistory.length > 12) {
    roundState.cardHistory = roundState.cardHistory.slice(-12);
  }
}

function updateCurseOverlayRaceFrame(roundState, options = {}) {
  if (state.progress.currentGame !== "curse-de-cai") {
    return;
  }
  if (state.showUi?.activeScreen !== "live-round") {
    return;
  }
  if (getLiveRoundStep("curse-de-cai") !== "race-screen") {
    return;
  }

  const root = elements.showScreenContent;
  if (!root) {
    return;
  }

  const trackLength = Math.max(1, Math.round(sanitizeNumber(state.curseRace.trackLength, 1)));
  const raceRunning =
    options.raceRunning === true || isCurseRaceRunning(getCurseRoundKey(state.progress.currentRound));
  const winnerHorse = state.curseRace.horses.find((horse) => horse.id === roundState.winnerHorseId);
  const leader = state.curseRace.horses
    .map((horse) => ({
      horse,
      position: Math.max(0, Math.round(sanitizeNumber(roundState.positions?.[horse.id], 0)))
    }))
    .sort((left, right) => right.position - left.position)[0];

  const titleNode = root.querySelector("[data-show-curse-race-title]");
  if (titleNode) {
    titleNode.textContent = winnerHorse
      ? `Winner detected: ${winnerHorse.symbol} ${winnerHorse.name}`
      : raceRunning
        ? "Race running live..."
        : "Race ready";
  }

  const leaderNode = root.querySelector("[data-show-curse-race-leader]");
  if (leaderNode) {
    leaderNode.textContent = leader
      ? `Leader: ${leader.horse.symbol} ${leader.horse.name} (${leader.position}/${trackLength}).`
      : "Leader: No movement yet.";
  }

  const logBody = root.querySelector("[data-show-curse-log-body]");
  if (logBody) {
    if (Array.isArray(roundState.cardHistory) && roundState.cardHistory.length > 0) {
      logBody.innerHTML = `<ul>${roundState.cardHistory.map((entry) => `<li>${escapeHtml(entry)}</li>`).join("")}</ul>`;
    } else {
      logBody.innerHTML = '<p class="show-round-copy">No cards drawn yet. Press "Run Auto Race".</p>';
    }
  }

  for (const horse of state.curseRace.horses) {
    const lane = root.querySelector(`[data-show-curse-lane="${horse.id}"]`);
    if (!lane) {
      continue;
    }
    const position = Math.max(0, Math.round(sanitizeNumber(roundState.positions?.[horse.id], 0)));
    const progress = Math.min(100, Math.round((Math.min(position, trackLength) / trackLength) * 100));
    lane.classList.toggle("is-winner", roundState.winnerHorseId === horse.id);

    const posNode = lane.querySelector("[data-show-curse-pos]");
    if (posNode) {
      posNode.textContent = `${position}/${trackLength}`;
    }
    const fillNode = lane.querySelector("[data-show-curse-fill]");
    if (fillNode) {
      fillNode.style.width = `${progress}%`;
    }
    const tokenNode = lane.querySelector("[data-show-curse-token]");
    if (tokenNode) {
      tokenNode.style.left = `${progress}%`;
    }
  }

  const moveButton = root.querySelector('[data-show-action="curse-move"]');
  if (moveButton) {
    moveButton.disabled = raceRunning || Boolean(roundState.winnerHorseId) || roundState.payoutApplied;
    moveButton.textContent = raceRunning ? "Race Running..." : "Run Auto Race";
  }

  const applyButton = root.querySelector('[data-show-action="curse-apply"]');
  if (applyButton) {
    applyButton.disabled = raceRunning || !roundState.winnerHorseId || roundState.payoutApplied;
  }
}

function getCurseTeamBetTotal(roundState, teamKey) {
  const horseIds = state.curseRace.horses.map((horse) => horse.id);
  return horseIds.reduce((sum, horseId) => sum + normalizeOptionalBetAmount(roundState.bets?.[teamKey]?.horseBets?.[horseId]), 0);
}

function getCurseBettorOptions(teamKey, roundState = null) {
  if (!["teamA", "teamB"].includes(teamKey)) {
    return [];
  }
  const safeRoundState = roundState || getOrCreateCurseRoundState();
  const participantKey = teamKey === "teamA" ? "participantsTeamA" : "participantsTeamB";
  const selectedIds = new Set(sanitizeRoundParticipantIds(safeRoundState?.[participantKey], teamKey));
  const selectedPlayers = state.teams[teamKey].players.filter(
    (player) => player.status === "available" && selectedIds.has(player.id)
  );
  const fallbackPlayers = state.teams[teamKey].players.filter((player) => player.status === "available");
  const base = (selectedPlayers.length > 0 ? selectedPlayers : fallbackPlayers).map((player) => ({
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
  const options = getCurseBettorOptions(teamKey, roundState);
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
            <span class="curse-track-start">🚩</span>
            <div class="curse-track-fill" style="width:${percent}%"></div>
            <span class="curse-track-token" style="left:${percent}%">${escapeHtml(horse.symbol)}</span>
            <span class="curse-track-finish">🏁</span>
          </div>
          <p class="muted">${escapeHtml(horse.story)}</p>
        </article>
      `;
    })
    .join("");
}

function renderCurseBetBoard(roundState, options = {}) {
  if (!elements.curseBetBoard) {
    return;
  }
  const disableInputs = options.disableInputs === true;
  const maxBetA = getMaxBetAmount(state.teams.teamA.money, "curse-de-cai");
  const maxBetB = getMaxBetAmount(state.teams.teamB.money, "curse-de-cai");
  const totalBetA = getCurseTeamBetTotal(roundState, "teamA");
  const totalBetB = getCurseTeamBetTotal(roundState, "teamB");
  elements.curseBetBoard.innerHTML = state.curseRace.horses
    .map((horse) => {
      const betA = normalizeOptionalBetAmount(roundState.bets?.teamA?.horseBets?.[horse.id]);
      const betB = normalizeOptionalBetAmount(roundState.bets?.teamB?.horseBets?.[horse.id]);
      const maxForHorseA = Math.max(0, maxBetA - Math.max(0, totalBetA - betA));
      const maxForHorseB = Math.max(0, maxBetB - Math.max(0, totalBetB - betB));
      const disabledAttr = disableInputs ? "disabled" : "";
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
            max="${maxForHorseA}"
            value="${betA}"
            data-curse-bet-team="teamA"
            data-horse-id="${horse.id}"
            ${disabledAttr}
          >
          <input
            class="text-input compact-input"
            type="number"
            min="0"
            step="10"
            max="${maxForHorseB}"
            value="${betB}"
            data-curse-bet-team="teamB"
            data-horse-id="${horse.id}"
            ${disabledAttr}
          >
        </div>
      `;
    })
    .join("");
}

function renderCurseControls(options = {}) {
  const syncShowUi = options.syncShowUi !== false;
  if (
    !elements.curseRoundInput ||
    !elements.curseRuleInfo ||
    !elements.curseWinnerInfo ||
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
  const roundKey = getCurseRoundKey(roundNumber);
  const raceRunning = isCurseRaceRunning(roundKey);

  elements.curseRoundInput.value = String(roundNumber);
  elements.curseRoundInput.disabled = raceRunning;

  const betALabel = totalBetA > maxBetA ? `OVER CAP by ${formatMoney(totalBetA - maxBetA)}` : `${formatMoney(totalBetA)}`;
  const betBLabel = totalBetB > maxBetB ? `OVER CAP by ${formatMoney(totalBetB - maxBetB)}` : `${formatMoney(totalBetB)}`;
  if (elements.curseTeamABetTotal) {
    elements.curseTeamABetTotal.textContent = `${state.teams.teamA.name} total: ${betALabel} / max ${formatMoney(maxBetA)}`;
  }
  if (elements.curseTeamBBetTotal) {
    elements.curseTeamBBetTotal.textContent = `${state.teams.teamB.name} total: ${betBLabel} / max ${formatMoney(maxBetB)}`;
  }

  elements.curseRuleInfo.textContent =
    `Auto race via card draw. No fixed bonus. Only the winning horse bet pays x${state.curseRace.payoutMultiplier}. ` +
    `All other horse bets are lost. Max bet cap stays 30% per team, rounded to ${BET_ROUNDING_STEP}.`;
  const latestCard = Array.isArray(roundState.cardHistory) && roundState.cardHistory.length > 0
    ? roundState.cardHistory[roundState.cardHistory.length - 1]
    : "";
  elements.curseWinnerInfo.textContent = winnerHorse
    ? `Winner detected: ${winnerHorse.symbol} ${winnerHorse.name}.`
    : raceRunning
      ? latestCard
        ? `Race running... ${latestCard}`
        : "Race running... drawing cards."
      : latestCard
        ? `Latest draw: ${latestCard}`
        : "No race run yet. Set bets and run auto race.";
  elements.curseRoundResult.textContent = roundState.lastResult || "Rezultatul cursei va aparea aici.";

  renderCurseTrackBoard(roundState);
  renderCurseBetBoard(roundState, {
    disableInputs: raceRunning || Boolean(roundState.winnerHorseId) || roundState.payoutApplied
  });
  if (elements.curseActiveTeamAList) {
    elements.curseActiveTeamAList.style.display = "none";
  }
  if (elements.curseActiveTeamBList) {
    elements.curseActiveTeamBList.style.display = "none";
  }
  if (elements.curseBettorTeamASelect) {
    elements.curseBettorTeamASelect.style.display = "none";
  }
  if (elements.curseBettorTeamBSelect) {
    elements.curseBettorTeamBSelect.style.display = "none";
  }
  if (elements.curseMoveHorseSelect) {
    const moveHorseGroup = elements.curseMoveHorseSelect.closest("div");
    if (moveHorseGroup) {
      moveHorseGroup.style.display = "none";
    }
  }
  if (elements.curseMoveStepsInput) {
    const moveStepsGroup = elements.curseMoveStepsInput.closest("div");
    if (moveStepsGroup) {
      moveStepsGroup.style.display = "none";
    }
  }

  elements.curseMoveBtn.textContent = raceRunning ? "Race running..." : "Run Auto Race";
  elements.curseMoveBtn.disabled = raceRunning || Boolean(roundState.winnerHorseId) || roundState.payoutApplied;
  elements.curseApplyPayoutBtn.disabled = raceRunning || !roundState.winnerHorseId || roundState.payoutApplied;
  elements.curseResetRaceBtn.disabled = false;
  if (syncShowUi) {
    renderShowUi();
  }
}

function setCurseRound(rawRoundValue) {
  const roundNumber = clampNumber(
    Math.max(1, Math.round(sanitizeNumber(rawRoundValue, state.progress.currentRound))),
    1,
    getGameRoundLimit("curse-de-cai")
  );
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
  if (isCurseRaceRunning(getCurseRoundKey(state.progress.currentRound))) {
    setLastResultSummary("Race is running. Stop/reset race before changing bets.");
    renderCurseControls();
    saveState("Curse bet blocked: race running.");
    return;
  }
  if (roundState.winnerHorseId || roundState.payoutApplied) {
    setLastResultSummary("Race already locked. Reset race to edit bets.");
    renderCurseControls();
    saveState("Curse bet blocked: race already locked.");
    return;
  }
  const nextAmount = normalizeOptionalBetAmount(rawAmount);
  const maxBet = getMaxBetAmount(state.teams[teamKey].money, "curse-de-cai");
  const currentHorseBet = normalizeOptionalBetAmount(roundState.bets[teamKey].horseBets[horseId]);
  const otherHorseTotal = Math.max(0, getCurseTeamBetTotal(roundState, teamKey) - currentHorseBet);
  const allowedForHorse = Math.max(0, maxBet - otherHorseTotal);
  const clampedAmount = Math.min(nextAmount, allowedForHorse);
  roundState.bets[teamKey].horseBets[horseId] = clampedAmount;
  if (nextAmount > clampedAmount) {
    setLastResultSummary(`Bet capped at ${formatMoney(clampedAmount)} for this horse (team max ${formatMoney(maxBet)}).`);
  }
  renderCurseControls();
  saveState("Curse bet updated.");
}

function setCurseBettor(teamKey, bettorId) {
  if (!["teamA", "teamB"].includes(teamKey)) {
    return;
  }
  const roundState = getOrCreateCurseRoundState();
  const options = getCurseBettorOptions(teamKey, roundState);
  const isValid = options.some((option) => option.id === bettorId);
  roundState.bets[teamKey].bettorId = isValid ? bettorId : "";
  renderCurseControls();
  saveState("Curse bettor updated.");
}

function setCurseRoundParticipantSelection(teamKey, playerIds) {
  if (!["teamA", "teamB"].includes(teamKey)) {
    return;
  }
  const roundState = getOrCreateCurseRoundState();
  const key = teamKey === "teamA" ? "participantsTeamA" : "participantsTeamB";
  roundState[key] = sanitizeRoundParticipantIds(playerIds, teamKey);
  roundState.payoutApplied = false;
  roundState.lastResult = "";
  renderShowUi();
}

function toggleCurseRoundParticipant(teamKey, playerId) {
  if (!["teamA", "teamB"].includes(teamKey)) {
    return;
  }
  const roundState = getOrCreateCurseRoundState();
  const key = teamKey === "teamA" ? "participantsTeamA" : "participantsTeamB";
  const current = new Set(sanitizeRoundParticipantIds(roundState[key], teamKey));
  if (current.has(playerId)) {
    current.delete(playerId);
  } else {
    current.add(playerId);
  }
  setCurseRoundParticipantSelection(teamKey, Array.from(current));
  saveState("Curse participants updated.");
}

function selectAllCurseParticipants(teamKey) {
  if (!["teamA", "teamB"].includes(teamKey)) {
    return;
  }
  const allIds = getAvailablePlayersForTeam(teamKey).map((player) => player.id);
  setCurseRoundParticipantSelection(teamKey, allIds);
  saveState("Curse participants set to all available players.");
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

function drawCurseRaceCard() {
  const horses = state.curseRace.horses;
  if (!Array.isArray(horses) || horses.length === 0) {
    return null;
  }
  const deckCard = CURSE_RACE_CARD_DECK[Math.floor(Math.random() * CURSE_RACE_CARD_DECK.length)];
  const horse = horses[Math.floor(Math.random() * horses.length)];
  if (!deckCard || !horse) {
    return null;
  }
  return {
    horseId: horse.id,
    horse,
    steps: Math.max(1, Math.round(sanitizeNumber(deckCard.steps, 1))),
    label: deckCard.label,
    emoji: deckCard.emoji
  };
}

function applyCurseHorseMove(roundState, horseId, rawSteps) {
  const steps = Math.max(1, Math.round(sanitizeNumber(rawSteps, 1)));
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
  return {
    movedHorse,
    winnerHorse,
    pushedBack,
    movedPosition,
    steps
  };
}

function runCurseRaceAuto() {
  ensureCurseRoundContext();
  const roundNumber = Math.max(1, Math.round(sanitizeNumber(state.progress.currentRound, 1)));
  const roundKey = getCurseRoundKey(roundNumber);
  const roundState = getOrCreateCurseRoundState(roundNumber);
  if (roundState.winnerHorseId) {
    setLastResultSummary("Race already has a winner. Start next race or reset this one.");
    renderCurseControls();
    saveState("Curse auto-run blocked: race already finished.");
    return false;
  }
  if (roundState.payoutApplied) {
    setLastResultSummary("Payout already applied. Move to next race or reset this one.");
    renderCurseControls();
    saveState("Curse auto-run blocked: payout already applied.");
    return false;
  }
  if (isCurseRaceRunning(roundKey)) {
    setLastResultSummary("Race already running...");
    renderCurseControls();
    saveState("Curse auto-run blocked: already running.");
    return false;
  }
  if (isCurseRaceRunning()) {
    stopCurseRaceSimulation({ render: false, persist: false });
  }

  const maxTurns = Math.max(20, state.curseRace.trackLength * 8);
  let turn = 0;
  const renderRaceFrame = (activeRoundState, raceRunning) => {
    if (state.activeSection === "curse-de-cai") {
      renderCurseControls({ syncShowUi: false });
    }
    updateCurseOverlayRaceFrame(activeRoundState, { raceRunning });
  };

  const finishRace = (activeRoundState, saveReason) => {
    const winnerHorse = state.curseRace.horses.find((horse) => horse.id === activeRoundState.winnerHorseId);
    const trackLength = Math.max(1, Math.round(sanitizeNumber(state.curseRace.trackLength, 1)));
    if (winnerHorse?.id) {
      activeRoundState.positions[winnerHorse.id] = Math.max(
        trackLength,
        Math.round(sanitizeNumber(activeRoundState.positions?.[winnerHorse.id], trackLength))
      );
    }
    const headline = winnerHorse
      ? `Race finished: ${winnerHorse.symbol} ${winnerHorse.name} won after ${turn} card draws.`
      : `Race finished after ${turn} draws.`;
    stopCurseRaceSimulation({ render: false, persist: false });
    renderRaceFrame(activeRoundState, false);
    setLastResultSummary(headline);
    curseRaceRuntime.finishTimeoutId = window.setTimeout(() => {
      curseRaceRuntime.finishTimeoutId = null;
      const stillSameGame = state.progress.currentGame === "curse-de-cai";
      const stillSameRound = getCurseRoundKey(state.progress.currentRound) === roundKey;
      if (!stillSameGame || !stillSameRound) {
        renderCurseControls();
        saveState(saveReason);
        return;
      }
      if (state.progress.currentGame === "curse-de-cai") {
        setLiveRoundStep("winner-screen", { persist: false });
        setShowScreen("live-round", { persist: false });
      }
      renderCurseControls();
      saveState(saveReason);
    }, CURSE_RACE_FINISH_REVEAL_DELAY_MS);
  };

  curseRaceRuntime.intervalId = null;
  curseRaceRuntime.isRunning = true;
  curseRaceRuntime.roundKey = roundKey;
  setLastResultSummary("Race started. Cards are now drawing live...");
  renderRaceFrame(roundState, true);

  curseRaceRuntime.intervalId = window.setInterval(() => {
    if (!isCurseRaceRunning(roundKey)) {
      stopCurseRaceSimulation({ render: false, persist: false });
      return;
    }

    const activeRoundKey = getCurseRoundKey(state.progress.currentRound);
    if (state.progress.currentGame !== "curse-de-cai" || activeRoundKey !== roundKey) {
      stopCurseRaceSimulation({ render: false, persist: false });
      return;
    }

    const activeRoundState = getOrCreateCurseRoundState(state.progress.currentRound);
    if (activeRoundState.payoutApplied) {
      stopCurseRaceSimulation({ render: false, persist: false });
      renderRaceFrame(activeRoundState, false);
      return;
    }

    if (activeRoundState.winnerHorseId) {
      finishRace(activeRoundState, "Curse auto race finished.");
      return;
    }

    turn += 1;
    const drawn = drawCurseRaceCard();
    if (!drawn) {
      stopCurseRaceSimulation({
        render: true,
        persist: true,
        summary: "Race stopped: no draw available.",
        reason: "Curse auto race stopped: no card draw."
      });
      return;
    }

    const move = applyCurseHorseMove(activeRoundState, drawn.horseId, drawn.steps);
    const pushedLabel =
      move.pushedBack.length > 0
        ? ` | push-back: ${move.pushedBack.map((horse) => `${horse.symbol} ${horse.name}`).join(", ")}`
        : "";
    const winnerLabel = move.winnerHorse ? ` | winner: ${move.winnerHorse.symbol} ${move.winnerHorse.name}` : "";
    pushCurseCardHistoryEntry(
      activeRoundState,
      `${drawn.emoji} ${drawn.label}: ${drawn.horse.symbol} ${drawn.horse.name} +${drawn.steps}${pushedLabel}${winnerLabel}`
    );

    if (!activeRoundState.winnerHorseId && turn >= maxTurns) {
      const leader = state.curseRace.horses
        .map((horse) => ({
          horse,
          position: Math.max(0, Math.round(sanitizeNumber(activeRoundState.positions?.[horse.id], 0)))
        }))
        .sort((left, right) => right.position - left.position)[0];
      activeRoundState.winnerHorseId = leader?.horse?.id || "";
      if (activeRoundState.winnerHorseId) {
        const leaderHorse = leader.horse;
        pushCurseCardHistoryEntry(
          activeRoundState,
          `🏁 Max draws reached. Leader wins: ${leaderHorse.symbol} ${leaderHorse.name}.`
        );
      }
    }

    renderRaceFrame(activeRoundState, !activeRoundState.winnerHorseId);
    if (activeRoundState.winnerHorseId) {
      finishRace(activeRoundState, "Curse auto race finished.");
    }
  }, CURSE_RACE_TICK_MS);

  saveState("Curse auto race started.");
  return true;
}

function moveCurseHorseBySymbol() {
  return runCurseRaceAuto();
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
  if (isCurseRaceRunning(getCurseRoundKey(state.progress.currentRound))) {
    setLastResultSummary("Race is still running. Wait for winner, then apply payout.");
    renderCurseControls();
    saveState("Curse payout blocked: race running.");
    return false;
  }
  if (!roundState.winnerHorseId) {
    setLastResultSummary("No winner detected yet. Run auto race first.");
    renderCurseControls();
    saveState("Curse payout blocked: no winner.");
    return false;
  }
  if (roundState.payoutApplied) {
    setLastResultSummary("Payout already applied for this race.");
    renderCurseControls();
    saveState("Curse payout blocked: already applied.");
    return false;
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
  const selectedParticipantsA = getActiveParticipantsForTeam("teamA");
  const selectedParticipantsB = getActiveParticipantsForTeam("teamB");
  const fallbackParticipantsA = getAvailablePlayersForTeam("teamA").map((player) => ({
    id: player.id,
    displayName: player.name,
    teamKey: "teamA"
  }));
  const fallbackParticipantsB = getAvailablePlayersForTeam("teamB").map((player) => ({
    id: player.id,
    displayName: player.name,
    teamKey: "teamB"
  }));
  applyRoundPlayerStats({
    gameId: "curse-de-cai",
    teamA: {
      participants: selectedParticipantsA.length > 0 ? selectedParticipantsA : fallbackParticipantsA,
      roundOutcome: teamAOutcome,
      teamNetDelta: settlement.netA,
      teamBetAmount: settlement.teamATotalBet,
      betOutcome: teamABetOutcome
    },
    teamB: {
      participants: selectedParticipantsB.length > 0 ? selectedParticipantsB : fallbackParticipantsB,
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
  return true;
}

function resetCurseRace() {
  ensureCurseRoundContext();
  stopCurseRaceSimulation({ render: false, persist: false });
  const roundState = getOrCreateCurseRoundState();
  for (const horse of state.curseRace.horses) {
    roundState.positions[horse.id] = 0;
    roundState.bets.teamA.horseBets[horse.id] = 0;
    roundState.bets.teamB.horseBets[horse.id] = 0;
  }
  roundState.moveHorseId = state.curseRace.horses[0]?.id || "";
  roundState.moveSteps = 1;
  roundState.winnerHorseId = "";
  roundState.cardHistory = [];
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
  triviaRoundState.betDelta = 0;
  triviaRoundState.bonusDelta = 0;
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
    safeRound.betDelta = 0;
    safeRound.bonusDelta = 0;
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
  triviaRoundState.betDelta = 0;
  triviaRoundState.bonusDelta = 0;
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
  const answer = sanitizeString(category?.answer, "Raspuns demo").trim() || "Raspuns demo";
  let options = rawOptions.length >= 2 ? rawOptions : [answer, "Optiunea B", "Optiunea C", "Optiunea D"];

  const seen = new Set();
  options = options.filter((option) => {
    const key = normalizeTextToken(option);
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });

  if (!options.some((option) => normalizeTextToken(option) === normalizeTextToken(answer))) {
    options.unshift(answer);
  }

  if (options.length > 4) {
    const top = options.slice(0, 4);
    const hasAnswer = top.some((option) => normalizeTextToken(option) === normalizeTextToken(answer));
    options = hasAnswer ? top : [answer, ...top.slice(0, 3)];
  }

  while (options.length < 4) {
    const nextLabel = String.fromCharCode(65 + options.length);
    options.push(`Optiunea ${nextLabel}`);
  }
  return options;
}

function getTriviaCorrectOptionIndex(category) {
  const options = getTriviaCategoryOptions(category);
  let index = Math.round(
    sanitizeNumber(category?.correctAnswerIndex, sanitizeNumber(category?.correctOptionIndex, -1))
  );
  if (index < 0 || index >= options.length) {
    const answer = sanitizeString(category?.answer, "").trim();
    index = options.findIndex((option) => normalizeTextToken(option) === normalizeTextToken(answer));
  }
  if (index < 0 || index >= options.length) {
    index = 0;
  }
  return index;
}

function getTriviaCategoryQuestion(category) {
  const question = sanitizeString(category?.question, "").trim();
  if (question.length > 0) {
    return question;
  }
  const title = sanitizeString(category?.title, "").trim() || "Trivia";
  return `Intrebare lipsa pentru ${title}. Reset topics daca banca este corupta.`;
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
  triviaRoundState.betDelta = 0;
  triviaRoundState.bonusDelta = 0;
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
  setOverlayAnswerLocked(false, { persist: false });
  setLiveRoundStep("question-screen", { persist: false });
  setLastResultSummary(`${playingTeam.name} confirmed bet ${formatMoney(triviaRoundState.betAmount)}.`);
  renderShowUi();
  saveState("Trivia bet confirmed.");
}

function startTriviaQuestionRound() {
  const triviaRoundState = getOrCreateTriviaRoundState();
  if (!triviaRoundState.selectedCategoryId) {
    setLastResultSummary("Selecteaza topicul inainte sa continui.");
    renderShowUi();
    saveState("Trivia start blocked: no topic.");
    return;
  }
  setOverlayAnswerLocked(false, { persist: false });
  setLiveRoundStep("question-screen", { persist: false });
  setLastResultSummary("Trivia round started.");
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
  nextRoundState.betDelta = 0;
  nextRoundState.bonusDelta = 0;
  nextRoundState.lastDelta = 0;
  nextRoundState.resultCategoryId = "";
  nextRoundState.lastResult = "";

  setOverlayAnswerLocked(false, { persist: false });
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
  if (triviaRoundState.resultChecked) {
    setLastResultSummary("Trivia result already applied for this round.");
    renderTriviaControls();
    renderShowUi();
    saveState("Trivia apply blocked: payout already applied.");
    return false;
  }
  const selectedCategory = state.trivia.categories.find((entry) => entry.id === triviaRoundState.selectedCategoryId);
  if (!selectedCategory) {
    setLastResultSummary("Selecteaza un topic valid inainte de rezultat.");
    renderTriviaControls();
    renderShowUi();
    saveState("Trivia result blocked: no category selected.");
    return false;
  }

  const playingTeamKey = triviaRoundState.teamKey;
  const playingTeam = state.teams[playingTeamKey];
  const bonus = getStandardFixedBonus("trivia");
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
    return false;
  }

  const effectiveBet = Math.min(normalizedBet, maxAllowedBet);
  triviaRoundState.betAmount = effectiveBet;
  if (elements.triviaBetAmountInput) {
    elements.triviaBetAmountInput.value = String(effectiveBet);
  }
  const teamDelta = isCorrect ? effectiveBet + bonus : -effectiveBet;
  const betDelta = isCorrect ? effectiveBet : -effectiveBet;
  const bonusDelta = isCorrect ? bonus : 0;
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
  triviaRoundState.betDelta = betDelta;
  triviaRoundState.bonusDelta = bonusDelta;
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
  return true;
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
  const targetRound = clampNumber(
    Math.max(1, Math.round(sanitizeNumber(nextRound, 1))),
    1,
    getGameRoundLimit(nextGameId)
  );
  if (isCurseRaceRunning() && (nextGameId !== "curse-de-cai" || curseRaceRuntime.roundKey !== getCurseRoundKey(targetRound))) {
    stopCurseRaceSimulation({ render: false, persist: false });
  }
  saveCurrentRoundSnapshot();

  state.progress.currentGame = nextGameId;
  state.progress.currentRound = targetRound;
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
  const nextRound = clampNumber(
    Math.max(1, Math.round(sanitizeNumber(nextRoundValue, state.progress.currentRound))),
    1,
    getGameRoundLimit(state.progress.currentGame)
  );
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
  setLastResultSummary("Special assignment is disabled. Use normal lineup tokens for all players.");
  renderRoundSelection();
  saveState("Legacy special assignment ignored.");
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

function resetSession() {
  const accepted = window.confirm("Reset all dashboard data and restore demo sample content?");
  if (!accepted) {
    return;
  }
  stopCurseRaceSimulation({ render: false, persist: false });
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
    elements.showScreenContent.addEventListener("keydown", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      if (event.key === "Enter" && target.matches("[data-show-roster-add-name]")) {
        const teamKey = target.getAttribute("data-team");
        if (["teamA", "teamB"].includes(teamKey)) {
          event.preventDefault();
          addPlayer(teamKey, target, { ignoreLock: true });
        }
        return;
      }

      if (event.key === "Enter" && target.matches("[data-show-team-name]")) {
        event.preventDefault();
        target.blur();
      }
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
      state.trivia.fixedBonus = getStandardFixedBonus("trivia");
      elements.triviaFixedBonusInput.value = String(state.trivia.fixedBonus);
      elements.triviaFixedBonusInput.disabled = true;
      setLastResultSummary(`Trivia fixed bonus is locked at ${formatMoney(state.trivia.fixedBonus)}.`);
      renderTriviaControls();
      renderSettingsRulesSnapshot();
      saveState("Trivia fixed bonus remains locked.");
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
      const roundState = getOrCreatePretulRoundState();
      const selectedItem = state.pretul.items.find((item) => item.id === roundState.selectedItemId);
      roundState.realPrice = getPretulItemActualPrice(selectedItem);
      renderPretulControls();
      saveState("Pretul real price remains item-sourced.");
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
  if (elements.samsarBetTeamAInput) {
    elements.samsarBetTeamAInput.addEventListener("change", () => {
      setSamsarBet("teamA", elements.samsarBetTeamAInput.value);
    });
  }
  if (elements.samsarBetTeamBInput) {
    elements.samsarBetTeamBInput.addEventListener("change", () => {
      setSamsarBet("teamB", elements.samsarBetTeamBInput.value);
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
  renderAll();
  bindEvents();
  saveState("Autosave active.");
}

init();


