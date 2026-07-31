import DashboardCards from "@/components/dashboard/DashboardCards";
import SalesOverview from "@/components/dashboard/SalesOverview";
import RecentSales from "@/components/dashboard/RecentSales";
import LowStockProducts from "@/components/dashboard/LowStockProducts";
import Link from "next/link";
import {
  ShoppingCart,
  PackagePlus,
  UserPlus,
  ArrowRight,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Welcome back
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Here&apos;s what&apos;s happening at Abdul Sattar Sons today.
        </p>
      </section>

      <DashboardCards />

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-xl border bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Sales Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
  Sales performance over the last 7 days.
</p>
            </div>
          </div>

          <SalesOverview />
        </section>

        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Common shop operations
          </p>

          <div className="mt-5 space-y-3">
            <QuickAction
              href="/billing"
              icon={ShoppingCart}
              title="New Sale"
            />

            <QuickAction
              href="/inventory"
              icon={PackagePlus}
              title="Add Product"
            />

            <QuickAction
              href="/customers"
              icon={UserPlus}
              title="Add Customer"
            />
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border bg-white p-6 shadow-sm">
  <div>
    <h2 className="font-semibold text-slate-900">
      Recent Sales
    </h2>

    <p className="mt-1 text-sm text-slate-500">
      Latest completed transactions
    </p>
  </div>

  <RecentSales />
</section>
        <section className="rounded-xl border bg-white p-6 shadow-sm">
  <div>
    <h2 className="font-semibold text-slate-900">
      Low Stock Products
    </h2>

    <p className="mt-1 text-sm text-slate-500">
      Products requiring attention
    </p>
  </div>

  <LowStockProducts />
</section>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  title,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-lg border p-3 transition hover:bg-slate-50"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-md bg-blue-50 p-2 text-blue-600">
          <Icon size={18} />
        </div>

        <span className="text-sm font-medium text-slate-700">
          {title}
        </span>
      </div>

      <ArrowRight size={16} className="text-slate-400" />
    </Link>
  );
}