"use client"
import { themeMode } from "@/app/theme";
import { createTheme, ThemeProvider } from "@mui/material"
import { createContext, useMemo, useState } from "react"

export const ThemeContext = createContext({ toggleTheme: () => {} })

export const AppThemeProvider = ({ children }: {children: React.ReactNode}) => {

    const [mode, setMode] = useState<"light" | "dark">("light");

    const toggleTheme = () => {
        setMode((prev) => (prev === "light" ? "dark" : "light"))
    }

    const theme = useMemo(() => createTheme(themeMode(mode)), [mode])

    return (
        <ThemeContext.Provider value={{ toggleTheme }}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    )
}