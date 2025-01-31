"use client"

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"
import type React from "react" // Import React

export default function SessionProvider({
  children,
  session,
}: {
  children: React.ReactNode
  session: any
}) {
  return <NextAuthSessionProvider session={session}>{children}</NextAuthSessionProvider>
}

