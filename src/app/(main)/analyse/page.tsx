import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getAnalysePageData } from "@/app/actions/transaction";
import { AnalyseClient } from "./analyse-client";

export default async function AnalysePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  const dbUser = await prisma.user.findUnique({ where: { id: user!.id }, select: { plan: true } });
  if (dbUser?.plan !== "PRO") redirect("/premium");
  const data = await getAnalysePageData({ userId: user!.id });

  return <AnalyseClient data={data} />;
}
