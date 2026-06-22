"use client"
import { useProfile } from "@/api/profile";
import { themeMode } from "@/app/theme";
import { useUser } from "@clerk/nextjs";
import { createTheme, ThemeProvider } from "@mui/material"
import { useRouter } from "next/navigation";
import { createContext, useMemo, useState } from "react"
import Cookies from "js-cookie";

export const ThemeContext = createContext({
    toggleTheme: () => {} })

export const AppThemeProvider = ({ children, initialTheme }: {children: React.ReactNode, initialTheme: "light" | "dark"}) => {


    const { user, isLoaded } = useUser()
    const {  mutateUpdateUser } = useProfile()
    const router = useRouter();

    // const mode = (Cookies.get("theme") as "dark" | "light") || "light"
    const [mode, setMode] = useState<"light" | "dark">(initialTheme);


    const toggleTheme = async () => {
        if(!user) return;
        
        const updateTheme = mode === "light" ? "dark" : "light";
        setMode(updateTheme)

        mutateUpdateUser({id: user.id, theme: updateTheme})
        Cookies.set("theme", updateTheme, {path: "/", expires: 365});

        router.refresh();
    }

    const theme = useMemo(() => createTheme(themeMode(mode)), [mode])

    if(!isLoaded) {
        const defaultTheme = createTheme(themeMode("light"))
        return(
           <ThemeProvider theme={defaultTheme}>
                {children}
            </ThemeProvider> 
        )
    }

    return (
        <ThemeContext.Provider value={{ toggleTheme }}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    )
}