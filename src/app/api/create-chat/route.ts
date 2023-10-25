import { loadS3IntoPinecone } from "@/lib/pinecone";
import { NextResponse } from "next/server";

// /api/create-chat
export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { fileKey, fileName } = body;
    console.log("fileKey", fileKey, "fileName", fileName);
    const pages = await loadS3IntoPinecone(fileKey);
    return NextResponse.json(
      { pages }
      // { message: "Chat created successfully" },
      // { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
