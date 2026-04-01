"use server";

// Facade Pattern: Server Actions delegate to Service layer
// Each action is a thin wrapper providing the "use server" boundary

import { TransactionService } from "@/services/transaction.service";
import { UserService } from "@/services/user.service";
import { BudgetService } from "@/services/budget.service";

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
  return TransactionService.createTransaction(input);
}

export async function getRecentTransactions({ userId }: { userId: string }) {
  return TransactionService.getRecentTransactions(userId);
}

export async function getDashboardData({ userId }: { userId: string }) {
  return TransactionService.getDashboardData(userId);
}

export async function getTransactionPageData({ userId }: { userId: string }) {
  return TransactionService.getTransactionPageData(userId);
}

export async function getCategoryPageData({ userId }: { userId: string }) {
  return TransactionService.getCategoryPageData(userId);
}

export async function getAnalysePageData({ userId }: { userId: string }) {
  return TransactionService.getAnalysePageData(userId);
}

export async function getBudgetPageData({ userId }: { userId: string }) {
  return TransactionService.getBudgetPageData(userId);
}

export async function getHistoryPageData({
  userId,
  months,
}: {
  userId: string;
  months: { year: number; month: number }[];
}) {
  return TransactionService.getHistoryPageData(userId, months);
}

// ─── User Actions ─────────────────────────────────────────────

export async function getUserTheme({ userId }: { userId: string }) {
  return UserService.getTheme(userId);
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
  return UserService.updateTheme(userId, themeColor, themeMode);
}

export async function getUserSettings({ userId }: { userId: string }) {
  return UserService.getSettings(userId);
}

export async function updateUserSettings({ userId, name }: { userId: string; name: string }) {
  return UserService.updateSettings(userId, name);
}

// ─── Budget Actions ───────────────────────────────────────────

export async function createBudget({ userId, category, amount }: { userId: string; category: string; amount: number }) {
  return BudgetService.createOrUpdateBudget({ userId, category, amount });
}

export async function getUserBudgets({ userId }: { userId: string }) {
  return BudgetService.getUserBudgets(userId);
}

export async function deleteBudget({ userId, category }: { userId: string; category: string }) {
  return BudgetService.deleteBudget(userId, category);
}

// ─── Tax Actions ──────────────────────────────────────────────

export async function getYearlyIncome({ userId }: { userId: string }) {
  return TransactionService.getYearlyIncome(userId);
}

// ─── Delete Transaction ───────────────────────────────────────

export async function deleteTransaction({ id, userId }: { id: string; userId: string }) {
  return TransactionService.deleteTransaction(id, userId);
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
  return TransactionService.updateTransaction(id, userId, data);
}
