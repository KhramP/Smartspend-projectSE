"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  return (
    <div>
      <nav>
        {isPending ? null : !user ? (
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Signed in as {user.email}</span>
            <Button variant="outline" onClick={() => authClient.signOut()}>
              Sign Out
            </Button>
          </div>
        )}
      </nav>
    </div>
  );
}
