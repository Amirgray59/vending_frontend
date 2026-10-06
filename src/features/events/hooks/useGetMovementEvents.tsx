import { useQuery } from "@tanstack/react-query";
import { getMovementEventsApi } from "../api/eventApi";

export function useGetMovementEvents(deviceId?: string, loadAll = false) {
  const { data: movementEvents, isPending: isGettingMovementEvents } = useQuery(
    {
      queryKey: ["movement-events", deviceId, loadAll],
      queryFn: () => getMovementEventsApi(deviceId, loadAll),
      enabled: Boolean(deviceId),
    },
  );
  return { movementEvents, isGettingMovementEvents };
}
