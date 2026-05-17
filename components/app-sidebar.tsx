"use client"
 
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Zap, Target, BarChart3, User, Users, ClipboardList, Trophy, Menu, X } from "lucide-react"
import { RankBadge } from "@/components/rank-badge"
import { CURRENT_PLAYER, getRank } from "@/lib/mock-data"
 
const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: Zap },
  { href: "/matchmaking", label: "Matchmaking", icon: Target, badge: 2 },
  { href: "/leaderboard", label: "Classement", icon: BarChart3 },
  { href: "/profile/p1", label: "Profil", icon: User },
  { href: "/equipe", label: "Equipe", icon: Users },
  { href: "/ranks", label: "Rangs", icon: ClipboardList },
  { href: "/match/result", label: "Résultat match", icon: Trophy },
]
 
export function AppSidebar() {
  const pathname = usePathname()
  const rank = getRank(CURRENT_PLAYER.elo)
  const [isOpen, setIsOpen] = useState(false)
 
  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-5 py-5 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-baseline gap-0.5" onClick={() => setIsOpen(false)}>
          <span className="text-xl font-bold font-[var(--font-orbitron)] text-foreground tracking-tight">
            PADEL
          </span>
          <span className="text-[9px] font-bold font-[var(--font-orbitron)] text-primary uppercase tracking-[0.2em]">
            ARENA
          </span>
        </Link>
        {/* Bouton fermer sur mobile */}
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-md hover:bg-elevated transition-colors"
          style={{ color: "#a0a0c0" }}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
 
      {/* Nav */}
      <nav className="flex-1 px-3 mt-2 overflow-y-auto">
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all relative group"
                  style={{
                    backgroundColor: isActive ? "rgba(0,229,160,0.1)" : "transparent",
                    color: isActive ? "#00e5a0" : "#a0a0c0",
                    borderLeft: isActive ? "3px solid #00e5a0" : "3px solid transparent",
                  }}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
 
      {/* Carte joueur en bas */}
      <div className="px-3 pb-4">
        <div className="rounded-lg p-3 border border-border" style={{ backgroundColor: "#12121f" }}>
          <div className="flex items-center gap-2.5">
            <div
              className="h-8 w-8 rounded-full shrink-0"
              style={{
                background: `linear-gradient(135deg, ${CURRENT_PLAYER.avatarGradient[0]}, ${CURRENT_PLAYER.avatarGradient[1]})`,
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{CURRENT_PLAYER.name}</p>
              <div className="flex items-center gap-1.5">
                <RankBadge elo={CURRENT_PLAYER.elo} size="sm" />
                <span className="text-[10px] font-bold tabular-nums" style={{ color: rank.color }}>
                  {CURRENT_PLAYER.elo}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
 
  return (
    <>
      {/* ── BOUTON HAMBURGER (mobile seulement) ── */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 flex items-center justify-center w-10 h-10 rounded-lg border border-border transition-colors"
        style={{ backgroundColor: "#0d0d1a", color: "#00e5a0" }}
      >
        <Menu className="h-5 w-5" />
      </button>
 
      {/* ── OVERLAY (mobile seulement) ── */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
 
      {/* ── SIDEBAR MOBILE (drawer) ── */}
      <aside
        className="md:hidden fixed left-0 top-0 h-screen w-[260px] flex flex-col border-r border-border z-50 transition-transform duration-300"
        style={{
          backgroundColor: "#0d0d1a",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {sidebarContent}
      </aside>
 
      {/* ── SIDEBAR DESKTOP (fixe) ── */}
      <aside
        className="hidden md:flex fixed left-0 top-0 h-screen w-[220px] flex-col border-r border-border z-40"
        style={{ backgroundColor: "#0d0d1a" }}
      >
        {sidebarContent}
      </aside>
    </>
  )
}