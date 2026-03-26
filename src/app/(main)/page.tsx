import { DashBoard } from "../_components/dashboard";
import { getRecentTransactions } from "../actions/transaction";

export default async function Home() {
  const transactions = await getRecentTransactions();

  return (
    <div className="px-4 sm:px-6 lg:px-10 mt-5 pt-14 md:pt-5">
      <DashBoard transactions={transactions} />
    </div>
  );
}
