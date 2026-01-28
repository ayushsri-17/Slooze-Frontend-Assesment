"use client";

import { useEffect, useMemo, useState } from "react";
import Protected from "@/components/Protected";
import { mockApi } from "@/services/mockApi";
import type { Product } from "@/lib/types";
import { useAuth } from "@/context/AuthProvider";

export default function DashboardPage() {
  return (
    <Protected allowRoles={["Manager"]}>
      <DashboardInner />
    </Protected>
  );
}

function DashboardInner() {
  const { session } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await mockApi.getProducts();
        if (!alive) return;
        setProducts(data);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message ?? "Failed to load dashboard data");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const lowStock = products.filter((p) => p.stock <= 5).length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const inventoryValue = products.reduce(
      (sum, p) => sum + p.stock * p.price,
      0
    );

    const lowStockTop = [...products]
      .filter((p) => p.stock <= 5)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 5);

    return { totalProducts, lowStock, totalStock, inventoryValue, lowStockTop };
  }, [products]);

  return (
    <div className="min-h-screen p-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm opacity-70">
          Logged in as{" "}
          <span className="font-medium">{session?.role}</span> (
          {session?.email})
        </p>
      </div>

      <div className="mt-6">
        {loading && (
          <div className="text-sm opacity-70">Loading insights…</div>
        )}

        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Stat cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Total products" value={stats.totalProducts} />
              <StatCard label="Low stock items" value={stats.lowStock} />
              <StatCard
                label="Total stock units"
                value={stats.totalStock}
              />
              <StatCard
                label="Inventory value"
                value={`₹ ${stats.inventoryValue}`}
              />
            </div>

            {/* Low stock table */}
            <div className="mt-6 rounded-xl border overflow-hidden">
              <div className="border-b p-4">
                <h2 className="font-medium">Low stock alerts</h2>
                <p className="text-sm opacity-70">
                  Items with stock ≤ 5
                </p>
              </div>

              {stats.lowStockTop.length === 0 ? (
                <div className="p-4 text-sm opacity-70">
                  No low stock items 🎉
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-black/5 dark:bg-white/5">
                    <tr className="text-left">
                      <th className="p-3">Name</th>
                      <th className="p-3">SKU</th>
                      <th className="p-3">Stock</th>
                      <th className="p-3">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.lowStockTop.map((p) => (
                      <tr key={p.id} className="border-t">
                        <td className="p-3">{p.name}</td>
                        <td className="p-3">{p.sku}</td>
                        <td className="p-3">
                          <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                            {p.stock} left
                          </span>
                        </td>
                        <td className="p-3">₹ {p.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border p-4">
      <div className="text-sm opacity-70">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}
