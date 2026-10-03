import { useQuery } from "@tanstack/react-query";
import { getDeviceSettingApi } from "../api/deviceApi";

export default function useGetDeviceSetting(deviceId: string) {
  const { data: deviceSetting, isLoading: isGettingDeviceSetting } =
    useQuery({
      queryKey: ["device-settings", deviceId],
      queryFn: () => getDeviceSettingApi(deviceId),
      enabled: !!deviceId,
    });

  return {
    deviceSetting,
    isGettingDeviceSetting,
  };
}
