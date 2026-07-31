import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// GET /api/customers
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() ?? "";

   let query = supabaseAdmin
  .from("customers")
  .select(
    "id, name, phone, address, is_active, created_at, updated_at"
  )
  .eq("is_active", true)
  .order("name", { ascending: true })
  .limit(100);

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,phone.ilike.%${search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Customers GET database error:", error);

      return NextResponse.json(
        { error: "Unable to load customers." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      customers: data ?? [],
    });
  } catch (error) {
    console.error("Customers GET API error:", error);

    return NextResponse.json(
      { error: "Unable to load customers." },
      { status: 500 }
    );
  }
}

// POST /api/customers
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const phone =
      typeof body.phone === "string" &&
      body.phone.trim()
        ? body.phone.trim()
        : null;

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
      .insert({
        name,
        phone,
        address,
      })
      .select(
  "id, name, phone, address, is_active, created_at, updated_at"
)
      .single();

    if (error) {
      console.error("Customer POST database error:", error);

      return NextResponse.json(
        { error: "Unable to create customer." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { customer: data },
      { status: 201 }
    );
  } catch (error) {
    console.error("Customer POST API error:", error);

    return NextResponse.json(
      { error: "Invalid customer request." },
      { status: 400 }
    );
  }
}