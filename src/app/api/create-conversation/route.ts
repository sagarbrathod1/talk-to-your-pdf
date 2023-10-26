import { db } from "@/lib/db";
import { conversations } from "@/lib/db/schema";
import { loadS3IntoPinecone } from "@/lib/pinecone";
import { getS3Url } from "@/lib/s3";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// /api/create-conversation
export async function POST(req: Request, res: Response) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized user." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { fileKey, fileName } = body;
    console.log("fileKey", fileKey, "fileName", fileName);
    await loadS3IntoPinecone(fileKey);
    const conversationIds = await db
      .insert(conversations)
      .values({
        fileKey: fileKey,
        pdfName: fileName,
        pdfUrl: getS3Url(fileKey),
        userId,
      })
      .returning({ insertedId: conversations.id });

    return NextResponse.json(
      {
        conversationId: conversationIds[0].insertedId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
