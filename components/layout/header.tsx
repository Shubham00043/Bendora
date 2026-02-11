"use client";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import { BookOpenIcon, GraduationCapIcon, MessageCircleIcon, Triangle, TrophyIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";

export default function Header({ isPro }: { isPro: boolean }) {
  const { isSignedIn } = useUser();

  return (
    <header>
      <div className="layout-container">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded-md">
              <GraduationCapIcon className="size-5 text-primary" />
            </div>
            Bendora
          </Link>

          {isSignedIn && (
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/dashboard">
                <Button variant={"ghost"} size={"sm"}>
                  Dashboard
                </Button>
              </Link>
              <Link href="/courses">
                <Button variant={"ghost"} size={"sm"}>
                  <BookOpenIcon className="size-4 text-primary mr-2" />
                  Courses
                </Button>
              </Link>
              <Link href="/communities">
                <Button variant={"ghost"} size={"sm"}>
                  <UsersIcon className="size-4 text-primary mr-2" />
                  Communities
                </Button>
              </Link>
              <Link href="/chat">
                <Button variant={"ghost"} size={"sm"}>
                  <MessageCircleIcon className="size-4 text-primary mr-2" />
                  Chat
                </Button>
              </Link>
            </nav>
          )}
        </div>
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              {isPro ? (
                <Badge className="flex items-center gap-2" variant="outline">
                  <TrophyIcon className="size-3 text-primary" /> Pro
                </Badge>
              ) : (
                <Link href="/pricing">
                  <Badge className="flex items-center gap-2 cursor-pointer hover:bg-muted" variant="outline">
                    Free
                  </Badge>
                </Link>
              )}
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "size-9",
                  },
                }}
              />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/sign-in">
                <Button variant="ghost" size={"sm"}>
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
