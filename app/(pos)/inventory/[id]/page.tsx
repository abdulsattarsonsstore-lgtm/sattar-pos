"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  Package,
  Barcode,
} from "lucide-react";

type Product = {
  id: number;
  product_name: string;
  category: string;
  brand: string | null;
  barcode: string | null;
  purchase_price: number;
  selling_price: number;
  stock: number;
  unit: string | null;
  low_stock: number;
  description: string | null;
  created_at: string | null;
};

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/products/${id}`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to load product."
          );
        }

        setProduct(data.product);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load product."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center text-sm text-slate-500">
        Loading product...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="space-y-4">
        <Link
          href="/inventory"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to Inventory
        </Link>

        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error || "Product not found."}
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;

  const isLowStock =
    product.stock > 0 &&
    product.stock <= product.low_stock;

  const stockStatus = isOutOfStock
    ? "Out of Stock"
    : isLowStock
      ? "Low Stock"
      : "In Stock";

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/inventory"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back to Inventory
          </Link>

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Package size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {product.product_name}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Product Details
              </p>
            </div>
          </div>
        </div>

        <Link
          href={`/inventory/${product.id}/edit`}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Pencil size={16} />
          Edit Product
        </Link>
      </div>

      {/* PRODUCT INFORMATION */}
      <section className="rounded-xl border bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h2 className="font-semibold text-slate-900">
            Product Information
          </h2>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <InfoItem
            label="Product Name"
            value={product.product_name}
          />

          <InfoItem
            label="Category"
            value={product.category}
          />

          <InfoItem
            label="Brand"
            value={product.brand || "—"}
          />

          <InfoItem
            label="Barcode"
            value={product.barcode || "—"}
            icon={
              product.barcode ? (
                <Barcode size={15} />
              ) : undefined
            }
          />
        </div>
      </section>

      {/* PRICING */}
      <section className="rounded-xl border bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h2 className="font-semibold text-slate-900">
            Pricing
          </h2>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2">
          <InfoItem
            label="Purchase Price"
            value={`Rs. ${Number(
              product.purchase_price
            ).toLocaleString()}`}
          />

          <InfoItem
            label="Selling Price"
            value={`Rs. ${Number(
              product.selling_price
            ).toLocaleString()}`}
          />
        </div>
      </section>

      {/* INVENTORY */}
      <section className="rounded-xl border bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h2 className="font-semibold text-slate-900">
            Inventory
          </h2>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-3">
          <InfoItem
            label="Current Stock"
            value={`${product.stock} ${
              product.unit || ""
            }`.trim()}
          />

          <InfoItem
            label="Low Stock Alert"
            value={`${product.low_stock} ${
              product.unit || ""
            }`.trim()}
          />

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Stock Status
            </p>

            <div className="mt-2">
              {isOutOfStock ? (
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
                  {stockStatus}
                </span>
              ) : isLowStock ? (
                <span className="inline-flex rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700">
                  {stockStatus}
                </span>
              ) : (
                <span className="inline-flex rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
                  {stockStatus}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* DESCRIPTION */}
      <section className="rounded-xl border bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h2 className="font-semibold text-slate-900">
            Additional Details
          </h2>
        </div>

        <div className="p-5">
          <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
            {product.description || "No description available."}
          </p>
        </div>
      </section>
    </div>
  );
}

function InfoItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <div className="mt-2 flex items-center gap-1.5 text-sm font-medium text-slate-900">
        {icon}
        <span>{value}</span>
      </div>
    </div>
  );
}