"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/context/toast-context";

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast(); 
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // HATA BİLDİRİMİ! ⚠️
        showToast(data.error || "Kayıt işlemi başarısız oldu.", "error");
        setLoading(false);
        return;
      }

      // BAŞARI BİLDİRİMİ! 🚀
      showToast("Kayıt başarılı! Hesabınıza yönlendiriliyorsunuz...", "success");
      
      router.push("/profile");
      router.refresh(); 
    } catch (err) {
      showToast("Sunucuya bağlanırken bir hata oluştu.", "error");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">Hesap Oluştur</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Ad</label>
            <input 
              type="text" 
              name="firstName" 
              required 
              className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Soyad</label>
            <input 
              type="text" 
              name="lastName" 
              required 
              className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">E-posta</label>
          <input 
            type="email" 
            name="email" 
            required 
            className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Şifre</label>
          <input 
            type="password" 
            name="password" 
            required 
            minLength={6}
            className="w-full border border-slate-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-md transition-colors disabled:bg-blue-400"
        >
          {loading ? "Kayıt Yapılıyor..." : "Kayıt Ol"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500">
        Zaten hesabınız var mı? <Link href="/login" className="text-blue-600 font-semibold hover:underline">Giriş Yapın</Link>
      </div>
    </div>
  );
}