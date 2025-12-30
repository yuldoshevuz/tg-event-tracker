import { TelegramClient } from "telegram";
import { API_APP_HASH, API_APP_ID, WHITE_LIST } from "./config/env.js";
import { StringSession } from "telegram/sessions/StringSession.js";
import fs from "fs";
import path from "path";
import { ask } from "./config/ask.js";

export const auth = async () => {
  if (!API_APP_ID) {
    throw new Error("API_APP_ID is not defined");
  }

  if (!API_APP_HASH) {
    throw new Error("API_APP_HASH is not defined");
  }

  const stringSession = new StringSession("");

  const client = new TelegramClient(stringSession, API_APP_ID, API_APP_HASH, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => ask("Please enter your number: "),
    phoneCode: async () => ask("Please enter the code you received: "),
    password: async () => ask("Please, enter your password: "),
    onError: (err) => console.log(err),
  });

  const session = stringSession.save();

  const envFile = `API_APP_ID="${API_APP_ID}"\n\nAPI_APP_HASH="${API_APP_HASH}"\n\nWHITE_LIST="${WHITE_LIST.join(
    ","
  )}"\n\nSTRING_SESSION="${session}"`;

  await client.sendMessage("me", {
    message: `⚠️ Please, don't delete this code!\n\n**String session:** \`${session}\``,
    parseMode: "markdown",
  });

  fs.writeFileSync(path.join(process.cwd(), ".env"), envFile);
  console.log("Muvaffaqiyatli ulandingiz!");

  return client;
};
