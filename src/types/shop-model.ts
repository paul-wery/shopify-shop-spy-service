export enum ShopStatus {
  ACTIVE = 'ACTIVE',
  OUT_OF_LIMIT = 'OUT_OF_LIMIT',
}

export interface ShopModel {
  url: string;
  name: string;
  logo: string;
  about: string;
  currency: string;
  subscribersCount: number;
  lastUpdate: number;
  status: ShopStatus;
}
