"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { Topbar } from "@/components/topbar"
import { RankBadge } from "@/components/rank-badge"
import { TeamCard } from "@/components/team-card"
import {
  CURRENT_TEAM,
  MATCHMAKING_TEAMS,
  FRENCH_CITIES,
  CLUBS,
  TEAM_STATUSES,
  getTeamStatus,
  getRank,
  type TeamStatus,
} from "@/lib/mock-data"
import {
  MapPin, CreditCard, Swords, MessageSquare, ChevronDown,
  Building2, Search, Radio, Dices, X, Send, Clock, CheckCircle, Calendar,
} from "lucide-react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"

const DISTANCE_OPTIONS = [
  { label: "20 km", value: 20 },
  { label: "40 km", value: 40 },
  { label: "60 km", value: 60 },
  { label: "100 km", value: 100 },
  { label: "Nationale", value: 99999 },
]

const BET_PRESETS = [10, 20, 30, 40]

const STATUS_SORT_ORDER: Record<TeamStatus, number> = {
  en_attente: 0, en_ligne: 1, en_match: 2, hors_ligne: 3,
}

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00",
]
const TAKEN_SLOTS = ["10:00", "13:00", "16:00", "19:00"]
const COURTS = ["Court 1", "Court 2", "Court 3", "Court 4"]

// Étapes du flow de paiement
type FlowStep = "defi" | "waiting" | "accepted" | "payment" | "confirmed"

type Message = { from: "me" | "them"; text: string; time: string }

function ChatTab({ team, onSendChallenge }: { team: any; onSendChallenge: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { from: "them", text: `Salut ! On est dispo ${team.day ?? "bientôt"} à ${team.timeSlot ?? "à confirmer"} au ${team.club} 🏟`, time: "18:32" },
    { from: "them", text: `Court ${team.court ?? "1"} est réservé, vous êtes chauds ? 💪`, time: "18:33" },
  ])
  const [input, setInput] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return
    const now = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    setMessages(prev => [...prev, { from: "me", text: input, time: now }])
    setInput("")
    setTimeout(() => {
      const replies = ["Top ! On confirme 🤝", "Ok nickel, envoyez le défi !", "Parfait, on vous attend 🎾", "Super ! On est prêts 💪"]
      const replyTime = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
      setMessages(prev => [...prev, { from: "them", text: replies[Math.floor(Math.random() * replies.length)], time: replyTime }])
    }, 1000)
  }

  return (
    <div className="flex flex-col" style={{ height: 420 }}>
      <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <span className="text-2xl">{team.emoji}</span>
        <div>
          <p className="font-bold text-white text-sm">{team.name}</p>
          <p className="text-xs" style={{ color: "#00e5a0" }}>🟢 {team.timeSlot ?? "Disponible"} · {team.club}</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
            {msg.from === "them" && <span className="text-xl shrink-0">{team.emoji}</span>}
            <div className="rounded-xl p-3 max-w-xs" style={{
              backgroundColor: msg.from === "me" ? "rgba(0,229,160,0.12)" : "#1a1a2e",
              border: msg.from === "me" ? "1px solid rgba(0,229,160,0.25)" : "1px solid rgba(255,255,255,0.05)",
            }}>
              <p className="text-sm" style={{ color: msg.from === "me" ? "#00e5a0" : "#f0f0ff" }}>{msg.text}</p>
              <p className="text-xs mt-1" style={{ color: "#606080", textAlign: msg.from === "me" ? "right" : "left" }}>{msg.time}</p>
            </div>
            {msg.from === "me" && <span className="text-xl shrink-0">🦅</span>}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="p-4 border-t flex flex-col gap-2" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="flex gap-2">
          <input type="text" value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Écrire un message..."
            className="flex-1 rounded-lg px-4 py-2 text-sm focus:outline-none"
            style={{ backgroundColor: "#0d0d1a", border: "1px solid rgba(255,255,255,0.1)", color: "#f0f0ff" }}
          />
          <button onClick={sendMessage} className="px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-1 transition-colors hover:opacity-90" style={{ backgroundColor: "#00e5a0", color: "#000" }}>
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
        <button onClick={onSendChallenge} className="w-full py-2 rounded-lg text-sm font-bold transition-colors hover:opacity-90 flex items-center justify-center gap-2"
          style={{ backgroundColor: "#1a1a2e", border: "1px solid rgba(0,229,160,0.3)", color: "#00e5a0" }}>
          <Swords className="h-4 w-4" /> Envoyer un défi à {team.name}
        </button>
      </div>
    </div>
  )
}

export default function MatchmakingPage() {
  const [selectedTeam, setSelectedTeam] = useState<(typeof MATCHMAKING_TEAMS)[number] | null>(null)
  const [activeTab, setActiveTab] = useState<"defi" | "chat">("defi")
  const [flowStep, setFlowStep] = useState<FlowStep>("defi")
  const [message, setMessage] = useState("")

  // Terrain selection (step 3)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [selectedCourt, setSelectedCourt] = useState<string>("Court 1")

  // Filters
  const [selectedCity, setSelectedCity] = useState("Lyon")
  const [selectedDistance, setSelectedDistance] = useState(40)
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false)
  const [clubSearch, setClubSearch] = useState("")
  const [selectedClub, setSelectedClub] = useState<string | null>(null)
  const [clubDropdownOpen, setClubDropdownOpen] = useState(false)

  // Bet
  const [challengeBetEnabled, setChallengeBetEnabled] = useState(false)
  const [challengeBetAmount, setChallengeBetAmount] = useState("")
  const [challengeBetCustom, setChallengeBetCustom] = useState("")

  const challengeBetValue = challengeBetEnabled
    ? challengeBetAmount === "custom" ? Number(challengeBetCustom) || 0 : Number(challengeBetAmount) || 0
    : 0
  const challengeCommission = Math.round(challengeBetValue * 0.1 * 100) / 100
  const challengePotentialWinnings = challengeBetValue > 0 ? Math.round((challengeBetValue * 2 - challengeCommission) * 100) / 100 : 0
  const terrainFee = 20
  const platformFee = 2
  const challengeTotal = terrainFee + challengeBetValue

  const cityClubs = useMemo(() => {
    const filtered = CLUBS.filter(c => c.city === selectedCity)
    if (!clubSearch) return filtered
    return filtered.filter(c => c.name.toLowerCase().includes(clubSearch.toLowerCase()))
  }, [selectedCity, clubSearch])

  const filteredTeams = useMemo(() => {
    let teams = [...MATCHMAKING_TEAMS]
    if (selectedClub) {
      teams = teams.filter(t => t.club === selectedClub)
    } else if (selectedDistance !== 99999) {
      teams = teams.filter(t => {
        if (t.city === selectedCity) return true
        if (selectedDistance >= 100) return true
        if (selectedDistance >= 60) return t.city !== "Paris" || selectedCity === "Paris"
        return t.city === selectedCity
      })
    }
    teams.sort((a, b) => STATUS_SORT_ORDER[a.status] - STATUS_SORT_ORDER[b.status])
    return teams
  }, [selectedCity, selectedDistance, selectedClub])

  const isInteractive = (status: TeamStatus) => status === "en_attente" || status === "en_ligne"

  const closeModal = () => {
    setSelectedTeam(null)
    setActiveTab("defi")
    setFlowStep("defi")
    setChallengeBetEnabled(false)
    setChallengeBetAmount("")
    setChallengeBetCustom("")
    setSelectedSlot(null)
    setSelectedCourt("Court 1")
    setMessage("")
  }

  // Étape indicateur
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 py-3 px-4 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
      {[
        { step: "defi", label: "Défi", icon: "1" },
        { step: "waiting", label: "Attente", icon: "2" },
        { step: "accepted", label: "Terrain", icon: "3" },
        { step: "payment", label: "Paiement", icon: "4" },
      ].map((s, i) => {
        const steps = ["defi", "waiting", "accepted", "payment", "confirmed"]
        const currentIdx = steps.indexOf(flowStep)
        const stepIdx = steps.indexOf(s.step)
        const isDone = currentIdx > stepIdx
        const isActive = flowStep === s.step
        return (
          <div key={s.step} className="flex items-center gap-1">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={{
                  backgroundColor: isDone ? "#00e5a0" : isActive ? "rgba(0,229,160,0.2)" : "#1a1a2e",
                  border: isActive ? "1px solid #00e5a0" : isDone ? "none" : "1px solid rgba(255,255,255,0.1)",
                  color: isDone ? "#000" : isActive ? "#00e5a0" : "#606080",
                }}>
                {isDone ? "✓" : s.icon}
              </div>
              <span className="text-[10px] hidden sm:block" style={{ color: isActive ? "#00e5a0" : isDone ? "#00e5a0" : "#606080" }}>{s.label}</span>
            </div>
            {i < 3 && <div className="w-6 h-px mx-1" style={{ backgroundColor: isDone ? "#00e5a0" : "rgba(255,255,255,0.1)" }} />}
          </div>
        )
      })}
    </div>
  )

  return (
    <>
      <Topbar title="Matchmaking" />
      <div className="p-6 flex flex-col gap-6">
        <TeamCard emoji={CURRENT_TEAM.emoji} name={CURRENT_TEAM.name} elo={CURRENT_TEAM.elo}
          wins={CURRENT_TEAM.wins} draws={CURRENT_TEAM.draws} streak={CURRENT_TEAM.streak} />

        {/* FILTERS */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider px-1">Filtres</h3>
          <div className="flex flex-col gap-3 rounded-xl p-4 border border-border" style={{ backgroundColor: "#12121f" }}>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <span className="text-xs text-text-secondary w-12 shrink-0">Ville</span>
              <div className="relative flex-1">
                <button onClick={() => { setCityDropdownOpen(!cityDropdownOpen); setClubDropdownOpen(false) }}
                  className="flex items-center gap-2 h-8 px-3 rounded-md border border-border text-sm font-medium text-foreground hover:border-primary/40 transition-colors w-full justify-between"
                  style={{ backgroundColor: "#0d0d1a" }}>
                  {selectedCity}
                  <ChevronDown className={`h-3.5 w-3.5 text-text-tertiary transition-transform ${cityDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {cityDropdownOpen && (
                  <div className="absolute top-full mt-1 left-0 w-full max-h-64 overflow-y-auto rounded-lg border border-border shadow-xl z-50" style={{ backgroundColor: "#12121f" }}>
                    {FRENCH_CITIES.map(city => (
                      <button key={city} onClick={() => { setSelectedCity(city); setCityDropdownOpen(false); setSelectedClub(null); setClubSearch("") }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-primary/10 transition-colors"
                        style={{ color: city === selectedCity ? "#00e5a0" : "#a0a0c0" }}>{city}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Radio className="h-4 w-4 text-primary shrink-0" />
              <span className="text-xs text-text-secondary w-12 shrink-0">Rayon</span>
              <div className="flex items-center gap-2 flex-wrap">
                {DISTANCE_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => { setSelectedDistance(opt.value); setSelectedClub(null) }}
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                    style={{
                      backgroundColor: selectedDistance === opt.value && !selectedClub ? "rgba(0,229,160,0.15)" : "#0d0d1a",
                      borderWidth: 1, borderStyle: "solid",
                      borderColor: selectedDistance === opt.value && !selectedClub ? "rgba(0,229,160,0.4)" : "rgba(255,255,255,0.07)",
                      color: selectedDistance === opt.value && !selectedClub ? "#00e5a0" : "#a0a0c0",
                    }}>{opt.label}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-xl p-4 border border-border" style={{ backgroundColor: "#12121f" }}>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm font-semibold font-[var(--font-rajdhani)] text-foreground uppercase tracking-wider">Chercher par club</span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-tertiary" />
              <input value={clubSearch} onChange={e => { setClubSearch(e.target.value); setClubDropdownOpen(true) }}
                onFocus={() => setClubDropdownOpen(true)} placeholder="Rechercher un club..."
                className="w-full h-9 pl-9 pr-3 rounded-lg text-sm border border-border text-foreground placeholder:text-text-tertiary focus:border-primary focus:outline-none"
                style={{ backgroundColor: "#0d0d1a" }} />
              {selectedClub && <button onClick={() => { setSelectedClub(null); setClubSearch("") }} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="h-3 w-3 text-text-tertiary" /></button>}
            </div>
            {clubDropdownOpen && cityClubs.length > 0 && (
              <div className="rounded-lg border border-border max-h-48 overflow-y-auto" style={{ backgroundColor: "#0d0d1a" }}>
                {cityClubs.map(club => (
                  <button key={club.id} onClick={() => { setSelectedClub(club.name); setClubSearch(club.name); setClubDropdownOpen(false) }}
                    className="w-full text-left px-3 py-2.5 hover:bg-primary/10 transition-colors border-b last:border-b-0"
                    style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                    <span className="text-sm block" style={{ color: selectedClub === club.name ? "#00e5a0" : "#e0e0f0" }}>{club.name}</span>
                    <span className="text-[10px] text-text-tertiary">{club.address}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Filter summary */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-elevated border border-border text-text-secondary flex items-center gap-1.5">
            <MapPin className="h-3 w-3" /> {selectedCity}
          </span>
          {!selectedClub && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-elevated border border-border text-text-secondary">
              {selectedDistance === 99999 ? "Nationale" : `${selectedDistance} km`}
            </span>
          )}
          <span className="text-xs text-text-tertiary ml-2">{filteredTeams.length} équipe{filteredTeams.length > 1 ? "s" : ""} trouvée{filteredTeams.length > 1 ? "s" : ""}</span>
        </div>

        {/* Status legend */}
        <div className="flex items-center gap-4 flex-wrap">
          {TEAM_STATUSES.map(s => (
            <div key={s.id} className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color, animation: s.id === "en_attente" ? "pulse 2s infinite" : undefined }} />
              <span className="text-[10px] text-text-tertiary">{s.label}</span>
            </div>
          ))}
        </div>

        {/* TEAM LIST */}
        <div className="flex flex-col gap-2">
          {filteredTeams.map(team => {
            const rank = getRank(team.elo)
            const status = getTeamStatus(team.status)
            const interactive = isInteractive(team.status)
            return (
              <button key={team.id}
                onClick={() => { if (interactive) { setSelectedTeam(team); setActiveTab("defi"); setFlowStep("defi") } }}
                disabled={!interactive}
                className="rounded-xl p-4 border border-border transition-all flex items-center gap-4 text-left w-full"
                style={{
                  backgroundColor: "#12121f",
                  opacity: team.status === "hors_ligne" ? 0.4 : team.status === "en_match" ? 0.6 : 1,
                  cursor: interactive ? "pointer" : "not-allowed",
                  borderColor: team.status === "en_attente" ? "rgba(0,229,160,0.15)" : undefined,
                }}>
                <span className="text-2xl">{team.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold font-[var(--font-rajdhani)] text-foreground">{team.name}</span>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: status.color, animation: team.status === "en_attente" ? "pulse 2s infinite" : undefined }} />
                      <span className="text-[10px] font-medium" style={{ color: status.color }}>{status.label}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <MapPin className="h-3 w-3 text-text-tertiary" />
                    <span className="text-xs text-text-tertiary">{team.city}</span>
                    {(team as any).day && <><span className="text-text-tertiary">·</span><span className="text-xs text-text-secondary">📅 {(team as any).day} {(team as any).timeSlot}</span></>}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Building2 className="h-3 w-3 text-text-tertiary" />
                    <span className="text-[11px] text-text-secondary">{team.club}</span>
                    {(team as any).court && <span className="text-[11px] text-text-tertiary">· 🎾 {(team as any).court}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RankBadge elo={team.elo} size="sm" />
                  <span className="text-sm font-bold font-[var(--font-rajdhani)] tabular-nums" style={{ color: rank.color }}>{team.elo}</span>
                </div>
                {interactive && (
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-xs font-bold text-primary tabular-nums">+{team.estimatedGain}</span>
                    <span className="text-xs font-bold text-destructive tabular-nums">{team.estimatedLoss}</span>
                  </div>
                )}
              </button>
            )
          })}
          {filteredTeams.length === 0 && <div className="text-center py-12 text-text-tertiary text-sm">Aucune équipe trouvée.</div>}
        </div>
      </div>

      {/* ====== MODAL PRINCIPAL ====== */}
      <Dialog open={!!selectedTeam && flowStep !== "confirmed"} onOpenChange={open => { if (!open) closeModal() }}>
        <DialogContent className="border-border p-0 overflow-hidden max-w-lg" style={{ backgroundColor: "#12121f" }}>
          {selectedTeam && (
            <>
              {/* Tabs Défi / Chat (seulement à l'étape défi) */}
              {flowStep === "defi" && (
                <div className="flex border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                  <button onClick={() => setActiveTab("defi")} className="flex-1 py-3 text-sm font-bold font-[var(--font-rajdhani)] uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                    style={{ color: activeTab === "defi" ? "#00e5a0" : "#606080", borderBottom: activeTab === "defi" ? "2px solid #00e5a0" : "2px solid transparent", backgroundColor: "transparent" }}>
                    <Swords className="h-4 w-4" /> Défi
                  </button>
                  <button onClick={() => setActiveTab("chat")} className="flex-1 py-3 text-sm font-bold font-[var(--font-rajdhani)] uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                    style={{ color: activeTab === "chat" ? "#00e5a0" : "#606080", borderBottom: activeTab === "chat" ? "2px solid #00e5a0" : "2px solid transparent", backgroundColor: "transparent" }}>
                    <MessageSquare className="h-4 w-4" /> Chat
                  </button>
                </div>
              )}

              {/* Step indicator (étapes 2, 3, 4) */}
              {flowStep !== "defi" && <StepIndicator />}

              {/* ── ÉTAPE 1 : DÉFI ── */}
              {flowStep === "defi" && activeTab === "chat" && (
                <ChatTab team={selectedTeam} onSendChallenge={() => setActiveTab("defi")} />
              )}

              {flowStep === "defi" && activeTab === "defi" && (
                <div className="p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="font-[var(--font-rajdhani)] text-xl text-foreground">Lancer un défi</DialogTitle>
                    <DialogDescription className="text-text-secondary">Défiez {selectedTeam.name} en match compétitif</DialogDescription>
                  </DialogHeader>

                  <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "#0d0d1a" }}>
                    <span className="text-2xl">{selectedTeam.emoji}</span>
                    <div>
                      <span className="text-sm font-semibold text-foreground">{selectedTeam.name}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <RankBadge elo={selectedTeam.elo} size="sm" />
                        <span className="text-xs text-text-secondary tabular-nums">{selectedTeam.elo} Elo</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Building2 className="h-3 w-3 text-text-tertiary" />
                        <span className="text-[11px] text-text-secondary">{selectedTeam.club}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg p-3 text-center border" style={{ backgroundColor: "rgba(0,229,160,0.05)", borderColor: "rgba(0,229,160,0.2)" }}>
                      <span className="text-xs text-text-secondary">Gain estimé</span>
                      <p className="text-xl font-bold font-[var(--font-rajdhani)] text-primary">+{selectedTeam.estimatedGain}</p>
                    </div>
                    <div className="rounded-lg p-3 text-center border" style={{ backgroundColor: "rgba(255,61,113,0.05)", borderColor: "rgba(255,61,113,0.2)" }}>
                      <span className="text-xs text-text-secondary">Perte estimée</span>
                      <p className="text-xl font-bold font-[var(--font-rajdhani)] text-destructive">{selectedTeam.estimatedLoss}</p>
                    </div>
                  </div>

                  {/* Pari optionnel */}
                  <div className="rounded-lg border overflow-hidden" style={{ borderColor: challengeBetEnabled ? "rgba(255,170,0,0.3)" : "rgba(255,255,255,0.07)", backgroundColor: challengeBetEnabled ? "rgba(255,170,0,0.03)" : "#0d0d1a" }}>
                    <button onClick={() => setChallengeBetEnabled(!challengeBetEnabled)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-elevated/30 transition-colors">
                      <Dices className="h-5 w-5 text-warning" />
                      <span className="text-sm font-bold font-[var(--font-rajdhani)] uppercase tracking-wider text-warning">Ajouter un pari (optionnel)</span>
                      <div className="ml-auto">
                        <div className="w-10 h-5 rounded-full relative transition-colors" style={{ backgroundColor: challengeBetEnabled ? "rgba(255,170,0,0.3)" : "rgba(255,255,255,0.1)" }}>
                          <div className="absolute top-0.5 h-4 w-4 rounded-full transition-all" style={{ backgroundColor: challengeBetEnabled ? "#ffaa00" : "#606080", left: challengeBetEnabled ? "22px" : "2px" }} />
                        </div>
                      </div>
                    </button>
                    {challengeBetEnabled && (
                      <div className="px-4 pb-4 flex flex-col gap-3 border-t" style={{ borderColor: "rgba(255,170,0,0.15)" }}>
                        <p className="text-xs text-text-secondary pt-3">Mise supplémentaire par équipe :</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {BET_PRESETS.map(amount => (
                            <button key={amount} onClick={() => { setChallengeBetAmount(String(amount)); setChallengeBetCustom("") }}
                              className="px-4 py-2 rounded-full text-xs font-bold transition-all"
                              style={{
                                backgroundColor: challengeBetAmount === String(amount) ? "rgba(255,170,0,0.2)" : "#0d0d1a",
                                borderWidth: 1, borderStyle: "solid",
                                borderColor: challengeBetAmount === String(amount) ? "rgba(255,170,0,0.5)" : "rgba(255,255,255,0.07)",
                                color: challengeBetAmount === String(amount) ? "#ffaa00" : "#a0a0c0",
                              }}>{amount} €</button>
                          ))}
                          <button onClick={() => setChallengeBetAmount("custom")}
                            className="px-4 py-2 rounded-full text-xs font-bold transition-all"
                            style={{
                              backgroundColor: challengeBetAmount === "custom" ? "rgba(255,170,0,0.2)" : "#0d0d1a",
                              borderWidth: 1, borderStyle: "solid",
                              borderColor: challengeBetAmount === "custom" ? "rgba(255,170,0,0.5)" : "rgba(255,255,255,0.07)",
                              color: challengeBetAmount === "custom" ? "#ffaa00" : "#a0a0c0",
                            }}>Personnalisé</button>
                        </div>
                        {challengeBetAmount === "custom" && (
                          <div className="flex items-center gap-2">
                            <input type="number" value={challengeBetCustom} onChange={e => setChallengeBetCustom(e.target.value)}
                              placeholder="Montant" min="1"
                              className="w-28 h-8 rounded-md px-3 text-sm font-bold text-right border border-border text-foreground placeholder:text-text-tertiary focus:border-warning focus:outline-none tabular-nums"
                              style={{ backgroundColor: "#0d0d1a" }} />
                            <span className="text-xs text-text-secondary">€</span>
                          </div>
                        )}
                        <div className="text-xs text-text-tertiary">Commission Padel Arena : 10% sur les gains uniquement</div>
                        {challengeBetValue > 0 && (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-text-secondary">Si vous gagnez</span>
                              <span className="text-sm font-bold tabular-nums" style={{ color: "#00e5a0" }}>+{challengePotentialWinnings} € net</span>
                            </div>
                            <p className="text-[10px]" style={{ color: "#ff3d71" }}>Si vous perdez, la mise de {challengeBetValue} € est perdue.</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-text-secondary flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" /> Message (optionnel)
                    </label>
                    <input value={message} onChange={e => setMessage(e.target.value)} placeholder="Bonne chance !"
                      className="h-9 rounded-md px-3 text-sm border border-border text-foreground placeholder:text-text-tertiary focus:border-primary focus:outline-none"
                      style={{ backgroundColor: "#0d0d1a" }} />
                  </div>

                  {/* Info paiement différé */}
                  <div className="rounded-lg p-3 border" style={{ backgroundColor: "rgba(0,229,160,0.04)", borderColor: "rgba(0,229,160,0.15)" }}>
                    <p className="text-xs" style={{ color: "#a0a0c0" }}>
                      💡 <strong style={{ color: "#00e5a0" }}>Le paiement n'est débité qu'après</strong> acceptation du défi par l'adversaire et sélection du terrain.
                    </p>
                  </div>

                  <button onClick={() => setFlowStep("waiting")}
                    className="w-full h-11 rounded-lg text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                    <Swords className="h-4 w-4" /> Envoyer le défi
                  </button>
                </div>
              )}

              {/* ── ÉTAPE 2 : EN ATTENTE ── */}
              {flowStep === "waiting" && (
                <div className="p-6 flex flex-col items-center gap-6 py-12">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(255,170,0,0.1)", border: "2px solid rgba(255,170,0,0.3)" }}>
                    <Clock className="h-8 w-8 text-warning animate-spin" style={{ animationDuration: "3s" }} />
                  </div>
                  <div className="text-center">
                    <h3 className="font-[var(--font-rajdhani)] text-xl font-bold text-foreground">Défi envoyé !</h3>
                    <p className="text-sm text-text-secondary mt-2">En attente de réponse de <strong style={{ color: "#f0f0ff" }}>{selectedTeam.emoji} {selectedTeam.name}</strong>...</p>
                    <p className="text-xs text-text-tertiary mt-1">Vous serez notifié dès qu'ils acceptent.</p>
                  </div>

                  {/* Bouton démo — simule l'acceptation adverse */}
                  <div className="w-full p-4 rounded-lg border border-dashed text-center" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                    <p className="text-[10px] text-text-tertiary mb-3">— MODE DÉMO —</p>
                    <button onClick={() => setFlowStep("accepted")}
                      className="px-6 py-2 rounded-lg text-sm font-bold transition-colors hover:opacity-90"
                      style={{ backgroundColor: "rgba(0,229,160,0.15)", border: "1px solid rgba(0,229,160,0.3)", color: "#00e5a0" }}>
                      ✅ Simuler l'acceptation de {selectedTeam.name}
                    </button>
                  </div>

                  <button onClick={closeModal} className="text-xs text-text-tertiary hover:text-text-secondary transition-colors">Annuler le défi</button>
                </div>
              )}

              {/* ── ÉTAPE 3 : SÉLECTION TERRAIN ── */}
              {flowStep === "accepted" && (
                <div className="p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
                  <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "rgba(0,229,160,0.08)", border: "1px solid rgba(0,229,160,0.2)" }}>
                    <CheckCircle className="h-5 w-5 shrink-0" style={{ color: "#00e5a0" }} />
                    <div>
                      <p className="text-sm font-bold" style={{ color: "#00e5a0" }}>Défi accepté par {selectedTeam.name} ! 🎉</p>
                      <p className="text-xs text-text-secondary">Choisissez maintenant le terrain et le créneau.</p>
                    </div>
                  </div>

                  {/* Club */}
                  <div>
                    <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <Building2 className="h-3 w-3" /> Club
                    </label>
                    <div className="p-3 rounded-lg border border-border text-sm text-foreground" style={{ backgroundColor: "#0d0d1a" }}>
                      🏟 {selectedTeam.club}
                    </div>
                  </div>

                  {/* Créneau horaire */}
                  <div>
                    <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <Clock className="h-3 w-3" /> Créneau horaire
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {TIME_SLOTS.map(slot => {
                        const taken = TAKEN_SLOTS.includes(slot)
                        const selected = selectedSlot === slot
                        return (
                          <button key={slot} onClick={() => !taken && setSelectedSlot(slot)} disabled={taken}
                            className="py-2 rounded-lg text-xs font-bold transition-all"
                            style={{
                              backgroundColor: taken ? "rgba(255,61,113,0.1)" : selected ? "rgba(0,229,160,0.2)" : "#0d0d1a",
                              border: `1px solid ${taken ? "rgba(255,61,113,0.3)" : selected ? "rgba(0,229,160,0.5)" : "rgba(255,255,255,0.07)"}`,
                              color: taken ? "#ff3d71" : selected ? "#00e5a0" : "#a0a0c0",
                              cursor: taken ? "not-allowed" : "pointer",
                              opacity: taken ? 0.6 : 1,
                            }}>{slot}</button>
                        )
                      })}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-primary" /><span className="text-[10px] text-text-tertiary">Disponible</span></div>
                      <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-destructive" /><span className="text-[10px] text-text-tertiary">Occupé</span></div>
                    </div>
                  </div>

                  {/* Court */}
                  <div>
                    <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <Calendar className="h-3 w-3" /> Court
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {COURTS.map(court => (
                        <button key={court} onClick={() => setSelectedCourt(court)}
                          className="px-4 py-2 rounded-lg text-xs font-bold transition-all"
                          style={{
                            backgroundColor: selectedCourt === court ? "rgba(0,229,160,0.15)" : "#0d0d1a",
                            border: `1px solid ${selectedCourt === court ? "rgba(0,229,160,0.4)" : "rgba(255,255,255,0.07)"}`,
                            color: selectedCourt === court ? "#00e5a0" : "#a0a0c0",
                          }}>{court}</button>
                      ))}
                    </div>
                  </div>

                  <button onClick={() => selectedSlot && setFlowStep("payment")} disabled={!selectedSlot}
                    className="w-full h-11 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: selectedSlot ? "#00e5a0" : "rgba(255,255,255,0.05)",
                      color: selectedSlot ? "#000" : "#606080",
                      cursor: selectedSlot ? "pointer" : "not-allowed",
                    }}>
                    <CreditCard className="h-4 w-4" />
                    {selectedSlot ? `Confirmer — ${selectedSlot} · ${selectedCourt}` : "Sélectionnez un créneau"}
                  </button>
                </div>
              )}

              {/* ── ÉTAPE 4 : PAIEMENT ── */}
              {flowStep === "payment" && (
                <div className="p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="font-[var(--font-rajdhani)] text-xl text-foreground">Paiement</DialogTitle>
                    <DialogDescription className="text-text-secondary">Les deux équipes paient maintenant pour confirmer le match</DialogDescription>
                  </DialogHeader>

                  {/* Récap match */}
                  <div className="rounded-lg p-4 border border-border" style={{ backgroundColor: "#0d0d1a" }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold font-[var(--font-rajdhani)] uppercase tracking-wider text-text-secondary">Match confirmé</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(0,229,160,0.1)", color: "#00e5a0" }}>✅ Accepté</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🦅</span>
                      <span className="text-sm font-bold text-foreground">Les Aigles</span>
                      <span className="text-xs text-text-tertiary mx-2">VS</span>
                      <span className="text-xl">{selectedTeam.emoji}</span>
                      <span className="text-sm font-bold text-foreground">{selectedTeam.name}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-xs text-text-secondary">
                      <span>🏟 {selectedTeam.club}</span>
                      <span>⏰ {selectedSlot}</span>
                      <span>🎾 {selectedCourt}</span>
                    </div>
                  </div>

                  {/* Détail paiement */}
                  <div className="rounded-lg p-4 border border-border flex flex-col gap-3" style={{ backgroundColor: "#0d0d1a" }}>
                    <h4 className="text-xs font-bold font-[var(--font-rajdhani)] uppercase tracking-wider text-foreground flex items-center gap-2">
                      <CreditCard className="h-3.5 w-3.5 text-primary" /> Détail du paiement
                    </h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-text-secondary">Terrain (équipe complète)</span>
                        <p className="text-[10px] text-text-tertiary">→ 18€ au club · 2€ Padel Arena</p>
                      </div>
                      <span className="text-sm text-foreground tabular-nums">20 €</span>
                    </div>
                    {challengeBetEnabled && challengeBetValue > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-warning">Pari optionnel</span>
                        <span className="text-sm text-warning tabular-nums">{challengeBetValue} €</span>
                      </div>
                    )}
                    <div className="h-px" style={{ backgroundColor: "rgba(255,255,255,0.07)" }} />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-foreground uppercase">Total</span>
                      <span className="text-xl font-bold font-[var(--font-rajdhani)] text-primary tabular-nums">{challengeTotal} €</span>
                    </div>
                    {challengeBetEnabled && challengeBetValue > 0 && (
                      <div className="flex items-center justify-between pt-1 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                        <span className="text-xs text-text-secondary">Gains potentiels si victoire</span>
                        <span className="text-sm font-bold tabular-nums" style={{ color: "#00e5a0" }}>{challengePotentialWinnings} € net</span>
                      </div>
                    )}
                  </div>

                  <div className="rounded-lg p-3 border" style={{ backgroundColor: "rgba(0,229,160,0.04)", borderColor: "rgba(0,229,160,0.15)" }}>
                    <p className="text-xs text-text-secondary text-center">
                      🔒 Paiement sécurisé · Débité maintenant · Le terrain est confirmé instantanément
                    </p>
                  </div>

                  <button onClick={() => { setFlowStep("confirmed"); setTimeout(closeModal, 2000) }}
                    className="w-full h-11 rounded-lg text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                    <CreditCard className="h-4 w-4" /> Payer {challengeTotal} € via Stripe
                  </button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </>
  )
}