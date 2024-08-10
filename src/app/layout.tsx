import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { cookies } from "next/headers";
import Link from "next/link";
import DarkModeUpdater from "~/components/darkmode";
import { cn } from "~/lib/utils";
import { getServerAuthSession } from "~/server/auth";
import { TRPCReactProvider } from "~/trpc/react";
import { HydrateClient } from "~/trpc/server";
import AuthPanel from "./_components/auth_panel";

export const metadata: Metadata = {
  title: "SRV Manager",
  description: "Quickly manage server SRV records through Cloudflare",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const darkMode = cookies().get("dark-mode")?.value === "true";
  const session = await getServerAuthSession();

  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body
        className={cn(
          "min-w-screen min-h-screen bg-background text-foreground",
          darkMode && "dark",
        )}
      >
        <DarkModeUpdater />
        <TRPCReactProvider>
          <HydrateClient>
            <nav className="flex flex-row items-center justify-start gap-8 bg-accent p-4 text-accent-foreground">
              <Link href="/">
                <h1 className="text-3xl font-bold">SRV Manager</h1>
              </Link>
              {session?.user.permissions.admin && (
                <Link href="/admin">
                  <p>Admin</p>
                </Link>
              )}
              <Link href="/tokens">
                <p>API Tokens</p>
              </Link>
              <div className="ml-auto flex flex-row items-center gap-4">
                <AuthPanel session={session} />
              </div>
            </nav>
            <main className="container flex min-h-screen flex-col items-center pt-4">
              {children}
            </main>
          </HydrateClient>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
