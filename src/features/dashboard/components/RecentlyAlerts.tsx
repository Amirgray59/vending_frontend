
"use client";
import {
  ChevronLeft,
  AlertTriangle,
  AlertCircle,
  Info,
  OctagonAlert,
} from "lucide-react";
import Link from "next/link";
import useGetDashboardInfo from "../hooks/useGetDashboardInfo";

// تابع تعیین استایل بر اساس شدت (Severity)
const getAlertStyle = (severity: string) => {
  switch (severity?.toLowerCase()) {
    case "critical":
      return {
        icon: <AlertTriangle size={20} />,
        bg: "bg-[#F8E8E8]",
        text: "text-[#FA0000]",
        border: "border-red-100",
      };
    case "warning":
      return {
        icon: <AlertCircle size={20} />,
        bg: "bg-[#FEF1E6]",
        text: "text-[#FD4900]",
        border: "border-orange-100",
      };
    case "info":
      return {
        icon: <Info size={20} />,
        bg: "bg-[#E7F0FE]",
        text: "text-[#003AFD]",
        border: "border-blue-100",
      };
    default:
      return {
        icon: <OctagonAlert size={20} />,
        bg: "bg-gray-50",
        text: "text-gray-500",
        border: "border-gray-100",
      };
  }
};

export default function RecentAlerts() {
  const { dashboardInfo, isgettingDashboardInfo } = useGetDashboardInfo();
  const recentAlerts = dashboardInfo?.recent_alerts || [];
  const totalAlerts = dashboardInfo?.kpis?.alerts?.open || 0;

  console.log(dashboardInfo);
  

  // نمایش Skeleton در زمان لودینگ
  if (isgettingDashboardInfo) {
    return (
      <div className="w-full h-full sm:h-[350] rounded-lg border border-gray-100 bg-white py-5 px-3 shadow-sm animate-pulse" dir="rtl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-24 h-4 bg-gray-200 rounded" />
            <div className="w-6 h-6 bg-gray-200 rounded-full" />
          </div>
          <div className="w-20 h-4 bg-gray-200 rounded" />
        </div>
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between py-4 border-b border-gray-50">
              <div className="w-10 h-10 bg-gray-100 rounded-lg" />
              <div className="flex flex-col flex-1 px-2 gap-2">
                <div className="w-3/4 h-3 bg-gray-200 rounded" />
                <div className="w-1/2 h-3 bg-gray-100 rounded" />
              </div>
              <div className="w-10 h-3 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full sm:h-[350] rounded-lg border border-gray-100 bg-white py-5 px-3 shadow-sm"
      dir="rtl"
    >
      {/* هدر کارت */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-black text-slate-800">هشدارهای اخیر</h3>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[13px] font-bold text-white">
            {totalAlerts.toLocaleString("fa-IR")}
          </span>
        </div>
        <Link
          href="/alerts"
          className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
        >
          <span>مشاهده همه</span>
          <ChevronLeft size={14} />
        </Link>
      </div>


      {/* لیست هشدارها */}
      <div className="flex flex-col">
        {recentAlerts.length > 0 ? (
          recentAlerts?.slice(0,3).map((alert: any, index:any) => {
            const style = getAlertStyle(alert.severity);
            return (
              <div
                key={alert.id}
                className={`flex items-center my-1 justify-between py-4 ${
                  index !== recentAlerts.length - 1 ? "border-b border-gray-50" : ""
                }`}
              >
                {/* بخش سمت چپ: آیکون */}
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${style.bg} ${style.text} border ${style.border}`}
                >
                  {style.icon}
                </div>

                {/* بخش وسط: محتوا */}
                <div className="flex flex-col flex-1 px-2 text-right">
                  <h4 className="text-xs font-bold text-slate-700 leading-tight">
                    {alert.message}
                  </h4>
                  <p className="text-xs font-medium text-gray-400 mt-1">
                    مکان: {alert.location_name}
                  </p>
                </div>

                {/* بخش سمت راست: زمان */}
                <div className="flex flex-row-reverse w-12 items-center gap-1 text-gray-400">
                  <span className="text-[11px] font-medium">
                    {new Date(alert.created_at).toLocaleTimeString("fa-IR", { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex items-center justify-center h-32 text-gray-400 text-xs">
            هیچ هشدار اخیری یافت نشد.
          </div>
        )}
      </div>
    </div>
  );
}