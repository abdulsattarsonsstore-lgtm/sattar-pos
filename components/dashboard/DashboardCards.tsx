'use client';

import { useEffect, useState } from "react";
import {
  Banknote,
  TrendingUp,
  Package,
  TriangleAlert,
} from "lucide-react";

import StatCard from "./StatCard";

interface DashboardStats {
  totalProducts: number;
  lowStockProducts: number;
  todaySales: number;
  todayProfit: number;
}

export default function DashboardCards() {
  const [stats, setStats] = useState<DashboardStats>({
  totalProducts: 0,
  lowStockProducts: 0,
  todaySales: 0,
  todayProfit: 0,
});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch("/api/dashboard/stats");

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard statistics");
        }

        const data = await response.json();

        setStats({
  totalProducts: data.totalProducts ?? 0,
  lowStockProducts: data.lowStockProducts ?? 0,
  todaySales: data.todaySales ?? 0,
  todayProfit: data.todayProfit ?? 0,
});
      } catch (error) {
        console.error("Dashboard statistics error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Today's Sales"
        value={
  loading
    ? "..."
    : `Rs. ${Number(
        stats.todaySales
      ).toLocaleString()}`
}
        description="Sales recorded today"
        icon={Banknote}
        variant="blue"
      />

      <StatCard
        title="Today's Profit"
        value={
  loading
    ? "..."
    : `Rs. ${Number(
        stats.todayProfit
      ).toLocaleString()}`
}
        description="Estimated gross profit today"
        icon={TrendingUp}
        variant="green"
      />

      <StatCard
        title="Total Products"
        value={loading ? "..." : String(stats.totalProducts)}
        description="Products in inventory"
        icon={Package}
        variant="orange"
      />

      <StatCard
        title="Low Stock"
        value={loading ? "..." : String(stats.lowStockProducts)}
        description="Products requiring attention"
        icon={TriangleAlert}
        variant="red"
      />
    </div>
  );
}