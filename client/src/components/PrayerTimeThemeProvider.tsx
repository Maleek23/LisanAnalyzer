import { createContext, useContext, useEffect, useState } from "react";

export type PrayerTimeTheme = "fajr" | "dhuhr" | "maghrib" | "isha";

interface PrayerTimeThemeContextType {
  theme: PrayerTimeTheme;
  setTheme: (theme: PrayerTimeTheme) => void;
  enableAutoMode: () => void;
  isAutoMode: boolean;
}

const PrayerTimeThemeContext = createContext<PrayerTimeThemeContextType | undefined>(undefined);

function getSystemTheme(): PrayerTimeTheme {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const timeInMinutes = hour * 60 + minute;
  
  // Fajr: 04:30 - 06:30 (pre-dawn contemplative hours)
  const fajrStart = 4 * 60 + 30;  // 04:30
  const fajrEnd = 6 * 60 + 30;    // 06:30
  
  // Dhuhr: 11:45 - 14:30 (midday focused study)
  const dhuhrStart = 11 * 60 + 45; // 11:45
  const dhuhrEnd = 14 * 60 + 30;   // 14:30
  
  // Maghrib: 17:00 - 19:30 (sunset reflection)
  const maghribStart = 17 * 60;    // 17:00
  const maghribEnd = 19 * 60 + 30; // 19:30
  
  // Isha: 19:30 onwards until Fajr (night contemplation)
  const ishaStart = 19 * 60 + 30;  // 19:30
  
  if (timeInMinutes >= fajrStart && timeInMinutes < fajrEnd) {
    return "fajr";
  }
  
  if (timeInMinutes >= dhuhrStart && timeInMinutes < dhuhrEnd) {
    return "dhuhr";
  }
  
  if (timeInMinutes >= maghribStart && timeInMinutes < maghribEnd) {
    return "maghrib";
  }
  
  if (timeInMinutes >= ishaStart || timeInMinutes < fajrStart) {
    return "isha";
  }
  
  // Default to Dhuhr for transition periods (Asr time)
  return "dhuhr";
}

export function PrayerTimeThemeProvider({ children }: { children: React.ReactNode }) {
  const [isAutoMode, setIsAutoMode] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return true;
    }
    try {
      return localStorage.getItem("prayer-time-manual-override") !== "true";
    } catch {
      return true;
    }
  });

  const [theme, setThemeState] = useState<PrayerTimeTheme>(() => {
    if (typeof window === "undefined") {
      return getSystemTheme();
    }
    
    try {
      const stored = localStorage.getItem("prayer-time-theme") as PrayerTimeTheme | null;
      const isManual = localStorage.getItem("prayer-time-manual-override") === "true";
      
      // If user manually set a theme, respect it. Otherwise use auto-detection.
      if (stored && isManual) {
        return stored;
      }
      return getSystemTheme();
    } catch {
      return getSystemTheme();
    }
  });

  // Auto-update theme based on time of day
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const checkTheme = () => {
      if (isAutoMode) {
        const systemTheme = getSystemTheme();
        if (systemTheme !== theme) {
          setThemeState(systemTheme);
        }
      }
    };
    
    // Check immediately on mount and when auto mode changes
    checkTheme();
    
    // Check every 10 minutes for theme updates
    const interval = setInterval(checkTheme, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [isAutoMode, theme]);

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
    setIsAutoMode(false);
    // Mark as manual override so auto-switching doesn't interfere
    try {
      localStorage.setItem("prayer-time-manual-override", "true");
    } catch {
      // Ignore
    }
  };

  const enableAutoMode = () => {
    setIsAutoMode(true);
    try {
      localStorage.removeItem("prayer-time-manual-override");
    } catch {
      // Ignore
    }
    // Immediately switch to system theme
    const systemTheme = getSystemTheme();
    setThemeState(systemTheme);
  };

  return (
    <PrayerTimeThemeContext.Provider value={{ theme, setTheme, enableAutoMode, isAutoMode }}>
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
