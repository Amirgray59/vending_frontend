import { useQuery } from "@tanstack/react-query";
import { getRewardEventsApi } from "../api/eventApi";

export function useGetRewardEvents(deviceId?: string) {
  const { data: rewardEvents, isPending: isGettingRewardEvents } = useQuery(
    {
      queryKey: ["reward-events", deviceId],

      queryFn: () => getRewardEventsApi(deviceId),
    },
  );
  return { rewardEvents, isGettingRewardEvents };
}
