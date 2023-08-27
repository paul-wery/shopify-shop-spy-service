import { ShopModel, ShopStatus } from '@src/types/shop-model';
import dayjs from 'dayjs';
import { WithId } from 'mongodb';
import { getShopsCollection } from './collections';

export async function getShops(): Promise<WithId<ShopModel>[]> {
  try {
    const start = dayjs();
    const shopsCollection = getShopsCollection();
    const query = shopsCollection.aggregate([
      {
        $match: {
          subscribersCount: { $gt: 0 },
          status: { $ne: ShopStatus.OUT_OF_LIMIT },
        },
      },
    ]);
    const data = (await query.toArray()) as WithId<ShopModel>[];

    console.info(
      `getShops (${data.length}) in : ${dayjs().diff(start, 'second')}s`
    );

    return data;
  } catch (error) {
    console.error(error.message);
  }
  return [];
}
