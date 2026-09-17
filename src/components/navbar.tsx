"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation"; // usePathname'i ekledik

export default function Navbar() {
  const router = useRouter();
  // Tarayıcının şu an hangi URL'de (sayfada) olduğunu yakalıyoruz
  const pathname = usePathname(); 

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login"); 
      router.refresh();
    } catch (error) {
      console.error("Çıkış yapılırken hata oluştu", error);
    }
  };

  // Hangi sayfanın aktif olduğunu hesaplayan ve ona göre stil veren yardımcı fonksiyon
  const getLinkStyle = (path: string) => {
    // Eğer bulunduğumuz sayfa, linkin gittiği sayfayla aynıysa 'aktif' sayıyoruz
    const isActive = pathname === path || pathname.startsWith(`${path}/`);
    
    return isActive 
      ? "text-blue-400 font-bold border-b-2 border-blue-400 pb-1 transition-all" // Aktif (Seçili) sayfa stili
      : "hover:text-blue-400 transition-colors pb-1 border-b-2 border-transparent"; // Normal (Seçili olmayan) link stili
  };

  return (
    <nav className="bg-slate-900 text-white p-4 shadow-md flex justify-between items-center relative z-50">
      <div className="font-bold text-xl tracking-tight">
        <Link href="/">UserSystem</Link>
      </div>
      
      {/* className kısımlarını dinamik getLinkStyle fonksiyonuna bağladık */}
      <div className="flex gap-5 items-center font-medium text-sm flex-wrap">
        <Link href="/profile" className={getLinkStyle("/profile")}>
          Profilim
        </Link>
        
        <Link href="/settings" className={getLinkStyle("/settings")}>
          Ayarlar
        </Link>
        
        <Link href="/users" className={getLinkStyle("/users")}>
          Üyeler
        </Link>
        
        <Link href="/sections" className={getLinkStyle("/sections")}>
          Bölümler
        </Link>
        
        <Link href="/login" className={getLinkStyle("/login")}>
          Giriş Yap
        </Link>
        
        <Link href="/register" className={getLinkStyle("/register")}>
          Kayıt Ol
        </Link>
        
        <button 
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors ml-2"
        >
          Çıkış Yap
        </button>
      </div>
    </nav>
  );
}