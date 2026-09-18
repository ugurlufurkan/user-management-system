import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ToastProvider } from "@/context/toast-context";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "User Management System | Aksiyonsoft",
  description: "Aksiyonsoft kurumsal kullanıcı ve departman yönetim platformu",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col antialiased`}>
        <ThemeProvider>
          <ToastProvider>
            <Navbar />
            
            <main className="flex-grow w-full max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8 py-6">
              {children}
            </main>
            
            <Footer />
            <ThemeToggle />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}