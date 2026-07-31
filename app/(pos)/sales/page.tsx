'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Search,
  ReceiptText,
  Loader2,
} from "lucide-react";

type SaleCustomer = {
  id: number;
  name: string;
  phone: string;
};

type Sale = {
  id: number;
  invoice_number: string;
  customer_id: number | null;
  subtotal: number;
  discount: number;
  total: number;
  payment_method: string;
  amount_paid: number;
  amount_received: number;
  change_due: number;
  notes: string | null;
  created_at: string;
  customer: SaleCustomer | null;
};

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadSales() {
      try {
        setError("");

        const response = await fetch("/api/sales", {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ||
              "Unable to load sales history."
          );
        }

        setSales(result.sales ?? []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load sales history."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSales();
  }, []);

  const normalizedSearch = search
    .trim()
    .toLowerCase();

  const filteredSales = sales.filter((sale) => {
    if (!normalizedSearch) {
      return true;
    }

    return (
  sale.invoice_number
    .toLowerCase()
    .includes(normalizedSearch) ||
  sale.payment_method
    .toLowerCase()
    .includes(normalizedSearch) ||
  sale.customer?.name
    .toLowerCase()
    .includes(normalizedSearch) ||
  sale.customer?.phone
    .toLowerCase()
    .includes(normalizedSearch)
);
  });

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-PK", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Sales
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View completed sales and invoices.
        </p>
      </div>

      {/* SEARCH */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search invoice, customer name, phone or payment method..."
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* SALES TABLE */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="font-semibold text-slate-900">
              Sales History
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Completed transactions recorded in the
              system.
            </p>
          </div>

          {!loading && !error && (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              {filteredSales.length} sales
            </span>
          )}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex min-h-64 items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2
                size={18}
                className="animate-spin"
              />
              Loading sales...
            </div>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="flex min-h-64 items-center justify-center p-6">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
              <p className="text-sm font-medium text-red-700">
                Unable to load sales
              </p>

              <p className="mt-1 text-xs text-red-600">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          sales.length === 0 && (
            <div className="flex min-h-64 flex-col items-center justify-center text-center">
              <div className="rounded-full bg-slate-100 p-3">
                <ReceiptText
                  size={22}
                  className="text-slate-400"
                />
              </div>

              <p className="mt-3 text-sm font-medium text-slate-700">
                No sales yet
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Completed sales will appear here.
              </p>
            </div>
          )}

        {/* NO SEARCH RESULTS */}
        {!loading &&
          !error &&
          sales.length > 0 &&
          filteredSales.length === 0 && (
            <div className="flex min-h-64 flex-col items-center justify-center text-center">
              <Search
                size={22}
                className="text-slate-400"
              />

              <p className="mt-3 text-sm font-medium text-slate-700">
                No matching sales
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Try another invoice number, customer name, phone or payment method.
              </p>
            </div>
          )}

        {/* TABLE */}
        {!loading &&
          !error &&
          filteredSales.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr className="border-b text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-3">
                      Invoice
                    </th>

<th className="px-5 py-3">
  Customer
</th>

                    <th className="px-5 py-3">
                      Date
                    </th>

                    <th className="px-5 py-3">
                      Payment
                    </th>

                    <th className="px-5 py-3 text-right">
                      Discount
                    </th>

                    <th className="px-5 py-3 text-right">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {filteredSales.map((sale) => (
                    <tr
                      key={sale.id}
                      className="transition hover:bg-slate-50"
                    >
                     <td className="px-5 py-4">
  <Link
    href={`/sales/${sale.id}`}
    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-800 hover:underline"
  >
    <ReceiptText
      size={16}
      className="shrink-0"
    />

    {sale.invoice_number}
  </Link>
</td>

<td className="px-5 py-4">
  {sale.customer ? (
    <div>
      <p className="text-sm font-medium text-slate-800">
        {sale.customer.name}
      </p>

      <p className="mt-0.5 text-xs text-slate-400">
        {sale.customer.phone}
      </p>
    </div>
  ) : (
    <span className="text-sm text-slate-500">
      Walk-in Customer
    </span>
  )}
</td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                        {formatDate(sale.created_at)}
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                          {sale.payment_method}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right text-sm text-slate-600">
                        Rs.{" "}
                        {Number(
                          sale.discount
                        ).toLocaleString()}
                      </td>

                      <td className="px-5 py-4 text-right text-sm font-bold text-slate-900">
                        Rs.{" "}
                        {Number(
                          sale.total
                        ).toLocaleString()}
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