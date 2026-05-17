"use client"

import { useState, useCallback } from "react"
import { Topbar } from "@/components/topbar"
import { RankBadge } from "@/components/rank-badge"
import { EloBar } from "@/components/elo-bar"
import { TrustBar } from "@/components/trust-bar"
import { StatCard } from "@/components/stat-card"
import { ReportPill } from "@/components/report-pill"
import { CURRENT_PLAYER, REPORT_REASONS, getRank } from "@/lib/mock-data"
import { MapPin, Star, TrendingUp, Flame, AlertTriangle, Send, Camera, Pencil, Check, X, Upload } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

const PRESET_AVATARS = [
  ["#00e5a0", "#0088ff"],
  ["#ff6b35", "#ff3d71"],
  ["#ffd700", "#ff6b35"],
  ["#9b59b6", "#c084fc"],
  ["#5bb8f5", "#2ecc71"],
  ["#e74c3c", "#ff6b35"],
  ["#f39c12", "#ffd700"],
  ["#c0c0c0", "#9db8cc"],
]

const TAKEN_USERNAMES = ["AceKing", "SmashX", "NinjaJump", "VoltStrike", "NetBlade"]

export default function ProfilePage() {
  const [showReport, setShowReport] = useState(false)
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [selectedReasons, setSelectedReasons] = useState<string[]>([])
  const [reportComment, setReportComment] = useState("")
  const [isEditingName, setIsEditingName] = useState(false)
  const [username, setUsername] = useState(CURRENT_PLAYER.name)
  const [editUsername, setEditUsername] = useState(CURRENT_PLAYER.name)
  const [avatarGradient, setAvatarGradient] = useState(CURRENT_PLAYER.avatarGradient)
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const player = CURRENT_PLAYER
  const rank = getRank(player.elo)

  const eloHistory = player.eloHistory
  const minElo = Math.min(...eloHistory) - 50
  const maxElo = Math.max(...eloHistory) + 50
  const chartWidth = 600
  const chartHeight = 200
  const points = eloHistory.map((elo, i) => {
    const x = (i / (eloHistory.length - 1)) * chartWidth
    const y = chartHeight - ((elo - minElo) / (maxElo - minElo)) * chartHeight
    return `${x},${y}`
  })
  const linePath = `M ${points.join(" L ")}`
  const areaPath = `${linePath} L ${chartWidth},${chartHeight} L 0,${chartHeight} Z`

  const toggleReason = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]
    )
  }

  const isUsernameTaken = editUsername !== username && TAKEN_USERNAMES.some(n => n.toLowerCase() === editUsername.toLowerCase())
  const isUsernameValid = editUsername.length >= 3 && editUsername.length <= 20 && /^[a-zA-Z0-9_]+$/.test(editUsername)

  const handleSaveUsername = useCallback(() => {
    if (isUsernameValid && !isUsernameTaken) {
      setUsername(editUsername)
      setIsEditingName(false)
    }
  }, [editUsername, isUsernameValid, isUsernameTaken])

  const handleCancelEdit = useCallback(() => {
    setEditUsername(username)
    setIsEditingName(false)
  }, [username])

  const handleSaveAvatar = useCallback(() => {
    if (selectedPreset !== null) {
      setAvatarGradient(PRESET_AVATARS[selectedPreset])
    }
    setShowAvatarModal(false)
    setSelectedPreset(null)
  }, [selectedPreset])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    // In a real app, handle file upload here
  }, [])

  const recentMVPs = [
    { match: "vs Ibiza Boys", date: "15 Jan" },
    { match: "vs Force 5000", date: "12 Jan" },
    { match: "vs Alpha Padel", date: "11 Jan" },
  ]

  return (
    <>
      <Topbar title="Profil">
        <button
          onClick={() => setShowReport(true)}
          className="h-8 px-3 rounded-md text-xs font-medium border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-1.5"
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          Signaler
        </button>
      </Topbar>

      <div className="flex flex-col">
        {/* Banner */}
        <div
          className="h-32 relative"
          style={{
            background: `linear-gradient(135deg, ${rank.color}30, ${rank.color}08, transparent)`,
          }}
        >
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent, #070710)" }} />
        </div>

        <div className="px-6 -mt-10 relative z-10 flex flex-col gap-6">
          {/* Avatar + Name */}
          <div className="flex items-end gap-4">
            {/* Avatar with camera overlay */}
            <div className="relative group">
              <div
                className="h-20 w-20 rounded-xl border-2 shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${avatarGradient[0]}, ${avatarGradient[1]})`,
                  borderColor: rank.color,
                }}
              />
              {player.mvpCount > 10 && (
                <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-warning flex items-center justify-center">
                  <Star className="h-3 w-3 text-warning-foreground" />
                </div>
              )}
              {/* Camera overlay on hover */}
              <button
                onClick={() => setShowAvatarModal(true)}
                className="absolute inset-0 rounded-xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="h-6 w-6 text-foreground" />
              </button>
            </div>

            <div className="pb-1 flex-1 min-w-0">
              {/* Editable username */}
              {isEditingName ? (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <input
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      className="text-2xl font-bold font-[var(--font-rajdhani)] text-foreground bg-transparent border-b-2 border-primary focus:outline-none w-full max-w-[200px]"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveUsername()
                        if (e.key === "Escape") handleCancelEdit()
                      }}
                    />
                    <button
                      onClick={handleSaveUsername}
                      disabled={!isUsernameValid || isUsernameTaken}
                      className="h-7 w-7 rounded-md flex items-center justify-center hover:bg-primary/20 transition-colors text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="h-7 w-7 rounded-md flex items-center justify-center hover:bg-destructive/20 transition-colors text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  {/* Username feedback */}
                  {editUsername.length >= 3 && (
                    <span className={`text-xs ${isUsernameTaken ? "text-destructive" : "text-primary"}`}>
                      {isUsernameTaken ? "Pseudo deja pris" : "Pseudo disponible"}
                    </span>
                  )}
                  {editUsername.length > 0 && editUsername.length < 3 && (
                    <span className="text-xs text-warning">3 caracteres minimum</span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold font-[var(--font-rajdhani)] text-foreground">
                    {username}
                  </h2>
                  <button
                    onClick={() => { setEditUsername(username); setIsEditingName(true) }}
                    className="h-7 w-7 rounded-md flex items-center justify-center hover:bg-elevated transition-colors text-text-tertiary hover:text-foreground"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-text-tertiary" />
                  <span className="text-xs text-text-secondary">{player.city}</span>
                </div>
                <TrustBar score={player.trust} className="w-20" />
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2 pb-1">
              <RankBadge elo={player.elo} size="md" showLabel />
            </div>
          </div>

          {/* 4 Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Elo" value={player.elo} accentColor={rank.color} icon={<TrendingUp className="h-4 w-4" />} />
            <StatCard label="Win Rate" value={`${player.winRate}%`} accentColor="#00e5a0" />
            <StatCard label="MVP Total" value={player.mvpCount} accentColor="#ffaa00" icon={<Star className="h-4 w-4" />} />
            <StatCard label="Max Streak" value={player.bestStreak} accentColor="#b9f2ff" icon={<Flame className="h-4 w-4" />} />
          </div>

          {/* Elo Progress */}
          <EloBar elo={player.elo} />

          {/* Elo Chart + MVP list */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-xl p-4 border border-border" style={{ backgroundColor: "#12121f" }}>
              <h3 className="text-sm font-semibold font-[var(--font-rajdhani)] text-foreground uppercase tracking-wider mb-4">
                Evolution Elo (30 jours)
              </h3>
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-48">
                {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
                  <line
                    key={pct}
                    x1="0"
                    y1={pct * chartHeight}
                    x2={chartWidth}
                    y2={pct * chartHeight}
                    stroke="rgba(255,255,255,0.04)"
                    strokeWidth="1"
                  />
                ))}
                <path d={areaPath} fill={`${rank.color}10`} />
                <path d={linePath} fill="none" stroke={rank.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle
                  cx={chartWidth}
                  cy={chartHeight - ((eloHistory[eloHistory.length - 1] - minElo) / (maxElo - minElo)) * chartHeight}
                  r="4"
                  fill={rank.color}
                />
              </svg>
            </div>

            <div className="rounded-xl p-4 border border-border" style={{ backgroundColor: "#12121f" }}>
              <h3 className="text-sm font-semibold font-[var(--font-rajdhani)] text-foreground uppercase tracking-wider mb-4">
                MVP recents
              </h3>
              <div className="flex flex-col gap-3">
                {recentMVPs.map((mvp, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-elevated/50 transition-colors">
                    <div className="h-8 w-8 rounded-md flex items-center justify-center" style={{ backgroundColor: "rgba(255,170,0,0.15)" }}>
                      <Star className="h-4 w-4 text-warning" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm text-foreground">{mvp.match}</span>
                      <p className="text-[10px] text-text-tertiary">{mvp.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Change Modal */}
      <Dialog open={showAvatarModal} onOpenChange={setShowAvatarModal}>
        <DialogContent className="border-border" style={{ backgroundColor: "#12121f" }}>
          <DialogHeader>
            <DialogTitle className="font-[var(--font-rajdhani)] text-xl text-foreground">Changer la photo</DialogTitle>
            <DialogDescription className="text-text-secondary">
              Importez une image ou choisissez un avatar
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-5">
            {/* Drag & drop zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="rounded-xl border-2 border-dashed p-8 flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer"
              style={{
                borderColor: isDragging ? "#00e5a0" : "rgba(255,255,255,0.1)",
                backgroundColor: isDragging ? "rgba(0,229,160,0.05)" : "#0d0d1a",
              }}
              onClick={() => {/* trigger file input in a real app */}}
            >
              <Upload className="h-8 w-8 text-text-tertiary" />
              <p className="text-sm text-text-secondary text-center">
                Glissez une image ici ou cliquez pour parcourir
              </p>
              <p className="text-[10px] text-text-tertiary">PNG, JPG, max 2 Mo</p>
            </div>

            {/* Separator */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ backgroundColor: "rgba(255,255,255,0.07)" }} />
              <span className="text-xs text-text-tertiary">ou choisissez un avatar</span>
              <div className="flex-1 h-px" style={{ backgroundColor: "rgba(255,255,255,0.07)" }} />
            </div>

            {/* Preset gradient avatars */}
            <div className="grid grid-cols-4 gap-3">
              {PRESET_AVATARS.map((gradient, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedPreset(i)}
                  className="aspect-square rounded-xl border-2 transition-all hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
                    borderColor: selectedPreset === i ? "#00e5a0" : "rgba(255,255,255,0.07)",
                    boxShadow: selectedPreset === i ? "0 0 12px rgba(0,229,160,0.3)" : "none",
                  }}
                />
              ))}
            </div>

            {/* Save */}
            <button
              onClick={handleSaveAvatar}
              disabled={selectedPreset === null}
              className="w-full h-10 rounded-md text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Sauvegarder
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report Modal */}
      <Dialog open={showReport} onOpenChange={setShowReport}>
        <DialogContent className="border-border" style={{ backgroundColor: "#12121f" }}>
          <DialogHeader>
            <DialogTitle className="font-[var(--font-rajdhani)] text-xl text-foreground">Signaler {username}</DialogTitle>
            <DialogDescription className="text-text-secondary">
              Selectionnez une ou plusieurs raisons
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {REPORT_REASONS.map((reason) => (
                <ReportPill
                  key={reason}
                  reason={reason}
                  selected={selectedReasons.includes(reason)}
                  onClick={() => toggleReason(reason)}
                />
              ))}
            </div>

            <textarea
              value={reportComment}
              onChange={(e) => setReportComment(e.target.value)}
              placeholder="Commentaire (optionnel)..."
              rows={3}
              className="rounded-md px-3 py-2 text-sm bg-background border border-border text-foreground placeholder:text-text-tertiary focus:border-primary focus:outline-none resize-none"
            />

            <button
              onClick={() => setShowReport(false)}
              disabled={selectedReasons.length === 0}
              className="w-full h-10 rounded-md text-sm font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
              Envoyer le signalement
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
