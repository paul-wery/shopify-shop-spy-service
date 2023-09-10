import { AppModel } from '@src/types/app-model';
import { getAppsCollection } from './collections';

export async function updateApps(apps: Partial<AppModel>[]) {
  const collection = getAppsCollection();

  await Promise.all(
    apps.map((app) =>
      collection.updateOne(
        { handle: app.handle },
        { $set: app },
        { upsert: true }
      )
    )
  );
}
