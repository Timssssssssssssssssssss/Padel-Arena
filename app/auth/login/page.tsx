"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthCard, AuthInput, AuthPrimaryButton } from "@/components/auth/auth-card"

export default function LoginPage() {
  const router = useRouter()

  return (
    <AuthCard title="Connexion">
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          router.push("/dashboard")
        }}
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-text-secondary">Email</label>
          <AuthInput type="email" placeholder="vous@exemple.com" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-text-secondary">Mot de passe</label>
          <AuthInput type="password" placeholder="••••••••" required />
        </div>

        <AuthPrimaryButton type="submit" className="mt-2">
          Se connecter
        </AuthPrimaryButton>
      </form>

      <p className="text-center text-xs text-text-secondary mt-6">
        Pas encore de compte ?{" "}
        <Link href="/auth/register" className="text-primary font-medium hover:underline">
          Inscription
        </Link>
      </p>
      <p className="text-center text-xs mt-2">
        <Link href="/auth/login" className="text-text-tertiary hover:text-foreground">
          Mot de passe oublie ?
        </Link>
      </p>
    </AuthCard>
  )
}
