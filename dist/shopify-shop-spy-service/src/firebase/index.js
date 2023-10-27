var import_app = require("firebase-admin/app");
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
(0, import_app.initializeApp)({
  credential: (0, import_app.cert)({
    projectId,
    clientEmail,
    privateKey
  }),
  projectId,
  storageBucket
});
//# sourceMappingURL=index.js.map
