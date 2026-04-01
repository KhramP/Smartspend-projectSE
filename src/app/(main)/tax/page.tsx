import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { TaxClient } from "./tax-client";
import { getYearlyIncome } from "@/app/actions/transaction";

export default async function TaxPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  const yearlyIncome = await getYearlyIncome({ userId: user!.id });

  return <TaxClient userId={user!.id} yearlyIncome={yearlyIncome} />;
}
