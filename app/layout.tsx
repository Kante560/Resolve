import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import LenisProvider from "@/components/ui/LenisProvider";
import GlowCursor from "@/components/ui/GlowCursor";
import BackgroundScene from "@/components/canvas/BackgroundScene";
import { Web3Provider } from "@/components/providers/Web3Provider";

import { EventFeed } from "@/components/ui/EventFeed";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
});

export const metadata: Metadata = {
  title: "Anchor | Trustless Escrow for On-Chain Work",
  description: "Lock ETH in a smart contract. Release on approval. No middlemen. No invoices. No chasing payments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bricolage.variable}`} suppressHydrationWarning>
      {/*
       * suppressHydrationWarning on <body> silences attribute mismatches injected
       * by browser extensions (e.g. Honey/Capital One Shopping adds bis_skin_checked
       * to every div client-side before React hydrates, causing false positives).
       * This is safe — it only suppresses one level of attribute diffs, not real errors.
       */}
      <body suppressHydrationWarning>
        <Web3Provider>
          <LenisProvider>
            <BackgroundScene />
            <GlowCursor />
            <EventFeed />
            {children}
          </LenisProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
