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
    take: 5,
  });
  return transactions;
}
