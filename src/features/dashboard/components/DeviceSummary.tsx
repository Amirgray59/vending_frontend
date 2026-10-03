
"use client";
import { ChevronLeft, LayoutGrid } from "lucide-react";
import Link from "next/link";
import useGetDashboardInfo from "../hooks/useGetDashboardInfo";
import React from "react";
import UseGetDevicesList from "@/shared/hooks/useGetDevicesList";

const DeviceMiniIcon = () => (
  <svg
    className="w-4 h-4 text-blue-500 shrink-0 ml-1"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="6" y="3" width="12" height="18" rx="2" />
    <rect x="9" y="6" width="6" height="5" rx="1" />
    <circle cx="10" cy="14" r="1" fill="currentColor" />
    <circle cx="14" cy="14" r="1" fill="currentColor" />
    <circle cx="10" cy="17" r="1" fill="currentColor" />
    <circle cx="14" cy="17" r="1" fill="currentColor" />
  </svg>
);

// --- مدیریت متون و رنگ‌های وضعیت دستگاه ---
const getStatusStyles = (status: string) => {
  switch (status) {
    case "online":
      return { text: "آنلاین", style: "bg-green-50 text-green-600" };
    case "offline":
      return { text: "آفلاین", style: "bg-red-50 text-red-500" };
    case "disabled":
      return { text: "غیرفعال", style: "bg-gray-100 text-gray-500" };
    case "pending":
      return { text: "در انتظار", style: "bg-blue-50 text-blue-600" };
    default:
      return { text: status, style: "bg-slate-50 text-slate-600" };
  }
};

// --- مدیریت متون و رنگ‌های موجودی (Inventory) ---
const getInventoryStyles = (status: string) => {
  switch (status) {
    case "good":
      return { text: "مناسب", style: "bg-green-50 text-green-600" };
    case "yellow":
      return { text: "متوسط", style: "bg-yellow-50 text-yellow-600" };
    case "red":
      return { text: "کم", style: "bg-orange-50 text-orange-600" };
    case "empty":
      return { text: "تخلیه", style: "bg-red-50 text-red-500" };
    default:
      return { text: "نامشخص", style: "bg-gray-50 text-gray-400" };
  }
};

export default function DeviceSummary() {
  const { dashboardInfo, isgettingDashboardInfo } = useGetDashboardInfo();
  const { devicesList, isGettingDevicesList } = UseGetDevicesList();

  const allDevices = devicesList?.items || [];

  // فیلتر کردن: فقط دستگاه‌های غیر-آنلاین (شامل offline, disabled, pending)
  const filteredAndSortedDevices = React.useMemo(() => {
    return allDevices
      .filter((device: any) => device.status !== "online")
      .sort((a: any, b: any) => {
        // اولویت اول: آفلاین‌ها
        if (a.status === "offline" && b.status !== "offline") return -1;
        if (b.status === "offline" && a.status !== "offline") return 1;
        // اولویت دوم: غیرفعال‌ها
        if (a.status === "disabled" && b.status !== "disabled") return -1;
        if (b.status === "disabled" && a.status !== "disabled") return 1;
        return 0;
      });
  }, [allDevices]);

  if (isgettingDashboardInfo || isGettingDevicesList) {
    return (
      <div className="bg-white h-full rounded-lg p-4 shadow-sm border border-gray-100 overflow-hidden animate-pulse" dir="rtl">
        <div className="flex justify-between items-center pb-4">
          <div className="w-32 h-5 bg-gray-200 rounded" />
          <div className="w-20 h-4 bg-gray-200 rounded" />
        </div>
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50">

              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded" />
                <div className="w-24 h-3 bg-gray-200 rounded" />
              </div>
              <div className="w-16 h-3 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white h-full rounded-lg p-4 shadow-sm border border-gray-100 overflow-hidden" dir="rtl">
      <div className="flex justify-between items-center pb-4">
        <div className="flex items-center gap-2">
          <LayoutGrid size={18} className="text-gray-400" />
          <h2 className="font-bold text-gray-800">خلاصه وضعیت دستگاه‌ها</h2>
        </div>
        <Link
          href="/devices"
          className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          <span>مشاهده همه</span>
          <ChevronLeft size={14} />
        </Link>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead className="text-gray-400 text-xs font-medium border-b border-gray-100">
            <tr className="bg-gray-50/30">
              <th className="px-4 py-3 font-normal text-right">نام دستگاه</th>
              <th className="px-4 py-3 font-normal text-center">شناسه</th>
              <th className="px-4 py-3 font-normal text-center">مکان</th>
              <th className="px-4 py-3 font-normal text-center">بخش</th>
              <th className="px-4 py-3 font-normal text-center">وضعیت</th>
              <th className="px-4 py-3 font-normal text-center">موجودی</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredAndSortedDevices.length > 0 ? (
              filteredAndSortedDevices.map((device: any) => {
                const status = getStatusStyles(device.status);
                const inventory = getInventoryStyles(device.inventory_status);

                return (
                  <tr key={device.id} className="group hover:bg-slate-50/50 transition-all">
                    <td className="px-4 py-3 text-slate-700 text-[13px] font-medium whitespace-nowrap">
                      <div className="flex items-center">
                        <DeviceMiniIcon /> {device.name || device.device_code}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-slate-500 text-[13px] font-mono whitespace-nowrap">
                      {device.device_code}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-500 text-[13px] whitespace-nowrap">
                      {device.location_name}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-500 text-[13px] whitespace-nowrap">
                      {device.section_name || "---"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${status.style}`}>
                        {status.text}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${inventory.style}`}>
                        {inventory.text}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">
                  هیچ دستگاهی با وضعیت غیر-آنلاین یافت نشد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}