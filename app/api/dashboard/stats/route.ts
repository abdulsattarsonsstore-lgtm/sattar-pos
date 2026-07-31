import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // PRODUCT STATISTICS
    const { data: products, error: productsError } =
      await supabase
        .from("products")
.select(`
  id,
  product_name,
  stock,
  low_stock,
  unit
`);

    if (productsError) {
      console.error(
        "Dashboard products error:",
        productsError
      );

      return NextResponse.json(
        { error: productsError.message },
        { status: 500 }
      );
    }

    const totalProducts = products?.length ?? 0;

    const lowStockItems =
  products
    ?.filter(
      (product) =>
        Number(product.stock) <=
        Number(product.low_stock)
    )
    .sort(
      (a, b) =>
        Number(a.stock) - Number(b.stock)
    ) ?? [];

const lowStockProducts =
  lowStockItems.length;

    // PAKISTAN "TODAY" RANGE
    const now = new Date();

    const pakistanNow = new Date(
      now.toLocaleString("en-US", {
        timeZone: "Asia/Karachi",
      })
    );

    const year = pakistanNow.getFullYear();
    const month = pakistanNow.getMonth();
    const day = pakistanNow.getDate();

    // Pakistan is UTC+5.
    // Convert Pakistan midnight boundaries to UTC.
    const todayStart = new Date(
      Date.UTC(year, month, day, -5, 0, 0)
    );

    const tomorrowStart = new Date(
      Date.UTC(year, month, day + 1, -5, 0, 0)
    );

    // TODAY'S SALES
    const { data: todaySalesData, error: salesError } =
      await supabase
        .from("sales")
        .select(`
          id,
          total,
          discount
        `)
        .gte("created_at", todayStart.toISOString())
        .lt("created_at", tomorrowStart.toISOString());

    if (salesError) {
      console.error(
        "Dashboard sales error:",
        salesError
      );

      return NextResponse.json(
        {
          error:
            "Unable to load today's sales statistics.",
        },
        { status: 500 }
      );
    }

    const todaySales = (todaySalesData ?? []).reduce(
      (sum, sale) =>
        sum + Number(sale.total ?? 0),
      0
    );

    const todayDiscount = (
      todaySalesData ?? []
    ).reduce(
      (sum, sale) =>
        sum + Number(sale.discount ?? 0),
      0
    );

    // TODAY'S SALE ITEM COST / PROFIT
    const todaySaleIds = (todaySalesData ?? []).map(
      (sale) => sale.id
    );

    let todayCost = 0;

    if (todaySaleIds.length > 0) {
      const {
        data: saleItems,
        error: saleItemsError,
      } = await supabase
        .from("sale_items")
        .select(`
          sale_id,
          quantity,
          unit_cost
        `)
        .in("sale_id", todaySaleIds);

      if (saleItemsError) {
        console.error(
          "Dashboard sale items error:",
          saleItemsError
        );

        return NextResponse.json(
          {
            error:
              "Unable to calculate today's profit.",
          },
          { status: 500 }
        );
      }

      todayCost = (saleItems ?? []).reduce(
        (sum, item) =>
          sum +
          Number(item.unit_cost ?? 0) *
            Number(item.quantity ?? 0),
        0
      );
    }

    /*
      sales.total already has the invoice discount
      subtracted:

      total = subtotal - discount

      Therefore:

      profit = final sales revenue - historical cost

      We do NOT subtract todayDiscount again.
    */
    const todayProfit =
      todaySales - todayCost;

      // LAST 7 DAYS SALES OVERVIEW

// Start 6 days before today so the range contains:
// today + previous 6 days = 7 Pakistan calendar days
const overviewStart = new Date(
  Date.UTC(year, month, day - 6, -5, 0, 0)
);

const {
  data: overviewSales,
  error: overviewError,
} = await supabase
  .from("sales")
  .select(`
    total,
    created_at
  `)
  .gte(
    "created_at",
    overviewStart.toISOString()
  )
  .lt(
    "created_at",
    tomorrowStart.toISOString()
  )
  .order("created_at", {
    ascending: true,
  });

if (overviewError) {
  console.error(
    "Dashboard sales overview error:",
    overviewError
  );

  return NextResponse.json(
    {
      error:
        "Unable to load sales overview.",
    },
    { status: 500 }
  );
}

// Build all 7 Pakistan calendar days,
// including days where there were no sales.
const salesOverview = Array.from(
  { length: 7 },
  (_, index) => {
    const date = new Date(
      year,
      month,
      day - 6 + index
    );

    const dateKey = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(
        2,
        "0"
      ),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    return {
      date: dateKey,
      sales: 0,
    };
  }
);

for (const sale of overviewSales ?? []) {
  const saleDate = new Date(
    new Date(sale.created_at).toLocaleString(
      "en-US",
      {
        timeZone: "Asia/Karachi",
      }
    )
  );

  const saleDateKey = [
    saleDate.getFullYear(),
    String(
      saleDate.getMonth() + 1
    ).padStart(2, "0"),
    String(saleDate.getDate()).padStart(
      2,
      "0"
    ),
  ].join("-");

  const dayEntry = salesOverview.find(
    (entry) => entry.date === saleDateKey
  );

  if (dayEntry) {
    dayEntry.sales += Number(
      sale.total ?? 0
    );
  }
}

// RECENT SALES
const {
  data: recentSales,
  error: recentSalesError,
} = await supabase
  .from("sales")
  .select(`
    id,
    invoice_number,
    total,
    payment_method,
    created_at,
    customer:customers (
      id,
      name
    )
  `)
  .order("created_at", {
    ascending: false,
  })
  .limit(5);

if (recentSalesError) {
  console.error(
    "Dashboard recent sales error:",
    recentSalesError
  );

  return NextResponse.json(
    {
      error:
        "Unable to load recent sales.",
    },
    { status: 500 }
  );
}

    return NextResponse.json({
  totalProducts,
  lowStockProducts,
  todaySales,
  todayProfit,
  todayDiscount,
  salesOverview,
  recentSales: recentSales ?? [],
  lowStockItems,
});
  } catch (error) {
    console.error(
      "Dashboard statistics API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load dashboard statistics",
      },
      { status: 500 }
    );
  }
}