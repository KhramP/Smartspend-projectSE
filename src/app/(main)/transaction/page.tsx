import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getTransactionPageData } from "@/app/actions/transaction";
import { TransactionClient } from "./transaction-client";

export default async function TransactionPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  const data = await getTransactionPageData({ userId: user!.id });

  return <TransactionClient data={data} userId={user!.id} />;
}
