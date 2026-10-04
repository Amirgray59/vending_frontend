import { useQuery } from "@tanstack/react-query";
import { getDevicesSection } from "../api/section";

export default function UseGetDevicesSection(sectionId: string | null,locationId:string) {
  
  const {
    data: devicesSection,
    isLoading: isGettingDevicesSection,
  } = useQuery({
    queryKey: ["devices-section", sectionId,locationId],
    queryFn: () => getDevicesSection(sectionId!,locationId),
    enabled: !!sectionId && !!locationId,
  });

  return {
    devicesSection,
    isGettingDevicesSection,
  };
}
