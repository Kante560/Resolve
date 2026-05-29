"use client";
// ─── Web3Provider ─────────────────────────────────────────────────────────────
// Wraps the app with Wagmi + RainbowKit providers.
// Uses explicit connectorsForWallets from lib/wagmi.ts which prioritises
// MetaMask and Phantom (with mobile deep links) over generic wallet list.
// ─────────────────────────────────────────────────────────────────────────────

import React, { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { config } from "@/lib/wagmi";

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#0052FF",
            accentColorForeground: "white",
            borderRadius: "medium",
            fontStack: "system",
            overlayBlur: "small",
          })}
          // Disable the default chain switching prompt — app only supports Base
          showRecentTransactions={false}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
