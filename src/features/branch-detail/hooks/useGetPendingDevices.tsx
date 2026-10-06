import { useQuery } from "@tanstack/react-query";
import { getAllUnclaimedDevicesApi } from "../api/device";

export function useGetPendingDevices(enabled: boolean) {
  const {
    data: unclaimedDevices,
    isLoading: isGettingPendingDevices,
    isError: isPendingDevicesError,
  } = useQuery({
    queryKey: ["unclaimed-devices"],
    queryFn: getAllUnclaimedDevicesApi,
    enabled,
  });

  return {
    pendingDevices: (unclaimedDevices?.items ?? []).filter(
      (device: { status: string }) => device.status === "pending",
    ),
    isGettingPendingDevices,
    isPendingDevicesError,
  };
}
