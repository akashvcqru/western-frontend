"use client";
import React from "react";
import { Mail, CheckCircle } from "lucide-react";

const mockInquiries = [
  { id: 1, name: "Ramesh Kumar", email: "ramesh@example.com", subject: "Tiles Enquiry", date: "2026-05-11", status: "new" },
  { id: 2, name: "Priya Sharma", email: "priya@example.com", subject: "Wooden Flooring Quote", date: "2026-05-10", status: "new" },
  { id: 3, name: "Suresh Patel", email: "suresh@example.com", subject: "Bathroom Fittings", date: "2026-05-10", status: "new" },
  { id: 4, name: "Anita Singh", email: "anita@example.com", subject: "Modular Kitchen", date: "2026-05-09", status: "new" },
  { id: 5, name: "Vikram Mehta", email: "vikram@example.com", subject: "Wall Panels", date: "2026-05-09", status: "new" },
];

export default function AdminInquiriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Inquiries</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Customer quote and product inquiries</p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ed1c27]/10 border border-[#ed1c27]/20 rounded-xl">
          <Mail size={14} className="text-[#ed1c27]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[#ed1c27]">5 New</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">Name</th>
              <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">Subject</th>
              <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
              <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
              <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockInquiries.map((inq) => (
              <tr key={inq.id} id={`inquiry-${inq.id}`} className="hover:bg-gray-50/70 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#ed1c27]/10 flex items-center justify-center flex-shrink-0">
                      <Mail size={14} className="text-[#ed1c27]" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-widest text-gray-900">{inq.name}</p>
                      <p className="text-[10px] font-medium text-gray-400 mt-0.5">{inq.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-[11px] font-bold text-gray-700 truncate max-w-[200px]">{inq.subject}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{inq.date}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-red-50 text-[#ed1c27] border border-red-100">
                    {inq.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    id={`resolve-inquiry-${inq.id}`}
                    className="inline-flex p-2 text-gray-300 hover:text-emerald-500 transition-colors cursor-pointer rounded-lg hover:bg-emerald-50"
                    title="Mark as resolved"
                  >
                    <CheckCircle size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
