import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      
      {/* Arka plan süslemeleri */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse pointer-events-none"></div>

      {/* 404 ve UFO İkonu */}
      <div className="relative z-10">
        <h1 className="text-[10rem] md:text-[14rem] font-extrabold text-slate-100 tracking-widest select-none">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center -mt-6">
          <span className="text-7xl md:text-8xl drop-shadow-2xl hover:scale-110 transition-transform cursor-pointer">🛸</span>
        </div>
      </div>
      
      {/* Metin ve Butonlar */}
      <div className="text-center -mt-8 relative z-10 max-w-lg">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">
          Uzay Boşluğuna Düştük!
        </h2>
        <p className="text-slate-500 mb-10 text-lg">
          Aradığınız sayfa kara deliğe düşmüş, uzaylılar tarafından kaçırılmış veya hiç var olmamış olabilir. Seni güvenli bölgeye geri götürelim.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] flex items-center justify-center gap-3"
          >
            <span className="text-xl">🏠</span> 
            <span>Ana Sayfaya Dön</span>
          </Link>
          
          <Link 
            href="/users"
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3.5 px-8 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-3"
          >
            <span className="text-xl">👥</span> 
            <span>Üye Rehberine Git</span>
          </Link>
        </div>
      </div>

    </div>
  );
}