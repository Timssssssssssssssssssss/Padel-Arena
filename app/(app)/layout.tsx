"use client"

import { AppSidebar } from "@/components/app-sidebar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 md:ml-[220px] ml-0 min-w-0">
        {children}
      </main>
    </div>
  )
}