"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Customer = { id?: string; userId?: string; name?: string; email?: string; phone?: string };
type Vehicle = { id?: string; customerUserId?: string; make?: string; model?: string; plateNo?: string; year?: number };
type HistoryItem = { id?: string; vehicleId?: string; title: string; status: string; completedAt?: string; cost?: number };

export default function CustomerDashboard() {
  const [me, setMe] = useState<Customer | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [recent, setRecent] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // Treat 404 from /customers/me as "no profile yet"
        const mePromise = api("/api/customer/customers/me").catch((e: any) => {
          const msg = String(e?.message ?? "");
          if (msg.startsWith("404")) return null;
          throw e;
        });

        const [meRes, vRes, hRes] = await Promise.all([
          mePromise,
          api("/api/customer/vehicles"),
          api("/api/customer/history"),
        ]);

        setMe(meRes ?? null);
        setVehicles(Array.isArray(vRes) ? vRes : []);
        const hist = Array.isArray(hRes) ? hRes : [];
        setRecent(
          hist
            .sort((a, b) => (b.completedAt || "").localeCompare(a.completedAt || ""))
            .slice(0, 5)
        );
      } catch (e: any) {
        setErr(e?.message ?? "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function createProfile() {
    try {
      setCreating(true);
      await api("/api/customer/customers/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "New User",
          email: "you@example.com",
          phone: "071-0000000",
        }),
      });
      // Re-fetch profile only
      const created = await api("/api/customer/customers/me");
      setMe(created ?? null);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to create profile");
    } finally {
      setCreating(false);
    }
  }

  if (loading) return <div className="p-6">Loading…</div>;
  if (err) return <div className="p-6 text-red-600">Error: {err}</div>;

  return (
    <div className="p-6 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Customer Dashboard</h1>
        <a href="/customer-history" className="underline">View full history</a>
      </header>

      {/* Profile */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">My Profile</h2>
        {me ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div><b>Name:</b> {me.name}</div>
            <div><b>Email:</b> {me.email}</div>
            <div><b>Phone:</b> {me.phone}</div>
            <div><b>User ID:</b> {me.userId}</div>
          </div>
        ) : (
          <div className="space-y-3">
            <p>No profile found for your account.</p>
            <button
              className="px-3 py-2 border rounded disabled:opacity-50"
              onClick={createProfile}
              disabled={creating}
            >
              {creating ? "Creating…" : "Create my profile"}
            </button>
          </div>
        )}
      </section>

      {/* Vehicles */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">My Vehicles</h2>
        {vehicles.length === 0 ? (
          <div>No vehicles found.</div>
        ) : (
          <ul className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
            {vehicles.map((v) => (
              <li key={v.id} className="border rounded-lg p-4">
                <div className="font-medium">{v.make} {v.model}</div>
                <div className="text-sm text-gray-600">{v.plateNo} • {v.year ?? "—"}</div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Recent history */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Recent Service History</h2>
        {recent.length === 0 ? (
          <div>No history yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[640px] w-full border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-2 border-r">Title</th>
                  <th className="text-left p-2 border-r">Status</th>
                  <th className="text-left p-2 border-r">Completed</th>
                  <th className="text-left p-2">Cost (LKR)</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((h, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2 border-r">{h.title}</td>
                    <td className="p-2 border-r">{h.status}</td>
                    <td className="p-2 border-r">{h.completedAt ? new Date(h.completedAt).toLocaleString() : "—"}</td>
                    <td className="p-2">{typeof h.cost === "number" ? h.cost.toLocaleString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
