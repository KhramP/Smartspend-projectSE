import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { HistoryClient } from "./history-client";

export default async function HistoryPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  return <HistoryClient userId={user!.id} />;
}
