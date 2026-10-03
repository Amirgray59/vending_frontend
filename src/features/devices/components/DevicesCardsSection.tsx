import React, { useMemo } from "react";
import { Wifi, CloudOff, AlertTriangle } from "lucide-react";
import UseGetDevicesList from "@/shared/hooks/useGetDevicesList";

// آیکون اختصاصی دستگاه
const DeviceIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
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

// کامپوننت اسکلتون برای حالت لودینگ
const StatsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className="bg-white px-5 py-6 rounded-lg border border-gray-100 shadow-sm flex items-center justify-between animate-pulse"
      >
        <div className="w-14 h-14 rounded-full bg-gray-200 shrink-0" />
        <div className="flex flex-col items-center justify-center flex-1 text-center pr-2 gap-2">
          <div className="h-3 w-20 bg-gray-200 rounded-full" />
          <div className="h-8 w-12 bg-gray-200 rounded-full" />
          <div className="h-3 w-16 bg-gray-200 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);

export default function DevicesCardsSection() {
  const { devicesList, isGettingDevicesList } = UseGetDevicesList();

  const stats = useMemo(() => {
    const items = devicesList?.items || [];
    const total = items.length;
    const online = items.filter((d: any) => d.status === "online").length;
    const offline = items.filter((d: any) => d.status === "offline").length;
    const lowInventory = items.filter(
      (d: any) => d.inventory_level <d.inventory_red_threshold,
    ).length;

    return [
      {
        id: 1,
        title: "کل دستگاه‌ها",
        value: total,
        unit: "دستگاه",
        icon: DeviceIcon,
        iconColor: "text-[#6D28D9]",
        iconBg: "bg-[#F5F3FF]",
        subText: null,
      },
      {
        id: 2,
        title: "دستگاه‌های آنلاین",
        value: online,
        unit: "دستگاه",
        icon: Wifi,
        iconColor: "text-[#15803D]",
        iconBg: "bg-[#E8F5E9]",
        subText: null, // درصد حذف شد
      },
      {
        id: 3,
        title: "دستگاه‌های آفلاین",
        value: offline,
        unit: "دستگاه",
        icon: CloudOff,
        iconColor: "text-[#B91C1C]",
        iconBg: "bg-[#FEE2E2]",
        subText: null, // درصد حذف شد
      },
      {
        id: 4,
        title: "موجودی کم",
        value: lowInventory,
        unit: "دستگاه",
        icon: AlertTriangle,
        iconColor: "text-[#C2410C]",
        iconBg: "bg-[#FFF3E0]",
        subText: "نیاز به بررسی",
      },
    ];
  }, [devicesList]);

  // نمایش اسکلتون در هنگام لودینگ
  if (isGettingDevicesList) return <StatsSkeleton />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.id}
            className="bg-white px-5 py-6 rounded-lg border border-gray-100 shadow-sm flex items-center justify-between transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
          >
            <div className="h-full">
              <div
                className={`w-14 h-14 rounded-full ${stat.iconBg} flex items-center justify-center shrink-0 shadow-inner`}
              >
                <Icon className={`w-7 h-7 ${stat.iconColor}`} />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center flex-1 text-center pr-2">
              <span className="text-[12px] font-bold text-gray-500 mb-2">
                {stat.title}
              </span>
              <span className="text-3xl font-extrabold text-slate-800 tracking-tight leading-none">
                {stat.value}
              </span>
              <div className="flex flex-col items-center mt-2">
                <span className="text-[11px] text-gray-400 font-medium">
                  {stat.unit}
                </span>
                {stat.subText && (
                  <span
                    className={`text-xs font-bold mt-1 ${
                      stat.id === 4 ? "text-[#C2410C]" : "text-gray-500"
                    }`}
                  >
                    {stat.subText}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
