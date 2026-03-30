import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserProfile } from "../../actions/user";
import SettingsPageClient from "./client";

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session!.user!.id;

  const profile = await getUserProfile({ userId });

  return <SettingsPageClient profile={JSON.parse(JSON.stringify(profile))} />;
}
