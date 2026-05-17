import type { Metadata } from 'next'
import { Inter, Orbitron, Rajdhani } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const _orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron', weight: ['400', '500', '600', '700', '800', '900'] })
const _rajdhani = Rajdhani({ subsets: ['latin'], variable: '--font-rajdhani', weight: ['300', '400', '500', '600', '700'] })

export const metadata: Metadata = {
  title: 'Padel Arena - Competitive Padel Platform',
  description: 'The Faceit of Padel. Compete, rank up, and dominate the court.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${_inter.variable} ${_orbitron.variable} ${_rajdhani.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
