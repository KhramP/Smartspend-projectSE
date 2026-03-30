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

// ---------- Transaction Page ----------

export async function getTransactions({ userId, search, type }: { userId: string; search?: string; type?: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { userId };
  if (type && type !== "all") where.type = type;
  if (search) where.name = { contains: search, mode: "insensitive" };

  const transactions = await prisma.transaction.findMany({
    where,
    orderBy: { date: "desc" },
  });

  return transactions;
}

export async function getTransactionStats({ userId }: { userId: string }) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [expenseAgg, incomeAgg, count] = await Promise.all([
    prisma.transaction.aggregate({
      where: { userId, type: "expense", date: { gte: startOfMonth, lt: endOfMonth } },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { userId, type: "income", date: { gte: startOfMonth, lt: endOfMonth } },
      _sum: { amount: true },
    }),
    prisma.transaction.count({
      where: { userId, date: { gte: startOfMonth, lt: endOfMonth } },
    }),
  ]);

  const expense = expenseAgg._sum.amount || 0;
  const income = incomeAgg._sum.amount || 0;
  const daysElapsed = now.getDate();

  return {
    thisMonthExpense: expense,
    thisMonthIncome: income,
    averagePerDay: daysElapsed > 0 ? Math.round(expense / daysElapsed) : 0,
    transactionCount: count,
  };
}

export async function deleteTransaction({ id, userId }: { id: string; userId: string }) {
  const transaction = await prisma.transaction.findFirst({ where: { id, userId } });
  if (!transaction) return { error: "ไม่พบรายการ" };
  await prisma.transaction.delete({ where: { id } });
  return { success: true };
}

// ---------- Analyse Page ----------

export async function getAnalyticsData({ userId }: { userId: string }) {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const transactions = await prisma.transaction.findMany({
    where: { userId, date: { gte: sixMonthsAgo } },
    select: { amount: true, type: true, date: true },
  });

  const monthlyData: Record<string, { expense: number; income: number }> = {};
  for (const t of transactions) {
    const key = `${t.date.getFullYear()}-${t.date.getMonth()}`;
    if (!monthlyData[key]) monthlyData[key] = { expense: 0, income: 0 };
    if (t.type === "expense") monthlyData[key].expense += t.amount;
    else monthlyData[key].income += t.amount;
  }

  const months = Object.values(monthlyData);
  const monthCount = months.length || 1;
  const totalExpense = months.reduce((sum, m) => sum + m.expense, 0);
  const totalIncome = months.reduce((sum, m) => sum + m.income, 0);

  const monthNames = [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ];
  let highestMonth = "-";
  let highestAmount = 0;
  for (const [key, data] of Object.entries(monthlyData)) {
    if (data.expense > highestAmount) {
      highestAmount = data.expense;
      highestMonth = monthNames[parseInt(key.split("-")[1])];
    }
  }

  return {
    avgExpensePerMonth: Math.round(totalExpense / monthCount),
    avgSavingPerMonth: Math.round((totalIncome - totalExpense) / monthCount),
    highestSpendingMonth: highestMonth,
    savingRate: totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)) : 0,
  };
}

export async function getCategoryBreakdown({ userId }: { userId: string }) {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [categoryData, totalAgg, totalCount] = await Promise.all([
    prisma.transaction.groupBy({
      by: ["category"],
      where: { userId, type: "expense", date: { gte: sixMonthsAgo } },
      _sum: { amount: true },
      _count: true,
      orderBy: { _sum: { amount: "desc" } },
    }),
    prisma.transaction.aggregate({
      where: { userId, type: "expense", date: { gte: sixMonthsAgo } },
      _sum: { amount: true },
    }),
    prisma.transaction.count({
      where: { userId, type: "expense", date: { gte: sixMonthsAgo } },
    }),
  ]);

  const total = totalAgg._sum.amount || 1;
  const colors = ["#9bd104ff", "#ffd700", "#4CAF50", "#2196F3", "#9E9E9E", "#e91e63", "#ff5722"];

  return {
    categories: categoryData.map((cat, idx) => ({
      category: cat.category || "อื่นๆ",
      amount: cat._sum.amount || 0,
      count: cat._count,
      percent: Math.round(((cat._sum.amount || 0) / total) * 100),
      color: colors[idx % colors.length],
    })),
    totalExpense: totalAgg._sum.amount || 0,
    totalCount,
  };
}

export async function getTopExpenses({ userId }: { userId: string }) {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  sixMonthsAgo.setDate(1);

  const data = await prisma.transaction.groupBy({
    by: ["name", "category"],
    where: { userId, type: "expense", date: { gte: sixMonthsAgo } },
    _sum: { amount: true },
    _count: true,
    orderBy: { _sum: { amount: "desc" } },
    take: 5,
  });

  return data.map((item, idx) => ({
    rank: idx + 1,
    name: item.name || "ไม่ระบุชื่อ",
    category: item.category || "อื่นๆ",
    count: item._count,
    amount: item._sum.amount || 0,
  }));
}

export async function getMonthlyTrend({ userId }: { userId: string }) {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const transactions = await prisma.transaction.findMany({
    where: { userId, date: { gte: sixMonthsAgo } },
    select: { amount: true, type: true, date: true },
  });

  const monthNames = [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ];
  const result: { month: string; expense: number; income: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    let expense = 0;
    let income = 0;
    for (const t of transactions) {
      if (t.date.getFullYear() === year && t.date.getMonth() === month) {
        if (t.type === "expense") expense += t.amount;
        else income += t.amount;
      }
    }
    result.push({ month: monthNames[month], expense, income });
  }

  return result;
}

// ---------- Budget Page ----------

export async function getBudgetOverview({ userId }: { userId: string }) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [categorySpending, incomeAgg] = await Promise.all([
    prisma.transaction.groupBy({
      by: ["category"],
      where: { userId, type: "expense", date: { gte: startOfMonth, lt: endOfMonth } },
      _sum: { amount: true },
      _count: true,
      orderBy: { _sum: { amount: "desc" } },
    }),
    prisma.transaction.aggregate({
      where: { userId, type: "income", date: { gte: startOfMonth, lt: endOfMonth } },
      _sum: { amount: true },
    }),
  ]);

  const totalSpent = categorySpending.reduce((sum, c) => sum + (c._sum.amount || 0), 0);
  const totalIncome = incomeAgg._sum.amount || 0;

  const categoryIcons: Record<string, string> = {
    อาหาร: "🍜",
    เดินทาง: "🚌",
    บันเทิง: "🎮",
    ช้อปปิ้ง: "🛍️",
    สุขภาพ: "🏥",
    การศึกษา: "📚",
    ค่าน้ำไฟ: "💡",
    อื่นๆ: "📦",
  };

  return {
    totalIncome,
    totalSpent,
    remaining: totalIncome - totalSpent,
    categories: categorySpending.map((cat) => ({
      name: cat.category || "อื่นๆ",
      icon: categoryIcons[cat.category || ""] || "📦",
      spent: cat._sum.amount || 0,
      count: cat._count,
    })),
  };
}

// ---------- Category Page ----------

export async function getCategoryData({ userId }: { userId: string }) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const categories = await prisma.transaction.groupBy({
    by: ["category"],
    where: { userId, type: "expense", date: { gte: startOfMonth, lt: endOfMonth } },
    _sum: { amount: true },
    _count: true,
    orderBy: { _sum: { amount: "desc" } },
  });

  const totalExpense = categories.reduce((sum, c) => sum + (c._sum.amount || 0), 0) || 1;

  const categoryIcons: Record<string, string> = {
    อาหาร: "🍜",
    เดินทาง: "🚌",
    บันเทิง: "🎮",
    ช้อปปิ้ง: "🛍️",
    สุขภาพ: "🏥",
    การศึกษา: "📚",
    ค่าน้ำไฟ: "💡",
    อื่นๆ: "📦",
  };

  return categories.map((cat) => ({
    name: cat.category || "อื่นๆ",
    icon: categoryIcons[cat.category || ""] || "📦",
    count: cat._count,
    amount: cat._sum.amount || 0,
    percent: Math.round(((cat._sum.amount || 0) / totalExpense) * 100),
  }));
}

// ---------- History Page ----------

export async function getTransactionsByMonths({
  userId,
  months,
}: {
  userId: string;
  months: { year: number; month: number }[];
}) {
  if (months.length === 0) return [];

  const conditions = months.map(({ year, month }) => ({
    date: {
      gte: new Date(year, month, 1),
      lt: new Date(year, month + 1, 1),
    },
  }));

  return prisma.transaction.findMany({
    where: { userId, OR: conditions },
    orderBy: { date: "desc" },
  });
}

// ---------- Tax Page ----------

export async function getTotalIncome({ userId, year }: { userId: string; year: number }) {
  const income = await prisma.transaction.aggregate({
    where: {
      userId,
      type: "income",
      date: { gte: new Date(year, 0, 1), lt: new Date(year + 1, 0, 1) },
    },
    _sum: { amount: true },
  });
  return income._sum.amount || 0;
}
