import { usePrayerTimeTheme, PrayerTimeTheme } from "./PrayerTimeThemeProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sunrise, Sun, Sunset, Moon, Clock } from "lucide-react";

const themeConfig: Record<PrayerTimeTheme, { label: string; icon: typeof Sunrise; description: string }> = {
  fajr: {
    label: "Fajr",
    icon: Sunrise,
    description: "Dawn - Soft morning light"
  },
  dhuhr: {
    label: "Dhuhr",
    icon: Sun,
    description: "Midday - Bright daylight"
  },
  maghrib: {
    label: "Maghrib",
    icon: Sunset,
    description: "Sunset - Warm evening"
  },
  isha: {
    label: "Isha",
    icon: Moon,
    description: "Night - Deep blues"
  }
};

export default function PrayerTimeToggle() {
  const { theme, setTheme, enableAutoMode, isAutoMode } = usePrayerTimeTheme();
  const CurrentIcon = themeConfig[theme].icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          data-testid="button-prayer-time-toggle"
        >
          <CurrentIcon className="w-5 h-5" data-testid={`icon-${theme}`} />
          <span className="sr-only">Toggle prayer time theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56" data-testid="menu-prayer-time-themes">
        <DropdownMenuItem
          onClick={enableAutoMode}
          className={isAutoMode ? "bg-accent" : ""}
          data-testid="menu-item-theme-auto"
        >
          <Clock className="w-4 h-4 mr-3" />
          <div className="flex flex-col">
            <span className="font-semibold">Auto</span>
            <span className="text-xs text-muted-foreground">Follow prayer times</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {(Object.keys(themeConfig) as PrayerTimeTheme[]).map((themeKey) => {
          const config = themeConfig[themeKey];
          const Icon = config.icon;
          const isActive = !isAutoMode && theme === themeKey;
          
          return (
            <DropdownMenuItem
              key={themeKey}
              onClick={() => setTheme(themeKey)}
              className={isActive ? "bg-accent" : ""}
              data-testid={`menu-item-theme-${themeKey}`}
            >
              <Icon className="w-4 h-4 mr-3" />
              <div className="flex flex-col">
                <span className="font-semibold">{config.label}</span>
                <span className="text-xs text-muted-foreground">{config.description}</span>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
