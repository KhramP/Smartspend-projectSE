"use server";

import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";

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
  const { amount, name, type, category, date, note, userId } = input;

  if (!amount || !name || !type || !category || !date) {
    return { error: "กรุณากรอกข้อมูลให้ครบถ้วน" };
  }

  if (amount <= 0) {
    return { error: "จำนวนเงินต้องมากกว่า 0" };
  }

  const transaction = await prisma.transaction.create({
    data: {
      id: randomUUID(),
      amount,
      name,
      type,
      category,
      userId,
      date: new Date(date),
      note: note || null,
    },
  });

  return { success: true, transaction };
}

export async function getRecentTransactions({ userId }: { userId: string }) {
  const transactions = await prisma.transaction.findMany({
    where: { userId: userId },
    orderBy: { date: "desc" },
    take: 10,
  });
  return transactions;
}

export async function getDashboardData({ userId }: { userId: string }) {
  const thisMonthIncome = await prisma.transaction.aggregate({
    where: {
      userId,
      type: "income",
      date: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
      },
    },
    _sum: { amount: true },
  });

  const thisMonthExpense = await prisma.transaction.aggregate({
    where: {
      userId,
      type: "expense",
      date: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
      },
    },
    _sum: { amount: true },
  });

  const balance = (thisMonthIncome._sum.amount || 0) - (thisMonthExpense._sum.amount || 0);

  const todayExpense = await prisma.transaction.aggregate({
    where: {
      userId,
      type: "expense",
      date: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lt: new Date(new Date().setHours(24, 0, 0, 0)),
      },
    },
    _sum: { amount: true },
  });

  const eachCategorySpendingThisMonth = await prisma.transaction.groupBy({
    by: ["category"],
    where: {
      userId,
      type: "expense",
      date: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
      },
    },
    _sum: { amount: true },
  });

  return {
    thisMonthIncome: thisMonthIncome._sum.amount || 0,
    thisMonthExpense: thisMonthExpense._sum.amount || 0,
    balance,
    todayExpense: todayExpense._sum.amount || 0,
    eachCategorySpendingThisMonth: eachCategorySpendingThisMonth.map((cat) => ({
      category: cat.category!,
      amount: cat._sum.amount || 0,
    })),
  };
}

