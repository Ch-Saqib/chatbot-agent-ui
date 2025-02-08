import { NextResponse } from "next/server"
import { eq, and } from "drizzle-orm"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"
import { unlink } from "fs/promises"
import { db } from "@/lib/db/db"
import { documents } from "@/lib/db/schema"

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = params

  try {
    const [document] = await db
      .select()
      .from(documents)
      .where(and(eq(documents.id, id), eq(documents.userId, session.user.id)))

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Delete file from storage
    await unlink(document.path)

    // Delete document from database
    await db.delete(documents).where(eq(documents.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}

