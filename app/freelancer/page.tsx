"use client";

import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { NetworkGuard } from "@/components/ui/NetworkGuard";
import { Search, ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { useJobCount, useGetJob, useListenJobCreated, useListenWorkApproved, useListenDisputeRaised, useListenRefundClaimed } from "@/hooks/useAnchor";

export default function FreelancerDashboard() {
  const { data: jobCount, refetch: refetchJobCount } = useJobCount();
  const count = Number(jobCount || 0);

  // Auto update job count when new job is posted
  useListenJobCreated(() => refetchJobCount());

  return (
    <NetworkGuard>
      <div style={{ display: "flex", minHeight: "100vh", background: "#030303", color: "var(--color-text-primary)" }}>
        <main style={{ flex: 1, padding: "32px 24px", maxWidth: 800, margin: "0 auto", width: "100%" }}>
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
            <h2>Freelancer Portal</h2>
            <p>View jobs assigned to you and track deadlines.</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {count > 0 ? (
              Array.from({ length: count }).reverse().map((_, i) => (
                <FreelancerJobCard key={count - i} jobId={count - i} />
              ))
            ) : (
              <div style={{ padding: "48px 24px", textAlign: "center", border: "1px dashed rgba(122, 136, 184, 0.3)", borderRadius: 16 }}>
                <Search size={32} style={{ color: "rgba(122, 136, 184, 0.5)", margin: "0 auto 16px" }} />
                <p style={{ color: "var(--color-text-secondary)" }}>No jobs found in the contract yet.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </NetworkGuard>
  );
}

function FreelancerJobCard({ jobId }: { jobId: number }) {
  const { address } = useAccount();
  const { data, refetch: refetchJob } = useGetJob(jobId);
  const job = data as any;

  // Auto update job status immediately on events
  const checkLogAndRefetch = (logs: any) => {
    if (logs.some((log: any) => log.args.jobId?.toString() === jobId.toString())) {
      refetchJob();
    }
  };
  useListenWorkApproved(checkLogAndRefetch);
  useListenDisputeRaised(checkLogAndRefetch);
  useListenRefundClaimed(checkLogAndRefetch);

  // Countdown state
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!job) return;
    const deadlineMs = Number(job.deadline) * 1000;
    
    const updateCountdown = () => {
      const now = Date.now();
      const diff = deadlineMs - now;
      
      if (diff <= 0) {
        setTimeLeft("EXPIRED");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / 1000 / 60) % 60);
      setTimeLeft(`${days}d ${hours}h ${mins}m left`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // update every minute
    return () => clearInterval(interval);
  }, [job]);

  if (!job) return null;
  
  // Only show jobs assigned to this freelancer
  if (job.freelancer !== address) return null;

  // Enums: 0: ACTIVE, 1: APPROVED, 2: DISPUTED, 3: REFUNDED
  const statusLabels = ["ACTIVE", "APPROVED", "DISPUTED", "REFUNDED"];
  const statusColors = ["var(--color-blue)", "var(--color-green)", "var(--color-orange)", "#9b59b6"];
  const statusName = statusLabels[job.status] || "UNKNOWN";
  const statusColor = statusColors[job.status] || "white";

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
       * freelancer-job-card: row on desktop (info left, ETH right)
       * → stacks to column on mobile (defined in globals.css)
       */}
      <div className="freelancer-job-card">
        {/* Left: job title, client address, status + countdown */}
        <div className="fj-left">
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Job #{jobId}</div>
          <div className="fj-client-address" title={job.client}>Client: {job.client}</div>

          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: statusColor,
                background: `${statusColor}22`,
                padding: "4px 10px",
                borderRadius: 6,
              }}
            >
              {statusName}
            </div>

            {job.status === 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 13,
                  color: timeLeft === "EXPIRED" ? "var(--color-orange)" : "var(--color-text-secondary)",
                }}
              >
                <Clock size={14} /> {timeLeft}
              </div>
            )}
          </div>
        </div>

        {/* Right: ETH amount */}
        <div className="fj-right">
          <div style={{ fontSize: 24, fontWeight: 700, color: "white" }}>
            {(Number(job.amount) / 1e18).toFixed(4)} ETH
          </div>
          <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Total Escrow</div>
        </div>
      </div>
    </div>
  );
}
