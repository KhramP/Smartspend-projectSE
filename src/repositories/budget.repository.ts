// Repository Pattern: Encapsulates all budget data access logic
// Single Responsibility: Only handles database queries for budgets

import prisma from "@/lib/prisma";

export const BudgetRepository = {
  async upsert(userId: string, category: string, amount: number) {
    return prisma.budget.upsert({
      where: { userId_category: { userId, category } },
      update: { amount },
      create: { userId, category, amount },
    });
  },

  async findByUser(userId: string) {
    return prisma.budget.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
  },

  async findByUserAndCategory(userId: string, category: string) {
    return prisma.budget.findUnique({
      where: { userId_category: { userId, category } },
    });
  },

  async deleteByUserAndCategory(userId: string, category: string) {
    return prisma.budget.delete({
      where: { userId_category: { userId, category } },
    });
  },
};
