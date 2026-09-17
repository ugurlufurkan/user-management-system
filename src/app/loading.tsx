export default function Loading() {
  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center">
      
      {/* Animasyonlu Dönen Çember */}
      <div className="relative flex items-center justify-center w-24 h-24 mb-8">
        {/* Arka plan sabit çemberi */}
        <div className="absolute inset-0 border-4 border-slate-100 rounded-full shadow-inner"></div>
        
        {/* Dönen mavi çember */}
        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin drop-shadow-md"></div>
        
        {/* Ortadaki sabit ikon */}
        <div className="text-3xl animate-pulse">⏳</div>
      </div>
      
      <h2 className="text-2xl font-bold text-slate-700 tracking-widest uppercase mb-4">
        Yükleniyor
      </h2>
      
      {/* Zıplayan 3 Nokta Animasyonu */}
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
        <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
        <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
      </div>
      
      <p className="mt-6 text-slate-400 font-medium text-sm animate-pulse">
        Lütfen bekleyin, veriler hazırlanıyor...
      </p>

    </div>
  );
}