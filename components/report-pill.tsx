"use client"

import { cn } from "@/lib/utils"

interface ReportPillProps {
  reason: string
  selected?: boolean
  onClick?: () => void
}

export function ReportPill({ reason, selected = false, onClick }: ReportPillProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
        selected
          ? "bg-destructive/20 border-destructive text-destructive"
          : "bg-elevated border-border text-text-secondary hover:border-text-secondary"
      )}
    >
      {reason}
    </button>
  )
}
