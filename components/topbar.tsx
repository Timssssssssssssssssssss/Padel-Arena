"use client"
 
interface TopbarProps {
  title: string
  children?: React.ReactNode
}
 
export function Topbar({ title, children }: TopbarProps) {
  return (
    <header
      className="sticky top-0 z-30 h-14 flex items-center justify-between border-b border-border"
      style={{ backgroundColor: "rgba(7,7,16,0.8)", backdropFilter: "blur(12px)", paddingLeft: "clamp(56px, 5vw, 24px)", paddingRight: "24px" }}
    >
      {/* Sur mobile on décale à droite du bouton ☰ (56px) */}
      <h1 className="text-xl font-semibold font-[var(--font-rajdhani)] text-foreground tracking-wide pl-12 md:pl-0">
        {title}
      </h1>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </header>
  )
}
 