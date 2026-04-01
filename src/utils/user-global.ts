"use client";

import { authClient } from "@/lib/auth-client";
import { User } from "better-auth";
import useSWR from "swr";

export type AccountInfo = Pick<User, "id" | "name" | "email" | "image"> & { plan?: string };

const fetcher = async ([url]: [string, string]): Promise<AccountInfo> => {
  const response = await fetch(url, {
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error("Authentication required");
    if (response.status === 404) throw new Error("User not found");
    throw new Error("Failed to fetch user data");
  }

  return response.json();
};

export function useUser() {
  const { data: sessionData, isPending: isSessionLoading } = authClient.useSession();
  const isAuthenticated = !!sessionData?.user;
  const userId = sessionData?.user?.id;
  const accountInfoKey = isAuthenticated && userId ? (["/api/user/accountInfo", userId] as [string, string]) : null;

  const {
    data: accountInfo,
    error,
    isLoading: isDataLoading,
    mutate,
  } = useSWR<AccountInfo>(accountInfoKey, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    errorRetryCount: 2,
    dedupingInterval: 5000,
    onError: (error) => {
      console.error("User data fetch error:", error);
    },
  });

  return {
    user: isAuthenticated ? accountInfo : null,
    isLoading: isSessionLoading || isDataLoading,
    isError: !!error,
    error: error instanceof Error ? error.message : "An unknown error occurred",
    refetch: mutate,
    isAuthenticated,
  };
}
