export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      {/* Şık ve modern bir dönen çember (Spinner) animasyonu */}
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      
      <h3 className="mt-5 text-xl font-bold text-slate-700 tracking-tight">Yükleniyor...</h3>
      <p className="text-sm text-slate-400 mt-1">Lütfen bekleyin, verileriniz hazırlanıyor.</p>
    </div>
  );
}