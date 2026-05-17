"use client"

import { useState, useMemo } from "react"
import { Topbar } from "@/components/topbar"
import { RankBadge } from "@/components/rank-badge"
import {
  LEADERBOARD,
  LOCAL_LEADERBOARD,
  FRENCH_CITIES,
  getRank,
  type LeaderboardPlayer,
} from "@/lib/mock-data"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ChevronDown, MapPin } from "lucide-react"

const DEFAULT_AVATAR = "#ffd700"

const LOCAL_AVATAR_COLORS = ["#ff6b35", "#50c878", "#b9f2ff", "#ffd700", "#ff3d71"]

function PodiumSection({ players }: { players: LeaderboardPlayer[] }) {
  const top3 = players.slice(0, 3)
  if (top3.length < 3) return null

  const podiumOrder = [1, 0, 2]
  const podiumHeights = ["h-28", "h-36", "h-24"]

  return (
    <div className="flex items-end justify-center gap-4 mb-8">
      {podiumOrder.map((idx, visualPos) => {
        const player = top3[idx]
        const rank = getRank(player.elo)
        const avatarColor = player.avatar ?? DEFAULT_AVATAR

        return (
          <div key={player.id} className="flex flex-col items-center gap-3">
            <div className="relative">
              <div
                className="h-16 w-16 rounded-full border-2"
                style={{
                  backgroundColor: avatarColor,
                  borderColor: rank.color,
                }}
              />
              <span
                className="absolute -top-2 -right-2 text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: rank.color, color: "#070710" }}
              >
                #{idx + 1}
              </span>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold font-[var(--font-rajdhani)] text-foreground">{player.name}</p>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <RankBadge elo={player.elo} size="sm" />
                <span className="text-sm font-bold font-[var(--font-rajdhani)] tabular-nums" style={{ color: rank.color }}>
                  {player.elo}
                </span>
              </div>
            </div>
            <div
              className={`w-24 ${podiumHeights[visualPos]} rounded-t-lg flex items-start justify-center pt-3`}
              style={{
                background: `linear-gradient(180deg, ${rank.color}30, ${rank.color}08)`,
                borderTop: `2px solid ${rank.color}`,
              }}
            >
              <span className="text-lg font-bold font-[var(--font-orbitron)]" style={{ color: rank.color }}>
                #{idx + 1}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function RankedRows({ players }: { players: LeaderboardPlayer[] }) {
  return (
    <div className="rounded-xl border border-border overflow-hidden" style={{ backgroundColor: "#12121f" }}>
      {players.map((player, i) => {
        const rank = getRank(player.elo)
        const avatarColor = player.avatar ?? DEFAULT_AVATAR

        return (
          <div
            key={player.id}
            className="flex items-center gap-4 px-4 py-3 border-b border-border/50 last:border-b-0 transition-colors"
            style={{
              backgroundColor: player.isMe ? "rgba(0,229,160,0.08)" : "transparent",
            }}
          >
            <span className="w-8 text-sm font-bold font-[var(--font-rajdhani)] text-text-tertiary tabular-nums text-center">
              #{player.rank ?? i + 1}
            </span>
            <RankBadge elo={player.elo} size="sm" />
            <div
              className="h-7 w-7 rounded-full shrink-0"
              style={{ backgroundColor: avatarColor }}
            />
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-foreground">
                {player.name}
                {player.isMe && (
                  <span className="text-primary text-xs ml-1.5">(moi)</span>
                )}
              </span>
            </div>
            <span className="text-xs text-text-secondary tabular-nums hidden sm:block">{player.wr}% WR</span>
            <span
              className="text-sm font-bold font-[var(--font-rajdhani)] tabular-nums w-16 text-right"
              style={{ color: rank.color }}
            >
              {player.elo}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function CitySelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border text-sm font-medium text-foreground hover:border-primary/40 transition-colors"
        style={{ backgroundColor: "#12121f" }}
      >
        <MapPin className="h-3.5 w-3.5 text-primary" />
        {value}
        <ChevronDown className={`h-3.5 w-3.5 text-text-tertiary transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div
          className="absolute top-full mt-1 left-0 w-64 max-h-72 overflow-y-auto rounded-lg border border-border shadow-xl z-50"
          style={{ backgroundColor: "#12121f" }}
        >
          {FRENCH_CITIES.map((city) => (
            <button
              key={city}
              onClick={() => { onChange(city); setOpen(false) }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-primary/10 transition-colors"
              style={{ color: city === value ? "#00e5a0" : "#a0a0c0" }}
            >
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function LeaderboardPage() {
  const [selectedCity, setSelectedCity] = useState("Lyon")

  const globalPlayers = useMemo(
    () => [...LEADERBOARD].sort((a, b) => b.elo - a.elo),
    [],
  )

  const localPlayers = useMemo(() => {
    const data = LOCAL_LEADERBOARD[selectedCity]
    if (data) return [...data].sort((a, b) => b.elo - a.elo)
    return Array.from({ length: 5 }, (_, i) => ({
      id: `gen-${selectedCity}-${i}`,
      rank: i + 1,
      name: `${selectedCity}Player${i + 1}`,
      elo: 5000 - i * 400 + Math.floor(Math.random() * 200),
      rankId: "platine",
      wr: 70 - i * 4,
      avatar: LOCAL_AVATAR_COLORS[i] ?? DEFAULT_AVATAR,
    })).sort((a, b) => b.elo - a.elo)
  }, [selectedCity])

  return (
    <>
      <Topbar title="Classement" />

      <div className="p-6 flex flex-col gap-6">
        <Tabs defaultValue="global">
          <TabsList className="bg-elevated border border-border">
            <TabsTrigger value="global" className="text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Global</TabsTrigger>
            <TabsTrigger value="local" className="text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Local</TabsTrigger>
            <TabsTrigger value="teams" className="text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Equipes</TabsTrigger>
            <TabsTrigger value="mvp" className="text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary">MVP</TabsTrigger>
          </TabsList>

          <TabsContent value="global" className="mt-6">
            <PodiumSection players={globalPlayers} />
            <RankedRows players={globalPlayers} />
          </TabsContent>

          <TabsContent value="local" className="mt-6">
            <div className="flex items-center gap-3 mb-6">
              <CitySelector value={selectedCity} onChange={setSelectedCity} />
              <span className="text-xs text-text-tertiary">{localPlayers.length} joueurs</span>
            </div>
            {localPlayers.length >= 3 && <PodiumSection players={localPlayers} />}
            <RankedRows players={localPlayers} />
          </TabsContent>

          <TabsContent value="teams" className="mt-6">
            <div className="rounded-xl p-8 text-center" style={{ backgroundColor: "#12121f" }}>
              <p className="text-text-secondary text-sm">Classement equipes - A venir</p>
            </div>
          </TabsContent>
          <TabsContent value="mvp" className="mt-6">
            <div className="rounded-xl p-8 text-center" style={{ backgroundColor: "#12121f" }}>
              <p className="text-text-secondary text-sm">Classement MVP - A venir</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
