
import { useQuery } from "@tanstack/react-query";
import { getAllRepairsApi } from "../api/repairsApi";
import type { MaintenanceTaskQueryParams } from "../api/repairsApi";

export default function useGetAllRepairs(params: MaintenanceTaskQueryParams = {}){
    const { data:repairs, isLoading:isgettingRepairs } = useQuery({
        queryKey: ['all-repairs-list', params],
        queryFn: () => getAllRepairsApi(params)

    });
     return {repairs,isgettingRepairs}
}

