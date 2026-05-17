interface TrustBarProps {
  score: number
  className?: string
}

export function TrustBar({ score, className = "" }: TrustBarProps) {
  const getColor = (s: number) => {
    if (s >= 80) return "#00e5a0"
    if (s >= 60) return "#ffaa00"
    return "#ff3d71"
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${score}%`,
            backgroundColor: getColor(score),
          }}
        />
      </div>
      <span className="text-xs font-bold tabular-nums" style={{ color: getColor(score) }}>
        {score}
      </span>
    </div>
  )
}
