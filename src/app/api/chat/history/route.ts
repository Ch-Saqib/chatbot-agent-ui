import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import getServerSession from "next-auth/next"
import { Session } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { chatHistories } from "@/lib/db/schema"
import { db } from "@/lib/db/db"

interface ExtendedSession extends Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export async function GET(req: Request) {
  const session: ExtendedSession | null = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const chatHistory = await db.select().from(chatHistories).where(eq(chatHistories.userId, session.user.id))
    return NextResponse.json(chatHistory)
  } catch (error) {
    console.error("Failed to fetch chat history:", error)
    return NextResponse.json({ error: "Failed to fetch chat history" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { title, messages } = await req.json()
    const [chatHistory] = await db
      .insert(chatHistories)
      .values({
        userId: session.user.id,
        title,
        messages: JSON.stringify(messages),
      })
      .returning()
    return NextResponse.json(chatHistory)
  } catch (error) {
    console.error("Failed to save chat history:", error)
    return NextResponse.json({ error: "Failed to save chat history" }, { status: 500 })
  }
}

