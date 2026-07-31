import ProductTable from "@/components/inventory/ProductTable";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Inventory
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage products, pricing and stock levels.
          </p>
        </div>

        <Link
          href="/inventory/add"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      <ProductTable />
    </div>
  );
}