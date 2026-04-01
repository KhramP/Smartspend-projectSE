import { auth } from "@/lib/auth";
import { DashBoard } from "../_components/dashboard";
import { getDashboardData, getRecentTransactions, getUserBudgets } from "../actions/transaction";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  const [transactions, dashboardData, budgets] = await Promise.all([
    getRecentTransactions({ userId: user!.id }),
    getDashboardData({ userId: user!.id }),
    getUserBudgets({ userId: user!.id }),
  ]);

  return (
    <div className="px-4 sm:px-6 lg:px-10 mt-5 pt-14 md:pt-5">
      <DashBoard transactions={transactions} data={dashboardData} budgets={budgets} />
    </div>
  );
}
