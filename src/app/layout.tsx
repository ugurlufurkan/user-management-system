import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";

// Font ayarımız
const inter = Inter({ subsets: ["latin"] });

// Sitenin sekme (tab) adı ve SEO ayarları
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
      {/* Arka planı hafif gri yapıp tam ekran yüksekliği (min-h-screen) veriyoruz */}
      <body className={`${inter.className} bg-slate-50 min-h-screen flex flex-col`}>
        
        {/* Yazdığımız Navbar sitemizin hep en üstünde duracak */}
        <Navbar />
        
        {/* Diğer sayfaların yükleneceği ana alan */}
        <main className="flex-grow container mx-auto p-4 sm:p-8">
          {children}
        </main>

      </body>
    </html>
  );
}