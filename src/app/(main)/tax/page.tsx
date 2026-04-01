import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { TaxClient } from "./tax-client";
import { getYearlyIncome } from "@/app/actions/transaction";

export default async function TaxPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  const dbUser = await prisma.user.findUnique({ where: { id: user!.id }, select: { plan: true } });
  if (dbUser?.plan !== "PRO") redirect("/premium");

  const yearlyIncome = await getYearlyIncome({ userId: user!.id });

  return <TaxClient userId={user!.id} yearlyIncome={yearlyIncome} />;
}
