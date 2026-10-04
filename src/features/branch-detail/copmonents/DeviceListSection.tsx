
"use client";

import React, { useState } from "react";
import { Trash2, Smartphone } from "lucide-react";
import { FaPlus } from "react-icons/fa6";
import CreateDeviceModal from "./CreateDeviceModal";
import UseGetDevicesSection from "../hooks/useGetDevicesSection";
import { useParams } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { useDeleteDevice } from "../hooks/useDeleteDevice";
import UseGetProfile from "@/shared/hooks/useGetProfile"; // اضافه شد
import { hasActionPermission } from "@/shared/permisseions/permissionUtils"; // اضافه شد

interface DeviceListSectionProps {
  sectionId: string | null;
}

export default function DeviceListSection({
  sectionId,
}: DeviceListSectionProps) {
  const [isCreateDevice, setIsCreateDevice] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const { branchId } = useParams();

  const { isgettingprofile, profile } = UseGetProfile(); // اضافه شد
  const { devicesSection, isGettingDevicesSection } = UseGetDevicesSection(
    sectionId,
    branchId as string,
  );
  const { deleteDevice, isDeletingDevice } = useDeleteDevice();

  const handleDeleteClick = (id: string) => {
    setDeviceId(id);
  };

  const handleDelete = async () => {
    if (deviceId) {
      // ✅ چک امنیتی مجدد قبل از اجرای عملیات حذف
      if (hasActionPermission(profile?.role, 'canDelete')) {
        await deleteDevice(deviceId);
        setDeviceId(null);
      } else {
        console.error("شما دسترسی حذف دستگاه را ندارید");
        setDeviceId(null);
      }
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-50 text-green-600 border-green-100";
      case "offline":
        return "bg-gray-50 text-gray-500 border-gray-100";
      case "pending":
      case "disabled":
      case "maintenance":
        return "bg-red-50 text-red-600 border-red-100";
      default:
        return "bg-gray-50 text-gray-400 border-gray-100";
    }
  };

  return (
    <div
      className="mx-auto p-4 border border-gray-100 shadow-sm bg-white rounded-lg pt-8 h-full"
      dir="rtl"
    >
      {sectionId ? (
        <div className="flex flex-col h-full">
          {/* هدر صفحه: عنوان و دکمه افزودن */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-xl font-bold text-gray-600">
                لیست دستگاه‌ها
              </h1>
            </div>
            {isgettingprofile ? (
              <Skeleton className="h-11" width={160} />
            ) : (

              <div className="flex items-center gap-2">
                {/* ✅ دکمه افزودن دستگاه: فقط برای کسانی که canCreate دارند */}
                {hasActionPermission(profile?.role, 'canCreate') && (
                  <button
                    onClick={() => setIsCreateDevice(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-sm font-medium text-sm"
                  >
                    افزودن دستگاه
                    <FaPlus />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Create Device Modal */}
          <CreateDeviceModal
            locationId={branchId as string}
            sectionId={sectionId}
            onClose={() => setIsCreateDevice(false)}
            open={isCreateDevice}
          />

          {/* Confirm Modal */}
          <ConfirmModal 
            handleConfirm={handleDelete} 
            onClose={() => setDeviceId(null)} 
            open={Boolean(deviceId)} 
            title="حذف دستگاه" 
          />

          {/* لیست کارت‌ها */}
          {isGettingDevicesSection || isgettingprofile ? (
            <div className="space-y-3">
              <Skeleton className="h-20" borderRadius={10} />
              <Skeleton className="h-20" borderRadius={10} />
              <Skeleton className="h-20" borderRadius={10} />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {devicesSection?.items?.length > 0 ? (
                devicesSection?.items?.map((device: any) => (
                  <div
                    key={device.id}
                    className="bg-white border border-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-between group"
                  >
                    {/* بخش اطلاعات دستگاه */}
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                        <Smartphone size={22} />
                      </div>

                      <div className="flex flex-col">
                        <span className="text-gray-800 font-bold text-sm">
                          {device.name}
                        </span>
                        <span className="text-gray-400 text-xs font-mono">
                          {device.serial || 'بدون سریال'}
                        </span>
                      </div>

                      <div className={`text-xs px-2 py-1 border rounded-full ${getStatusStyles(device.status)}`}>
                        {device.status}
                      </div>
                    </div>

                    {/* ✅ دکمه حذف: فقط برای کسانی که canDelete دارند */}
                    {hasActionPermission(profile?.role, 'canDelete') && (
                      <button
                        onClick={() => handleDeleteClick(device.id)}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="حذف دستگاه"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="w-full flex justify-center">
                  <div className="h-32 flex border-dashed w-full justify-center items-center px-10 border rounded-lg">
                    <p className="text-gray-500">هیچ دستگاهی یافت نشد!</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400">
          لطفاً ابتدا یک بخش را انتخاب کنید.
        </div>

      )}
    </div>
  );
}
