"use client";

import React, { useState } from "react";
import { useAccount } from "wagmi";
import { NetworkGuard } from "@/components/ui/NetworkGuard";
import { ShieldCheck, Search, PlusCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useCreateJob, useJobCount, useGetJob, useApproveWork, useRaiseDispute, useClaimRefund, useListenJobCreated, useListenWorkApproved, useListenDisputeRaised, useListenRefundClaimed } from "@/hooks/useAnchor";

export default function ClientDashboard() {
  const { isConnected } = useAccount();
  const { data: jobCount, refetch: refetchJobCount } = useJobCount();
  const count = Number(jobCount || 0);

  // Auto update job count when new job is posted
  useListenJobCreated(() => refetchJobCount());

  const [freelancer, setFreelancer] = useState("");
  const [deadlineDays, setDeadlineDays] = useState("7");
  const [value, setValue] = useState("");

  const { createJob, isPending: isCreating } = useCreateJob();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const deadlineUnix = Math.floor(Date.now() / 1000) + (Number(deadlineDays) * 86400);
      await createJob(freelancer, deadlineUnix, value);
      setFreelancer("");
      setValue("");
    } catch (err) {
      console.error("Failed to create job", err);
    }
  };

  return (
    <NetworkGuard>
      <div style={{ display: "flex", minHeight: "100vh", background: "#030303", color: "var(--color-text-primary)" }}>
        <main style={{ flex: 1, padding: "32px 24px", maxWidth: 1000, margin: "0 auto", width: "100%" }}>
          <div style={{ marginBottom: 32 }}>
            <Link href="/dashboard" style={{ color: "var(--color-text-secondary)", textDecoration: "none", display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
              <ArrowLeft size={16} /> Back to Hub
            </Link>
            <h2 style={{ fontSize: 28, fontWeight: 600 }}>Client Portal</h2>
            <p style={{ color: "var(--color-text-secondary)" }}>Create and manage escrows for your freelancers.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 32 }}>
            {/* Create Job Form */}
            <div style={{
              background: "rgba(8, 15, 30, 0.4)",
              border: "1px solid rgba(122, 136, 184, 0.15)",
              borderRadius: 16,
              padding: 24,
              height: "fit-content"
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <PlusCircle size={18} /> New Escrow
              </h3>
              <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Freelancer Address</label>
                  <input 
                    required
                    value={freelancer}
                    onChange={(e) => setFreelancer(e.target.value)}
                    placeholder="0x..." 
                    style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(122, 136, 184, 0.2)", padding: "10px 12px", borderRadius: 8, color: "white" }} 
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Amount (ETH)</label>
                  <input 
                    required
                    type="number"
                    step="0.001"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="0.5" 
                    style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(122, 136, 184, 0.2)", padding: "10px 12px", borderRadius: 8, color: "white" }} 
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Deadline (Days)</label>
                  <input 
                    required
                    type="number"
                    min="1"
                    value={deadlineDays}
                    onChange={(e) => setDeadlineDays(e.target.value)}
                    style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(122, 136, 184, 0.2)", padding: "10px 12px", borderRadius: 8, color: "white" }} 
                  />
                </div>
                <button type="submit" disabled={isCreating || !isConnected} className="btn-primary" style={{ marginTop: 8, width: "100%", padding: "12px" }}>
                  {isCreating ? "Locking Funds..." : "Lock ETH & Create Job"}
                </button>
              </form>
            </div>

            {/* Jobs List */}
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Your Active Jobs</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {count > 0 ? (
                  Array.from({ length: count }).reverse().map((_, i) => (
                    <ClientJobCard key={count - i} jobId={count - i} />
                  ))
                ) : (
                  <div style={{ padding: "48px 24px", textAlign: "center", border: "1px dashed rgba(122, 136, 184, 0.3)", borderRadius: 16 }}>
                    <Search size={32} style={{ color: "rgba(122, 136, 184, 0.5)", margin: "0 auto 16px" }} />
                    <p style={{ color: "var(--color-text-secondary)" }}>No jobs found. Create one to get started.</p>
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

function ClientJobCard({ jobId }: { jobId: number }) {
  const { address } = useAccount();
  const { data, refetch: refetchJob } = useGetJob(jobId);
  const job = data as any;
  const { approveWork, isPending: isApproving } = useApproveWork();
  const { raiseDispute, isPending: isDisputing } = useRaiseDispute();
  const { claimRefund, isPending: isRefunding } = useClaimRefund();

  // Auto update job status immediately on events
  const checkLogAndRefetch = (logs: any) => {
    if (logs.some((log: any) => log.args.jobId?.toString() === jobId.toString())) {
      refetchJob();
    }
  };
  useListenWorkApproved(checkLogAndRefetch);
  useListenDisputeRaised(checkLogAndRefetch);
  useListenRefundClaimed(checkLogAndRefetch);

  if (!job) return null;
  
  // Enums: 0: ACTIVE, 1: APPROVED, 2: DISPUTED, 3: REFUNDED
  const statusLabels = ["ACTIVE", "APPROVED", "DISPUTED", "REFUNDED"];
  const statusColors = ["var(--color-blue)", "var(--color-green)", "var(--color-orange)", "#9b59b6"];
  const statusName = statusLabels[job.status] || "UNKNOWN";
  const statusColor = statusColors[job.status] || "white";

  if (job.client !== address) return null; // Only show jobs created by this client

  const deadlineMs = Number(job.deadline) * 1000;
  const isExpired = Date.now() > deadlineMs;

  return (
    <div style={{
      background: "rgba(8, 15, 30, 0.4)",
      border: "1px solid rgba(122, 136, 184, 0.15)",
      borderRadius: 16,
      padding: 24,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Job #{jobId}</div>
          <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Freelancer: {job.freelancer}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "white" }}>{(Number(job.amount) / 1e18).toFixed(4)} ETH</div>
          <div style={{ 
            fontSize: 11, 
            fontWeight: 700,
            color: statusColor, 
            background: `${statusColor}22`, 
            padding: "2px 8px", 
            borderRadius: 4, 
            display: "inline-block",
            marginTop: 4
          }}>
            {statusName}
          </div>
        </div>
      </div>

      <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 16 }}>
        Deadline: {new Date(deadlineMs).toLocaleString()} {isExpired ? "(EXPIRED)" : ""}
      </div>

      {job.status === 0 && (
        <div style={{ display: "flex", gap: 8 }}>
          <button 
            onClick={() => approveWork(jobId)} 
            disabled={isApproving}
            className="btn-primary" 
            style={{ padding: "8px 16px", fontSize: 13, flex: 1 }}
          >
            {isApproving ? "Approving..." : "Approve & Pay"}
          </button>
          
          <button 
            onClick={() => raiseDispute(jobId)}
            disabled={isDisputing}
            className="btn-outline" 
            style={{ padding: "8px 16px", fontSize: 13, flex: 1 }}
          >
            {isDisputing ? "Disputing..." : "Raise Dispute"}
          </button>

          {isExpired && (
            <button 
              onClick={() => claimRefund(jobId)}
              disabled={isRefunding}
              className="btn-outline" 
              style={{ padding: "8px 16px", fontSize: 13, flex: 1, borderColor: "var(--color-orange)", color: "var(--color-orange)" }}
            >
              {isRefunding ? "Claiming..." : "Claim Refund"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
