interface StatCardProps {
  label: string
  value: string | number
  subtitle?: string
  accentColor?: string
  icon?: React.ReactNode
}

export function StatCard({ label, value, subtitle, accentColor = "#00e5a0", icon }: StatCardProps) {
  return (
    <div
      className="rounded-lg p-4 flex flex-col gap-1 relative overflow-hidden"
      style={{
        backgroundColor: "#12121f",
        borderBottom: `2px solid ${accentColor}`,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-secondary uppercase tracking-wider">{label}</span>
        {icon && <span className="text-text-tertiary">{icon}</span>}
      </div>
      <span
        className="text-2xl font-bold font-[var(--font-rajdhani)]"
        style={{ color: accentColor }}
      >
        {value}
      </span>
      {subtitle && (
        <span className="text-[11px] text-text-tertiary">{subtitle}</span>
      )}
    </div>
  )
}
