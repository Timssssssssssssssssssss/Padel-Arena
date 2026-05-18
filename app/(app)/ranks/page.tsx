"use client"
 
import { useState } from "react"
import { Topbar } from "@/components/topbar"
import { RankBadge } from "@/components/rank-badge"
import { EloBar } from "@/components/elo-bar"
import { RANKS, CURRENT_PLAYER, getRank } from "@/lib/mock-data"
import { ChevronDown } from "lucide-react"
 
const RANK_DESCRIPTIONS: Record<string, { short: string; detail: string }> = {
  Cuivre: {
    short: "Joueurs débutants qui découvrent le padel compétitif.",
    detail: "Tu débutes dans le padel compétitif. Chaque match est une occasion d'apprendre. Les fondamentaux sont en cours d'acquisition : service, retour, positionnement de base. La victoire est belle mais l'essentiel est de progresser à chaque partie. Le rang Cuivre représente 25% des joueurs inscrits.",
  },
  Bronze: {
    short: "Les bases sont acquises. Le jeu devient tactique.",
    detail: "Tu maîtrises les bases du padel. Tu comprends les zones de jeu, le rôle du mur et les placements fondamentaux. Tes échanges sont plus consistants et tu commences à développer une stratégie avec ton partenaire. La différence avec le Cuivre se fait sur la régularité.",
  },
  Argent: {
    short: "Joueur régulier avec une vraie maîtrise technique.",
    detail: "Tu joues régulièrement et ça se voit. Ta technique est solide : viboras, bandeja, défense au fond. Tu anticipes les frappes adverses et tu construis les points avec ton partenaire. Le jeu collectif fait la différence à ce niveau. Top 40% des joueurs Padel Arena.",
  },
  Gold: {
    short: "Niveau solide. Top 30% des joueurs de la plateforme.",
    detail: "Tu es un joueur accompli. Stratégie développée, bonne lecture du jeu, communication efficace avec ton partenaire. Tu sais varier les frappes, jouer sur les faiblesses adverses et résister à la pression. Le rang Gold est souvent le palier le plus compétitif de la plateforme.",
  },
  Platine: {
    short: "Niveau expert. Lecture de jeu avancée. Top 15%.",
    detail: "Tu joues avec une réelle intelligence tactique. Placement quasi-parfait, timing maîtrisé, variations constantes. Tu domines les échanges par la stratégie autant que par la technique. Tes matchs sont intenses et chaque point est disputé. Top 15% de la plateforme.",
  },
  Diamant: {
    short: "Élite régionale. Jeu quasi-professionnel. Top 8%.",
    detail: "Tu as atteint un niveau que peu de joueurs amateurs atteignent. Ton jeu est fluide, précis et efficace. Tu imposes ton rythme, tu exploites chaque erreur adverse et tu récupères les situations difficiles. Tu participes probablement à des tournois locaux avec succès.",
  },
  Émeraude: {
    short: "Référence nationale. Exemplaire sur tous les plans. Top 3%.",
    detail: "Tu es parmi les meilleurs joueurs amateurs de France. Techniquement irréprochable, tactiquement très au-dessus de la moyenne. Chaque match que tu joues est une masterclass pour tes adversaires. Ton nom circule dans les cercles de padel compétitif.",
  },
  Rubis: {
    short: "Parmi les meilleurs du pays. Présent en tournois. Top 1.5%.",
    detail: "Tu fais partie de l'élite du padel amateur français. Tes performances en tournois officiels témoignent d'un niveau exceptionnel. Tu combines puissance, finesse et gestion mentale à un degré très élevé. Peu de joueurs peuvent prétendre à ton niveau.",
  },
  Champion: {
    short: "Top 50 national. Palmarès impressionnant. Top 0.5%.",
    detail: "Le sommet est proche. Tu comptes parmi les 50 meilleurs joueurs de la plateforme et probablement du padel amateur français. Ton palmarès parle pour toi. Les adversaires te connaissent avant même de jouer contre toi. Chaque match est une opportunité de confirmer ton statut de légende.",
  },
  Elite: {
    short: "Le Graal absolu. Intouchable. Top 0.1%.",
    detail: "Tu as atteint le summum de Padel Arena. Le rang Elite est réservé aux quelques joueurs qui ont démontré une supériorité écrasante sur l'ensemble de la plateforme. Ton Elo dépasse 10 000 points, ce qui représente des centaines de victoires contre des adversaires de haut niveau. Tu es une légende.",
  },
}
 
const PADEL_RULES = [
  {
    title: "⚽ Format de jeu",
    content: "Un match se joue en 2 sets gagnants (best of 3). Chaque set se joue en 6 jeux avec avantage. En cas d'égalité à 6-6, un tie-break à 7 points est joué. Si les deux équipes remportent chacune un set, un super tie-break à 10 points décide du vainqueur.",
  },
  {
    title: "🎯 Le service",
    content: "Le serveur frappe la balle en dessous de la ceinture, en diagonale vers le carré de service adverse. La balle doit d'abord toucher le sol avant de toucher le mur du fond. Deux tentatives sont autorisées. Les pieds du serveur ne doivent pas franchir la ligne de service.",
  },
  {
    title: "🏟 Les murs — règle clé du padel",
    content: "Les murs et grillages font entièrement partie du jeu. Après avoir touché le sol, la balle peut rebondir sur les murs et rester en jeu. Le retour peut se faire avant ou après le rebond mural. La balle ne doit pas toucher le grillage métallique avant de passer le filet.",
  },
  {
    title: "❌ Fautes et pénalités",
    content: "C'est une faute si : la balle touche le grillage avant le filet, un joueur touche le filet ou le poteau, la balle rebondit deux fois avant d'être frappée, un joueur pénètre dans le camp adverse, ou la balle touche le corps ou l'équipement d'un joueur avant de passer le filet.",
  },
  {
    title: "🔄 Positionnement et zones",
    content: "Chaque équipe dispose de son demi-terrain. Les deux partenaires peuvent se déplacer librement dans leur zone. Le positionnement est crucial : généralement un joueur à la volée et un au fond, ou les deux à la volée en situation offensive.",
  },
  {
    title: "🏆 Système de points Padel Arena",
    content: "Les points Elo sont calculés en fonction de l'écart de niveau entre les équipes. Battre une équipe plus forte rapporte beaucoup de points, perdre contre une plus faible en fait perdre davantage. Le gain moyen est de +15 à +25 points par victoire. Le K-factor diminue avec l'expérience.",
  },
  {
    title: "⚠️ Fair-play et comportement",
    content: "Tout comportement antisportif, triche ou faux score peut entraîner un signalement. Chaque signalement confirmé réduit le Trust Score du joueur concerné. Un Trust Score bas limite l'accès au matchmaking. Le respect de l'adversaire est une valeur fondamentale de Padel Arena.",
  },
  {
    title: "💶 Réservation et paiements",
    content: "La réservation d'un terrain coûte 20€ pour l'équipe complète (18€ reversés au club, 2€ à Padel Arena). Les paris optionnels sont soumis à 10% de commission sur les gains uniquement. En cas d'annulation plus de 24h à l'avance, le remboursement est intégral.",
  },
]
 
export default function RanksPage() {
  const [selectedRank, setSelectedRank] = useState<(typeof RANKS)[number] | null>(null)
  const [rulesOpen, setRulesOpen] = useState<number | null>(null)
  const [activeSection, setActiveSection] = useState<"rangs" | "regles">("rangs")
  const currentRank = getRank(CURRENT_PLAYER.elo)
 
  const playerDistribution: Record<string, number> = {
    Cuivre: 25, Bronze: 22, Argent: 18, Gold: 14, Platine: 9,
    Diamant: 5, Émeraude: 3, Rubis: 2, Champion: 1.5, Elite: 0.5,
  }
 
  return (
    <>
      <Topbar title="Système de Rangs" />
 
      <div className="p-4 flex flex-col gap-4">
 
        {/* Onglets Rangs / Règles */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSection("rangs")}
            className="px-5 py-2 rounded-full text-xs font-bold font-[var(--font-rajdhani)] transition-all"
            style={{
              backgroundColor: activeSection === "rangs" ? "#00e5a0" : "transparent",
              color: activeSection === "rangs" ? "#070710" : "#606080",
              border: activeSection === "rangs" ? "none" : "1px solid rgba(255,255,255,0.07)",
            }}
          >
            🏅 Rangs
          </button>
          <button
            onClick={() => setActiveSection("regles")}
            className="px-5 py-2 rounded-full text-xs font-bold font-[var(--font-rajdhani)] transition-all"
            style={{
              backgroundColor: activeSection === "regles" ? "#00e5a0" : "transparent",
              color: activeSection === "regles" ? "#070710" : "#606080",
              border: activeSection === "regles" ? "none" : "1px solid rgba(255,255,255,0.07)",
            }}
          >
            📋 Règles
          </button>
        </div>
 
        {/* ══ SECTION RANGS ══ */}
        {activeSection === "rangs" && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {RANKS.map((rank) => {
                const isCurrent = rank.name === currentRank.name
                const isSelected = selectedRank?.name === rank.name
                return (
                  <button
                    key={rank.name}
                    onClick={() => setSelectedRank(isSelected ? null : rank)}
                    className="relative rounded-xl p-3 flex flex-col items-center gap-2 transition-all duration-300 hover:-translate-y-1 border cursor-pointer"
                    style={{
                      backgroundColor: "#12121f",
                      borderColor: isCurrent ? rank.color : isSelected ? `${rank.color}60` : "rgba(255,255,255,0.07)",
                      boxShadow: isCurrent
                        ? `0 0 20px ${rank.color}30, inset 0 0 20px ${rank.color}08`
                        : isSelected ? `0 0 15px ${rank.color}20` : "none",
                    }}
                  >
                    {isCurrent && (
                      <span
                        className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap"
                        style={{ backgroundColor: rank.color, color: "#070710" }}
                      >
                        Mon rang
                      </span>
                    )}
                    <RankBadge elo={rank.min} size="md" />
                    <span
                      className="text-xs font-bold font-[var(--font-rajdhani)] uppercase tracking-wide text-center w-full leading-tight"
                      style={{ color: rank.color, wordBreak: "break-word", overflowWrap: "break-word" }}
                    >
                      {rank.name}
                    </span>
                    <span className="text-[9px] text-text-tertiary tabular-nums">{rank.min}+ Elo</span>
                  </button>
                )
              })}
            </div>
 
            {/* Detail panel */}
            {selectedRank && (
              <div
                className="rounded-xl p-4 border transition-all duration-300"
                style={{ backgroundColor: "#12121f", borderColor: `${selectedRank.color}40` }}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <RankBadge elo={selectedRank.min} size="md" />
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-bold font-[var(--font-rajdhani)]" style={{ color: selectedRank.color }}>
                        {selectedRank.name}
                      </h2>
                      <p className="text-[10px] text-text-tertiary">{selectedRank.min}+ Elo</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: selectedRank.color }} />
                        <span className="text-xs text-text-secondary">
                          {playerDistribution[selectedRank.name]}% des joueurs
                        </span>
                      </div>
                    </div>
                  </div>
 
                  {/* Description courte */}
                  <p className="text-sm font-semibold" style={{ color: selectedRank.color }}>
                    {RANK_DESCRIPTIONS[selectedRank.name]?.short}
                  </p>
 
                  {/* Description longue */}
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {RANK_DESCRIPTIONS[selectedRank.name]?.detail}
                  </p>
 
                  {selectedRank.name === currentRank.name && (
                    <EloBar elo={CURRENT_PLAYER.elo} />
                  )}
                </div>
              </div>
            )}
 
            {/* Formula cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-xl p-4 border" style={{ backgroundColor: "#12121f", borderColor: "rgba(0,229,160,0.2)" }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(0,229,160,0.15)" }}>
                    <span className="text-primary font-bold text-sm">+</span>
                  </div>
                  <h3 className="text-sm font-semibold font-[var(--font-rajdhani)] text-primary uppercase">Gagner vs plus fort</h3>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Battre une équipe avec un Elo supérieur rapporte beaucoup de points. Plus l'écart est grand, plus le gain est élevé. C'est la logique qui récompense l'audace et le dépassement de soi.
                </p>
              </div>
              <div className="rounded-xl p-4 border" style={{ backgroundColor: "#12121f", borderColor: "rgba(255,61,113,0.2)" }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(255,61,113,0.15)" }}>
                    <span className="text-destructive font-bold text-sm">-</span>
                  </div>
                  <h3 className="text-sm font-semibold font-[var(--font-rajdhani)] text-destructive uppercase">Perdre vs plus faible</h3>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Perdre contre une équipe moins bien classée coûte cher. La perte est proportionnelle à l'écart d'Elo. Chaque match compte — ne sous-estimez jamais un adversaire.
                </p>
              </div>
            </div>
          </>
        )}
 
        {/* ══ SECTION RÈGLES ══ */}
        {activeSection === "regles" && (
          <div className="flex flex-col gap-3">
            <div className="rounded-xl p-4 border" style={{ backgroundColor: "#12121f", borderColor: "rgba(0,229,160,0.15)" }}>
              <p className="text-xs text-text-secondary leading-relaxed">
                📖 Voici les règles officielles du padel telles qu'elles s'appliquent sur <strong style={{ color: "#00e5a0" }}>Padel Arena</strong>. Ces règles sont conformes à la Fédération Internationale de Padel (FIP).
              </p>
            </div>
 
            {PADEL_RULES.map((rule, i) => (
              <div
                key={i}
                className="rounded-xl border overflow-hidden transition-all"
                style={{ backgroundColor: "#12121f", borderColor: rulesOpen === i ? "rgba(0,229,160,0.3)" : "rgba(255,255,255,0.07)" }}
              >
                <button
                  onClick={() => setRulesOpen(rulesOpen === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                  <span className="text-sm font-bold font-[var(--font-rajdhani)] text-foreground">{rule.title}</span>
                  <ChevronDown
                    className="h-4 w-4 shrink-0 transition-transform"
                    style={{ color: "#606080", transform: rulesOpen === i ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>
                {rulesOpen === i && (
                  <div className="px-4 pb-4 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                    <p className="text-xs text-text-secondary leading-relaxed pt-3">{rule.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}