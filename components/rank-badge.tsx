import Image from "next/image"
import { getRank, getRankById, RANKS } from "@/lib/mock-data"

const SIZES = { xs: 20, sm: 28, md: 44, lg: 72, xl: 110 }

interface RankBadgeProps {
  rankId?: string
  elo?: number
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  showLabel?: boolean
  glow?: boolean
}

export function RankBadge({ rankId, elo, size = "md", showLabel = false, glow = false }: RankBadgeProps) {
  const rank = rankId ? getRankById(rankId) : elo !== undefined ? getRank(elo) : RANKS[3]
  const px = SIZES[size]

  return (
    <span className="inline-flex items-center gap-2">
      <span
        style={{
          display: "inline-block",
          width: px,
          height: px,
          filter: glow ? `drop-shadow(0 0 ${Math.round(px * 0.35)}px ${rank.color})` : undefined,
          transition: "filter 0.2s",
          flexShrink: 0,
        }}
      >
        <Image
          src={`/ranks/${rank.id}.png`}
          alt={rank.name}
          width={px}
          height={px}
          unoptimized
          style={{ objectFit: "contain", width: "100%", height: "100%" }}
          priority
        />
      </span>
      {showLabel && (
        <span
          style={{
            color: rank.color,
            fontFamily: "Rajdhani, sans-serif",
            fontWeight: 700,
            fontSize: Math.max(12, Math.round(px * 0.3)),
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {rank.name}
        </span>
      )}
    </span>
  )
}

export function RankBadgeByName({ rankName, size = "md", showLabel = false }: { rankName: string; size?: "xs" | "sm" | "md" | "lg" | "xl"; showLabel?: boolean }) {
  const rank = RANKS.find(r => r.name === rankName)
  if (!rank) return null
  return <RankBadge elo={rank.min} size={size} showLabel={showLabel} />
}
