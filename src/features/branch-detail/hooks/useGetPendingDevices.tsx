import { useQuery } from "@tanstack/react-query";
import { getPendingDevicesForClaimApi } from "../api/device";

export function useGetPendingDevices(enabled: boolean) {
  const {
    data: unclaimedDevices,
    error: pendingDevicesError,
    isLoading: isGettingPendingDevices,
    isError: isPendingDevicesError,
  } = useQuery({
    queryKey: ["pending-claim-devices"],
    queryFn: getPendingDevicesForClaimApi,
    enabled,
    staleTime: 0,
  });

  return {
    pendingDevices: unclaimedDevices?.items ?? [],
    pendingDevicesError,
    isGettingPendingDevices,
    isPendingDevicesError,
  };
}
