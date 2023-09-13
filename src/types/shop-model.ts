import { ObjectId } from 'mongodb';
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
  installedApps: ObjectId[];

  createdAt: number;

  // Calculated from service
  turnover: number;
  sales: number;
  updatedAt: number;

  // Added fields
  subscribedAt: number;

  // Added fields when all products updated same time
  bannedFromBestProducts?: boolean;
}
