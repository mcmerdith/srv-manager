"use client";

import { LogIn, LogOut, UserRound } from "lucide-react";
import { type Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function AuthPanel({ session }: { session: Session | null }) {
  if (session?.user) {
    return (
      <>
        <p>Welcome {session.user.name}</p>
        <Link href="/account">
          <UserRound />
        </Link>
        <Button icon={<LogOut />} onClick={() => signOut()}>
          Sign out
        </Button>
      </>
    );
  } else {
    return (
      <Button icon={<LogIn />} onClick={() => signIn()}>
        Sign in
      </Button>
    );
  }
}
