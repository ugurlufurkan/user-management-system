"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/context/toast-context";
import { Eye, EyeOff, ArrowRight, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Giriş işlemi başarısız oldu.", "error");
        setLoading(false);
        return;
      }

      showToast("Başarıyla giriş yapıldı, yönlendiriliyorsunuz...", "success");
      router.push("/profile");
      router.refresh(); 
    } catch {
      showToast("Sunucuya bağlanırken bir hata oluştu.", "error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 -mt-6">
      <div className="w-full max-w-[420px]">
        
        {/* Brand / Logo */}
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="w-[60px] h-[60px] bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm border border-zinc-200/60 p-1">
            <Image src="/logo.png" alt="Aksiyonsoft Logo" width={48} height={48} className="object-contain" priority />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight mb-1">User Management System</h1>
          <p className="text-sm font-semibold text-indigo-600 tracking-widest uppercase mt-1 mb-2">Aksiyonsoft</p>
          <p className="text-[13px] text-zinc-500 mt-2">Devam etmek için kimlik bilgilerinizi girin</p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-zinc-200/80 rounded-xl p-7 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label htmlFor="email" className="block text-[13px] font-medium text-zinc-700 mb-1.5">E-posta Adresi</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"><Mail size={16} strokeWidth={1.8} /></span>
                <input id="email" type="email" name="email" required autoComplete="email" placeholder="ornek@sirket.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all duration-200" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[13px] font-medium text-zinc-700 mb-1.5">Şifre</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"><Lock size={16} strokeWidth={1.8} /></span>
                <input id="password" type={showPassword ? "text" : "password"} name="password" required autoComplete="current-password" placeholder="Şifrenizi girin"
                  className="w-full pl-10 pr-11 py-2.5 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all duration-200" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors duration-200 focus:outline-none" aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}>
                  {showPassword ? <EyeOff size={16} strokeWidth={1.8} /> : <Eye size={16} strokeWidth={1.8} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:bg-indigo-400 mt-1">
              {loading ? <span>Giriş Yapılıyor...</span> : <><span>Giriş Yap</span><ArrowRight size={16} strokeWidth={2} /></>}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Hesabınız yok mu? <Link href="/register" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors duration-200">Kayıt Olun</Link>
        </p>
      </div>
    </div>
  );
}