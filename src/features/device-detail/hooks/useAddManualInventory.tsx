import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addManualInventoryApi } from "../api/deviceApi";

export function useAddManualInventory() {
  const queryClient = useQueryClient(); // دسترسی به کلاینت برای مدیریت کش
  
  const { isPending: isAddingManualInventory, mutate: addManualInventory } = useMutation({
    mutationFn: addManualInventoryApi,
    onSuccess: (data, variables) => {
      const id=variables?.deviceId
      // 1. منقضی کردن کوئری لیست تراکنش‌ها (که قبلاً داشتید)
      queryClient.invalidateQueries({ queryKey: ["inventory-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["device",id] });

      // 2. منقضی کردن کوئری جزئیات دستگاه (که الان می‌خواهید)
      // چون کلید شما ["device", id] است، باید دقیقاً همان ساختار را اینجا بدهید
      // متغیر variables همان آبجکتی است که از UI فرستادید { deviceId, payload }
      queryClient.invalidateQueries({ 
        queryKey: ["device-inventory-transactions", variables.deviceId] 
      });

      toast.success("تغییرات موجودی با موفقیت ثبت شد");
    },
    onError: (err) => {
      toast.error("مشکلی در ثبت تغییرات پیش آمده است");
    },
  });

  return { isAddingManualInventory, addManualInventory };
}