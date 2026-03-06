"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
// Remove the problematic import
// import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: any) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
