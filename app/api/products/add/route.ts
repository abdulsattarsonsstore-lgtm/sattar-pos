import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const productName =
      typeof body.product_name === "string"
        ? body.product_name.trim()
        : "";

    const category =
      typeof body.category === "string"
        ? body.category.trim()
        : "";

    const brand =
      typeof body.brand === "string"
        ? body.brand.trim()
        : "";

    const barcode =
      typeof body.barcode === "string"
        ? body.barcode.trim()
        : "";

    const unit =
      typeof body.unit === "string"
        ? body.unit.trim()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    const purchasePrice = Number(body.purchase_price);
    const sellingPrice = Number(body.selling_price);
    const stock = Number(body.stock);
    const lowStock = Number(body.low_stock);

    // Required text fields
    if (!productName) {
      return NextResponse.json(
        { error: "Product name is required." },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: "Category is required." },
        { status: 400 }
      );
    }

    // Validate numbers
    if (
      !Number.isFinite(purchasePrice) ||
      purchasePrice < 0
    ) {
      return NextResponse.json(
        {
          error:
            "Purchase price must be a valid non-negative number.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(sellingPrice) ||
      sellingPrice < 0
    ) {
      return NextResponse.json(
        {
          error:
            "Selling price must be a valid non-negative number.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      return NextResponse.json(
        {
          error:
            "Stock must be a non-negative whole number.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(lowStock) ||
      lowStock < 0
    ) {
      return NextResponse.json(
        {
          error:
            "Low stock alert must be a non-negative whole number.",
        },
        { status: 400 }
      );
    }

    // Duplicate barcode protection
    if (barcode) {
      const { data: existingProduct, error: barcodeCheckError } =
        await supabase
          .from("products")
          .select("id")
          .eq("barcode", barcode)
          .maybeSingle();

      if (barcodeCheckError) {
        return NextResponse.json(
          { error: barcodeCheckError.message },
          { status: 500 }
        );
      }

      if (existingProduct) {
        return NextResponse.json(
          {
            error:
              "A product with this barcode already exists.",
          },
          { status: 409 }
        );
      }
    }

    // Insert only after validation succeeds
    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          product_name: productName,
          category,
          brand: brand || null,
          barcode: barcode || null,
          purchase_price: purchasePrice,
          selling_price: sellingPrice,
          stock,
          unit: unit || null,
          low_stock: lowStock,
          description: description || null,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        product: data,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        error: "Invalid product request.",
      },
      { status: 400 }
    );
  }
}