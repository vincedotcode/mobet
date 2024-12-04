'use client';

import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";
import { UserProvider } from "@/context/user-context";
import { Analytics } from "@vercel/analytics/react"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <UserProvider>
          {children}
          <Analytics />
          <Toaster />
      </UserProvider>
    </SessionProvider>
  );
}
