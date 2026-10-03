
import { useQuery } from "@tanstack/react-query";
import { getAllRepairsApi } from "../api/repairsApi";

export default function useGetAllRepairs(){
    const { data:repairs, isLoading:isgettingRepairs } = useQuery({
        queryKey: ['all-repairs-list'],
        queryFn: getAllRepairsApi

    });
     return {repairs,isgettingRepairs}
}

