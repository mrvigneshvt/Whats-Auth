import {
  makeWASocket,
  DisconnectReason,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";

let sock;

const connectToWhatsapp = async () => {
  try {
    const { state, saveCreds } = await useMultiFileAuthState("auth");
    const { version } = await fetchLatestBaileysVersion();

    sock = makeWASocket({
      auth: state,
      printQRInTerminal: true,
      version,
    });

    // Process events
    sock.ev.process(async (events) => {
      if (events["connection.update"]) {
        handleConnectionUpdate(events["connection.update"]);
      }

      if (events["creds.update"]) {
        await saveCreds();
      }

      sock.ev.on("messages.upsert", async ({ messages, type }) => {
        if (type === "notify") {
          const msg = messages[0];

          // Check if the message is from the specific user
          const specificUser = "917010892470@s.whatsapp.net"; // Replace with the user's WhatsApp ID
          if (msg.key.remoteJid === specificUser && !msg.key.fromMe) {
            console.log(`Message from ${specificUser}:`, msg.message);

            if (msg.message.conversation === "ping") {
              await sock.sendMessage(specificUser, {
                text: "pong!",
              });
            }

            // Example: Auto-reply
          }
        }
      });
    });
  } catch (err) {
    console.error("Unexpected error during connection:", err);
  }
};

const handleConnectionUpdate = (update) => {
  const { connection, lastDisconnect, isOnline, receivedPendingNotifications } =
    update;

  if (connection) {
    console.log("Connection update:", connection);

    if (connection === "open") {
      console.log("Connected to WhatsApp!");
    } else if (connection === "close") {
      console.log("Connection closed.");

      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !==
        DisconnectReason.loggedOut;

      if (shouldReconnect) {
        console.log("Reconnecting...");
        connectToWhatsapp();
      } else {
        console.log(
          "Logged out. Please delete the auth folder and re-scan the QR code."
        );
      }
    }
  }

  if (isOnline !== undefined) {
    console.log(`Online status: ${isOnline}`);
  }

  if (receivedPendingNotifications) {
    console.log("Pending notifications received.");
  }
};

const sendMessageToUser = async (Data) => {
  try {
    const data = await sock.sendMessage(Data.user, { text: Data.text });

    return data;
  } catch (error) {
    console.error("Error in sendSome:", error);
    return false;
  }
};

const privateMessage = async (Data, data) => {
  try {
    console.log(Data, "//////", data);
    await sock.sendMessage(Data.user, {
      text: "edited",
      edit: data.key,
    });
  } catch (error) {
    console.log("error in priv:::", error);
  }
};

export { connectToWhatsapp, sendMessageToUser, privateMessage };
