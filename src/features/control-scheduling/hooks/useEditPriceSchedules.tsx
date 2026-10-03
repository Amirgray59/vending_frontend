

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { editPriceSchedulesApi } from "../api/price";

export function useEditPriceSchedule() {
  const queryClient = useQueryClient();

  const {mutate:editePriceSchedules,isPending:isEditingPriceSchedules}= useMutation({
    // در اینجا فرض می‌کنم تابع API شما را طوری تغییر می‌دهید که payload را هم بگیرد
    // اگر تابع API دقیقاً همان چیزی باشد که فرستادید، payload را نادیده می‌گیرد
    mutationFn: async ({ scheduleId, payload }: { scheduleId: string; payload: any }) => {
      // فراخوانی تابع API
      // نکته: پیشنهاد می‌کنم تابع editPriceSchedulesApi را تغییر دهید تا payload را هم به سرور بفرستد
      return await editPriceSchedulesApi({scheduleId, payload}); 
    },
    onSuccess: (data, variables) => {
      toast.success("تغییرات با موفقیت ذخیره شد");

      // به‌روزرسانی کش برای رفرش شدن داده‌ها در UI
      // فرض می‌کنم داده‌ها با کلید "price-schedules" ذخیره شده‌اند
      queryClient.invalidateQueries({ 
        queryKey: ["price-schedules"] 
      });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "خطا در ویرایش زمان‌بندی");
    },
  });
  return{editePriceSchedules,isEditingPriceSchedules}
}