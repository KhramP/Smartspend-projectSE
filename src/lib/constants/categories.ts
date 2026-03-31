// Centralized category configuration (Strategy: Single Source of Truth)
// Eliminates duplicate category definitions across components

export const CATEGORY_COLORS: Record<string, string> = {
  อาหาร: "#84cc16",
  food: "#84cc16",
  เดินทาง: "#0ea5e9",
  travel: "#0ea5e9",
  บันเทิง: "#8b5cf6",
  entertainment: "#8b5cf6",
  ช้อปปิ้ง: "#f43f5e",
  shopping: "#f43f5e",
  สุขภาพ: "#10b981",
  health: "#10b981",
  การศึกษา: "#ec4899",
  education: "#ec4899",
  ค่าน้ำไฟ: "#f59e0b",
  utilities: "#f59e0b",
  อื่นๆ: "#71717a",
  others: "#71717a",
};

export const CATEGORY_ICONS: Record<string, string> = {
  อาหาร: "🍜",
  food: "🍜",
  เดินทาง: "🚗",
  travel: "🚗",
  บันเทิง: "🎮",
  entertainment: "🎮",
  ช้อปปิ้ง: "🛍️",
  shopping: "🛍️",
  สุขภาพ: "🏥",
  health: "🏥",
  การศึกษา: "📚",
  education: "📚",
  ค่าน้ำไฟ: "💡",
  utilities: "💡",
  อื่นๆ: "📦",
  others: "📦",
};

export const CATEGORY_COLORS_ARRAY = [
  "#84cc16",
  "#0ea5e9",
  "#8b5cf6",
  "#f43f5e",
  "#10b981",
  "#ec4899",
  "#f59e0b",
  "#71717a",
];

export const EXPENSE_CATEGORIES = [
  { id: "food", name: "อาหาร", icon: "🍜" },
  { id: "travel", name: "เดินทาง", icon: "🚌" },
  { id: "entertainment", name: "บันเทิง", icon: "🎮" },
  { id: "health", name: "สุขภาพ", icon: "🏥" },
  { id: "shopping", name: "ช้อปปิ้ง", icon: "🛍️" },
  { id: "education", name: "การศึกษา", icon: "📚" },
  { id: "utilities", name: "ค่าน้ำไฟ", icon: "💡" },
  { id: "others", name: "อื่นๆ", icon: "📦" },
];

export const INCOME_CATEGORIES = [
  { id: "salary", name: "เงินเดือนประจำ", icon: "💰" },
  { id: "extra", name: "รายได้เพิ่มเติม", icon: "📈" },
];

export function getCategoryColor(name: string): string {
  return CATEGORY_COLORS[name] || "#71717a";
}

export function getCategoryIcon(name: string): string {
  return CATEGORY_ICONS[name] || "📦";
}
