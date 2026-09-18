import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAdminAuth } from "@/lib/auth";
import { LayoutDashboard, Users, Building2, ShieldCheck, ExternalLink, Activity } from "lucide-react";

// Sol Menü Linkleri
const adminLinks = [
  { label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={18} strokeWidth={1.8} /> },
  { label: "Kullanıcılar", href: "/admin/users", icon: <Users size={18} strokeWidth={1.8} /> },
  { label: "Departmanlar", href: "/admin/sections", icon: <Building2 size={18} strokeWidth={1.8} /> },
  { label: "Sistem Oturumları", href: "/admin/sessions", icon: <Activity size={18} strokeWidth={1.8} /> },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Güvenlik Duvarı: Sadece ADMIN girebilir
  const admin = await getAdminAuth();
  if (!admin) {
    redirect("/profile");
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col md:flex-row antialiased">
      
      {/* Sol Menü (Sidebar) - Dark Theme */}
      <aside className="w-full md:w-64 bg-zinc-950 text-zinc-300 flex-shrink-0 md:min-h-screen border-r border-zinc-900 flex flex-col">
        <div className="h-[72px] flex items-center px-6 border-b border-zinc-800/60 bg-zinc-950/50">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700/50 group-hover:border-indigo-500/50 transition-colors">
              <ShieldCheck size={18} className="text-indigo-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-bold text-white tracking-tight leading-tight">Admin Console</span>
              <span className="text-[10px] text-zinc-500 font-semibold tracking-widest uppercase">Aksiyonsoft</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {adminLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all group"
            >
              <span className="text-zinc-500 group-hover:text-indigo-400 transition-colors">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800/60">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all group">
            <ExternalLink size={18} className="text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            Uygulamaya Dön
          </Link>
        </div>
      </aside>

      {/* Ana İçerik Alanı */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Üst Header */}
        <header className="h-[72px] bg-white border-b border-zinc-200/80 px-8 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold text-zinc-800 tracking-tight">Yönetim Paneli</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-zinc-900">{admin.firstName} {admin.lastName}</p>
              <p className="text-xs text-indigo-600 font-medium tracking-wide uppercase">Sistem Yöneticisi</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-600 font-bold text-sm">
              {admin.firstName.charAt(0)}{admin.lastName.charAt(0)}
            </div>
          </div>
        </header>

        {/* Sayfa İçeriği */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}