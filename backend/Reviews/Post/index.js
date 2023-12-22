const functions = require("@google-cloud/functions-framework");
const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
  Filter,
} = require("firebase-admin/firestore");
const serviceAccount = require("./key.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

functions.http("helloHttp", async (req, res) => {
  const { body } = req;
  const docRef = db.collection("reviews");

  await docRef.add(body);

  res.json({ success: true, body });
});
