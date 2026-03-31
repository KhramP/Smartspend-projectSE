// Service Layer Pattern: Encapsulates business logic for transactions
// Orchestrates Repository calls and applies business rules

import { TransactionRepository } from "@/repositories/transaction.repository";
import { getMonthDateRange, getTodayDateRange, getCurrentDayOfMonth } from "@/lib/date-utils";

export const TransactionService = {
  async createTransaction(input: {
    amount: number;
    name: string;
    type: string;
    category: string;
    date: string;
    note?: string;
    userId: string;
  }) {
    if (!input.amount || !input.name || !input.type || !input.category || !input.date) {
      return { error: "กรุณากรอกข้อมูลให้ครบถ้วน" };
    }
    if (input.amount <= 0) {
      return { error: "จำนวนเงินต้องมากกว่า 0" };
    }

    const transaction = await TransactionRepository.create({
      ...input,
      date: new Date(input.date),
      note: input.note || null,
    });

    return { success: true, transaction };
  },

  async getRecentTransactions(userId: string) {
    return TransactionRepository.findRecentByUser(userId, 10);
  },

  async getDashboardData(userId: string) {
    const monthRange = getMonthDateRange();
    const todayRange = getTodayDateRange();

    const [incomeAgg, expenseAgg, todayExpenseAgg, categorySpending] = await Promise.all([
      TransactionRepository.aggregateByType(userId, "income", monthRange),
      TransactionRepository.aggregateByType(userId, "expense", monthRange),
      TransactionRepository.aggregateByType(userId, "expense", todayRange),
      TransactionRepository.groupByCategory(userId, "expense", monthRange),
    ]);

    const thisMonthIncome = incomeAgg._sum.amount || 0;
    const thisMonthExpense = expenseAgg._sum.amount || 0;

    return {
      thisMonthIncome,
      thisMonthExpense,
      balance: thisMonthIncome - thisMonthExpense,
      todayExpense: todayExpenseAgg._sum.amount || 0,
      eachCategorySpendingThisMonth: categorySpending.map((cat) => ({
        category: cat.category!,
        amount: cat._sum.amount || 0,
      })),
    };
  },

  async getTransactionPageData(userId: string) {
    const monthRange = getMonthDateRange();
    const dayOfMonth = getCurrentDayOfMonth();

    const [transactions, expenseAgg, incomeAgg] = await Promise.all([
      TransactionRepository.findRecentByUser(userId, 50),
      TransactionRepository.aggregateByType(userId, "expense", monthRange),
      TransactionRepository.aggregateByType(userId, "income", monthRange),
    ]);

    const monthlyExpense = expenseAgg._sum.amount || 0;
    const avgPerDay = dayOfMonth > 0 ? monthlyExpense / dayOfMonth : 0;

    return {
      transactions,
      stats: {
        monthlyExpense,
        monthlyIncome: incomeAgg._sum.amount || 0,
        avgPerDay: Math.round(avgPerDay),
        transactionCount: expenseAgg._count || 0,
      },
    };
  },

  async getCategoryPageData(userId: string) {
    const monthRange = getMonthDateRange();
    const categoryData = await TransactionRepository.groupByCategory(userId, "expense", monthRange);
    const totalExpense = categoryData.reduce((sum, c) => sum + (c._sum.amount || 0), 0);

    return {
      categories: categoryData.map((c) => ({
        name: c.category || "อื่นๆ",
        count: c._count,
        amount: c._sum.amount || 0,
        percent: totalExpense > 0 ? Math.round(((c._sum.amount || 0) / totalExpense) * 100) : 0,
      })),
      totalCategories: categoryData.length,
      totalTransactions: categoryData.reduce((sum, c) => sum + c._count, 0),
      totalAmount: totalExpense,
    };
  },

  async getAnalysePageData(userId: string) {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    // Fetch 6 months of data in parallel
    const monthPromises = Array.from({ length: 6 }, (_, i) => {
      const offset = -(5 - i);
      const range = getMonthDateRange(offset);
      const month = new Date(now.getFullYear(), now.getMonth() + offset, 1).toLocaleDateString("th-TH", {
        month: "short",
      });

      return Promise.all([
        TransactionRepository.aggregateByType(userId, "income", range),
        TransactionRepository.aggregateByType(userId, "expense", range),
      ]).then(([income, expense]) => ({
        month,
        income: income._sum.amount || 0,
        expense: expense._sum.amount || 0,
      }));
    });

    const [monthlyData, categoryStats, topExpenses] = await Promise.all([
      Promise.all(monthPromises),
      TransactionRepository.groupByCategory(userId, "expense", { start: sixMonthsAgo, end: new Date() }),
      TransactionRepository.groupByNameAndCategory(userId, "expense", { start: sixMonthsAgo, end: new Date() }, 5),
    ]);

    const totalExpense6m = categoryStats.reduce((s, c) => s + (c._sum.amount || 0), 0);
    const totalIncome6m = monthlyData.reduce((s, m) => s + m.income, 0);
    const avgMonthlyExpense = totalExpense6m / 6;
    const avgMonthlySaving = (totalIncome6m - totalExpense6m) / 6;
    const savingRate = totalIncome6m > 0 ? Math.round(((totalIncome6m - totalExpense6m) / totalIncome6m) * 100) : 0;
    const highestMonth = monthlyData.reduce((max, m) => (m.expense > max.expense ? m : max), monthlyData[0]);

    return {
      monthlyData,
      categoryStats: categoryStats.map((c) => ({
        name: c.category || "อื่นๆ",
        amount: c._sum.amount || 0,
        percent: totalExpense6m > 0 ? Math.round(((c._sum.amount || 0) / totalExpense6m) * 100) : 0,
      })),
      statCards: {
        avgMonthlyExpense: Math.round(avgMonthlyExpense),
        avgMonthlySaving: Math.round(avgMonthlySaving),
        highestMonth: highestMonth?.month || "-",
        savingRate,
      },
      topExpenses: topExpenses.map((t, i) => ({
        rank: i + 1,
        name: t.name || "ไม่ระบุ",
        category: t.category || "อื่นๆ",
        count: t._count,
        amount: t._sum.amount || 0,
      })),
    };
  },

  async getBudgetPageData(userId: string) {
    const monthRange = getMonthDateRange();
    const categorySpending = await TransactionRepository.groupByCategory(userId, "expense", monthRange);
    const totalExpense = categorySpending.reduce((s, c) => s + (c._sum.amount || 0), 0);

    return {
      categorySpending: categorySpending.map((c) => ({
        name: c.category || "อื่นๆ",
        used: c._sum.amount || 0,
      })),
      totalUsed: totalExpense,
    };
  },

  async getHistoryPageData(userId: string, months: { year: number; month: number }[]) {
    const transactions = await TransactionRepository.findByUserAndMonths(userId, months);
    return { transactions };
  },
};
