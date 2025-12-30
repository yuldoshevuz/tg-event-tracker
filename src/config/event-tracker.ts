import { connectClient } from "./telegram.js";
import { Raw } from "telegram/events/Raw.js";
import { TRACK_ID } from "./env.js";
import { bot } from "../bot.js";
import fs from "fs";
import path from "path";
import { Api } from "telegram";
import { UpdateConnectionState } from "telegram/network/index.js";
import { UPLOADS_DIR } from "./constants.js";

export const eventTracker = async (
  session: string,
  appId: number,
  appHash: string
) => {
  const client = await connectClient(session, appId, appHash);

  console.log("Listening events");

  // client.addEventHandler(
  //   (e) => handleNewMessage(e, client),
  //   new NewMessage({ incoming: true, outgoing: true })
  // );

  // client.addEventHandler((e) => handleRawUpdates(e, client), new Raw({}));

  client.addEventHandler(async (event: Api.TypeUpdate) => {
    if (event instanceof UpdateConnectionState) {
      return;
    }

    let eventJson;

    try {
      eventJson = JSON.stringify(event, null, 2);
    } catch (err) {
      console.error("Error JSON.stringify:", err);
      console.log(event);
    }

    const message = `<pre><code class="language-json">${eventJson}</code></pre>`;

    if (event instanceof Api.UpdateNewMessage && "media" in event.message) {
      const bufferFile = await client.downloadMedia(event.message.media);

      if (bufferFile) {
        await bot.sendDocument(TRACK_ID, bufferFile, {
          caption: event.message.message || "",
        });
      }
    }

    if (message.length > 4096) {
      const bufferMessage = JSON.stringify(event, null, 2);

      console.warn("Message too long, sending as file", message.length);

      const now = Date.now();

      const dateStr = new Date().toLocaleString("uz");

      const fileName = `event-data-${now}.json`;

      const filePath = path.join(UPLOADS_DIR, fileName);

      try {
        await fs.promises.mkdir(UPLOADS_DIR, { recursive: true });
        await fs.promises.writeFile(filePath, bufferMessage, "utf-8");
      } catch (error) {
        console.error("Failed to write file", error);

        await bot
          .sendMessage(TRACK_ID, "Failed to write event log file")
          .catch((err) =>
            console.error(
              "Failed to sending write event log error message",
              err
            )
          );

        return;
      }

      try {
        const caption = `<b>📌 Event:</b> <code>${
          event.className || "Unknown"
        }</code>\n<b>⌚ Time:</b> <code>${dateStr}</code>`;

        await bot.sendDocument(TRACK_ID, filePath, {
          caption,
          parse_mode: "HTML",
        });
      } catch (error) {
        console.error("Failed to send file via Telegram:", error);
      } finally {
        await fs.promises.unlink(filePath).catch(console.error);
      }

      return;
    }

    try {
      await bot.sendMessage(TRACK_ID, message, { parse_mode: "HTML" });
    } catch (error) {
      console.error("Failed to send message via Telegram:", error);
    }
  }, new Raw({}));
};
