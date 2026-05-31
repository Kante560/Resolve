"use client";
// ─── Anchor Protocol — Documentation Page ────────────────────────────────────
// Full reference for the Anchor escrow protocol:
// contract functions, React hooks API, job lifecycle, events, and integration.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

// ── Types ─────────────────────────────────────────────────────────────────────
type Section =
  | "overview"
  | "quickstart"
  | "contract"
  | "hooks"
  | "lifecycle"
  | "events"
  | "sdk"
  | "network"
  | "faq";

interface NavItem {
  id: Section;
  label: string;
  icon: string;
}

// ── Sidebar navigation items ──────────────────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
  { id: "overview",   label: "Overview",         icon: "⚓" },
  { id: "quickstart", label: "Quick Start",       icon: "⚡" },
  { id: "contract",   label: "Contract ABI",      icon: "📜" },
  { id: "hooks",      label: "React Hooks",       icon: "🪝" },
  { id: "lifecycle",  label: "Job Lifecycle",     icon: "🔄" },
  { id: "events",     label: "Events",            icon: "📡" },
  { id: "sdk",        label: "SDK Integration",   icon: "🔧" },
  { id: "network",    label: "Network & Deploy",  icon: "🌐" },
  { id: "faq",        label: "FAQ",               icon: "❓" },
];

// ── Shared sub-components ─────────────────────────────────────────────────────

/** Monospaced code block with copy button */
function CodeBlock({ code, lang = "typescript" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: "relative",
        background: "#080f1e",
        border: "1px solid rgba(0,82,255,0.2)",
        borderRadius: 10,
        marginBottom: 24,
        overflow: "hidden",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 16px",
          borderBottom: "1px solid rgba(0,82,255,0.12)",
          background: "rgba(0,82,255,0.06)",
        }}
      >
        <span
          style={{
            fontSize: 10,
            letterSpacing: "0.14em",
            color: "var(--color-text-muted)",
            fontFamily: "var(--font-mono)",
          }}
        >
          {lang.toUpperCase()}
        </span>
        <button
          onClick={copy}
          style={{
            background: "none",
            border: "none",
            color: copied ? "var(--color-green)" : "var(--color-text-muted)",
            fontSize: 11,
            cursor: "pointer",
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.08em",
            transition: "color 0.2s",
          }}
        >
          {copied ? "✓ COPIED" : "COPY"}
        </button>
      </div>
      {/* Code */}
      <pre
        style={{
          padding: "20px 20px",
          fontSize: 13,
          lineHeight: 1.7,
          color: "#A8D8C8",
          fontFamily: "var(--font-mono)",
          overflowX: "auto",
          whiteSpace: "pre",
          margin: 0,
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

/** Section heading with blue left-bar accent */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: "clamp(22px, 3vw, 30px)",
        fontWeight: 700,
        color: "var(--color-text-primary)",
        marginBottom: 8,
        letterSpacing: "-0.02em",
      }}
    >
      {children}
    </h2>
  );
}

/** Sub-heading */
function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontSize: 16,
        fontWeight: 600,
        color: "var(--color-text-primary)",
        marginTop: 36,
        marginBottom: 12,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      {children}
    </h3>
  );
}

/** Descriptive paragraph */
function Para({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        color: "var(--color-text-secondary)",
        lineHeight: 1.75,
        marginBottom: 16,
        fontSize: 15,
      }}
    >
      {children}
    </p>
  );
}

/** Info / warning callout box */
function Callout({
  type = "info",
  children,
}: {
  type?: "info" | "warning" | "success" | "tip";
  children: React.ReactNode;
}) {
  const palette = {
    info:    { bg: "rgba(0,82,255,0.07)",    border: "rgba(0,82,255,0.3)",    icon: "ℹ",  color: "var(--color-blue-l)" },
    warning: { bg: "rgba(255,107,53,0.07)",  border: "rgba(255,107,53,0.3)", icon: "⚠",  color: "var(--color-orange)" },
    success: { bg: "rgba(0,200,150,0.07)",   border: "rgba(0,200,150,0.3)", icon: "✓",  color: "var(--color-green)"  },
    tip:     { bg: "rgba(110,158,255,0.07)", border: "rgba(110,158,255,0.3)", icon: "💡", color: "#6E9EFF"            },
  };
  const p = palette[type];
  return (
    <div
      style={{
        background: p.bg,
        border: `1px solid ${p.border}`,
        borderRadius: 10,
        padding: "14px 18px",
        marginBottom: 20,
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
      }}
    >
      <span style={{ color: p.color, fontSize: 14, flexShrink: 0, marginTop: 1 }}>{p.icon}</span>
      <span style={{ color: "var(--color-text-secondary)", fontSize: 14, lineHeight: 1.65 }}>
        {children}
      </span>
    </div>
  );
}

/** API param / return table row */
function PropRow({
  name,
  type,
  desc,
  optional,
}: {
  name: string;
  type: string;
  desc: string;
  optional?: boolean;
}) {
  return (
    <tr>
      <td
        style={{
          padding: "10px 14px",
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "var(--color-blue-l)",
          whiteSpace: "nowrap",
          borderBottom: "1px solid rgba(122,136,184,0.08)",
        }}
      >
        {name}
        {optional && (
          <span style={{ color: "var(--color-text-muted)", marginLeft: 4, fontSize: 10 }}>?</span>
        )}
      </td>
      <td
        style={{
          padding: "10px 14px",
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "var(--color-green)",
          whiteSpace: "nowrap",
          borderBottom: "1px solid rgba(122,136,184,0.08)",
        }}
      >
        {type}
      </td>
      <td
        style={{
          padding: "10px 14px",
          fontSize: 13,
          color: "var(--color-text-secondary)",
          lineHeight: 1.5,
          borderBottom: "1px solid rgba(122,136,184,0.08)",
        }}
      >
        {desc}
      </td>
    </tr>
  );
}

/** API table wrapper */
function PropTable({
  headers = ["Parameter", "Type", "Description"],
  children,
}: {
  headers?: string[];
  children: React.ReactNode;
}) {
  return (
    <div style={{ overflowX: "auto", marginBottom: 28 }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                style={{
                  padding: "8px 14px",
                  textAlign: "left",
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  color: "var(--color-text-muted)",
                  borderBottom: "1px solid rgba(122,136,184,0.15)",
                }}
              >
                {h.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

// ── Section content components ─────────────────────────────────────────────────

function OverviewSection() {
  return (
    <div>
      <div className="section-label" style={{ marginBottom: 16 }}>
        <span>ANCHOR PROTOCOL</span>
      </div>
      <SectionHeading>Overview</SectionHeading>
      <Para>
        Anchor is a trustless escrow protocol built on{" "}
        <span style={{ color: "var(--color-blue-l)" }}>Base (Coinbase L2)</span>. It enables clients
        and freelancers to settle payment atomically through a smart contract — no middleman,
        no invoices, no 3-day payment holds.
      </Para>
      <Para>
        A client locks ETH into the contract when creating a job. The funds sit on-chain, visible
        to both parties. When the client calls <code style={{ color: "var(--color-blue-l)", fontSize: 13, fontFamily: "var(--font-mono)" }}>approveWork</code>, the ETH transfers
        directly to the freelancer. If something goes wrong, the client can raise a dispute (funds
        freeze) or claim a refund after the deadline expires.
      </Para>

      <Callout type="success">
        <strong>No admin keys.</strong> The contract has no owner, no pause function, no upgrade proxy. The
        code you read on Basescan is exactly what runs. Forever.
      </Callout>

      {/* Architecture overview cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginTop: 28,
        }}
      >
        {[
          { icon: "📜", title: "One Contract",    body: "Anchor.sol — 4 write functions, 1 read. Simple by design." },
          { icon: "⛓",  title: "Base Network",    body: "~2s finality, $0.001 avg gas fee, EVM-compatible." },
          { icon: "🔐", title: "Non-custodial",   body: "Funds move wallet → contract → freelancer. Never through a server." },
          { icon: "📡", title: "Event-driven",    body: "4 on-chain events for real-time UI updates without polling." },
        ].map((card) => (
          <div
            key={card.title}
            style={{
              background: "rgba(8,15,30,0.5)",
              border: "1px solid rgba(122,136,184,0.15)",
              borderRadius: 12,
              padding: "20px 18px",
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 10 }}>{card.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, color: "var(--color-text-primary)" }}>
              {card.title}
            </div>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
              {card.body}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickStartSection() {
  return (
    <div>
      <div className="section-label" style={{ marginBottom: 16 }}>
        <span>GET STARTED</span>
      </div>
      <SectionHeading>Quick Start</SectionHeading>
      <Para>
        Integrate Anchor into your dApp in under 5 minutes using the provided React hooks.
      </Para>

      <SubHeading>1. Install dependencies</SubHeading>
      <CodeBlock lang="bash" code={`pnpm add wagmi viem @tanstack/react-query @rainbow-me/rainbowkit`} />

      <SubHeading>2. Configure providers</SubHeading>
      <Para>
        Wrap your app with Wagmi + RainbowKit. Set <code style={{ color: "var(--color-blue-l)", fontSize: 12, fontFamily: "var(--font-mono)" }}>ssr: true</code> if using Next.js App Router.
      </Para>
      <CodeBlock lang="typescript" code={`// lib/wagmi.ts
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia } from 'wagmi/chains';
import { http } from 'wagmi';

export const config = getDefaultConfig({
  appName: 'My App',
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!,
  chains: [baseSepolia, base],
  transports: {
    [baseSepolia.id]: http(),
    [base.id]: http(),
  },
  ssr: true, // required for Next.js App Router
});`} />

      <SubHeading>3. Set environment variables</SubHeading>
      <CodeBlock lang="bash" code={`# .env.local
NEXT_PUBLIC_CONTRACT_ADDRESS=0xC3E79D0C55e58da43f137264FBe812E2f5cc249F
NEXT_PUBLIC_WC_PROJECT_ID=your_walletconnect_project_id`} />

      <SubHeading>4. Copy the hooks</SubHeading>
      <Para>
        Copy <code style={{ color: "var(--color-blue-l)", fontSize: 12, fontFamily: "var(--font-mono)" }}>hooks/useAnchor.ts</code> and <code style={{ color: "var(--color-blue-l)", fontSize: 12, fontFamily: "var(--font-mono)" }}>lib/contract.ts</code> from this repo into your project.
        The hooks wrap Wagmi&apos;s <code style={{ color: "var(--color-blue-l)", fontSize: 12, fontFamily: "var(--font-mono)" }}>useReadContract</code>, <code style={{ color: "var(--color-blue-l)", fontSize: 12, fontFamily: "var(--font-mono)" }}>useWriteContract</code>, and <code style={{ color: "var(--color-blue-l)", fontSize: 12, fontFamily: "var(--font-mono)" }}>useWatchContractEvent</code>.
      </Para>

      <SubHeading>5. Create your first escrow</SubHeading>
      <CodeBlock lang="typescript" code={`'use client';
import { useCreateJob } from '@/hooks/useAnchor';

export function CreateEscrow() {
  const { createJob, isPending } = useCreateJob();

  const handleSubmit = async () => {
    const deadlineUnix =
      Math.floor(Date.now() / 1000) + 7 * 86400; // 7 days

    await createJob(
      '0xFreelancerAddress',  // freelancer wallet
      deadlineUnix,            // unix timestamp
      '0.5'                    // ETH amount to lock
    );
  };

  return (
    <button onClick={handleSubmit} disabled={isPending}>
      {isPending ? 'Locking ETH...' : 'Create Escrow'}
    </button>
  );
}`} />

      <Callout type="tip">
        Always use Base Sepolia (testnet) during development. Get free test ETH at{" "}
        <span style={{ color: "var(--color-blue-l)" }}>sepoliafaucet.com</span> or{" "}
        <span style={{ color: "var(--color-blue-l)" }}>coinbase.com/faucets/base-ethereum-goerli-faucet</span>.
      </Callout>
    </div>
  );
}

function ContractSection() {
  return (
    <div>
      <div className="section-label" style={{ marginBottom: 16 }}>
        <span>SMART CONTRACT</span>
      </div>
      <SectionHeading>Contract ABI</SectionHeading>

      {/* Contract info bar */}
      <div
        style={{
          background: "#080f1e",
          border: "1px solid rgba(0,82,255,0.22)",
          borderRadius: 10,
          padding: "16px 20px",
          marginBottom: 28,
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-text-muted)", marginBottom: 4 }}>
            DEPLOYED CONTRACT
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--color-blue-l)" }}>
            Anchor.sol
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--color-text-muted)", marginBottom: 4 }}>
            ADDRESS (BASE SEPOLIA)
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--color-text-primary)" }}>
            0xC3E79D0C55e58da43f137264FBe812E2f5cc249F
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 11,
            color: "var(--color-green)",
            letterSpacing: "0.07em",
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-green)", display: "inline-block" }} />
          VERIFIED · OPEN SOURCE
        </div>
      </div>

      <SubHeading>Write Functions</SubHeading>

      {/* createJob */}
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            background: "rgba(0,82,255,0.06)",
            border: "1px solid rgba(0,82,255,0.2)",
            borderRadius: "10px 10px 0 0",
            padding: "12px 18px",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            color: "#A8D8C8",
          }}
        >
          <span style={{ color: "var(--color-blue-l)" }}>function </span>
          createJob(address freelancer, uint256 deadline){" "}
          <span style={{ color: "var(--color-orange)" }}>payable</span>
        </div>
        <div
          style={{
            border: "1px solid rgba(0,82,255,0.2)",
            borderTop: "none",
            borderRadius: "0 0 10px 10px",
            padding: 16,
          }}
        >
          <Para>
            Creates a new escrow job. The caller becomes the <strong style={{ color: "var(--color-text-primary)" }}>client</strong>. ETH
            sent with the transaction is locked in the contract until approval, dispute resolution, or
            refund.
          </Para>
          <PropTable>
            <PropRow name="freelancer" type="address"  desc="The freelancer's wallet address who will receive funds on approval." />
            <PropRow name="deadline"   type="uint256"  desc="Unix timestamp (seconds). After this point the client may call claimRefund." />
            <PropRow name="msg.value"  type="ETH"      desc="Amount of ETH to lock. Must be > 0. Sent as transaction value." />
          </PropTable>
          <Para>Emits: <code style={{ color: "var(--color-green)", fontFamily: "var(--font-mono)", fontSize: 12 }}>JobCreated(uint256 jobId, address client, address freelancer, uint256 amount)</code></Para>
        </div>
      </div>

      {/* approveWork */}
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            background: "rgba(0,200,150,0.06)",
            border: "1px solid rgba(0,200,150,0.2)",
            borderRadius: "10px 10px 0 0",
            padding: "12px 18px",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            color: "#A8D8C8",
          }}
        >
          <span style={{ color: "var(--color-blue-l)" }}>function </span>
          approveWork(uint256 jobId)
        </div>
        <div
          style={{
            border: "1px solid rgba(0,200,150,0.2)",
            borderTop: "none",
            borderRadius: "0 0 10px 10px",
            padding: 16,
          }}
        >
          <Para>
            Client approves the completed work. ETH is released directly to the freelancer. Job status
            moves to <span style={{ color: "var(--color-green)", fontFamily: "var(--font-mono)", fontSize: 12 }}>APPROVED</span>.
          </Para>
          <Callout type="warning">
            Only the original job client can call this. Reverts if status is not ACTIVE.
          </Callout>
          <PropTable>
            <PropRow name="jobId" type="uint256" desc="The numeric ID of the job to approve. IDs start at 1." />
          </PropTable>
          <Para>Emits: <code style={{ color: "var(--color-green)", fontFamily: "var(--font-mono)", fontSize: 12 }}>WorkApproved(uint256 jobId, address freelancer, uint256 amount)</code></Para>
        </div>
      </div>

      {/* raiseDispute */}
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            background: "rgba(255,107,53,0.06)",
            border: "1px solid rgba(255,107,53,0.2)",
            borderRadius: "10px 10px 0 0",
            padding: "12px 18px",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            color: "#A8D8C8",
          }}
        >
          <span style={{ color: "var(--color-blue-l)" }}>function </span>
          raiseDispute(uint256 jobId)
        </div>
        <div
          style={{
            border: "1px solid rgba(255,107,53,0.2)",
            borderTop: "none",
            borderRadius: "0 0 10px 10px",
            padding: 16,
          }}
        >
          <Para>
            Client flags the job as disputed. Funds are frozen on-chain. Job status moves to{" "}
            <span style={{ color: "var(--color-orange)", fontFamily: "var(--font-mono)", fontSize: 12 }}>DISPUTED</span>.
          </Para>
          <Callout type="warning">
            Currently there is no arbitrator — disputed funds are permanently frozen. A v2 arbitration
            module is planned.
          </Callout>
          <PropTable>
            <PropRow name="jobId" type="uint256" desc="The numeric ID of the ACTIVE job to dispute." />
          </PropTable>
          <Para>Emits: <code style={{ color: "var(--color-green)", fontFamily: "var(--font-mono)", fontSize: 12 }}>DisputeRaised(uint256 jobId, address client)</code></Para>
        </div>
      </div>

      {/* claimRefund */}
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            background: "rgba(155,89,182,0.06)",
            border: "1px solid rgba(155,89,182,0.2)",
            borderRadius: "10px 10px 0 0",
            padding: "12px 18px",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            color: "#A8D8C8",
          }}
        >
          <span style={{ color: "var(--color-blue-l)" }}>function </span>
          claimRefund(uint256 jobId)
        </div>
        <div
          style={{
            border: "1px solid rgba(155,89,182,0.2)",
            borderTop: "none",
            borderRadius: "0 0 10px 10px",
            padding: 16,
          }}
        >
          <Para>
            After the deadline has passed on an ACTIVE job, the client may reclaim their locked ETH.
            Status moves to <span style={{ color: "#9b59b6", fontFamily: "var(--font-mono)", fontSize: 12 }}>REFUNDED</span>.
          </Para>
          <Callout type="info">
            The deadline check is on-chain: <code style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>block.timestamp &gt; deadline</code>. Reverts before expiry.
          </Callout>
          <PropTable>
            <PropRow name="jobId" type="uint256" desc="The numeric ID of the expired ACTIVE job to refund." />
          </PropTable>
          <Para>Emits: <code style={{ color: "var(--color-green)", fontFamily: "var(--font-mono)", fontSize: 12 }}>RefundClaimed(uint256 jobId, address client, uint256 amount)</code></Para>
        </div>
      </div>

      <SubHeading>Read Functions</SubHeading>

      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            background: "rgba(0,82,255,0.04)",
            border: "1px solid rgba(0,82,255,0.15)",
            borderRadius: "10px 10px 0 0",
            padding: "12px 18px",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            color: "#A8D8C8",
          }}
        >
          <span style={{ color: "var(--color-blue-l)" }}>function </span>
          getJob(uint256 jobId){" "}
          <span style={{ color: "var(--color-blue-l)" }}>view returns</span> (Job)
        </div>
        <div
          style={{
            border: "1px solid rgba(0,82,255,0.15)",
            borderTop: "none",
            borderRadius: "0 0 10px 10px",
            padding: 16,
          }}
        >
          <Para>Returns the full Job struct for a given ID.</Para>
          <PropTable headers={["Field", "Type", "Description"]}>
            <PropRow name="client"     type="address" desc="Wallet that created and funded the job." />
            <PropRow name="freelancer" type="address" desc="Wallet that will receive funds on approval." />
            <PropRow name="amount"     type="uint256" desc="Locked ETH in wei (divide by 1e18 for ETH)." />
            <PropRow name="deadline"   type="uint256" desc="Unix timestamp — after which claimRefund is available." />
            <PropRow name="status"     type="uint8"   desc="0=ACTIVE, 1=APPROVED, 2=DISPUTED, 3=REFUNDED" />
          </PropTable>
        </div>
      </div>

      <CodeBlock lang="solidity" code={`// Anchor.sol — simplified interface
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Anchor {
    enum Status { ACTIVE, APPROVED, DISPUTED, REFUNDED }

    struct Job {
        address client;
        address freelancer;
        uint256 amount;
        uint256 deadline;
        Status  status;
    }

    uint256 public jobCount;
    mapping(uint256 => Job) public jobs;

    event JobCreated(uint256 indexed jobId, address client,
                     address freelancer, uint256 amount);
    event WorkApproved(uint256 indexed jobId, address freelancer,
                       uint256 amount);
    event DisputeRaised(uint256 indexed jobId, address client);
    event RefundClaimed(uint256 indexed jobId, address client,
                        uint256 amount);

    function createJob(address freelancer, uint256 deadline)
        external payable;

    function approveWork(uint256 jobId) external;
    function raiseDispute(uint256 jobId) external;
    function claimRefund(uint256 jobId) external;

    function getJob(uint256 jobId)
        external view returns (Job memory);
}`} />
    </div>
  );
}

function HooksSection() {
  return (
    <div>
      <div className="section-label" style={{ marginBottom: 16 }}>
        <span>REACT HOOKS API</span>
      </div>
      <SectionHeading>React Hooks</SectionHeading>
      <Para>
        All contract interactions are exposed as strongly-typed React hooks built on top of{" "}
        <span style={{ color: "var(--color-blue-l)" }}>Wagmi v2</span>. Import from{" "}
        <code style={{ color: "var(--color-blue-l)", fontFamily: "var(--font-mono)", fontSize: 12 }}>@/hooks/useAnchor</code>.
      </Para>

      {[
        {
          name: "useJobCount",
          signature: "useJobCount() → { data: bigint | undefined, refetch }",
          desc: "Returns the total number of jobs ever created. Use to paginate the job list.",
          example: `const { data: jobCount, refetch } = useJobCount();
const count = Number(jobCount || 0);`,
        },
        {
          name: "useGetJob",
          signature: "useGetJob(jobId: number | bigint) → { data: Job | undefined, refetch }",
          desc: "Fetches a single Job struct from the contract by its ID.",
          example: `const { data: job, refetch } = useGetJob(1);
if (job) {
  const ethAmount = Number(job.amount) / 1e18;
  const isExpired = Date.now() > Number(job.deadline) * 1000;
  // job.status → 0=ACTIVE, 1=APPROVED, 2=DISPUTED, 3=REFUNDED
}`,
        },
        {
          name: "useCreateJob",
          signature: "useCreateJob() → { createJob, isPending, error, isSuccess }",
          desc: "Creates a new escrow job. Locks ETH in the contract.",
          example: `const { createJob, isPending } = useCreateJob();

await createJob(
  '0xFreelancerAddress',                        // freelancer
  Math.floor(Date.now() / 1000) + 7 * 86400,   // 7-day deadline
  '0.5'                                          // ETH amount (string)
);`,
        },
        {
          name: "useApproveWork",
          signature: "useApproveWork() → { approveWork, isPending, error, isSuccess }",
          desc: "Approves the freelancer's work and releases locked ETH. Only callable by the job's client.",
          example: `const { approveWork, isPending } = useApproveWork();
await approveWork(jobId); // jobId: number | bigint`,
        },
        {
          name: "useRaiseDispute",
          signature: "useRaiseDispute() → { raiseDispute, isPending, error, isSuccess }",
          desc: "Marks a job as disputed, freezing funds. Only the job client can call this.",
          example: `const { raiseDispute, isPending } = useRaiseDispute();
await raiseDispute(jobId);`,
        },
        {
          name: "useClaimRefund",
          signature: "useClaimRefund() → { claimRefund, isPending, error, isSuccess }",
          desc: "Reclaims locked ETH after the deadline expires on an ACTIVE job. Only callable by the client.",
          example: `const { claimRefund, isPending } = useClaimRefund();
await claimRefund(jobId);`,
        },
      ].map((hook) => (
        <div key={hook.name} style={{ marginBottom: 32 }}>
          <div
            style={{
              background: "rgba(0,82,255,0.06)",
              border: "1px solid rgba(0,82,255,0.18)",
              borderRadius: "10px 10px 0 0",
              padding: "12px 18px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                color: "var(--color-blue-l)",
                fontWeight: 600,
              }}
            >
              {hook.name}
            </span>
          </div>
          <div
            style={{
              border: "1px solid rgba(0,82,255,0.18)",
              borderTop: "none",
              borderRadius: "0 0 10px 10px",
              padding: 16,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--color-text-muted)",
                marginBottom: 10,
                letterSpacing: "0.02em",
              }}
            >
              {hook.signature}
            </div>
            <Para>{hook.desc}</Para>
            <CodeBlock lang="typescript" code={hook.example} />
          </div>
        </div>
      ))}

      <SubHeading>Low-level primitives</SubHeading>
      <Para>
        For custom use cases, two low-level hooks are also exported:
      </Para>
      <CodeBlock lang="typescript" code={`// Generic contract read — pass any function name + args
const { data } = useAnchorRead('jobCount');
const { data: job } = useAnchorRead('getJob', [1n]);

// Generic contract write — full control over args and ETH value
const { writeContract, writeContractAsync } = useAnchorWrite();
await writeContractAsync('createJob', [freelancer, deadline], '0.5');`} />
    </div>
  );
}

function LifecycleSection() {
  const stages = [
    {
      num: "01",
      name: "ACTIVE",
      color: "var(--color-blue)",
      bg: "rgba(0,82,255,0.08)",
      border: "rgba(0,82,255,0.3)",
      trigger: "createJob() called",
      description: "ETH is locked. Freelancer can see the job on-chain. Work begins.",
      actions: ["approveWork → moves to APPROVED", "raiseDispute → moves to DISPUTED", "claimRefund (after deadline) → moves to REFUNDED"],
    },
    {
      num: "02",
      name: "APPROVED",
      color: "var(--color-green)",
      bg: "rgba(0,200,150,0.08)",
      border: "rgba(0,200,150,0.3)",
      trigger: "approveWork() called by client",
      description: "ETH transferred directly to the freelancer. Terminal state — no further actions.",
      actions: ["No further contract calls available"],
    },
    {
      num: "03",
      name: "DISPUTED",
      color: "var(--color-orange)",
      bg: "rgba(255,107,53,0.08)",
      border: "rgba(255,107,53,0.3)",
      trigger: "raiseDispute() called by client",
      description: "Funds frozen on-chain. Arbitration module (v2) will handle resolution.",
      actions: ["Currently a terminal state — v2 arbitration planned"],
    },
    {
      num: "04",
      name: "REFUNDED",
      color: "#9b59b6",
      bg: "rgba(155,89,182,0.08)",
      border: "rgba(155,89,182,0.3)",
      trigger: "claimRefund() called after deadline",
      description: "ETH returned to the client. Terminal state.",
      actions: ["No further contract calls available"],
    },
  ];

  return (
    <div>
      <div className="section-label" style={{ marginBottom: 16 }}>
        <span>JOB LIFECYCLE</span>
      </div>
      <SectionHeading>Job Lifecycle</SectionHeading>
      <Para>
        Every job passes through a state machine with four possible statuses. Only ACTIVE jobs can
        transition — APPROVED, DISPUTED, and REFUNDED are all terminal states.
      </Para>

      {/* State machine diagram */}
      <div
        style={{
          background: "#080f1e",
          border: "1px solid rgba(0,82,255,0.15)",
          borderRadius: 12,
          padding: "28px 24px",
          marginBottom: 32,
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          lineHeight: 2,
          color: "var(--color-text-secondary)",
          overflowX: "auto",
        }}
      >
        <pre style={{ margin: 0 }}>{`createJob()
    │
    ▼
┌─────────┐
│ ACTIVE  │──── approveWork() ──────► APPROVED  ✓ (funds to freelancer)
│  (0)    │
│         │──── raiseDispute() ─────► DISPUTED  ⚠ (funds frozen)
│         │
│         │──── claimRefund()  ─────► REFUNDED  ↩ (funds to client)
│         │     (deadline expired)
└─────────┘`}</pre>
      </div>

      {stages.map((s) => (
        <div
          key={s.name}
          style={{
            background: s.bg,
            border: `1px solid ${s.border}`,
            borderRadius: 12,
            padding: "18px 20px",
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <span
              style={{
                fontSize: 10,
                fontFamily: "var(--font-mono)",
                color: s.color,
                letterSpacing: "0.14em",
              }}
            >
              {s.num}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                fontWeight: 700,
                color: s.color,
                letterSpacing: "0.08em",
              }}
            >
              {s.name}
            </span>
            <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>
              triggered by: <span style={{ color: "var(--color-text-secondary)" }}>{s.trigger}</span>
            </span>
          </div>
          <p style={{ fontSize: 14, color: "var(--color-text-secondary)", marginBottom: 8, lineHeight: 1.6 }}>
            {s.description}
          </p>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {s.actions.map((a) => (
              <li
                key={a}
                style={{ fontSize: 12, color: "var(--color-text-muted)", lineHeight: 1.8, fontFamily: "var(--font-mono)" }}
              >
                {a}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function EventsSection() {
  const events = [
    {
      name: "JobCreated",
      signature: "JobCreated(uint256 indexed jobId, address client, address freelancer, uint256 amount)",
      hook: "useListenJobCreated",
      desc: "Emitted when a new job is created and ETH is locked.",
      usage: `useListenJobCreated((logs) => {
  logs.forEach(log => {
    console.log('New job:', log.args.jobId);
    console.log('ETH locked:', log.args.amount);
    refetchJobCount();
  });
});`,
    },
    {
      name: "WorkApproved",
      signature: "WorkApproved(uint256 indexed jobId, address freelancer, uint256 amount)",
      hook: "useListenWorkApproved",
      desc: "Emitted when a client approves work and releases funds to the freelancer.",
      usage: `useListenWorkApproved((logs) => {
  const relevant = logs.find(
    log => log.args.jobId?.toString() === jobId.toString()
  );
  if (relevant) refetchJob();
});`,
    },
    {
      name: "DisputeRaised",
      signature: "DisputeRaised(uint256 indexed jobId, address client)",
      hook: "useListenDisputeRaised",
      desc: "Emitted when a client disputes a job, freezing the funds.",
      usage: `useListenDisputeRaised((logs) => {
  const relevant = logs.find(
    log => log.args.jobId?.toString() === jobId.toString()
  );
  if (relevant) refetchJob();
});`,
    },
    {
      name: "RefundClaimed",
      signature: "RefundClaimed(uint256 indexed jobId, address client, uint256 amount)",
      hook: "useListenRefundClaimed",
      desc: "Emitted when a client reclaims ETH after a deadline-expired job.",
      usage: `useListenRefundClaimed((logs) => {
  const relevant = logs.find(
    log => log.args.jobId?.toString() === jobId.toString()
  );
  if (relevant) refetchJob();
});`,
    },
  ];

  return (
    <div>
      <div className="section-label" style={{ marginBottom: 16 }}>
        <span>EVENTS</span>
      </div>
      <SectionHeading>Events</SectionHeading>
      <Para>
        Anchor emits 4 on-chain events. Subscribe to them in React using the{" "}
        <code style={{ color: "var(--color-blue-l)", fontFamily: "var(--font-mono)", fontSize: 12 }}>useListen*</code>{" "}
        hooks — these use Wagmi&apos;s <code style={{ color: "var(--color-blue-l)", fontFamily: "var(--font-mono)", fontSize: 12 }}>useWatchContractEvent</code> under the hood and
        provide real-time updates without polling.
      </Para>

      <Callout type="tip">
        Always filter by <code style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>jobId</code> inside the callback before calling{" "}
        <code style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>refetch()</code> to avoid unnecessary re-renders on unrelated jobs.
      </Callout>

      {events.map((ev) => (
        <div key={ev.name} style={{ marginBottom: 28 }}>
          <SubHeading>
            <span style={{ color: "var(--color-green)", fontFamily: "var(--font-mono)", fontSize: 14 }}>
              {ev.name}
            </span>
            <span style={{ fontSize: 11, color: "var(--color-text-muted)", fontWeight: 400, fontFamily: "var(--font-mono)" }}>
              → {ev.hook}()
            </span>
          </SubHeading>
          <div
            style={{
              background: "rgba(0,200,150,0.05)",
              border: "1px solid rgba(0,200,150,0.15)",
              borderRadius: 8,
              padding: "10px 16px",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--color-green)",
              marginBottom: 12,
              overflowX: "auto",
              whiteSpace: "pre",
            }}
          >
            {ev.signature}
          </div>
          <Para>{ev.desc}</Para>
          <CodeBlock lang="typescript" code={ev.usage} />
        </div>
      ))}
    </div>
  );
}

function SdkSection() {
  return (
    <div>
      <div className="section-label" style={{ marginBottom: 16 }}>
        <span>SDK INTEGRATION</span>
      </div>
      <SectionHeading>SDK Integration</SectionHeading>
      <Para>
        The following shows how to wire all hooks together in a complete client dashboard that
        handles job creation, listing, and all state transitions.
      </Para>

      <SubHeading>Full client dashboard pattern</SubHeading>
      <CodeBlock lang="typescript" code={`'use client';
import {
  useCreateJob, useJobCount, useGetJob,
  useApproveWork, useRaiseDispute, useClaimRefund,
  useListenJobCreated, useListenWorkApproved,
  useListenDisputeRaised, useListenRefundClaimed,
} from '@/hooks/useAnchor';
import { useAccount } from 'wagmi';

export function ClientDashboard() {
  const { address } = useAccount();
  const { data: jobCount, refetch: refetchCount } = useJobCount();
  const count = Number(jobCount || 0);

  // Real-time job count updates
  useListenJobCreated(() => refetchCount());

  const { createJob, isPending: isCreating } = useCreateJob();

  const handleCreate = async () => {
    const deadline = Math.floor(Date.now() / 1000) + 7 * 86400; // 7 days
    await createJob(FREELANCER_ADDRESS, deadline, '0.5');
  };

  return (
    <div>
      <button onClick={handleCreate} disabled={isCreating}>
        {isCreating ? 'Locking ETH...' : 'Create Escrow'}
      </button>

      {/* Render most recent jobs first */}
      {Array.from({ length: count })
        .reverse()
        .map((_, i) => (
          <JobCard key={count - i} jobId={count - i} clientAddress={address} />
        ))}
    </div>
  );
}

function JobCard({ jobId, clientAddress }: {
  jobId: number;
  clientAddress?: string;
}) {
  const { data, refetch } = useGetJob(jobId);
  const job = data as any;

  const { approveWork } = useApproveWork();
  const { raiseDispute } = useRaiseDispute();
  const { claimRefund } = useClaimRefund();

  // Selective refetch — only update when THIS job's events fire
  const checkAndRefetch = (logs: any) => {
    if (logs.some((l: any) => l.args.jobId?.toString() === String(jobId))) {
      refetch();
    }
  };
  useListenWorkApproved(checkAndRefetch);
  useListenDisputeRaised(checkAndRefetch);
  useListenRefundClaimed(checkAndRefetch);

  if (!job || job.client !== clientAddress) return null;

  const isExpired = Date.now() > Number(job.deadline) * 1000;
  const ethAmount = (Number(job.amount) / 1e18).toFixed(4);

  return (
    <div>
      <h3>Job #{jobId} — {ethAmount} ETH</h3>
      <p>Status: {['ACTIVE','APPROVED','DISPUTED','REFUNDED'][job.status]}</p>

      {job.status === 0 && (
        <>
          <button onClick={() => approveWork(jobId)}>Approve & Pay</button>
          <button onClick={() => raiseDispute(jobId)}>Raise Dispute</button>
          {isExpired && (
            <button onClick={() => claimRefund(jobId)}>Claim Refund</button>
          )}
        </>
      )}
    </div>
  );
}`} />

      <SubHeading>Freelancer view pattern</SubHeading>
      <CodeBlock lang="typescript" code={`'use client';
import { useJobCount, useGetJob, useListenJobCreated } from '@/hooks/useAnchor';
import { useAccount } from 'wagmi';

// Shows only jobs assigned to the current freelancer wallet
function FreelancerJobList() {
  const { address } = useAccount();
  const { data: jobCount, refetch } = useJobCount();
  const count = Number(jobCount || 0);

  // Refresh total when new jobs are posted
  useListenJobCreated(() => refetch());

  return (
    <>
      {Array.from({ length: count })
        .reverse()
        .map((_, i) => (
          <FreelancerJobCard
            key={count - i}
            jobId={count - i}
            freelancerAddress={address}
          />
        ))}
    </>
  );
}

function FreelancerJobCard({ jobId, freelancerAddress }: {
  jobId: number;
  freelancerAddress?: string;
}) {
  const { data, refetch } = useGetJob(jobId);
  const job = data as any;

  if (!job || job.freelancer !== freelancerAddress) return null;

  const ethAmount = (Number(job.amount) / 1e18).toFixed(4);
  const deadlineDate = new Date(Number(job.deadline) * 1000);

  return (
    <div>
      <h3>Job #{jobId} — {ethAmount} ETH locked</h3>
      <p>Client: {job.client}</p>
      <p>Deadline: {deadlineDate.toLocaleDateString()}</p>
      <p>Status: {['ACTIVE','APPROVED','DISPUTED','REFUNDED'][job.status]}</p>
    </div>
  );
}`} />
    </div>
  );
}

function NetworkSection() {
  return (
    <div>
      <div className="section-label" style={{ marginBottom: 16 }}>
        <span>NETWORK & DEPLOY</span>
      </div>
      <SectionHeading>Network & Deployment</SectionHeading>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 32 }}>
        {[
          {
            name: "Base Sepolia",
            type: "TESTNET",
            chainId: "84532",
            color: "var(--color-blue-l)",
            bg: "rgba(0,82,255,0.06)",
            border: "rgba(0,82,255,0.2)",
            contract: "0xC3E79D0C55e58da43f137264FBe812E2f5cc249F",
            rpc: "https://sepolia.base.org",
            explorer: "https://sepolia.basescan.org",
            faucet: "https://sepoliafaucet.com",
          },
          {
            name: "Base Mainnet",
            type: "MAINNET",
            chainId: "8453",
            color: "var(--color-green)",
            bg: "rgba(0,200,150,0.06)",
            border: "rgba(0,200,150,0.2)",
            contract: "Deploy pending",
            rpc: "https://mainnet.base.org",
            explorer: "https://basescan.org",
            faucet: "—",
          },
        ].map((net) => (
          <div
            key={net.name}
            style={{ background: net.bg, border: `1px solid ${net.border}`, borderRadius: 12, padding: "20px 20px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: "var(--color-text-primary)" }}>{net.name}</span>
              <span style={{ fontSize: 10, letterSpacing: "0.12em", color: net.color, fontFamily: "var(--font-mono)" }}>
                {net.type}
              </span>
            </div>
            {[
              { label: "Chain ID", value: net.chainId },
              { label: "Contract", value: net.contract.length > 20 ? net.contract.slice(0, 18) + "..." : net.contract },
              { label: "RPC", value: net.rpc },
              { label: "Explorer", value: net.explorer.replace("https://", "") },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12 }}>
                <span style={{ color: "var(--color-text-muted)", letterSpacing: "0.06em" }}>{row.label}</span>
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-secondary)" }}>{row.value}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <SubHeading>Add Base Sepolia to MetaMask</SubHeading>
      <CodeBlock lang="json" code={`{
  "chainId": "0x14A34",
  "chainName": "Base Sepolia Testnet",
  "nativeCurrency": { "name": "ETH", "symbol": "ETH", "decimals": 18 },
  "rpcUrls": ["https://sepolia.base.org"],
  "blockExplorerUrls": ["https://sepolia.basescan.org"]
}`} />

      <SubHeading>Environment Variables Reference</SubHeading>
      <PropTable headers={["Variable", "Type", "Description"]}>
        <PropRow
          name="NEXT_PUBLIC_CONTRACT_ADDRESS"
          type="0x..."
          desc="Deployed Anchor.sol address on the target network."
        />
        <PropRow
          name="NEXT_PUBLIC_WC_PROJECT_ID"
          type="string"
          desc="WalletConnect Cloud project ID from cloud.walletconnect.com."
        />
      </PropTable>

      <Callout type="info">
        The same Anchor.sol contract is used for both networks — only the environment variable changes.
        Never commit secret keys to git; the variables above are safe to expose publicly (they are
        prefixed <code style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>NEXT_PUBLIC_</code>).
      </Callout>
    </div>
  );
}

function FaqSection() {
  const faqs = [
    {
      q: "Who holds the ETH during an active job?",
      a: "The Anchor smart contract holds it. Not a multi-sig, not a team wallet — the contract code itself. No one can move the funds except through the four defined functions.",
    },
    {
      q: "What happens if the client disappears before approving?",
      a: "The freelancer's protection is the deadline. If the client doesn't approve and the deadline passes, the client can only claim a refund — they cannot keep the freelancer waiting indefinitely since the job is visible on-chain. A future version will allow freelancers to trigger arbitration.",
    },
    {
      q: "What happens if a dispute is raised?",
      a: "Currently funds are frozen in DISPUTED status permanently (v1 has no arbitrator). Anchor v2 will add an on-chain arbitration module. For now, raise disputes only as a last resort.",
    },
    {
      q: "Is the contract upgradeable?",
      a: "No. There is no proxy, no owner, no admin key. The code deployed on Basescan is the code that runs forever. You can verify this yourself: there is no 'upgradeTo' or 'owner' function in the ABI.",
    },
    {
      q: "Can I use Anchor for non-freelance use cases?",
      a: "Yes — the contract is generic. Any use case that requires trustless escrow between two parties (bounties, deliverable-based contracts, SaaS subscriptions, etc.) can use it.",
    },
    {
      q: "What wallets are supported?",
      a: "Any EVM-compatible wallet: MetaMask, Phantom (EVM mode), Coinbase Smart Wallet, Rainbow, Ledger, and any WalletConnect-compatible wallet. The UI prioritises MetaMask and Phantom with mobile deep-links.",
    },
    {
      q: "Are gas fees on Base really $0.001?",
      a: "Approximately. Base Sepolia fees are effectively zero (testnet). Base mainnet fees are typically $0.001–$0.01 per transaction depending on L1 DA costs. Significantly cheaper than Ethereum mainnet.",
    },
    {
      q: "How do I get the freelancer's address?",
      a: "The freelancer shares their wallet address (0x...) with you. You enter it when creating the job. There is no username system — addresses are the identity primitive on-chain.",
    },
  ];

  const [open, setOpen] = useState<number | null>(null);

  return (
    <div>
      <div className="section-label" style={{ marginBottom: 16 }}>
        <span>FAQ</span>
      </div>
      <SectionHeading>Frequently Asked Questions</SectionHeading>

      <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 8 }}>
        {faqs.map((faq, i) => (
          <div
            key={i}
            style={{
              border: "1px solid rgba(122,136,184,0.12)",
              borderRadius: 10,
              overflow: "hidden",
              background: open === i ? "rgba(0,82,255,0.04)" : "transparent",
              transition: "background 0.2s",
              marginBottom: 6,
            }}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: "100%",
                textAlign: "left",
                background: "none",
                border: "none",
                padding: "16px 20px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                color: "var(--color-text-primary)",
                fontSize: 15,
                fontWeight: 500,
              }}
            >
              <span>{faq.q}</span>
              <span
                style={{
                  color: "var(--color-blue-l)",
                  fontSize: 18,
                  transform: open === i ? "rotate(45deg)" : "none",
                  transition: "transform 0.2s",
                  flexShrink: 0,
                }}
              >
                +
              </span>
            </button>
            {open === i && (
              <div
                style={{
                  padding: "0 20px 16px",
                  fontSize: 14,
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.7,
                  borderTop: "1px solid rgba(122,136,184,0.08)",
                  paddingTop: 14,
                }}
              >
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Section renderer ──────────────────────────────────────────────────────────
function renderSection(section: Section) {
  switch (section) {
    case "overview":   return <OverviewSection />;
    case "quickstart": return <QuickStartSection />;
    case "contract":   return <ContractSection />;
    case "hooks":      return <HooksSection />;
    case "lifecycle":  return <LifecycleSection />;
    case "events":     return <EventsSection />;
    case "sdk":        return <SdkSection />;
    case "network":    return <NetworkSection />;
    case "faq":        return <FaqSection />;
  }
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function DocsPage() {
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll content to top on section change
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
    window.scrollTo({ top: 0 });
    // eslint-disable-next-line
    setMobileNavOpen(false);
  }, [activeSection]);

  return (
    <>
      <Navbar />
      <main
        style={{
          minHeight: "100vh",
          paddingTop: 80, // clear fixed navbar
          background: "var(--color-bg)",
        }}
      >
        {/* ── Docs hero strip ── */}
        <div
          style={{
            borderBottom: "1px solid rgba(122,136,184,0.08)",
            padding: "40px 48px 32px",
            background: "linear-gradient(180deg, rgba(0,82,255,0.04) 0%, transparent 100%)",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div className="section-label" style={{ marginBottom: 12 }}>
              <span>DOCUMENTATION</span>
            </div>
            <h1
              style={{
                fontSize: "clamp(28px, 4vw, 48px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "var(--color-text-primary)",
                marginBottom: 10,
              }}
            >
              Anchor Protocol Docs
            </h1>
            <p
              style={{
                fontSize: 16,
                color: "var(--color-text-secondary)",
                maxWidth: 560,
                lineHeight: 1.65,
              }}
            >
              Everything you need to integrate the Anchor trustless escrow protocol — contract
              reference, React hooks, job lifecycle, events, and examples.
            </p>

            {/* Mobile nav toggle */}
            <button
              onClick={() => setMobileNavOpen((o) => !o)}
              className="show-on-mobile"
              style={{
                marginTop: 20,
                background: "rgba(0,82,255,0.1)",
                border: "1px solid rgba(0,82,255,0.25)",
                borderRadius: 8,
                color: "var(--color-blue-l)",
                padding: "8px 16px",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                cursor: "pointer",
                letterSpacing: "0.08em",
              }}
            >
              {mobileNavOpen ? "✕ CLOSE MENU" : "☰ CONTENTS"}
            </button>
          </div>
        </div>

        {/* ── Layout: sidebar + content ── */}
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "220px 1fr",
            gap: 0,
            alignItems: "start",
          }}
          className="docs-layout"
        >
          {/* ── Sidebar ── */}
          <nav
            className={`docs-sidebar${mobileNavOpen ? " docs-sidebar--open" : ""}`}
            style={{
              position: "sticky",
              top: 80,
              height: "calc(100vh - 80px)",
              overflowY: "auto",
              borderRight: "1px solid rgba(122,136,184,0.08)",
              padding: "28px 0",
            }}
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "10px 24px",
                  background: activeSection === item.id ? "rgba(0,82,255,0.1)" : "none",
                  border: "none",
                  borderRight:
                    activeSection === item.id
                      ? "2px solid var(--color-blue)"
                      : "2px solid transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: 13,
                  color:
                    activeSection === item.id
                      ? "var(--color-text-primary)"
                      : "var(--color-text-secondary)",
                  fontWeight: activeSection === item.id ? 600 : 400,
                  transition: "all 0.15s",
                  letterSpacing: "0.01em",
                }}
              >
                <span style={{ fontSize: 14 }}>{item.icon}</span>
                {item.label}
              </button>
            ))}

            {/* Bottom links */}
            <div
              style={{
                borderTop: "1px solid rgba(122,136,184,0.08)",
                marginTop: 24,
                padding: "20px 24px 0",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {[
                { label: "← Back to Home", href: "/" },
                { label: "Launch App →", href: "/dashboard" },
                { label: "GitHub ↗", href: "https://github.com" },
              ].map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  style={{
                    fontSize: 11,
                    color: "var(--color-text-muted)",
                    textDecoration: "none",
                    letterSpacing: "0.06em",
                    fontFamily: "var(--font-mono)",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-blue-l)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* ── Main content ── */}
          <div
            ref={contentRef}
            style={{ padding: "40px 48px", minWidth: 0 }}
            className="docs-content"
          >
            {renderSection(activeSection)}

            {/* Prev / Next navigation */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 56,
                paddingTop: 24,
                borderTop: "1px solid rgba(122,136,184,0.1)",
                gap: 16,
              }}
            >
              {(() => {
                const idx = NAV_ITEMS.findIndex((n) => n.id === activeSection);
                const prev = NAV_ITEMS[idx - 1];
                const next = NAV_ITEMS[idx + 1];
                return (
                  <>
                    <div>
                      {prev && (
                        <button
                          onClick={() => setActiveSection(prev.id)}
                          className="btn-outline"
                          style={{ fontSize: 12, padding: "10px 20px" }}
                        >
                          ← {prev.label}
                        </button>
                      )}
                    </div>
                    <div>
                      {next && (
                        <button
                          onClick={() => setActiveSection(next.id)}
                          className="btn-primary"
                          style={{ fontSize: 12, padding: "10px 20px" }}
                        >
                          {next.label} →
                        </button>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </main>

      {/* Docs-specific responsive CSS injected as a style tag */}
      <style>{`
        .docs-layout {
          grid-template-columns: 220px 1fr;
        }
        .docs-sidebar {
          display: block;
        }
        .docs-content {
          padding: 40px 48px;
        }
        @media (max-width: 768px) {
          .docs-layout {
            grid-template-columns: 1fr !important;
          }
          .docs-sidebar {
            position: static !important;
            height: auto !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(122,136,184,0.08);
            display: none;
            padding: 12px 0 !important;
          }
          .docs-sidebar--open {
            display: block !important;
          }
          .docs-content {
            padding: 28px 20px !important;
          }
        }
      `}</style>

      <Footer />
    </>
  );
}
