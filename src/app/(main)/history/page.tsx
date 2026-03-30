import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import HistoryPageClient from "./client";

export default async function HistoryPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session!.user!.id;

  return <HistoryPageClient userId={userId} />;
}
