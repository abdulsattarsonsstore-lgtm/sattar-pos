'use client';

import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  AlertTriangle,
} from "lucide-react";
import { Product } from "@/types/product";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const [product, setProduct] =
    useState<Product | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [purchasePrice, setPurchasePrice] =
    useState("");

  const [sellingPrice, setSellingPrice] =
    useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        const response = await fetch(
          `/api/products/${id}`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ||
              "Unable to load product"
          );
        }

        setProduct(result.product);

        // Fill controlled price fields
        setPurchasePrice(
          String(result.product.purchase_price)
        );

        setSellingPrice(
          String(result.product.selling_price)
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load product"
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadProduct();
    }
  }, [id]);

  const purchaseNumber = Number(purchasePrice);
  const sellingNumber = Number(sellingPrice);

  const showLossWarning =
    purchasePrice !== "" &&
    sellingPrice !== "" &&
    Number.isFinite(purchaseNumber) &&
    Number.isFinite(sellingNumber) &&
    sellingNumber < purchaseNumber;

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    // Prevent accidental double submission
    if (saving) {
      return;
    }

    setError("");

    const formData = new FormData(
      event.currentTarget
    );

    const productName = String(
      formData.get("product_name") ?? ""
    ).trim();

    const category = String(
      formData.get("category") ?? ""
    ).trim();

    const brand = String(
      formData.get("brand") ?? ""
    ).trim();

    const barcode = String(
      formData.get("barcode") ?? ""
    ).trim();

    const unit = String(
      formData.get("unit") ?? ""
    ).trim();

    const description = String(
      formData.get("description") ?? ""
    ).trim();

    const purchasePriceValue = Number(
      formData.get("purchase_price")
    );

    const sellingPriceValue = Number(
      formData.get("selling_price")
    );

    const stockValue = Number(
      formData.get("stock")
    );

    const lowStockValue = Number(
      formData.get("low_stock")
    );

    // Friendly client-side validation.
    // Server API remains authoritative.
    if (!productName) {
      setError("Product name is required.");
      return;
    }

    if (!category) {
      setError("Category is required.");
      return;
    }

    if (
      !Number.isFinite(purchasePriceValue) ||
      purchasePriceValue < 0
    ) {
      setError(
        "Purchase price must be a valid non-negative number."
      );
      return;
    }

    if (
      !Number.isFinite(sellingPriceValue) ||
      sellingPriceValue < 0
    ) {
      setError(
        "Selling price must be a valid non-negative number."
      );
      return;
    }

    if (
      !Number.isInteger(stockValue) ||
      stockValue < 0
    ) {
      setError(
        "Stock must be a non-negative whole number."
      );
      return;
    }

    if (
      !Number.isInteger(lowStockValue) ||
      lowStockValue < 0
    ) {
      setError(
        "Low stock alert must be a non-negative whole number."
      );
      return;
    }

    const updatedProduct = {
      product_name: productName,
      category,
      brand: brand || null,
      barcode: barcode || null,
      purchase_price: purchasePriceValue,
      selling_price: sellingPriceValue,
      stock: stockValue,
      unit: unit || null,
      low_stock: lowStockValue,
      description: description || null,
    };

    setSaving(true);

    try {
      const response = await fetch(
        `/api/products/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProduct),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Unable to update product."
        );
      }

      router.push("/inventory");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update product."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center text-sm text-slate-500">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="rounded-xl border bg-white p-8">
        <p className="text-sm text-red-600">
          {error || "Product not found."}
        </p>

        <Link
          href="/inventory"
          className="mt-4 inline-block text-sm font-medium text-blue-600"
        >
          Back to Inventory
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <Link
          href="/inventory"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to Inventory
        </Link>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
          Edit Product
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Update product information, pricing and
          stock. Fields marked with * are required.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border bg-white p-6 shadow-sm"
      >
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            label="Product Name"
            name="product_name"
            defaultValue={product.product_name}
            required
            maxLength={150}
            autoFocus
          />

          <FormField
            label="Category"
            name="category"
            defaultValue={product.category}
            required
            maxLength={100}
          />

          <FormField
            label="Brand"
            name="brand"
            defaultValue={product.brand ?? ""}
            maxLength={100}
            optional
          />

          <FormField
            label="Barcode"
            name="barcode"
            defaultValue={product.barcode ?? ""}
            maxLength={100}
            optional
            autoComplete="off"
            inputMode="text"
            helperText="Leave blank if this product has no barcode."
          />

          {/* PURCHASE PRICE */}
          <div>
            <label
              htmlFor="purchase_price"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Purchase Price
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <input
              id="purchase_price"
              name="purchase_price"
              type="number"
              value={purchasePrice}
              onChange={(event) =>
                setPurchasePrice(
                  event.target.value
                )
              }
              required
              min="0"
              step="0.01"
              inputMode="decimal"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <p className="mt-1.5 text-xs text-slate-400">
              Your cost price for one unit.
            </p>
          </div>

          {/* SELLING PRICE */}
          <div>
            <label
              htmlFor="selling_price"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Selling Price
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <input
              id="selling_price"
              name="selling_price"
              type="number"
              value={sellingPrice}
              onChange={(event) =>
                setSellingPrice(
                  event.target.value
                )
              }
              required
              min="0"
              step="0.01"
              inputMode="decimal"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <p className="mt-1.5 text-xs text-slate-400">
              Default price charged to the customer.
            </p>
          </div>

          {/* LOSS WARNING */}
          {showLossWarning && (
            <div className="md:col-span-2">
              <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                <AlertTriangle
                  size={18}
                  className="mt-0.5 shrink-0"
                />

                <div>
                  <p className="font-medium">
                    Selling price is below purchase
                    price.
                  </p>

                  <p className="mt-0.5 text-xs">
                    You can still save this change,
                    but sales at this price may result
                    in a loss.
                  </p>
                </div>
              </div>
            </div>
          )}

          <FormField
            label="Stock"
            name="stock"
            type="number"
            defaultValue={product.stock}
            min="0"
            step="1"
            required
            inputMode="numeric"
            helperText="Quantity currently available in the shop."
          />

          {/* UNIT */}
          <div>
            <label
              htmlFor="unit"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Unit
            </label>

            <select
              id="unit"
              name="unit"
              defaultValue={
                product.unit ?? "Piece"
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="Piece">
                Piece
              </option>

              <option value="Box">
                Box
              </option>

              <option value="Packet">
                Packet
              </option>

              <option value="Bag">
                Bag
              </option>

              <option value="Can">
                Can
              </option>

              <option value="Bucket">
                Bucket
              </option>

              <option value="Liter">
                Liter
              </option>

              <option value="Kilogram">
                Kilogram
              </option>

              <option value="Meter">
                Meter
              </option>
            </select>

            <p className="mt-1.5 text-xs text-slate-400">
              How this product is counted or sold.
            </p>
          </div>

          <FormField
            label="Low Stock Alert"
            name="low_stock"
            type="number"
            defaultValue={product.low_stock}
            min="0"
            step="1"
            required
            inputMode="numeric"
            helperText="Product becomes Low Stock at or below this quantity."
          />

          {/* DESCRIPTION */}
          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Description

              <span className="ml-2 text-xs font-normal text-slate-400">
                Optional
              </span>
            </label>

            <textarea
              id="description"
              name="description"
              rows={4}
              maxLength={1000}
              defaultValue={
                product.description ?? ""
              }
              placeholder="Optional product details..."
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3 border-t pt-6">
          <Link
            href="/inventory"
            className="rounded-lg border px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex min-w-36 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={17} />

            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

function FormField({
  label,
  name,
  type = "text",
  defaultValue,
  required = false,
  min,
  step,
  maxLength,
  optional = false,
  autoFocus = false,
  autoComplete,
  inputMode,
  helperText,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number;
  required?: boolean;
  min?: string;
  step?: string;
  maxLength?: number;
  optional?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  inputMode?:
    | "none"
    | "text"
    | "decimal"
    | "numeric"
    | "tel"
    | "search"
    | "email"
    | "url";
  helperText?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}

        {optional && (
          <span className="ml-2 text-xs font-normal text-slate-400">
            Optional
          </span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        min={min}
        step={step}
        maxLength={maxLength}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

      {helperText && (
        <p className="mt-1.5 text-xs text-slate-400">
          {helperText}
        </p>
      )}
    </div>
  );
}