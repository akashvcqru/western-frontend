"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Card } from "@/components/ui";
import {
  Package,
  Tag,
  Image as ImageIcon,
  Mail,
  TrendingUp,
  Eye,
  ArrowUpRight,
  ArrowRight,
  Layers,
  Activity,
  Newspaper,
  AlertCircle,
} from "lucide-react";
import { apiAuthGet } from "@/lib/api";
import type { DashboardStats } from "@/types/api";

const quickLinks = [
  { label: "Manage Products", href: "/admin/products", icon: Package, desc: "Add, edit or remove products" },
  { label: "Manage Brands", href: "/admin/brands", icon: Tag, desc: "Control brand listings" },
  { label: "Manage Categories", href: "/admin/categories", icon: Layers, desc: "Organise product categories" },
  { label: "View Inquiries", href: "/admin/inquiries", icon: Mail, desc: "Respond to customer enquiries", badge: "" },
  { label: "Gallery Editor", href: "/admin/gallery", icon: ImageIcon, desc: "Upload & arrange gallery images" },
  { label: "Manage Blogs", href: "/admin/blogs", icon: Newspaper, desc: "Add, edit or delete blog posts" },
];

const recentActivity = [
  { id: 1, action: "New inquiry received", time: "2 min ago", type: "inquiry", detail: "From Ramesh regarding Tiles" },
  { id: 2, action: "Product updated", time: "1 hr ago", type: "product", detail: "Premium Vitrified Tiles — price changed" },
  { id: 3, action: "Gallery image added", time: "3 hr ago", type: "gallery", detail: "Showroom interior — Project 2024" },
  { id: 4, action: "Brand added", time: "Yesterday", type: "brand", detail: "Kajaria Ceramics" },
  { id: 5, action: "Inquiry resolved", time: "Yesterday", type: "inquiry", detail: "Suresh — Wooden Flooring query closed" },
];

const typeColors: Record<string, string> = {
  inquiry: "bg-red-100 text-red-600",
  product: "bg-blue-100 text-blue-600",
  gallery: "bg-emerald-100 text-emerald-600",
  brand: "bg-violet-100 text-violet-600",
};

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState({
    products: 0,
    brands: 0,
    gallery: 0,
    inquiries: 0,
    blogs: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiAuthGet<DashboardStats>("/api/dashboard/stats");
      if (res.success && res.data) {
        setCounts({
          products: res.data.products,
          brands: res.data.brands,
          gallery: res.data.gallery,
          inquiries: res.data.pendingInquiries,
          blogs: res.data.blogs,
        });
      } else {
        setError(res.message || "Failed to fetch stats");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard stats");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const dynamicQuickLinks = useMemo(() => {
    return quickLinks.map((link) => {
      if (link.label === "View Inquiries") {
        return {
          ...link,
          badge: counts.inquiries > 0 ? String(counts.inquiries) : "",
        };
      }
      return link;
    });
  }, [counts.inquiries]);

  const dynamicStats = [
    {
      id: "stat-products",
      label: "Total Products",
      value: String(counts.products),
      change: "+12%",
      up: true,
      icon: Package,
      color: "bg-blue-50 text-blue-600",
      accent: "border-blue-200",
    },
    {
      id: "stat-brands",
      label: "Active Brands",
      value: String(counts.brands),
      change: "+3%",
      up: true,
      icon: Tag,
      color: "bg-violet-50 text-violet-600",
      accent: "border-violet-200",
    },
    {
      id: "stat-gallery",
      label: "Gallery Items",
      value: String(counts.gallery),
      change: "+8%",
      up: true,
      icon: ImageIcon,
      color: "bg-emerald-50 text-emerald-600",
      accent: "border-emerald-200",
    },
    {
      id: "stat-blogs",
      label: "Total Blogs",
      value: String(counts.blogs),
      change: "+33%",
      up: true,
      icon: Newspaper,
      color: "bg-amber-50 text-amber-600",
      accent: "border-amber-200",
    },
    {
      id: "stat-inquiries",
      label: "New Inquiries",
      value: String(counts.inquiries),
      change: "+2",
      up: true,
      icon: Mail,
      color: "bg-red-50 text-[#ed1c27]",
      accent: "border-red-200",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-gray-500 font-medium mt-1 animate-pulse">
              Loading dashboard overview...
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Card key={idx}>
              <Card.Body>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-gray-150 rounded-xl animate-pulse" />
                  <div className="w-12 h-4 bg-gray-100 rounded animate-pulse" />
                </div>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
              </Card.Body>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1">
            <Card>
              <Card.Header borderBottom>
                <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-9 h-9 bg-gray-100 rounded-xl animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                        <div className="h-2 w-32 bg-gray-100 rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </div>
          <div className="xl:col-span-2">
            <Card>
              <Card.Header borderBottom>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-12 h-6 bg-gray-100 rounded-lg animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                        <div className="h-2 w-48 bg-gray-100 rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Welcome back! Here&apos;s what&apos;s happening with your store.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-white border border-gray-100 rounded-lg px-4 py-2 shadow-sm">
          <Activity size={12} className="text-[#ed1c27]" />
          Live Overview
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 text-red-600 bg-red-50 border border-red-100 rounded-xl">
          <AlertCircle size={18} />
          <p className="text-sm font-semibold">{error}</p>
          <button onClick={fetchStats} className="ml-auto text-xs underline cursor-pointer font-bold uppercase tracking-widest">
            Retry
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {dynamicStats.map((stat) => (
          <Card key={stat.id}>
            <Card.Body>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon size={18} />
                </div>
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-tight ${
                    stat.up ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  <TrendingUp size={10} />
                  {stat.change}
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">
                {stat.label}
              </p>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="xl:col-span-1">
          <Card>
            <Card.Header borderBottom>
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-900">
                Quick Actions
              </h2>
            </Card.Header>
            <Card.Body noPadding>
              <div className="p-3 space-y-1">
                {dynamicQuickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    id={`quick-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gray-50 group-hover:bg-[#ed1c27]/10 flex items-center justify-center flex-shrink-0 transition-colors">
                      <link.icon
                        size={16}
                        className="text-gray-400 group-hover:text-[#ed1c27] transition-colors"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-700 group-hover:text-gray-900 truncate">
                          {link.label}
                        </p>
                        {link.badge && (
                          <span className="text-[9px] font-bold bg-[#ed1c27] text-white rounded-full px-1.5 py-0.5 min-w-[16px] text-center">
                            {link.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] font-medium text-gray-400 mt-0.5 truncate">
                        {link.desc}
                      </p>
                    </div>
                    <ArrowRight
                      size={14}
                      className="text-gray-300 group-hover:text-[#ed1c27] group-hover:translate-x-0.5 transition-all flex-shrink-0"
                    />
                  </Link>
                ))}
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="xl:col-span-2">
          <Card>
            <Card.Header borderBottom>
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-900">
                Recent Activity
              </h2>
              <button
                id="view-all-activity"
                className="text-[10px] font-bold uppercase tracking-widest text-[#ed1c27] hover:text-[#c5141e] transition-colors flex items-center gap-1 cursor-pointer"
              >
                View All <ArrowUpRight size={10} />
              </button>
            </Card.Header>
            <Card.Body noPadding>
              <div className="divide-y divide-gray-50">
                {recentActivity.map((item) => (
                  <div
                    key={item.id}
                    id={`activity-${item.id}`}
                    className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors"
                  >
                    <span
                      className={`inline-flex text-[9px] font-semibold uppercase tracking-widest rounded-lg px-2 py-1 flex-shrink-0 mt-0.5 ${
                        typeColors[item.type]
                      }`}
                    >
                      {item.type}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-tight text-gray-800">
                        {item.action}
                      </p>
                      <p className="text-[10px] font-medium text-gray-400 mt-0.5 truncate">
                        {item.detail}
                      </p>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-gray-300 flex-shrink-0 whitespace-nowrap">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Bottom banner */}
      <div className="bg-[#0f0f0f] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Eye size={14} className="text-[#ed1c27]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#ed1c27]">
              Store Preview
            </span>
          </div>
          <h3 className="text-lg font-bold text-white">
            See how your store looks to customers
          </h3>
          <p className="text-sm text-white/40 font-medium mt-1">
            Open the storefront in a new tab to preview all your changes live.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          id="view-storefront-btn"
          className="flex-shrink-0 inline-flex items-center gap-3 bg-[#ed1c27] hover:bg-[#c5141e] text-white font-bold uppercase tracking-[0.15em] text-[11px] rounded-xl px-6 py-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#ed1c27]/25"
        >
          View Store
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
}
