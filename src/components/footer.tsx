import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* LOGO VE AÇIKLAMA */}
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-2xl font-black text-white mb-4 flex items-center gap-2 tracking-tight">
            <span className="text-blue-500">⚡</span> Sistem
          </h3>
          <p className="text-slate-500 max-w-sm leading-relaxed">
            Şirketinizin tüm çalışanlarını, departmanlarını ve aile verilerini tek bir merkezden güvenle yönetebileceğiniz modern platform.
          </p>
        </div>
        
        {/* PLATFORM MENÜSÜ */}
        <div>
          <h4 className="text-slate-200 font-bold mb-6 uppercase tracking-widest text-xs">Platform</h4>
          <ul className="space-y-3 font-medium">
            <li>
              <Link href="/" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                <span className="text-xs">▪</span> Ana Sayfa
              </Link>
            </li>
            <li>
              <Link href="/users" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                <span className="text-xs">▪</span> Üye Rehberi
              </Link>
            </li>
            <li>
              <Link href="/sections" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                <span className="text-xs">▪</span> Departmanlar
              </Link>
            </li>
          </ul>
        </div>

        {/* DESTEK MENÜSÜ VE SSS */}
        <div>
          <h4 className="text-slate-200 font-bold mb-6 uppercase tracking-widest text-xs">Destek</h4>
          <ul className="space-y-3 font-medium">
            <li>
              <Link href="/faq" className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-2">
                <span className="text-xs">▪</span> Sıkça Sorulan Sorular
              </Link>
            </li>
            <li>
              <Link href="/settings" className="hover:text-blue-400 transition-colors flex items-center gap-2">
                <span className="text-xs">▪</span> Hesap Ayarları
              </Link>
            </li>
          </ul>
        </div>
      </div>
      
      {/* EN ALT TELİF HAKKI KISMI */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-800 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <p>&copy; {new Date().getFullYear()} Kullanıcı Yönetim Sistemi. Tüm hakları saklıdır.</p>
        <div className="flex gap-6">
          <span className="hover:text-white cursor-pointer transition-colors">Gizlilik Politikası</span>
          <span className="hover:text-white cursor-pointer transition-colors">Kullanım Şartları</span>
        </div>
      </div>
    </footer>
  );
}