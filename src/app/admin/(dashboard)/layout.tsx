"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Package,
  Tag,
  Image as ImageIcon,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  Search,
  User,
  Layers,
  ExternalLink,
  CheckCheck,
  Newspaper,
  Sliders,
  MessageSquare,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppToast } from "@/components/ui/AppToast";
import { Offcanvas } from "@/components/ui";

interface AdminUser {
  email: string;
  name: string;
  role: string;
}

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, badge: null },
  { label: "Products",  href: "/admin/products",   icon: Package,         badge: null },
  { label: "Categories",href: "/admin/categories", icon: Layers,          badge: null },
  { label: "Brands",    href: "/admin/brands",      icon: Tag,             badge: null },
  { label: "Gallery",   href: "/admin/gallery",     icon: ImageIcon,       badge: null },
  { label: "Blogs",     href: "/admin/blogs",       icon: Newspaper,       badge: null },
  { label: "Inquiries", href: "/admin/inquiries",   icon: Mail,            badge: null },
  { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquare, badge: null },
  { label: "Catalogues", href: "/admin/catalogues", icon: Download, badge: null },
  { label: "Slider Settings", href: "/admin/slider-settings", icon: Sliders, badge: null },
  { label: "Settings",  href: "/admin/settings",    icon: Settings,        badge: null },
];


/* ─── Sidebar (shared between desktop & mobile drawer) ─────────────── */
function SidebarContent({
  admin,
  pathname,
  onClose,
  onLogout,
  inquiriesBadge,
}: {
  admin: AdminUser;
  pathname: string;
  onClose: () => void;
  onLogout: () => void;
  inquiriesBadge: string | null;
}) {
  return (
    <div className="flex flex-col h-full bg-[#0f0f0f]">
      {/* Logo row */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
        <Link href="/admin" onClick={onClose} className="flex-shrink-0">
          <Image
            src="/logo-western.png"
            alt="Western Interio AI"
            width={140}
            height={50}
            className="h-10 w-auto bg-white p-1 rounded-lg"
          />
        </Link>
        {/* Close button — mobile only */}
        <button
          id="close-sidebar"
          onClick={onClose}
          className="lg:hidden text-white/40 hover:text-white cursor-pointer transition-colors p-1"
        >
          <X size={18} />
        </button>
      </div>

      {/* Admin badge */}
      <div className="px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-[#ed1c27]/10 border border-[#ed1c27]/20">
          <div className="w-8 h-8 rounded-full bg-[#ed1c27] flex items-center justify-center flex-shrink-0">
            <User size={14} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-widest text-white truncate">
              {admin.name}
            </p>
            <p className="text-[9px] font-semibold uppercase tracking-widest text-[#ed1c27] mt-0.5">
              {admin.role}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-4 py-3 space-y-0.5 no-scrollbar">
        <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/25 px-3 mb-3">
          Navigation
        </p>
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          const badgeValue = item.label === "Inquiries" ? inquiriesBadge : item.badge;

          return (
            <Link
              key={item.href}
              href={item.href}
              id={`admin-nav-${item.label.toLowerCase()}`}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl font-semibold transition-all duration-200 group",
                isActive
                  ? "bg-[#ed1c27] text-white shadow-lg shadow-[#ed1c27]/20"
                  : "text-white/45 hover:text-white hover:bg-white/[0.06]"
              )}
            >
              <item.icon
                size={16}
                className={cn(
                  "flex-shrink-0",
                  isActive
                    ? "text-white"
                    : "text-white/35 group-hover:text-white transition-colors"
                )}
              />
              <span className="text-[11px] uppercase tracking-widest flex-1 min-w-0 truncate">
                {item.label}
              </span>
              {badgeValue && (
                <span
                  className={cn(
                    "text-[9px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-none",
                    isActive ? "bg-white/20 text-white" : "bg-[#ed1c27] text-white"
                  )}
                >
                  {badgeValue}
                </span>
              )}
              {isActive && <ChevronRight size={12} className="text-white/50 flex-shrink-0" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/[0.06] space-y-0.5">
        <Link
          href="/"
          target="_blank"
          id="view-site-link"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-white/30 hover:text-white/70 hover:bg-white/[0.04] transition-all"
        >
          <ExternalLink size={15} className="flex-shrink-0" />
          <span className="text-[11px] font-bold uppercase tracking-widest">View Store</span>
        </Link>
        <button
          id="admin-logout-btn"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-400/[0.07] transition-all duration-200 cursor-pointer"
        >
          <LogOut size={15} className="flex-shrink-0" />
          <span className="text-[11px] font-bold uppercase tracking-widest">Sign Out</span>
        </button>
      </div>
    </div>
  );
}

/* ─── Notification data ────────────────────────────────────────────── */
const mockNotifications = [
  {
    id: 1,
    type: "inquiry",
    title: "New Inquiry Received",
    desc: "Ramesh Kumar asked about Vitrified Tiles.",
    time: "2 min ago",
    unread: true,
    icon: MessageSquare,
    iconBg: "bg-red-50 text-[#ed1c27]",
  },
  {
    id: 2,
    type: "inquiry",
    title: "New Inquiry Received",
    desc: "Priya Sharma requested a quote for Wooden Flooring.",
    time: "18 min ago",
    unread: true,
    icon: MessageSquare,
    iconBg: "bg-red-50 text-[#ed1c27]",
  },
  {
    id: 3,
    type: "product",
    title: "Product Stock Low",
    desc: "Premium Marble Tiles — only 3 units left.",
    time: "1 hr ago",
    unread: true,
    icon: Package,
    iconBg: "bg-amber-50 text-amber-500",
  },
  {
    id: 4,
    type: "gallery",
    title: "Gallery Updated",
    desc: "5 new images added to the Showroom album.",
    time: "3 hr ago",
    unread: false,
    icon: ImageIcon,
    iconBg: "bg-emerald-50 text-emerald-500",
  },
  {
    id: 5,
    type: "inquiry",
    title: "Inquiry Resolved",
    desc: "Suresh Patel — Bathroom Fittings query marked closed.",
    time: "Yesterday",
    unread: false,
    icon: MessageSquare,
    iconBg: "bg-gray-50 text-gray-400",
  },
];

/* ─── Notification Offcanvas ────────────────────────────────────────── */
function NotificationPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

  const markRead = (id: number) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );

  return (
    <Offcanvas isOpen={open} onClose={onClose} position="right" className="w-full max-w-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-[13px] font-bold uppercase tracking-widest text-gray-900">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <p className="text-[10px] font-semibold text-[#ed1c27] mt-0.5">
                {unreadCount} unread
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                id="mark-all-read-btn"
                onClick={markAllRead}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#ed1c27] transition-colors cursor-pointer px-3 py-1.5 rounded-lg hover:bg-gray-50"
              >
                <CheckCheck size={13} />
                All read
              </button>
            )}
            <button
              id="close-notifications-btn"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {notifications.map((notif) => (
            <button
              key={notif.id}
              id={`notification-${notif.id}`}
              onClick={() => markRead(notif.id)}
              className={cn(
                "w-full text-left flex items-start gap-4 px-5 py-4 transition-colors cursor-pointer group",
                notif.unread ? "bg-[#ed1c27]/[0.03] hover:bg-[#ed1c27]/[0.06]" : "hover:bg-gray-50"
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5",
                  notif.iconBg
                )}
              >
                <notif.icon size={16} />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={cn(
                      "text-[11px] uppercase tracking-wide leading-snug",
                      notif.unread ? "font-bold text-gray-900" : "font-semibold text-gray-600"
                    )}
                  >
                    {notif.title}
                  </p>
                  {notif.unread && (
                    <span className="w-2 h-2 rounded-full bg-[#ed1c27] flex-shrink-0 mt-1" />
                  )}
                </div>
                <p className="text-[11px] text-gray-400 font-medium mt-1 leading-snug line-clamp-2">
                  {notif.desc}
                </p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-300 mt-1.5">
                  {notif.time}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100">
          <button
            id="view-all-notifications-btn"
            className="w-full py-3 text-[10px] font-bold uppercase tracking-widest text-[#ed1c27] hover:text-white hover:bg-[#ed1c27] border border-[#ed1c27]/30 hover:border-[#ed1c27] rounded-xl transition-all duration-200 cursor-pointer"
          >
            View All Notifications
          </button>
        </div>
      </Offcanvas>
  );
}

/* ─── Main Layout ───────────────────────────────────────────────────── */
export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router   = useRouter();
  const pathname = usePathname();
  const { addToast } = useAppToast();

  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen]   = useState(false);
  const [inquiriesBadge, setInquiriesBadge] = useState<string | null>(null);

  /* Load admin details on mount to avoid hydration mismatch */
  useEffect(() => {
    const stored = sessionStorage.getItem("bdm_admin");
    setTimeout(() => {
      setMounted(true);
      if (stored) {
        try {
          setAdmin(JSON.parse(stored));
        } catch {
          setAdmin(null);
        }
      }
    }, 0);
  }, []);

  /* Dynamic Badge — fetch real pending inquiry count from API */
  useEffect(() => {
    const fetchBadge = async () => {
      try {
        const token = sessionStorage.getItem("auth_token");
        if (!token) return;
        const BASE_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== "undefined" ? `http://${window.location.hostname}:5073` : "http://localhost:5073");
        const res = await fetch(`${BASE_URL}/api/inquiries?status=new&limit=1`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json = await res.json();
          const count = json?.pagination?.totalItems ?? 0;
          setInquiriesBadge(count > 0 ? String(count) : null);
        } else {
          setInquiriesBadge(null);
        }
      } catch {
        setInquiriesBadge(null);
      }
    };

    fetchBadge();
    // Re-fetch whenever the user navigates (pathname changes)
  }, [pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem("bdm_admin");
    setAdmin(null);
    addToast({ title: "Signed Out", message: "You have been logged out.", variant: "info" });
    router.push("/admin/login");
  };

  /* Auth guard */
  useEffect(() => {
    if (mounted && !admin) {
      router.replace("/admin/login");
    }
  }, [admin, router, mounted]);

  /* Close mobile sidebar on route change */
  useEffect(() => {
    const timer = setTimeout(() => {
      setMobileOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  /* Loading / unauthenticated state */
  if (!mounted || !admin) {
    return (
      <div className="flex h-screen bg-[#f4f5f7] overflow-hidden">
        <div className="flex items-center justify-center w-full">
          <div className="w-8 h-8 border-2 border-[#ed1c27]/30 border-t-[#ed1c27] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    /*
     * Root wrapper: full-viewport height, flex-row.
     * The sidebar and content area sit side-by-side on desktop.
     */
    <div className="flex h-screen bg-[#f4f5f7] overflow-hidden">

      {/* ── DESKTOP SIDEBAR (always visible ≥ lg) ─────────────────── */}
      <aside className="hidden lg:flex lg:flex-col w-64 flex-shrink-0 h-full overflow-hidden">
        <SidebarContent
          admin={admin}
          pathname={pathname}
          onClose={() => {}}
          onLogout={handleLogout}
          inquiriesBadge={inquiriesBadge}
        />
      </aside>

      {/* ── MOBILE DRAWER + OVERLAY (< lg) ───────────────────────── */}
      <Offcanvas
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        position="left"
        className="w-64 lg:hidden bg-[#0f0f0f]"
      >
        <SidebarContent
          admin={admin}
          pathname={pathname}
          onClose={() => setMobileOpen(false)}
          onLogout={handleLogout}
          inquiriesBadge={inquiriesBadge}
        />
      </Offcanvas>

      {/* ── CONTENT AREA ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="flex-shrink-0 h-16 bg-white border-b border-gray-100 flex items-center gap-4 px-4 sm:px-6 lg:px-8 z-30">
          {/* Hamburger (mobile only) */}
          <button
            id="open-sidebar-btn"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer flex-shrink-0"
          >
            <Menu size={20} />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-xs relative hidden sm:block">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="admin-search"
              type="text"
              placeholder="Search anything..."
              className="w-full bg-gray-50 border border-gray-100 rounded-lg pl-9 pr-4 py-2 text-xs font-medium text-gray-600 placeholder:text-gray-400 focus:outline-none focus:border-[#ed1c27]/40 transition-all"
            />
          </div>

          <div className="flex-1" />

          {/* Notifications */}
          <button
            id="admin-notifications-btn"
            onClick={() => setNotifOpen(true)}
            className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ed1c27] rounded-full" />
          </button>

          {/* Avatar */}
          <div className="flex items-center gap-3 pl-3 border-l border-gray-100 flex-shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-900 leading-tight">
                {admin.name}
              </p>
              <p className="text-[9px] font-semibold uppercase tracking-widest text-[#ed1c27]">
                {admin.role}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#ed1c27] flex items-center justify-center flex-shrink-0">
              <User size={14} className="text-white" />
            </div>
          </div>
        </header>

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* ── NOTIFICATION OFFCANVAS ────────────────────────────────── */}
      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </div>
  );
}
