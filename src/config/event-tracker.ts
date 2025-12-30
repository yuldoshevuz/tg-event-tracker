import { connectClient } from "./telegram.js";

import { Raw } from "telegram/events/Raw.js";
import { TRACK_ID } from "./env.js";
import { bot } from "../bot.js";

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

  client.addEventHandler(async (event) => {
    const message = `<pre><code class="language-json">${JSON.stringify(
      event,
      null,
      2
    )}</code></pre>`;

    try {
      await bot.sendMessage(TRACK_ID, message, { parse_mode: "HTML" });
    } catch (error) {
      console.error("Failed to send message via Telegram:", error);
    }
  }, new Raw({}));
};
