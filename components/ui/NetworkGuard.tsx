"use client";

import React from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { ShieldAlert } from "lucide-react";

export function NetworkGuard({ children }: { children: React.ReactNode }) {
  const { isConnected, chain } = useAccount();
  const { switchChain, isPending } = useSwitchChain();

  const isSupportedChain = chain?.id === base.id || chain?.id === baseSepolia.id;

  if (isConnected && !isSupportedChain) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100%",
        padding: 32,
        textAlign: "center"
      }}>
        <ShieldAlert size={48} style={{ color: "var(--color-orange)", marginBottom: 24 }} />
        <h3 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12 }}>Wrong Network Detected</h3>
        <p style={{ color: "var(--color-text-secondary)", maxWidth: 400, lineHeight: 1.6, marginBottom: 32 }}>
          Anchor Protocol runs strictly on Base and Base Sepolia. Please switch your network to interact with the smart contract.
        </p>
        <button 
          onClick={() => switchChain({ chainId: base.id })}
          disabled={isPending}
          className="btn-primary"
          style={{ padding: "12px 24px" }}
        >
          {isPending ? "Switching..." : "Switch to Base"}
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
