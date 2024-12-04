import { cn } from "@/lib/utils";
import { Metadata } from 'next';

import { Inter } from "next/font/google";
import RootLayout from '@/app/root-layout';

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Mobet - Smarter Betting with AI Insights',
  description: 'Mobet consolidates free betting tips from various sources, providing AI-curated daily insights and a bet tracker to help you gamble responsibly.',
  keywords: 'Mobet, Betting Tips, AI Betting Insights, Responsible Gambling, Bet Tracker, Betting Tools',
  openGraph: {
    title: 'Mobet - Smarter Betting Starts Here',
    description: 'Subscribe to Mobet for daily betting tips and AI-curated top insights. Gain financial insights and track your bets responsibly.',
    url: 'https://mobet.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mobet - Smarter Betting with AI Insights',
    description: 'Discover Mobet: the platform that provides curated betting tips and tools for responsible gambling. Start your journey today!',
  },
  icons: {
    icon: '/favicon.ico',
  },
};



export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background text-foreground antialiased max-w-full overflow-x-hidden",
          font.className
        )}
      >
          <RootLayout>
          {children}

          </RootLayout>
      </body>
    </html>
  );
}
