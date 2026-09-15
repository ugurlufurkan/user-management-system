import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { ToastProvider } from "@/context/toast-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kullanıcı Yönetim Sistemi",
  description: "Gelişmiş kullanıcı ve oturum yönetim sistemi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.className} bg-slate-50 min-h-screen flex flex-col`}>
        
        {/* Tüm uygulamayı ToastProvider ile sarıyoruz ki her yerden mesaj fırlatılabilsin */}
        <ToastProvider>
          
          <Navbar />
          <main className="flex-grow container mx-auto p-4 sm:p-8">
            {children}
          </main>
          
        </ToastProvider>

      </body>
    </html>
  );
}