"use client"

import { Box, CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppThemeProvider } from "@/contexts/themeContext/page";
import { LanguageProvider } from "@/contexts/languageContext/page";
import { useState } from "react";

const ClientProvider = ({ children }: { children: React.ReactNode }) => {

    const [queryClient] = useState(() => new QueryClient())
    

    return (
        <QueryClientProvider client={queryClient}>
            <AppThemeProvider>
            <LanguageProvider>
                <CssBaseline />
                <Box className="flex-1 w-full flex flex-col lg:items-center lg:justify-center lg:overflow-x-hidden">
                    {children}
                </Box>
            </LanguageProvider>
            </AppThemeProvider>
        </QueryClientProvider>
    )
}

export default ClientProvider;