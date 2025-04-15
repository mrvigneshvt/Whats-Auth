import express from "express";
import {
  connectToWhatsapp,
  privateMessage,
  sendMessageToUser,
} from "./server.js";

const port = 3000;
const ip = ["109.123.237.36" , '223.178.85.168','183.82.205.233'] //1 is localhost (Home)

const myIp = [`::ffff:${ip[0]}`,`::ffff:${ip[1]}`];
const root = "917010892470@s.whatsapp.net";

const server = express();

server.use(express.json());

connectToWhatsapp();

// POST Endpoint to send messages
server.post("/send-message", async (req, res, next) => {
  try {
    const clientIp = req.ip;
    const body = req.body;

    console.log(clientIp);

    if (!myIp.includes(clientIp)) {
      return res.status(403).json({
        success: false,
        message: "UnAuthorized",
      });
    }

    // Validate input
    if (!body.user || !body.text) {
      return res.status(400).json({
        success: false,
        message: "Both 'user' and 'message' fields are required.",
      });
    }

    if (body.text.length < 1) {
      return res.status(400).json({
        success: false,
        message: "Message Length should be Greater than 1",
      });
    }

    // Send message via WhatsApp client

    body.text =
      body.text +
      "\n\n**This is a Private Non Profit Project API Called made by VIXYZ**";
    const isSent = await sendMessageToUser(body);

    if (!isSent) {
      return res.status(400).json({
        success: false,
        message: `Message Not sent to ${body.user}`,
      });
    } else {
      res.status(200).json({
        success: true,
        message: `Message sent to ${body.user}`,
      });

      setTimeout(async () => {
        console.log(
          "Message Edited For Privacy REASON... \n\n\nFrom WhatsAuth made by VIXYZ"
        );
        await privateMessage(body, isSent);
      }, 60000 + 60000);
    }
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to send message.",
      error: error.message,
    });
  }
});

setInterval(async () => {
  await sendMessageToUser({
    user: root,
    text: `Pinging to ROOT: ${getTime()}`,
  });
}, 3600000);

// Start the Express server
server.listen(port, () => {
  console.log(`Server is running on http://${ip}:${port}`);
});
