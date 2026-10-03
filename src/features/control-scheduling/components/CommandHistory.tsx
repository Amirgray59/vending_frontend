"use client";

import useGetAuditLogs from "@/features/device-detail/hooks/useGetAuditLogs";
import Link from "next/link";
import { useParams } from "next/navigation";

const CommandHistory = () => {
  const { deviceId } = useParams();
  const { auditLogs, isGettingAuditLogs } = useGetAuditLogs(deviceId as string);

  // Helper to ensure we only render strings/numbers, never objects
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

  // Skeleton Row Component (Updated to 4 columns)
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
    <div className="h-full bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[16px] font-bold text-[#0F172A]">
          تاریخچه دستورات
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
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
            ) : auditLogs?.items && auditLogs.items.length > 0 ? (
              auditLogs.items.slice(0, 5).map((item: any, index: number) => (
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
      </div>

      <div className="mt-4 pt-2 w-full ">
        <Link
          href={`/devices/${deviceId}/aduit-logs`}
          className="w-full block py-2 rounded-lg border border-gray-200 text-[#2563EB] text-xs font-bold cursor-pointer transition-all hover:bg-blue-50"
        >
          <div className=" w-full flex items-center justify-center">
            <span>مشاهده همه دستورات</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default CommandHistory;
