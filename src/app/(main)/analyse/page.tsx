import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getAnalyticsData, getCategoryBreakdown, getTopExpenses, getMonthlyTrend } from "../../actions/transaction";
import AnalysePageClient from "./client";

export default async function AnalysePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session!.user!.id;

  const [analytics, categoryBreakdown, topExpenses, monthlyTrend] = await Promise.all([
    getAnalyticsData({ userId }),
    getCategoryBreakdown({ userId }),
    getTopExpenses({ userId }),
    getMonthlyTrend({ userId }),
  ]);

  return (
    <AnalysePageClient
      analytics={analytics}
      categoryBreakdown={categoryBreakdown}
      topExpenses={topExpenses}
      monthlyTrend={monthlyTrend}
    />
  );
}
