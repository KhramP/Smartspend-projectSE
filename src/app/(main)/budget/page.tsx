import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getBudgetPageData } from "@/app/actions/transaction";
import { BudgetClient } from "./budget-client";

export default async function BudgetPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  const data = await getBudgetPageData({ userId: user!.id });

  return <BudgetClient data={data} userId={user!.id} />;
}
