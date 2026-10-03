import { useQuery } from "@tanstack/react-query";
import { getDeviceTransactionsApi } from "../api/deviceTransactionsApi";

export default function useGetDeviceTransactions(deviceId: string) {
  const { data: deviceTransactions, isLoading: isGettingDeviceTransactions } =
    useQuery({
      queryKey: ["device-transactions", deviceId],
      queryFn: () => getDeviceTransactionsApi(deviceId),
      enabled: !!deviceId,
    });

  return {
    deviceTransactions,
    isGettingDeviceTransactions,
  };
}
