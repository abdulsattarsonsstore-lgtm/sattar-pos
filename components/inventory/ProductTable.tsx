'use client';

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import {
  Package,
  Search,
  SlidersHorizontal,
  X,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState("all");
  const [stockStatus, setStockStatus] = useState("all");

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch("/api/products");

        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        const data = await response.json();

        setProducts(data.products ?? []);
      } catch {
        setError("Unable to load inventory.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      )
    ).sort();
  }, [products]);

  const brands = useMemo(() => {
    return Array.from(
      new Set(
        products
          .map((product) => product.brand)
          .filter((brand): brand is string => Boolean(brand))
      )
    ).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        searchValue === "" ||
        product.product_name
          .toLowerCase()
          .includes(searchValue) ||
        product.category
          .toLowerCase()
          .includes(searchValue) ||
        (product.brand
          ?.toLowerCase()
          .includes(searchValue) ?? false) ||
        (product.barcode
          ?.toLowerCase()
          .includes(searchValue) ?? false);

      const matchesCategory =
        category === "all" ||
        product.category === category;

      const matchesBrand =
        brand === "all" ||
        product.brand === brand;

      const isOutOfStock = product.stock === 0;

      const isLowStock =
        product.stock > 0 &&
        product.stock <= product.low_stock;

      const isInStock =
        product.stock > product.low_stock;

      const matchesStock =
        stockStatus === "all" ||
        (stockStatus === "in-stock" && isInStock) ||
        (stockStatus === "low" && isLowStock) ||
        (stockStatus === "out-of-stock" && isOutOfStock);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesBrand &&
        matchesStock
      );
    });
  }, [
    products,
    search,
    category,
    brand,
    stockStatus,
  ]);

  const filtersActive =
    search !== "" ||
    category !== "all" ||
    brand !== "all" ||
    stockStatus !== "all";

  function clearFilters() {
    setSearch("");
    setCategory("all");
    setBrand("all");
    setStockStatus("all");
  }

  async function deleteProduct(product: Product) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.product_name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `/api/products/${product.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to delete product"
        );
      }

      setProducts((currentProducts) =>
        currentProducts.filter(
          (item) => item.id !== product.id
        )
      );
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Unable to delete product"
      );
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center text-sm text-slate-500">
        Loading inventory...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-12 text-center">
        <Package
          className="mx-auto text-slate-400"
          size={36}
        />

        <h3 className="mt-4 font-semibold text-slate-900">
          No products found
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Add your first product to start managing inventory.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* FILTERS */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <SlidersHorizontal size={17} />
          Inventory Filters
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {/* SEARCH */}
          <div className="relative xl:col-span-2">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search product, brand or barcode..."
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* CATEGORY */}
          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
            className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="all">
              All Categories
            </option>

            {categories.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>

          {/* BRAND */}
          <select
            value={brand}
            onChange={(event) =>
              setBrand(event.target.value)
            }
            className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="all">
              All Brands
            </option>

            {brands.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>

          {/* STOCK */}
          <select
            value={stockStatus}
            onChange={(event) =>
              setStockStatus(event.target.value)
            }
            className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="all">
              All Stock
            </option>

            <option value="in-stock">
              In Stock
            </option>

            <option value="low">
              Low Stock
            </option>

            <option value="out-of-stock">
              Out of Stock
            </option>
          </select>
        </div>

        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {filteredProducts.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-900">
              {products.length}
            </span>{" "}
            products
          </p>

          {filtersActive && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              <X size={16} />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* PRODUCT RESULTS */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
          <Search
            className="mx-auto text-slate-400"
            size={34}
          />

          <h3 className="mt-4 font-semibold text-slate-900">
            No matching products
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Try changing your search or filters.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-slate-50">
                <tr className="text-left text-slate-600">
                  <th className="px-4 py-3 font-medium">
                    Product
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Category
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Brand
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Selling Price
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Stock
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Status
                  </th>

                  <th className="px-4 py-3 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredProducts.map((product) => {
                  const isOutOfStock =
                    product.stock === 0;

                  const isLowStock =
                    product.stock > 0 &&
                    product.stock <= product.low_stock;

                  return (
                    <tr
                      key={product.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-4 py-4">
                        <div className="font-medium text-slate-900">
                          {product.product_name}
                        </div>

                        {product.barcode && (
                          <div className="mt-1 text-xs text-slate-400">
                            {product.barcode}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {product.category}
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {product.brand || "—"}
                      </td>

                      <td className="px-4 py-4 font-medium text-slate-900">
                        Rs.{" "}
                        {Number(
                          product.selling_price
                        ).toLocaleString()}
                      </td>

                      <td className="px-4 py-4 text-slate-700">
                        {product.stock}{" "}
                        {product.unit || ""}
                      </td>

                      <td className="px-4 py-4">
                        {isOutOfStock ? (
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                            Out of Stock
                          </span>
                        ) : isLowStock ? (
                          <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                            Low Stock
                          </span>
                        ) : (
                          <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                            In Stock
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
  href={`/inventory/${product.id}`}
  className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
>
  <Eye size={14} />
  View
</Link>
                          <Link
                            href={`/inventory/${product.id}/edit`}
                            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                          >
                            <Pencil size={14} />
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              deleteProduct(product)
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}