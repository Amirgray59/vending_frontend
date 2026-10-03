import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { editScheduleApi } from "../api/schedulesApi";

export function useEditSchedule() {
  const queryClient = useQueryClient();
  const { isPending: isEditingSchedule, mutate: editSchedule } = useMutation(
    {
      mutationFn: editScheduleApi,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["device-schedules"] });
        toast.success("زمان بندی مورد نظر با موفقیت آپدیت شد");
      },
      onError: (err) => {
        toast.error("مشکلی در آپدیت زمان بندی  پیش امده است");
      },
    },
  );
  return { isEditingSchedule, editSchedule };
}
