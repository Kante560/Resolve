"use client";

import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Link from "next/link";
import { ShieldCheck, Briefcase, PlusCircle, ArrowRight } from "lucide-react";
import { NetworkGuard } from "@/components/ui/NetworkGuard";

export default function DashboardPage() {
  const { isConnected } = useAccount();

  return (
    <NetworkGuard>
      <div style={{ display: "flex", minHeight: "100vh", background: "radial-gradient(circle at 50% -20%, rgba(0, 82, 255, 0.15), #030303 70%)", color: "var(--color-text-primary)" }}>
        {/* Main Content */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <header
            style={{
              height: 72,
              borderBottom: "1px solid rgba(122, 136, 184, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 24px",
              background: "rgba(4, 8, 18, 0.5)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Link href="/" style={{ textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px" }}>
                  <span style={{ fontSize: 22 }}>⚓</span>
                  <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "0.18em", color: "white" }}>
                    ANCHOR
                  </span>
                </div>
              </Link>
            </div>
            
            <div>
              <ConnectButton />
            </div>
          </header>

          {/* Content Area */}
          <div style={{ padding: "48px 24px", flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            {!isConnected ? (
              <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", flex: 1 }}>
                <ShieldCheck size={48} style={{ color: "rgba(122, 136, 184, 0.5)", marginBottom: 24 }} />
                <h3 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12 }}>Connect your wallet</h3>
                <p style={{ color: "var(--color-text-secondary)", maxWidth: 400, lineHeight: 1.6, marginBottom: 32 }}>
                  Please connect your Web3 wallet to manage your escrows, create new jobs, or approve payments.
                </p>
                <ConnectButton />
              </div>
            ) : (
              <div style={{ maxWidth: 800, margin: "0 auto", width: "100%" }}>
                <div style={{ textAlign: "center", marginBottom: 48 }}>
                  <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16 }}>Welcome to Anchor</h2>
                  <p style={{ color: "var(--color-text-secondary)", fontSize: 18 }}>Select a portal to continue</p>
                </div>

                <div className="portal-grid">
                  {/* Client Portal Link */}
                  <Link href="/client" style={{ textDecoration: "none" }}>
                    <div style={{
                      background: "rgba(8, 15, 30, 0.4)",
                      border: "1px solid rgba(122, 136, 184, 0.15)",
                      borderRadius: 16,
                      padding: 32,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      transition: "all 0.2s",
                      cursor: "pointer",
                      height: "100%"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(0, 82, 255, 0.05)";
                      e.currentTarget.style.transform = "translateY(-4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(8, 15, 30, 0.4)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                    >
                      <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(0, 82, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-blue)", marginBottom: 24 }}>
                        <PlusCircle size={32} />
                      </div>
                      <h3 style={{ fontSize: 24, fontWeight: 600, color: "white", marginBottom: 12 }}>Client Portal</h3>
                      <p style={{ color: "var(--color-text-secondary)", marginBottom: 24, flex: 1 }}>Create new jobs, securely lock ETH, and approve completed work.</p>
                      <div style={{ color: "var(--color-blue)", display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
                        Enter Portal <ArrowRight size={16} />
                      </div>
                    </div>
                  </Link>

                  {/* Freelancer Portal Link */}
                  <Link href="/freelancer" style={{ textDecoration: "none" }}>
                    <div style={{
                      background: "rgba(8, 15, 30, 0.4)",
                      border: "1px solid rgba(122, 136, 184, 0.15)",
                      borderRadius: 16,
                      padding: 32,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      transition: "all 0.2s",
                      cursor: "pointer",
                      height: "100%"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(0, 200, 150, 0.05)";
                      e.currentTarget.style.transform = "translateY(-4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(8, 15, 30, 0.4)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                    >
                      <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(0, 200, 150, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-green)", marginBottom: 24 }}>
                        <Briefcase size={32} />
                      </div>
                      <h3 style={{ fontSize: 24, fontWeight: 600, color: "white", marginBottom: 12 }}>Freelancer Portal</h3>
                      <p style={{ color: "var(--color-text-secondary)", marginBottom: 24, flex: 1 }}>View jobs assigned to you and keep track of incoming escrow payments.</p>
                      <div style={{ color: "var(--color-green)", display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
                        Enter Portal <ArrowRight size={16} />
                      </div>
                    </div>
                  </Link>

                  {/* Web3 Jobs Portal Link */}
                  <Link href="/jobs" style={{ textDecoration: "none" }}>
                    <div style={{
                      background: "rgba(8, 15, 30, 0.4)",
                      border: "1px solid rgba(122, 136, 184, 0.15)",
                      borderRadius: 16,
                      padding: 32,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      transition: "all 0.2s",
                      cursor: "pointer",
                      height: "100%"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255, 107, 53, 0.05)";
                      e.currentTarget.style.transform = "translateY(-4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(8, 15, 30, 0.4)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                    >
                      <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(255, 107, 53, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-orange)", marginBottom: 24 }}>
                        <Briefcase size={32} />
                      </div>
                      <h3 style={{ fontSize: 24, fontWeight: 600, color: "white", marginBottom: 12 }}>Web3 Job Board</h3>
                      <p style={{ color: "var(--color-text-secondary)", marginBottom: 24, flex: 1 }}>Discover high-quality Web3 freelance gigs and connect with top clients.</p>
                      <div style={{ color: "var(--color-orange)", display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
                        Explore Gigs <ArrowRight size={16} />
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </NetworkGuard>
  );
}
