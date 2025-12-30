import { auth } from "./auth.js";
import { API_APP_ID, API_APP_HASH, STRING_SESSION } from "./config/env.js";
import { eventTracker } from "./config/event-tracker.js";

if (!API_APP_ID) {
  throw new Error("API_APP_ID is not defined");
}

if (!API_APP_HASH) {
  throw new Error("API_APP_HASH is not defined");
}

if (STRING_SESSION) {
  eventTracker(STRING_SESSION, API_APP_ID, API_APP_HASH);
} else {
  auth();
}
