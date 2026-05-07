"use client"
import { themeMode } from "@/app/theme";
import { createTheme, ThemeProvider } from "@mui/material"
import { createContext, useEffect, useMemo, useState } from "react"

export const ThemeContext = createContext({ toggleTheme: () => {} })

const storage = localStorage; 
const savedTheme = storage.getItem("theme") as "light" | "dark";

const getInitialTheme = (): "light" | "dark" => {
    if (typeof window !== "undefined") {
        const saveTheme = localStorage.getItem("theme");
        return (saveTheme === "light" || saveTheme === "dark") ? savedTheme : "light"
    }
    return "light";
}

export const AppThemeProvider = ({ children }: {children: React.ReactNode}) => {


    const [mode, setMode] = useState<"light" | "dark">(getInitialTheme);

    const toggleTheme = () => {
        setMode((prev) => (prev === "light" ? "dark" : "light"))
    }



    

    useEffect(() => {
        localStorage.setItem("theme", mode)
    }, [mode])

    const theme = useMemo(() => createTheme(themeMode(mode)), [mode])

    return (
        <ThemeContext.Provider value={{ toggleTheme }}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    )
}