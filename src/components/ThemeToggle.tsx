import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Toggle dark mode"
        >
            {theme === "dark" ? (
                <Sun className="w-4 h-4 text-muted-foreground" />
            ) : (
                <Moon className="w-4 h-4 text-muted-foreground" />
            )}
        </button>
    );
}
