import { useQuery } from "@tanstack/react-query";
import { getDeviceScheduleApi } from "../../control-scheduling/api/schedulesApi";

export default function useGetDeviceSchedules(deviceId: string) {
  const { data: deviceSchedules, isLoading: isGettingDeviceSchedules } =
    useQuery({
      queryKey: ["device-schedules", deviceId],
      queryFn: () => getDeviceScheduleApi(deviceId),
      enabled: !!deviceId,
    });

  return {
    deviceSchedules,
    isGettingDeviceSchedules,
  };
}
