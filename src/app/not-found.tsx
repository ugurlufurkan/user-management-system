import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      {/* Devasa 404 Arka Plan Yazısı */}
      <div className="text-9xl font-black text-slate-200 mb-2 select-none drop-shadow-sm">
        404
      </div>
      
      <h2 className="text-3xl font-bold text-slate-800 mb-4">
        Eyvah! Sayfa Bulunamadı 🛸
      </h2>
      
      <p className="text-slate-500 max-w-md mb-8 text-lg">
        Görünüşe göre sistemin derinliklerinde kayboldunuz. Aradığınız sayfa silinmiş, adı değiştirilmiş veya hiç var olmamış olabilir.
      </p>
      
      <Link 
        href="/" 
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-md hover:shadow-lg"
      >
        Ana Sayfaya Geri Dön
      </Link>
    </div>
  );
}