// This script runs BEFORE React renders to prevent theme flash
// It immediately applies the saved theme or defaults to system theme

export function initializeTheme() {
  const applyTheme = (themeMode: "light" | "dark" | "system") => {
    let actualTheme: "light" | "dark";
    
    if (themeMode === "system") {
      actualTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else {
      actualTheme = themeMode;
    }
    
    document.documentElement.classList.toggle("dark", actualTheme === "dark");
  };

  const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "system" | null;
  const initialTheme = savedTheme || "system";
  
  applyTheme(initialTheme);
}
