"use client"
 
import { useState } from "react"
import { Topbar } from "@/components/topbar"
import { RankBadge } from "@/components/rank-badge"
import { CheckCircle, AlertTriangle, Shield, Star, Trophy, Users } from "lucide-react"
 
const ARBITRES = [
  { id: "arb1", nom: "Jean-Pierre Martin", licence: "FPF-2024-0342", club: "Padel Parc Lyon Gerland", niveau: "Arbitre National", avatar: "JP" },
  { id: "arb2", nom: "Sophie Dubois", licence: "FPF-2024-0187", club: "OK Padel Part-Dieu", niveau: "Arbitre Régional", avatar: "SD" },
  { id: "arb3", nom: "Marc Rousseau", licence: "FPF-2023-0521", club: "Padel Indoor Lyon Vaise", niveau: "Arbitre National", avatar: "MR" },
  { id: "arb4", nom: "Camille Bernard", licence: "FPF-2024-0093", club: "Padel Parc Lyon Gerland", niveau: "Arbitre Régional", avatar: "CB" },
]
 
const MOCK_MATCH = {
  id: "match-001",
  teamHome: { name: "Les Aigles", emoji: "🦅", elo: 4350, rankId: "gold" },
  teamAway: { name: "Pack Wolves", emoji: "🐺", elo: 4510, rankId: "gold" },
  club: "Padel Parc Lyon Gerland",
  date: "Aujourd'hui",
  time: "18:00",
  court: "Court 2",
}
 
type ScoreSet = { home: string; away: string }
 
export default function MatchResultPage() {
  const [winner, setWinner] = useState<"home" | "away" | null>(null)
  const [sets, setSets] = useState<ScoreSet[]>([
    { home: "", away: "" },
    { home: "", away: "" },
    { home: "", away: "" },
  ])
  const [useArbitre, setUseArbitre] = useState(false)
  const [selectedArbitre, setSelectedArbitre] = useState<string | null>(null)
  const [fairplayAccepted, setFairplayAccepted] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [step, setStep] = useState<"result" | "score" | "arbitre" | "fairplay" | "done">("result")
 
  const handleSetScore = (setIdx: number, team: "home" | "away", value: string) => {
    setSets(prev => prev.map((s, i) => i === setIdx ? { ...s, [team]: value } : s))
  }
 
  const validSets = sets.filter(s => s.home !== "" && s.away !== "")
  const arbitreSelected = ARBITRES.find(a => a.id === selectedArbitre)
 
  if (submitted) {
    return (
      <>
        <Topbar title="Résultat du match" />
        <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(0,229,160,0.1)", border: "2px solid rgba(0,229,160,0.3)" }}>
            <Trophy className="h-10 w-10" style={{ color: "#00e5a0" }} />
          </div>
          <div className="text-center">
            <h2 className="font-[var(--font-rajdhani)] text-2xl font-bold text-foreground">Résultat soumis !</h2>
            <p className="text-text-secondary mt-2 text-sm">
              En attente de validation par <strong style={{ color: "#f0f0ff" }}>
                {winner === "home" ? MOCK_MATCH.teamAway.emoji + " " + MOCK_MATCH.teamAway.name : MOCK_MATCH.teamHome.emoji + " " + MOCK_MATCH.teamHome.name}
              </strong>
            </p>
            <p className="text-xs text-text-tertiary mt-1">L'Elo sera mis à jour après validation des deux équipes.</p>
          </div>
          <div className="rounded-xl p-4 border w-full max-w-sm" style={{ backgroundColor: "#12121f", borderColor: "rgba(0,229,160,0.2)" }}>
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <p className="text-lg font-bold">{MOCK_MATCH.teamHome.emoji}</p>
                <p className="text-xs font-semibold text-foreground">{MOCK_MATCH.teamHome.name}</p>
                {winner === "home" && <span className="text-xs font-bold" style={{ color: "#00e5a0" }}>🏆 Vainqueur</span>}
              </div>
              <div className="text-center px-4">
                <p className="text-xs text-text-tertiary mb-1">Score</p>
                {validSets.map((s, i) => (
                  <p key={i} className="font-[var(--font-rajdhani)] font-bold text-foreground">{s.home} - {s.away}</p>
                ))}
              </div>
              <div className="text-center flex-1">
                <p className="text-lg font-bold">{MOCK_MATCH.teamAway.emoji}</p>
                <p className="text-xs font-semibold text-foreground">{MOCK_MATCH.teamAway.name}</p>
                {winner === "away" && <span className="text-xs font-bold" style={{ color: "#00e5a0" }}>🏆 Vainqueur</span>}
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
 
  return (
    <>
      <Topbar title="Résultat du match" />
      <div className="p-6 flex flex-col gap-6 max-w-2xl mx-auto">
 
        {/* Match info */}
        <div className="rounded-xl p-4 border border-border" style={{ backgroundColor: "#12121f" }}>
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <p className="text-3xl mb-1">{MOCK_MATCH.teamHome.emoji}</p>
              <p className="text-sm font-bold font-[var(--font-rajdhani)] text-foreground">{MOCK_MATCH.teamHome.name}</p>
              <RankBadge elo={MOCK_MATCH.teamHome.elo} size="sm" showLabel />
            </div>
            <div className="text-center px-4">
              <p className="text-xs text-text-tertiary">VS</p>
              <p className="text-[10px] text-text-tertiary mt-1">🏟 {MOCK_MATCH.club}</p>
              <p className="text-[10px] text-text-tertiary">⏰ {MOCK_MATCH.time} · {MOCK_MATCH.court}</p>
            </div>
            <div className="text-center flex-1">
              <p className="text-3xl mb-1">{MOCK_MATCH.teamAway.emoji}</p>
              <p className="text-sm font-bold font-[var(--font-rajdhani)] text-foreground">{MOCK_MATCH.teamAway.name}</p>
              <RankBadge elo={MOCK_MATCH.teamAway.elo} size="sm" showLabel />
            </div>
          </div>
        </div>
 
        {/* ÉTAPE 1 — Qui a gagné */}
        <div className="rounded-xl p-5 border border-border" style={{ backgroundColor: "#12121f" }}>
          <h3 className="font-[var(--font-rajdhani)] font-bold uppercase tracking-wider text-sm text-foreground mb-4 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" /> 1. Qui a gagné ?
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setWinner("home")}
              className="p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2"
              style={{
                backgroundColor: winner === "home" ? "rgba(0,229,160,0.1)" : "#0d0d1a",
                borderColor: winner === "home" ? "#00e5a0" : "rgba(255,255,255,0.07)",
              }}>
              <span className="text-3xl">{MOCK_MATCH.teamHome.emoji}</span>
              <p className="text-sm font-bold font-[var(--font-rajdhani)] text-foreground">{MOCK_MATCH.teamHome.name}</p>
              {winner === "home" && <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(0,229,160,0.2)", color: "#00e5a0" }}>🏆 Sélectionné</span>}
            </button>
            <button onClick={() => setWinner("away")}
              className="p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2"
              style={{
                backgroundColor: winner === "away" ? "rgba(0,229,160,0.1)" : "#0d0d1a",
                borderColor: winner === "away" ? "#00e5a0" : "rgba(255,255,255,0.07)",
              }}>
              <span className="text-3xl">{MOCK_MATCH.teamAway.emoji}</span>
              <p className="text-sm font-bold font-[var(--font-rajdhani)] text-foreground">{MOCK_MATCH.teamAway.name}</p>
              {winner === "away" && <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(0,229,160,0.2)", color: "#00e5a0" }}>🏆 Sélectionné</span>}
            </button>
          </div>
        </div>
 
        {/* ÉTAPE 2 — Score par set */}
        <div className="rounded-xl p-5 border border-border" style={{ backgroundColor: "#12121f" }}>
          <h3 className="font-[var(--font-rajdhani)] font-bold uppercase tracking-wider text-sm text-foreground mb-4 flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" /> 2. Score détaillé
          </h3>
          <div className="flex flex-col gap-3">
            {["Set 1", "Set 2", "Super Tie-Break"].map((label, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-text-secondary w-28 shrink-0">{label}</span>
                <div className="flex items-center gap-2 flex-1">
                  <div className="flex items-center gap-1 flex-1">
                    <span className="text-xs text-text-tertiary w-6 text-center">{MOCK_MATCH.teamHome.emoji}</span>
                    <input type="number" min="0" max="7" value={sets[i].home}
                      onChange={e => handleSetScore(i, "home", e.target.value)}
                      placeholder="0"
                      className="w-full h-9 rounded-lg text-center text-sm font-bold border border-border text-foreground placeholder:text-text-tertiary focus:border-primary focus:outline-none tabular-nums"
                      style={{ backgroundColor: "#0d0d1a" }} />
                  </div>
                  <span className="text-text-tertiary text-sm font-bold">-</span>
                  <div className="flex items-center gap-1 flex-1">
                    <input type="number" min="0" max="7" value={sets[i].away}
                      onChange={e => handleSetScore(i, "away", e.target.value)}
                      placeholder="0"
                      className="w-full h-9 rounded-lg text-center text-sm font-bold border border-border text-foreground placeholder:text-text-tertiary focus:border-primary focus:outline-none tabular-nums"
                      style={{ backgroundColor: "#0d0d1a" }} />
                    <span className="text-xs text-text-tertiary w-6 text-center">{MOCK_MATCH.teamAway.emoji}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
 
        {/* ÉTAPE 3 — Arbitre (optionnel) */}
        <div className="rounded-xl p-5 border border-border" style={{ backgroundColor: "#12121f" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-[var(--font-rajdhani)] font-bold uppercase tracking-wider text-sm text-foreground flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" /> 3. Arbitre (optionnel)
            </h3>
            <button onClick={() => setUseArbitre(!useArbitre)}
              className="w-10 h-5 rounded-full relative transition-colors"
              style={{ backgroundColor: useArbitre ? "rgba(0,229,160,0.3)" : "rgba(255,255,255,0.1)" }}>
              <div className="absolute top-0.5 h-4 w-4 rounded-full transition-all"
                style={{ backgroundColor: useArbitre ? "#00e5a0" : "#606080", left: useArbitre ? "22px" : "2px" }} />
            </button>
          </div>
 
          {!useArbitre && (
            <p className="text-xs text-text-tertiary">Ajoutez un arbitre officiel pour valider le résultat.</p>
          )}
 
          {useArbitre && (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-text-secondary">Sélectionnez l'arbitre présent lors du match :</p>
              {ARBITRES.map(arb => (
                <button key={arb.id} onClick={() => setSelectedArbitre(arb.id)}
                  className="flex items-center gap-3 p-3 rounded-lg border transition-all text-left"
                  style={{
                    backgroundColor: selectedArbitre === arb.id ? "rgba(0,229,160,0.08)" : "#0d0d1a",
                    borderColor: selectedArbitre === arb.id ? "rgba(0,229,160,0.4)" : "rgba(255,255,255,0.07)",
                  }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                    style={{ backgroundColor: "rgba(0,229,160,0.1)", color: "#00e5a0", border: "1px solid rgba(0,229,160,0.2)" }}>
                    {arb.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{arb.nom}</p>
                    <p className="text-[10px] text-text-tertiary">🪪 Licence : {arb.licence}</p>
                    <p className="text-[10px] text-text-tertiary">🏟 {arb.club} · {arb.niveau}</p>
                  </div>
                  {selectedArbitre === arb.id && (
                    <CheckCircle className="h-5 w-5 shrink-0" style={{ color: "#00e5a0" }} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
 
        {/* ÉTAPE 4 — Fair-play */}
        <div className="rounded-xl p-5 border-2 transition-all" style={{
          backgroundColor: fairplayAccepted ? "rgba(0,229,160,0.04)" : "#12121f",
          borderColor: fairplayAccepted ? "rgba(0,229,160,0.3)" : "rgba(255,255,255,0.07)",
        }}>
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "#ffaa00" }} />
            <div>
              <h3 className="font-[var(--font-rajdhani)] font-bold uppercase tracking-wider text-sm text-foreground">
                4. Engagement Fair-Play
              </h3>
              <p className="text-xs text-text-tertiary mt-0.5">À lire avant de soumettre</p>
            </div>
          </div>
 
          <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: "#0d0d1a", border: "1px solid rgba(255,255,255,0.05)" }}>
            <p className="text-sm text-text-secondary leading-relaxed">
              🤝 <strong style={{ color: "#f0f0ff" }}>Nous comptons sur votre honnêteté.</strong>
            </p>
            <p className="text-sm text-text-secondary leading-relaxed mt-2">
              Padel Arena est une communauté fondée sur la confiance et le respect. Soumettre un faux résultat est une tricherie envers vos adversaires et la communauté entière.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed mt-2">
              Tout report de mauvaise foi sera analysé par notre équipe. En cas de fraude avérée, votre compte sera <strong style={{ color: "#ff3d71" }}>suspendu définitivement</strong> et votre Trust Score remis à zéro.
            </p>
            <p className="text-sm mt-3" style={{ color: "#00e5a0" }}>
              💚 Le vrai respect, c'est accepter la défaite avec dignité et la victoire avec humilité.
            </p>
          </div>
 
          <button onClick={() => setFairplayAccepted(!fairplayAccepted)}
            className="flex items-center gap-3 w-full text-left">
            <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all"
              style={{
                backgroundColor: fairplayAccepted ? "#00e5a0" : "transparent",
                border: `2px solid ${fairplayAccepted ? "#00e5a0" : "rgba(255,255,255,0.2)"}`,
              }}>
              {fairplayAccepted && <span className="text-black text-xs font-bold">✓</span>}
            </div>
            <span className="text-sm text-text-secondary">
              Je certifie que le résultat soumis est <strong style={{ color: "#f0f0ff" }}>exact et honnête</strong>, et j'engage ma responsabilité.
            </span>
          </button>
        </div>
 
        {/* Récapitulatif Elo estimé */}
        {winner && (
          <div className="rounded-xl p-4 border" style={{ backgroundColor: "#12121f", borderColor: "rgba(0,229,160,0.15)" }}>
            <h4 className="text-xs font-bold font-[var(--font-rajdhani)] uppercase tracking-wider text-text-secondary mb-3">Changements Elo estimés</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 rounded-lg" style={{ backgroundColor: "#0d0d1a" }}>
                <p className="text-lg">{MOCK_MATCH.teamHome.emoji}</p>
                <p className="text-xs text-text-secondary mt-1">{MOCK_MATCH.teamHome.name}</p>
                <p className="text-lg font-bold font-[var(--font-rajdhani)] mt-1" style={{ color: winner === "home" ? "#00e5a0" : "#ff3d71" }}>
                  {winner === "home" ? "+18" : "-11"}
                </p>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ backgroundColor: "#0d0d1a" }}>
                <p className="text-lg">{MOCK_MATCH.teamAway.emoji}</p>
                <p className="text-xs text-text-secondary mt-1">{MOCK_MATCH.teamAway.name}</p>
                <p className="text-lg font-bold font-[var(--font-rajdhani)] mt-1" style={{ color: winner === "away" ? "#00e5a0" : "#ff3d71" }}>
                  {winner === "away" ? "+15" : "-8"}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-text-tertiary text-center mt-2">Mis à jour après validation des deux équipes</p>
          </div>
        )}
 
        {/* Bouton soumettre */}
        <button
          onClick={() => setSubmitted(true)}
          disabled={!winner || !fairplayAccepted}
          className="w-full h-12 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 font-[var(--font-rajdhani)] uppercase tracking-wider"
          style={{
            backgroundColor: winner && fairplayAccepted ? "#00e5a0" : "rgba(255,255,255,0.05)",
            color: winner && fairplayAccepted ? "#000" : "#606080",
            cursor: winner && fairplayAccepted ? "pointer" : "not-allowed",
          }}>
          <CheckCircle className="h-5 w-5" />
          {!winner ? "Sélectionnez le vainqueur" : !fairplayAccepted ? "Acceptez l'engagement fair-play" : "Soumettre le résultat"}
        </button>
 
        <p className="text-[10px] text-text-tertiary text-center pb-4">
          Le résultat sera confirmé après validation par l'équipe adverse. En cas de désaccord, Padel Arena arbitre le litige.
        </p>
      </div>
    </>
  )
}