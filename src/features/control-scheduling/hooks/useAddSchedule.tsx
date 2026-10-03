import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addScheduleApi } from "../api/schedulesApi";

export function useAddSchedule() {
  const queryClient = useQueryClient(); // دسترسی به کلاینت برای مدیریت کش

  const { isPending: isAddingschedule, mutate: addSchedule } = useMutation({
    mutationFn: addScheduleApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["device-schedules"] });

      // toast.success("زمان بندی دستگاه با موفقیت اضافه شد");
    },
    onError: (err) => {
      // toast.error("افزودن زمانبندی دستگاه با مشکل مواجه شد");
    },
  });

  return { isAddingschedule, addSchedule };
}
