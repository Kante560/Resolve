"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  useListenJobCreated, 
  useListenWorkApproved, 
  useListenDisputeRaised, 
  useListenRefundClaimed 
} from "@/hooks/useAnchor";
import { Bell } from "lucide-react";

interface AppEvent {
  id: string;
  type: 'JobCreated' | 'WorkApproved' | 'DisputeRaised' | 'RefundClaimed';
  jobId: string;
  message: string;
  timestamp: number;
}

export function EventFeed() {
  const [events, setEvents] = useState<AppEvent[]>([]);

  const addEvent = (event: Omit<AppEvent, 'id' | 'timestamp'>) => {
    const id = Math.random().toString();
    setEvents(prev => {
      const newEvents = [
        { ...event, id, timestamp: Date.now() },
        ...prev
      ].slice(0, 5); // Keep last 5 events
      return newEvents;
    });

    setTimeout(() => {
      setEvents(prev => prev.filter(e => e.id !== id));
    }, 4000);
  };

  useListenJobCreated((logs) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logs.forEach((log: any) => {
      addEvent({
        type: 'JobCreated',
        jobId: log.args.jobId?.toString(),
        message: `New job created for freelancer ${log.args.freelancer?.slice(0, 6)}...`
      });
    });
  });

  useListenWorkApproved((logs) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logs.forEach((log: any) => {
      addEvent({
        type: 'WorkApproved',
        jobId: log.args.jobId?.toString(),
        message: `Work approved for Job #${log.args.jobId?.toString()}`
      });
    });
  });

  useListenDisputeRaised((logs) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logs.forEach((log: any) => {
      addEvent({
        type: 'DisputeRaised',
        jobId: log.args.jobId?.toString(),
        message: `Dispute raised on Job #${log.args.jobId?.toString()}`
      });
    });
  });

  useListenRefundClaimed((logs) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logs.forEach((log: any) => {
      addEvent({
        type: 'RefundClaimed',
        jobId: log.args.jobId?.toString(),
        message: `Refund claimed for Job #${log.args.jobId?.toString()}`
      });
    });
  });

  if (events.length === 0) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 24,
      right: 24,
      width: 320,
      zIndex: 100,
      display: "flex",
      flexDirection: "column",
      gap: 8,
    }}>
      <AnimatePresence>
        {events.map((ev) => (
          <motion.div
            key={ev.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            style={{
              background: "rgba(8, 15, 30, 0.8)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(122, 136, 184, 0.2)",
              padding: "12px 16px",
              borderRadius: 12,
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)"
            }}
          >
            <div style={{ color: getEventColor(ev.type), marginTop: 2 }}>
              <Bell size={16} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "white", marginBottom: 4 }}>
                {ev.type.replace(/([A-Z])/g, ' $1').trim()}
              </div>
              <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
                {ev.message}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function getEventColor(type: string) {
  switch(type) {
    case 'JobCreated': return 'var(--color-blue)';
    case 'WorkApproved': return 'var(--color-green)';
    case 'DisputeRaised': return 'var(--color-orange)';
    case 'RefundClaimed': return '#9b59b6';
    default: return 'var(--color-blue)';
  }
}
