import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getBudgetPageData } from "@/app/actions/transaction";
import { BudgetClient } from "./budget-client";

export default async function BudgetPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  const dbUser = await prisma.user.findUnique({ where: { id: user!.id }, select: { plan: true } });
  if (dbUser?.plan !== "PRO") redirect("/premium");
  const data = await getBudgetPageData({ userId: user!.id });

  return <BudgetClient data={data} userId={user!.id} />;
}
