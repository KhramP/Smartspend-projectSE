"use client";

import { useEffect, createContext, useContext, useState, useCallback } from "react";

type ThemeContextType = {
  themeMode: string;
  themeColor: string;
  setTheme: (mode: string, color: string) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  themeMode: "light",
  themeColor: "#2563eb",
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeMode] = useState("light");
  const [themeColor, setThemeColor] = useState("#2563eb");

  const applyTheme = useCallback((mode: string) => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const setTheme = useCallback(
    (mode: string, color: string) => {
      setThemeMode(mode);
      setThemeColor(color);
      applyTheme(mode);
    },
    [applyTheme],
  );

  useEffect(() => {
    // Fetch user theme on mount
    async function loadTheme() {
      try {
        const res = await fetch("/api/user/theme");
        if (res.ok) {
          const data = await res.json();
          setThemeMode(data.themeMode || "light");
          setThemeColor(data.themeColor || "#2563eb");
          applyTheme(data.themeMode || "light");
        }
      } catch {
        // Silently fail for unauthenticated users
      }
    }
    loadTheme();
  }, [applyTheme]);

  return <ThemeContext.Provider value={{ themeMode, themeColor, setTheme }}>{children}</ThemeContext.Provider>;
}
