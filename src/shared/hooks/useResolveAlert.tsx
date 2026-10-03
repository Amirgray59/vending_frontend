import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { resolveAlertApi } from "../api/alertApi";

export function useResolveAlert() {
  const queryClient = useQueryClient();
  const { isPending: isResolvingAlert, mutate: resolveAlert } = useMutation({
    // تغییر این خط: ورودی را به صورت آبجکت {id, data} می‌گیریم و به تابع API می‌دهیم
    mutationFn: resolveAlertApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["device-alerts"] });
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      queryClient.invalidateQueries({ queryKey: ["alert-stats"] });
      toast.success("هشدار به حل شده ها منتقل شد");
    },
    onError: (err) => {
      toast.error("مشکلی در آپدیت هشدار ها   پیش آمده است");
    },
  });
  return { isResolvingAlert, resolveAlert };
}
