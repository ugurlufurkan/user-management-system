"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  HelpCircle,
  UserCircle,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useToast } from "@/context/toast-context";

// ─── Type Definitions ────────────────────────────────────────────────
type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

// ─── Navigation Data ─────────────────────────────────────────────────
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

// ─── Route Matching ──────────────────────────────────────────────────
function isRouteActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

// ─── Hidden Routes (Login / Register) ────────────────────────────────
const HIDDEN_ROUTES = ["/login", "/register"];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NAVBAR COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // ── Scroll Detection ───────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Close mobile menu on route change ──────────────────────────────
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // ── Close mobile menu on Escape or outside click ───────────────────
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setMobileMenuOpen(false);
  }, []);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(e.target as Node) &&
      hamburgerRef.current &&
      !hamburgerRef.current.contains(e.target as Node)
    ) {
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

  // ── Logout Handler ─────────────────────────────────────────────────
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
        showToast("Çıkış yapılırken bir hata oluştu.", "error");
        setIsLoggingOut(false);
      }
    } catch {
      showToast("Sunucuyla bağlantı kurulamadı.", "error");
      setIsLoggingOut(false);
    }
  };

  // ── Hide on auth pages ─────────────────────────────────────────────
  if (HIDDEN_ROUTES.includes(pathname)) return null;

  // ── Desktop NavLink ────────────────────────────────────────────────
  const DesktopNavLink = ({ item }: { item: NavItem }) => {
    const active = isRouteActive(pathname, item.href);
    return (
      <Link
        href={item.href}
        className={`
          relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13.5px] font-medium
          transition-all duration-200 select-none
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:ring-offset-1
          ${active
            ? "text-indigo-700 bg-indigo-50/80"
            : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/70"
          }
        `}
        aria-current={active ? "page" : undefined}
      >
        <span className={`transition-colors duration-200 ${active ? "text-indigo-600" : "text-zinc-400 group-hover:text-zinc-600"}`}>
          {item.icon}
        </span>
        <span>{item.label}</span>
        {active && (
          <span className="absolute -bottom-[13px] left-1/2 -translate-x-1/2 w-5 h-[2px] bg-indigo-600 rounded-full" />
        )}
      </Link>
    );
  };

  // ── Mobile NavLink ─────────────────────────────────────────────────
  const MobileNavLink = ({ item }: { item: NavItem }) => {
    const active = isRouteActive(pathname, item.href);
    return (
      <Link
        href={item.href}
        onClick={() => setMobileMenuOpen(false)}
        className={`
          flex items-center gap-3.5 px-4 py-3 rounded-xl text-[15px] font-medium
          transition-all duration-200
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40
          ${active
            ? "text-indigo-700 bg-indigo-50/90 border border-indigo-100"
            : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 border border-transparent"
          }
        `}
        aria-current={active ? "page" : undefined}
      >
        <span className={active ? "text-indigo-600" : "text-zinc-400"}>
          {item.icon}
        </span>
        <span>{item.label}</span>
        {active && (
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />
        )}
      </Link>
    );
  };

  return (
    <>
      <nav
        role="navigation"
        aria-label="Ana gezinti menüsü"
        className={`
          sticky top-0 z-50 w-full
          transition-all duration-300 ease-out
          ${scrolled
            ? "bg-white/85 backdrop-blur-xl border-b border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            : "bg-white/95 backdrop-blur-md border-b border-zinc-100"
          }
        `}
      >
        <div className="max-w-[1280px] mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">

            {/* ─── LEFT: Brand + Primary Nav ──────────────────────── */}
            <div className="flex items-center gap-10">

              {/* Brand */}
              <Link
                href="/"
                className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 rounded-lg"
                aria-label="Ana sayfaya git"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 4.5L8 1.5L14 4.5V11.5L8 14.5L2 11.5V4.5Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M2 4.5L8 7.5L14 4.5" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M8 7.5V14.5" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[15px] font-bold tracking-tight text-zinc-900 leading-tight">
                    SYSTEM
                  </span>
                  <span className="text-[10px] font-medium text-zinc-400 tracking-widest uppercase leading-tight hidden sm:block">
                    Enterprise
                  </span>
                </div>
              </Link>

              {/* Divider */}
              <div className="hidden lg:block w-px h-7 bg-zinc-200/80" />

              {/* Desktop Primary Navigation */}
              <div className="hidden lg:flex items-center gap-1">
                {primaryNav.map((item) => (
                  <DesktopNavLink key={item.href} item={item} />
                ))}
              </div>
            </div>

            {/* ─── RIGHT: User Area ───────────────────────────────── */}
            <div className="flex items-center gap-1">

              {/* Desktop User Navigation */}
              <div className="hidden lg:flex items-center gap-1">
                {userNav.map((item) => (
                  <DesktopNavLink key={item.href} item={item} />
                ))}

                {/* Divider */}
                <div className="w-px h-7 bg-zinc-200/80 mx-2" />

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  aria-label="Sistemden çıkış yap"
                  className={`
                    flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13.5px] font-medium
                    transition-all duration-200 select-none
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 focus-visible:ring-offset-1
                    ${isLoggingOut
                      ? "text-zinc-400 cursor-not-allowed"
                      : "text-zinc-500 hover:text-red-600 hover:bg-red-50/80"
                    }
                  `}
                >
                  <LogOut size={18} strokeWidth={1.8} />
                  <span className="hidden xl:inline">{isLoggingOut ? "Çıkılıyor..." : "Çıkış"}</span>
                </button>
              </div>

              {/* ─── Mobile Hamburger ─────────────────────────────── */}
              <button
                ref={hamburgerRef}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
                aria-label={mobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <div className="relative w-5 h-5">
                  <Menu
                    size={20}
                    strokeWidth={1.8}
                    className={`absolute inset-0 transition-all duration-250 ${mobileMenuOpen ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"}`}
                  />
                  <X
                    size={20}
                    strokeWidth={1.8}
                    className={`absolute inset-0 transition-all duration-250 ${mobileMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"}`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── Mobile Overlay ─────────────────────────────────────────── */}
      <div
        className={`
          fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]
          transition-opacity duration-300
          lg:hidden
          ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        aria-hidden="true"
      />

      {/* ─── Mobile Menu Panel ──────────────────────────────────────── */}
      <div
        ref={mobileMenuRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobil gezinti menüsü"
        className={`
          fixed top-[68px] left-0 right-0 z-50
          bg-white/98 backdrop-blur-xl
          border-b border-zinc-200/80
          shadow-[0_8px_30px_rgba(0,0,0,0.06)]
          transition-all duration-300 ease-out
          lg:hidden overflow-hidden
          ${mobileMenuOpen ? "max-h-[calc(100vh-68px)] opacity-100" : "max-h-0 opacity-0 border-b-0"}
        `}
      >
        <div className="p-5 space-y-6 max-h-[calc(100vh-68px)] overflow-y-auto">

          {/* Mobile Primary Nav */}
          <div>
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-3 px-1">
              Platform
            </p>
            <div className="space-y-1">
              {primaryNav.map((item) => (
                <MobileNavLink key={item.href} item={item} />
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-zinc-100" />

          {/* Mobile User Nav */}
          <div>
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-3 px-1">
              Hesap
            </p>
            <div className="space-y-1">
              {userNav.map((item) => (
                <MobileNavLink key={item.href} item={item} />
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-zinc-100" />

          {/* Mobile Logout */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleLogout();
            }}
            disabled={isLoggingOut}
            className={`
              w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[15px] font-medium
              transition-all duration-200 border
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40
              ${isLoggingOut
                ? "text-zinc-400 border-zinc-100 cursor-not-allowed"
                : "text-red-600 border-red-100 bg-red-50/50 hover:bg-red-50 hover:border-red-200"
              }
            `}
            aria-label="Sistemden çıkış yap"
          >
            <LogOut size={18} strokeWidth={1.8} />
            <span>{isLoggingOut ? "Çıkış yapılıyor..." : "Sistemden Çıkış Yap"}</span>
          </button>
        </div>
      </div>
    </>
  );
}