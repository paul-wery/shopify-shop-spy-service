import { ObjectId } from 'mongodb';

export interface ShopProductModel {
  shopId: ObjectId;
  url: string;
  name: string;
  image: string;
  price: number;
  createdAt: number;
  // sales: ShopProductSaleModel[]; // Not used on service

  last7DaysSales: number;
  last7DaysTurnover: number;
}
