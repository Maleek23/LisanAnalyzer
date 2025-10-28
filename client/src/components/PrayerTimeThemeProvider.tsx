import { createContext, useContext, useEffect, useState } from "react";

export type PrayerTimeTheme = "fajr" | "dhuhr" | "maghrib" | "isha";

interface PrayerTimeThemeContextType {
  theme: PrayerTimeTheme;
  setTheme: (theme: PrayerTimeTheme) => void;
}

const PrayerTimeThemeContext = createContext<PrayerTimeThemeContextType | undefined>(undefined);

function getSystemTheme(): PrayerTimeTheme {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) return "fajr";
  if (hour >= 12 && hour < 15) return "dhuhr";
  if (hour >= 15 && hour < 19) return "maghrib";
  return "isha";
}

export function PrayerTimeThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<PrayerTimeTheme>(() => {
    if (typeof window === "undefined") {
      return getSystemTheme();
    }
    
    try {
      const stored = localStorage.getItem("prayer-time-theme") as PrayerTimeTheme | null;
      return stored || getSystemTheme();
    } catch {
      return getSystemTheme();
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const root = document.documentElement;
    
    root.classList.remove("theme-fajr", "theme-dhuhr", "theme-maghrib", "theme-isha", "dark");
    
    if (theme === "dhuhr") {
      // Dhuhr uses default :root values - no class needed
    } else {
      root.classList.add(`theme-${theme}`);
    }
    
    try {
      localStorage.setItem("prayer-time-theme", theme);
    } catch {
      // Ignore localStorage errors (e.g., private mode, SSR)
    }
  }, [theme]);

  const setTheme = (newTheme: PrayerTimeTheme) => {
    setThemeState(newTheme);
  };

  return (
    <PrayerTimeThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </PrayerTimeThemeContext.Provider>
  );
}

export function usePrayerTimeTheme() {
  const context = useContext(PrayerTimeThemeContext);
  if (context === undefined) {
    throw new Error("usePrayerTimeTheme must be used within a PrayerTimeThemeProvider");
  }
  return context;
}
