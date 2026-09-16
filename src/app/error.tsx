"use client"; 

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Geliştirici olarak hatanın detayını konsolda görebilmemiz için
    console.error("Uygulama Hatası Yakalandı:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {/* Dikkat Çekici Hata İkonu */}
      <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-5xl mb-6 shadow-inner animate-pulse">
        ⚠️
      </div>
      
      <h2 className="text-3xl font-bold text-slate-800 mb-4">
        Beklenmedik Bir Sorun Oluştu!
      </h2>
      
      <p className="text-slate-500 max-w-md mb-8 text-lg">
        Sayfayı yüklerken veya sunucuyla iletişim kurarken teknik bir arızayla karşılaştık. Neyse ki durumu kontrol altına aldık.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        {/* "reset" fonksiyonu Next.js'in sayfayı patlamadan önceki halinde yeniden yüklemesini sağlar */}
        <button
          onClick={() => reset()}
          className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-md"
        >
          Tekrar Dene
        </button>
        
        <Link 
          href="/" 
          className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-3 px-8 rounded-lg transition-colors shadow-sm"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}