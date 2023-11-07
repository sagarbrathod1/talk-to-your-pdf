import ConversationComponent from "@/components/ConversationComponent";
import ConversationSideBar from "@/components/ConversationSideBar";
import PDFViewer from "@/components/PDFViewer";
import { db } from "@/lib/db";
import { conversations } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";

type Props = { params: { conversationId: string } };

const ConversationPage = async ({ params: { conversationId } }: Props) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const _conversations = await db
    .select()
    .from(conversations)
    .where(eq(conversations.userId, userId));

  //TODO: find out why Error: NEXT_REDIRECT
  //   if (!_conversations) {
  //     return redirect("/");
  //   }
  //   if (
  //     !_conversations.find(
  //       (conversation) => conversation.id === parseInt(conversationId)
  //     )
  //   ) {
  //     return redirect("/");
  //   }

  const currentConversation = _conversations.find(
    (conversation) => conversation.id === parseInt(conversationId)
  );

  return (
    <div className="flex max-h-screen overflow-scroll">
      <div className="flex w-full max-h-screen overflow-scroll">
        <div className="flex-[1] max-w-xs">
          <ConversationSideBar
            conversations={_conversations}
            conversationId={parseInt(conversationId)}
          ></ConversationSideBar>
        </div>
        <div className="max-h-screen p-4 oveflow-scroll flex-[5]">
          <PDFViewer pdf_url={currentConversation?.pdfUrl || ""} />
        </div>
        <div className="flex-[3] border-l-4 border-l-slate-200">
          <ConversationComponent />
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
