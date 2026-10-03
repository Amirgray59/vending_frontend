import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { deleteScheduleApi } from "../api/schedulesApi";

export function useDeleteSchedule() {
  const queryClient = useQueryClient();
  const { isPending: isDeletingSchedule, mutate: deleteSchedule } = useMutation(
    {
      mutationFn: deleteScheduleApi,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["device-schedules"] });
        toast.success("زمان بندی مورد نظر با موفقیت حذف شد");
      },
      onError: (err) => {
        toast.error("مشکلی در حذف زمان بندی  پیش امده است");
      },
    },
  );
  return { isDeletingSchedule, deleteSchedule };
}
