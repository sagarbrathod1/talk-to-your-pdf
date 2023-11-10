import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { conversations } from "@/lib/db/schema";
import { UserButton, auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { ArrowRight, LogIn } from "lucide-react";
import Link from "next/link";

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
    <div className="w-screen min-h-screen bg-gradient-to-r from-pink-100 to-blue-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold">Talk to your PDF</h1>
            <UserButton afterSignOutUrl="/" />
          </div>
          {/* <div className="flex mt-4">
            {isAuth && <Button>Go to Conversations</Button>}
          </div> */}
          <div className="flex mt-4">
            {isAuth && firstChat && (
              <>
                <Link href={`/conversation/${firstChat.id}`}>
                  <Button>
                    Go to Conversations <ArrowRight className="ml-2" />
                  </Button>
                </Link>
              </>
            )}
          </div>
          <div className="w-full mt-4">
            {isAuth ? (
              <FileUpload />
            ) : (
              <Link href="/sign-in">
                <Button>
                  Login
                  <LogIn className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
