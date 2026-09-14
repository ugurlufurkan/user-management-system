"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      // Yazdığımız Register API'sine verileri yolluyoruz
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Kayıt işlemi başarısız oldu.");
        setLoading(false);
        return;
      }

      // Kayıt başarılıysa otomatik giriş yapılmış demektir, adamı profiline yollayalım
      router.push("/profile");
      router.refresh(); // Navbar'daki "Giriş Yap" butonunun değişmesi için sayfayı tazele
    } catch (err) {
      setError("Sunucuya bağlanırken bir hata oluştu.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">Hesap Oluştur</h1>
      
      {/* Hata Mesajı Gösterimi */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm border border-red-200">
          {error}
        </div>
      )}

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