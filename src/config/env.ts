import * as dotenv from "dotenv";

dotenv.config();

export const STRING_SESSION = process.env.STRING_SESSION;

export const API_APP_ID = Number(process.env.API_APP_ID);

export const API_APP_HASH = process.env.API_APP_HASH;

export const WHITE_LIST = process.env.WHITE_LIST?.split(",") || [];

export const TRACK_ID = process.env.TRACK_ID ?? "me";

export const BOT_TOKEN = process.env.BOT_TOKEN;
