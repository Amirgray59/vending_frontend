
"use client";

import ConfirmModal from "@/components/shared/ConfirmModal";
import { useEditDevice } from "@/features/device-detail/hooks/useEditDevice";
import useGetDeviceDetail from "@/shared/hooks/useGetDeviceDetail";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import UseGetProfile from "@/shared/hooks/useGetProfile";
import { hasActionPermission } from "@/shared/permisseions/permissionUtils";
import { useSetFreeGame } from "../hooks/useSetFreeGame";
import { Plus } from "lucide-react"; // برای آیکون دکمه

const DeviceControlCard = () => {
  const { deviceId } = useParams();
  const { device, isGettingDevice } = useGetDeviceDetail(deviceId as string);
  const { editDevice, isEditingDevice } = useEditDevice();  
  const { isSettingFreeGame, setFreeGame } = useSetFreeGame();
  const { isgettingprofile, profile } = UseGetProfile();

  console.log(device,"gggggggggg");
  

  // استیت‌ها برای وضعیت دستگاه
  const [isShowStatusModal, setIsShowStatusModal] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // استیت‌ها برای بازی رایگان
  const [freeGames, setFreeGames] = useState(0); 
  const [isShowFreeGameModal, setIsShowFreeGameModal] = useState(false);

  useEffect(() => {
    if (device) {
      setIsActive(device.is_active);
      setFreeGames(device.free_play_remaining ?? 0);
    }
  }, [device]);

  // --- عملیات تغییر وضعیت فعال/غیرفعال ---
  const handleConfirmStatus = async () => {
    if (!hasActionPermission(profile?.role, 'canEdit')) {
      toast.error("شما دسترسی تغییر وضعیت دستگاه را ندارید");
      setIsShowStatusModal(false);
      return;
    }

    const newStatus = !isActive;
    try {
      await editDevice({
        deviceId: deviceId as string,
        payload: { is_active: newStatus },
      });
      setIsActive(newStatus); 
      toast.success("وضعیت دستگاه تغییر کرد");
    } catch (error) {
      console.error(error);
    } finally {
      setIsShowStatusModal(false); 
    }
  };

  // --- عملیات افزودن بازی رایگان ---
  const handleAddFreeGameConfirm = async () => {
    if (!hasActionPermission(profile?.role, 'canEdit')) {
      toast.error("شما دسترسی افزودن بازی رایگان را ندارید");
      setIsShowFreeGameModal(false);
      return;
    }

    try {
      const nextValue = freeGames + 1; // مقدار فعلی + یک
      console.log(freeGames);
      
      await setFreeGame({
        deviceId: deviceId as string,
        payload: {
          count: nextValue,
        },
      });
      setFreeGames(nextValue); // آپدیت نمایش در صفحه
      toast.success("یک بازی رایگان با موفقیت اضافه شد");
    } catch (error) {
      console.error(error);
      toast.error("خطا در افزودن بازی رایگان");

    } finally {
      setIsShowFreeGameModal(false);
    }
  };

  if (isGettingDevice || isgettingprofile)
    return (
      <div className="h-full w-full bg-gray-100 animate-pulse rounded-lg" />
    );

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex flex-col h-full">
      <span className="text-gray-800 font-bold block mb-8 w-full">
        کنترل دستگاه
      </span>

      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col gap-2">
          <span className="text-gray-600 font-medium text-sm">
            وضعیت دستگاه
          </span>
          <div className="flex items-center gap-3">
            <span className={`text-[11px] ${isActive ? "text-green-600" : "text-gray-400"}`}>
              {isActive ? "فعال" : "غیرفعال"}
            </span>

            <button
              onClick={() => {
                if (hasActionPermission(profile?.role, 'canEdit')) {
                  setIsShowStatusModal(true);
                } else {
                  toast.error("شما دسترسی تغییر وضعیت را ندارید");
                }
              }}
              disabled={isEditingDevice}
              className={`w-11 h-6 rounded-full transition-colors duration-300 relative ${isActive ? "bg-green-500" : "bg-gray-300"}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${isActive ? "left-1" : "left-6"}`} />
            </button>

            <ConfirmModal
              handleConfirm={handleConfirmStatus}
              onClose={() => setIsShowStatusModal(false)}
              open={isShowStatusModal}
              title={`${isActive ? "تغییر وضعیت دستگاه به غیر فعال" : "تغییر وضعیت دستگاه به فعال"}`}
            />
          </div>
        </div>

        <div className="flex items-center gap-x-2 text-xs sm:text-sm text-gray-500 font-semibold">
          <span>تعداد بازی های رایگان :</span>
          <span className="text-gray-800">{freeGames}</span>
        </div>
      </div>

      {/* بخش افزودن بازی رایگان */}
      {hasActionPermission(profile?.role, 'canEdit') && (
        <div className="flex items-center justify-between mt-10 p-3 bg-slate-50 rounded-lg border border-dashed border-slate-200">
          <span className="text-sm font-semibold text-gray-600">افزودن بازی رایگان</span>

          <button 
            onClick={() => setIsShowFreeGameModal(true)}
            disabled={isSettingFreeGame}
            className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 transition-all shadow-md"
            title="افزایش یک واحد بازی رایگان"
          >
            {isSettingFreeGame ? (
               <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
               <Plus size={20} />
            )}
          </button>

          <ConfirmModal
            handleConfirm={handleAddFreeGameConfirm}
            onClose={() => setIsShowFreeGameModal(false)}
            open={isShowFreeGameModal}
            title="آیا یک بازی رایگان به این دستگاه اضافه شود؟"
          />
        </div>
      )}
    </div>
  );
};

export default DeviceControlCard;