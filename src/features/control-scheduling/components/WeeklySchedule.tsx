
"use client";

import { Plus, X, ChevronRight, Loader2 } from "lucide-react";
import { FaRegTrashAlt } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useAddSchedule } from "@/features/control-scheduling/hooks/useAddSchedule";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { useDeleteSchedule } from "@/features/control-scheduling/hooks/useDeleteSchedule";
import useGetDeviceSchedules from "../hooks/useGetDeviceSchedule";
import { useEditSchedule } from "../hooks/useEditSchedule";
import UseGetProfile from "@/shared/hooks/useGetProfile"; 
import { hasActionPermission } from "@/shared/permisseions/permissionUtils";

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
const API_TO_DAY_MAP: Record<number, string> = {
  0: "دوشنبه",
  1: "سه‌شنبه",
  2: "چهارشنبه",
  3: "پنجشنبه",
  4: "جمعه",
  5: "شنبه",
  6: "یکشنبه",
};

interface TimeSlot {
  id: string;
  time: string;
  action: "روشن" | "خاموش";
}

interface DaySchedule {
  day: string;
  status: "فعال" | "غیرفعال";
  schedules: TimeSlot[];
  active: boolean;
}

export default function WeeklySchedule() {
  const { deviceId } = useParams();
  const [data, setData] = useState<DaySchedule[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<"list" | "form">("form");
  const [editingDayIndex, setEditingDayIndex] = useState<number | null>(null);
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [time, setTime] = useState("");
  const [action, setAction] = useState<"روشن" | "خاموش">("روشن");

  const { addSchedule, isAddingschedule } = useAddSchedule();
  const { deviceSchedules, isGettingDeviceSchedules } = useGetDeviceSchedules(
    deviceId as string,
  );
  const { deleteSchedule, isDeletingSchedule } = useDeleteSchedule();
  const { editSchedule, isEditingSchedule } = useEditSchedule();

  console.log(deviceSchedules,"device schedules");
  

  // --- Auth & Profile ---
  const { isgettingprofile, profile } = UseGetProfile();

  useEffect(() => {
    if (deviceSchedules && Array.isArray(deviceSchedules)) {
      const formattedData: DaySchedule[] = DISPLAY_DAYS.map((dayName) => ({
        day: dayName,
        status: "غیرفعال",
        active: false,
        schedules: [],
      }));

      deviceSchedules.forEach((apiItem: any) => {
        const dayName = API_TO_DAY_MAP[apiItem.day_of_week];
        const dayIndex = DISPLAY_DAYS.indexOf(dayName);
        if (dayIndex !== -1) {
          const formattedTime = `${String(apiItem.hour).padStart(2, "0")}:${String(apiItem.minute).padStart(2, "0")}`;
          const formattedAction = apiItem.action === "on" ? "روشن" : "خاموش";
          formattedData[dayIndex].schedules.push({
            id: apiItem.id,
            time: formattedTime,
            action: formattedAction,
          });
          formattedData[dayIndex].active = apiItem.enabled;
          formattedData[dayIndex].status = apiItem.enabled ? "فعال" : "غیرفعال";
        }
      });
      setData(formattedData);
    }
  }, [deviceSchedules]);

  const openAddModal = (index: number) => {
    if (!hasActionPermission(profile?.role, 'canEdit')) {

      toast.error("شما دسترسی افزودن زمان‌بندی را ندارید");
      return;
    }
    setEditingDayIndex(index);
    setEditingSlotId(null);
    setModalStep("form");
    setTime("");
    setAction("روشن");
    setIsModalOpen(true);
  };

  const openEditListModal = (index: number) => {
    if (!hasActionPermission(profile?.role, 'canEdit')) {
      toast.error("شما دسترسی مدیریت زمان‌بندی را ندارید");
      return;
    }
    setEditingDayIndex(index);
    setModalStep("list");
    setIsModalOpen(true);
  };

  const selectSlotForEdit = (slotId: string, slotTime: string, slotAction: string) => {
    setEditingSlotId(slotId);
    setTime(slotTime);
    setAction(slotAction as any);
    setModalStep("form");
  };

  const handleSave = async () => {
    if (!hasActionPermission(profile?.role, 'canEdit')) {
      toast.error("دسترسی شما محدود است");
      return;
    }
    if (!time) return toast.error("لطفاً زمان را انتخاب کنید");

    const dayName = data[editingDayIndex!].day;
    const dayNumber = DAY_TO_API_MAP[dayName];
    const [hourStr, minuteStr] = time.split(":");
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    const actionValue = action === "روشن" ? "on" : "off";

    try {
      if (editingSlotId) {
        await editSchedule(
          {
            scheduleId: editingSlotId,
            payload: { day_of_week: dayNumber, action: actionValue, hour, minute },
          },
          { onSuccess: () => { toast.success("زمان‌بندی به‌روزرسانی شد"); setIsModalOpen(false); } }
        );
      } else {
        await addSchedule(
          {
            deviceId: deviceId as string,
            payload: { day_of_week: dayNumber, action: actionValue, hour, minute },
          },
          { onSuccess: () => { toast.success("زمان‌بندی جدید ثبت شد"); setIsModalOpen(false); } }
        );
      }
    } catch (err) {
      toast.error("خطایی در ثبت اطلاعات رخ داد");
    }
  };

  const handleDeleteSlot = async (id: string) => {
    if (!hasActionPermission(profile?.role, 'canDelete')) {
      toast.error("شما دسترسی حذف این مورد را ندارید");
      return;
    }
    if (window.confirm("آیا از حذف این زمان‌بندی مطمئن هستید؟")) {
      try {
        await deleteSchedule(id);
        toast.success("زمان‌بندی با موفقیت حذف شد");
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 flex flex-col h-full relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[15px] font-bold text-gray-800">برنامه زمان‌بندی هفتگی</h2>
      </div>

      <div className="overflow-x-auto flex-1">
        {isGettingDeviceSchedules || isgettingprofile ? (
          <div className="text-center py-10 text-gray-400 animate-pulse">در حال دریافت...</div>
        ) : (
          <table className="w-full text-right text-[12px]">
            <thead className="text-gray-600 border-b border-gray-100 text-center">
              <tr>
                <th className="pb-3 text-right">روز</th>
                <th className="pb-3">وضعیت</th>
                <th className="pb-3">زمان دستورات</th>
                <th className="pb-3">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3.5 font-bold text-gray-600 text-right">{item.day}</td>
                  <td className="py-3.5 text-center">
                    <span className={`px-3 py-1 rounded-md text-xs ${item.active ? "bg-green-100 text-green-600" : "bg-red-50 text-red-500"}`}>
                      {item.status}

                    </span>
                  </td>
                  <td className="py-3.5 text-center" dir="ltr">
                    <div className="flex flex-wrap justify-center gap-2">
                      {item.schedules.length > 0 ? (
                        item.schedules.map((slot) => (
                          <div key={slot.id} className={`px-2 py-1 rounded-md text-[10px] flex items-center gap-1 ${slot.action === "روشن" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                            <span className="font-bold">{slot.time}</span>
                            <span className="mr-1">{slot.action}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-300">ثبت نشده</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {hasActionPermission(profile?.role, 'canEdit') && (
                        <>
                          <button onClick={() => openAddModal(i)} className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-all">
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => openEditListModal(i)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                            <FiEdit className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800">
                {modalStep === "list" ? "انتخاب ساعت" : editingSlotId ? "ویرایش" : "افزودن"}
              </h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-gray-400" /></button>
            </div>

            <div className="space-y-4">
              {modalStep === "list" ? (
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {data[editingDayIndex!].schedules.map((slot) => (
                    <div key={slot.id} className="flex justify-between items-center p-3 border rounded-xl hover:bg-gray-50 group">
                      <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => selectSlotForEdit(slot.id, slot.time, slot.action)}>
                        <span className="font-bold text-gray-700">{slot.time}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded ${slot.action === "روشن" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>{slot.action}</span>
                        <ChevronRight size={14} className="text-gray-300" />
                      </div>
                      <div className="flex gap-1">
                        {hasActionPermission(profile?.role, 'canEdit') && (
                          <button onClick={() => selectSlotForEdit(slot.id, slot.time, slot.action)} disabled={isEditingSchedule} className="p-2 text-blue-400 hover:text-blue-600 transition-colors">
                            <FiEdit size={14} />
                          </button>
                        )}
                        {hasActionPermission(profile?.role, 'canDelete') && (
                          <button onClick={() => handleDeleteSlot(slot.id)} disabled={isDeletingSchedule} className="p-2 text-red-400 hover:text-red-600 transition-colors">

                            <FaRegTrashAlt size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 text-right">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">ساعت</label>
                    <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full p-2 text-sm border rounded-lg outline-none focus:ring-2 ring-blue-500 text-center" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">عملگر</label>
                    <select value={action} onChange={(e) => setAction(e.target.value as any)} className="w-full p-2 text-sm border rounded-lg outline-none focus:ring-2 ring-blue-500">
                      <option value="روشن">روشن</option>
                      <option value="خاموش">خاموش</option>
                    </select>
                  </div>
                  {hasActionPermission(profile?.role, 'canEdit') && (
                    <button
                      onClick={handleSave}
                      disabled={isAddingschedule || isEditingSchedule}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 disabled:bg-gray-400 transition-all flex items-center justify-center gap-2"
                    >
                      {isAddingschedule || isEditingSchedule ? <Loader2 size={16} className="animate-spin" /> : (editingSlotId ? "به‌روزرسانی" : "ذخیره تغییرات")}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}