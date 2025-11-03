import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  const applyTheme = (themeMode: "light" | "dark" | "system") => {
    let actualTheme: "light" | "dark";
    
    if (themeMode === "system") {
      actualTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else {
      actualTheme = themeMode;
    }
    
    document.documentElement.classList.toggle("dark", actualTheme === "dark");
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "system" | null;
    const initialTheme = savedTheme || "system";
    
    setTheme(initialTheme);
    applyTheme(initialTheme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      const currentTheme = localStorage.getItem("theme") as "light" | "dark" | "system" | null;
      if (currentTheme === "system" || !currentTheme) {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    let newTheme: "light" | "dark" | "system";
    
    if (theme === "system") {
      newTheme = "light";
    } else if (theme === "light") {
      newTheme = "dark";
    } else {
      newTheme = "system";
    }
    
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative h-10 w-10 rounded-full hover:bg-accent transition-all"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all data-[theme=dark]:rotate-90 data-[theme=dark]:scale-0 data-[theme=system]:rotate-90 data-[theme=system]:scale-0" data-theme={theme} />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all data-[theme=dark]:rotate-0 data-[theme=dark]:scale-100 data-[theme=system]:rotate-90 data-[theme=system]:scale-0" data-theme={theme} />
      <Monitor className="absolute h-5 w-5 rotate-90 scale-0 transition-all data-[theme=system]:rotate-0 data-[theme=system]:scale-100" data-theme={theme} />
    </Button>
  );
}
