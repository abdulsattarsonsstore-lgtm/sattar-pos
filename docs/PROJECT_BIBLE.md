# Abdul Sattar Sons POS

> A professional, generic and configurable local-first Point of Sale (POS) system, initially configured for Abdul Sattar Sons Paint, Sanitary, Hardware & Building Material Store.

---

# Vision

Create a modern, fast, reliable and professional POS system that replaces manual billing, inventory registers and handwritten customer records.

The system should be simple enough for shop staff to learn quickly while providing a strong technical foundation for future business growth.

The POS is designed as a generic and configurable business application. Abdul Sattar Sons is the initial configured business, but the same software should be deployable for other businesses without requiring a separate codebase for each customer.

The long-term goal is to build a dependable desktop-based retail platform that can evolve from a single-store POS into a larger retail management system.

---

# Business Information

**Initial Store Configuration**

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

# Product Architecture

The POS is designed as a generic, configurable desktop application rather than a business-specific codebase.

Abdul Sattar Sons is the initial configured business.

The same application should be deployable to other businesses without creating a separate codebase for each customer.

Business-specific information such as store name, address, contact information, logo, invoice settings and other configuration should be managed through application settings rather than hard-coded into the application.

---

## Target Runtime Architecture

The target production architecture is:

* Desktop application
* Next.js
* React
* TypeScript
* Desktop application shell
* Local application/data layer
* SQLite database

The core POS application should operate without requiring an internet connection.

Core operations such as inventory management, billing, customer management, sales processing and reporting should use local application data.

---

## Current Development Architecture

The current application was initially developed using:

* Next.js Route Handlers
* Supabase
* PostgreSQL
* Vercel
* GitHub

This existing architecture is part of the project's development history.

The application will transition toward the local-first desktop architecture described above.

Supabase and PostgreSQL should not be removed until their functionality has been successfully replaced and verified in the local architecture.

---

# Target Data Architecture

The target database is SQLite.

The application should use a modular data-access layer between the application logic and the database.

The intended architecture is:

    UI
     ↓
    Application / Service Layer
     ↓
    Data Access Layer
     ↓
    SQLite

Application features should not unnecessarily depend directly on a specific database implementation.

This allows the application architecture to remain maintainable and provides the option for future database or cloud capabilities without rewriting the entire application.

---

# Database Architecture

The current POS database includes:

* `products`
* `customers`
* `sales`
* `sale_items`

The current database also contains:

* Identity sequences for primary keys
* Invoice number sequence
* Foreign-key relationships
* Unique constraints
* Business-rule CHECK constraints
* `complete_sale()` PostgreSQL function
* `generate_invoice_number()` PostgreSQL function

The `complete_sale()` function is responsible for the atomic checkout workflow, including product validation, stock validation, subtotal calculation, discount validation, payment validation, invoice generation, sale creation, sale-item creation and stock deduction.

During the transition to SQLite, these business rules must be preserved in the new local architecture.

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

# Authentication

Authentication and role-based access should be treated as a separate system capability.

The local-first architecture should not assume that cloud authentication is required for core POS operation.

User roles and permissions should only be marked complete after their actual implementation and verification.

---

# Deployment

The target application is a desktop application intended to run locally on the customer's computer.

The production application should eventually be distributed as an installable desktop application.

The application should not require:

* Node.js
* npm
* Git
* GitHub
* Vercel
* Supabase
* PostgreSQL
* Internet access

for normal end-user POS operation.

The current development environment may continue using GitHub and other development services during the transition.

---

# Version Control

* Git
* GitHub

Database schema and database-related changes must remain version controlled.

During the current PostgreSQL development stage, database migrations are maintained under:

`supabase/migrations/`

After migration to SQLite, the local database schema and related database changes must also remain version controlled.

---

# Backup and Data Safety

Because the target application is local-first, protection of local business data is a critical requirement.

The application should provide:

* Database backup
* Database restore
* User-selectable backup location
* Safe restoration workflow

Future versions may provide optional automated or cloud-based backup.

A local database failure must not be treated as an acceptable data-loss scenario.

---

# AI

AI functionality is planned as part of the POS platform.

Potential capabilities include:

* Product recommendations
* Product search assistance
* Paint quantity estimation
* Sales insights
* Smart business suggestions

AI features should only be marked complete after their actual backend integration and production behavior have been verified.

AI functionality should not be required for the core POS system to operate.

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
* Local-First Architecture
* Reliable Transaction Processing
* Database-Level Business Rules
* Maintainable Architecture
* Version-Controlled Database Changes
* Reliable Local Data Storage
* Safe Backup and Restore

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

must remain the authoritative transaction workflow for completing sales during the current PostgreSQL architecture.

The application should not bypass database-level stock and transaction rules with independent client-side implementations.

When migrating to SQLite, equivalent transaction guarantees and business rules must be implemented and verified before the PostgreSQL implementation is removed.

Database migrations and schema changes must be committed to Git whenever the database structure or database functions are intentionally changed.

---

# Local-First Requirements

The target POS application should allow the following core operations without internet access:

* View and manage products
* Search inventory
* Manage stock
* Manage customers
* Create sales
* Process payments
* Generate invoices
* View sales history
* View business reports

Internet-dependent capabilities such as future cloud synchronization, remote backup or AI services must remain optional and must not prevent core POS operation.

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
8. Local data must remain safe and recoverable.
9. Core POS functionality must work without internet access once the local architecture is complete.

---

# Current Version

**v0.1.0**

This version represents the foundational working POS application and its initial version-controlled database architecture.

The application is currently transitioning from its initial cloud-connected development architecture toward a local-first desktop architecture.

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
* Optional cloud backup
* Optional cloud synchronization
* Multi-store support
* Mobile applications
* Advanced AI assistance

Future capabilities must be implemented and verified before being described as completed features.

Cloud functionality should remain an optional future capability and should not be required for normal operation of the core local POS application.
