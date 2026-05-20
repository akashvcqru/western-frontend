"use client";
import React, { useState, useEffect } from "react";
import { Mail, CheckCircle, Search, Filter } from "lucide-react";
import { useAppToast } from "@/components/ui/AppToast";

const mockInquiries = [
  { id: 1, name: "Ramesh Kumar", email: "ramesh@example.com", subject: "Tiles Enquiry", date: "2026-05-11", status: "new" },
  { id: 2, name: "Priya Sharma", email: "priya@example.com", subject: "Wooden Flooring Quote", date: "2026-05-10", status: "new" },
  { id: 3, name: "Suresh Patel", email: "suresh@example.com", subject: "Bathroom Fittings", date: "2026-05-10", status: "new" },
  { id: 4, name: "Anita Singh", email: "anita@example.com", subject: "Modular Kitchen", date: "2026-05-09", status: "new" },
  { id: 5, name: "Vikram Mehta", email: "vikram@example.com", subject: "Wall Panels", date: "2026-05-09", status: "new" },
];

export default function AdminInquiriesPage() {
  const { addToast } = useAppToast();
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "resolved">("all");

  useEffect(() => {
    setIsMounted(true);
    const stored = sessionStorage.getItem("bdm_inquiries");
    if (stored) {
      try {
        setInquiries(JSON.parse(stored));
      } catch {
        setInquiries(mockInquiries);
        sessionStorage.setItem("bdm_inquiries", JSON.stringify(mockInquiries));
      }
    } else {
      setInquiries(mockInquiries);
      sessionStorage.setItem("bdm_inquiries", JSON.stringify(mockInquiries));
    }
  }, []);

  const handleResolve = (id: number) => {
    const updated = inquiries.map((inq) => {
      if (inq.id === id) {
        return { ...inq, status: "resolved" };
      }
      return inq;
    });
    
    setInquiries(updated);
    sessionStorage.setItem("bdm_inquiries", JSON.stringify(updated));
    
    // Notify topbar and sidebar layout to re-fetch badge counts
    window.dispatchEvent(new Event("bdm-inquiries-updated"));
    
    addToast({
      title: "Inquiry Resolved",
      message: "Customer inquiry marked as resolved.",
      variant: "success",
    });
  };

  // Filtered inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch = 
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.subject.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = 
      statusFilter === "all" ? true : inq.status === statusFilter;
      
    return matchesSearch && matchesStatus;
  });

  const pendingCount = inquiries.filter((inq) => inq.status === "new").length;

  if (!isMounted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Inquiries</h1>
            <p className="text-sm text-gray-500 font-medium mt-1">Customer quote and product inquiries</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-8 flex justify-center items-center shadow-sm">
          <div className="w-6 h-6 border-2 border-[#ed1c27]/20 border-t-[#ed1c27] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Inquiries</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Customer quote and product inquiries</p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ed1c27]/10 border border-[#ed1c27]/20 rounded-xl self-start sm:self-center">
          <Mail size={14} className="text-[#ed1c27]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#ed1c27]">
            {pendingCount} {pendingCount === 1 ? "New Inquiry" : "New Inquiries"}
          </span>
        </div>
      </div>

      {/* Control Bar (Search + Filter Tabs) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id="inquiries-search-input"
            type="text"
            placeholder="Search by name, email or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-100 rounded-xl placeholder:text-gray-400 focus:outline-none focus:border-[#ed1c27]/40 focus:bg-white transition-all"
          />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1.5 self-start md:self-auto bg-gray-50 p-1.5 rounded-xl border border-gray-100">
          {(["all", "new", "resolved"] as const).map((tab) => (
            <button
              key={tab}
              id={`filter-tab-${tab}`}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
                statusFilter === tab
                  ? "bg-white text-gray-900 shadow-sm border border-gray-100"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Name / Contact</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Subject</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredInquiries.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Mail size={24} className="text-gray-300" />
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">No inquiries found</p>
                    <p className="text-[11px] text-gray-400">Try adjusting your filters or search terms.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredInquiries.map((inq) => (
                <tr key={inq.id} id={`inquiry-${inq.id}`} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        inq.status === "new" ? "bg-[#ed1c27]/10" : "bg-emerald-50"
                      }`}>
                        <Mail size={14} className={inq.status === "new" ? "text-[#ed1c27]" : "text-emerald-500"} />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-900">{inq.name}</p>
                        <p className="text-[10px] font-medium text-gray-400 mt-0.5">{inq.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[11px] font-semibold text-gray-700 truncate max-w-[240px]">{inq.subject}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{inq.date}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border transition-all ${
                      inq.status === "new" 
                        ? "bg-red-50 text-[#ed1c27] border-red-100" 
                        : "bg-emerald-50 text-emerald-600 border-emerald-100"
                    }`}>
                      {inq.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {inq.status === "new" ? (
                      <button
                        id={`resolve-inquiry-${inq.id}`}
                        onClick={() => handleResolve(inq.id)}
                        className="inline-flex p-2 text-gray-300 hover:text-emerald-500 hover:bg-emerald-50 transition-all cursor-pointer rounded-lg border border-transparent hover:border-emerald-100"
                        title="Mark as resolved"
                      >
                        <CheckCircle size={16} />
                      </button>
                    ) : (
                      <span className="inline-flex p-2 text-emerald-400 bg-emerald-50/50 rounded-lg cursor-not-allowed border border-emerald-50">
                        <CheckCircle size={16} />
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

