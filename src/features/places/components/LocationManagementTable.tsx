
"use client";
import React, { useState, useMemo } from "react";
import { MapPin, Trash2, LayoutGrid } from "lucide-react";
import { FaPlus } from "react-icons/fa6";
import ConfirmModal from "@/components/shared/ConfirmModal";
import CreateBranchModal from "./CreateBranchModal";
import Link from "next/link";
import UseGetLocations from "@/shared/hooks/useGetLocations";
import { useDeleteLocation } from "../hooks/useDleteLocation";
import Skeleton from "react-loading-skeleton";
import UseGetProfile from "@/shared/hooks/useGetProfile";
import { hasActionPermission } from "@/shared/permisseions/permissionUtils";
import UseGetDevicesList from "@/shared/hooks/useGetDevicesList";
import UseGetAllSection from "@/shared/hooks/useGetAllSections";

// --- کامپوننت ردیف ---
const LocationRow = ({
  loc,
  stats,
  onDeleteId,
  profileRole,
}: {
  loc: any;
  stats: { devices: number; sections: number };
  onDeleteId: (id: string) => void;
  profileRole: string | undefined;
}) => {
  return (
    <tr className="hover:bg-gray-50/80 transition-colors group">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gray-50 text-blue-600">
            <MapPin className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium text-gray-800">{loc.name}</span>
        </div>
      </td>
      <td className="p-4 text-sm text-gray-600 text-center">{loc.city || "نامشخص"}</td>
      <td className="p-4 text-sm text-gray-600 text-center font-bold">
        {stats.devices}
      </td>
      <td className="p-4 text-sm text-gray-600 text-center font-bold">
        {stats.sections}
      </td>
      <td className="p-4">
        <div className="flex items-center justify-center gap-x-3">
          <Link
            href={`/places/${loc.id}`}
            className="text-xs border text-gray-400 border-gray-400 py-1 px-2 hover:border-blue-600 hover:text-blue-600 rounded-sm transition-all"
          >
            مشاهده مجموعه
          </Link>
          {hasActionPermission(profileRole, "canDelete") && (
            <button
              onClick={() => onDeleteId(loc.id)}
              className="p-2 cursor-pointer text-gray-400 hover:text-red-500 rounded-lg transition-all"
              title="حذف مجموعه"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default function LocationManagement() {
  const [id, setId] = useState<string | undefined>(undefined);
  const [isCreate, setIsCreate] = useState(false);

  const { deleteLocation } = useDeleteLocation();
  const { isgettingprofile, profile } = UseGetProfile();
  const { isGettingLocations, locations } = UseGetLocations();
  const { isGettingSectionsList, sectionsList } = UseGetAllSection();
  const { devicesList, isGettingDevicesList } = UseGetDevicesList();

  // --- منطق اصلی محاسبه تعداد دستگاه‌ها و بخش‌ها برای هر مکان ---
  const locationsWithStats = useMemo(() => {
    const locItems = locations?.items || [];
    const secItems = sectionsList?.items || [];
    const devItems = devicesList?.items || [];

    return locItems.map((loc: any) => {

      // تعداد بخش‌هایی که location_id آن‌ها با id این مکان یکی است
      const sectionsCount = secItems.filter((s: any) => s.location_id === loc.id).length;

      // تعداد دستگاه‌هایی که location_id آن‌ها با id این مکان یکی است
      const devicesCount = devItems.filter((d: any) => d.location_id === loc.id).length;

      return {
        ...loc,
        stats: {
          sections: sectionsCount,
          devices: devicesCount,
        },
      };
    });
  }, [locations, sectionsList, devicesList]);

  const handleConfirm = (locationId: string | undefined) => {
    if (!locationId) return;
    if (hasActionPermission(profile?.role, "canDelete")) {
      deleteLocation(locationId);
      setId(undefined);
    }
  };

  const isLoading = isGettingLocations || isgettingprofile || isGettingSectionsList || isGettingDevicesList;

  return (
    <div className="p-4 border border-gray-100 rounded-lg shadow-sm" dir="rtl">
      {/* هدر و دکمه افزودن */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
           <LayoutGrid className="text-gray-400" size={20} />
           <h2 className="text-lg font-bold text-gray-800">مدیریت مجموعه‌ها</h2>
        </div>
        {isgettingprofile ? (
          <Skeleton width={160} height={40} borderRadius={8} />
        ) : (
          hasActionPermission(profile?.role, "canCreate") && (
            <button
              onClick={() => setIsCreate(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all text-sm font-medium"
            >
              <span>ثبت مجموعه جدید</span>
              <FaPlus size={12} />
            </button>
          )
        )}
      </div>

      <CreateBranchModal onClose={() => setIsCreate(false)} open={isCreate} />

      {/* محتوای جدول */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton height={60} borderRadius={10} />
          <Skeleton height={60} borderRadius={10} />
          <Skeleton height={60} borderRadius={10} />
        </div>
      ) : locationsWithStats.length === 0 ? (
        <div className="w-full flex justify-center py-12 border-2 border-dashed rounded-lg border-gray-200">
          <p className="text-gray-400">هیچ مجموعه‌ای یافت نشد.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full text-right border-collapse min-w-2xl">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-4 text-xs font-bold text-right">نام مجموعه</th>
                <th className="p-4 text-xs font-bold text-center">شهر</th>
                <th className="p-4 text-xs font-bold text-center">تعداد دستگاه</th>
                <th className="p-4 text-xs font-bold text-center">تعداد بخش</th>
                <th className="p-4 text-xs font-bold text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {locationsWithStats.map((loc: any) => (
                <LocationRow
                  key={loc.id}
                  loc={loc}
                  stats={loc.stats}
                  profileRole={profile?.role}
                  onDeleteId={(locId) => setId(locId)}
                />
              ))}
            </tbody>
          </table>

          <ConfirmModal
            onClose={() => setId(undefined)}
            open={Boolean(id)}
            title="حذف مجموعه"
            handleConfirm={() => handleConfirm(id)}
          />
        </div>
      )}
    </div>
  );
}