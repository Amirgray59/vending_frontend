import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDeviceWeeklyScheduleApi } from "../api/device";

export function useDeleteDeviceWeeklySchedules() {
  const queryClient = useQueryClient();
  const { isPending: isDeletingDeviceScedule, mutate: deleteDeviceSchedule } =
    useMutation({
      mutationFn: deleteDeviceWeeklyScheduleApi,
      onSuccess: (data) => {},
      onError: (err) => {},
    });
  return { isDeletingDeviceScedule, deleteDeviceSchedule };
}
