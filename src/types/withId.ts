import { ShopProductModel } from './shop-product-model';

export type WithId<T> = T & {
  id: string;
};

export type WithIdAndProducts<T> = T & {
  id: string;
  products: WithId<ShopProductModel>[];
};
