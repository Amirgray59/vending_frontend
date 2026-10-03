import { useQuery } from "@tanstack/react-query";
import { getSectionsApi } from "../api/section";
import { getSingleLocationApi } from "../api/locations";

export default function useGetSingleLocation(id: string) {
  const {
    data: singleLocation,
    isLoading: isGettingSingleLocation,
  } = useQuery({
    queryKey: ["single-location", id],
    queryFn: () => getSingleLocationApi(id),
    enabled: !!id,
  });

  return {
    singleLocation,
    isGettingSingleLocation,
  };
}