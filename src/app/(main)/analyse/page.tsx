import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getAnalysePageData } from "@/app/actions/transaction";
import { AnalyseClient } from "./analyse-client";

export default async function AnalysePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  const data = await getAnalysePageData({ userId: user!.id });

  return <AnalyseClient data={data} />;
}
