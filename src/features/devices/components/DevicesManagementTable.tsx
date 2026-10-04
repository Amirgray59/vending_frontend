"use client";
import React, { useState } from "react";
import { Eye } from "lucide-react";
import StyledPagination from "@/components/ui/Pagination";
import Link from "next/link";
import { LuTrash2 } from "react-icons/lu";
import UseGetDevicesList from "@/shared/hooks/useGetDevicesList";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { useDeleteDevice } from "../hooks/useDeleteDevice";
import Skeleton from "react-loading-skeleton";
import { FaSlidersH } from "react-icons/fa";
import UseGetProfile from "@/shared/hooks/useGetProfile";
import { hasActionPermission } from "@/shared/permisseions/permissionUtils";
import toast from "react-hot-toast";
import { FaBoxOpen, FaFileInvoiceDollar } from "react-icons/fa6";
import { formatToPersianDate } from "@/utils/formatToPersianDate";

const STATUS_MAP: Record<string, { name: string; style: string }> = {
  pending: { name: "در انتظار بررسی", style: "bg-blue-50 text-blue-600" },
  online: { name: "آنلاین", style: "bg-green-50 text-green-600" },
  offline: { name: "آفلاین", style: "bg-gray-50 text-gray-500" },
  disabled: { name: "غیر فعال", style: "bg-red-50 text-red-600" },

  maintenance: { name: "در حال تعمیر", style: "bg-orange-50 text-orange-600" },
};

const statusStyles: Record<string, string> = {
  good: "bg-green-50 text-green-600",
  yellow: "bg-yellow-50 text-yellow-600",
  red: "bg-red-50 text-red-600",
  empty: "bg-gray-100 text-gray-500",
};

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

export default function DeviceManagementTable({ filters }: { filters: any }) {
  // ✅ مقادیر پیش‌فرض طبق درخواست تو
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // ✅ آماده‌سازی پارامترها برای ارسال به سرور (مطابق با Swagger)
  const queryParams = {
    page: currentPage,
    size: pageSize,
    q: filters.search || "",
    location_id:
      filters.places === "all" || filters.places === "all_places"
        ? null
        : filters.places,
    section_id:
      filters.sections === "all" || filters.sections === "all_sections"
        ? null
        : filters.sections,
    city: filters.city === "all" ? null : filters.city,
    status:
      filters.status === "all" || filters.status === "all_status"
        ? null
        : filters.status,
    connection: filters.alertType === "all_power" ? null : filters.alertType,
    inventory:
      filters.inventory === "all" || filters.inventory === "all_inventory"
        ? null
        : filters.inventory,
    // اگر فیلتر deviceId هم داری می‌توانی اینجا اضافه کنی
  };

  // ✅ پاس دادن پارامترها به هوک
  const { devicesList, isGettingDevicesList } = UseGetDevicesList(queryParams);

  
  

  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);
  const [deviceId, setDeviceId] = useState<null | string>(null);
  const { deleteDevice } = useDeleteDevice();
  const { isgettingprofile, profile } = UseGetProfile();

  const handleDeleteBtnClick = (id: string) => {
    setIsShowConfirmModal(true);
    setDeviceId(id);
  };

  const handleDeleleteDevice = async () => {
    if (deviceId) {
      if (hasActionPermission(profile?.role, "canDelete")) {
        try {
          await deleteDevice(deviceId);
          toast.success("دستگاه با موفقیت حذف شد");
        } catch (error) {
          toast.error("خطا در حذف دستگاه");
        } finally {
          setIsShowConfirmModal(false);
          setDeviceId(null);
        }
      } else {
        toast.error("شما دسترسی حذف دستگاه را ندارید");
      }
    }
  };

  // ✅ دیتای نهایی مستقیماً از سرور می‌آید و نیازی به slice یا filter کلاینتی نیست
  const dataToRender = devicesList?.items || [];
  const totalPages = Math.ceil((devicesList?.total || 0) / pageSize);

  if (isGettingDevicesList || isgettingprofile) {
    return (
      <div className="p-4">
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div
      className="w-full p-4 bg-white border border-gray-100 shadow-sm rounded-lg mt-4"
      dir="rtl"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-3/4">
          <h2 className="text-lg font-bold text-gray-800">لیست دستگاه‌ها</h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-2 w-full">
          <Link
            href="/devices/devices-fainancial-report"
            className="flex-1 flex items-center w-full justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-md transition-colors shadow-sm"
          >
            <FaFileInvoiceDollar className="w-4 h-4" />
            <span>گزارش مالی</span>
          </Link>

          <Link
            href="/devices/devices-inventory-reports"
            className="flex-1 flex items-center w-full justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors shadow-sm"
          >
            <FaBoxOpen className="w-4 h-4" />
            <span>گزارش موجودی</span>
          </Link>
          {hasActionPermission(profile?.role, "canCreate") && (
            <Link
              href="/devices/bulk-device-operations"
              className="flex-1 flex items-center w-full justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors shadow-sm"
            >
              <FaSlidersH className="w-4 h-4" />
              <span>زمان بندی</span>
            </Link>
          )}
        </div>
      </div>

      {dataToRender.length === 0 ? (
        <div className="flex justify-center py-6">
          <div className="border border-gray-200 border-dashed rounded-lg w-full h-32 flex items-center justify-center">
            <p>هیچ دستگاهی با این مشخصات یافت نشد</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-4xl text-right border-separate border-spacing-y-2">
            <thead className="text-gray-400 text-sm font-medium">
              <tr>
                <th className="px-4 py-2 font-normal">نام دستگاه</th>
                <th className="px-4 py-2 font-normal text-nowrap">
                  شناسه دستگاه
                </th>
                <th className="px-4 py-2 font-normal text-center">مجموعه</th>
                <th className="px-4 py-2 font-normal text-center">بخش</th>
                <th className="px-4 py-2 font-normal text-nowrap text-center">
                  وضعیت دستگاه
                </th>
                <th className="px-4 py-2 font-normal text-nowrap text-center">
                  موجودی
                </th>
                <th className="px-4 py-2 font-normal text-nowrap text-center">
                  آخرین اتصال
                </th>
                <th className="px-4 py-2 font-normal w-40 text-center">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody>
              {dataToRender.map((device: any) => {
                const statusInfo = STATUS_MAP[device.status] || {
                  name: device.status,
                  style: "bg-gray-50 text-gray-400",
                };
                const inventoryDisplay = device.inventory_capacity
                  ? `${Math.round((device.inventory_level / device.inventory_capacity) * 100)}%`
                  : device.inventory_level;

                return (
                  <tr
                    key={device.id}
                    className="bg-white hover:bg-slate-50 transition-colors group"
                  >
                    <td className="px-4 py-3 rounded-r-lg text-nowrap border-y border-r border-gray-100 text-slate-700 text-[14px] font-medium align-middle">
                      <div className="flex items-center gap-2">
                        <DeviceMiniIcon /> {device.name}
                      </div>
                    </td>
                    <td className="px-4 w-16 py-3 text-center text-nowrap border-y border-gray-100 text-slate-500 text-[12px] align-middle">
                      {device.device_code}
                    </td>
                    <td className="px-4 text-center py-3 border-y border-gray-100 text-slate-500 text-[13px] text-nowrap align-middle">
                      {device.location_name}
                    </td>
                    <td className="px-4 py-3 border-y text-center border-gray-100 text-slate-500 text-[13px] text-nowrap align-middle">
                      {device.section_name}
                    </td>
                    <td className="px-4 text-center py-3 border-y border-gray-100 align-middle">
                      <span
                        className={`px-3 py-1 rounded-md text-[11px] font-bold ${statusInfo.style}`}
                      >
                        {statusInfo.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center border-y border-gray-100 align-middle">
                      <span
                        className={`px-3 py-1 rounded-md text-[11px] font-bold ${statusStyles[device.inventory_status] || "bg-slate-50 text-slate-400"}`}
                      >
                        {inventoryDisplay}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center border-y border-gray-100 align-middle text-slate-500 text-[13px] text-nowrap">
                      {formatToPersianDate(device.last_seen_at)}
                    </td>
                    <td className="px-4 py-3 text-center border-y border-gray-100 align-middle">
                      <div className="flex justify-center gap-2">
                        <Link
                          href={`/devices/${device.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-all border border-gray-200 rounded-md"
                        >
                          <Eye size={16} />
                        </Link>
                        {hasActionPermission(profile?.role, "canDelete") && (
                          <button
                            onClick={() => handleDeleteBtnClick(device.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-all border border-gray-200 rounded-md"
                          >
                            <LuTrash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

        <div className="mt-4">
          <StyledPagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            setPageSize={setPageSize}
          />
        </div>

      <ConfirmModal
        handleConfirm={handleDeleleteDevice}
        onClose={() => {
          setIsShowConfirmModal(false);
          setDeviceId(null);
        }}
        open={isShowConfirmModal}
        title="حذف دستگاه"
      />
    </div>
  );
}
