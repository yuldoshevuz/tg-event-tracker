import type { TelegramClient } from "telegram";
import type { NewMessageEvent } from "telegram/events/NewMessage.js";
import { resolvePeer } from "../config/resolve-peer.js";

export const handleNewMessage = async (
  event: NewMessageEvent,
  client: TelegramClient
) => {
  const msg = event.message;
  if (!msg) return;

  // const from = msg.senderId?.toString() ?? "Unknown";
  // const to = msg.peerId?.toString() ?? "Unknown";

  const from = msg.fromId ? await resolvePeer(client, msg.fromId) : null;
  const to = msg.peerId ? await resolvePeer(client, msg.peerId) : null;

  const text = msg.message || "[Media]";

  await client.sendMessage("me", {
    message: `📩 **Yangi xabar**\n\n👤 Kimdan: \`${
      from ? from.firstName : "unknown"
    } ${from ? from.lastName : "unknown"} (${
      from ? "@" + from?.username : "unknown"
    })\`\n📍 Kimga: \`${to ? to.firstName : "unknown"} ${
      to ? to.lastName : "unknown"
    } (${
      to ? "@" + to?.username : "unknown"
    })\`\n💬 Matn:\n\n\`\`\`${text}\`\`\``,
    parseMode: "markdown",
  });
};
