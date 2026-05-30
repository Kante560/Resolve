"use client";

import React, { useState } from "react";
import { useAccount } from "wagmi";
import { NetworkGuard } from "@/components/ui/NetworkGuard";
import { ShieldCheck, Search, PlusCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  useCreateJob,
  useJobCount,
  useGetJob,
  useApproveWork,
  useRaiseDispute,
  useClaimRefund,
  useListenJobCreated,
  useListenWorkApproved,
  useListenDisputeRaised,
  useListenRefundClaimed,
} from "@/hooks/useAnchor";

export default function ClientDashboard() {
  const { isConnected } = useAccount();
  const { data: jobCount, refetch: refetchJobCount } = useJobCount();
  const count = Number(jobCount || 0);

  // Auto-update job count when a new job is posted
  useListenJobCreated(() => refetchJobCount());

  const [freelancer, setFreelancer] = useState("");
  const [deadlineDays, setDeadlineDays] = useState("7");
  const [value, setValue] = useState("");

  const { createJob, isPending: isCreating } = useCreateJob();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const deadlineUnix =
        Math.floor(Date.now() / 1000) + Number(deadlineDays) * 86400;
      await createJob(freelancer, deadlineUnix, value);
      setFreelancer("");
      setValue("");
    } catch (err) {
      console.error("Failed to create job", err);
    }
  };

  /* ── Shared input style — keeps form tidy without global pollution ── */
  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(122, 136, 184, 0.2)",
    padding: "10px 12px",
    borderRadius: 8,
    color: "white",
    fontSize: 14,
    fontFamily: "inherit",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 12,
    color: "var(--color-text-secondary)",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  return (
    <NetworkGuard>
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          background: "#030303",
          color: "var(--color-text-primary)",
        }}
      >
        {/* Responsive main — 24px horizontal padding on all screen sizes */}
        <main
          style={{
            flex: 1,
            padding: "32px 24px",
            maxWidth: 1000,
            margin: "0 auto",
            width: "100%",
          }}
        >
          {/* ── Page header ── */}
          <div className="client-page-header">
            <Link
              href="/dashboard"
              style={{
                color: "var(--color-text-secondary)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 24,
              }}
            >
              <ArrowLeft size={16} /> Back to Hub
            </Link>
            <h2>Client Portal</h2>
            <p>Create and manage escrows for your freelancers.</p>
          </div>

          {/*
           * client-layout:  1fr 2fr on desktop → 1fr on mobile
           * (defined in globals.css with a @media override)
           */}
          <div className="client-layout">
            {/* ── Create Job Form ── */}
            <div
              style={{
                background: "rgba(8, 15, 30, 0.4)",
                border: "1px solid rgba(122, 136, 184, 0.15)",
                borderRadius: 16,
                padding: 24,
                height: "fit-content",
              }}
            >
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <PlusCircle size={18} /> New Escrow
              </h3>

              <form
                onSubmit={handleCreate}
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                <div>
                  <label style={labelStyle}>Freelancer Address</label>
                  <input
                    required
                    value={freelancer}
                    onChange={(e) => setFreelancer(e.target.value)}
                    placeholder="0x..."
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Amount (ETH)</label>
                  <input
                    required
                    type="number"
                    step="0.001"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="0.5"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Deadline (Days)</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={deadlineDays}
                    onChange={(e) => setDeadlineDays(e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isCreating || !isConnected}
                  className="btn-primary"
                  style={{ marginTop: 8, width: "100%", padding: "12px" }}
                >
                  {isCreating ? "Locking Funds..." : "Lock ETH & Create Job"}
                </button>
              </form>
            </div>

            {/* ── Jobs List ── */}
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
                Your Active Jobs
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {count > 0 ? (
                  Array.from({ length: count })
                    .reverse()
                    .map((_, i) => (
                      <ClientJobCard key={count - i} jobId={count - i} />
                    ))
                ) : (
                  <div
                    style={{
                      padding: "48px 24px",
                      textAlign: "center",
                      border: "1px dashed rgba(122, 136, 184, 0.3)",
                      borderRadius: 16,
                    }}
                  >
                    <Search
                      size={32}
                      style={{
                        color: "rgba(122, 136, 184, 0.5)",
                        margin: "0 auto 16px",
                      }}
                    />
                    <p style={{ color: "var(--color-text-secondary)" }}>
                      No jobs found. Create one to get started.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </NetworkGuard>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ClientJobCard
   Displays a single escrow job with status badge, address, deadline,
   and context-aware action buttons.
═══════════════════════════════════════════════════════════════════════════ */
function ClientJobCard({ jobId }: { jobId: number }) {
  const { address } = useAccount();
  const { data, refetch: refetchJob } = useGetJob(jobId);
  const job = data as any;
  const { approveWork, isPending: isApproving } = useApproveWork();
  const { raiseDispute, isPending: isDisputing } = useRaiseDispute();
  const { claimRefund, isPending: isRefunding } = useClaimRefund();

  // Auto-update job status on matching contract events
  const checkLogAndRefetch = (logs: any) => {
    if (
      logs.some(
        (log: any) => log.args.jobId?.toString() === jobId.toString()
      )
    ) {
      refetchJob();
    }
  };
  useListenWorkApproved(checkLogAndRefetch);
  useListenDisputeRaised(checkLogAndRefetch);
  useListenRefundClaimed(checkLogAndRefetch);

  if (!job) return null;

  // Enums: 0: ACTIVE, 1: APPROVED, 2: DISPUTED, 3: REFUNDED
  const statusLabels = ["ACTIVE", "APPROVED", "DISPUTED", "REFUNDED"];
  const statusColors = [
    "var(--color-blue)",
    "var(--color-green)",
    "var(--color-orange)",
    "#9b59b6",
  ];
  const statusName = statusLabels[job.status] ?? "UNKNOWN";
  const statusColor = statusColors[job.status] ?? "white";

  // Only show jobs created by this client's wallet
  if (job.client !== address) return null;

  const deadlineMs = Number(job.deadline) * 1000;
  const isExpired = Date.now() > deadlineMs;

  return (
    <div
      style={{
        background: "rgba(8, 15, 30, 0.4)",
        border: "1px solid rgba(122, 136, 184, 0.15)",
        borderRadius: 16,
        padding: 24,
      }}
    >
      {/*
       * job-card-header: space-between on desktop, wraps gracefully on mobile
       * (defined in globals.css)
       */}
      <div className="job-card-header">
        {/* Left side: job number + address */}
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
            Job #{jobId}
          </div>
          {/* job-freelancer-address truncates on desktop, wraps on mobile */}
          <div className="job-freelancer-address" title={job.freelancer}>
            Freelancer: {job.freelancer}
          </div>
        </div>

        {/* Right side: amount + status badge — shrinks but never wraps */}
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "white" }}>
            {(Number(job.amount) / 1e18).toFixed(4)} ETH
          </div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: statusColor,
              background: `${statusColor}22`,
              padding: "2px 8px",
              borderRadius: 4,
              display: "inline-block",
              marginTop: 4,
            }}
          >
            {statusName}
          </div>
        </div>
      </div>

      {/* Deadline row */}
      <div
        style={{
          fontSize: 12,
          color: "var(--color-text-secondary)",
          marginBottom: 16,
        }}
      >
        Deadline: {new Date(deadlineMs).toLocaleString()}{" "}
        {isExpired && <span style={{ color: "var(--color-orange)" }}>(EXPIRED)</span>}
      </div>

      {/* Action buttons — flex-wrap on desktop, stacked on mobile */}
      {job.status === 0 && (
        <div className="job-actions">
          <button
            onClick={() => approveWork(jobId)}
            disabled={isApproving}
            className="btn-primary"
            style={{ padding: "8px 16px", fontSize: 13 }}
          >
            {isApproving ? "Approving..." : "Approve & Pay"}
          </button>

          <button
            onClick={() => raiseDispute(jobId)}
            disabled={isDisputing}
            className="btn-outline"
            style={{ padding: "8px 16px", fontSize: 13 }}
          >
            {isDisputing ? "Disputing..." : "Raise Dispute"}
          </button>

          {isExpired && (
            <button
              onClick={() => claimRefund(jobId)}
              disabled={isRefunding}
              className="btn-outline"
              style={{
                padding: "8px 16px",
                fontSize: 13,
                borderColor: "var(--color-orange)",
                color: "var(--color-orange)",
              }}
            >
              {isRefunding ? "Claiming..." : "Claim Refund"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
