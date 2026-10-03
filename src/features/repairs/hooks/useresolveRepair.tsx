
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { resolveRepairApi } from "../api/repairsApi";

export function useResolveRepair() {
  const queryClient = useQueryClient();
  
  const { isPending: isResolvingRepair, mutate: resolveRepair } = useMutation({
    mutationFn: resolveRepairApi, // این تابع حالا آبجکتی شامل repairId و payload می‌گیرد
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-repairs-list"] });
      toast.success("تعمیر با موفقیت حل شد");
    },
    onError: (err) => {
      toast.error("مشکلی در حل تعمیر پیش آمده است");
    },
  });

  return { isResolvingRepair, resolveRepair };
}
