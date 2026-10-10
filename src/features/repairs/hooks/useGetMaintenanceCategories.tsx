import { useQuery } from "@tanstack/react-query";
import { getMaintenanceCategoriesApi } from "../api/repairsApi";

export default function useGetMaintenanceCategories(includeInactive = false) {
  const { data: maintenanceCategories, isLoading: isGettingMaintenanceCategories } =
    useQuery({
      queryKey: ["maintenance-categories", includeInactive],
      queryFn: () => getMaintenanceCategoriesApi(includeInactive),
    });

  return { maintenanceCategories, isGettingMaintenanceCategories };
}
