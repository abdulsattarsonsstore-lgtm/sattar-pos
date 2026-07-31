export interface Product {
  id: number;
  product_name: string;
  category: string;
  brand: string | null;
  barcode: string | null;
  purchase_price: number;
  selling_price: number;
  stock: number;
  unit: string | null;
  low_stock: number;
  description: string | null;
  created_at: string;
}