import { useMutation } from "@tanstack/react-query";
import { deleteDeviceWeeklyScheduleApi } from "../api/device";

export function useDeleteDeviceWeeklySchedules() {
  const {
    isPending: isDeletingDeviceSchedule,
    mutateAsync: deleteDeviceSchedule,
  } = useMutation({ mutationFn: deleteDeviceWeeklyScheduleApi });

  return { isDeletingDeviceSchedule, deleteDeviceSchedule };
}
