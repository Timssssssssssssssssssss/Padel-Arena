import { getRank } from "@/lib/mock-data"

interface MatchRowProps {
  opponent: string
  opponentEmoji: string
  result: "W" | "L" | string
  score: string
  eloDelta: number
  date: string
}

export function MatchRow({ opponent, opponentEmoji, result, score, eloDelta, date }: MatchRowProps) {
  const isWin = result === "W"

  return (
    <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-elevated/50 transition-colors group">
      <div
        className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold font-[var(--font-rajdhani)] shrink-0"
        style={{
          backgroundColor: isWin ? "rgba(0,229,160,0.15)" : "rgba(255,61,113,0.15)",
          color: isWin ? "#00e5a0" : "#ff3d71",
        }}
      >
        {result}
      </div>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-lg">{opponentEmoji}</span>
        <span className="text-sm font-medium text-foreground truncate">{opponent}</span>
      </div>
      <span className="text-xs text-text-secondary hidden sm:block">{score}</span>
      <span
        className="text-sm font-bold font-[var(--font-rajdhani)] tabular-nums w-12 text-right"
        style={{ color: eloDelta > 0 ? "#00e5a0" : "#ff3d71" }}
      >
        {eloDelta > 0 ? "+" : ""}{eloDelta}
      </span>
    </div>
  )
}
