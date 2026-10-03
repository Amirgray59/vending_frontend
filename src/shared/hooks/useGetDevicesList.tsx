
import { useQuery } from "@tanstack/react-query";
import { getDevicesListApi, DeviceQueryParams } from "../api/device";

export default function UseGetDevicesList(params: DeviceQueryParams) {
  const { data: devicesList, isLoading: isGettingDevicesList } = useQuery({
    // هر بار که params تغییر کند، react-query متوجه می‌شود و درخواست جدید می‌زند
    queryKey: ["devices", params], 
    queryFn: () => getDevicesListApi(params),
  });

  return { devicesList, isGettingDevicesList };
}