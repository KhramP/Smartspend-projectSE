"use server";

import prisma from "@/lib/prisma";

export async function getUserProfile({ userId }: { userId: string }) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, image: true, plan: true },
  });
  return user;
}

export async function updateUserProfile({ userId, name }: { userId: string; name: string }) {
  if (!name || name.trim().length === 0) {
    return { error: "กรุณากรอกชื่อ" };
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { name: name.trim() },
  });

  return { success: true, user };
}
