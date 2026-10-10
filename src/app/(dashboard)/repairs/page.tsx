
"use client";

import useGetAllRepairs from "@/features/repairs/hooks/useGetAllRepairs";
import { useResolveRepair } from "@/features/repairs/hooks/useresolveRepair";
import StyledPagination from "@/components/ui/Pagination";
import SelectInput from "@/components/form/SelectInput";
import { getAllDevicesListApi } from "@/shared/api/device";
import { Wrench, Loader2, MapPin, LayoutGrid, X } from "lucide-react";
import { useMemo, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { FaSlidersH } from "react-icons/fa";
import { LuFilter } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";
import UseGetProfile from "@/shared/hooks/useGetProfile"; 
import { hasActionPermission } from "@/shared/permisseions/permissionUtils"; 
import UseGetLocations from "@/shared/hooks/useGetLocations";
import UseGetAllSection from "@/shared/hooks/useGetAllSections";
import useGetMaintenanceCategories from "@/features/repairs/hooks/useGetMaintenanceCategories";

interface RepairItem {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  resolved: boolean;
  location_id: string; 
  section_id: string; 
  device_code: string; 
  maintenance_category_id?: string | null;
  maintenance_category_name?: string | null;
}

export default function Page() {
  const [isShowModal, setIsShowModal] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({
    device_id: "all",
    category_id: "all",
    resolved: "all",
    sort: "none",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRepairId, setSelectedRepairId] = useState<string | null>(null);
  const [resolveDescription, setResolveDescription] = useState("");

  const { isgettingprofile, profile } = UseGetProfile();
  const repairsQuery = useMemo(
    () => ({
      device_id: filterValues.device_id === "all" ? undefined : filterValues.device_id,
      category_id:
        filterValues.category_id === "all" ? undefined : filterValues.category_id,
      resolved:
        filterValues.resolved === "all" ? undefined : filterValues.resolved === "resolved",
      sort: filterValues.sort === "device" ? "device" : undefined,
      page: currentPage,
      size: pageSize,
    }),
    [filterValues, currentPage, pageSize],
  );
  const { isgettingRepairs, repairs } = useGetAllRepairs(repairsQuery);
  const { data: deviceList } = useQuery({
    queryKey: ["maintenance-device-filter-options"],
    queryFn: () => getAllDevicesListApi({}),
  });
  const { maintenanceCategories, isGettingMaintenanceCategories } =
    useGetMaintenanceCategories(true);
  const { isResolvingRepair, resolveRepair } = useResolveRepair();
  const { locations, isGettingLocations } = UseGetLocations();
  const { sectionsList, isGettingSectionsList } = UseGetAllSection();

  const getLocationName = (locId: string) => {
    const found = locations?.items?.find((loc: any) => loc.id === locId);
    return found ? found.name : "نامشخص";
  };

  const getSectionName = (secId: string) => {
    const found = sectionsList?.items?.find((sec: any) => sec.id === secId);
    return found ? found.name : "نامشخص";
  };

  const repairItems = repairs?.items || [];
  const totalPages = Math.ceil((repairs?.total || 0) / pageSize);

  const handleFilterChange = (event: { target: { name: string; value: string } }) => {
    setFilterValues((previous) => ({ ...previous, [event.target.name]: event.target.value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilterValues({
      device_id: "all",
      category_id: "all",
      resolved: "all",
      sort: "none",
    });
    setCurrentPage(1);
  };

  const handleConfirmResolve = async () => {
    if (!selectedRepairId) return;
    if (!resolveDescription.trim()) {
      alert("لطفاً توضیحات مربوط به حل مشکل را وارد کنید");
      return;
    }

    if (hasActionPermission(profile?.role, 'canCreate')) {
      try {
        await resolveRepair({ 
          repairId: selectedRepairId, 
          payload: { note: resolveDescription } 
        });
        setIsShowModal(false);
        setSelectedRepairId(null);
        setResolveDescription("");
      } catch (error) {
        console.error("Error resolving repair:", error);
      }
    }
  };

  const handleClick = (id: string) => {
    setSelectedRepairId(id);
    setIsShowModal(true);
  };

  if (
    isgettingRepairs ||
    isgettingprofile ||
    isGettingLocations ||
    isGettingSectionsList ||
    isGettingMaintenanceCategories
  ) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <section className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-bold text-slate-600">سوابق تعمیرات</h2>
          <button
            onClick={() => setIsFilterOpen((isOpen) => !isOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
              isFilterOpen
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <LuFilter className="w-4 h-4" />
            <span>فیلترها</span>
            <FaSlidersH className="w-3 h-3" />
          </button>
        </div>

        {isFilterOpen && (
          <div className="flex flex-col gap-3 p-4 bg-gray-50 border border-gray-100 rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <SelectInput
                title="دستگاه"
                name="device_id"
                filterValues={filterValues}
                handleChange={handleFilterChange}
                options={[
                  { id: "all", name: "همه دستگاه‌ها" },
                  ...(deviceList?.items ?? []).map((device: any) => ({
                    id: device.id,
                    name: device.device_code
                      ? `${device.name} (${device.device_code})`
                      : device.name,
                  })),
                ]}
              />
              <SelectInput
                title="نوع تعمیر"
                name="category_id"
                filterValues={filterValues}
                handleChange={handleFilterChange}
                options={[
                  { id: "all", name: "همه نوع‌ها" },
                  ...(maintenanceCategories?.items ?? []).map((category: any) => ({
                    id: category.id,
                    name: category.name,
                  })),
                ]}
              />
              <SelectInput
                title="وضعیت تعمیر"
                name="resolved"
                filterValues={filterValues}
                handleChange={handleFilterChange}
                options={[
                  { id: "all", name: "همه وضعیت‌ها" },
                  { id: "unresolved", name: "حل‌نشده" },
                  { id: "resolved", name: "حل‌شده" },
                ]}
              />
              <SelectInput
                title="مرتب‌سازی"
                name="sort"
                filterValues={filterValues}
                handleChange={handleFilterChange}
                options={[
                  { id: "none", name: "ترتیب پیش‌فرض" },
                  { id: "device", name: "دستگاه‌های دارای تعمیر بیشتر" },
                ]}
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleClearFilters}
                className="px-3 py-2 text-xs text-red-500 hover:bg-red-50 rounded-md transition-colors"
              >
                پاک‌کردن فیلترها
              </button>
            </div>
          </div>
        )}

        {repairItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <Wrench size={48} className="mb-3 opacity-20" />
            <p className="text-sm">تعمیراتی با این فیلترها یافت نشد.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {repairItems.map((item: RepairItem) => (
              <div
                key={item.id}

                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-blue-200 transition-all shadow-sm group gap-4"
              >
                <div className="flex flex-col gap-2 flex-1 min-w-0 overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between sm:justify-start gap-3">
                    <div className="text-blue-600 font-semibold text-sm">{item.title}</div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${item.resolved ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}`}>
                      {item.resolved ? "حل‌شده" : "حل‌نشده"}
                    </span>
                    {item.device_code && (
                      <div className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono uppercase">
                        {item.device_code}
                      </div>
                    )}
                    {item.maintenance_category_name && (
                      <div className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                        {item.maintenance_category_name}
                      </div>
                    )}
                  </div>
                  <div className="text-slate-800 font-medium text-sm wrap-break-word whitespace-normal leading-relaxed">
                    {item.description}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500">
                    <div className="flex items-center gap-1 text-xs">
                      <MapPin size={13} className="text-slate-400" />
                      <span className="font-medium">{getLocationName(item.location_id)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <LayoutGrid size={13} className="text-slate-400" />
                      <span className="font-medium">{getSectionName(item.section_id)}</span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString('fa-IR') : ""}
                  </p>
                </div>

                <div className="flex gap-2 shrink-0 self-end sm:self-center">
                  {!item.resolved && hasActionPermission(profile?.role, 'canCreate') && (
                    <button
                      onClick={() => handleClick(item.id)}
                      disabled={isResolvingRepair && selectedRepairId === item.id}
                      className="py-1.5 px-4 flex items-center gap-x-2 cursor-pointer rounded-lg transition-all text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
                    >
                      <span className="hidden sm:inline">حل شده</span>
                      {isResolvingRepair && selectedRepairId === item.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <FaCheck className="text-sm" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {repairs?.total > pageSize && (
          <StyledPagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            setPageSize={setPageSize}
          />
        )}
      </div>

      {/* --- CUSTOM RESOLVE MODAL --- */}
      {isShowModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" dir="rtl">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between bg-gray-50">
              <h3 className="font-bold text-slate-800">تایید حل تعمیر</h3>
              <button 
                onClick={() => {
                  setIsShowModal(false);
                  setSelectedRepairId(null);
                  setResolveDescription("");
                }} 
                className="p-1 hover:bg-gray-200 rounded-full transition-all"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600">
                لطفاً توضیح کوتاهی در مورد نحوه حل این مشکل وارد کنید تا در سوابق ثبت شود:
              </p>
              <textarea 

                className="w-full p-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                rows={4}
                placeholder="مثلاً: قطعه آسیب دیده تعویض شد و تست نهایی با موفقیت انجام گردید."
                value={resolveDescription}
                onChange={(e) => setResolveDescription(e.target.value)}
                autoFocus
              />
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => {
                  setIsShowModal(false);
                  setSelectedRepairId(null);
                  setResolveDescription("");
                }} 
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-gray-200 rounded-lg transition-all"
              >
                انصراف
              </button>
              <button 
                onClick={handleConfirmResolve}
                disabled={isResolvingRepair}
                className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 disabled:bg-blue-400"
              >
                {isResolvingRepair ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <FaCheck size={14} />
                )}
                ثبت نهایی
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
