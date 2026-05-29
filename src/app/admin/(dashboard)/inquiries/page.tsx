"use client";
import { useState, useEffect, useCallback } from "react";
import { Mail, CheckCircle, Eye, Phone, Calendar, User, MessageSquare, AlertCircle } from "lucide-react";
import { Card, AppModal, useAppToast, AdminPageHeader, Pagination, SearchInput } from "@/components/ui";
import { AppRoutes } from "@/constants/routes";
import { apiAuthGetPaginated, apiPut, buildQuery } from "@/lib/api";
import type { Inquiry, PaginationMeta } from "@/types/api";

export default function AdminInquiriesPage() {
  const { addToast } = useAppToast();

  // Data state
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({ currentPage: 1, totalPages: 1, totalItems: 0, limit: 5 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "resolved">("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Modal state
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // ── Fetch inquiries ────────────────────────────────────────────────────────
  const fetchInquiries = useCallback(async (page: number, limit: number, search: string, status: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const query = buildQuery({ page, limit, search, status: status === "all" ? "" : status });
      const res = await apiAuthGetPaginated<Inquiry>(`/api/inquiries${query}`);
      setInquiries(res.data);
      setPagination(res.pagination);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load inquiries");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInquiries(currentPage, itemsPerPage, searchQuery, statusFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [currentPage, itemsPerPage, searchQuery, statusFilter, fetchInquiries]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter, itemsPerPage]);

  // ── Pending count (from total, not just current page) ─────────────────────
  const pendingCount = statusFilter === "new" ? pagination.totalItems : 0;

  // ── Resolve ────────────────────────────────────────────────────────────────
  const handleResolve = async (id: number) => {
    try {
      await apiPut(`/api/inquiries/${id}/resolve`, {});
      addToast({ title: "Inquiry Resolved", message: "Customer inquiry marked as resolved.", variant: "success" });
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(prev => prev ? { ...prev, status: "resolved" } : null);
      }
      fetchInquiries(currentPage, itemsPerPage, searchQuery, statusFilter);
    } catch (err: unknown) {
      addToast({ title: "Error", message: err instanceof Error ? err.message : "Failed to resolve inquiry", variant: "error" });
    }
  };

  const openDetails = (inq: Inquiry) => { setSelectedInquiry(inq); setIsDetailOpen(true); };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Inquiries"
        breadcrumbs={[
          { label: "Admin", href: AppRoutes.Admin.Dashboard },
          { label: "Inquiries" },
        ]}
      />

      <Card>
        <Card.Header>
          <SearchInput
            placeholder="Search by name, email, phone or message..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            wrapperClassName="max-w-sm"
          />

          <div className="flex flex-wrap items-center gap-3">
            {/* Status tabs */}
            <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
              {(["all", "new", "resolved"] as const).map(tab => (
                <button
                  key={tab}
                  id={`filter-tab-${tab}`}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3.5 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all cursor-pointer ${statusFilter === tab ? "bg-white text-gray-900 shadow-sm border border-gray-100" : "text-gray-400 hover:text-gray-600"}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Pending badge */}
            {statusFilter === "new" && pendingCount > 0 && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#ed1c27]/10 border border-[#ed1c27]/20 rounded-xl">
                <Mail size={14} className="text-[#ed1c27]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#ed1c27]">
                  {pendingCount} New {pendingCount === 1 ? "Inquiry" : "Inquiries"}
                </span>
              </div>
            )}
          </div>
        </Card.Header>

        <Card.Body noPadding>
          {error && (
            <div className="flex items-center gap-3 p-6 text-red-600 bg-red-50 border-b border-red-100">
              <AlertCircle size={18} />
              <p className="text-sm font-semibold">{error}</p>
              <button onClick={() => fetchInquiries(currentPage, itemsPerPage, searchQuery, statusFilter)} className="ml-auto text-xs underline cursor-pointer">Retry</button>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Customer Contact</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Subject / Category</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Message Preview</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  Array.from({ length: itemsPerPage }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-3 bg-gray-100 rounded w-32 mb-1" /><div className="h-2 bg-gray-100 rounded w-24" /></td>
                      <td className="px-6 py-4"><div className="h-3 bg-gray-100 rounded w-28" /></td>
                      <td className="px-6 py-4"><div className="h-3 bg-gray-100 rounded w-48" /></td>
                      <td className="px-6 py-4"><div className="h-3 bg-gray-100 rounded w-16" /></td>
                      <td className="px-6 py-4"><div className="h-5 bg-gray-100 rounded-full w-14" /></td>
                      <td className="px-6 py-4" />
                    </tr>
                  ))
                ) : inquiries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Mail size={24} className="text-gray-300" />
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">No inquiries found</p>
                        <p className="text-[11px] text-gray-400">Try adjusting your filters or search terms.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  inquiries.map(inq => (
                    <tr key={inq.id} id={`inquiry-${inq.id}`} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${inq.status === "new" ? "bg-[#ed1c27]/10" : "bg-emerald-50"}`}>
                            <Mail size={14} className={inq.status === "new" ? "text-[#ed1c27]" : "text-emerald-500"} />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-900">{inq.name}</p>
                            <p className="text-[10px] font-medium text-gray-400 mt-0.5">{inq.email}</p>
                            {inq.phone && <p className="text-[10px] font-semibold text-gray-500 mt-0.5">{inq.phone}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[11px] font-semibold text-gray-700 truncate max-w-[180px]">{inq.subject}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[11px] text-gray-500 truncate max-w-[260px]">{inq.message || "No message specified."}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{inq.date}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${inq.status === "new" ? "bg-red-50 text-[#ed1c27] border-red-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"}`}>
                          {inq.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openDetails(inq)} className="inline-flex p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer rounded-lg" title="View details">
                            <Eye size={16} />
                          </button>
                          {inq.status === "new" ? (
                            <button id={`resolve-inquiry-${inq.id}`} onClick={() => handleResolve(inq.id)} className="inline-flex p-2 text-gray-300 hover:text-emerald-500 hover:bg-emerald-50 transition-all cursor-pointer rounded-lg border border-transparent hover:border-emerald-100" title="Mark as resolved">
                              <CheckCircle size={16} />
                            </button>
                          ) : (
                            <span className="inline-flex p-2 text-emerald-400 bg-emerald-50/50 rounded-lg cursor-not-allowed border border-emerald-50">
                              <CheckCircle size={16} />
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card.Body>

        <Card.Footer>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
            pageSize={itemsPerPage}
            onPageSizeChange={size => { setItemsPerPage(size); setCurrentPage(1); }}
            totalItems={pagination.totalItems}
            pageSizeOptions={[5, 10, 20, 50]}
          />
        </Card.Footer>
      </Card>

      {/* Inquiry Details Modal */}
      {selectedInquiry && (
        <AppModal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Inquiry Sheet Details" size="lg" hideFooter>
          <div className="space-y-6 pt-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedInquiry.status === "new" ? "bg-[#ed1c27]/10 text-[#ed1c27]" : "bg-emerald-50 text-emerald-500"}`}>
                  <Mail size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">{selectedInquiry.name}</h3>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#ed1c27] mt-0.5">{selectedInquiry.subject}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${selectedInquiry.status === "new" ? "bg-red-50 text-[#ed1c27] border-red-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"}`}>
                  {selectedInquiry.status}
                </span>
                {selectedInquiry.status === "new" && (
                  <button onClick={() => handleResolve(selectedInquiry.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors cursor-pointer">
                    <CheckCircle size={12} /> Mark Resolved
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-gray-400"><User size={12} /><span className="text-[9px] font-bold uppercase tracking-widest">Client Name</span></div>
                <p className="text-xs font-semibold text-gray-700">{selectedInquiry.name}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-gray-400"><Mail size={12} /><span className="text-[9px] font-bold uppercase tracking-widest">Email Address</span></div>
                <a href={`mailto:${selectedInquiry.email}`} className="text-xs font-semibold text-[#ed1c27] hover:underline">{selectedInquiry.email}</a>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-gray-400"><Phone size={12} /><span className="text-[9px] font-bold uppercase tracking-widest">Phone Number</span></div>
                <a href={`tel:${selectedInquiry.phone}`} className="text-xs font-semibold text-gray-700 hover:text-[#ed1c27] hover:underline">{selectedInquiry.phone || "Not provided"}</a>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-gray-400"><Calendar size={13} /><span className="text-[9px] font-bold uppercase tracking-widest">Submitted Date</span></div>
              <p className="text-xs font-medium text-gray-600">{selectedInquiry.date}</p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-1.5 text-gray-400"><MessageSquare size={13} /><span className="text-[9px] font-bold uppercase tracking-widest">Project Requirements / Message</span></div>
              <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl min-h-[120px]">
                <p className="text-xs font-medium text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedInquiry.message || "No details provided."}</p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button onClick={() => setIsDetailOpen(false)} className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors cursor-pointer">
                Close View
              </button>
            </div>
          </div>
        </AppModal>
      )}
    </div>
  );
}
