'use client';

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

type SalesOverviewItem = {
  date: string;
  sales: number;
};

export default function SalesOverview() {
  const [salesOverview, setSalesOverview] =
    useState<SalesOverviewItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSalesOverview() {
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
              "Unable to load sales overview."
          );
        }

        setSalesOverview(
          result.salesOverview ?? []
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load sales overview."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSalesOverview();
  }, []);

  const maxSales = useMemo(() => {
    return Math.max(
      ...salesOverview.map(
        (item) => Number(item.sales)
      ),
      0
    );
  }, [salesOverview]);

  function formatDay(date: string) {
    return new Intl.DateTimeFormat("en-PK", {
      weekday: "short",
    }).format(
      new Date(`${date}T12:00:00`)
    );
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-PK", {
      day: "numeric",
      month: "short",
    }).format(
      new Date(`${date}T12:00:00`)
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2
            size={18}
            className="animate-spin"
          />
          Loading sales overview...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-sm text-red-600">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex h-64 items-end gap-3">
        {salesOverview.map((item) => {
          const sales = Number(item.sales);

          const height =
            maxSales > 0
              ? Math.max(
                  (sales / maxSales) * 100,
                  sales > 0 ? 4 : 0
                )
              : 0;

          return (
            <div
              key={item.date}
              className="flex h-full min-w-0 flex-1 flex-col justify-end"
            >
              <div className="mb-2 text-center text-xs font-medium text-slate-600">
                {sales > 0
                  ? `Rs. ${sales.toLocaleString()}`
                  : "Rs. 0"}
              </div>

              <div className="flex h-40 items-end rounded-md bg-slate-50">
                <div
                  className="w-full rounded-t-md bg-blue-500 transition-all"
                  style={{
                    height: `${height}%`,
                  }}
                />
              </div>

              <div className="mt-2 text-center">
                <p className="text-xs font-semibold text-slate-700">
                  {formatDay(item.date)}
                </p>

                <p className="mt-0.5 text-[11px] text-slate-400">
                  {formatDate(item.date)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}