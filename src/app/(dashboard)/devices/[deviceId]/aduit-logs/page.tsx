"use client";

import { useState, useMemo } from "react";
import StyledPagination from "@/components/ui/Pagination";
import useGetAuditLogs from "@/features/device-detail/hooks/useGetAuditLogs";
import { useParams } from "next/navigation";

const CommandHistory = () => {
  const { deviceId } = useParams();

  // 1. Pagination States (Standard from your other components)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Fetching all logs without page/pageSize parameters
  const { auditLogs, isGettingAuditLogs } = useGetAuditLogs(deviceId as string);

  // Helper to ensure we only render strings/numbers
  const renderValue = (value: any) => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "نامشخص";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("fa-IR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  };

  // --- Client-side Pagination Logic (Same as your other components) ---
  const paginatedLogs = useMemo(() => {
    if (!auditLogs?.items) return [];

    const startIndex = (currentPage - 1) * pageSize;
    return auditLogs.items.slice(startIndex, startIndex + pageSize);
  }, [currentPage, pageSize, auditLogs]);

  const totalPages = Math.ceil((auditLogs?.items?.length || 0) / pageSize);

  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="py-4 px-2">
        <div className="h-3 w-20 bg-gray-200 rounded-md" />
      </td>
      <td className="py-4 px-2">
        <div className="h-5 w-16 bg-gray-200 rounded-lg mx-auto" />
      </td>
      <td className="py-4 px-2">
        <div className="h-3 w-24 bg-gray-200 rounded-md mx-auto" />
      </td>
      <td className="py-4 px-2">
        <div className="h-3 w-16 bg-gray-200 rounded-md" />
      </td>
    </tr>
  );

  return (
    <div className="p-4 grid grid-cols-12">
      <div className="border border-gray-100 shadow-xs rounded-lg col-span-12 lg:col-span-7">
        <div className="h-full bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[16px] font-bold text-[#0F172A]">
              تاریخچه دستورات
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse min-w-md">
              <thead className="text-xs text-gray-600 border-b border-gray-100">
                <tr>
                  <th className="pb-4 px-2 text-right">دستور</th>
                  <th className="pb-4 px-2 text-center">وضعیت</th>
                  <th className="pb-4 px-2 text-center">زمان</th>
                  <th className="pb-4 px-2 text-right">درخواست‌دهنده</th>
                </tr>
              </thead>
              <tbody>
                {isGettingAuditLogs ? (
                  Array(5)
                    .fill(0)
                    .map((_, index) => <SkeletonRow key={index} />)
                ) : paginatedLogs && paginatedLogs.length > 0 ? (
                  paginatedLogs.map((item: any, index: number) => (
                    <tr
                      key={item.id || index}
                      className="text-xs text-[#334155] hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-4 px-2 font-bold">
                        {renderValue(item.action)}
                      </td>
                      <td className="py-4 px-2 text-center">
                        <div
                          className={`flex justify-center items-center px-1 w-full py-1 rounded-lg text-xs font-medium border ${
                            item.success
                              ? "bg-[#F0FDF4] text-[#16A34A] border-[#DCFCE7]"
                              : "bg-[#FFF7ED] text-[#EA580C] border-[#FFEDD5]"
                          }`}
                        >
                          {item.success ? "اعمال شد" : "خطا"}
                        </div>
                      </td>
                      <td
                        className="py-4 px-2 text-center text-gray-600 font-bold"
                        dir="ltr"
                      >
                        {formatDate(item.created_at)}
                      </td>
                      <td className="py-4 px-2 text-gray-600 font-bold">
                        {renderValue(item.actor_username)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-10 text-center text-xs text-gray-400"
                    >
                      هیچ تاریخچه‌ای یافت نشد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Component - Integrated based on your project standard */}
            {auditLogs?.items && auditLogs.items.length > 0 && (
              <div className="mt-4">
                <StyledPagination
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  setPageSize={setPageSize}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandHistory;
