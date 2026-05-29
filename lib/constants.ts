// ─── Anchor Protocol — Shared Data Constants ───────────────────────────────

export const NAV_LINKS = ["Protocol", "How It Works", "Stats", "Why Base", "Get Started"];

export const STATS = [
  { value: "0%",     label: "Middleman cut",  sub: "code is the escrow"  },
  { value: "~2s",    label: "Finality",        sub: "Base L2 speed"       },
  { value: "$0.001", label: "Avg gas fee",     sub: "on Base network"     },
  { value: "∞",      label: "Trustless",       sub: "no admin keys"       },
] as const;

export const STEPS = [
  {
    num: "01",
    title: "Lock",
    desc: "Client creates a job and locks ETH into Anchor's smart contract. Funds leave your wallet once — straight to the contract.",
    tag: "createJob(freelancer, deadline)",
    color: "#0052FF",
  },
  {
    num: "02",
    title: "Build",
    desc: "Freelancer sees the locked funds on-chain. No invoices. No promises. The ETH is already there, waiting.",
    tag: "Status: Active",
    color: "#00C896",
  },
  {
    num: "03",
    title: "Release",
    desc: "Client approves → freelancer paid instantly. No middleman. No 3-day hold. The contract executes.",
    tag: "approveWork(jobId)",
    color: "#0052FF",
  },
  {
    num: "04",
    title: "Safety net",
    desc: "Dispute? Funds freeze. Deadline missed? Client reclaims automatically. The contract handles every outcome.",
    tag: "raiseDispute() | claimRefund()",
    color: "#FF6B35",
  },
] as const;

export const WHY_ITEMS = [
  {
    icon: "⚡",
    title: "Base-native speed",
    body: "Sub-second UX, $0.001 gas fees. Built for real users, not just degens with money to burn on L1.",
  },
  {
    icon: "🔑",
    title: "Coinbase Smart Wallet",
    body: "Create a wallet with a passkey. No seed phrase. No extension. Works on mobile. Onboards normies.",
  },
  {
    icon: "🔒",
    title: "No admin keys",
    body: "The contract has no owner, no pause function, no upgrade proxy. What you see is what runs.",
  },
  {
    icon: "📡",
    title: "Live event feed",
    body: "Every job creation, approval, and dispute emits an on-chain event. Watch it happen in real time.",
  },
] as const;

export const CONTRACT_FUNCTIONS = [
  "function createJob(address freelancer, uint256 deadline) payable",
  "function approveWork(uint256 jobId)",
  "function raiseDispute(uint256 jobId)",
  "function claimRefund(uint256 jobId)",
] as const;

export const FOOTER_LINKS = ["Docs", "GitHub", "Basescan", "Discord"] as const;
