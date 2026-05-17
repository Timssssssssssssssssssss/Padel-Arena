"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { AuthCard, AuthInput, AuthPrimaryButton } from "@/components/auth/auth-card"
import { FRENCH_CITIES } from "@/lib/mock-data"
import { ChevronDown } from "lucide-react"

const SKILL_LEVELS = ["Debutant", "Intermediaire", "Avance", "Expert"] as const

export default function RegisterPage() {
  const router = useRouter()
  const [phone, setPhone] = useState("")
  const [smsSent, setSmsSent] = useState(false)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [skill, setSkill] = useState<string>(SKILL_LEVELS[1])
  const [city, setCity] = useState("Lyon")
  const [cityOpen, setCityOpen] = useState(false)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  const otpComplete = otp.every((d) => d.length === 1)

  function handleOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1)
    const next = [...otp]
    next[index] = digit
    setOtp(next)
    if (digit && index < 5) otpRefs.current[index + 1]?.focus()
  }

  function handleOtpKeyDown(index: number, key: string) {
    if (key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  return (
    <AuthCard title="Creer un compte Padel Arena">
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          if (smsSent && otpComplete) router.push("/dashboard")
        }}
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-text-secondary">Prenom</label>
            <AuthInput placeholder="Jean" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-text-secondary">Nom</label>
            <AuthInput placeholder="Dupont" required />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-text-secondary">Email</label>
          <AuthInput type="email" placeholder="vous@exemple.com" required />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-text-secondary">Mot de passe</label>
          <AuthInput type="password" placeholder="••••••••" required />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-text-secondary">Confirmer MDP</label>
          <AuthInput type="password" placeholder="••••••••" required />
        </div>

        <div
          className="rounded-lg p-4 border flex flex-col gap-3"
          style={{ backgroundColor: "#0d0d1a", borderColor: "rgba(255,255,255,0.07)" }}
        >
          <p className="text-xs font-bold text-foreground">📱 Verification par SMS</p>
          <div className="flex gap-2">
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-sm text-text-secondary px-2">+33</span>
              <AuthInput
                className="w-32"
                placeholder="612345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 9))}
              />
            </div>
            <button
              type="button"
              onClick={() => setSmsSent(true)}
              className="shrink-0 px-3 h-10 rounded-lg text-xs font-bold font-[var(--font-rajdhani)] transition-colors"
              style={{
                border: "1px solid rgba(0,229,160,0.5)",
                color: "#00e5a0",
                backgroundColor: "transparent",
              }}
            >
              Envoyer le code
            </button>
          </div>
          {smsSent && (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-text-tertiary">Code recu (6 chiffres, demo)</span>
              <div className="flex gap-2 justify-center">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e.key)}
                    className="w-10 h-11 rounded-lg text-center text-lg font-bold text-foreground outline-none"
                    style={{
                      backgroundColor: "#12121f",
                      border: `1px solid ${digit ? "rgba(0,229,160,0.5)" : "rgba(255,255,255,0.1)"}`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-text-secondary">Niveau de jeu estime</label>
          <div className="flex flex-wrap gap-2">
            {SKILL_LEVELS.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setSkill(level)}
                className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                style={{
                  backgroundColor: skill === level ? "#00e5a0" : "#0d0d1a",
                  color: skill === level ? "#070710" : "#a0a0c0",
                  border: `1px solid ${skill === level ? "#00e5a0" : "rgba(255,255,255,0.1)"}`,
                }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5 relative">
          <label className="text-xs text-text-secondary">Ville</label>
          <button
            type="button"
            onClick={() => setCityOpen(!cityOpen)}
            className="w-full h-10 px-3 rounded-lg text-sm text-left flex items-center justify-between"
            style={{
              backgroundColor: "#0d0d1a",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#e0e0f0",
            }}
          >
            {city}
            <ChevronDown className="h-4 w-4 text-text-tertiary" />
          </button>
          {cityOpen && (
            <div
              className="absolute top-full mt-1 left-0 w-full max-h-40 overflow-y-auto rounded-lg border z-50"
              style={{ backgroundColor: "#12121f", borderColor: "rgba(255,255,255,0.1)" }}
            >
              {FRENCH_CITIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => { setCity(c); setCityOpen(false) }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-primary/10"
                  style={{ color: c === city ? "#00e5a0" : "#a0a0c0" }}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        <AuthPrimaryButton type="submit" disabled={smsSent && !otpComplete} className="mt-2">
          🎮 Creer mon compte
        </AuthPrimaryButton>
      </form>

      <p className="text-center text-xs text-text-secondary mt-6">
        Deja un compte ?{" "}
        <Link href="/auth/login" className="text-primary font-medium hover:underline">
          Connexion
        </Link>
      </p>
    </AuthCard>
  )
}
