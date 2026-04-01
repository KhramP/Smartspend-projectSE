// Service Layer Pattern: Encapsulates business logic for transactions
// Orchestrates Repository calls and applies business rules

import { TransactionRepository } from "@/repositories/transaction.repository";
import { BudgetRepository } from "@/repositories/budget.repository";
import { getMonthDateRange, getTodayDateRange, getCurrentDayOfMonth } from "@/lib/date-utils";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/constants/categories";

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
    if (!input.name || !input.type || !input.category || !input.date) {
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

  async getYearTransactions(userId: string) {
    return TransactionRepository.findByUserAndYear(userId, new Date().getFullYear());
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

    // Build a map of categories that have transactions
    const catMap = new Map(categoryData.map((c) => [c.category || "อื่นๆ", c]));

    // Merge all defined categories (expense + income) with actual data
    const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
    const categories = allCategories.map((cat) => {
      const match = catMap.get(cat.name);
      return {
        name: cat.name,
        count: match ? match._count : 0,
        amount: match ? match._sum.amount || 0 : 0,
        percent: match && totalExpense > 0 ? Math.round(((match._sum.amount || 0) / totalExpense) * 100) : 0,
      };
    });

    // Also include any categories from data that aren't in our predefined list
    for (const c of categoryData) {
      const name = c.category || "อื่นๆ";
      if (!allCategories.some((cat) => cat.name === name)) {
        categories.push({
          name,
          count: c._count,
          amount: c._sum.amount || 0,
          percent: totalExpense > 0 ? Math.round(((c._sum.amount || 0) / totalExpense) * 100) : 0,
        });
      }
    }

    return {
      categories,
      totalCategories: categories.length,
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
    const [categorySpending, budgets] = await Promise.all([
      TransactionRepository.groupByCategory(userId, "expense", monthRange),
      BudgetRepository.findByUser(userId),
    ]);

    const budgetMap = new Map(budgets.map((b) => [b.category, b.amount]));
    const totalExpense = categorySpending.reduce((s, c) => s + (c._sum.amount || 0), 0);

    // Merge spending with budgets; include budget-only categories with 0 used
    const spendingMap = new Map(categorySpending.map((c) => [c.category || "อื่นๆ", c._sum.amount || 0]));
    const allCategories = new Set([...spendingMap.keys(), ...budgetMap.keys()]);

    const merged = Array.from(allCategories).map((name) => ({
      name,
      used: spendingMap.get(name) || 0,
      budget: budgetMap.get(name) || 0,
    }));

    const totalBudget = merged.reduce((s, c) => s + c.budget, 0);

    return {
      categorySpending: merged,
      totalUsed: totalExpense,
      totalBudget,
    };
  },

  async getHistoryPageData(userId: string, months: { year: number; month: number }[]) {
    const transactions = await TransactionRepository.findByUserAndMonths(userId, months);
    return { transactions };
  },

  async getYearlyIncome(userId: string) {
    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const yearEnd = new Date(now.getFullYear() + 1, 0, 1);
    const result = await TransactionRepository.aggregateByType(userId, "income", {
      start: yearStart,
      end: yearEnd,
    });
    return result._sum.amount || 0;
  },

  async deleteTransaction(id: string, userId: string) {
    return TransactionRepository.deleteById(id, userId);
  },

  async updateTransaction(
    id: string,
    userId: string,
    input: { amount?: number; name?: string; type?: string; category?: string; date?: string; note?: string },
  ) {
    if (input.amount !== undefined && input.amount <= 0) {
      return { error: "จำนวนเงินต้องมากกว่า 0" };
    }
    const data: {
      amount?: number;
      name?: string;
      type?: string;
      category?: string;
      date?: Date;
      note?: string | null;
    } = {};
    if (input.amount !== undefined) data.amount = input.amount;
    if (input.name !== undefined) data.name = input.name;
    if (input.type !== undefined) data.type = input.type;
    if (input.category !== undefined) data.category = input.category;
    if (input.date !== undefined) data.date = new Date(input.date);
    if (input.note !== undefined) data.note = input.note || null;
    const transaction = await TransactionRepository.updateById(id, userId, data);
    return { success: true, transaction };
  },
};
