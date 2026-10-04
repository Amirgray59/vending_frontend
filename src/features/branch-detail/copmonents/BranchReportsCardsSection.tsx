import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getAllDevicesListApi } from "@/shared/api/device";
import { FaUser } from "react-icons/fa6";
import {
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineArrowTrendingUp,
} from "react-icons/hi2";
import { LuMonitor } from "react-icons/lu";

const StatCard = ({
  title,
  value,
  unit,
  change,
  icon: Icon,
  iconBg,
  iconColor,
  subText,
}: any) => (
  <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm flex flex-col items-center justify-between relative overflow-hidden">
    {/* هدر: عنوان و آیکون - ساختار دقیقاً مطابق کد خودت */}
    <div className="w-full flex justify-between items-start mb-2">
      <div className={`p-3 rounded-full ${iconBg} ${iconColor}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1 text-center">
        <p className="text-gray-700 text-sm font-bold mb-2">{title}</p>
        <h3 className="text-[#1e293b] text-xl font-bold dir-ltr tracking-tight">
          {value}
        </h3>
        <p className="text-gray-400 text-[10px] mt-1">{unit}</p>
      </div>
    </div>
  </div>
);

export default function BranchReportsCardsSection() {
  const { branchId } = useParams<{ branchId: string }>();
  const { data: devicesPage, isLoading } = useQuery({
    queryKey: ["location-device-stats", branchId],
    queryFn: () => getAllDevicesListApi({ location_id: branchId }),
    enabled: !!branchId,
  });
  const devices = devicesPage?.items ?? [];
  const deviceStats = {
    total: devicesPage?.total ?? 0,
    online: devices.filter((device: any) => device.status === "online").length,
    offline: devices.filter((device: any) => device.status === "offline").length,
    pending: devices.filter((device: any) => device.status === "pending").length,
  };

  const stats = [
    {
      title: "کل دستگاه‌ها",
      value: isLoading ? "…" : deviceStats.total.toLocaleString("fa-IR"),
      unit: "دستگاه",
      change: "۲٪",
      icon: LuMonitor,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "دستگاه‌های روشن",
      value: isLoading ? "…" : deviceStats.online.toLocaleString("fa-IR"),
      unit: "آنلاین",
      change: "۵٪",
      icon: HiOutlineCheckCircle,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "دستگاه‌های خاموش",
      value: isLoading ? "…" : deviceStats.offline.toLocaleString("fa-IR"),
      unit: "آفلاین",
      change: "۱٪",
      icon: HiOutlineXCircle,
      iconBg: "bg-gray-100",
      iconColor: "text-gray-500",
    },
    {
      title: "دستگاه‌های افلاین",
      value: isLoading ? "…" : deviceStats.pending.toLocaleString("fa-IR"),
      unit: "بدون شبکه",
      change: "۸٪",
      icon: FaUser,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index}>
          <StatCard {...stat} />
        </div>
      ))}
    </div>
  );
}
