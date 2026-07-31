'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Printer,
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

export default function ReceiptPage() {
  const params = useParams();
  const id = params.id as string;

  const [sale, setSale] = useState<Sale | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paperSize, setPaperSize] =
  useState<"58mm" | "80mm">("80mm");

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
              "Unable to load receipt."
          );
        }

        setSale(result.sale);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load receipt."
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
      <div className="flex min-h-64 items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2
            size={18}
            className="animate-spin"
          />

          Loading receipt...
        </div>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="mx-auto max-w-md rounded-xl border bg-white p-6">
        <p className="text-sm font-medium text-red-600">
          {error || "Receipt not found."}
        </p>

        <Link
          href="/sales"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600"
        >
          <ArrowLeft size={16} />
          Back to Sales
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
     {/* SCREEN ACTIONS */}
<div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
  <Link
    href={`/sales/${sale.id}`}
    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
  >
    <ArrowLeft size={16} />
    Back to Invoice
  </Link>

  <div className="flex flex-wrap items-center gap-3">
    {/* PAPER SIZE SELECTOR */}
    <div className="flex rounded-lg border border-slate-300 bg-white p-1">
      <button
        type="button"
        onClick={() => setPaperSize("58mm")}
        className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
          paperSize === "58mm"
            ? "bg-slate-900 text-white"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        58 mm
      </button>

      <button
        type="button"
        onClick={() => setPaperSize("80mm")}
        className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
          paperSize === "80mm"
            ? "bg-slate-900 text-white"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        80 mm
      </button>
    </div>

    {/* PRINT */}
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
    >
      <Printer size={17} />
      Print {paperSize} Receipt
    </button>
  </div>
</div>

      {/* THERMAL RECEIPT */}
<div
  className={`mx-auto max-w-full bg-white font-mono leading-[1.2] text-black shadow-sm print:max-w-none print:shadow-none ${
    paperSize === "58mm"
      ? "w-[58mm] px-[3mm] py-[4mm] text-[9px] print:w-[58mm] print:p-[2mm]"
      : "w-[80mm] px-[4mm] py-[5mm] text-[11px] print:w-[80mm] print:p-[3mm]"
  }`}
>
       {/* SHOP */}
<div className="text-center">
  <h1 className="text-[17px] font-bold leading-tight">
    ABDUL SATTAR SONS
  </h1>


  <p className="mt-2 text-[9px] leading-snug">
    Kanjwani Road Adda Zafar Chowk,
    <br />
    Near Farman e Iqra School
  </p>

  <p className="mt-1 whitespace-nowrap text-[9px]">
    +92 300 4746664 | +92 325 0054484
  </p>

</div>

        <div className="my-2 border-t border-dashed border-black" />

        {/* SALE INFO */}
        <div className="space-y-1">
          <div className="flex justify-between gap-3">
            <span>Invoice:</span>

            <span className="text-right font-bold">
              {sale.invoice_number}
            </span>
          </div>

          <div className="flex justify-between gap-3">
            <span>Date:</span>

            <span className="text-right">
              {formatDate(sale.created_at)}
            </span>
          </div>

          <div className="flex justify-between gap-3">
            <span>Payment:</span>

            <span className="text-right">
              {sale.payment_method}
            </span>
          </div>
               </div>

        <div className="my-2 border-t border-dashed border-black" />

        {/* CUSTOMER */}
        <div className="space-y-1">
          {sale.customer ? (
            <>
              <div className="flex gap-2">
                <span className="shrink-0">
                  Customer:
                </span>

                <span className="font-bold">
                  {sale.customer.name}
                </span>
              </div>

              <div className="flex gap-2">
                <span className="shrink-0">
                  Phone:
                </span>

                <span>
                  {sale.customer.phone}
                </span>
              </div>

              {sale.customer.address && (
                <div className="flex items-start gap-2">
                  <span className="shrink-0">
                    Address:
                  </span>

                  <span className="break-words">
                    {sale.customer.address}
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="flex gap-2">
              <span>Customer:</span>

              <span className="font-bold">
                Walk-in Customer
              </span>
            </div>
          )}
        </div>

        <div className="my-2 border-t border-dashed border-black" />

        {/* ITEMS HEADER */}
        <div className="grid grid-cols-[1fr_auto] gap-3 font-bold">
          <span>ITEM</span>
          <span>AMOUNT</span>
        </div>

        <div className="my-1 border-t border-dashed border-black" />

        {/* ITEMS */}
<div className="space-y-1">
          {sale.items.map((item) => (
            <div
              key={item.id}
              className="break-inside-avoid"
            >
              <div className="grid grid-cols-[1fr_auto] gap-3">
                <span className="font-semibold">
                  {item.product_name}
                </span>

                <span className="whitespace-nowrap font-semibold">
                  {Number(
                    item.line_total
                  ).toLocaleString()}
                </span>
              </div>

              <div className="mt-0 text-[10px]">
                {item.quantity} x Rs.{" "}
                {Number(
                  item.unit_price
                ).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <div className="my-3 border-t border-dashed border-black" />

        {/* TOTALS */}
        <div className="space-y-1">
          <div className="flex justify-between gap-4">
            <span>Subtotal</span>

            <span>
              Rs.{" "}
              {Number(
                sale.subtotal
              ).toLocaleString()}
            </span>
          </div>

          {Number(sale.discount) > 0 && (
            <div className="flex justify-between gap-4">
              <span>Discount</span>

              <span>
                - Rs.{" "}
                {Number(
                  sale.discount
                ).toLocaleString()}
              </span>
            </div>
          )}

          <div className="my-2 border-t border-black" />

          <div className="flex justify-between gap-4 text-[14px] font-bold">
            <span>TOTAL</span>

            <span>
              Rs.{" "}
              {Number(
                sale.total
              ).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="my-2 border-t border-dashed border-black" />

        {/* PAYMENT */}
        <div className="space-y-1">
          <div className="flex justify-between gap-4">
            <span>Amount Paid</span>

            <span>
              Rs.{" "}
              {Number(
                sale.amount_paid
              ).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span>Cash Received</span>

            <span>
              Rs.{" "}
              {Number(
                sale.amount_received
              ).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span>Change</span>

            <span>
              Rs.{" "}
              {Number(
                sale.change_due
              ).toLocaleString()}
            </span>
          </div>
        </div>

        {sale.notes && (
          <>
            <div className="my-2 border-t border-dashed border-black" />

            <div>
              <p className="font-bold">
                Notes
              </p>

              <p className="mt-1 whitespace-pre-wrap break-words">
                {sale.notes}
              </p>
            </div>
          </>
        )}

        <div className="my-2 border-t border-dashed border-black" />

        {/* FOOTER */}
        <div className="text-center">
          <p className="font-bold">
            Thank You!
          </p>

          <p className="mt-1 text-[9px]">
            Please keep this receipt for your
            record.
          </p>
        </div>
            </div>

      <style jsx global>{`
        @media print {
          @page {
            size: ${paperSize === "58mm" ? "58mm" : "80mm"} auto;
            margin: 0;
          }

          html,
          body {
            width: ${paperSize === "58mm" ? "58mm" : "80mm"};
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          body {
            min-height: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}