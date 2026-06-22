import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import ClientProvider from "@/components/ClientProviders/page";
import { dark } from "@clerk/themes";
import { cookies, headers } from "next/headers";
import { ptBR, enUS } from "@clerk/localizations";
import { auth, clerkClient } from "@clerk/nextjs/server";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  

  const cookieStore = await cookies();
  const theme = (cookieStore.get("theme")?.value as "light" | "dark") ??
    "light";
  const isDarkMode = theme === "dark"

  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language") || "";
  const browserLanguage = acceptLanguage.toLowerCase().includes("pt") ? "pt-BR" : "en-US";

  const userLanguage = cookieStore.get("theme")?.value as string || browserLanguage;
  const localization = userLanguage.startsWith("en") ? enUS : ptBR;

  return (
    <html
        lang="pt"
        className={isDarkMode ? "dark" : "light"}
      >
        <body className="box-border h-full w-full! flex flex-col-reverse md:flex-row">
          
          <ClerkProvider
            localization={ localization }
            appearance={{
                theme: isDarkMode ? dark : undefined,

                variables: {
                  ...(isDarkMode && {
                    colorBackground: "#091413",
                  })
                },
              }}
              
          >
            <ClientProvider initialTheme={theme}>    
                {children}
            </ClientProvider>
          </ClerkProvider>
        </body>
      </html>
  );
}
