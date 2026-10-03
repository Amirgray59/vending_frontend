import { useQuery } from "@tanstack/react-query";
import { getSectionsApi } from "../api/section";

export default function UseGetSections(id: string) {
  const {
    data: sections,
    isLoading: isGettingSections,
  } = useQuery({
    queryKey: ["sections", id],
    queryFn: () => getSectionsApi(id),
    enabled: !!id,
  });

  return {
    sections,
    isGettingSections,
  };
}