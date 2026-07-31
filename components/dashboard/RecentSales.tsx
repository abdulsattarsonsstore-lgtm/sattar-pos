'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Loader2,
  ReceiptText,
  ArrowRight,
} from "lucide-react";

type RecentSale = {
  id: number;
  invoice_number: string;
  total: number;
  payment_method: string;
  created_at: string;
  customer: {
    id: number;
    name: string;
  } | null;
};

export default function RecentSales() {
  const [sales, setSales] = useState<RecentSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRecentSales() {
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
              "Unable to load recent sales."
          );
        }

        setSales(result.recentSales ?? []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load recent sales."
        );
      } finally {
        setLoading(false);
      }
    }

    loadRecentSales();
  }, []);

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-PK", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(date));
  }

  if (loading) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2
            size={17}
            className="animate-spin"
          />
          Loading recent sales...
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

  if (sales.length === 0) {
    return (
      <div className="flex min-h-40 flex-col items-center justify-center text-center">
        <ReceiptText
          size={22}
          className="text-slate-300"
        />

        <p className="mt-2 text-sm text-slate-400">
          No sales recorded yet.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 divide-y">
      {sales.map((sale) => (
        <div
          key={sale.id}
          className="flex items-center justify-between gap-4 py-3 first:pt-0"
        >
          <div className="min-w-0">
            <Link
              href={`/sales/${sale.id}`}
              className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline"
            >
              {sale.invoice_number}
            </Link>

            <p className="mt-1 truncate text-xs text-slate-500">
              {sale.customer?.name ||
                "Walk-in Customer"}
              {" • "}
              {formatDate(sale.created_at)}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-sm font-bold text-slate-900">
              Rs.{" "}
              {Number(
                sale.total
              ).toLocaleString()}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {sale.payment_method}
            </p>
          </div>
        </div>
      ))}

      <div className="pt-4">
        <Link
          href="/sales"
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
        >
          View all sales
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}