"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/context/toast-context";

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
    } catch (err) {
      showToast("Sunucuya bağlanırken bir hata oluştu.", "error");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">Giriş Yap</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">E-posta</label>
          <input 
            type="email" 
            name="email" 
            required 
            className="w-full border border-slate-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Şifre</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              name="password" 
              required 
              className="w-full border border-slate-300 rounded-md p-3 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
            
            {/* Göster/Gizle Butonu */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-blue-600 focus:outline-none transition-colors"
            >
              {showPassword ? "GİZLE" : "GÖSTER"}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition-colors disabled:bg-blue-400 shadow-sm"
        >
          {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500">
        Hesabınız yok mu? <Link href="/register" className="text-blue-600 font-semibold hover:underline">Kayıt Olun</Link>
      </div>
    </div>
  );
}