# Abdul Sattar Sons POS

> A professional cloud-based Point of Sale (POS) system built for Abdul Sattar Sons Paint, Sanitary, Hardware & Building Material Store.

---

# Vision

Create a modern, fast, reliable and professional POS system that replaces manual billing, inventory registers and handwritten customer records.

The system should be simple enough for shop staff to learn quickly while providing a strong technical foundation for future business growth.

The long-term goal is to build a dependable business platform that can evolve from a single-store POS into a larger retail management system.

---

# Business Information

**Store Name**

Abdul Sattar Sons Paint, Sanitary & Building Material Store

---

## Business Categories

* Paint
* Sanitary
* Hardware
* Building Material

---

# Core Objectives

* Inventory Management
* Fast Billing
* Product Search
* Customer Management
* Sales Management
* Credit (Udhaar) Support
* Sales Reports
* Profit and Business Reports
* Receipt Generation
* AI-Assisted Business Features

---

# Target Users

## Owner

Full system access.

Primary responsibilities:

* Business overview
* Inventory
* Billing
* Customers
* Sales
* Reports
* System management

---

## Manager

Operational access.

Primary responsibilities:

* Inventory
* Customers
* Sales
* Reports

---

## Cashier

Daily sales operations.

Primary responsibilities:

* Billing
* Product Search
* Customer Selection
* Sales Processing
* Receipt Handling

---

# Technology Stack

## Frontend

* Next.js
* React
* TypeScript

---

## Backend

* Next.js Route Handlers
* PostgreSQL database functions for atomic sales processing

---

## Database

* Supabase
* PostgreSQL

---

## Database Architecture

The current POS database includes:

* `products`
* `customers`
* `sales`
* `sale_items`

The database also contains:

* Identity sequences for primary keys
* Invoice number sequence
* Foreign-key relationships
* Unique constraints
* Business-rule CHECK constraints
* `complete_sale()` PostgreSQL function
* `generate_invoice_number()` PostgreSQL function

The `complete_sale()` function is responsible for the atomic checkout workflow, including product validation, stock validation, subtotal calculation, discount validation, payment validation, invoice generation, sale creation, sale-item creation and stock deduction.

---

## Authentication

Supabase is the planned authentication and authorization platform.

Authentication and role-based access should be treated as a separate system capability and must not be considered complete until implemented and verified.

---

## Deployment

* Vercel
* GitHub

Production deployment status should be verified independently from local development status.

---

## Version Control

* Git
* GitHub

Database schema and database functions are also maintained as version-controlled migration files under:

`supabase/migrations/`

---

## AI

AI functionality is planned as part of the POS platform.

Potential capabilities include:

* Product recommendations
* Product search assistance
* Paint quantity estimation
* Sales insights
* Smart business suggestions

AI features should only be marked complete after their actual backend integration and production behavior have been verified.

---

# Development Principles

The project should follow these principles:

* Clean Code
* Modular Components
* Reusable UI
* Mobile Friendly
* Desktop Optimized
* Secure by Default
* Fast Performance
* Professional UI
* Database-Level Business Rules
* Reliable Transaction Processing
* Maintainable Architecture
* Version-Controlled Database Changes

---

# Current Application Status

## Foundation

* ✅ Next.js application configured
* ✅ TypeScript configured
* ✅ Git repository configured
* ✅ GitHub repository connected
* ✅ Environment configuration established
* ✅ Supabase database connected
* ✅ Database schema preserved in version-controlled migration

---

## Inventory

* ✅ Product creation
* ✅ Product listing
* ✅ Product details
* ✅ Product editing
* ✅ Product deletion
* ✅ Product search
* ✅ Stock management
* ✅ Category information
* ✅ Pricing information
* ✅ Low-stock information

---

## Dashboard

* ✅ Dashboard page
* ✅ Sales statistics
* ✅ Product statistics
* ✅ Customer statistics
* ✅ Low-stock information
* ✅ Sales overview

---

## Billing / POS

* ✅ Product search
* ✅ Shopping cart
* ✅ Quantity handling
* ✅ Discount handling
* ✅ Customer selection
* ✅ Payment handling
* ✅ Cash received
* ✅ Change calculation
* ✅ Atomic sale completion
* ✅ Stock deduction
* ✅ Invoice number generation
* ✅ Receipt page

---

## Customers

* ✅ Customer listing
* ✅ Customer search
* ✅ Customer creation
* ✅ Customer editing
* ✅ Customer archiving
* ✅ Active customer handling

---

## Sales

* ✅ Sales history
* ✅ Individual sale details
* ✅ Customer information
* ✅ Sale-item information
* ✅ Invoice information
* ✅ Receipt handling

---

## Reports

* ✅ Reports module exists

Detailed report coverage should continue to be expanded and verified as development progresses.

---

## AI Assistant

* ⚠ AI module exists
* ⬜ Full AI backend integration
* ⬜ Production AI workflows
* ⬜ Product recommendation engine
* ⬜ Paint quantity estimator
* ⬜ AI sales insights

---

# Database Safety

The database contains important business logic that must be treated as part of the application.

In particular:

`complete_sale()`

must remain the authoritative transaction workflow for completing sales.

The application should not bypass database-level stock and transaction rules with independent client-side implementations.

Database migrations should be committed to Git whenever the database structure or database functions are intentionally changed.

---

# Quality Standards

Before considering a major development milestone complete:

1. The application must compile successfully.
2. TypeScript checks must pass.
3. ESLint must pass without errors.
4. Production build must pass.
5. Important database changes must be version controlled.
6. Git working tree should be clean after the milestone is committed.
7. Existing POS functionality must be regression-tested after significant changes.

---

# Current Version

**v0.1.0**

This version represents the foundational working POS application and its initial version-controlled database architecture.

---

# Future Direction

The system may eventually expand to support:

* Advanced inventory management
* Supplier management
* Purchase orders
* Expense management
* Advanced reporting
* User authentication and roles
* Barcode scanning
* WhatsApp invoices
* QR payments
* Offline operation
* Multi-store support
* Mobile applications
* Advanced AI assistance

Future capabilities must be implemented and verified before being described as completed features.
