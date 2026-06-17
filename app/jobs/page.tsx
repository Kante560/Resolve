"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Briefcase, AlertCircle, RefreshCw } from "lucide-react";
import gsap from "gsap";
import { NetworkGuard } from "@/components/ui/NetworkGuard";

interface Job {
  id: string;
  company: string;
  title: string;
  logo: string;
  tags: string[];
  url: string;
  type: string;
  date: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const fetchJobs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/jobs");
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Failed with status: ${res.status}`);
      }
      const data = await res.json();
      setJobs(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while fetching jobs.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (!isLoading && jobs.length > 0 && listRef.current) {
      const cards = listRef.current.children;
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
        }
      );
    }
  }, [isLoading, jobs.length]);

  return (
    <NetworkGuard>
      <div style={{ display: "flex", minHeight: "100vh", background: "radial-gradient(circle at 50% -20%, rgba(0, 82, 255, 0.15), #030303 70%)", color: "var(--color-text-primary)" }}>
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
              position: "sticky",
              top: 0,
              zIndex: 10
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Link href="/dashboard" style={{ textDecoration: "none", color: "var(--color-text-secondary)", display: "flex", alignItems: "center", gap: 8, transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "white"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-text-secondary)"}>
                <ArrowLeft size={16} /> Back
              </Link>
              <div style={{ width: 1, height: 24, background: "rgba(122, 136, 184, 0.2)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 22 }}>⚓</span>
                <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "0.18em", color: "white" }}>
                  ANCHOR <span style={{ color: "var(--color-blue-l)", fontWeight: 400 }}>| GIGS</span>
                </span>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div style={{ padding: "48px 24px", flex: 1, maxWidth: 1000, margin: "0 auto", width: "100%" }}>
            <div style={{ marginBottom: 48 }}>
              <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 12 }}>Web3 Job Board</h1>
              <p style={{ color: "var(--color-text-secondary)", fontSize: 18, maxWidth: 600 }}>
                Find high-quality Web3 freelance opportunities. Connect, negotiate, and use Anchor for trustless escrow payments.
              </p>
            </div>

            {/* Error State */}
            {error && !isLoading && (
              <div style={{
                background: "rgba(239, 68, 68, 0.05)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                borderRadius: 16,
                padding: "64px 24px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16
              }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(239, 68, 68, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <AlertCircle size={32} style={{ color: "var(--error)" }} />
                </div>
                <div>
                  <h3 style={{ fontSize: 24, fontWeight: 600, color: "white", marginBottom: 8 }}>Unable to load jobs</h3>
                  <p style={{ color: "var(--color-text-secondary)", maxWidth: 500 }}>{error}</p>
                </div>
                <button 
                  onClick={fetchJobs} 
                  className="btn-primary" 
                  style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}
                >
                  <RefreshCw size={16} /> Try Again
                </button>
              </div>
            )}

            {/* Empty State */}
            {!error && !isLoading && jobs.length === 0 && (
              <div style={{
                background: "rgba(8, 15, 30, 0.4)",
                border: "1px solid rgba(122, 136, 184, 0.15)",
                borderRadius: 16,
                padding: "64px 24px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16
              }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(122, 136, 184, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Briefcase size={32} style={{ color: "var(--color-text-secondary)" }} />
                </div>
                <div>
                  <h3 style={{ fontSize: 24, fontWeight: 600, color: "white", marginBottom: 8 }}>No jobs available</h3>
                  <p style={{ color: "var(--color-text-secondary)", maxWidth: 450 }}>
                    We couldn't find any active Web3 gigs at the moment. Please check back later or refresh.
                  </p>
                </div>
                <button 
                  onClick={fetchJobs} 
                  className="btn-outline" 
                  style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}
                >
                  <RefreshCw size={16} /> Refresh
                </button>
              </div>
            )}

            {/* Loading State (Skeletons) */}
            {isLoading && (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} style={{
                    background: "rgba(8, 15, 30, 0.4)",
                    border: "1px solid rgba(122, 136, 184, 0.15)",
                    borderRadius: 16,
                    padding: 24,
                    display: "flex",
                    gap: 24,
                    alignItems: "center",
                    animation: "pulse-ring 2s infinite ease-in-out"
                  }}>
                    <div style={{ width: 64, height: 64, borderRadius: 12, background: "rgba(122, 136, 184, 0.1)" }} />
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ width: "40%", height: 24, background: "rgba(122, 136, 184, 0.1)", borderRadius: 4 }} />
                      <div style={{ width: "20%", height: 16, background: "rgba(122, 136, 184, 0.1)", borderRadius: 4 }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Jobs List */}
            {!isLoading && jobs.length > 0 && (
              <div ref={listRef} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {jobs.map((job) => (
                  <a key={job.id} href={job.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <div
                      className="why-card"
                      style={{
                        padding: 24,
                        display: "flex",
                        alignItems: "center",
                        gap: 24,
                        cursor: "pointer",
                      }}
                    >
                      {/* Logo Placeholder or Image */}
                      {job.logo ? (
                        <div style={{ width: 64, height: 64, borderRadius: 12, overflow: "hidden", background: "white", flexShrink: 0, padding: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <img src={job.logo} alt={job.company} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                        </div>
                      ) : (
                        <div style={{ width: 64, height: 64, borderRadius: 12, background: "rgba(0, 82, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "var(--color-blue)" }}>
                          <Briefcase size={28} />
                        </div>
                      )}

                      {/* Job Info */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                          <h3 style={{ fontSize: 20, fontWeight: 600, color: "white" }}>{job.title}</h3>
                          <ExternalLink size={18} style={{ color: "var(--color-text-secondary)" }} />
                        </div>
                        <p style={{ color: "var(--color-text-secondary)", marginBottom: 12, fontSize: 15 }}>
                          {job.company} <span style={{ margin: "0 8px", opacity: 0.5 }}>•</span> {job.type || "Remote"}
                        </p>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {job.tags?.slice(0, 6).map((tag, i) => (
                            <span key={i} className="tag">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </NetworkGuard>
  );
}
