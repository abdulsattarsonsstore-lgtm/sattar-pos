-- ============================================================
-- Abdul Sattar Sons POS
-- Product Listing / Search / Filtering / Pagination
-- Date: 2026-08-29
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_products(
    p_page INTEGER DEFAULT 1,
    p_limit INTEGER DEFAULT 10,
    p_search TEXT DEFAULT '',
    p_category TEXT DEFAULT '',
    p_brand TEXT DEFAULT '',
    p_stock_status TEXT DEFAULT 'all'
)
RETURNS TABLE (
    id BIGINT,
    product_name TEXT,
    category TEXT,
    brand TEXT,
    barcode TEXT,
    purchase_price NUMERIC,
    selling_price NUMERIC,
    stock INTEGER,
    unit TEXT,
    low_stock INTEGER,
    description TEXT,
    created_at TIMESTAMPTZ,
    total_count BIGINT
)
LANGUAGE sql
STABLE
AS $function$

    WITH filtered_products AS (
        SELECT
            p.*
        FROM public.products p
        WHERE
            (
                NULLIF(TRIM(p_search), '') IS NULL
                OR p.product_name ILIKE '%' || TRIM(p_search) || '%'
                OR p.category ILIKE '%' || TRIM(p_search) || '%'
                OR COALESCE(p.brand, '') ILIKE '%' || TRIM(p_search) || '%'
                OR COALESCE(p.barcode, '') ILIKE '%' || TRIM(p_search) || '%'
            )
            AND (
                NULLIF(TRIM(p_category), '') IS NULL
                OR p.category = TRIM(p_category)
            )
            AND (
                NULLIF(TRIM(p_brand), '') IS NULL
                OR p.brand = TRIM(p_brand)
            )
            AND (
                p_stock_status = 'all'
                OR (
                    p_stock_status = 'in-stock'
                    AND p.stock > p.low_stock
                )
                OR (
                    p_stock_status = 'low'
                    AND p.stock > 0
                    AND p.stock <= p.low_stock
                )
                OR (
                    p_stock_status = 'out-of-stock'
                    AND p.stock = 0
                )
            )
    )

    SELECT
        fp.id,
        fp.product_name,
        fp.category,
        fp.brand,
        fp.barcode,
        fp.purchase_price,
        fp.selling_price,
        fp.stock,
        fp.unit,
        fp.low_stock,
        fp.description,
        fp.created_at,
        COUNT(*) OVER () AS total_count
    FROM filtered_products fp
    ORDER BY fp.created_at DESC
    LIMIT GREATEST(p_limit, 1)
    OFFSET GREATEST(p_page - 1, 0) * GREATEST(p_limit, 1);

$function$;