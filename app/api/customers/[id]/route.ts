import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const customerId = Number(id);

    if (
      !Number.isInteger(customerId) ||
      customerId <= 0
    ) {
      return NextResponse.json(
        { error: "Invalid customer ID." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : "";

    const address =
      typeof body.address === "string" &&
      body.address.trim()
        ? body.address.trim()
        : null;

    if (!name) {
      return NextResponse.json(
        { error: "Customer name is required." },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { error: "Customer phone is required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("customers")
      .update({
        name,
        phone,
        address,
      })
      .eq("id", customerId)
      .select(
        "id, name, phone, address, created_at, updated_at"
      )
      .maybeSingle();

    if (error) {
      console.error(
        "Customer PATCH database error:",
        error
      );

      return NextResponse.json(
        { error: "Unable to update customer." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Customer not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      customer: data,
    });
  } catch (error) {
    console.error(
      "Customer PATCH API error:",
      error
    );

    return NextResponse.json(
      { error: "Invalid customer request." },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const customerId = Number(id);

    if (
      !Number.isInteger(customerId) ||
      customerId <= 0
    ) {
      return NextResponse.json(
        { error: "Invalid customer ID." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("customers")
      .update({
        is_active: false,
      })
      .eq("id", customerId)
      .eq("is_active", true)
      .select(
        "id, name, phone, address, is_active, created_at, updated_at"
      )
      .maybeSingle();

    if (error) {
      console.error(
        "Customer archive database error:",
        error
      );

      return NextResponse.json(
        { error: "Unable to archive customer." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Customer not found or already archived." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      customer: data,
    });
  } catch (error) {
    console.error(
      "Customer archive API error:",
      error
    );

    return NextResponse.json(
      { error: "Unable to archive customer." },
      { status: 500 }
    );
  }
}