import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { TaxClient } from "./tax-client";

export default async function TaxPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  return <TaxClient userId={user!.id} />;
}
