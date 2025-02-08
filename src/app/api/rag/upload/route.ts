import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Create unique filename
    const id = uuidv4()
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save file
    const path = join(process.cwd(), "uploads", file.name)
    await writeFile(path, buffer)

    // Here you would typically:
    // 1. Process the document (extract text, create embeddings)
    // 2. Store the embeddings in your vector database
    // 3. Store metadata in your regular database

    return NextResponse.json({ id, success: true })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

