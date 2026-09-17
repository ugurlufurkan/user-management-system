import Link from "next/link";
import { LayoutDashboard, Users, Building2, HelpCircle, Settings, Shield, FileText } from "lucide-react";

const platformLinks = [
  { label: "Ana Sayfa",    href: "/",         icon: <LayoutDashboard size={14} strokeWidth={1.8} /> },
  { label: "Üye Rehberi",  href: "/users",    icon: <Users size={14} strokeWidth={1.8} /> },
  { label: "Departmanlar", href: "/sections", icon: <Building2 size={14} strokeWidth={1.8} /> },
];

const supportLinks = [
  { label: "Sıkça Sorulan Sorular", href: "/faq",      icon: <HelpCircle size={14} strokeWidth={1.8} /> },
  { label: "Hesap Ayarları",        href: "/settings", icon: <Settings size={14} strokeWidth={1.8} /> },
];

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-400 mt-auto border-t border-zinc-800">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 4.5L8 1.5L14 4.5V11.5L8 14.5L2 11.5V4.5Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M2 4.5L8 7.5L14 4.5" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M8 7.5V14.5" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <span className="text-sm font-bold text-zinc-200 tracking-tight">SYSTEM</span>
                <span className="text-[10px] text-zinc-500 ml-1.5 tracking-widest uppercase">Enterprise</span>
              </div>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
              Kurumsal düzeyde kullanıcı, departman ve oturum yönetimi sağlayan güvenli platform. Tüm verileriniz şifreli ve koruma altında.
            </p>
          </div>
          
          {/* Platform */}
          <div>
            <h4 className="text-[11px] font-semibold text-zinc-300 uppercase tracking-widest mb-5">Platform</h4>
            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="flex items-center gap-2.5 text-sm text-zinc-500 hover:text-zinc-200 transition-colors duration-200">
                    <span className="text-zinc-600">{link.icon}</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destek */}
          <div>
            <h4 className="text-[11px] font-semibold text-zinc-300 uppercase tracking-widest mb-5">Destek</h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="flex items-center gap-2.5 text-sm text-zinc-500 hover:text-zinc-200 transition-colors duration-200">
                    <span className="text-zinc-600">{link.icon}</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Alt Çizgi */}
      <div className="border-t border-zinc-800">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-zinc-600">
          <p>&copy; {new Date().getFullYear()} System Enterprise. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 hover:text-zinc-400 cursor-pointer transition-colors">
              <Shield size={12} strokeWidth={1.8} /> Gizlilik
            </span>
            <span className="flex items-center gap-1.5 hover:text-zinc-400 cursor-pointer transition-colors">
              <FileText size={12} strokeWidth={1.8} /> Kullanım Şartları
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}