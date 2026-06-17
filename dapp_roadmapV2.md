# dApp Ideas & Roadmap

## Core Vision

All proposed dApps below share a common thread — **trust, value exchange, and reputation between parties**. Rather than building isolated projects, the goal is to evolve a single unified platform where each idea becomes a feature layer on top of a shared contract architecture.

The anchor is a **Decentralized Freelance Marketplace** (already in progress), extended with arbitration, then enriched with the other ideas as modules.

---

## The Anchor: Decentralized Freelance Marketplace (v2)

### What Exists (v1)
- Client posts a job and funds escrow
- Freelancer completes work
- Client approves → funds released to freelancer
- Client disputes → funds returned to client

### What v2 Adds: The Arbitrator
A single trusted wallet (`arbitrator`) acts as the tiebreaker when a dispute is raised.

**v2 Dispute Flow:**
1. Client raises a dispute
2. Arbitrator reviews evidence (off-chain or via IPFS hashes submitted on-chain)
3. Arbitrator calls `resolveDispute(jobId, winner)`:
   - `winner = freelancer` → funds released to freelancer
   - `winner = client` → funds returned to client
   - Partial splits could be added in v3

**Key Contract Changes for v2:**
```solidity
address public arbitrator;

modifier onlyArbitrator() {
    require(msg.sender == arbitrator, "Not arbitrator");
    _;
}

function resolveDispute(uint256 jobId, address winner) external onlyArbitrator {
    // release funds to winner
}
```

### Architecture Decision: Upgrade vs New Contract

**Option A — Upgrade the existing contract (v2)**
- Redeploy with arbitrator logic baked in
- Simpler, cleaner, easier to audit
- Best for MVP
- ✅ Recommended for now


**Verdict:** Ship v2 as a redeployment with the arbitrator built in. Save the contract-to-contract pattern for when you're adding the feature modules below — that's when it actually makes architectural sense.

---

## Feature Modules (Future Layers)

These proposed dApp ideas map naturally as feature layers on top of the marketplace:

---

### Module 1: On-Chain Reputation / Trust Score System

**Concept:** Every wallet that completes jobs, pays clients, or wins disputes earns an on-chain reputation score.

**Why it fits the marketplace:**
- Clients can see a freelancer's score before hiring
- Freelancers can see a client's payment history
- Arbitrator decisions feed into reputation

**Implementation ideas:**
- Soulbound NFT (ERC-5192) or on-chain mapping: `mapping(address => uint256) public reputationScore`
- Score updated on: job completion, dispute outcome, payment speed
- AI layer: AI API summarizes a wallet's history in plain English ("This freelancer has completed 12 jobs with 0 disputes")

Remote OK is one of the largest remote job boards in the world, and it has a completely open, developer-friendly architecture. You do not need an account, an API key, or authorization headers—you just call the endpoint, and it returns a clean JSON array of active listings.  Here is how to integrate it seamlessly into your Next.js and Hardhat monorepo.The EndpointYou can filter the API by appending tags to the URL. For your escrow dApp, you'll want to target Web3, crypto, or smart contract roles.Endpoint: [https://remoteok.com/api?tag=web3](https://remoteok.com/api?tag=web3)Other useful tags: crypto, solidity, smart-contract, freelanceStep 1: Create a Next.js API RouteEven though the API is completely public, it is still best practice to call it from your Next.js backend to format the data and avoid cross-origin (CORS) issues on the frontend.Create an API route in your Next.js app (e.g., pages/api/gigs.js or app/api/gigs/route.js if using the App Router).Example (App Router - app/api/gigs/route.js):JavaScriptimport { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetching web3 related jobs from Remote OK
    const response = await fetch('https://remoteok.com/api?tag=web3', {
      // Good practice to include a User-Agent when calling public APIs
      headers: {
        'User-Agent': 'OnChainEscrowApp/1.0', 
      },
    });

    const data = await response.json();

    // The Remote OK API always returns a legal disclaimer as the very first item in the array.
    // We slice it off (index 1 onwards) to get just the actual job/gig listings.
    const gigs = data.slice(1).map(job => ({
      id: job.id,
      company: job.company,
      title: job.position,
      logo: job.company_logo,
      tags: job.tags,
      url: job.url,
      type: job.location // Remote OK uses location to specify worldwide/remote
    }));

    return NextResponse.json(gigs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch gigs' }, { status: 500 });
  }
}
Step 2: Display in Your Frontend (with your UI theme)

---

### Module 2: Token-Gated Subscription / Creator Layer

**Concept:** Freelancers or creators can offer premium services gated behind ERC-1155 subscription tokens with expiry timestamps.

**Why it fits the marketplace:**
- Clients subscribe to a freelancer's retainer
- Token burns on expiry; recurring billing via contract
- Think "Web3 Patreon" built into the same platform

**Implementation ideas:**
- ERC-1155 with expiry metadata
- Subscription payments routed through the same escrow logic
- IPFS-hosted deliverables unlocked per subscription tier

---

### Module 3: Decentralized Grant DAO

**Concept:** Projects post grant applications. Token holders vote. Funds release in milestones via smart contract.

**Why it fits the marketplace:**
- Grant recipients are effectively "freelancers" funded by a DAO treasury
- Milestone-based release reuses escrow logic
- Dispute resolution reuses arbitrator pattern
- AI layer: Claude API scores proposals for feasibility and originality before voting opens

**Implementation ideas:**
- Governor contract (OpenZeppelin) for voting
- Milestone escrow child contracts (EIP-1167 minimal proxy factory)
- IPFS for proposal storage

---

### Module 4: On-Chain Invoice Factoring

**Concept:** Businesses tokenize unpaid invoices as NFTs and sell them at a discount to liquidity providers who collect the full amount later.

**Why it fits the marketplace:**
- Freelancers who completed jobs but are waiting on payment can tokenize the invoice and get immediate liquidity
- Directly solves a real problem in African/emerging market freelance contexts
- The same escrow contract can hold invoice-backed funds

**Implementation ideas:**
- ERC-721 invoice NFT with metadata: amount, due date, counterparty
- Discount pricing curve (e.g., 90 cents on the dollar for 30-day invoices)
- AI layer: risk score per invoice based on client wallet history

---

### Module 5: Peer-to-Peer Lending

**Concept:** Freelancers or clients can borrow against their reputation score or locked collateral. Lenders earn yield.

**Why it fits the marketplace:**
- Reputation score (Module 1) becomes collateral for undercollateralized loans
- Loan repayment defaults trigger dispute resolution flow
- Interest rate set dynamically based on borrower reputation

**Implementation ideas:**
- Collateral vault contract
- Interest accrual via block-based math (similar to Compound/Aave simplified)
- AI layer: suggests interest rates based on borrower wallet history

---

## Proposed Build Order

| Phase | What to build |
|-------|--------------|
| **Now** | Freelance Marketplace v2 — add arbitrator to existing contract, redeploy |
| **Next** | Build the frontend marketplace UI (Next.js + wagmi + RainbowKit) |
| **Module 1** | On-chain reputation system — feeds into everything else |
| **Module 2** | Subscription/retainer tokens — monetization layer |
| **Module 3** | Grant DAO — adds community funding dimension |
| **Module 4** | Invoice factoring — solves liquidity for freelancers |
| **Module 5** | P2P lending — closes the DeFi loop |

---

## Tech Stack (Consistent Across All Modules)

- **Smart Contracts:** Solidity + Foundry + OpenZeppelin
- **Factory Pattern:** EIP-1167 minimal proxies for job/grant/loan instances
- **Frontend:** Next.js 14 + wagmi v2 + viem + RainbowKit
- **Storage:** Pinata IPFS for proposals, deliverables, evidence
- **Indexing:** The Graph for on-chain event queries
- **AI Features:** Claude API (Anthropic) for wallet summaries, proposal scoring, risk assessment
- **Target Network:** Base Mainnet
- **Multisig Ownership:** Safe wallet for contract admin keys

---

## Notes

- Keep the arbitrator as a single wallet for MVP — multi-node arbitration (Kleros-style) is a v3 concern
- All modules share the same reputation and escrow primitives — design those to be modular from the start
- Contract-to-contract interaction becomes natural when adding modules — each module can be a separate contract that reads from the core registry
