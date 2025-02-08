import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { chatHistories } from "@/lib/db/schema";
import { db } from "@/lib/db/db";
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  try {
    const [chatHistory] = await db
      .select()
      .from(chatHistories)
      .where(
        and(eq(chatHistories.id, id), eq(chatHistories.userId, session.user.id))
      );

    if (!chatHistory) {
      return NextResponse.json(
        { error: "Chat history not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(chatHistory);
  } catch (error) {
    console.error("Failed to fetch chat history:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat history" },
      { status: 500 }
    );
  }
}
