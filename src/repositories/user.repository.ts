// Repository Pattern: Encapsulates all user data access logic
// Single Responsibility: Only handles database queries for users

import prisma from "@/lib/prisma";

export const UserRepository = {
  async findThemeById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { themeColor: true, themeMode: true },
    });
    return {
      themeColor: user?.themeColor || "#2563eb",
      themeMode: user?.themeMode || "light",
    };
  },

  async updateTheme(userId: string, data: { themeColor?: string; themeMode?: string }) {
    const updateData: Record<string, string> = {};
    if (data.themeColor) updateData.themeColor = data.themeColor;
    if (data.themeMode) updateData.themeMode = data.themeMode;

    return prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
  },

  async findSettingsById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, image: true, plan: true },
    });
  },

  async updateName(userId: string, name: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { name },
    });
  },
};
