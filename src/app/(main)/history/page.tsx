import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { HistoryClient } from "./history-client";

export default async function HistoryPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  const dbUser = await prisma.user.findUnique({ where: { id: user!.id }, select: { plan: true } });
  if (dbUser?.plan !== "PRO") redirect("/premium");

  return <HistoryClient userId={user!.id} />;
}
