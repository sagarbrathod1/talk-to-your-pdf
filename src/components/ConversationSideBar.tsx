"use client";

import { DrizzleConversation } from "@/lib/db/schema";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { MessageCircle, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  conversations: DrizzleConversation[];
  conversationId: number;
};

const ConversationSideBar = ({ conversations, conversationId }: Props) => {
  return (
    <div className="w-full h-screen p-4 text-gray-200 bg-gray-900">
      <Link href="/">
        <Button className="w-full border-dashed border-white border">
          <PlusCircle className="mr-2 w-4 h-4" />
          New Conversation
        </Button>
      </Link>
      <div className="flex flex-col gap-2 mt-4">
        {conversations.map((conversation) => (
          <Link key={conversation.id} href={`/conversation/${conversation.id}`}>
            <div
              className={cn("rounded-lg p-3 text-slate-300 flex items-center", {
                "bg-blue-600 text-white": conversation.id === conversationId,
                "hover:text-white": conversation.id !== conversationId,
              })}
            >
              <MessageCircle className="mr-2" />
              <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                {conversation.pdfName}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <div className="absolute bottom-4 left-4">
        <div className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
          <Link href="/">Home</Link>
          <Link href="/">Source</Link>
        </div>
      </div>
    </div>
  );
};

export default ConversationSideBar;
