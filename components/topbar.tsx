"use client"

interface TopbarProps {
  title: string
  children?: React.ReactNode
}

export function Topbar({ title, children }: TopbarProps) {
  return (
    <header
      className="sticky top-0 z-30 h-14 flex items-center justify-between px-6 border-b border-border"
      style={{ backgroundColor: "rgba(7,7,16,0.8)", backdropFilter: "blur(12px)" }}
    >
      <h1 className="text-xl font-semibold font-[var(--font-rajdhani)] text-foreground tracking-wide">
        {title}
      </h1>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </header>
  )
}
