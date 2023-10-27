import { ObjectId } from 'mongodb';

const MONGODB_ID_LENGTH = 24;

export function convertToObjectId(id: string) {
  return new ObjectId(id.padStart(MONGODB_ID_LENGTH, '0'));
}
