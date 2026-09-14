"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login"); // Çıkış yapınca giriş sayfasına yolla
      router.refresh(); // Ekrandaki verileri sıfırla
    } catch (error) {
      console.error("Çıkış yapılırken hata oluştu", error);
    }
  };

  return (
    <nav className="bg-slate-900 text-white p-4 shadow-md flex justify-between items-center">
      <div className="font-bold text-xl tracking-tight">
        <Link href="/">UserSystem</Link>
      </div>
      
      <div className="flex gap-5 items-center font-medium text-sm">
        <Link href="/profile" className="hover:text-blue-400 transition-colors">
          Profilim
        </Link>
        <Link href="/login" className="hover:text-blue-400 transition-colors">
          Giriş Yap
        </Link>
        <Link href="/register" className="hover:text-blue-400 transition-colors">
          Kayıt Ol
        </Link>
        
        <button 
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Çıkış Yap
        </button>
      </div>
    </nav>
  );
}