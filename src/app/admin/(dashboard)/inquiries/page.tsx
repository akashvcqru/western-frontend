"use client";
import React, { useState, useEffect } from "react";
import { Mail, CheckCircle, Eye, Phone, Calendar, User, MessageSquare } from "lucide-react";
import { Card, AppModal, useAppToast, AdminPageHeader, Pagination, SearchInput } from "@/components/ui";
import { AppRoutes } from "@/constants/routes";

const mockInquiries = [
  { 
    id: 1, 
    name: "Ramesh Kumar", 
    email: "ramesh@example.com", 
    phone: "+91 98765 43210", 
    subject: "Tiles Enquiry", 
    message: "I am interested in premium marble tiles for my living room renovation project. Please share a quote for 800 sq ft.", 
    date: "2026-05-11", 
    status: "new" 
  },
  { 
    id: 2, 
    name: "Priya Sharma", 
    email: "priya@example.com", 
    phone: "+91 87654 32109", 
    subject: "Wooden Flooring Quote", 
    message: "Looking for engineered wooden flooring options for a 3BHK flat in Gurugram. Do you offer installation services?", 
    date: "2026-05-10", 
    status: "new" 
  },
  { 
    id: 3, 
    name: "Suresh Patel", 
    email: "suresh@example.com", 
    phone: "+91 76543 21098", 
    subject: "Bathroom Fittings", 
    message: "Need quote for sanitaryware and matte black bathroom fittings for our commercial office remodel.", 
    date: "2026-05-10", 
    status: "new" 
  },
  { 
    id: 4, 
    name: "Anita Singh", 
    email: "anita@example.com", 
    phone: "+91 65432 10987", 
    subject: "Modular Kitchen", 
    message: "Interested in a customized L-shaped acrylic finish modular kitchen. Please let me know your design consultation process.", 
    date: "2026-05-09", 
    status: "new" 
  },
  { 
    id: 5, 
    name: "Vikram Mehta", 
    email: "vikram@example.com", 
    phone: "+91 54321 09876", 
    subject: "Wall Panels", 
    message: "Need 3D fluted charcoal wall panels for a hotel reception backdrop. Quantity is approximately 25 sheets.", 
    date: "2026-05-09", 
    status: "new" 
  },
];

export default function AdminInquiriesPage() {
  const { addToast } = useAppToast();
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "resolved">("all");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Selected Inquiry for details modal
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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
    
    // Update selected inquiry status if open in modal
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry({ ...selectedInquiry, status: "resolved" });
    }

    // Notify topbar and sidebar layout to re-fetch badge counts
    window.dispatchEvent(new Event("bdm-inquiries-updated"));
    
    addToast({
      title: "Inquiry Resolved",
      message: "Customer inquiry marked as resolved.",
      variant: "success",
    });
  };

  const openDetails = (inq: any) => {
    setSelectedInquiry(inq);
    setIsDetailOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (tab: "all" | "new" | "resolved") => {
    setStatusFilter(tab);
    setCurrentPage(1);
  };

  // Filtered inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch = 
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inq.phone && inq.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
      inq.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inq.message && inq.message.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesStatus = 
      statusFilter === "all" ? true : inq.status === statusFilter;
      
    return matchesSearch && matchesStatus;
  });

  const pendingCount = inquiries.filter((inq) => inq.status === "new").length;

  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);
  const paginatedInquiries = filteredInquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
      {/* Admin Page Header with Breadcrumb */}
      <AdminPageHeader
        title="Inquiries"
        breadcrumbs={[
          { label: "Admin", href: AppRoutes.Admin.Dashboard },
          { label: "Inquiries" },
        ]}
      />

      {/* Card with Integrated Search Header & Body */}
      <Card>
        <Card.Header>
          {/* Left: Search input */}
          <SearchInput
            placeholder="Search by name, email, phone or message..."
            value={searchQuery}
            onChange={handleSearchChange}
            wrapperClassName="max-w-sm"
          />

          {/* Right: Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Pending Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#ed1c27]/10 border border-[#ed1c27]/20 rounded-xl">
              <Mail size={14} className="text-[#ed1c27]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#ed1c27]">
                {pendingCount} {pendingCount === 1 ? "New Inquiry" : "New Inquiries"}
              </span>
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
              {(["all", "new", "resolved"] as const).map((tab) => (
                <button
                  key={tab}
                  id={`filter-tab-${tab}`}
                  onClick={() => handleStatusFilterChange(tab)}
                  className={`px-3.5 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
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
        </Card.Header>

        <Card.Body noPadding>
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
                {paginatedInquiries.length === 0 ? (
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
                  paginatedInquiries.map((inq) => (
                    <tr key={inq.id} id={`inquiry-${inq.id}`} className="hover:bg-gray-50/50 transition-colors group">
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
                            {inq.phone && <p className="text-[10px] font-semibold text-gray-500 mt-0.5">{inq.phone}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[11px] font-semibold text-gray-700 truncate max-w-[180px]">{inq.subject}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[11px] text-gray-500 truncate max-w-[260px]">
                          {inq.message || "No project requirements specified."}
                        </p>
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
                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openDetails(inq)}
                            className="inline-flex p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer rounded-lg border border-transparent"
                            title="View details"
                          >
                            <Eye size={16} />
                          </button>
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
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            pageSize={itemsPerPage}
            onPageSizeChange={(size) => {
              setItemsPerPage(size);
              setCurrentPage(1);
            }}
            totalItems={filteredInquiries.length}
            pageSizeOptions={[5, 10, 20, 50]}
          />
        </Card.Footer>
      </Card>

      {/* Inquiry details viewing Modal */}
      {selectedInquiry && (
        <AppModal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title="Inquiry Sheet Details"
          size="lg"
          hideFooter
        >
          <div className="space-y-6 pt-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  selectedInquiry.status === "new" ? "bg-[#ed1c27]/10 text-[#ed1c27]" : "bg-emerald-50 text-emerald-500"
                }`}>
                  <Mail size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900">{selectedInquiry.name}</h3>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#ed1c27] mt-0.5">{selectedInquiry.subject}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`inline-flex text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                  selectedInquiry.status === "new" 
                    ? "bg-red-50 text-[#ed1c27] border-red-100" 
                    : "bg-emerald-50 text-emerald-600 border-emerald-100"
                }`}>
                  {selectedInquiry.status}
                </span>
                
                {selectedInquiry.status === "new" && (
                  <button
                    onClick={() => handleResolve(selectedInquiry.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors cursor-pointer"
                  >
                    <CheckCircle size={12} />
                    Mark Resolved
                  </button>
                )}
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-gray-50 p-4.5 rounded-2xl border border-gray-100">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-gray-400">
                  <User size={12} />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Client Name</span>
                </div>
                <p className="text-xs font-semibold text-gray-700">{selectedInquiry.name}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Mail size={12} />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Email Address</span>
                </div>
                <a href={`mailto:${selectedInquiry.email}`} className="text-xs font-semibold text-[#ed1c27] hover:underline">
                  {selectedInquiry.email}
                </a>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Phone size={12} />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Phone Number</span>
                </div>
                <a href={`tel:${selectedInquiry.phone}`} className="text-xs font-semibold text-gray-700 hover:text-[#ed1c27] hover:underline">
                  {selectedInquiry.phone || "Not provided"}
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-gray-400">
                <Calendar size={13} />
                <span className="text-[9px] font-bold uppercase tracking-widest">Submitted Date</span>
              </div>
              <p className="text-xs font-medium text-gray-600">{selectedInquiry.date}</p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-1.5 text-gray-400">
                <MessageSquare size={13} />
                <span className="text-[9px] font-bold uppercase tracking-widest">Project Requirements / message</span>
              </div>
              <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl min-h-[120px]">
                <p className="text-xs font-medium text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {selectedInquiry.message || "No details provided."}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                onClick={() => setIsDetailOpen(false)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </AppModal>
      )}
    </div>
  );
}


