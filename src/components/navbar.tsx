"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Building2, HelpCircle, UserCircle, Settings, LogOut, Menu, X } from "lucide-react";
import { useToast } from "@/context/toast-context";

type NavItem = { label: string; href: string; icon: React.ReactNode; };

const primaryNav: NavItem[] = [
  { label: "Ana Sayfa",    href: "/",         icon: <LayoutDashboard size={18} strokeWidth={1.8} /> },
  { label: "Üyeler",       href: "/users",    icon: <Users size={18} strokeWidth={1.8} /> },
  { label: "Departmanlar", href: "/sections", icon: <Building2 size={18} strokeWidth={1.8} /> },
  { label: "SSS",          href: "/faq",      icon: <HelpCircle size={18} strokeWidth={1.8} /> },
];

const userNav: NavItem[] = [
  { label: "Profilim", href: "/profile",  icon: <UserCircle size={18} strokeWidth={1.8} /> },
  { label: "Ayarlar",  href: "/settings", icon: <Settings size={18} strokeWidth={1.8} /> },
];

function isRouteActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

const HIDDEN_ROUTES = ["/login", "/register"];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setMobileMenuOpen(false), [pathname]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => { if (e.key === "Escape") setMobileMenuOpen(false); }, []);
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node) && hamburgerRef.current && !hamburgerRef.current.contains(e.target as Node)) {
      setMobileMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen, handleKeyDown, handleClickOutside]);

  const handleLogout = async () => {
    const confirmed = confirm("Sistemden çıkış yapmak istediğinize emin misiniz?");
    if (!confirmed) return;
    setIsLoggingOut(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
        router.refresh();
      } else {
        showToast("Çıkış yapılırken hata oluştu.", "error");
        setIsLoggingOut(false);
      }
    } catch {
      showToast("Sunucuyla bağlantı kurulamadı.", "error");
      setIsLoggingOut(false);
    }
  };

  if (HIDDEN_ROUTES.includes(pathname)) return null;

  const DesktopNavLink = ({ item }: { item: NavItem }) => {
    const active = isRouteActive(pathname, item.href);
    return (
      <Link href={item.href} className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13.5px] font-medium transition-all duration-200 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:ring-offset-1 ${active ? "text-indigo-700 bg-indigo-50/80" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/70"}`}>
        <span className={`transition-colors duration-200 ${active ? "text-indigo-600" : "text-zinc-400"}`}>{item.icon}</span>
        <span>{item.label}</span>
        {active && <span className="absolute -bottom-[13px] left-1/2 -translate-x-1/2 w-5 h-[2px] bg-indigo-600 rounded-full" />}
      </Link>
    );
  };

  const MobileNavLink = ({ item }: { item: NavItem }) => {
    const active = isRouteActive(pathname, item.href);
    return (
      <Link href={item.href} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 ${active ? "text-indigo-700 bg-indigo-50/90 border border-indigo-100" : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 border border-transparent"}`}>
        <span className={active ? "text-indigo-600" : "text-zinc-400"}>{item.icon}</span>
        <span>{item.label}</span>
        {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />}
      </Link>
    );
  };

  return (
    <>
      <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ease-out ${scrolled ? "bg-white/85 backdrop-blur-xl border-b border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]" : "bg-white/95 backdrop-blur-md border-b border-zinc-100"}`}>
        <div className="max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">
            <div className="flex items-center gap-8">
              
              {/* BRAND BÖLÜMÜ - AKSİYONSOFT LOGOSU VE YAZISI */}
              <Link href="/" className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 rounded-lg">
                <div className="w-[42px] h-[42px] relative flex shrink-0 items-center justify-center bg-white rounded-lg p-0.5 border border-zinc-100 shadow-sm overflow-hidden group-hover:shadow-md transition-shadow">
                  <Image src="/logo.png" alt="Aksiyonsoft Logo" width={40} height={40} className="object-contain" priority />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-[14px] font-bold tracking-tight text-zinc-900 leading-tight">
                    User Management System
                  </span>
                  <span className="text-[10px] font-bold text-indigo-600 tracking-widest uppercase leading-tight mt-[1px]">
                    Aksiyonsoft
                  </span>
                </div>
              </Link>

              <div className="hidden lg:block w-px h-7 bg-zinc-200/80" />
              <div className="hidden lg:flex items-center gap-1">
                {primaryNav.map((item) => <DesktopNavLink key={item.href} item={item} />)}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <div className="hidden lg:flex items-center gap-1">
                {userNav.map((item) => <DesktopNavLink key={item.href} item={item} />)}
                <div className="w-px h-7 bg-zinc-200/80 mx-2" />
                <button onClick={handleLogout} disabled={isLoggingOut} className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13.5px] font-medium transition-all duration-200 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 focus-visible:ring-offset-1 ${isLoggingOut ? "text-zinc-400 cursor-not-allowed" : "text-zinc-500 hover:text-red-600 hover:bg-red-50/80"}`}>
                  <LogOut size={18} strokeWidth={1.8} />
                  <span className="hidden xl:inline">{isLoggingOut ? "Çıkılıyor..." : "Çıkış"}</span>
                </button>
              </div>

              <button ref={hamburgerRef} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40">
                <div className="relative w-5 h-5">
                  <Menu size={20} strokeWidth={1.8} className={`absolute inset-0 transition-all duration-200 ${mobileMenuOpen ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"}`} />
                  <X size={20} strokeWidth={1.8} className={`absolute inset-0 transition-all duration-200 ${mobileMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"}`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className={`fixed inset-0 z-40 bg-black/15 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} />
      
      <div ref={mobileMenuRef} className={`fixed top-[68px] left-0 right-0 z-50 bg-white/98 backdrop-blur-xl border-b border-zinc-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 ease-out lg:hidden overflow-hidden ${mobileMenuOpen ? "max-h-[calc(100vh-68px)] opacity-100" : "max-h-0 opacity-0 border-b-0"}`}>
        <div className="p-5 space-y-6 max-h-[calc(100vh-68px)] overflow-y-auto">
          <div>
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-3 px-1">Platform</p>
            <div className="space-y-1">{primaryNav.map((item) => <MobileNavLink key={item.href} item={item} />)}</div>
          </div>
          <div className="h-px bg-zinc-100" />
          <div>
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-3 px-1">Hesap</p>
            <div className="space-y-1">{userNav.map((item) => <MobileNavLink key={item.href} item={item} />)}</div>
          </div>
          <div className="h-px bg-zinc-100" />
          <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }} disabled={isLoggingOut} className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-200 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 ${isLoggingOut ? "text-zinc-400 border-zinc-100 cursor-not-allowed" : "text-red-600 border-red-100 bg-red-50/50 hover:bg-red-50 hover:border-red-200"}`}>
            <LogOut size={18} strokeWidth={1.8} />
            <span>{isLoggingOut ? "Çıkış yapılıyor..." : "Sistemden Çıkış Yap"}</span>
          </button>
        </div>
      </div>
    </>
  );
}