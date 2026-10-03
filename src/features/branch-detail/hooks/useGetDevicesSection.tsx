import { useQuery } from "@tanstack/react-query";
import { getDevicesSection } from "../api/section";

export default function UseGetDevicesSection(sectionId: string,locationId:string) {
  
  const {
    data: devicesSection,
    isLoading: isGettingDevicesSection,
  } = useQuery({
    queryKey: ["devices-section", sectionId,locationId],
    queryFn: () => getDevicesSection(sectionId,locationId),
    enabled: !!sectionId,
  });

  return {
    devicesSection,
    isGettingDevicesSection,
  };
}