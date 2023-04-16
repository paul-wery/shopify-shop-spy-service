type ShopifyProductSalesData = {
  salesCount: number;
  lastInventoryQuantity: number;
  lastUpdatedAt: string;
};

type ShopifyProductOptions = {
  name: string;
  position: number;
  values: string[];
};

type ShopifyProductVariant = {
  id: number;
  title: string;
  option1: string;
  option2: null;
  option3: null;
  sku: string;
  requires_shipping: boolean;
  taxable: boolean;
  featured_image: null;
  available: boolean;
  price: string;
  grams: number;
  compare_at_price: string;
  position: number;
  product_id: number;
  created_at: string;
  updated_at: string;
};

export type ShopifyProduct = {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  vendor: string;
  product_type: string;
  tags: string[];
  images: { src: string }[];
  variants: ShopifyProductVariant[];
  options: ShopifyProductOptions[];
  // This property is retrieved in getProductSalesData.ts
  salesData: ShopifyProductSalesData;
};
