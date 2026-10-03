import { useQuery } from "@tanstack/react-query";
import { getDeviceInventoryTransActionsApi } from "../api/deviceTransactionsApi";

export default function useGetDeviceInventoryTransactions(deviceId: string) {
  const { data: deviceInventoryTransactions, isLoading: isGettingDeviceInventoryTransactions } =
    useQuery({
      queryKey: ["device-inventory-transactions", deviceId],
      queryFn: () => getDeviceInventoryTransActionsApi(deviceId),
      enabled: !!deviceId,
    });

  return {
    deviceInventoryTransactions,
    isGettingDeviceInventoryTransactions,
  };
}
