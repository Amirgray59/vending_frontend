import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deletePriceSchedulesApi } from "../api/price";

export function useDeletePriceSchedule() {
  const queryClient = useQueryClient();

  const { mutate: deletePriceSchedules, isPending: isDeletingPriceSchedules } =
    useMutation({
      mutationFn: async (scheduleId: string) => {
        // فراخوانی تابع API برای حذف
        return await deletePriceSchedulesApi(scheduleId);
      },
      onSuccess: () => {
        // نمایش پیام موفقیت
        toast.success("بازه زمانی با موفقیت حذف شد");

        // به‌روزرسانی کش برای حذف شدن آیتم از لیست در UI
        queryClient.invalidateQueries({
          queryKey: ["price-schedules"],
        });
      },
      onError: (error: any) => {
        // نمایش پیام خطا
        toast.error(error?.response?.data?.message || "خطا در حذف بازه زمانی");
      },
    });
  return { deletePriceSchedules, isDeletingPriceSchedules };
}
