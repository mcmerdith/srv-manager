import { getServerAuthSession } from "~/server/auth";
import { checkAuthSession } from "./auth_check";

export default async function checkServerAuthSession() {
  const session = await getServerAuthSession();
  return checkAuthSession(session);
}
