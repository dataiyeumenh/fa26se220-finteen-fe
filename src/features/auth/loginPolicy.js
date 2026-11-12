import { accountDestination, hasInternalAccess } from "../internal/access.js";
import { LOGIN_FAILURE_MESSAGE } from "../../lib/authMessages.js";

export const wrongLoginMessage = () => LOGIN_FAILURE_MESSAGE;

export function completeLogin(client, internal) {
  const { actor } = client.getSnapshot();
  if (!actor) {
    client.logout();
    throw new Error(LOGIN_FAILURE_MESSAGE);
  }
  if (hasInternalAccess(actor) !== internal) {
    client.logout();
    throw new Error(LOGIN_FAILURE_MESSAGE);
  }
  return accountDestination(actor);
}
