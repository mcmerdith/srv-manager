import e from "dbschema/edgeql-js";
import * as edgedb from "edgedb";

export const client = edgedb.createClient();

export async function getTokens(userId: string) {
  const tokens = await e
    .select(e.cloudflare.ApiToken, (t) => ({
      filter: e.op(t.user.id, "=", e.uuid(userId)),
      ...e.cloudflare.ApiToken["*"],
    }))
    .run(client);
  return tokens;
}
