import { auth } from "./auth.api.js";
import { createPersonalizationApi } from "./personalization.client.js";

export const personalizationApi = createPersonalizationApi(auth);
