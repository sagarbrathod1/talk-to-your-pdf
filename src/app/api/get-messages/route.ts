import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export const POST = async (req: Request) => {
  try {
    const { conversationId } = await req.json();
    const _messages = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId));
    return NextResponse.json(_messages);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: NextResponse.error }, { status: 500 });
  }
};
