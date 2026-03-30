import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getTransactions, getTransactionStats } from "../../actions/transaction";
import TransactionPageClient from "./client";

export default async function TransactionPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session!.user!.id;

  const [transactions, stats] = await Promise.all([getTransactions({ userId }), getTransactionStats({ userId })]);

  return (
    <TransactionPageClient
      initialTransactions={JSON.parse(JSON.stringify(transactions))}
      stats={stats}
      userId={userId}
    />
  );
}
