"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
        
        {/* Brand */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center mx-auto mb-5 shadow-sm">
            <svg width="22" height="22" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 4.5L8 1.5L14 4.5V11.5L8 14.5L2 11.5V4.5Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M2 4.5L8 7.5L14 4.5" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M8 7.5V14.5" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight mb-1">Hesabınıza Giriş Yapın</h1>
          <p className="text-sm text-zinc-500">Devam etmek için kimlik bilgilerinizi girin</p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-zinc-200/80 rounded-xl p-7 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-[13px] font-medium text-zinc-700 mb-1.5">
                E-posta Adresi
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                  <Mail size={16} strokeWidth={1.8} />
                </span>
                <input 
                  id="email"
                  type="email" 
                  name="email" 
                  required
                  autoComplete="email"
                  placeholder="ornek@sirket.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400
                    transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-[13px] font-medium text-zinc-700 mb-1.5">
                Şifre
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                  <Lock size={16} strokeWidth={1.8} />
                </span>
                <input 
                  id="password"
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  required
                  autoComplete="current-password"
                  placeholder="Şifrenizi girin"
                  className="w-full pl-10 pr-11 py-2.5 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400
                    transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors duration-200 focus:outline-none"
                  aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                >
                  {showPassword 
                    ? <EyeOff size={16} strokeWidth={1.8} /> 
                    : <Eye size={16} strokeWidth={1.8} />
                  }
                </button>
              </div>
            </div>

            {/* Submit */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 rounded-lg
                transition-all duration-200 disabled:bg-indigo-400 disabled:cursor-not-allowed
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:ring-offset-2
                mt-1"
            >
              {loading ? (
                <span>Giriş Yapılıyor...</span>
              ) : (
                <>
                  <span>Giriş Yap</span>
                  <ArrowRight size={16} strokeWidth={2} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center text-sm text-zinc-500 mt-6">
          Hesabınız yok mu?{" "}
          <Link href="/register" className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors duration-200">
            Kayıt Olun
          </Link>
        </p>
      </div>
    </div>
  );
}