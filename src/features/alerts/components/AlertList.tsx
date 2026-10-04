"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Download,
  AlertTriangle,
  Thermometer,
  WifiOff,
  CreditCard,
  Info,
  Check,
  Loader2,
} from "lucide-react";
import StyledPagination from "@/components/ui/Pagination";
import { useResolveAlert } from "@/shared/hooks/useResolveAlert";
import toast from "react-hot-toast";
import UseGetProfile from "@/shared/hooks/useGetProfile";
import { hasActionPermission } from "@/shared/permisseions/permissionUtils";
import UseGetLocations from "@/shared/hooks/useGetLocations";
import useGetTransactionsCSVReports from "../hooks/useGetAlertsCSVReports";

interface AlertItem {
  id: string;
  type: string;
  device_code: string;
  location_id?: string | null;
  section_id?: string | null;
  location?: string;
  resolved: boolean;
  acknowledged: boolean;
  severity: string;
  message: string;
  created_at: string;
}

interface AlertListProps {
  data: AlertItem[];
  isLoading?: boolean;
  filterValues:any
}

export default function AlertList({ data = [], isLoading ,filterValues}: AlertListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    setCurrentPage(1);
  }, [data, filterValues]);

  const { isgettingprofile, profile } = UseGetProfile();
  const { isResolvingAlert, resolveAlert } = useResolveAlert();

  const { isGettingLocations, locations } = UseGetLocations();
const {executeGetAlertsCsv,isGettingAlertsCsvReports}=useGetTransactionsCSVReports()

  const getSeverityDetails = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return { text: "بحرانی", color: "bg-[#E11D48]" };
      case "warning":
        return { text: "بالا", color: "bg-[#F59E0B]" };
      case "info":
        return { text: "متوسط", color: "bg-[#FACC15]" };
      default:
        return { text: "معمولی", color: "bg-gray-400" };
    }
  };

  const getStatusDetails = (resolved: boolean, acknowledged: boolean) => {
    if (resolved)
      return { text: "حل شده", style: "bg-[#F0FDF4] text-[#15803D]" };
    if (acknowledged)
      return { text: "تأیید شده", style: "bg-[#EFF6FF] text-[#1D4ED8]" };
    return { text: "باز", style: "bg-[#FFF1F2] text-[#E11D48]" };
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "hardware_error":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "network_error":
        return <WifiOff className="w-4 h-4 text-blue-500" />;
      case "temperature_error":
        return <Thermometer className="w-4 h-4 text-orange-500" />;
      case "payment_error":
        return <CreditCard className="w-4 h-4 text-slate-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleExportAlertsCSV = async () => {
    try {
      // ۱. آماده‌سازی پارامترها (هماهنگ با نام‌های API)
      const params = {
        location_id: filterValues.places === "all" ? undefined : filterValues.places,
        type: filterValues.alertType === "all" ? undefined : filterValues.alertType,
        severity: filterValues.intensity === "all" ? undefined : filterValues.intensity,
        resolved:
          filterValues.status === "all" ? undefined : filterValues.status === "resolved",
        acknowledged:
          filterValues.acknowledged === "all"
            ? undefined
            : filterValues.acknowledged === "acknowledged",
      };

      console.log("🚀 Sending Params to API:", params);

      // ۲. اجرای هوک و دریافت دیتای خام (Blob)
      const blob = await executeGetAlertsCsv(params);
      
      if (!blob) {
        console.error("No data received from server");
        return;
      }

      // ۳. تبدیل Blob به فایل قابل دانلود در مرورگر
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      
      // نام فایل را به همراه تاریخ جاری می‌سازیم
      const fileName = `alerts_${new Date().toISOString().split('T')[0]}.csv`;
      link.setAttribute('download', fileName);
      
      document.body.appendChild(link);
      link.click();
      
      // ۴. پاک‌سازی برای جلوگیری از نشت حافظه
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Export Error:", error);
      // می‌توانید اینجا یک Toast یا Alert برای کاربر نمایش دهید
    }
  };

  const formatDateTime = (isoDate: string) => {
    if (!isoDate) return "---";
    return new Date(isoDate).toLocaleDateString("fa-IR");
  };

  const formatClock = (isoDate: string) => {
    if (!isoDate) return "---";
    return new Date(isoDate).toLocaleTimeString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleResolve = async (id: string) => {
    // ✅ لایه امنیتی: چک دسترسی در لحظه کلیک
    if (!hasActionPermission(profile?.role, "canCreate")) {
      toast.error("شما دسترسی برای حل این هشدار را ندارید");
      return;
    }

    try {
      await resolveAlert(id);
      toast.success("هشدار با موفقیت حل شد");
    } catch (error) {
      toast.error("خطا در حل هشدار");
    }
  };

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [currentPage, pageSize, data]);

  const totalPages = Math.ceil(data.length / pageSize);

  if (isLoading || isgettingprofile) {
    return (
      <div className="h-64 w-full bg-gray-50 animate-pulse rounded-xl border border-gray-100" />
    );
  }

  return (
    <div className="py-4 mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex px-4 justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">لیست هشدارها</h1>
        <button onClick={handleExportAlertsCSV} className="flex items-center font-medium cursor-pointer gap-2 px-4 py-2 border border-gray-100 shadow-sm rounded-md text-sm text-gray-800 hover:bg-gray-50 transition-all">
          <Download className="w-4 h-4" />
          خروجی اکسل
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right min-w-4xl lg:min-w-3xl">
          <thead className="bg-white  border-b border-gray-100 text-gray-500 text-xs font-medium">
            <tr className="py-2">
              <th className="py-2 px-2">نوع هشدار</th>
              <th className="py-2 px-2 text-center">دستگاه</th>
              <th className="py-2 px-2 text-center">مکان</th>
              <th className="py-2 px-2 text-center">وضعیت</th>
              <th className="py-2 px-2 text-center">شدت</th>
              <th className="py-2 px-2 text-center">زمان</th>
              <th className="py-2 px-2 text-center">عملیات</th>
            </tr>
          </thead>

          <tbody className="text-[13px] text-gray-800">
            {paginatedData.length > 0 ? (
              paginatedData.map((item: any) => {
                const sev = getSeverityDetails(item.severity);
                const stat = getStatusDetails(item.resolved, item.acknowledged);

                // --- منطق پیدا کردن نام لوکیشن از روی ID ---
                // 1. دسترسی به لیست آیتم‌های لوکیشن‌ها
                const allLocations = locations?.items || [];

                // 2. پیدا کردن لوکیشنی که ID آن با location_id هشدار یکی باشد
                const locationObj = allLocations.find(
                  (loc: any) => loc.id === item.location_id,
                );

                // 3. استخراج نام لوکیشن (اگر پیدا نشد، نمایش "نامشخص")
                const locationName = locationObj ? locationObj.name : "نامشخص";
                // -----------------------------------------

                return (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(item.type)}
                        <span className="font-bold text-gray-800">
                          {item.message}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-2 text-center font-bold text-gray-800">
                      {item.device_code}
                    </td>

                    {/* نمایش نام لوکیشن به جای ID */}
                    <td className="py-2 px-2 text-center text-gray-500">
                      {locationName}
                    </td>

                    <td className="py-2 px-2 text-center">
                      <span
                        className={`px-4 py-1 rounded-md text-[11px] font-bold ${stat.style}`}
                      >
                        {stat.text}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${sev.color}`}
                        ></span>
                        <span className="text-gray-700">{sev.text}</span>
                      </div>
                    </td>
                    <td className="py-2 px-2 text-center">
                      <div className="flex flex-col text-[11px] leading-tight text-gray-500">
                        <span className="font-bold">
                          {formatDateTime(item.created_at)}
                        </span>
                        <span>{formatClock(item.created_at)}</span>
                      </div>
                    </td>
                    <td className="py-2 px-2 text-center">
                      <div className="flex justify-center">
                        {!item.resolved ?
                          hasActionPermission(profile?.role, "canCreate") && (
                            <button
                              onClick={() => handleResolve(item.id)}
                              disabled={isResolvingAlert}
                              className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-[10px] font-bold cursor-pointer hover:bg-blue-100 transition-colors disabled:bg-gray-100 disabled:text-gray-400"
                            >
                              {isResolvingAlert ? "..." : "حل شده"}
                              <Check size={12} />
                            </button>
                          ):"_"}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-10 text-gray-400 text-sm"
                >
                  هیچ داده‌ای یافت نشد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {data.length > pageSize && (
        <div className="py-4">
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
  );
}
