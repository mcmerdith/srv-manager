import { Edit, Trash2 } from "lucide-react";
import { AuthenticationError } from "~/components/server_auth";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import checkServerAuthSession from "~/lib/server_auth";
import { formatDate } from "~/lib/utils";
import { getTokens } from "~/server/db";

export default async function TokensPage() {
  const auth = await checkServerAuthSession();
  if (!auth.success) return <AuthenticationError state={auth} />;

  const tokens = await getTokens(auth.session.user.id);

  return (
    <>
      <h1 className="text-2xl font-bold">Your API Tokens</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Added On</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tokens.map((token) => (
            <TableRow key={token.id}>
              <TableCell>{token.name}</TableCell>
              <TableCell>{token.key.replaceAll(/./g, "*")}</TableCell>
              <TableCell>{formatDate(token.createdAt)}</TableCell>
              <TableCell className="flex flex-row gap-2">
                <Button
                  size="icon"
                  icon={<Trash2 />}
                  variant="destructive"
                  title="Delete"
                ></Button>
                <Button
                  size="icon"
                  icon={<Edit />}
                  variant="secondary"
                  title="Edit"
                ></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
