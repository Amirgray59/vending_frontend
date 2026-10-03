"use client";

import React, { useState, useMemo } from "react";
import PageTitle from "@/components/shared/PageTitle";
import DevicesFilterContainer from "@/features/devices/components/DevicesFilterContainer";
import Skeleton from "react-loading-skeleton";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { toast } from "react-hot-toast";
import { LucideCheckCircle } from "lucide-react";
import UseGetDevicesList from "@/shared/hooks/useGetDevicesList";
import { useAddSchedule } from "@/features/control-scheduling/hooks/useAddSchedule";
import { useDeleteDeviceWeeklySchedules } from "@/shared/hooks/usedeleteDeviceWeeklyScheduleApi";

const DISPLAY_DAYS = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
];
const DAY_TO_API_MAP: Record<string, number> = {
  دوشنبه: 0,
  سه‌شنبه: 1,
  چهارشنبه: 2,
  پنجشنبه: 3,
  جمعه: 4,
  شنبه: 5,
  یکشنبه: 6,
};

interface TimeSlot {
  time: string;
  action: "on" | "off";
}

interface DaySchedule {
  day: string;
  active: boolean;
  schedules: TimeSlot[];
}

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

export default function BulkSchedulingPage() {
  const initialFilters = {
    places: "همه مجموعه ها",
    sections: "همه بخش ها",
    alertType: "وضعیت اتصال ",
    status: "همه وضعیت ها",
    inventory: "وضعیت موجودی",
    search: "",
  };

  const [filters, setFilterValues] = useState(initialFilters);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [scheduleTemplate, setScheduleTemplate] = useState<DaySchedule[]>(
    DISPLAY_DAYS.map((day) => ({ day, active: false, schedules: [] })),
  );

  const { devicesList, isGettingDevicesList } = UseGetDevicesList();
  const { addSchedule, isAddingschedule } = useAddSchedule();
  const {deleteDeviceSchedule,isDeletingDeviceScedule}=useDeleteDeviceWeeklySchedules()
  

  // --- فیلترینگ داده‌ها ---
  const filteredData = useMemo(() => {
    if (!devicesList?.items) return [];
    return devicesList.items.filter((device: any) => {
      const searchMatch =
        !filters.search ||
        device.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        device.device_code
          ?.toLowerCase()
          .includes(filters.search.toLowerCase());
      const locationMatch =
        filters.places === "all" ||
        filters.places === "همه مجموعه ها" ||
        device.location_id === filters.places;
      const sectionMatch =
        filters.sections === "all" ||
        filters.sections === "همه بخش ها" ||
        device.section_id === filters.sections;
      const statusMatch =
        !filters.status ||
        filters.status === "all" ||
        filters.status === "همه وضعیت ها" ||
        device.status === filters.status;
      const connectionMatch =
        !filters.alertType ||
        filters.alertType === "وضعیت اتصال " ||
        String(device.power_on) === filters.alertType;
      const inventoryMatch =
        !filters.inventory ||
        filters.inventory === "وضعیت موجودی" ||
        device.inventory_status === filters.inventory;
      return (
        searchMatch &&
        locationMatch &&
        sectionMatch &&
        statusMatch &&
        connectionMatch &&
        inventoryMatch
      );
    });
  }, [devicesList, filters]);

  // --- توابع مدیریت انتخاب دستگاه‌ها ---
  const toggleDevice = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);

    setSelectedIds(newSet);
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredData.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filteredData.map((d: any) => d.id)));
  };

  // --- توابع مدیریت زمان‌بندی ---
  const toggleDayActive = (dayIdx: number) => {
    setScheduleTemplate((prev) =>
      prev.map((item, idx) =>
        idx === dayIdx
          ? {
              ...item,
              active: !item.active,
              schedules: !item.active ? [] : item.schedules,
            }
          : item,
      ),
    );
  };

  const addSlot = (dayIdx: number) => {
    setScheduleTemplate((prev) =>
      prev.map((item, idx) =>
        idx === dayIdx
          ? {
              ...item,
              schedules: [...item.schedules, { time: "12:00", action: "on" }],
            }
          : item,
      ),
    );
  };

  const updateSlot = (
    dayIdx: number,
    slotIdx: number,
    field: keyof TimeSlot,
    value: string,
  ) => {
    setScheduleTemplate((prev) =>
      prev.map((item, idx) =>
        idx === dayIdx
          ? {
              ...item,
              schedules: item.schedules.map((slot, sIdx) =>
                sIdx === slotIdx ? { ...slot, [field]: value } : slot,
              ),
            }
          : item,
      ),
    );
  };

  const removeSlot = (dayIdx: number, slotIdx: number) => {
    setScheduleTemplate((prev) =>
      prev.map((item, idx) =>
        idx === dayIdx
          ? {
              ...item,
              schedules: item.schedules.filter((_, sIdx) => sIdx !== slotIdx),
            }
          : item,
      ),
    );
  };

  
  const handleBulkUpdate = async () => {
    if (selectedIds.size === 0) {
      toast.error("لطفاً حداقل یک دستگاه را انتخاب کنید");
      return;
    }

    const deviceIds = Array.from(selectedIds);
    const activeSchedules = scheduleTemplate
      .filter((day) => day.active)
      .flatMap((day) => {
        const dayNumber = DAY_TO_API_MAP[day.day];
        return day.schedules.map((slot) => ({
          day_of_week: dayNumber,
          time: slot.time,
          action: slot.action,
        }));
      });

    if (activeSchedules.length === 0) {
      toast.error("لطفاً حداقل یک زمان‌بندی فعال تعریف کنید");
      return;
    }

    try {
      // ایجاد یک آرایه از تمام عملیات‌ها برای هر دستگاه
      const tasks = deviceIds.map(async (deviceId) => {
        try {
          // ۱. ابتدا پاک‌سازی کل زمان‌بندی‌های هفتگی این دستگاه
          await deleteDeviceSchedule(deviceId);

          // ۲. سپس ارسال تمام اسلات‌های جدید برای این دستگاه به صورت موازی
          const schedulePromises = activeSchedules.map((slot) => {
            const [hour, minute] = slot.time.split(":").map(Number);
            return addSchedule({
              deviceId: deviceId,
              payload: {
                day_of_week: slot.day_of_week,
                action: slot.action,
                hour: isNaN(hour) ? 0 : hour,
                minute: isNaN(minute) ? 0 : minute,
              },
            });
          });

          // اجرای تمام addScheduleها برای این دستگاه به صورت همزمان
          await Promise.all(schedulePromises);
        } catch (error) {
          console.error(`Error updating device ${deviceId}:`, error);
          throw error; // خطا را به لایه بالاتر می‌فرستیم تا در catch کلی گرفته شود
        }
      });

      // اجرای تمام عملیات‌های مربوط به تمام دستگاه‌ها به صورت موازی
      await Promise.all(tasks);

      toast.success(
        `زمان‌بندی‌های قبلی پاک و تنظیمات جدید برای ${deviceIds.length} دستگاه اعمال شد`,
      );
      setSelectedIds(new Set());
    } catch (error) {
      console.error("Bulk Update Error:", error);
      toast.error("خطایی در هنگام به‌روزرسانی برخی از دستگاه‌ها رخ داد");
    }
  };

  if (isGettingDevicesList) {
  return (
    <div className="flex items-center w-full pt-24 justify-center">
      <div className="border border-gray-100 border-dashed rounded-lg p-24 flex flex-col items-center gap-6">
        {/* انیمیشن لودینگ چرخان */}
        <div className="relative flex items-center justify-center">
          {/* حلقه بیرونی کمرنگ */}
          <div className="absolute w-12 h-12 border-4 border-blue-100 rounded-full"></div>
          {/* حلقه چرخان اصلی */}
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        <p className="text-gray-500 font-medium animate-pulse">
          در حال بارگذاری اطلاعات ...
        </p>
      </div>
    </div>
  );
}

  if (
    // devicesList?.items.filter((item: any) => item.ststus === "active")
    //   .length === 0
    false
  )
    return (
      <div className=" flex items-center w-full pt-24 justify-center">
        <div className=" border border-gray-100 border-dashed rounded-lg p-24">
          <p>هیج دستگاه فعالی برای زمان بندی وجود ندارد</p>
        </div>
      </div>
    );

  return (
    <section className="p-4" dir="rtl">
      <PageTitle
        title="آپدیت گروهی زمان‌بندی"
        description="داشبورد / زمان‌بندی گروهی"
      />

      <DevicesFilterContainer
        className="grid grid-cols-12 bg-white gap-6 sm:gap-4 mt-4 p-0 sm:p-4"
        filterValues={filters}
        handleInputChange={(e: any) =>
          setFilterValues((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }))
        }
        onReset={() => setFilterValues(initialFilters)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* ۱. جدول انتخاب دستگاه‌ها */}
        <div className="lg:col-span-7 bg-white p-4 border border-gray-100 shadow-sm rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <p className="text-lg text-gray-600 font-medium">
              انتخاب دستگاه‌ها
            </p>

            {isGettingDevicesList ? (
              // حالت لودینگ: نمایش یک مستطیل خاکستری چشمک‌زن به اندازه دکمه
              <div className="h-7 w-24 bg-gray-200 rounded-sm animate-pulse"></div>
            ) : (
              // حالت نمایش دکمه
              <button
                onClick={toggleAll}
                className={`text-sm ${
                  selectedIds.size === filteredData.length
                    ? "bg-red-500"
                    : "bg-blue-600"
                } text-white py-1 px-3 rounded-sm font-medium transition-colors`}
              >
                {selectedIds.size === filteredData.length
                  ? "لغو انتخاب همه"
                  : "انتخاب همه"}
              </button>
            )}
          </div>

          {isGettingDevicesList ? (
            <Skeleton className="h-64" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-separate border-spacing-y-2">
                <thead className="text-gray-400 text-sm font-medium">
                  <tr className="text-center">
                    <th className="px-4 py-2 w-10"></th>
                    <th className="px-4 py-2">نام دستگاه</th>
                    <th className="px-4 py-2">شناسه</th>
                    <th className="px-4 py-2">وضعیت</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {(() => {
                    // ۱. ابتدا لیست را فیلتر می‌کنیم تا دستگاه‌های pending حذف شوند
                    const activeDevices = filteredData.filter(
                      (item: any) => item.status === "pending",
                    );

                    // ۲. اگر لیستی وجود نداشت، متن جایگزین را نمایش می‌دهیم
                    if (activeDevices.length === 0) {
                      return (
                        <tr className=" mt-8">
                          <td
                            colSpan={4} // تعداد ستون‌های جدول شما (چکباکس، نام، کد، وضعیت)
                            className="px-4 py-10 rounded-lg text-gray-400 text-sm italic border border-dashed border-gray-100"
                          >
                            هیچ دستگاه فعالی یافت نشد.
                          </td>
                        </tr>
                      );
                    }

                    // ۳. اگر دستگاه‌ها وجود داشتند، آن‌ها را مپ می‌کنیم
                    return activeDevices.map((device: any) => (
                      <tr
                        key={device.id}
                        className={`transition-colors ${selectedIds.has(device.id) ? "bg-blue-50" : "bg-white hover:bg-slate-50"}`}
                      >
                        <td className="px-4 py-3 border-y border-gray-100 rounded-r-lg text-center">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(device.id)}
                            onChange={() => toggleDevice(device.id)}
                            className="w-4 h-4 accent-blue-600 cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-3 border-y border-gray-100 text-slate-700 text-sm font-medium text-right">
                          <div className="flex items-center gap-2">
                            <DeviceMiniIcon /> {device.name}
                          </div>
                        </td>
                        <td className="px-4 py-3 border-y border-gray-100 text-slate-500 text-xs">
                          {device.device_code}
                        </td>
                        <td className="px-4 py-3 border-y border-gray-100">
                          <span
                            className={`px-2 py-1 rounded-md text-[10px] font-bold ${device.status === "online" || device.status === "فعال" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}
                          >
                            {device.status}
                          </span>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ۲. پنل تنظیمات زمان‌بندی */}

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-lg">
            <h2 className="text-lg text-gray-600 font-medium mb-6">
              تنظیم قالب زمان‌بندی مشترک
            </h2>
            <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
              {scheduleTemplate.map((item, dayIdx) => (
                <div
                  key={item.day}
                  className={`p-3 rounded-xl border transition-all ${item.active ? "border-blue-200 bg-blue-50/30" : "border-gray-100 bg-gray-50/30"}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-700">
                        {item.day}
                      </span>
                      <button
                        onClick={() => toggleDayActive(dayIdx)}
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${item.active ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}
                      >
                        {item.active ? "فعال" : "غیرفعال"}
                      </button>
                    </div>
                    {item.active && (
                      <button
                        onClick={() => addSlot(dayIdx)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs font-medium"
                      >
                        <LuPlus className="w-3 h-3" /> افزودن زمان
                      </button>
                    )}
                  </div>
                  {item.active && (
                    <div className="space-y-2 mt-3">
                      {item.schedules.map((slot, slotIdx) => (
                        <div
                          key={slotIdx}
                          className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-100 shadow-sm"
                        >
                          <input
                            type="time"
                            value={slot.time}
                            onChange={(e) =>
                              updateSlot(
                                dayIdx,
                                slotIdx,
                                "time",
                                e.target.value,
                              )
                            }
                            className="w-24 text-center text-xs border rounded p-1 outline-none focus:ring-1 ring-blue-500"
                          />
                          <select
                            value={slot.action}
                            onChange={(e) =>
                              updateSlot(
                                dayIdx,
                                slotIdx,
                                "action",
                                e.target.value as "on" | "off",
                              )
                            }
                            className="text-xs border rounded p-1 outline-none focus:ring-1 ring-blue-500"
                          >
                            <option value="on">روشن</option>
                            <option value="off">خاموش</option>
                          </select>
                          <button
                            onClick={() => removeSlot(dayIdx, slotIdx)}
                            className="p-1 text-red-400 hover:text-red-600"
                          >
                            <LuTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={handleBulkUpdate}
              disabled={selectedIds.size === 0 || isAddingschedule}
              className={`w-full mt-6 py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                selectedIds.size > 0
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <LucideCheckCircle size={18} />
              {isAddingschedule
                ? "در حال ارسال..."
                : `اعمال برای ${selectedIds.size} دستگاه`}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
