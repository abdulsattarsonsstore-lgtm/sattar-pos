'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Loader2,
  Package,
  ArrowRight,
  TriangleAlert,
} from "lucide-react";

type LowStockItem = {
  id: number;
  product_name: string;
  stock: number;
  low_stock: number;
  unit: string;
};

export default function LowStockProducts() {
  const [products, setProducts] = useState<
    LowStockItem[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLowStockProducts() {
      try {
        setError("");

        const response = await fetch(
          "/api/dashboard/stats",
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ||
              "Unable to load low stock products."
          );
        }

        setProducts(result.lowStockItems ?? []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load low stock products."
        );
      } finally {
        setLoading(false);
      }
    }

    loadLowStockProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2
            size={17}
            className="animate-spin"
          />

          Loading stock alerts...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <p className="text-sm text-red-600">
          {error}
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex min-h-40 flex-col items-center justify-center text-center">
        <Package
          size={22}
          className="text-slate-300"
        />

        <p className="mt-2 text-sm text-slate-400">
          No low stock products.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 divide-y">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex items-center justify-between gap-4 py-3 first:pt-0"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="shrink-0 rounded-lg bg-red-50 p-2 text-red-600">
              <TriangleAlert size={17} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {product.product_name}
              </p>

              <p className="mt-0.5 text-xs text-slate-400">
                Alert at {Number(
                  product.low_stock
                ).toLocaleString()}{" "}
                {product.unit}
              </p>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <p
              className={`text-sm font-bold ${
                Number(product.stock) <= 0
                  ? "text-red-700"
                  : "text-orange-600"
              }`}
            >
              {Number(
                product.stock
              ).toLocaleString()}{" "}
              {product.unit}
            </p>

            <p className="mt-0.5 text-xs text-slate-400">
              remaining
            </p>
          </div>
        </div>
      ))}

      <div className="pt-4">
        <Link
          href="/inventory"
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
        >
          View inventory
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}