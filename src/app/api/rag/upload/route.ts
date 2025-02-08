import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db/db";
import { documents } from "@/lib/db/schema";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file
    const path = join(process.cwd(), "uploads", file.name);
    await writeFile(path, buffer);

    // Save document info to database
    const [document] = await db
      .insert(documents)
      .values({
        userId: session.user.id,
        name: file.name,
        path: path,
        type: file.type,
        size: file.size,
      })
      .returning();

    return NextResponse.json(document);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
