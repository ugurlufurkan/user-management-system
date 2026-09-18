import Link from "next/link";
import Image from "next/image";
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
    <footer className="bg-white dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 mt-auto border-t border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div style={{ backgroundColor: "#ffffff" }} className="w-[38px] h-[38px] rounded-md p-1 flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
                <Image src="/logo.png" alt="Aksiyonsoft Logo" width={32} height={32} className="object-contain" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-200 tracking-tight leading-tight">
                  User Management System
                </span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold tracking-widest uppercase mt-[1px]">
                  Aksiyonsoft
                </span>
              </div>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
              Aksiyonsoft güvencesiyle kurumsal düzeyde çalışan, departman ve oturum yönetimi sağlayan güvenli platform. 
            </p>
          </div>
          
          {/* Platform */}
          <div>
            <h4 className="text-[11px] font-semibold text-zinc-900 dark:text-zinc-300 uppercase tracking-widest mb-5">Platform</h4>
            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="flex items-center gap-2.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors duration-200">
                    <span className="text-zinc-400 dark:text-zinc-600">{link.icon}</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destek */}
          <div>
            <h4 className="text-[11px] font-semibold text-zinc-900 dark:text-zinc-300 uppercase tracking-widest mb-5">Destek</h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="flex items-center gap-2.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors duration-200">
                    <span className="text-zinc-400 dark:text-zinc-600">{link.icon}</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Alt Çizgi */}
      <div className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-zinc-500 dark:text-zinc-600">
          <p>&copy; {new Date().getFullYear()} Aksiyonsoft Yazılım. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-zinc-400 cursor-pointer transition-colors">
              <Shield size={12} strokeWidth={1.8} /> Gizlilik
            </span>
            <span className="flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-zinc-400 cursor-pointer transition-colors">
              <FileText size={12} strokeWidth={1.8} /> Kullanım Şartları
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}