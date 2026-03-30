import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getTotalIncome } from "../../actions/transaction";
import TaxPageClient from "./client";

export default async function TaxPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session!.user!.id;

  const currentYear = new Date().getFullYear();
  const totalIncome = await getTotalIncome({ userId, year: currentYear });

  return <TaxPageClient totalIncome={totalIncome} />;
}
