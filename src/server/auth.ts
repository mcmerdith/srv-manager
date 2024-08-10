import { type UserPermission } from "dbschema/interfaces";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { EdgeDBAdapter } from "@auth/edgedb-adapter";

import { env } from "~/env";

import e from "dbschema/edgeql-js";
import { client } from "./db";
import { type Adapter } from "next-auth/adapters";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      permissions: Omit<UserPermission, "id" | "user">;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: async ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        permissions: await e
          .select(
            e
              .insert(e.UserPermission, {
                user: e.select(e.User, (u) => ({
                  filter_single: e.op(u.id, "=", e.uuid(user.id)),
                })),
                admin: e.op(e.count(e.select(e.User, () => ({}))), "=", 1), // Make the first user an admin
              })
              .unlessConflict((p) => ({ on: p.user, else: p })),
            () => ({
              ...e.UserPermission["*"],
              id: false,
              user: false,
            }),
          )
          .run(client),
      },
    }),
  },
  adapter: EdgeDBAdapter(client) as Adapter, // TODO: File an issue on this type clashing
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
