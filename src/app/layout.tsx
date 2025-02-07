import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Header from "@/components/header/Header";
import { ThemeProvider } from "@/components/themeProvider";

export const metadata: Metadata = {
  title: "LinkedIn Clone",
  description: "LinkedIn Clone by Ak-ZeRo",
  openGraph: {
    images: "/logo.png",
  },
  appleWebApp: {
    capable: true,
    title: "LinkedIn Clone",
    statusBarStyle: "default",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkedIn Clone",
    description: "LinkedIn Clone by Ak-ZeRo",
    images: "/logo.png",
  },
  keywords: [
    "LinkedIn",
    "Clone",
    "LinkedIn Clone",
    "LinkedIn Clone by Ak-ZeRo",
  ],
  authors: [{ name: "Ak-ZeRo", url: "https://github.com/Ak-ZeRo-Dev" }],
  creator: "Ak-ZeRo",
  publisher: "Ak-ZeRo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="flex min-h-screen flex-col overflow-x-hidden transition-all">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <div className="w-full flex-1 bg-[#f4f2ed] dark:bg-gray-900">
              <main className="container-center">{children}</main>
            </div>
            <Toaster
              toastOptions={{
                className: "border-none bg-background select-none",
                // closeButton: true,
                classNames: {
                  closeButton: "!bg-background !border-border !shadow-lg",
                  success: "text-green-500",
                  error: "text-destructive",
                  info: "text-blue-500",
                  warning: "text-yellow-500",
                  default: "text-foreground",
                },
              }}
            />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
