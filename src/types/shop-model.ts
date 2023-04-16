import { ShopProductModel } from './shop-product-model';

export interface ShopModel {
  url: string;
  name: string;
  logo: string;
  about: string;
  currency: string;
  subscribersCount: number;
  products: ShopProductModel[];
}
