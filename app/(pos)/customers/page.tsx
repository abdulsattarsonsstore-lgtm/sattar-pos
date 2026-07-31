'use client';

import { useEffect, useState } from "react";
import {
  Loader2,
  Search,
  UserRound,
  Plus,
  Pencil,
  Archive,
} from "lucide-react";

type Customer = {
  id: number;
  name: string;
  phone: string | null;
  address: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

const [name, setName] = useState("");
const [phone, setPhone] = useState("");
const [address, setAddress] = useState("");

const [saving, setSaving] = useState(false);
const [formError, setFormError] = useState("");
const [editingCustomer, setEditingCustomer] =
  useState<Customer | null>(null);

const [editName, setEditName] = useState("");
const [editPhone, setEditPhone] = useState("");
const [editAddress, setEditAddress] = useState("");

const [editSaving, setEditSaving] = useState(false);
const [editError, setEditError] = useState("");

const [archivingId, setArchivingId] =
  useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCustomers() {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        if (search.trim()) {
          params.set("search", search.trim());
        }

        const url = params.toString()
          ? `/api/customers?${params.toString()}`
          : "/api/customers";

        const response = await fetch(url, {
          cache: "no-store",
          signal: controller.signal,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error || "Unable to load customers."
          );
        }

        setCustomers(result.customers ?? []);
      } catch (err) {
        if (
          err instanceof Error &&
          err.name === "AbortError"
        ) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load customers."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    const timer = setTimeout(loadCustomers, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
    }, [search]);

  async function handleAddCustomer(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setFormError("");

      const response = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          address,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to create customer."
        );
      }

      setName("");
      setPhone("");
      setAddress("");
      setShowAddForm(false);

      setCustomers((current) =>
        [...current, result.customer].sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      );
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Unable to create customer."
      );
    } finally {
      setSaving(false);
    }
  }

  function startEditing(customer: Customer) {
  setEditingCustomer(customer);
  setEditName(customer.name);
  setEditPhone(customer.phone ?? "");
  setEditAddress(customer.address ?? "");
  setEditError("");
}

async function handleUpdateCustomer() {
  if (!editingCustomer) {
    return;
  }

  const cleanName = editName.trim();
  const cleanPhone = editPhone.trim();

  if (!cleanName) {
    setEditError("Customer name is required.");
    return;
  }

  if (!cleanPhone) {
    setEditError("Customer phone is required.");
    return;
  }

  try {
    setEditSaving(true);
    setEditError("");

    const response = await fetch(
      `/api/customers/${editingCustomer.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: cleanName,
          phone: cleanPhone,
          address: editAddress,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.error || "Unable to update customer."
      );
    }

    setCustomers((current) =>
      current
        .map((customer) =>
          customer.id === result.customer.id
            ? result.customer
            : customer
        )
        .sort((a, b) =>
          a.name.localeCompare(b.name)
        )
    );

    setEditingCustomer(null);
  } catch (err) {
    setEditError(
      err instanceof Error
        ? err.message
        : "Unable to update customer."
    );
  } finally {
    setEditSaving(false);
  }
}

async function handleArchiveCustomer(
  customer: Customer
) {
  const confirmed = window.confirm(
    `Archive ${customer.name}? This customer will be hidden from the active customer list.`
  );

  if (!confirmed) {
    return;
  }

  try {
    setArchivingId(customer.id);

    const response = await fetch(
      `/api/customers/${customer.id}`,
      {
        method: "DELETE",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.error || "Unable to archive customer."
      );
    }

    setCustomers((current) =>
      current.filter(
        (item) => item.id !== customer.id
      )
    );

    if (editingCustomer?.id === customer.id) {
      setEditingCustomer(null);
    }
  } catch (err) {
    window.alert(
      err instanceof Error
        ? err.message
        : "Unable to archive customer."
    );
  } finally {
    setArchivingId(null);
  }
}

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
<div className="flex flex-wrap items-start justify-between gap-4">
  <div>
    <h1 className="text-2xl font-bold text-slate-900">
      Customers
    </h1>

    <p className="mt-1 text-sm text-slate-500">
      Manage your customers and their information.
    </p>
  </div>

  <button
    type="button"
    onClick={() => {
      setFormError("");
      setShowAddForm((current) => !current);
    }}
    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
  >
    <Plus size={17} />
    Add Customer
  </button>
</div>
{showAddForm && (
  <form
    onSubmit={handleAddCustomer}
    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
  >
    <h2 className="font-semibold text-slate-900">
      Add Customer
    </h2>

    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Customer Name *
        </label>

       <input
  type="text"
  value={name}
  required
  onChange={(event) => setName(event.target.value)}
  placeholder="Enter customer name"
  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
/>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
  Phone *
</label>

        <input
          type="text"
          value={phone}
          required
          onChange={(event) => setPhone(event.target.value)}
          placeholder="Enter phone number"
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="md:col-span-2">
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Address
        </label>

        <textarea
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="Enter customer address"
          rows={3}
          className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>
    </div>

    {formError && (
      <p className="mt-4 text-sm font-medium text-red-600">
        {formError}
      </p>
    )}

    <div className="mt-5 flex justify-end gap-3">
      <button
        type="button"
        disabled={saving}
        onClick={() => {
          setShowAddForm(false);
          setFormError("");
        }}
        className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving && (
          <Loader2 size={16} className="animate-spin" />
        )}

        {saving ? "Saving..." : "Save Customer"}
      </button>
    </div>
  </form>
)}

{/* EDIT CUSTOMER FORM */}
{editingCustomer && (
  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <h2 className="font-semibold text-slate-900">
      Edit Customer
    </h2>

    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Customer Name *
        </label>

        <input
          type="text"
          required
          value={editName}
          onChange={(event) =>
            setEditName(event.target.value)
          }
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Phone *
        </label>

        <input
          type="text"
          required
          value={editPhone}
          onChange={(event) =>
            setEditPhone(event.target.value)
          }
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="md:col-span-2">
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Address
        </label>

        <textarea
          rows={3}
          value={editAddress}
          onChange={(event) =>
            setEditAddress(event.target.value)
          }
          className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>
    </div>

    {editError && (
  <p className="mt-4 text-sm font-medium text-red-600">
    {editError}
  </p>
)}

    <div className="mt-5 flex justify-end gap-3">
      <button
        type="button"
        onClick={() => setEditingCustomer(null)}
        className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        Cancel
      </button>

      <button
  type="button"
  onClick={handleUpdateCustomer}
  disabled={editSaving}
  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
>
  {editSaving && (
    <Loader2 size={16} className="animate-spin" />
  )}

  {editSaving ? "Saving..." : "Save Changes"}
</button>
    </div>
  </div>
)}

      {/* SEARCH */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
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
            placeholder="Search by name or phone..."
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* CUSTOMER LIST */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-900">
            Customer List
          </h2>
        </div>

        {loading ? (
          <div className="flex min-h-48 items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2
                size={18}
                className="animate-spin"
              />
              Loading customers...
            </div>
          </div>
        ) : error ? (
          <div className="p-6 text-sm font-medium text-red-600">
            {error}
          </div>
        ) : customers.length === 0 ? (
          <div className="flex min-h-48 flex-col items-center justify-center p-6 text-center">
            <UserRound
              size={32}
              className="text-slate-300"
            />

            <p className="mt-3 font-medium text-slate-700">
              No customers found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {search
                ? "Try a different name or phone number."
                : "Customers you add will appear here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">
                    Customer
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Phone
                  </th>

                  <th className="px-5 py-3 font-semibold">
                    Address
                  </th>
                  <th className="px-5 py-3 text-right font-semibold">
  Actions
</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4 font-medium text-slate-900">
                      {customer.name}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {customer.phone || "—"}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {customer.address || "—"}
                    </td>
                    <td className="px-5 py-4">
  <div className="flex justify-end gap-2">
    <button
      type="button"
      onClick={() => startEditing(customer)}
      disabled={archivingId === customer.id}
      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
    >
      <Pencil size={15} />
      Edit
    </button>

    <button
      type="button"
      onClick={() =>
        handleArchiveCustomer(customer)
      }
      disabled={archivingId === customer.id}
      className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {archivingId === customer.id ? (
        <Loader2
          size={15}
          className="animate-spin"
        />
      ) : (
        <Archive size={15} />
      )}

      {archivingId === customer.id
        ? "Archiving..."
        : "Archive"}
    </button>
  </div>
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