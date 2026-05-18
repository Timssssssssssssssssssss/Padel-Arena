"use client"
 
interface TopbarProps {
  title: string
  children?: React.ReactNode
}
 
export function Topbar({ title, children }: TopbarProps) {
  return (
    <header
      className="sticky top-0 z-30 h-14 flex items-center border-b border-border relative"
      style={{ backgroundColor: "rgba(7,7,16,0.8)", backdropFilter: "blur(12px)" }}
    >
      {/* Titre centré absolument */}
      <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-semibold font-[var(--font-rajdhani)] text-foreground tracking-wide whitespace-nowrap">
        {title}
      </h1>
      {/* Actions à droite */}
      {children && (
        <div className="ml-auto flex items-center gap-3 pr-4">
          {children}
        </div>
      )}
    </header>
  )
}