import { ObjectId } from 'mongodb';

export interface ShopProductModel {
  shopId: ObjectId;
  url: string;
  name: string;
  image: string;
  price: number;
  createdAt: number;
}
