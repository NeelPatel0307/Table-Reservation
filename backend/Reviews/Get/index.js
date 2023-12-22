const functions = require("@google-cloud/functions-framework");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const serviceAccount = require("./key.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

functions.http("helloHttp", async (req, res) => {
  const snapshot = await db.collection("reviews").get();
  const myData = snapshot.map((doc) => {
    return doc.data();
  });

  res.json({ success: true, data: myData });
});
