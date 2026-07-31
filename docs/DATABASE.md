# Database Design

## Project

Abdul Sattar Sons POS

---

# Database

Supabase PostgreSQL

---

# Overview

The database is designed to support inventory management, billing,
customer management, supplier management, reports and AI features.

---

# Tables

## 1. products

Purpose

Stores every product available in the shop.

Columns

| Column | Type | Description |
|----------|------|-------------|
| id | bigint | Primary Key |
| product_name | text | Product Name |
| category | text | Paint / Sanitary / Hardware / Building Material |
| brand | text | Brand Name |
| barcode | text | Barcode |
| purchase_price | numeric | Purchase Price |
| selling_price | numeric | Selling Price |
| stock | integer | Available Quantity |
| unit | text | Piece / Bag / Kg / Bucket |
| low_stock | integer | Alert Quantity |
| description | text | Extra Notes |
| created_at | timestamp | Created Date |

---

## 2. categories

Purpose

Stores available product categories.

Columns

| Column | Type |
|---------|------|
| id | bigint |
| name | text |

Default Categories

- Paint
- Sanitary
- Building Material
- Hardware

---

## 3. customers

Purpose

Stores customer information.

Columns

| Column | Type |
|---------|------|
| id | bigint |
| name | text |
| phone | text |
| address | text |
| balance | numeric |
| created_at | timestamp |

---

## 4. suppliers

Purpose

Stores supplier information.

Columns

| Column | Type |
|---------|------|
| id | bigint |
| supplier_name | text |
| phone | text |
| address | text |

---

## 5. sales

Purpose

Stores every completed sale.

Columns

| Column | Type |
|---------|------|
| id | bigint |
| customer_id | bigint |
| total | numeric |
| discount | numeric |
| payment_method | text |
| created_at | timestamp |

---

## 6. sale_items

Purpose

Stores products included in each sale.

Columns

| Column | Type |
|---------|------|
| id | bigint |
| sale_id | bigint |
| product_id | bigint |
| quantity | integer |
| price | numeric |

---

## 7. payments

Purpose

Stores customer payments.

Columns

| Column | Type |
|---------|------|
| id | bigint |
| customer_id | bigint |
| amount | numeric |
| payment_date | timestamp |

---

## 8. expenses

Purpose

Stores shop expenses.

Examples

- Electricity
- Salary
- Rent
- Transport

Columns

| Column | Type |
|---------|------|
| id | bigint |
| title | text |
| amount | numeric |
| expense_date | timestamp |

---

## 9. users

Purpose

Stores system users.

Roles

- Admin
- Manager
- Cashier

Columns

| Column | Type |
|---------|------|
| id | bigint |
| name | text |
| email | text |
| role | text |

---

# Relationships

Customer

↓

Sales

↓

Sale Items

↓

Products

Products

↓

Categories

Customers

↓

Payments

---

# Future Tables

purchase_orders

stock_movements

notifications

activity_logs

settings

ai_chat_history

barcode_labels
