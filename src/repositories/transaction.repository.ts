// Repository Pattern: Encapsulates all transaction data access logic
// Single Responsibility: Only handles database queries for transactions

import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";

export interface CreateTransactionData {
  amount: number;
  name: string;
  type: string;
  category: string;
  date: Date;
  note?: string | null;
  userId: string;
}

export const TransactionRepository = {
  async create(data: CreateTransactionData) {
    return prisma.transaction.create({
      data: {
        id: randomUUID(),
        amount: data.amount,
        name: data.name,
        type: data.type,
        category: data.category,
        userId: data.userId,
        date: data.date,
        note: data.note || null,
      },
    });
  },

  async findRecentByUser(userId: string, limit = 10) {
    return prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: limit,
    });
  },

  async aggregateByType(userId: string, type: string, dateRange: { start: Date; end: Date }) {
    return prisma.transaction.aggregate({
      where: {
        userId,
        type,
        date: { gte: dateRange.start, lt: dateRange.end },
      },
      _sum: { amount: true },
      _count: true,
    });
  },

  async groupByCategory(userId: string, type: string, dateRange: { start: Date; end: Date }) {
    return prisma.transaction.groupBy({
      by: ["category"],
      where: {
        userId,
        type,
        date: { gte: dateRange.start, lt: dateRange.end },
      },
      _sum: { amount: true },
      _count: true,
    });
  },

  async groupByNameAndCategory(userId: string, type: string, dateRange: { start: Date; end: Date }, limit = 5) {
    return prisma.transaction.groupBy({
      by: ["name", "category"],
      where: {
        userId,
        type,
        date: { gte: dateRange.start },
      },
      _sum: { amount: true },
      _count: true,
      orderBy: { _sum: { amount: "desc" } },
      take: limit,
    });
  },

  async findByUserAndMonths(userId: string, months: { year: number; month: number }[]) {
    if (months.length === 0) return [];

    const conditions = months.map((m) => ({
      date: {
        gte: new Date(m.year, m.month, 1),
        lt: new Date(m.year, m.month + 1, 1),
      },
    }));

    return prisma.transaction.findMany({
      where: { userId, OR: conditions },
      orderBy: { date: "desc" },
    });
  },

  async deleteById(id: string, userId: string) {
    return prisma.transaction.delete({
      where: { id, userId },
    });
  },

  async updateById(
    id: string,
    userId: string,
    data: { amount?: number; name?: string; type?: string; category?: string; date?: Date; note?: string | null },
  ) {
    return prisma.transaction.update({
      where: { id, userId },
      data,
    });
  },
};
