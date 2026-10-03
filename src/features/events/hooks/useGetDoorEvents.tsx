import { useQuery } from "@tanstack/react-query";
import { getDoorEventsApi } from "../api/eventApi";

export function useGetDoorEvents(deviceId?: string) {
  const { data: doorEvents, isPending: isGettingDoorEvents } = useQuery(
    {
      queryKey: ["door-events", deviceId],

      queryFn: () => getDoorEventsApi(deviceId),
    },
  );
  return { doorEvents, isGettingDoorEvents };
}
