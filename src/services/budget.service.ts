// Service Layer Pattern: Encapsulates business logic for budgets
// Orchestrates Repository calls and applies business rules

import { BudgetRepository } from "@/repositories/budget.repository";

export const BudgetService = {
  async createOrUpdateBudget(input: { userId: string; category: string; amount: number }) {
    if (!input.category || !input.category.trim()) {
      return { error: "กรุณาระบุหมวดหมู่" };
    }
    if (!input.amount || input.amount <= 0) {
      return { error: "จำนวนเงินต้องมากกว่า 0" };
    }

    const budget = await BudgetRepository.upsert(input.userId, input.category.trim(), input.amount);
    return { success: true, budget };
  },

  async getUserBudgets(userId: string) {
    return BudgetRepository.findByUser(userId);
  },

  async deleteBudget(userId: string, category: string) {
    await BudgetRepository.deleteByUserAndCategory(userId, category);
    return { success: true };
  },
};
