export const RANKS = [
  { id: "cuivre", name: "CUIVRE", min: 1000, max: 1999, color: "#c17840", description: "Premiers pas sur le court. Chaque match est une lecon." },
  { id: "bronze", name: "BRONZE", min: 2000, max: 2999, color: "#a0692a", description: "Les bases sont acquises. Le jeu commence a prendre forme." },
  { id: "argent", name: "ARGENT", min: 3000, max: 3999, color: "#c0c0c0", description: "Joueur solide avec une bonne lecture du jeu." },
  { id: "gold", name: "GOLD", min: 4000, max: 4999, color: "#ffd700", description: "Maitrise technique et tactique reconnue." },
  { id: "platine", name: "PLATINE", min: 5000, max: 5999, color: "#9db8cc", description: "Niveau competitif eleve. Adversaire redoutable." },
  { id: "diamant", name: "DIAMANT", min: 6000, max: 6999, color: "#5bb8f5", description: "Excellence sur tous les aspects du jeu." },
  { id: "emeraude", name: "\u00c9MERAUDE", min: 7000, max: 7999, color: "#2ecc71", description: "Joueur d'elite. Chaque point est une masterclass." },
  { id: "rubis", name: "RUBIS", min: 8000, max: 8999, color: "#e74c3c", description: "Parmi les meilleurs. Talent exceptionnel." },
  { id: "champion", name: "CHAMPION", min: 9000, max: 9999, color: "#9b59b6", description: "Le sommet est proche. Legende en devenir." },
  { id: "elite", name: "ELITE", min: 10000, max: 10000, color: "#f39c12", description: "Le pantheon du padel. La perfection incarnee." },
] as const

export type RankInfo = (typeof RANKS)[number]

export function getRank(elo: number): RankInfo {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (elo >= RANKS[i].min) return RANKS[i]
  }
  return RANKS[0]
}

export function getRankById(id: string): RankInfo {
  return RANKS.find(r => r.id === id) ?? RANKS[0]
}

export function getNextRank(elo: number): RankInfo | null {
  const currentIndex = RANKS.findIndex((r, i) =>
    i === RANKS.length - 1 ? elo >= r.min : elo >= r.min && elo < RANKS[i + 1].min
  )
  if (currentIndex === RANKS.length - 1) return null
  return RANKS[currentIndex + 1]
}

export function getRankProgress(elo: number): number {
  const rank = getRank(elo)
  const next = getNextRank(elo)
  if (!next) return 100
  return Math.round(((elo - rank.min) / (next.min - rank.min)) * 100)
}

// French cities list
export const FRENCH_CITIES = [
  "Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Nantes", "Montpellier", "Strasbourg",
  "Bordeaux", "Lille", "Rennes", "Reims", "Le Havre", "Saint-Etienne", "Toulon", "Grenoble",
  "Dijon", "Angers", "Nimes", "Villeurbanne", "Le Mans", "Aix-en-Provence", "Brest", "Limoges",
  "Tours", "Amiens", "Metz", "Perpignan", "Besancon", "Orleans", "Rouen", "Mulhouse", "Caen",
  "Nancy", "Argenteuil", "Montreuil", "Roubaix", "Dunkerque", "Tourcoing", "Avignon", "Nanterre",
  "Vitry-sur-Seine", "Poitiers", "Creteil", "Pau", "Versailles", "Clermont-Ferrand", "Saint-Denis",
  "Boulogne-Billancourt", "Calais",
] as const

export const TEAM_EMOJIS = [
  "🦅", "🐺", "🦁", "🦈", "🔥", "⚡", "💎", "👑", "🎯", "🏆",
  "🐍", "🦊", "💠", "🛡", "⚔️", "🎾", "🥊", "🚀", "🌊", "🔱",
] as const

export const CURRENT_PLAYER_ARENA_ID = "PA-TN27ACE8"

export const MOCK_PLAYERS_BY_ARENA_ID: Record<string, {
  name: string
  elo: number
  city: string
  avatarGradient: [string, string]
}> = {
  "PA-MP4420": {
    name: "MaxPower",
    elo: 4420,
    city: "Lyon",
    avatarGradient: ["#ff6b35", "#ffaa00"],
  },
}

// Player
export const CURRENT_PLAYER = {
  id: "p1",
  name: "TennisAce27",
  elo: 4280,
  city: "Lyon",
  winRate: 63,
  streak: 4,
  mvpCount: 12,
  trust: 94,
  matchesPlayed: 47,
  victories: 30,
  bestStreak: 7,
  peakElo: 4520,
  avatarGradient: ["#00e5a0", "#0088ff"],
  eloHistory: [3800, 3850, 3920, 3880, 3950, 4020, 4000, 4050, 4100, 4080, 4120, 4180, 4150, 4200, 4240, 4210, 4250, 4280, 4300, 4260, 4280, 4320, 4300, 4340, 4310, 4280, 4300, 4260, 4280, 4280],
}

// Team
export const CURRENT_TEAM = {
  id: "t1",
  name: "Les Aigles",
  emoji: "\u{1F985}",
  elo: 4350,
  wins: 18,
  draws: 9,
  streak: 3,
  members: [
    { ...CURRENT_PLAYER },
    {
      id: "p2",
      name: "SkySmash",
      elo: 4420,
      city: "Lyon",
      winRate: 65,
      streak: 2,
      mvpCount: 8,
      trust: 97,
      matchesPlayed: 42,
      victories: 27,
      bestStreak: 5,
      peakElo: 4600,
      avatarGradient: ["#ff6b35", "#ff3d71"],
      eloHistory: [],
    },
  ],
}

// Recent matches
export const RECENT_MATCHES = [
  { id: "m1", opponent: "Ibiza Boys", opponentEmoji: "\u{1F3DD}", result: "W", score: "6-4 / 6-3", eloDelta: 18, date: "2025-01-15" },
  { id: "m2", opponent: "Smasheurs", opponentEmoji: "\u{1F4A5}", result: "W", score: "7-5 / 6-2", eloDelta: 14, date: "2025-01-14" },
  { id: "m3", opponent: "Diamondback", opponentEmoji: "\u{1F48E}", result: "L", score: "4-6 / 3-6", eloDelta: -11, date: "2025-01-13" },
  { id: "m4", opponent: "Force 5000", opponentEmoji: "\u{26A1}", result: "W", score: "6-1 / 6-4", eloDelta: 22, date: "2025-01-12" },
  { id: "m5", opponent: "Alpha Padel", opponentEmoji: "\u{1F43A}", result: "W", score: "6-3 / 7-5", eloDelta: 9, date: "2025-01-11" },
  { id: "m6", opponent: "Pack Wolves", opponentEmoji: "\u{1F43A}", result: "W", score: "6-2 / 6-4", eloDelta: 12, date: "2025-01-10" },
]

export type LeaderboardPlayer = {
  id: string
  rank: number
  name: string
  elo: number
  rankId: string
  wr: number
  avatar: string
  isMe?: boolean
}

// Leaderboard
export const LEADERBOARD: LeaderboardPlayer[] = [
  { id: "l1", rank: 1, name: "AceKing", elo: 10000, rankId: "elite", wr: 89, avatar: "#f39c12" },
  { id: "l2", rank: 2, name: "GodPadel", elo: 9800, rankId: "elite", wr: 85, avatar: "#f39c12" },
  { id: "l3", rank: 3, name: "LegendX", elo: 9500, rankId: "elite", wr: 82, avatar: "#e67e22" },
  { id: "l4", rank: 4, name: "ChampKing", elo: 9300, rankId: "champion", wr: 81, avatar: "#9b59b6" },
  { id: "l5", rank: 5, name: "PurpleRazer", elo: 9100, rankId: "champion", wr: 78, avatar: "#8e44ad" },
  { id: "l6", rank: 6, name: "SmashX", elo: 7840, rankId: "emeraude", wr: 71, avatar: "#2ecc71" },
  { id: "l7", rank: 7, name: "NinjaJump", elo: 7390, rankId: "emeraude", wr: 68, avatar: "#27ae60" },
  { id: "l8", rank: 8, name: "RubyKiller", elo: 8600, rankId: "rubis", wr: 75, avatar: "#e74c3c" },
  { id: "l9", rank: 9, name: "RedPhoenix", elo: 8200, rankId: "rubis", wr: 72, avatar: "#c0392b" },
  { id: "l10", rank: 10, name: "DiamondRush", elo: 6810, rankId: "diamant", wr: 72, avatar: "#5bb8f5" },
  { id: "l11", rank: 11, name: "FlexGoat", elo: 6540, rankId: "diamant", wr: 68, avatar: "#2980b9" },
  { id: "l12", rank: 12, name: "PlatinumTiger", elo: 5890, rankId: "platine", wr: 61, avatar: "#9db8cc" },
  { id: "l13", rank: 13, name: "SteelFox", elo: 5400, rankId: "platine", wr: 58, avatar: "#7f8c8d" },
  { id: "l14", rank: 14, name: "GoldMaster", elo: 4900, rankId: "gold", wr: 65, avatar: "#f1c40f" },
  { id: "l15", rank: 15, name: "GoldenAce", elo: 4600, rankId: "gold", wr: 62, avatar: "#d4ac0d" },
  { id: "l16", rank: 41, name: "TennisAce27", elo: 4280, rankId: "gold", wr: 63, avatar: "#ffd700", isMe: true },
  { id: "l17", rank: 42, name: "SilverWolf", elo: 3800, rankId: "argent", wr: 55, avatar: "#bdc3c7" },
  { id: "l18", rank: 43, name: "ArgentBlade", elo: 3400, rankId: "argent", wr: 52, avatar: "#95a5a6" },
  { id: "l19", rank: 44, name: "BronzeShield", elo: 2800, rankId: "bronze", wr: 48, avatar: "#cd7f32" },
  { id: "l20", rank: 45, name: "CopperFist", elo: 1500, rankId: "cuivre", wr: 40, avatar: "#c17840" },
]

// Local leaderboard data per city
export const LOCAL_LEADERBOARD: Record<string, LeaderboardPlayer[]> = {
  Lyon: [
    { id: "ll1", rank: 1, name: "NinjaJump", elo: 7390, rankId: "emeraude", wr: 69, avatar: "#b9f2ff" },
    { id: "ll2", rank: 2, name: "WolfAlpha", elo: 4510, rankId: "gold", wr: 67, avatar: "#c0c0c0" },
    { id: "ll3", rank: 3, name: "SkySmash", elo: 4420, rankId: "gold", wr: 65, avatar: "#ff6b35" },
    { id: "ll4", rank: 4, name: "TennisAce27", elo: 4280, rankId: "gold", wr: 63, avatar: "#00e5a0", isMe: true },
    { id: "ll5", rank: 5, name: "LionKing", elo: 4180, rankId: "gold", wr: 60, avatar: "#ffd700" },
    { id: "ll6", rank: 6, name: "PrideFury", elo: 3920, rankId: "argent", wr: 56, avatar: "#ff6b35" },
    { id: "ll7", rank: 7, name: "BetaHowl", elo: 3800, rankId: "argent", wr: 52, avatar: "#a0692a" },
  ],
  Paris: [
    { id: "lp1", rank: 1, name: "VenomStrike", elo: 8200, rankId: "rubis", wr: 74, avatar: "#e74c3c" },
    { id: "lp2", rank: 2, name: "ToxicBlade", elo: 6100, rankId: "platine", wr: 63, avatar: "#9b59b6" },
    { id: "lp3", rank: 3, name: "ParisElite", elo: 5800, rankId: "platine", wr: 61, avatar: "#ffd700" },
    { id: "lp4", rank: 4, name: "CourtRoi", elo: 5200, rankId: "platine", wr: 58, avatar: "#00e5a0" },
    { id: "lp5", rank: 5, name: "SmashParis", elo: 4900, rankId: "gold", wr: 55, avatar: "#5bb8f5" },
  ],
  Marseille: [
    { id: "lm1", rank: 1, name: "SmashX", elo: 7840, rankId: "emeraude", wr: 71, avatar: "#50c878" },
    { id: "lm2", rank: 2, name: "SharkBite", elo: 5300, rankId: "platine", wr: 59, avatar: "#5bb8f5" },
    { id: "lm3", rank: 3, name: "DeepBlue", elo: 4800, rankId: "gold", wr: 56, avatar: "#9db8cc" },
    { id: "lm4", rank: 4, name: "PradoKing", elo: 4200, rankId: "gold", wr: 53, avatar: "#ffd700" },
  ],
}

// Padel clubs by city
export const CLUBS = [
  // Lyon
  { id: "padel-parc-lyon", name: "Padel Parc Lyon Gerland", city: "Lyon", address: "35 Av. Jean Jaures, 69007" },
  { id: "ok-padel-lyon", name: "OK Padel Part-Dieu", city: "Lyon", address: "22 Rue Bonnel, 69003" },
  { id: "padel-indoor-lyon", name: "Padel Indoor Lyon Vaise", city: "Lyon", address: "4 Rue du Docteur Crestin, 69009" },
  // Paris
  { id: "roland-garros-padel", name: "Roland Garros Padel Club", city: "Paris", address: "2 Av. Gordon Bennett, 75016" },
  { id: "padel-club-paris-15", name: "Padel Club Paris XV", city: "Paris", address: "2 Rue Louis Armand, 75015" },
  { id: "w-padel-paris", name: "W Padel Paris Nation", city: "Paris", address: "37 Rue du Rendez-vous, 75012" },
  // Marseille
  { id: "padel-prado", name: "Padel Club Marseille Prado", city: "Marseille", address: "11 Bd Michelet, 13008" },
  { id: "olympique-padel", name: "Olympique Padel Center", city: "Marseille", address: "23 Av. du Prado, 13006" },
  // Nice
  { id: "nice-padel", name: "Nice Cote d'Azur Padel", city: "Nice", address: "5 Prom. des Anglais, 06000" },
  // Bordeaux
  { id: "bordeaux-padel", name: "Bordeaux Padel Club Lac", city: "Bordeaux", address: "15 Av. du Parc, 33300" },
  // Toulouse
  { id: "toulouse-padel", name: "Toulouse Padel Arena", city: "Toulouse", address: "12 Rue de Periole, 31500" },
  // Lille
  { id: "lille-padel", name: "Lille Padel Grand Stade", city: "Lille", address: "261 Bd de Tournai, 59650" },
  // Nantes
  { id: "nantes-padel", name: "Nantes Padel Club", city: "Nantes", address: "3 Rue des Dervalieres, 44100" },
  // Strasbourg
  { id: "strasbourg-padel", name: "Strasbourg Padel Center", city: "Strasbourg", address: "8 Allee de la Robertsau, 67000" },
  // Montpellier
  { id: "montpellier-padel", name: "Montpellier Padel Park", city: "Montpellier", address: "21 Rue de la Carrierasse, 34000" },
  // Grenoble
  { id: "grenoble-padel", name: "Grenoble Padel Club", city: "Grenoble", address: "4 Av. de Vizille, 38000" },
  // Rennes
  { id: "rennes-padel", name: "Rennes Padel Arena", city: "Rennes", address: "2 Allee de la Prefecture, 35000" },
  // Aix-en-Provence
  { id: "aix-padel", name: "Aix Padel Club", city: "Aix-en-Provence", address: "15 Av. des Belges, 13100" },
] as const

export type TeamStatus = "en_attente" | "en_ligne" | "en_match" | "hors_ligne"

export const TEAM_STATUSES = [
  { id: "en_attente" as const, label: "En attente", color: "#00e5a0", desc: "Cherche un adversaire, disponible pour jouer" },
  { id: "en_ligne" as const, label: "En ligne", color: "#3b82f6", desc: "Connecte mais pas encore en recherche" },
  { id: "en_match" as const, label: "En match", color: "#ffaa00", desc: "Match en cours, non disponible" },
  { id: "hors_ligne" as const, label: "Hors ligne", color: "#606080", desc: "Non connecte" },
] as const

export function getTeamStatus(id: TeamStatus) {
  return TEAM_STATUSES.find(s => s.id === id) ?? TEAM_STATUSES[3]
}

export type MatchmakingTeam = {
  id: string
  name: string
  emoji: string
  status: TeamStatus
  city: string
  club: string
  elo: number
  rankId: string
  day: string | null
  timeSlot: string | null
  court: string | null
  estimatedGain: number
  estimatedLoss: number
}

// Matchmaking teams with availability
export const MATCHMAKING_TEAMS: MatchmakingTeam[] = [
  { id: "mt1", name: "Pack Wolves", emoji: "\u{1F43A}", status: "en_attente", city: "Lyon", club: "Padel Parc Lyon Gerland", elo: 4510, rankId: "gold", day: "Aujourd'hui", timeSlot: "18h00-19h30", court: "Court 2", estimatedGain: 15, estimatedLoss: -12 },
  { id: "mt2", name: "Lyon Lions", emoji: "\u{1F981}", status: "en_attente", city: "Lyon", club: "OK Padel Part-Dieu", elo: 4180, rankId: "gold", day: "Demain", timeSlot: "19h00-20h30", court: "Court 1", estimatedGain: 10, estimatedLoss: -18 },
  { id: "mt3", name: "Les D\u00e9butants", emoji: "\u{1F3BE}", status: "en_attente", city: "Lyon", club: "Padel Indoor Lyon Vaise", elo: 1200, rankId: "cuivre", day: "Aujourd'hui", timeSlot: "10h00-11h30", court: "Court 3", estimatedGain: 8, estimatedLoss: -5 },
  { id: "mt4", name: "Bronze Squad", emoji: "\u{1F949}", status: "en_attente", city: "Paris", club: "W Padel Paris Nation", elo: 2400, rankId: "bronze", day: "Mer. 21 mai", timeSlot: "14h00-15h30", court: "Court 1", estimatedGain: 12, estimatedLoss: -10 },
  { id: "mt5", name: "Silver Blades", emoji: "\u2694\uFE0F", status: "en_attente", city: "Bordeaux", club: "Bordeaux Padel Club Lac", elo: 3600, rankId: "argent", day: "Jeu. 22 mai", timeSlot: "17h00-18h30", court: "Court 2", estimatedGain: 14, estimatedLoss: -11 },
  { id: "mt6", name: "Platine FC", emoji: "\u{1F6E1}", status: "en_ligne", city: "Toulouse", club: "Toulouse Padel Arena", elo: 5200, rankId: "platine", day: "Ven. 23 mai", timeSlot: "20h00-21h30", court: "Court 1", estimatedGain: 16, estimatedLoss: -14 },
  { id: "mt7", name: "Crystal Boys", emoji: "\u{1F48E}", status: "en_ligne", city: "Marseille", club: "Olympique Padel Center", elo: 6400, rankId: "diamant", day: "Sam. 24 mai", timeSlot: "09h00-10h30", court: "Court 2", estimatedGain: 18, estimatedLoss: -16 },
  { id: "mt8", name: "Emerald Kings", emoji: "\u{1F49A}", status: "en_ligne", city: "Nice", club: "Nice C\u00f4te d'Azur Padel", elo: 7200, rankId: "emeraude", day: "Aujourd'hui", timeSlot: "11h00-12h30", court: "Court 3", estimatedGain: 20, estimatedLoss: -18 },
  { id: "mt9", name: "Ruby Fire", emoji: "\u{1F525}", status: "en_ligne", city: "Strasbourg", club: "Strasbourg Padel Center", elo: 8100, rankId: "rubis", day: "Demain", timeSlot: "16h00-17h30", court: "Court 1", estimatedGain: 22, estimatedLoss: -20 },
  { id: "mt10", name: "Fox Team", emoji: "\u{1F98A}", status: "en_ligne", city: "Lille", club: "Lille Padel Grand Stade", elo: 4720, rankId: "gold", day: "Lun. 19 mai", timeSlot: "18h30-20h00", court: "Court 2", estimatedGain: 14, estimatedLoss: -13 },
  { id: "mt11", name: "Champions Club", emoji: "\u{1F451}", status: "en_match", city: "Paris", club: "Roland Garros Padel Club", elo: 9300, rankId: "champion", day: "Aujourd'hui", timeSlot: "15h00-16h30", court: "Court 1", estimatedGain: 25, estimatedLoss: -22 },
  { id: "mt12", name: "Elite Force", emoji: "\u26A1", status: "en_match", city: "Paris", club: "Padel Club Paris XV", elo: 10000, rankId: "elite", day: "Aujourd'hui", timeSlot: "19h00-20h30", court: "Court 3", estimatedGain: 28, estimatedLoss: -25 },
  { id: "mt13", name: "Shark Attack", emoji: "\u{1F988}", status: "en_match", city: "Marseille", club: "Padel Club Marseille Prado", elo: 4290, rankId: "gold", day: "Aujourd'hui", timeSlot: "17h30-19h00", court: "Court 2", estimatedGain: 13, estimatedLoss: -14 },
  { id: "mt14", name: "Venom Squad", emoji: "\u{1F40D}", status: "hors_ligne", city: "Paris", club: "Roland Garros Padel Club", elo: 4060, rankId: "gold", day: null, timeSlot: null, court: null, estimatedGain: 8, estimatedLoss: -20 },
  { id: "mt15", name: "Ghost Riders", emoji: "\u{1F47B}", status: "hors_ligne", city: "Grenoble", club: "Grenoble Padel Club", elo: 3100, rankId: "argent", day: null, timeSlot: null, court: null, estimatedGain: 10, estimatedLoss: -15 },
]

export const MOCK_CHAT_MESSAGES: Record<string, Array<{ from: "them" | "me"; text: string; time: string }>> = {
  mt1: [
    { from: "them", text: "Salut ! Dispo ce soir \u00e0 18h au Padel Parc Gerland, Court 2 ?", time: "18:32" },
    { from: "me", text: "Oui nickel, on confirme ? \u{1F4AA}", time: "18:33" },
    { from: "them", text: "Top ! Proposez le d\u00e9fi et on paye", time: "18:33" },
  ],
}

// Incoming challenges
export const INCOMING_CHALLENGES = [
  { id: "c1", teamName: "Ibiza Boys", teamEmoji: "\u{1F3DD}", elo: 4400, message: "Revanche ?", estimatedGain: 16, estimatedLoss: -12 },
  { id: "c2", teamName: "Smasheurs", teamEmoji: "\u{1F4A5}", elo: 4150, message: "On remet ca ?", estimatedGain: 10, estimatedLoss: -18 },
]

// Report reasons
export const REPORT_REASONS = [
  "Triche",
  "Boosting",
  "Toxicite",
  "Faux score",
  "Annulation",
  "Multi-compte",
  "Mauvais comportement",
] as const

// Padel clubs for reservation
export const PADEL_CLUBS = [
  { id: "club1", name: "Padel Parc Lyon Gerland", city: "Lyon", courts: 4, pricePerHour: 12 },
  { id: "club2", name: "OK Padel Part-Dieu", city: "Lyon", courts: 3, pricePerHour: 14 },
  { id: "club3", name: "Padel Club Marseille Prado", city: "Marseille", courts: 5, pricePerHour: 15 },
  { id: "club4", name: "Stade Roland Garros Padel", city: "Paris", courts: 6, pricePerHour: 20 },
  { id: "club5", name: "Nice Cote d'Azur Padel Club", city: "Nice", courts: 3, pricePerHour: 16 },
] as const

// Time slots for reservation
export const TIME_SLOTS = [
  { time: "08:00", available: true },
  { time: "09:00", available: true },
  { time: "10:00", available: false },
  { time: "11:00", available: true },
  { time: "12:00", available: true },
  { time: "13:00", available: false },
  { time: "14:00", available: true },
  { time: "15:00", available: true },
  { time: "16:00", available: false },
  { time: "17:00", available: true },
  { time: "18:00", available: true },
  { time: "19:00", available: false },
  { time: "20:00", available: true },
  { time: "21:00", available: true },
] as const
