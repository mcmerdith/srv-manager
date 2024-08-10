import { type AuthenticationState } from "~/lib/auth_check";

export async function AuthenticationError({
  state: { noPermission },
}: {
  state: AuthenticationState & { success: false };
}) {
  if (noPermission) {
    return <p>You do not have permission to access this page.</p>;
  } else {
    return <p>You must be logged in to access this page.</p>;
  }
}
