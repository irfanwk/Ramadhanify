"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isDark = theme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="relative inline-flex h-10 w-20 items-center justify-start rounded-full bg-secondary p-1 transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background shadow-inner"
            role="switch"
            aria-checked={isDark}
            aria-label="Toggle theme"
        >
            <span className="sr-only">Toggle theme</span>
            
            {/* Sliding Thumb background that covers the active icon */}
            <span
                className={`absolute h-8 w-9 rounded-full bg-primary transition-transform duration-300 ease-in-out shadow-md ${
                    isDark ? "translate-x-9" : "translate-x-0"
                }`}
            />
            
            <div className="relative flex w-full justify-between items-center px-2 pointer-events-none">
                <Sun 
                    size={16} 
                    strokeWidth={isDark ? 2 : 2.5}
                    className={`transition-colors duration-300 z-10 ${
                        !isDark ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    }`} 
                />
                <Moon 
                    size={16} 
                    strokeWidth={!isDark ? 2 : 2.5}
                    className={`transition-colors duration-300 z-10 ${
                        isDark ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    }`} 
                />
            </div>
        </button>
    );
}
