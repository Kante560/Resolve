import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/ui/LenisProvider";
import GlowCursor from "@/components/ui/GlowCursor";
import BackgroundScene from "@/components/canvas/BackgroundScene";

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
    <html lang="en" className={`${bricolage.variable}`}>
      <body>
        <LenisProvider>
          <BackgroundScene />
          <GlowCursor />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
