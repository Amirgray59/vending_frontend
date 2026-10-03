
"use client";

import React, { useState } from "react";
import { Trash2, Edit3, Plus, Check, X, Loader2, Wrench, AlertCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useCreateRepair } from "@/features/repairs/hooks/useCreateRepair";
import useGetDeviceRepairs from "@/features/repairs/hooks/useGetDeviceRepairs";
import { useUpdateRepair } from "@/features/repairs/hooks/useUpdateRepair";
import { useDeleteRepair } from "@/features/repairs/hooks/useDeleteReapir";
import UseGetProfile from "@/shared/hooks/useGetProfile";
import { hasActionPermission } from "@/shared/permisseions/permissionUtils";
import { formatToPersianDate } from "@/utils/formatToPersianDate";
import toast from "react-hot-toast";

const REPAIR_OPTIONS = [
  { id: "power_supply", label: "تعویض منبع تغذیه" },
  { id: "board_repair", label: "تعمیر برد اصلی" },
  { id: "wiring_check", label: "بررسی و اصلاح سیم‌کشی" },
  { id: "display_fix", label: "اصلاح نمایشگر/LED" },
  { id: "sensor_replacement", label: "تعویض سنسورها" },
  { id: "other", label: "سایر موارد (تایپ دستی)" },
];

interface RepairItem {
  id: string;
  title: string;
  description: string;
  created_at: string;
  resolved: boolean;           // اضافه شد
  resolution_note?: string;    // اضافه شد
}

const RepairsTab: React.FC = () => {
  const { deviceId } = useParams();
  const { createRepair, isCreatingRepair } = useCreateRepair();
  const { deviceRepairs, isgettingDeviceRepairs } = useGetDeviceRepairs(deviceId as string);
  const { updateRepair, isUpdaingRepair } = useUpdateRepair();
  const { deleteRepair, isDeletingRepair } = useDeleteRepair();
  const { isgettingprofile, profile } = UseGetProfile();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // استیت برای مدیریت مودال حذف
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  });

  const repairsList = deviceRepairs?.items || [];

  const handleAddRepair = async () => {
    if (!hasActionPermission(profile?.role, 'canEdit')) {
      toast.error("شما دسترسی ثبت تعمیر را ندارید");
      return;
    }
    if (!title.trim() || !description.trim()) {
      toast.error("لطفاً عنوان و توضیحات را وارد کنید");
      return;
    }
    try {
      await createRepair({
        device_id: deviceId as string,
        title: title.trim(),
        description: description.trim(),
      });
      setTitle("");
      setDescription("");
      toast.success("رکورد تعمیر با موفقیت ثبت شد");
    } catch (error) {
      toast.error("خطا در ثبت تعمیر");
    }
  };

  const startEdit = (item: RepairItem) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  const handleUpdate = async (id: string) => {
    if (!hasActionPermission(profile?.role, 'canEdit')) {
      toast.error("شما دسترسی ویرایش را ندارید");

      return;
    }
    try {
      await updateRepair({
        repairId: id,
        payload: { title: editTitle.trim(), description: editDescription.trim() },
      });
      setEditingId(null);
      toast.success("تغییرات ذخیره شد");
    } catch (error) {
      toast.error("خطا در بروزرسانی");
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    try {
      await deleteRepair(deleteModal.id);
      toast.success("رکورد با موفقیت حذف شد");
    } catch (error) {
      toast.error("خطا در حذف رکورد");
    } finally {
      setDeleteModal({ isOpen: false, id: null });
    }
  };

  if (isgettingDeviceRepairs || isgettingprofile) {
    return <div className="flex flex-col gap-3 p-4"><div className="h-20 bg-gray-100 animate-pulse rounded-xl" /></div>;
  }

  return (
    <div className="w-full space-y-6 p-4" dir="rtl">
      {/* بخش ثبت تعمیر جدید */}
      {hasActionPermission(profile?.role, 'canEdit') && (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <Wrench size={16} className="text-blue-500" /> ثبت تعمیر جدید
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
            <div className="sm:col-span-4">
              <label className="block text-xs text-gray-500 mb-1">عنوان تعمیر</label>
              <input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="عنوان..." 
                className="w-full p-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-5">
              <label className="block text-xs text-gray-500 mb-1">توضیحات / نوع تغییر</label>
              {description === "سایر موارد (تایپ دستی)" ? (
                <input 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="توضیحات را بنویسید..." 
                  className="w-full px-2 py-1.5 h-10 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <select 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className="w-full px-2 py-1.5 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">انتخاب کنید...</option>
                  {REPAIR_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.label}>{opt.label}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="sm:col-span-3">
              <button 
                onClick={handleAddRepair}
                disabled={isCreatingRepair}
                className="w-full flex items-center justify-center gap-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm h-10"
              >
                {isCreatingRepair ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                ثبت رکورد
              </button>
            </div>
          </div>
        </div>
      )}

      {/* لیست تعمیرات */}
      <div className="space-y-3">
        {repairsList.length > 0 ? (
          repairsList.map((item: RepairItem) => (
            <div key={item.id} className="flex flex-col sm:flex-row justify-between p-4 bg-white border border-gray-100 rounded-xl gap-4 transition-all hover:border-blue-100 hover:shadow-sm">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-800">{item.title}</span>

                  <span className="text-[10px] text-slate-400">{formatToPersianDate(item.created_at)}</span>
                  {item.resolved && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-medium">حل شده</span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{item.description}</p>

                {/* بخش نمایش توضیح حل شدن (Resolution Note) */}
                {item.resolved && item.resolution_note && (
                  <div className="mt-2 p-2 bg-slate-50 border-r-2 border-emerald-500 rounded-l-lg">
                    <p className="text-[11px] text-slate-600 italic">
                      <span className="font-bold not-italic text-emerald-700 ml-1">توضیح حل مشکل: </span> 
                      {item.resolution_note}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 items-center">
                {editingId === item.id ? (
                  <div className="flex gap-2">
                    <input 
                      className="p-1 text-xs border rounded" 
                      value={editTitle} 
                      onChange={(e) => setEditTitle(e.target.value)} 
                    />
                    <button onClick={() => handleUpdate(item.id)} className="p-2 h-8 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200"><Check size={16} /></button>
                    <button onClick={() => setEditingId(null)} className="p-2 h-8 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"><X size={16} /></button>
                  </div>
                ) : (
                  <>
                    {hasActionPermission(profile?.role, 'canEdit') && (
                      <button onClick={() => startEdit(item)} className="p-2 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"><Edit3 size={18} /></button>
                    )}
                    {hasActionPermission(profile?.role, 'canDelete') && (
                      <button 
                        onClick={() => setDeleteModal({ isOpen: true, id: item.id })} 
                        className="p-2 text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-slate-400 text-sm">هیچ رکورد تعمیراتی یافت نشد.</div>
        )}
      </div>

      {/* مودال تایید حذف (Custom Modal) */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2 bg-red-100 rounded-full"><AlertCircle size={24} /></div>
              <h3 className="text-lg font-bold">تأیید حذف</h3>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              آیا از حذف این رکورد تعمیرات مطمئن هستید؟ این عملیات غیرقابل بازگشت است.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={confirmDelete}
                disabled={isDeletingRepair}
                className="flex-1 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium h-10 flex items-center justify-center gap-2"
              >
                {isDeletingRepair ? <Loader2 className="animate-spin" size={16} /> : "بله، حذف شود"}
              </button>
              <button 

                onClick={() => setDeleteModal({ isOpen: false, id: null })}
                className="flex-1 p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium h-10"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepairsTab;