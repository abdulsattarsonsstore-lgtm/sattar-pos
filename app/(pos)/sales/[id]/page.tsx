'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  ReceiptText,
  Printer,
  ScrollText,
} from "lucide-react";

type SaleItem = {
  id: number;
  sale_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
};

type SaleCustomer = {
  id: number;
  name: string;
  phone: string;
  address: string | null;
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
  items: SaleItem[];
};

export default function InvoicePage() {
  const params = useParams();
  const id = params.id as string;

  const [sale, setSale] = useState<Sale | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSale() {
      try {
        setError("");

        const response = await fetch(
          `/api/sales/${id}`,
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ||
              "Unable to load invoice."
          );
        }

        setSale(result.sale);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load invoice."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadSale();
    }
  }, [id]);

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-PK", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  }

  if (loading) {
    return (
      <div className="flex min-h-72 items-center justify-center rounded-xl border bg-white">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2
            size={18}
            className="animate-spin"
          />

          Loading invoice...
        </div>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="rounded-xl border bg-white p-8">
        <p className="text-sm font-medium text-red-600">
          {error || "Invoice not found."}
        </p>

        <Link
          href="/sales"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Sales
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
     {/* TOP ACTIONS */}
<div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
  <Link
    href="/sales"
    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
  >
    <ArrowLeft size={16} />
    Back to Sales
  </Link>

  <div className="flex items-center gap-3">
    <Link
      href={`/sales/${sale.id}/receipt`}
      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
    >
      <ScrollText size={17} />
      Thermal Receipt
    </Link>

    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
    >
      <Printer size={17} />
      Print Invoice
    </button>
  </div>
</div>

      {/* INVOICE */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        {/* INVOICE HEADER */}
        <div className="border-b p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ReceiptText
                  size={22}
                  className="text-blue-600"
                />

                <h1 className="text-2xl font-bold text-slate-900">
                  Invoice
                </h1>
              </div>

              <p className="mt-3 text-lg font-semibold text-slate-900">
                Abdul Sattar Sons
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Point of Sale Invoice
              </p>
            </div>

            <div className="sm:text-right">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Invoice Number
              </p>

              <p className="mt-1 font-bold text-slate-900">
                {sale.invoice_number}
              </p>

              <p className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-400">
                Date
              </p>

              <p className="mt-1 text-sm text-slate-700">
                {formatDate(sale.created_at)}
              </p>
            </div>
          </div>
        </div>

{/* CUSTOMER DETAILS */}
<div className="border-b bg-slate-50/50 px-6 py-4 sm:px-8">
  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
    Customer
  </p>

  {sale.customer ? (
    <div className="mt-2 grid gap-3 sm:grid-cols-3">
      <div>
        <p className="text-xs text-slate-400">
          Name
        </p>

        <p className="mt-1 text-sm font-semibold text-slate-800">
          {sale.customer.name}
        </p>
      </div>

      <div>
        <p className="text-xs text-slate-400">
          Phone
        </p>

        <p className="mt-1 text-sm font-semibold text-slate-800">
          {sale.customer.phone}
        </p>
      </div>

      <div>
        <p className="text-xs text-slate-400">
          Address
        </p>

        <p className="mt-1 text-sm font-semibold text-slate-800">
          {sale.customer.address || "—"}
        </p>
      </div>
    </div>
  ) : (
    <p className="mt-2 text-sm font-semibold text-slate-800">
      Walk-in Customer
    </p>
  )}
</div>

        {/* ITEMS */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-6 py-3">
                  Product
                </th>

                <th className="px-6 py-3 text-center">
                  Qty
                </th>

                <th className="px-6 py-3 text-right">
                  Price
                </th>

                <th className="px-6 py-3 text-right">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {sale.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-900">
                      {item.product_name}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-center text-sm text-slate-600">
                    {item.quantity}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-slate-600">
                    Rs.{" "}
                    {Number(
                      item.unit_price
                    ).toLocaleString()}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-semibold text-slate-900">
                    Rs.{" "}
                    {Number(
                      item.line_total
                    ).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TOTALS */}
        <div className="border-t p-6 sm:p-8">
          <div className="ml-auto max-w-sm space-y-3">
            <div className="flex justify-between gap-6 text-sm">
              <span className="text-slate-500">
                Subtotal
              </span>

              <span className="font-medium text-slate-900">
                Rs.{" "}
                {Number(
                  sale.subtotal
                ).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between gap-6 text-sm">
              <span className="text-slate-500">
                Discount
              </span>

              <span className="font-medium text-slate-900">
                Rs.{" "}
                {Number(
                  sale.discount
                ).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between gap-6 border-t pt-3">
              <span className="font-semibold text-slate-900">
                Total
              </span>

              <span className="text-xl font-bold text-slate-900">
                Rs.{" "}
                {Number(
                  sale.total
                ).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* PAYMENT DETAILS */}
        <div className="border-t bg-slate-50 p-6 sm:p-8">
          <h2 className="font-semibold text-slate-900">
            Payment Details
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Payment Method
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {sale.payment_method}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Amount Paid
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                Rs.{" "}
                {Number(
                  sale.amount_paid
                ).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Cash Received
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                Rs.{" "}
                {Number(
                  sale.amount_received
                ).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Change Due
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                Rs.{" "}
                {Number(
                  sale.change_due
                ).toLocaleString()}
              </p>
            </div>
          </div>

          {sale.notes && (
            <div className="mt-6 border-t pt-5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Notes
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                {sale.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}