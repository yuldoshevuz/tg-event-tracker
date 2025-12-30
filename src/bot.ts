import TelegramBot from "node-telegram-bot-api";
import { BOT_TOKEN } from "./config/env.js";

if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN is not set in environment variables");
}

export const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const textMsg = msg.text;

  if (textMsg && textMsg === "ping") {
    await bot.sendMessage(chatId, "pong");
    await bot.sendMessage(chatId, " 🚀 Event Tracker is running!");
  }
});
