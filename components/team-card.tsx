import { RankBadge } from "./rank-badge"

interface TeamCardProps {
  emoji: string
  name: string
  elo: number
  wins: number
  draws: number
  streak: number
  compact?: boolean
}

export function TeamCard({ emoji, name, elo, wins, draws, streak, compact = false }: TeamCardProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-lg">{emoji}</span>
        <span className="text-sm font-semibold font-[var(--font-rajdhani)] text-foreground">{name}</span>
        <RankBadge elo={elo} size="sm" />
        <span className="text-xs text-text-secondary tabular-nums">{elo}</span>
      </div>
    )
  }

  return (
    <div className="rounded-lg p-4" style={{ backgroundColor: "#12121f" }}>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{emoji}</span>
        <div>
          <h3 className="font-bold font-[var(--font-rajdhani)] text-lg text-foreground">{name}</h3>
          <div className="flex items-center gap-2">
            <RankBadge elo={elo} size="sm" />
            <span className="text-sm text-text-secondary tabular-nums">{elo} Elo</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <span className="text-primary font-bold">{wins}V</span>
          <span className="text-text-tertiary">{draws}D</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-warning">{streak}</span>
          <span className="text-text-tertiary">streak</span>
        </div>
      </div>
    </div>
  )
}
