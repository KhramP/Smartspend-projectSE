import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserTheme } from "@/app/actions/transaction";
import { ThemeClient } from "./theme-client";

export default async function ThemePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  const theme = await getUserTheme({ userId: user!.id });

  return <ThemeClient currentTheme={theme} userId={user!.id} />;
}
