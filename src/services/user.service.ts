// Service Layer Pattern: Encapsulates business logic for users
// Orchestrates Repository calls and applies business rules

import { UserRepository } from "@/repositories/user.repository";

export const UserService = {
  async getTheme(userId: string) {
    return UserRepository.findThemeById(userId);
  },

  async updateTheme(userId: string, themeColor?: string, themeMode?: string) {
    await UserRepository.updateTheme(userId, { themeColor, themeMode });
    return { success: true };
  },

  async getSettings(userId: string) {
    return UserRepository.findSettingsById(userId);
  },

  async updateSettings(userId: string, name: string) {
    await UserRepository.updateName(userId, name);
    return { success: true };
  },
};
