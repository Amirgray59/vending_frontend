
"use client";

import { useQueryClient } from "@tanstack/react-query";
import useGetDeviceDetail from "@/shared/hooks/useGetDeviceDetail";
import { Laptop, Send, Loader2, Clock, X, Plus, Trash2 } from "lucide-react"; 
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useUpdatePrice } from "../hooks/useUpdatePrice";
import toast from "react-hot-toast";
import useGetToggle from "../hooks/useGetToggle";
import { useUpdateToggle } from "../hooks/useUpdateToggle";
import UseGetProfile from "@/shared/hooks/useGetProfile"; 
import { hasActionPermission } from "@/shared/permisseions/permissionUtils";
import useGetDeviceSetting from "@/features/device-detail/hooks/useGetDeviceSetting";

// --- وارد کردن هوک‌های زمان‌بندی ---
import { useGetPriceSchedules } from "../hooks/useGetPriceSchedules";
import { useSetPriceSchedules } from "../hooks/useSetPriceWithSchedules";
import { useEditPriceSchedule } from "../hooks/useEditPriceSchedules";
import { useDeletePriceSchedule } from "../hooks/useDeletePriceSchedules";


interface TimeSlot {
  id?: string;
  start: string;
  end: string;
  price: number;
}

interface DaySlot {
  day: number;
  name: string;
  slots: TimeSlot[];
}

export default function DeviceSetting() {
  const queryClient = useQueryClient();
  const { deviceId } = useParams();

  // Hooks for data fetching
  const { device, isGettingDevice } = useGetDeviceDetail(deviceId as string);
  const { deviceSetting, isGettingDeviceSetting } = useGetDeviceSetting(deviceId as string);
  const { toggle } = useGetToggle();
  const { isgettingprofile, profile } = UseGetProfile();

  // --- هوک‌های داینامیک زمان‌بندی ---
  const { priceSchedules, isGettingPriceSchedules } = useGetPriceSchedules(deviceId as string);
  const { setPriceSchedules, isSettingPriceSchedules } = useSetPriceSchedules();
  const { editePriceSchedules, isEditingPriceSchedules } = useEditPriceSchedule();
  const { deletePriceSchedules, isDeletingPriceSchedules } = useDeletePriceSchedule();

  // Hooks for updates
  const { isUpdatingPrice, updatePrice } = useUpdatePrice();
  const { isUpdatingToggle, updateToggle } = useUpdateToggle();

  const canEdit = hasActionPermission(profile?.role, 'canEdit');

  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    toggle_interval_s: 0,
    toggle_duration_s: 0,
    toggle_count: 0,
    pos_ip: "", 
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeSlots, setTimeSlots] = useState<DaySlot[]>([
    { day: 0, name: "دوشنبه", slots: [] },
    { day: 1, name: "سه‌شنبه", slots: [] },
    { day: 2, name: "چهارشنبه", slots: [] },
    { day: 3, name: "پنجشنبه", slots: [] },
    { day: 4, name: "جمعه", slots: [] },
    { day: 5, name: "شنبه", slots: [] },
    { day: 6, name: "یکشنبه", slots: [] },
  ]);

  useEffect(() => {
    if (priceSchedules) {
      const updatedDays = [...timeSlots];
      updatedDays.forEach(day => day.slots = []);
      priceSchedules.forEach((item: any) => {
        const dayIndex = updatedDays.findIndex(d => d.day === item.day_of_week);
        if (dayIndex !== -1) {
          updatedDays[dayIndex].slots.push({
            id: item.id,
            start: `${String(item.start_hour).padStart(2, '0')}:${String(item.start_minute).padStart(2, '0')}`,
            end: `${String(item.end_hour).padStart(2, '0')}:${String(item.end_minute).padStart(2, '0')}`,
            price: item.price
          });
        }
      });
      setTimeSlots(updatedDays);
    }
  }, [priceSchedules]);


  const addSlot = (dayIndex: number) => {
    const newSlots = [...timeSlots];
    newSlots[dayIndex].slots.push({ start: "00:00", end: "00:00", price: 0 });
    setTimeSlots(newSlots);
  };

  const removeSlot = (dayIndex: number, slotIndex: number) => {
    const newSlots = [...timeSlots];
    newSlots[dayIndex].slots.splice(slotIndex, 1);
    setTimeSlots(newSlots);
  };

  const updateSlot = (dayIndex: number, slotIndex: number, field: string, value: string | number) => {
    const newSlots = [...timeSlots];
    newSlots[dayIndex].slots[slotIndex] = { ...newSlots[dayIndex].slots[slotIndex], [field]: value };
    setTimeSlots(newSlots);
  };

  useEffect(() => {
    if (device) {
      setFormData((prev) => ({ ...prev, name: device.name || "بدون نام", price: device.price ?? 0, pos_ip: device.pos_ip ?? "" }));
    }
    if (deviceSetting) {
      setFormData((prev) => ({
        ...prev,
        price: deviceSetting.price ?? (device?.price ?? 0),
        pos_ip: deviceSetting.pos_ip ?? (device?.pos_ip ?? ""),
        toggle_interval_s: deviceSetting.toggle_interval_s ?? 0,
        toggle_duration_s: deviceSetting.toggle_duration_s ?? 0,
        toggle_count: deviceSetting.toggle_count ?? 0,
      }));
    } else if (toggle?.items && deviceId) {
      const deviceToggle = toggle.items.find((item: any) => item.device_id === (deviceId as string));
      if (deviceToggle) {
        setFormData((prev) => ({
          ...prev,
          toggle_interval_s: deviceToggle.toggle_interval_s ?? 0,
          toggle_duration_s: deviceToggle.toggle_duration_s ?? 0,
          toggle_count: deviceToggle.toggle_count ?? 0,
        }));
      }
    }
  }, [device, deviceSetting, toggle, deviceId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canEdit) return; 
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = async () => {
    if (!deviceId || !canEdit) return;
    try {
      await Promise.all([
        updatePrice({ deviceId: deviceId as string, payload: { price: Number(formData.price) } }),
        updateToggle({
          deviceId: deviceId as string,
          payload: {
            toggle_interval_s: Number(formData.toggle_interval_s),
            toggle_duration_s: Number(formData.toggle_duration_s),
            toggle_count: Number(formData.toggle_count),
            pos_ip: formData.pos_ip,
          },
        }),
      ]);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["device-settings", deviceId] }),
        queryClient.invalidateQueries({ queryKey: ["device", deviceId] }),
      ]);
    } catch (error) {
      toast.error("خطا در به‌روزرسانی تنظیمات.");
    }
  };

  const handleSaveSchedules = async () => {
    const payloadArray = timeSlots.flatMap(day => 
      day.slots.map(slot => {
        const [startH, startM] = slot.start.split(':').map(Number);
        const [endH, endM] = slot.end.split(':').map(Number);
        return {
          day_of_week: day.day,
          start_hour: startH,
          start_minute: startM,
          end_hour: endH,
          end_minute: endM,
          price: slot.price
        };
      })
    );
    try {
      await setPriceSchedules({ deviceId: deviceId as string, payload: { ranges: payloadArray } });
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (isgettingprofile || isGettingDevice || isGettingDeviceSetting || isGettingPriceSchedules) {
    return <div className="h-full w-full bg-gray-100 animate-pulse rounded-lg" />;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 h-full flex flex-col" dir="rtl">
      <div className="flex items-center justify-between mb-8">
        <div className="text-right">
          <h2 className="text-slate-800 font-bold text-lg">{formData.name || "در حال بارگذاری..."}</h2>
        </div>
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">

          <Laptop size={24} />
        </div>
      </div>

      <div className="space-y-6 flex-1">
        <div className="space-y-2">
          <label className="text-xs text-slate-500 block text-right">قیمت (ریال)</label>
          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            readOnly={!canEdit}
            className={`w-full p-3 bg-slate-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-all text-left ${!canEdit ? "opacity-70 cursor-not-allowed" : ""}`}
          />
          {canEdit && (
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 transition-colors mt-2 mr-1">
              <Clock size={14} />
              تنظیم قیمت در بازه‌های زمانی
            </button>
          )}
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-700 border-b pb-2">تنظیمات Toggle</h4>
          <div className="flex items-center justify-between gap-4">
            <input name="pos_ip" type="text" value={formData.pos_ip} onChange={handleInputChange} readOnly={!canEdit} placeholder="مثلاً 192.168.1.1" className={`w-40 p-2 bg-slate-50 border border-gray-200 rounded-lg text-xs text-center outline-none focus:border-blue-500 ${!canEdit ? "opacity-70 cursor-not-allowed" : ""}`} />
            <span className="text-xs text-slate-500">آدرس POS IP</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <input name="toggle_duration_s" type="number" value={formData.toggle_duration_s} onChange={handleInputChange} readOnly={!canEdit} className={`w-24 p-2 bg-slate-50 border border-gray-200 rounded-lg text-xs text-center outline-none focus:border-blue-500 ${!canEdit ? "opacity-70 cursor-not-allowed" : ""}`} />
            <span className="text-xs text-slate-500">زمان toggle (s)</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <input name="toggle_interval_s" type="number" value={formData.toggle_interval_s} onChange={handleInputChange} readOnly={!canEdit} className={`w-24 p-2 bg-slate-50 border border-gray-200 rounded-lg text-xs text-center outline-none focus:border-blue-500 ${!canEdit ? "opacity-70 cursor-not-allowed" : ""}`} />
            <span className="text-xs text-slate-500">فاصله بین تاگل‌ها (s)</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <input name="toggle_count" type="number" value={formData.toggle_count} onChange={handleInputChange} readOnly={!canEdit} className={`w-24 p-2 bg-slate-50 border border-gray-200 rounded-lg text-xs text-center outline-none focus:border-blue-500 ${!canEdit ? "opacity-70 cursor-not-allowed" : ""}`} />
            <span className="text-xs text-slate-500">تعداد toggle</span>
          </div>
        </div>
      </div>

      {canEdit && (
        <button onClick={handleSaveSettings} disabled={isUpdatingPrice || isUpdatingToggle} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 mt-8 disabled:bg-gray-400 disabled:shadow-none">
          {isUpdatingPrice || isUpdatingToggle ? <Loader2 size={18} className="animate-spin" /> : <><span>ارسال به دستگاه</span><Send size={18} /></>}
        </button>
      )}

      {/* --- TIME SLOTS MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" dir="rtl">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b flex items-center justify-between bg-gray-50">
              <h3 className="font-bold text-slate-800">تنظیمات قیمت بازه‌ای</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-200 rounded-full transition-all">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-6">
              {timeSlots.map((day, dayIdx) => (
                <div key={day.day} className="border rounded-xl p-3 bg-white shadow-sm border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{day.day}</span>
                      <span className="text-sm font-bold text-slate-700">{day.name}</span>
                    </div>
                    <button 
                      onClick={() => addSlot(dayIdx)} 
                      className="p-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-all"
                      title="افزودن بازه"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {day.slots.map((slot: any, slotIdx) => (
                      <div key={slotIdx} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
                        <input 
                          type="time" 
                          value={slot.start} 
                          onChange={(e) => updateSlot(dayIdx, slotIdx, 'start', e.target.value)}
                          className="p-1 text-xs border rounded bg-white"
                        />
                        <span className="text-gray-400 text-xs">تا</span>
                        <input 
                          type="time" 
                          value={slot.end} 
                          onChange={(e) => updateSlot(dayIdx, slotIdx, 'end', e.target.value)}
                          className="p-1 text-xs border rounded bg-white"
                        />
                        <input 
                          type="number" 
                          value={slot.price} 
                          onChange={(e) => updateSlot(dayIdx, slotIdx, 'price', Number(e.target.value))}
                          className="p-1 text-xs border rounded bg-white w-20 text-center"
                        />
                        <button 
                          onClick={() => {
                            if (slot.id) deletePriceSchedules(slot.id);
                            removeSlot(dayIdx, slotIdx);
                          }} 
                          disabled={isDeletingPriceSchedules}
                          className="p-1 text-red-400 hover:text-red-600 transition-all disabled:opacity-50"
                        >
                          {isDeletingPriceSchedules ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    ))}
                    {day.slots.length === 0 && (
                      <p className="text-[11px] text-gray-400 text-center py-1">بازه زمانی تعریف نشده است</p>
                    )}
                  </div>
                </div>
              ))}

            </div>

            <div className="p-4 border-t bg-gray-50 flex justify-end">
              <button 
                onClick={handleSaveSchedules} 
                disabled={isSettingPriceSchedules}
                className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 disabled:bg-gray-400"
              >
                {isSettingPriceSchedules && <Loader2 size={16} className="animate-spin" />}
                ذخیره تغییرات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}