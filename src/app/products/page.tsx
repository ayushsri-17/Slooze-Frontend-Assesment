"use client";

import { useEffect, useMemo, useState } from "react";
import Protected from "../../components/Protected";
import { mockApi } from "../../services/mockApi";
import type{ Product } from "../../lib/types";
import { useAuth } from "../../context/AuthProvider";

export default function ProductsPage() {
  return (
    <Protected>
      <ProductsInner />
    </Protected>
  );
}

function ProductsInner() {
  const { session, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");

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
        setError(e?.message ?? "Failed to load products");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.sku.toLowerCase().includes(s)
    );
  }, [q, products]);

  return (
  <div className="min-h-screen p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Products</h1>
          <p className="text-sm opacity-70">
            Logged in as <span className="font-medium">{session?.role}</span> ({session?.email})
          </p>
        </div>

      </div>

      <div className="mt-6 flex items-center gap-3">
        <input
          className="w-full max-w-md rounded-lg border px-3 py-2 bg-transparent"
          placeholder="Search by name or SKU..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="mt-6 rounded-xl border overflow-hidden">
        {loading && (
          <div className="p-4 text-sm opacity-70">Loading products…</div>
        )}

        {error && (
          <div className="p-4 text-sm">
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3">
              {error}
            </div>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="p-4 text-sm opacity-70">No products found.</div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <table className="w-full text-sm">
            <thead className="bg-black/5 dark:bg-white/5">
              <tr className="text-left">
                <th className="p-3">Name</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const low = p.stock <= 5;
                return (
                  <tr key={p.id} className="border-t">
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">{p.sku}</td>
                    <td className="p-3">₹ {p.price}</td>
                    <td className="p-3">{p.stock}</td>
                    <td className="p-3">
                      {low ? (
                        <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                          Low stock
                        </span>
                      ) : (
                        <span className="opacity-70">OK</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
