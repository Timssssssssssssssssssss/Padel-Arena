"use client"

import { getRank, getNextRank, getRankProgress } from "@/lib/mock-data"

interface EloBarProps {
  elo: number
  showLabels?: boolean
  className?: string
}

export function EloBar({ elo, showLabels = true, className = "" }: EloBarProps) {
  const rank = getRank(elo)
  const nextRank = getNextRank(elo)
  const progress = getRankProgress(elo)

  return (
    <div className={`w-full ${className}`}>
      {showLabels && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium" style={{ color: rank.color }}>
            {rank.name}
          </span>
          {nextRank && (
            <span className="text-xs" style={{ color: nextRank.color }}>
              {nextRank.name} ({nextRank.min})
            </span>
          )}
        </div>
      )}
      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${rank.color}15` }}>
        <div
          className="h-full rounded-full elo-bar-fill transition-all duration-1000"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${rank.color}80, ${rank.color})`,
          }}
        />
      </div>
      {showLabels && nextRank && (
        <div className="flex justify-end mt-1">
          <span className="text-[10px] text-text-tertiary">
            {nextRank.min - elo} pts restants
          </span>
        </div>
      )}
    </div>
  )
}
