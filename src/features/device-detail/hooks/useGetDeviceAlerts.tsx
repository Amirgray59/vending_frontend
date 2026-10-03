import { useQuery } from "@tanstack/react-query";
import { getDeviceAlertsApi } from "../api/deviceApi";

export default function useGetDeviceAlerts(deviceId?: string) {
  const {
    data: deviceAlerts,
    isLoading: isGettingDeviceAlerts,
  } = useQuery({
    queryKey: ["device-alerts", deviceId],
    queryFn: () => getDeviceAlertsApi(deviceId),
  });

  return {
    deviceAlerts,
    isGettingDeviceAlerts,
  };
}