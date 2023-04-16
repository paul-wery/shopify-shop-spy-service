import { getShopsCollection } from './collections';

export async function getShops() {
  try {
    const shopsCollection = getShopsCollection();

    return shopsCollection.find({ subscribersCount: { $gt: 0 } }).toArray();
  } catch (error) {
    console.error(error.message);
  }
  return [];
}
