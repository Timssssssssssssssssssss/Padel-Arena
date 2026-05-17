import Link from "next/link"

export function AuthLogo() {
  return (
    <Link href="/auth/login" className="flex items-baseline justify-center gap-0.5 mb-8">
      <span className="text-2xl font-bold font-[var(--font-orbitron)] text-foreground tracking-tight">
        PADEL
      </span>
      <span className="text-[10px] font-bold font-[var(--font-orbitron)] text-primary uppercase tracking-[0.2em]">
        ARENA
      </span>
    </Link>
  )
}

export function AuthCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div
      className="w-full max-w-md rounded-2xl p-8 border"
      style={{
        backgroundColor: "#12121f",
        borderColor: "rgba(255,255,255,0.07)",
      }}
    >
      <AuthLogo />
      <h1 className="text-lg font-bold font-[var(--font-rajdhani)] text-foreground uppercase tracking-wider text-center mb-6">
        {title}
      </h1>
      {children}
    </div>
  )
}

export const authInputClass =
  "w-full h-10 px-3 rounded-lg text-sm text-foreground placeholder:text-text-tertiary outline-none transition-colors"
export const authInputStyle = {
  backgroundColor: "#0d0d1a",
  borderWidth: 1,
  borderStyle: "solid" as const,
  borderColor: "rgba(255,255,255,0.1)",
}

export function AuthInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`${authInputClass} ${props.className ?? ""}`}
      style={{ ...authInputStyle, ...props.style }}
      onFocus={(e) => {
        e.target.style.borderColor = "rgba(0,229,160,0.5)"
        props.onFocus?.(e)
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "rgba(255,255,255,0.1)"
        props.onBlur?.(e)
      }}
    />
  )
}

export function AuthPrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`w-full h-11 rounded-lg text-sm font-bold font-[var(--font-rajdhani)] transition-colors hover:opacity-90 disabled:opacity-40 ${props.className ?? ""}`}
      style={{
        backgroundColor: "#00e5a0",
        color: "#070710",
        ...props.style,
      }}
    />
  )
}
