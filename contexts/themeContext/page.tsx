"use client"
import { themeMode } from "@/app/theme";
import { useUser } from "@clerk/nextjs";
import { createTheme, ThemeProvider } from "@mui/material"
import { useRouter } from "next/navigation";
import { createContext, useMemo } from "react"

export const ThemeContext = createContext({ toggleTheme: () => {} })

export const AppThemeProvider = ({ children }: {children: React.ReactNode}) => {


    const { user, isLoaded } = useUser()
    const router = useRouter();

    const mode = (user?.unsafeMetadata?.theme as "light" | "dark") || "light"

    const toggleTheme = async () => {
        if(!user) return;
 
        const updateTheme = mode === "light" ? "dark" : "light";

        document.cookie = `theme=${updateTheme}; path=/; max-age=31536000`

        const root = window.document.documentElement;
        if( updateTheme === "dark") {
            root.classList.remove("light");
            root.classList.add("dark")
        } else {
            root.classList.remove("dark");
            root.classList.add("light")
        }

        router.refresh();

        await user.update({
            unsafeMetadata: {
                ...user.unsafeMetadata,
                theme: updateTheme,
            }
        })

        
        
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