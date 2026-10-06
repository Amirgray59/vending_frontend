import { useQuery } from "@tanstack/react-query";
import { getDoorEventsApi } from "../api/eventApi";

export function useGetDoorEvents(deviceId?: string, loadAll = false) {
  const { data: doorEvents, isPending: isGettingDoorEvents } = useQuery(
    {
      queryKey: ["door-events", deviceId, loadAll],
      queryFn: () => getDoorEventsApi(deviceId, loadAll),
      enabled: Boolean(deviceId),
    },
  );
  return { doorEvents, isGettingDoorEvents };
}
