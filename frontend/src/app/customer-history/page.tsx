"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

type HistoryItem = {
  id?: string;
  vehicleId?: string;
  title: string;
  status: "OPEN" | "IN_PROGRESS" | "DONE" | "CANCELLED" | string;
  completedAt?: string;
  cost?: number;
  vehicle?: { plateNo?: string; make?: string; model?: string };
};

/** Palette tokens (one place to tweak later) */
const PALETTE = {
  ink: "#0A0A0B",
  cyan: "#00F9FF",
  mint: "#3DDC97",
  red: "#E63946",
  sky: "#4CC9F0",
  blue: "#3E92CC",
};

/** Small Status badge */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; ring: string }> = {
    OPEN:        { bg: "bg-[#3E92CC]/15", text: "text-[#3E92CC]", ring: "ring-[#3E92CC]/30" },
    IN_PROGRESS: { bg: "bg-[#4CC9F0]/15", text: "text-[#4CC9F0]", ring: "ring-[#4CC9F0]/30" },
    DONE:        { bg: "bg-[#3DDC97]/15", text: "text-[#3DDC97]", ring: "ring-[#3DDC97]/30" },
    CANCELLED:   { bg: "bg-[#E63946]/15", text: "text-[#E63946]", ring: "ring-[#E63946]/30" },
  };
  const s = map[status] ?? map.OPEN;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ${s.bg} ${s.text} ${s.ring}`}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: (s.text as any).includes("#") ? (s.text as any) : undefined }} />
      {status.replace("_", " ")}
    </span>
  );
}

export default function CustomerHistoryPage() {
  const [data, setData] = useState<HistoryItem[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return data.filter(d => {
      const matchesQ =
        !ql ||
        d.title.toLowerCase().includes(ql) ||
        (d.vehicle?.plateNo ?? "").toLowerCase().includes(ql) ||
        (d.vehicle?.make ?? "").toLowerCase().includes(ql) ||
        (d.vehicle?.model ?? "").toLowerCase().includes(ql);
      const matchesStatus = status === "all" || d.status === status;
      return matchesQ && matchesStatus;
    });
  }, [data, q, status]);

  useEffect(() => {
    (async () => {
      try {
        const items: HistoryItem[] = await api("/api/customer/history");
        setData((items ?? []).sort((a, b) => (b.completedAt || "").localeCompare(a.completedAt || "")));
      } catch (e: any) {
        setErr(e?.message ?? "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="animate-pulse text-gray-600">Loading…</div>
      </div>
    );
  }
  if (err) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {err}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div
        className="border-b"
        style={{
          background: `linear-gradient(90deg, ${PALETTE.blue} 0%, ${PALETTE.sky} 100%)`,
          borderColor: PALETTE.cyan,
        }}
      >
        <div className="mx-auto max-w-6xl px-6 py-8 text-white">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Customer History</h1>
              <p className="text-white/85 mt-1">Your service records and costs in one place.</p>
            </div>
            <a
              href="/customer-dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2 text-white backdrop-blur transition hover:bg-white/25 ring-1 ring-white/30"
            >
              ← Back to dashboard
            </a>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 py-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search by title, plate, make, model…"
            className="w-72 flex-1 min-w-[240px] rounded-lg border-gray-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2"
            style={{ boxShadow: `0 0 0 0 rgba(0,0,0,0)`, outline: "none" }}
          />
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="rounded-lg border-gray-200 px-3 py-2 shadow-sm focus:outline-none focus:ring-2"
          >
            <option value="all">All statuses</option>
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="DONE">DONE</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

            <span className="ml-auto text-sm text-gray-500">
              {filtered.length} result{filtered.length === 1 ? "" : "s"}
            </span>
        </div>

        {/* Table / Empty state */}
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <div className="mx-auto mb-2 h-10 w-10 rounded-full" style={{ background: PALETTE.cyan }} />
            <p className="text-gray-700 font-medium">No history yet</p>
            <p className="text-gray-500 text-sm">Completed jobs will appear here as they are added.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            <table className="min-w-[900px] w-full">
              <thead>
                <tr
                  className="text-left text-sm font-semibold"
                  style={{ background: `${PALETTE.ink}`, color: "white" }}
                >
                  <th className="p-3">Completed</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Vehicle</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Cost (LKR)</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filtered.map((h, i) => (
                  <tr
                    key={h.id ?? i}
                    className="border-t last:border-b"
                    style={{ borderColor: "#EEF2F7" }}
                  >
                    <td className="p-3 text-gray-600">
                      {h.completedAt ? new Date(h.completedAt).toLocaleString() : "—"}
                    </td>
                    <td className="p-3 font-medium text-gray-800">{h.title}</td>
                    <td className="p-3 text-gray-700">
                      {h.vehicle?.make} {h.vehicle?.model}
                      {h.vehicle?.plateNo ? <span className="text-gray-500"> • {h.vehicle?.plateNo}</span> : ""}
                    </td>
                    <td className="p-3">
                      <StatusBadge status={h.status} />
                    </td>
                    <td className="p-3 text-right font-semibold"
                        style={{ color: PALETTE.ink }}>
                      {typeof h.cost === "number" ? h.cost.toLocaleString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
