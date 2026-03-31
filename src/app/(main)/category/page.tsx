import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getCategoryPageData } from "@/app/actions/transaction";
import { CategoryClient } from "./category-client";

export default async function CategoryPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  const data = await getCategoryPageData({ userId: user!.id });

  return <CategoryClient data={data} />;
}
