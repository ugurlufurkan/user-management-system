"use client"; 

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Uygulama Hatası Yakalandı:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="bg-white border border-red-200 rounded-2xl p-8 sm:p-12 text-center max-w-lg shadow-sm">
        
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-red-100">
          <AlertTriangle size={32} strokeWidth={1.8} />
        </div>
        
        <h2 className="text-xl font-bold text-zinc-900 mb-2">
          Beklenmedik Bir Sistem Hatası
        </h2>
        
        <p className="text-sm text-zinc-500 mb-8 leading-relaxed px-4">
          Sayfayı yüklerken veya sunucuyla iletişim kurarken teknik bir sorun oluştu. Sistem yöneticisine bilgi verildi.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white text-[13px] font-semibold py-2.5 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900/40"
          >
            <RefreshCcw size={16} strokeWidth={2} /> Yeniden Dene
          </button>
          
          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 text-[13px] font-semibold py-2.5 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-200"
          >
            <Home size={16} strokeWidth={2} className="text-zinc-400" /> Ana Sayfa
          </Link>
        </div>
        
      </div>
    </div>
  );
}