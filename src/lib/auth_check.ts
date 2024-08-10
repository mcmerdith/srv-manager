import { type Session } from "next-auth";

import { type UserPermission } from "dbschema/interfaces";

export type AuthenticationState =
  | {
      success: true;
      session: Session & { user: Session["user"] }; // The session with a guaranteed user
    }
  | {
      success: false;
      noPermission: boolean;
    };

export async function checkAuthSession(
  session: Session | null,
  permissions?: (keyof Omit<UserPermission, "id" | "user">)[],
): Promise<AuthenticationState> {
  // Must have a user
  if (!session?.user) {
    return {
      success: false,
      noPermission: false,
    };
  }

  // OK if no permissions required
  if (!permissions || permissions.length === 0) {
    return { success: true, session };
  }

  // Must have all permissions
  if (permissions.find((p) => !session.user.permissions[p])) {
    return {
      success: false,
      noPermission: true,
    };
  }

  // OK if all permissions are present
  return { success: true, session };
}
