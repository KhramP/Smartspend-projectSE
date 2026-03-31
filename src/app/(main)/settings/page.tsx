import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserSettings } from "@/app/actions/transaction";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  const settings = await getUserSettings({ userId: user!.id });

  return <SettingsClient settings={settings!} userId={user!.id} />;
}
