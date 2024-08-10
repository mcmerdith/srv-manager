import { getServerAuthSession } from "~/server/auth";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <>
      <h1>Welcome {session?.user?.name ?? "User"}</h1>
    </>
  );
}
