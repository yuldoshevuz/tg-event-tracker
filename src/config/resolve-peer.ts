import { Api, TelegramClient } from "telegram";

export const resolvePeer = async (
  client: TelegramClient,
  peer: Api.PeerChat | Api.PeerUser | Api.PeerChannel
) => {
  let entity = null;

  try {
    entity = await client.getEntity(peer);
  } catch (error) {
    console.log(error);
  }

  if (entity instanceof Api.User) {
    return {
      type: "user",
      id: entity.id.toString(),
      firstName: entity.firstName,
      lastName: entity.lastName,
      username: entity.username,
      isBot: entity.bot,
    };
  }

  if (entity instanceof Api.Channel) {
    return {
      type: "channel",
      id: entity.id.toString(),
      title: entity.title,
      username: entity.username,
    };
  }

  if (entity instanceof Api.Chat) {
    return {
      type: "group",
      id: entity.id.toString(),
      title: entity.title,
    };
  }

  return null;
};
