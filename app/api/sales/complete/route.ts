import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type SaleItem = {
  product_id: number;
  quantity: number;
};

type CompleteSaleBody = {
  items?: SaleItem[];
  discount?: number;
  payment_method?: string;
  amount_paid?: number | null;
  notes?: string | null;
  customer_id?: number | null;
};

export async function POST(request: Request) {
  try {
    const body: CompleteSaleBody =
      await request.json();

    const items = body.items;

    // CART VALIDATION
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart cannot be empty." },
        { status: 400 }
      );
    }

    for (const item of items) {
      if (
        !Number.isInteger(item.product_id) ||
        item.product_id <= 0
      ) {
        return NextResponse.json(
          { error: "Invalid product ID." },
          { status: 400 }
        );
      }

      if (
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
      ) {
        return NextResponse.json(
          {
            error:
              "Quantity must be a positive whole number.",
          },
          { status: 400 }
        );
      }
    }

    // DISCOUNT VALIDATION
    const discount = Number(body.discount ?? 0);

    if (
      !Number.isFinite(discount) ||
      discount < 0
    ) {
      return NextResponse.json(
        {
          error:
            "Discount must be a valid non-negative number.",
        },
        { status: 400 }
      );
    }

    /*
      IMPORTANT:

      p_amount_paid is currently used by complete_sale()
      as the CASH RECEIVED value.

      Example:
      Total = 250
      amount_paid sent by UI = 300

      Database stores:
      amount_paid     = 250
      amount_received = 300
      change_due      = 50
    */
    let amountPaid: number | null = null;

    if (
      body.amount_paid !== undefined &&
      body.amount_paid !== null
    ) {
      amountPaid = Number(body.amount_paid);

      if (
        !Number.isFinite(amountPaid) ||
        amountPaid < 0
      ) {
        return NextResponse.json(
          {
            error:
              "Amount received must be a valid non-negative number.",
          },
          { status: 400 }
        );
      }
    }

    // PAYMENT METHOD
    const paymentMethod =
      typeof body.payment_method === "string" &&
      body.payment_method.trim()
        ? body.payment_method.trim()
        : "Cash";

    // NOTES
    const notes =
      typeof body.notes === "string" &&
      body.notes.trim()
        ? body.notes.trim()
        : null;

// CUSTOMER
let customerId: number | null = null;

if (
  body.customer_id !== undefined &&
  body.customer_id !== null
) {
  customerId = Number(body.customer_id);

  if (
    !Number.isInteger(customerId) ||
    customerId <= 0
  ) {
    return NextResponse.json(
      { error: "Invalid customer ID." },
      { status: 400 }
    );
  }
}

    // COMPLETE ATOMIC SALE
    const { data, error } = await supabase.rpc(
      "complete_sale",
      {
        p_items: items,
        p_discount: discount,
        p_payment_method: paymentMethod,
        p_amount_paid: amountPaid,
        p_notes: notes,
        p_customer_id: customerId,
      }
    );

    if (error) {
      const message =
        error.message ||
        "Unable to complete sale.";

      /*
        These are expected business-rule failures.
        They should return HTTP 400 instead of being
        treated as unexpected server failures.
      */
      if (
        message.includes("Insufficient stock") ||
        message.includes("Cart cannot be empty") ||
        message.includes(
          "Discount cannot be greater"
        ) ||
        message.includes(
          "Discount cannot be negative"
        ) ||
        message.includes(
          "Amount received cannot be negative"
        ) ||
        message.includes(
          "Amount received is less than total"
        ) ||
        message.includes(
          "products were not found"
        ) ||
        message.includes(
          "Selected customer was not found or is inactive"
        ) ||
        message.includes(
          "valid product ID and quantity"
        )
      ) {
        return NextResponse.json(
          { error: message },
          { status: 400 }
        );
      }

      console.error(
        "Complete sale database error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Unable to complete sale. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        sale: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Complete sale API error:",
      error
    );

    return NextResponse.json(
      {
        error: "Invalid sale request.",
      },
      { status: 400 }
    );
  }
}