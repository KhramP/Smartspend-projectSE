import { auth } from "@/lib/auth";
import { DashBoard } from "../_components/dashboard";
import { getDashboardData, getRecentTransactions } from "../actions/transaction";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  const transactions = await getRecentTransactions({ userId: user!.id });
  const dashboardData = await getDashboardData({ userId: user!.id });

  return (
    <div className="px-4 sm:px-6 lg:px-10 mt-5 pt-14 md:pt-5">
      <DashBoard transactions={transactions} data={dashboardData} />
    </div>
  );
}
