import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ToastProvider } from "@/context/toast-context"; 

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "User Management System | Aksiyonsoft",
  description: "Aksiyonsoft kurumsal kullanıcı ve departman yönetim platformu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.className} bg-zinc-50 min-h-screen flex flex-col antialiased`}>
        
        <ToastProvider>
          <Navbar />
          
          <main className="flex-grow w-full max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          
          <Footer />
        </ToastProvider>

      </body>
    </html>
  );
}