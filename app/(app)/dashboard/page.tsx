"use client"
 
import { Topbar } from "@/components/topbar"
import { RankBadge } from "@/components/rank-badge"
import { EloBar } from "@/components/elo-bar"
import { StatCard } from "@/components/stat-card"
import { MatchRow } from "@/components/match-row"
import { TeamCard } from "@/components/team-card"
import { ChallengePill } from "@/components/challenge-pill"
import { TrustBar } from "@/components/trust-bar"
import { CURRENT_PLAYER, CURRENT_TEAM, RECENT_MATCHES, INCOMING_CHALLENGES, getRank } from "@/lib/mock-data"
import { Swords, Trophy, Flame, Star, TrendingUp, Zap } from "lucide-react"
 
export default function DashboardPage() {
  const rank = getRank(CURRENT_PLAYER.elo)
 
  return (
    <>
      <Topbar title="Dashboard" />
 
      <div className="p-6 flex flex-col gap-6">
        {/* Hero Card */}
        <div
          className="rounded-xl p-6 border border-border relative overflow-hidden"
          style={{ backgroundColor: "#12121f" }}
        >
          <div
            className="absolute inset-0 opacity-5"
            style={{
              background: `radial-gradient(ellipse at 30% 50%, ${rank.color}, transparent 70%)`,
            }}
          />
          <div className="relative flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex items-center gap-5">
              <RankBadge elo={CURRENT_PLAYER.elo} size="lg" showLabel />
              <div>
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-5xl font-bold font-[var(--font-orbitron)] tabular-nums tracking-tight"
                    style={{ color: rank.color }}
                  >
                    {CURRENT_PLAYER.elo}
                  </span>
                  <span className="text-sm text-text-secondary">Elo</span>
                </div>
                <EloBar elo={CURRENT_PLAYER.elo} className="mt-3 max-w-xs" />
              </div>
            </div>
 
            <div className="flex items-center gap-6 lg:ml-auto flex-wrap">
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold font-[var(--font-rajdhani)] text-foreground">{CURRENT_PLAYER.winRate}%</span>
                <span className="text-[10px] text-text-tertiary uppercase tracking-wider">WR</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold font-[var(--font-rajdhani)] text-warning">{CURRENT_PLAYER.streak}</span>
                  <Flame className="h-4 w-4 text-warning" />
                </div>
                <span className="text-[10px] text-text-tertiary uppercase tracking-wider">Streak</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold font-[var(--font-rajdhani)] text-chart-4">{CURRENT_PLAYER.mvpCount}</span>
                  <Star className="h-4 w-4 text-chart-4" />
                </div>
                <span className="text-[10px] text-text-tertiary uppercase tracking-wider">MVP</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-lg font-bold font-[var(--font-rajdhani)] text-foreground">{CURRENT_PLAYER.trust}</span>
                <TrustBar score={CURRENT_PLAYER.trust} className="w-16" />
                <span className="text-[10px] text-text-tertiary uppercase tracking-wider">Trust</span>
              </div>
            </div>
          </div>
        </div>
 
        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Matchs" value={CURRENT_PLAYER.matchesPlayed} subtitle="total" accentColor="#00e5a0" icon={<Swords className="h-4 w-4" />} />
          <StatCard label="Victoires" value={CURRENT_PLAYER.victories} subtitle={`${CURRENT_PLAYER.winRate}% winrate`} accentColor="#00e5a0" icon={<Trophy className="h-4 w-4" />} />
          <StatCard label="Best Streak" value={CURRENT_PLAYER.bestStreak} subtitle="victoires consecutives" accentColor="#ffaa00" icon={<Flame className="h-4 w-4" />} />
          <StatCard label="Peak Elo" value={CURRENT_PLAYER.peakElo} subtitle="record personnel" accentColor="#b9f2ff" icon={<TrendingUp className="h-4 w-4" />} />
        </div>
 
        {/* 2-col: Match history + Team & Challenges */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 rounded-xl border border-border overflow-hidden" style={{ backgroundColor: "#12121f" }}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h2 className="text-sm font-semibold font-[var(--font-rajdhani)] text-foreground uppercase tracking-wider">Historique recent</h2>
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div className="divide-y divide-border/50">
              {RECENT_MATCHES.map((match) => (
                <MatchRow key={match.id} opponent={match.opponent} opponentEmoji={match.opponentEmoji} result={match.result} score={match.score} eloDelta={match.eloDelta} date={match.date} />
              ))}
            </div>
          </div>
 
          <div className="lg:col-span-2 flex flex-col gap-4">
            <TeamCard emoji={CURRENT_TEAM.emoji} name={CURRENT_TEAM.name} elo={CURRENT_TEAM.elo} wins={CURRENT_TEAM.wins} draws={CURRENT_TEAM.draws} streak={CURRENT_TEAM.streak} />
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider px-1">Defis entrants</h3>
              {INCOMING_CHALLENGES.map((challenge) => (
                <ChallengePill key={challenge.id} teamName={challenge.teamName} teamEmoji={challenge.teamEmoji} elo={challenge.elo} message={challenge.message} estimatedGain={challenge.estimatedGain} estimatedLoss={challenge.estimatedLoss} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}