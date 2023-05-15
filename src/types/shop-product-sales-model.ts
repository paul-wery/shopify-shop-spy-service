import { ObjectId } from 'mongodb';

export interface ShopProductSaleModel {
  shopId: ObjectId;
  productUrl: string;
  count: number;
  date: number;
}
