import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        product_name,
        category,
        brand,
        barcode,
        selling_price,
        stock,
        unit
      `)
      .order("product_name", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Billing products database error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Unable to load products for billing.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      products: data ?? [],
    });
  } catch (error) {
    console.error(
      "Billing products API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load products for billing.",
      },
      { status: 500 }
    );
  }
}