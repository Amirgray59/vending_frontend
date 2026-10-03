
"use client";

import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { FaPlus } from "react-icons/fa6";
import CreateSectionModal from "./CreateSectionModal";
import Link from "next/link";
import { MdArrowBackIosNew } from "react-icons/md";
import UseGetSections from "@/shared/hooks/useGetSections";
import Skeleton from "react-loading-skeleton";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { useDeleteSection } from "../hooks/useDeleteSection";
import { useParams } from "next/navigation";
import clientApi from "@/shared/clientApi/clientApi";
import { hasActionPermission } from "@/shared/permisseions/permissionUtils";
import UseGetProfile from "@/shared/hooks/useGetProfile";

// --- کامپوننت ردیف ---
const SectionRow = ({ 
  item, 
  locationId, 
  onDeleteId, 
  onViewDetails,
  profileRole 
}: { 
  item: any, 
  locationId: string, 
  onDeleteId: (id: string) => void, 
  onViewDetails: (id: string) => void,
  profileRole: string | undefined 
}) => {
  const [deviceCount, setDeviceCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchDeviceCount = async () => {
      try {
        const response = await clientApi.get(`/devices/?location_id=${locationId}&section_id=${item.id}`);
        const items = response?.data?.items || [];
        if (isMounted) setDeviceCount(items.length);
      } catch (error) {
        console.error(`Error fetching devices for section ${item.id}:`, error);
        if (isMounted) setDeviceCount(0);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchDeviceCount();
    return () => { isMounted = false; };
  }, [item.id, locationId]);

  return (
    <tr className="group hover:shadow-md transition-shadow duration-200">
      <td className="bg-white text-center text-sm text-gray-500 font-semibold py-4 px-6 border-y border-gray-100/80">
        {item.name}
      </td>
      <td className="bg-white py-4 px-6 border-y border-gray-100/80 text-center">
        {isLoading ? <Skeleton width={20} height={15} /> : (
          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
            {deviceCount} دستگاه
          </span>
        )}
      </td>
      <td className="bg-white py-2 px-6 rounded-l-xl border-y border-l border-gray-100/80 text-center">
        <div className="flex justify-center items-center gap-x-3">
          {/* دکمه جزئیات: برای همه نمایش داده شود */}
          <button
            onClick={() => onViewDetails(item.id)}
            className="text-xs h-6 border text-gray-400 border-gray-400 px-2 hover:border-blue-600 hover:text-blue-600 rounded-sm transition-all"
          >
            جزئیات
          </button>

          {/* دکمه حذف: فقط برای کسانی که canDelete دارند */}
          {hasActionPermission(profileRole, 'canDelete') && (
            <button
              onClick={() => onDeleteId(item.id)}

              className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-all"
              title="حذف بخش"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

interface SectionInfoTableProps {
  setSectionId: Dispatch<SetStateAction<string | null>>;
}

export default function SectionInfoTable({ setSectionId }: SectionInfoTableProps) {
  const { isgettingprofile, profile } = UseGetProfile();
  const params = useParams<{ branchId: string }>();
  const locationId = params.branchId;

  const [isCreateSection, setIsCreateSection] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [id, setId] = useState<string | null>(null);

  const { isGettingSections, sections } = UseGetSections(locationId);
  const { deleteSection } = useDeleteSection();

  // ✅ اصلاح تابع حذف با چک امنیتی
  const handleDelete = async (sectionId: string | null) => {
    if (!sectionId) return;

    if (hasActionPermission(profile?.role, 'canDelete')) {
      try {
        await deleteSection(sectionId);
      } catch (e) {
        console.error("Delete failed", e);
      } finally {
        setIsDelete(false);
        setId(null);
      }
    } else {
      console.error("شما دسترسی حذف ندارید");
      setIsDelete(false);
      setId(null);
    }
  };

  const handleDeleteBtnClick = (sectionId: string) => {
    setId(sectionId);
    setIsDelete(true);
  };

  return (
    <div className="w-full h-full bg-white border-gray-100 shadow-sm rounded-lg p-4" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-600 my-4">لیست بخش ها</h3>
        {(isGettingSections || isgettingprofile) ? (
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
            <Skeleton className="h-11" width={140} borderRadius={10} />
            <Skeleton className="h-11" width={180} borderRadius={10} />
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
            {/* دکمه افزودن بخش: فقط برای کسانی که canCreate دارند */}
            {hasActionPermission(profile?.role, 'canCreate') && (
              <button
                onClick={() => setIsCreateSection(true)}
                className="flex text-xs sm:text-sm py-2 px-5 hover:bg-blue-700 items-center justify-center gap-x-2 rounded-lg bg-blue-600 text-white font-medium transition-all"
              >
                <span>افزودن بخش</span>
                <FaPlus />
              </button>
            )}
            <Link
              href="/places"
              className="flex text-xs sm:text-sm py-2 px-5 hover:bg-blue-700 items-center justify-center gap-x-2 rounded-lg bg-blue-600 text-white font-medium transition-all"
            >
              <span>برگشت به مجموعه ها</span>
              <MdArrowBackIosNew />
            </Link>
          </div>
        )}
      </div>

      <CreateSectionModal
        onClose={() => setIsCreateSection(false)}
        open={isCreateSection}
      />

      {(isGettingSections || isgettingprofile) ? (
        <div className="space-y-3">
          <Skeleton className="h-12" borderRadius={10} />
          <Skeleton className="h-12" borderRadius={10} />
          <Skeleton className="h-12" borderRadius={10} />
        </div>
      ) : sections?.items?.length === 0 ? (
        <div className="w-full flex justify-center">
          <div className="h-32 flex border-dashed w-full justify-center items-center px-10 border rounded-lg">
            <p className="text-gray-500">هیچ بخشی ثبت نشده است!</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-3 min-w-lg sm:min-w-md">
            <thead className="text-gray-400 text-sm font-medium">

              <tr>
                <th className="px-6 pb-2 font-normal text-center">نام بخش</th>
                <th className="px-6 pb-2 text-center font-normal">تعداد دستگاه‌ها</th>
                <th className="px-6 pb-2 text-center font-normal">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sections?.items?.map((item: any) => (
                <SectionRow 
                  key={item.id} 
                  item={item} 
                  locationId={locationId || ""} 
                  profileRole={profile?.role} 
                  onDeleteId={(sId) => handleDeleteBtnClick(sId)} 
                  onViewDetails={(sId) => setSectionId(sId)} 
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        handleConfirm={() => handleDelete(id)}
        onClose={() => {
          setIsDelete(false);
          setId(null);
        }}
        open={isDelete}
        title="حذف بخش"
      />
    </div>
  );
}