# API Documentation

## Project

Abdul Sattar Sons POS

---

# API Standards

Method Naming

GET

POST

PUT

DELETE

All responses return JSON.

---

# Products

## Add Product

POST

/api/products/add

Body

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

Response

200 OK

---

## Get Products

GET

/api/products

Returns all products.

---

## Update Product

PUT

/api/products/update

Updates product information.

---

## Delete Product

DELETE

/api/products/delete

Deletes a product.

---

# Customers

POST

/api/customers/add

GET

/api/customers

PUT

/api/customers/update

DELETE

/api/customers/delete

---

# Sales

POST

/api/sales/create

GET

/api/sales

GET

/api/sales/:id

---

# Reports

GET

/api/reports/daily

GET

/api/reports/monthly

GET

/api/reports/profit

---

# AI

POST

/api/ai/chat

POST

/api/ai/recommend

POST

/api/ai/paint-calculator