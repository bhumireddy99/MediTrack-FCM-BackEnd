const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.post("/send-push", async (req, res) => {
  const { tokens, title, body, data } = req.body;

  if (!tokens || !Array.isArray(tokens)) {
    return res.status(400).json({ error: "Missing or invalid 'tokens' array" });
  }

  const messages = tokens.map((token) => ({
    to: token,
    sound: "default",
    title,
    body,
    data,
  }));

  try {
    const response = await axios.post(
      "https://exp.host/--/api/v2/push/send",
      messages,
      {
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ success: true, result: response.data });
  } catch (err) {
    console.error("Error sending push:", err);
    res
      .status(500)
      .json({ error: "Push notification failed", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Push Notification API running on http://localhost:${PORT}`);
});