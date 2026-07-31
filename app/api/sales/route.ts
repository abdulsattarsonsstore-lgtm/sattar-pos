import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("sales")
      .select(`
        id,
        invoice_number,
        customer_id,
        subtotal,
        discount,
        total,
        payment_method,
        amount_paid,
        amount_received,
        change_due,
        notes,
        created_at,
        customer:customers (
        id,
        name,
        phone
)
      `)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Sales history database error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Unable to load sales history.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      sales: data ?? [],
    });
  } catch (error) {
    console.error(
      "Sales history API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load sales history.",
      },
      { status: 500 }
    );
  }
}