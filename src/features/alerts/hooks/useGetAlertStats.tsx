import { useQuery } from "@tanstack/react-query";
import { getAlertStatsApi } from "../api/alertApi";

export default function useGetAlertStats() {
  const { data: alertStats, isLoading: isGettingAlertStats } = useQuery({
    queryKey: ["alert-stats"],
    queryFn: getAlertStatsApi,
  });
  return { alertStats, isGettingAlertStats };
}
