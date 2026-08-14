# Abdul Sattar Sons POS - API Documentation

## Project

Abdul Sattar Sons POS

---

# API Architecture

The POS API is implemented using Next.js App Router Route Handlers.

All API routes are located under:

`app/api/`

API responses use JSON.

The current API is connected to Supabase PostgreSQL.

---

# API Standards

## HTTP Methods

The current API uses:

- GET
- POST
- PUT
- PATCH
- DELETE

---

# Products API

## Get Products

### Endpoint

`GET /api/products`

### Purpose

Returns the product list used by inventory and product-search workflows.

---

## Add Product

### Endpoint

`POST /api/products/add`

### Purpose

Creates a new product.

### Request Body

```json
{
  "product_name": "",
  "category": "",
  "brand": "",
  "barcode": "",
  "purchase_price": 0,
  "selling_price": 0,
  "stock": 0,
  "unit": "",
  "low_stock": 0,
  "description": ""
}
Future API development will expand reporting, AI, supplier, purchasing and other business capabilities.
