import { StringSession } from "telegram/sessions/StringSession.js";
import { TelegramClient } from "telegram";

export const connectClient = async (
  stringSession: string,
  apiId: number,
  apiHash: string
) => {
  const session = new StringSession(stringSession);

  const client = new TelegramClient(session, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({ botAuthToken: "" });

  console.log("Connected client");

  return client;
};
