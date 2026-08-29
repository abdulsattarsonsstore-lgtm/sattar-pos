import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const pageParam = Number(searchParams.get("page") ?? "1");
    const limitParam = Number(
      searchParams.get("limit") ?? String(DEFAULT_LIMIT)
    );

    const search = searchParams.get("search")?.trim() ?? "";
    const category = searchParams.get("category")?.trim() ?? "";
    const brand = searchParams.get("brand")?.trim() ?? "";
    const stockStatus =
      searchParams.get("stockStatus")?.trim() ?? "all";

    const page =
      Number.isInteger(pageParam) && pageParam > 0
        ? pageParam
        : 1;

    const limit =
      Number.isInteger(limitParam) && limitParam > 0
        ? Math.min(limitParam, MAX_LIMIT)
        : DEFAULT_LIMIT;

    const { data, error } = await supabase.rpc(
      "get_products",
      {
        p_page: page,
        p_limit: limit,
        p_search: search,
        p_category: category,
        p_brand: brand,
        p_stock_status: stockStatus,
      }
    );

    if (error) {
      console.error("Products API database error:", error);

      return NextResponse.json(
        {
          error: "Failed to load products.",
        },
        { status: 500 }
      );
    }

    const products = data ?? [];

    const total = Number(
      products[0]?.total_count ?? 0
    );

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages:
          total === 0
            ? 0
            : Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Products API error:", error);

    return NextResponse.json(
      {
        error: "Failed to load products.",
      },
      { status: 500 }
    );
  }
}