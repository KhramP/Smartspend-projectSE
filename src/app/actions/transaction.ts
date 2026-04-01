"use server";

// Facade Pattern: Server Actions delegate to Service layer
// Each action is a thin wrapper providing the "use server" boundary

import { TransactionService } from "@/services/transaction.service";
import { UserService } from "@/services/user.service";
import { BudgetService } from "@/services/budget.service";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function getAuthUserId(): Promise<string> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

// ─── Transaction Actions ──────────────────────────────────────

interface CreateTransactionInput {
  amount: number;
  name: string;
  type: string;
  category: string;
  date: string;
  note?: string;
  userId: string;
}

export async function createTransaction(input: CreateTransactionInput) {
  const authUserId = await getAuthUserId();
  return TransactionService.createTransaction({ ...input, userId: authUserId });
}

export async function getRecentTransactions({ userId }: { userId: string }) {
  const authUserId = await getAuthUserId();
  return TransactionService.getRecentTransactions(authUserId);
}

export async function getYearTransactions({ userId }: { userId: string }) {
  const authUserId = await getAuthUserId();
  return TransactionService.getYearTransactions(authUserId);
}

export async function getDashboardData({ userId }: { userId: string }) {
  const authUserId = await getAuthUserId();
  return TransactionService.getDashboardData(authUserId);
}

export async function getTransactionPageData({ userId }: { userId: string }) {
  const authUserId = await getAuthUserId();
  return TransactionService.getTransactionPageData(authUserId);
}

export async function getCategoryPageData({ userId }: { userId: string }) {
  const authUserId = await getAuthUserId();
  return TransactionService.getCategoryPageData(authUserId);
}

export async function getAnalysePageData({ userId }: { userId: string }) {
  const authUserId = await getAuthUserId();
  return TransactionService.getAnalysePageData(authUserId);
}

export async function getBudgetPageData({ userId }: { userId: string }) {
  const authUserId = await getAuthUserId();
  return TransactionService.getBudgetPageData(authUserId);
}

export async function getHistoryPageData({
  userId,
  months,
}: {
  userId: string;
  months: { year: number; month: number }[];
}) {
  const authUserId = await getAuthUserId();
  return TransactionService.getHistoryPageData(authUserId, months);
}

// ─── User Actions ─────────────────────────────────────────────

export async function getUserTheme({ userId }: { userId: string }) {
  const authUserId = await getAuthUserId();
  return UserService.getTheme(authUserId);
}

export async function updateUserTheme({
  userId,
  themeColor,
  themeMode,
}: {
  userId: string;
  themeColor?: string;
  themeMode?: string;
}) {
  const authUserId = await getAuthUserId();
  return UserService.updateTheme(authUserId, themeColor, themeMode);
}

export async function getUserSettings({ userId }: { userId: string }) {
  const authUserId = await getAuthUserId();
  return UserService.getSettings(authUserId);
}

export async function updateUserSettings({ userId, name }: { userId: string; name: string }) {
  const authUserId = await getAuthUserId();
  return UserService.updateSettings(authUserId, name);
}

// ─── Budget Actions ───────────────────────────────────────────

export async function createBudget({ userId, category, amount }: { userId: string; category: string; amount: number }) {
  const authUserId = await getAuthUserId();
  return BudgetService.createOrUpdateBudget({ userId: authUserId, category, amount });
}

export async function getUserBudgets({ userId }: { userId: string }) {
  const authUserId = await getAuthUserId();
  return BudgetService.getUserBudgets(authUserId);
}

export async function deleteBudget({ userId, category }: { userId: string; category: string }) {
  const authUserId = await getAuthUserId();
  return BudgetService.deleteBudget(authUserId, category);
}

// ─── Tax Actions ──────────────────────────────────────────────

export async function getYearlyIncome({ userId }: { userId: string }) {
  const authUserId = await getAuthUserId();
  return TransactionService.getYearlyIncome(authUserId);
}

// ─── Delete Transaction ───────────────────────────────────────

export async function deleteTransaction({ id, userId }: { id: string; userId: string }) {
  const authUserId = await getAuthUserId();
  return TransactionService.deleteTransaction(id, authUserId);
}

export async function updateTransaction({
  id,
  userId,
  ...data
}: {
  id: string;
  userId: string;
  amount?: number;
  name?: string;
  type?: string;
  category?: string;
  date?: string;
  note?: string;
}) {
  const authUserId = await getAuthUserId();
  return TransactionService.updateTransaction(id, authUserId, data);
}
