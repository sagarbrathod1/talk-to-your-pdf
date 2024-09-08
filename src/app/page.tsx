import React from "react";
import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { conversations } from "@/lib/db/schema";
import { UserButton, auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import {
  ArrowRight,
  LogIn,
  FileText,
  MessageSquare,
  Zap,
  Github,
} from "lucide-react";
import Link from "next/link";
import FeatureCard from "@/components/FeatureCard";

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;

  let firstChat;
  if (userId) {
    firstChat = await db
      .select()
      .from(conversations)
      .where(eq(conversations.userId, userId));
    if (firstChat) {
      firstChat = firstChat[0];
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
      <nav className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Talk2PDF</h1>
        <div className={`flex items-center ${isAuth ? "space-x-4" : ""}`}>
          <a
            href="https://github.com/sagarbrathod1/talk-to-your-pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-900"
          >
            <Github className="w-8 h-8" />
          </a>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <main className="flex-grow flex flex-col justify-between px-4 py-8 lg:py-16 overflow-auto">
        <div className="flex-grow flex flex-col items-center justify-center">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-4">
              Converse with your Documents
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 mb-8">
              Upload a PDF and start a conversation with AI
            </p>

            {isAuth ? (
              <>
                <div className="w-full flex justify-center">
                  <FileUpload />
                </div>
                {firstChat && (
                  <div className="text-center mt-8">
                    <Link href={`/conversation/${firstChat.id}`}>
                      <Button
                        size="lg"
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                      >
                        Go to Conversations
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <Link href="/sign-in">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 mt-8 rounded-full text-lg font-semibold shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  Get Started
                  <LogIn className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-8 lg:mt-16">
          <FeatureCard
            icon={<FileText className="w-12 h-12 text-blue-500" />}
            title="PDF Upload"
            description="Easily upload your PDF documents"
          />
          <FeatureCard
            icon={<MessageSquare className="w-12 h-12 text-purple-500" />}
            title="AI Conversation"
            description="Engage in intelligent conversations about your document"
          />
          <FeatureCard
            icon={<Zap className="w-12 h-12 text-yellow-500" />}
            title="Instant Insights"
            description="Get quick answers and analysis from your PDFs"
          />
        </div>
      </main>
    </div>
  );
}
