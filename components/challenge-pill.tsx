"use client"

import { Check, X } from "lucide-react"
import { RankBadge } from "./rank-badge"

interface ChallengePillProps {
  teamName: string
  teamEmoji: string
  elo: number
  message?: string
  estimatedGain: number
  estimatedLoss: number
  onAccept?: () => void
  onDecline?: () => void
}

export function ChallengePill({ teamName, teamEmoji, elo, message, estimatedGain, estimatedLoss, onAccept, onDecline }: ChallengePillProps) {
  return (
    <div className="rounded-lg p-3 border border-border hover:border-primary/30 transition-colors" style={{ backgroundColor: "#12121f" }}>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-xl">{teamEmoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold font-[var(--font-rajdhani)] text-foreground">{teamName}</span>
            <RankBadge elo={elo} size="sm" />
          </div>
          {message && <p className="text-xs text-text-secondary truncate">{`"${message}"`}</p>}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs">
          <span className="text-primary font-bold">+{estimatedGain}</span>
          <span className="text-destructive font-bold">{estimatedLoss}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={onDecline}
            className="h-7 w-7 rounded-md flex items-center justify-center hover:bg-destructive/20 transition-colors text-destructive"
          >
            <X className="h-4 w-4" />
          </button>
          <button
            onClick={onAccept}
            className="h-7 w-7 rounded-md flex items-center justify-center hover:bg-primary/20 transition-colors text-primary"
          >
            <Check className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
