import { ShopModel } from '@src/types/shop-model';
import { WithId } from 'mongodb';
import { getShopsCollection } from './collections';

export async function updateShop(shop: WithId<ShopModel>) {
  try {
    const shopsCollection = getShopsCollection();

    await shopsCollection.updateOne({ _id: shop._id }, { $set: shop });
  } catch (error) {
    console.error(error.message);
  }
}
