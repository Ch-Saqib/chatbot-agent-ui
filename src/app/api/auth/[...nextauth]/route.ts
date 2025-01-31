import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthOptions } from "next-auth"

// This is a simple in-memory user storage. In a real app, use a database instead.
const users: any[] = []

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null
        const user = users.find((u) => u.email === credentials.email && u.password === credentials.password)
        if (user) {
          return { id: user.id, name: user.name, email: user.email }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!users.find((u) => u.email === user.email)) {
          users.push({
            id: user.id,
            name: user.name,
            email: user.email,
            provider: "google",
          })
        }
      }
      return true
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

