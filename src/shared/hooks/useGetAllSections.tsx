import { useQuery } from "@tanstack/react-query";
import { getAllSectionsApi } from "../api/section";

export default function UseGetAllSection() {
  const { data: sectionsList, isLoading: isGettingSectionsList } = useQuery({
    queryKey: ["section-list"],
    queryFn: getAllSectionsApi,
  });
  return { sectionsList, isGettingSectionsList };
}
