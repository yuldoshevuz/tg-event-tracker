import { Api, TelegramClient } from "telegram";
import { resolvePeer } from "../config/resolve-peer.js";
import { WHITE_LIST } from "../config/env.js";

export const handleRawUpdates = async (
  event: Api.TypeUpdate,
  client: TelegramClient
) => {
  if (event instanceof Api.UpdateMessageReactions) {
    const peer = event.peer;
    const msgId = event.msgId;
    const reactions = event.reactions?.results ?? [];

    let reacted: string[] = [];

    const formatted = reactions
      .map((r) => {
        const emoji =
          r.reaction instanceof Api.ReactionEmoji ? r.reaction.emoticon : "❓";

        if (r.chosenOrder !== null) {
          reacted.push(emoji);
        }

        return `${emoji} × ${r.count}`;
      })
      .join(", ");

    const chat = await resolvePeer(client, peer);

    await client.sendMessage("me", {
      message: `❤️ **Xabarga reaction bosildi**\n\n📍 Chat: \`\`\`${JSON.stringify(
        chat
      )}\`\`\`\n🆔 Xabar ID: \`${msgId}\`\n🎭 Reactions: ${formatted}\n🎯 Bosilgan reactionlar: \`${reacted.join(
        ","
      )}\``,
      parseMode: "markdown",
    });

    return;
  }

  if (event instanceof Api.UpdateSentStoryReaction) {
    const peer = event.peer;
    const storyId = event.storyId;
    const reaction = event.reaction;

    if (peer instanceof Api.PeerUser) {
      const isWhiteListed = WHITE_LIST.includes(peer.userId.toString());

      if (isWhiteListed) return;
    }

    const chat = await resolvePeer(client, peer);

    await client.sendMessage("me", {
      message: `📸 **Story reaction**\n\n👤 Kimning storysi: \`\`\`${JSON.stringify(
        chat
      )}\`\`\`\n🆔 Story ID: \`${storyId}\`\n🎭 Reaction: ${
        reaction instanceof Api.ReactionEmoji ? reaction.emoticon : "❓"
      }`,
      parseMode: "markdown",
    });

    return;
  }

  if (event instanceof Api.UpdateDraftMessage) {
    const chat = await resolvePeer(client, event.peer);
    const text = "message" in event.draft ? event.draft.message : "unknown";

    if (event.peer instanceof Api.PeerUser) {
      const isWhiteListed = WHITE_LIST.includes(event.peer.userId.toString());

      if (isWhiteListed) return;
    }

    await client.sendMessage("me", {
      message: `✍️ **Yangi draft**\n\n📍 Chat: \`\`\`${JSON.stringify(
        chat
      )}\`\`\`\n💬 Matn:\n\n\`\`\`${text}\`\`\``,
      parseMode: "markdown",
    });
  }
};
