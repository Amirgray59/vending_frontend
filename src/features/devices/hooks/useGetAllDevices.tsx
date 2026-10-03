
import { useQuery } from "@tanstack/react-query";
import { getAllDevicesDetailApi } from "../api/device";

interface UseGetDevicesDetailParams {
  locationId: string;
  sectionId: string;
}

export function useGetDevicesDetail({ locationId, sectionId }: UseGetDevicesDetailParams) {
  return useQuery({
    queryKey: ["devices-detail", locationId, sectionId],

    queryFn: () => getAllDevicesDetailApi(locationId, sectionId),

  });
}