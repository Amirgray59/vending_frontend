import { useQuery } from "@tanstack/react-query";
import { getDeviceDetailApi } from "../api/device";

export default function useGetDeviceDetail(id: string) {
  const {
    data: device,
    isLoading: isGettingDevice,
  } = useQuery({
    queryKey: ["device", id],
    queryFn: () => getDeviceDetailApi(id),
    enabled: !!id,
  });

  return {
    device,
    isGettingDevice,
  };
}