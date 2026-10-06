import { useQuery } from "@tanstack/react-query";
import { getRewardEventsApi } from "../api/eventApi";

export function useGetRewardEvents(deviceId?: string, loadAll = false) {
  const { data: rewardEvents, isPending: isGettingRewardEvents } = useQuery(
    {
      queryKey: ["reward-events", deviceId, loadAll],
      queryFn: () => getRewardEventsApi(deviceId, loadAll),
      enabled: Boolean(deviceId),
    },
  );
  return { rewardEvents, isGettingRewardEvents };
}
