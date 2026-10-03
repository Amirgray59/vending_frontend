import { useQuery } from "@tanstack/react-query";
import { getMovementEventsApi } from "../api/eventApi";

export function useGetMovementEvents(deviceId?: string) {
  const { data: movementEvents, isPending: isGettingMovementEvents } = useQuery(
    {
      queryKey: ["movement-events", deviceId],

      queryFn: () => getMovementEventsApi(deviceId),
    },
  );
  return { movementEvents, isGettingMovementEvents };
}
