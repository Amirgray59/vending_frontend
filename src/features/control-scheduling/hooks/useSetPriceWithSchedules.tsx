import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { setPriceWithSchedulesApi } from "../api/price";

export function useSetPriceSchedules() {
  const queryClient = useQueryClient();

  const {mutate:setPriceSchedules,isPending:isSettingPriceSchedules}= useMutation({
    mutationFn: async ({ deviceId, payload }: { deviceId: string; payload: any }) => {
      // فراخوانی تابع API که فرستاده بودید
      return await setPriceWithSchedulesApi ({ deviceId, payload });
    },
    onSuccess: (data, variables) => {
      // نمایش پیام موفقیت
      toast.success("زمان‌بندی قیمت‌ها با موفقیت به‌روزرسانی شد");

      // به‌روزرسانی کش برای اینکه دیتای جدید در صفحه نمایش داده شود
      // فرض می‌کنم کلید کوئری شما "device-settings" است
      queryClient.invalidateQueries({ 
        queryKey: ["device-settings", variables.deviceId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["device", variables.deviceId] 
      });
    },
    onError: (error: any) => {
      // نمایش پیام خطا
      toast.error(error?.response?.data?.message || "خطا در به‌روزرسانی زمان‌بندی قیمت‌ها");
    },
  });
  return{
    setPriceSchedules,
    isSettingPriceSchedules
  }
}