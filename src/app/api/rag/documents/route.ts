import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"
import { db } from "@/lib/db/db"
import { documents } from "@/lib/db/schema"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const docs = await db.select().from(documents).where(eq(documents.userId, session.user.id))
    return NextResponse.json(docs)
  } catch (error) {
    console.error("Failed to fetch documents:", error)
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
  }
}

