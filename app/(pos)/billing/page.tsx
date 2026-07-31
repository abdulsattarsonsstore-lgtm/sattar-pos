'use client';

import { useEffect, useState } from "react";
import {
  Search,
  ShoppingCart,
  Package,
  Loader2,
  Minus,
  Plus,
  Trash2,
  CheckCircle2,
} from "lucide-react";

type BillingProduct = {
  id: number;
  product_name: string;
  category: string;
  brand: string | null;
  barcode: string | null;
  selling_price: number;
  stock: number;
  unit: string | null;
};

type CartItem = {
  product: BillingProduct;
  quantity: number;
};

type BillingCustomer = {
  id: number;
  name: string;
  phone: string;
  address: string | null;
};

type SaleResult = {
  success: boolean;
  sale_id: number;
  invoice_number: string;
  subtotal: number;
  discount: number;
  total: number;
  amount_paid: number;
  amount_received: number;
  change_due: number;
  payment_method: string;
};

export default function BillingPage() {
  const [products, setProducts] = useState<
    BillingProduct[]
  >([]);

  const [cart, setCart] = useState<CartItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

// CUSTOMER STATE
const [customers, setCustomers] = useState<
  BillingCustomer[]
>([]);

const [selectedCustomerId, setSelectedCustomerId] =
  useState<number | null>(null);

const [customerSearch, setCustomerSearch] =
  useState("");

const [customersLoading, setCustomersLoading] =
  useState(true);

const [customersError, setCustomersError] =
  useState("");

  const [showAddCustomer, setShowAddCustomer] =
  useState(false);

const [newCustomerName, setNewCustomerName] =
  useState("");

const [newCustomerPhone, setNewCustomerPhone] =
  useState("");

const [newCustomerAddress, setNewCustomerAddress] =
  useState("");

const [savingCustomer, setSavingCustomer] =
  useState(false);

const [addCustomerError, setAddCustomerError] =
  useState("");

  // PAYMENT STATE
  const [discount, setDiscount] = useState("0");
  const [amountReceived, setAmountReceived] =
    useState("");
  const [paymentMethod, setPaymentMethod] =
    useState("Cash");
  const [notes, setNotes] = useState("");
  // CHECKOUT STATE
const [submitting, setSubmitting] =
  useState(false);

const [checkoutError, setCheckoutError] =
  useState("");

const [completedSale, setCompletedSale] =
  useState<SaleResult | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setError("");

        const response = await fetch(
          "/api/products/billing"
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ||
              "Unable to load products."
          );
        }

        setProducts(result.products ?? []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load products."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

useEffect(() => {
  async function loadCustomers() {
    try {
      setCustomersError("");

      const response = await fetch(
        "/api/customers",
        {
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Unable to load customers."
        );
      }

      setCustomers(result.customers ?? []);
    } catch (err) {
      setCustomersError(
        err instanceof Error
          ? err.message
          : "Unable to load customers."
      );
    } finally {
      setCustomersLoading(false);
    }
  }

  loadCustomers();
}, []);

const normalizedCustomerSearch =
  customerSearch.trim().toLowerCase();

const filteredCustomers = customers.filter(
  (customer) => {
    if (!normalizedCustomerSearch) {
      return true;
    }

    return (
      customer.name
        .toLowerCase()
        .includes(normalizedCustomerSearch) ||
      customer.phone
        .toLowerCase()
        .includes(normalizedCustomerSearch)
    );
  }
);

const selectedCustomer =
  selectedCustomerId === null
    ? null
    : customers.find(
        (customer) =>
          customer.id === selectedCustomerId
      ) ?? null;

  const normalizedSearch = search
    .trim()
    .toLowerCase();

  const filteredProducts = products.filter(
    (product) => {
      if (!normalizedSearch) {
        return true;
      }

      return (
        product.product_name
          .toLowerCase()
          .includes(normalizedSearch) ||
        product.category
          .toLowerCase()
          .includes(normalizedSearch) ||
        (product.brand ?? "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        (product.barcode ?? "")
          .toLowerCase()
          .includes(normalizedSearch)
      );
    }
  );

  function addToCart(product: BillingProduct) {
    if (product.stock <= 0) {
      return;
    }

    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        if (
          existingItem.quantity >= product.stock
        ) {
          return currentCart;
        }

        return currentCart.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          product,
          quantity: 1,
        },
      ];
    });
  }

  function increaseQuantity(productId: number) {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (item.product.id !== productId) {
          return item;
        }

        if (
          item.quantity >= item.product.stock
        ) {
          return item;
        }

        return {
          ...item,
          quantity: item.quantity + 1,
        };
      })
    );
  }

  function decreaseQuantity(productId: number) {
    setCart((currentCart) =>
      currentCart
        .map((item) => {
          if (item.product.id !== productId) {
            return item;
          }

          return {
            ...item,
            quantity: item.quantity - 1,
          };
        })
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(productId: number) {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.product.id !== productId
      )
    );
  }

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.product.selling_price) *
        item.quantity,
    0
  );

  const cartQuantity = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // PAYMENT CALCULATIONS

  const discountValue = Number(discount) || 0;

  const validDiscount =
    discountValue >= 0 &&
    discountValue <= subtotal;

  const total = validDiscount
    ? subtotal - discountValue
    : subtotal;

  const amountReceivedValue =
    Number(amountReceived) || 0;

  const changeDue =
    amountReceivedValue >= total
      ? amountReceivedValue - total
      : 0;

  const remaining =
    amountReceivedValue < total
      ? total - amountReceivedValue
      : 0;

  const paymentReady =
    cart.length > 0 &&
    validDiscount &&
    amountReceived !== "" &&
    amountReceivedValue >= total;
    async function refreshProducts() {
  const response = await fetch(
    "/api/products/billing",
    {
      cache: "no-store",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error ||
        "Unable to refresh products."
    );
  }

  setProducts(result.products ?? []);
}

async function addCustomerAndSelect() {
  const cleanName = newCustomerName.trim();
  const cleanPhone = newCustomerPhone.trim();

  if (!cleanName) {
    setAddCustomerError(
      "Customer name is required."
    );
    return;
  }

  if (!cleanPhone) {
    setAddCustomerError(
      "Customer phone is required."
    );
    return;
  }

  try {
    setSavingCustomer(true);
    setAddCustomerError("");

    const response = await fetch(
      "/api/customers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: cleanName,
          phone: cleanPhone,
          address:
            newCustomerAddress.trim() || null,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.error ||
          "Unable to create customer."
      );
    }

    const customer =
      result.customer as BillingCustomer;

    setCustomers((current) =>
      [...current, customer].sort((a, b) =>
        a.name.localeCompare(b.name)
      )
    );

    // Automatically use new customer for this invoice
    setSelectedCustomerId(customer.id);

    // Close + clear quick-add form
    setShowAddCustomer(false);
    setNewCustomerName("");
    setNewCustomerPhone("");
    setNewCustomerAddress("");
    setCustomerSearch("");
  } catch (err) {
    setAddCustomerError(
      err instanceof Error
        ? err.message
        : "Unable to create customer."
    );
  } finally {
    setSavingCustomer(false);
  }
}

async function completeSale() {
  if (!paymentReady || submitting) {
    return;
  }

  setSubmitting(true);
  setCheckoutError("");
  setCompletedSale(null);

  try {
    const response = await fetch(
      "/api/sales/complete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
          })),
          discount: discountValue,
          payment_method: paymentMethod,
          amount_paid: amountReceivedValue,
          notes: notes.trim() || null,
          customer_id: selectedCustomerId,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.error ||
          "Unable to complete sale."
      );
    }

    const sale = result.sale as SaleResult;

    setCompletedSale(sale);

    // Clear completed transaction
    setCart([]);
    setDiscount("0");
    setAmountReceived("");
    setNotes("");
    setSearch("");
    setSelectedCustomerId(null);
    setCustomerSearch("");

    // Load fresh stock from database
    await refreshProducts();
  } catch (err) {
    setCheckoutError(
      err instanceof Error
        ? err.message
        : "Unable to complete sale."
    );
  } finally {
    setSubmitting(false);
  }
}

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Billing
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Create a new sale and generate an invoice.
        </p>
      </div>

{/* CUSTOMER */}
<div className="rounded-xl border bg-white p-4 shadow-sm">

  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
  <div>
    <h2 className="font-semibold text-slate-900">
      Customer
    </h2>

    <p className="mt-1 text-xs text-slate-500">
      Select a customer for this sale or continue as walk-in.
    </p>
  </div>

  <button
    type="button"
    onClick={() => {
      setShowAddCustomer((current) => !current);
      setAddCustomerError("");
    }}
    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
  >
    <Plus size={16} />
    Add New Customer
  </button>
</div>

{showAddCustomer && (
  <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50/50 p-4">
    <h3 className="text-sm font-semibold text-slate-900">
      Add New Customer
    </h3>

    <div className="mt-3 grid gap-3 md:grid-cols-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">
          Customer Name *
        </label>

        <input
          type="text"
          value={newCustomerName}
          onChange={(event) =>
            setNewCustomerName(event.target.value)
          }
          placeholder="Customer name"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">
          Phone *
        </label>

        <input
          type="text"
          value={newCustomerPhone}
          onChange={(event) =>
            setNewCustomerPhone(event.target.value)
          }
          placeholder="Phone number"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">
          Address
        </label>

        <input
          type="text"
          value={newCustomerAddress}
          onChange={(event) =>
            setNewCustomerAddress(event.target.value)
          }
          placeholder="Address (optional)"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>
    </div>

    {addCustomerError && (
      <p className="mt-3 text-xs font-medium text-red-600">
        {addCustomerError}
      </p>
    )}

    <div className="mt-3 flex justify-end gap-2">
      <button
        type="button"
        disabled={savingCustomer}
        onClick={() => {
          setShowAddCustomer(false);
          setAddCustomerError("");
        }}
        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={addCustomerAndSelect}
        disabled={savingCustomer}
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {savingCustomer && (
          <Loader2
            size={15}
            className="animate-spin"
          />
        )}

        {savingCustomer
          ? "Saving..."
          : "Save & Select"}
      </button>
    </div>
  </div>
)}

  <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
    {/* WALK-IN */}
    <button
      type="button"
      onClick={() => {
        setSelectedCustomerId(null);
        setCustomerSearch("");
      }}
      className={`h-[58px] rounded-lg border px-4 text-left text-sm transition ${
        selectedCustomerId === null
          ? "border-blue-500 bg-blue-50 text-blue-700"
          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      <p className="font-semibold">
        Walk-in Customer
      </p>

      <p className="mt-1 text-xs opacity-75">
        No customer account
      </p>
    </button>

    {/* CUSTOMER SEARCH */}
    <div>
      <div className="relative">
        <Search
          size={17}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          value={customerSearch}
          onChange={(event) =>
            setCustomerSearch(event.target.value)
          }
          placeholder="Search customer by name or phone..."
          className="h-[58px] w-full rounded-lg border border-slate-300 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {customersLoading ? (
        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
          <Loader2
            size={14}
            className="animate-spin"
          />
          Loading customers...
        </div>
      ) : customersError ? (
        <p className="mt-2 text-xs font-medium text-red-600">
          {customersError}
        </p>
      ) : customerSearch.trim() &&
        filteredCustomers.length === 0 ? (
        <p className="mt-2 text-xs text-slate-500">
          No matching customers found.
        </p>
      ) : customerSearch.trim() ? (
        <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-white">
          {filteredCustomers.map((customer) => (
            <button
              key={customer.id}
              type="button"
              onClick={() => {
                setSelectedCustomerId(customer.id);
                setCustomerSearch("");
              }}
              className="block w-full border-b border-slate-100 px-3 py-2.5 text-left last:border-b-0 hover:bg-slate-50"
            >
              <p className="text-sm font-medium text-slate-900">
                {customer.name}
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                {customer.phone}
              </p>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  </div>

  {/* SELECTED CUSTOMER */}
  {selectedCustomer && (
    <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-emerald-800">
            {selectedCustomer.name}
          </p>

          <p className="mt-1 text-xs text-emerald-700">
            {selectedCustomer.phone}
          </p>

          {selectedCustomer.address && (
            <p className="mt-1 text-xs text-emerald-700">
              {selectedCustomer.address}
            </p>
          )}
        </div>

        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
          Selected
        </span>
      </div>
    </div>
  )}
</div>

      {/* SEARCH */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="relative">
          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            autoFocus
            autoComplete="off"
            placeholder="Search product name, brand or scan barcode..."
            className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

      </div>

      {/* MAIN POS AREA */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        {/* PRODUCTS */}
        <section className="min-w-0 rounded-xl border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <div>
              <h2 className="font-semibold text-slate-900">
                Products
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Select products to add them to the
                current sale.
              </p>
            </div>

            {!loading && !error && (
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {filteredProducts.length} products
              </span>
            )}
          </div>

          <div className="p-4">
            {loading && (
              <div className="flex min-h-64 items-center justify-center">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Loading products...
                </div>
              </div>
            )}

            {!loading && error && (
              <div className="flex min-h-64 items-center justify-center">
                <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-4 text-center">
                  <p className="text-sm font-medium text-red-700">
                    Unable to load products
                  </p>

                  <p className="mt-1 text-xs text-red-600">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {!loading &&
              !error &&
              products.length === 0 && (
                <div className="flex min-h-64 flex-col items-center justify-center text-center">
                  <div className="rounded-full bg-slate-100 p-3">
                    <Package
                      size={22}
                      className="text-slate-400"
                    />
                  </div>

                  <p className="mt-3 text-sm font-medium text-slate-700">
                    No products available
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Add products from Inventory before
                    creating a sale.
                  </p>
                </div>
              )}

            {!loading &&
              !error &&
              products.length > 0 &&
              filteredProducts.length === 0 && (
                <div className="flex min-h-64 flex-col items-center justify-center text-center">
                  <div className="rounded-full bg-slate-100 p-3">
                    <Search
                      size={22}
                      className="text-slate-400"
                    />
                  </div>

                  <p className="mt-3 text-sm font-medium text-slate-700">
                    No matching products
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Try another product name, brand,
                    category or barcode.
                  </p>
                </div>
              )}

            {!loading &&
              !error &&
              filteredProducts.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map(
                    (product) => {
                      const outOfStock =
                        product.stock <= 0;

                      const cartItem = cart.find(
                        (item) =>
                          item.product.id ===
                          product.id
                      );

                      const stockLimitReached =
                        cartItem
                          ? cartItem.quantity >=
                            product.stock
                          : false;

                      return (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() =>
                            addToCart(product)
                          }
                          disabled={
                            outOfStock ||
                            stockLimitReached
                          }
                          className="group rounded-xl border p-4 text-left transition hover:border-blue-300 hover:bg-blue-50/40 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-900">
                                {
                                  product.product_name
                                }
                              </p>

                              <p className="mt-1 truncate text-xs text-slate-500">
                                {product.brand ||
                                  product.category}
                              </p>
                            </div>

                            <Package
                              size={18}
                              className="shrink-0 text-slate-400 transition group-hover:text-blue-500"
                            />
                          </div>

                          <div className="mt-4 flex items-end justify-between gap-3">
                            <div>
                              <p className="text-base font-bold text-slate-900">
                                Rs.{" "}
                                {Number(
                                  product.selling_price
                                ).toLocaleString()}
                              </p>

                              {product.barcode && (
                                <p className="mt-1 max-w-32 truncate text-[11px] text-slate-400">
                                  {
                                    product.barcode
                                  }
                                </p>
                              )}
                            </div>

                            <div className="text-right">
                              <p
                                className={`text-xs font-medium ${
                                  outOfStock
                                    ? "text-red-600"
                                    : "text-emerald-600"
                                }`}
                              >
                                {outOfStock
                                  ? "Out of stock"
                                  : `${
                                      product.stock
                                    } ${
                                      product.unit ||
                                      "Piece"
                                    }`}
                              </p>

                              {cartItem && (
                                <p className="mt-1 text-[11px] font-medium text-blue-600">
                                  {cartItem.quantity} in
                                  cart
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    }
                  )}
                </div>
              )}
          </div>
        </section>

        {/* CART */}
        <aside className="h-fit rounded-xl border bg-white shadow-sm xl:sticky xl:top-6">
          <div className="flex items-start justify-between border-b px-5 py-4">
            <div>
              <div className="flex items-center gap-2">
                <ShoppingCart
                  size={19}
                  className="text-slate-500"
                />

                <h2 className="font-semibold text-slate-900">
                  Current Cart
                </h2>
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Products added to the current sale.
              </p>
            </div>

            {cartQuantity > 0 && (
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                {cartQuantity}{" "}
                {cartQuantity === 1
                  ? "item"
                  : "items"}
              </span>
            )}
          </div>

          {/* EMPTY CART */}
          {cart.length === 0 && (
            <div className="flex min-h-52 flex-col items-center justify-center border-b p-6 text-center">
              <div className="rounded-full bg-slate-100 p-3">
                <ShoppingCart
                  size={22}
                  className="text-slate-400"
                />
              </div>

              <p className="mt-3 text-sm font-medium text-slate-700">
                Cart is empty
              </p>

              <p className="mt-1 max-w-56 text-xs leading-5 text-slate-400">
                Select a product from the left to begin
                creating a sale.
              </p>
            </div>
          )}

          {/* CART ITEMS */}
          {cart.length > 0 && (
            <div className="max-h-[420px] divide-y overflow-y-auto border-b">
              {cart.map((item) => {
                const lineTotal =
                  Number(
                    item.product.selling_price
                  ) * item.quantity;

                const maxQuantityReached =
                  item.quantity >=
                  item.product.stock;

                return (
                  <div
                    key={item.product.id}
                    className="p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {item.product.product_name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Rs.{" "}
                          {Number(
                            item.product
                              .selling_price
                          ).toLocaleString()}{" "}
                          × {item.quantity}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(
                            item.product.id
                          )
                        }
                        className="rounded-md p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        title="Remove product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex items-center rounded-lg border">
                        <button
                          type="button"
                          onClick={() =>
                            decreaseQuantity(
                              item.product.id
                            )
                          }
                          className="flex h-8 w-8 items-center justify-center text-slate-600 transition hover:bg-slate-50"
                        >
                          <Minus size={14} />
                        </button>

                        <span className="min-w-9 text-center text-sm font-semibold text-slate-900">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            increaseQuantity(
                              item.product.id
                            )
                          }
                          disabled={
                            maxQuantityReached
                          }
                          className="flex h-8 w-8 items-center justify-center text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">
                          Rs.{" "}
                          {lineTotal.toLocaleString()}
                        </p>

                        <p className="mt-0.5 text-[11px] text-slate-400">
                          Stock: {item.product.stock}{" "}
                          {item.product.unit ||
                            "Piece"}
                        </p>
                      </div>
                    </div>

                    {maxQuantityReached && (
                      <p className="mt-2 text-[11px] font-medium text-amber-600">
                        Maximum available stock reached.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

{/* SALE SUCCESS */}
{completedSale && (
  <div className="border-b border-emerald-200 bg-emerald-50 p-5">
    <div className="flex items-start gap-3">
      <CheckCircle2
        size={22}
        className="mt-0.5 shrink-0 text-emerald-600"
      />

      <div className="min-w-0 flex-1">
        <p className="font-semibold text-emerald-800">
          Sale completed successfully
        </p>

        <p className="mt-1 text-xs text-emerald-700">
          Invoice: {completedSale.invoice_number}
        </p>

        <div className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-emerald-700">
              Total
            </span>

            <span className="font-semibold text-emerald-900">
              Rs.{" "}
              {Number(
                completedSale.total
              ).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-emerald-700">
              Cash Received
            </span>

            <span className="font-semibold text-emerald-900">
              Rs.{" "}
              {Number(
                completedSale.amount_received
              ).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-emerald-700">
              Change Due
            </span>

            <span className="font-semibold text-emerald-900">
              Rs.{" "}
              {Number(
                completedSale.change_due
              ).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

{/* CHECKOUT ERROR */}
{checkoutError && (
  <div className="border-b border-red-200 bg-red-50 p-4">
    <p className="text-sm font-medium text-red-700">
      {checkoutError}
    </p>
  </div>
)}
          {/* CHECKOUT */}
          <div className="space-y-4 p-5">

            {/* SUBTOTAL */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">
                Subtotal
              </span>

              <span className="font-medium text-slate-900">
                Rs. {subtotal.toLocaleString()}
              </span>
            </div>

            {/* DISCOUNT */}
            <div>
              <label
                htmlFor="discount"
                className="mb-1.5 block text-xs font-medium text-slate-600"
              >
                Discount
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  Rs.
                </span>

                <input
                  id="discount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={discount}
                  onChange={(event) =>
                    setDiscount(
                      event.target.value
                    )
                  }
                  disabled={cart.length === 0}
                  className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                />
              </div>

              {!validDiscount && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  Discount cannot be greater than
                  subtotal or less than zero.
                </p>
              )}
            </div>

            {/* TOTAL */}
            <div className="border-y py-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">
                  Total
                </span>

                <span className="text-xl font-bold text-slate-900">
                  Rs. {total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* PAYMENT METHOD */}
            <div>
              <label
                htmlFor="payment_method"
                className="mb-1.5 block text-xs font-medium text-slate-600"
              >
                Payment Method
              </label>

              <select
                id="payment_method"
                value={paymentMethod}
                onChange={(event) =>
                  setPaymentMethod(
                    event.target.value
                  )
                }
                disabled={cart.length === 0}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
              >
                <option value="Cash">Cash</option>
              </select>
            </div>

            {/* CASH RECEIVED */}
            <div>
              <label
                htmlFor="amount_received"
                className="mb-1.5 block text-xs font-medium text-slate-600"
              >
                Cash Received
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  Rs.
                </span>

                <input
                  id="amount_received"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amountReceived}
                  onChange={(event) =>
                    setAmountReceived(
                      event.target.value
                    )
                  }
                  disabled={cart.length === 0}
                  placeholder="0"
                  className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                />
              </div>
            </div>

            {/* PAYMENT STATUS */}
            {cart.length > 0 &&
              amountReceived !== "" && (
                <div
                  className={`rounded-lg border p-3 ${
                    amountReceivedValue >= total
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-amber-200 bg-amber-50"
                  }`}
                >
                  {amountReceivedValue >= total ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-emerald-700">
                        Change Due
                      </span>

                      <span className="font-bold text-emerald-700">
                        Rs.{" "}
                        {changeDue.toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-amber-700">
                        Remaining
                      </span>

                      <span className="font-bold text-amber-700">
                        Rs.{" "}
                        {remaining.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              )}

            {/* NOTES */}
            <div>
              <label
                htmlFor="notes"
                className="mb-1.5 block text-xs font-medium text-slate-600"
              >
                Notes
              </label>

              <textarea
                id="notes"
                rows={2}
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                disabled={cart.length === 0}
                placeholder="Optional sale notes..."
                className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
              />
            </div>

            {/* COMPLETE SALE */}
<button
  type="button"
  onClick={completeSale}
  disabled={!paymentReady || submitting}
  className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
>
  {submitting
    ? "Completing Sale..."
    : "Complete Sale"}
</button>

{paymentReady && !submitting && (
  <p className="text-center text-[11px] text-slate-400">
    Ready to create the sale and deduct stock.
  </p>
)}
          </div>
        </aside>
      </div>
    </div>
  );
}