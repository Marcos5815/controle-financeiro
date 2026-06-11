import { Lexend_Deca } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import ClientProvider from "@/components/ClientProviders/page";
import { currentUser } from "@clerk/nextjs/server";
import { dark } from "@clerk/ui/themes";
import { cookies } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  

  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value || "light";
  const isDarkMode = theme === "dark"

  return (
    <html
        lang="pt"
        className={isDarkMode ? "dark" : "light"}
      >
        <body className="box-border h-full w-full! flex flex-col-reverse md:flex-row">
          <ClerkProvider
          appearance={{
              theme: isDarkMode ? dark : "simple",

              variables: {
                ...(isDarkMode && {
                  colorBackground: "#091413",
                })
              },
            }}
          >
                  <ClientProvider>
                    {children}
                  </ClientProvider>
          </ClerkProvider>
        </body>
      </html>
  );
}
