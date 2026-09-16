import Link from "next/link";

export default function Footer() {
  return (
    // mt-auto özelliği ile sayfanın içeriği az olsa bile footer'ın her zaman en altta kalmasını sağlıyoruz
    <footer className="bg-slate-900 text-slate-400 py-12 mt-auto border-t border-slate-800">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Üst Kısım: Sütunlar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div>
            <h3 className="text-white font-bold text-xl mb-4 tracking-tight">UserSystem</h3>
            <p className="text-sm leading-relaxed max-w-xs">
              Şirketinizin tüm departmanlarını ve kullanıcı verilerini güvenle yönetebileceğiniz, modern ve hızlı altyapı.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:text-blue-400 transition-colors">Ana Sayfa</Link></li>
              <li><Link href="/users" className="hover:text-blue-400 transition-colors">Sistem Üyeleri</Link></li>
              <li><Link href="/sections" className="hover:text-blue-400 transition-colors">Departmanlar</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Destek & Yasal</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Gizlilik Politikası</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Kullanım Koşulları</Link></li>
              <li><Link href="#" className="hover:text-blue-400 transition-colors">Bize Ulaşın</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Alt Kısım: Telif Hakkı ve İmza */}
        <div className="pt-8 border-t border-slate-800 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} UserSystem. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-6 font-medium">
            <span className="text-blue-400/80 bg-blue-900/30 px-3 py-1 rounded-full text-xs border border-blue-800/50">
              v1.0.0 Stable
            </span>
            <span className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
              Aksiyon Soft tarafından geliştirildi.
            </span>
          </div>
        </div>
        
      </div>
    </footer>
  );
}