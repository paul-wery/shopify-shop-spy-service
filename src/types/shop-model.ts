import { ShopProductModel } from './shop-product-model';

export enum ShopStatus {
  ACTIVE = 'ACTIVE',
  OUT_OF_LIMIT = 'OUT_OF_LIMIT',
}

export interface ShopModel {
  id: string;
  url: string;
  name: string;
  logo: string;
  about: string;
  currency: string;
  theme: {
    id: string;
    name: string;
    url?: string;
  };
  subscribersCount: number;
  lastUpdate: number;
  status: ShopStatus;
  products: {
    array: ShopProductModel[];
    // Calculated fields (not stored in DB)
    total: {
      sales: number;
      turnover: number;
    };
  };

  createdAt: number;

  // Saved every hours from fetch-shops.ts
  turnover: number;
  sales: number;
  updatedAt: number;

  // Added fields
  subscribedAt: number;
}
