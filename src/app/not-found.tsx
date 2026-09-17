import Link from "next/link";
import { AlertCircle, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      
      <div className="text-center max-w-md w-full">
        {/* Hata İkonu */}
        <div className="w-16 h-16 bg-zinc-100 text-zinc-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-zinc-200/50">
          <AlertCircle size={32} strokeWidth={1.5} />
        </div>
        
        {/* Metinler */}
        <h1 className="text-6xl font-bold text-zinc-900 tracking-tighter mb-2">404</h1>
        <h2 className="text-lg font-semibold text-zinc-700 mb-4 tracking-tight">
          Sayfa Bulunamadı
        </h2>
        
        <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
          Aradığınız sistem rotası mevcut değil veya değiştirilmiş. Geçerli bir URL girdiğinizden emin olun veya güvenli bölgeye dönün.
        </p>
        
        {/* Butonlar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link 
            href="/"
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 px-6 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          >
            <ArrowLeft size={16} strokeWidth={2} /> Ana Sayfaya Dön
          </Link>
          
          <Link 
            href="/users"
            className="flex items-center justify-center gap-2 bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 text-sm font-semibold py-2.5 px-6 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-500/20"
          >
            <Search size={16} strokeWidth={2} className="text-zinc-400" /> Üye Rehberi
          </Link>
        </div>
      </div>

    </div>
  );
}