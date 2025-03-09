const admin = require("firebase-admin");
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const sendNotification = async (req, res) => {
  try {
    const { token, title, body } = req.body;

    if (!token || !title || !body) {
      return res.status(400).send("Missing token, title, or body");
    }

    const message = {
      notification: {
        title: title,
        body: body,
      },
      token: token,
    };

    const response = await admin.messaging().send(message);
    console.log("Successfully sent message:", response);
    res.status(200).send({ success: true, messageId: response });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).send({ success: false, error: error.message });
  }
};

module.exports = { sendNotification };
