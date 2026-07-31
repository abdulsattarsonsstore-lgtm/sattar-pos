import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const saleId = Number(id);

    if (
      !Number.isInteger(saleId) ||
      saleId <= 0
    ) {
      return NextResponse.json(
        {
          error: "Invalid sale ID.",
        },
        { status: 400 }
      );
    }

    // LOAD SALE
    const { data: sale, error: saleError } =
      await supabase
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
          created_at
        `)
        .eq("id", saleId)
        .single();

    if (saleError || !sale) {
      return NextResponse.json(
        {
          error: "Sale not found.",
        },
        { status: 404 }
      );
    }

// LOAD CUSTOMER
let customer = null;

if (sale.customer_id) {
  const {
    data: customerData,
    error: customerError,
  } = await supabase
    .from("customers")
    .select(`
      id,
      name,
      phone,
      address
    `)
    .eq("id", sale.customer_id)
    .maybeSingle();

  if (customerError) {
    console.error(
      "Invoice customer database error:",
      customerError
    );

    return NextResponse.json(
      {
        error:
          "Unable to load invoice customer.",
      },
      { status: 500 }
    );
  }

  customer = customerData;
}

    // LOAD SALE ITEMS
    const {
      data: saleItems,
      error: saleItemsError,
    } = await supabase
      .from("sale_items")
      .select(`
        id,
        sale_id,
        product_id,
        product_name,
        quantity,
        unit_price,
        line_total
      `)
      .eq("sale_id", saleId)
      .order("id", {
        ascending: true,
      });

    if (saleItemsError) {
      console.error(
        "Sale items database error:",
        saleItemsError
      );

      return NextResponse.json(
        {
          error:
            "Unable to load invoice items.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
  sale: {
    ...sale,
    customer,
    items: saleItems ?? [],
  },
});
  } catch (error) {
    console.error(
      "Single sale API error:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to load invoice.",
      },
      { status: 500 }
    );
  }
}