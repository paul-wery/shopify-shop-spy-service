import configuration from '@src/configuration';
import { MongoClient, ServerApiVersion } from 'mongodb';

export const client = new MongoClient(configuration.mongodb.uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
