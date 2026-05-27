"use client"
import { Lexend_Deca } from "next/font/google";
import "./globals.css";
import { Box, CssBaseline } from "@mui/material";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppThemeProvider } from "@/contexts/themeContext/page";
import { LanguageProvider } from "@/contexts/languageContext/page";

const queryClient = new QueryClient() 


const lexendDeca = Lexend_Deca({
  variable: "--font-lexend-deca",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt"
      className={lexendDeca.className}
    >

      <body className="box-border h-full w-full! flex flex-col-reverse md:flex-row">
        <QueryClientProvider client={queryClient}>
          <AppThemeProvider>
            <LanguageProvider>
              <CssBaseline />
              <Sidebar />
              <Box className="flex-1 w-full flex flex-col lg:items-center lg:justify-center lg:overflow-x-hidden">
                {children}
              </Box>
            </LanguageProvider>
          </AppThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
