import React from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Link from "next/link";

export default function DocsPage() {
  return (
    <>
      <Navbar />
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 24px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 64px)",
            fontWeight: 800,
            marginBottom: 24,
            color: "var(--color-text-primary)",
            letterSpacing: "-0.02em",
          }}
        >
          Documentation
        </h1>
        <p
          style={{
            fontSize: 18,
            color: "var(--color-text-secondary)",
            maxWidth: 600,
            lineHeight: 1.6,
            marginBottom: 40,
          }}
        >
          The Anchor protocol documentation is currently being written. Soon you'll find everything you need to integrate trustless escrows into your applications.
        </p>
        <Link href="/" className="btn-outline" style={{ textDecoration: 'none' }}>
          &larr; Back to Home
        </Link>
      </main>
      <Footer />
    </>
  );
}
