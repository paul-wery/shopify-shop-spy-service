import { ShopProductSalesModel } from './shop-product-sales-model';

export interface ShopProductModel {
  url: string;
  name: string;
  image: string;
  price: number;
  createdAt: number;
  lastSaleAt: number;
  sales: ShopProductSalesModel[];
}
