
import { useQuery } from "@tanstack/react-query";
import { getDashboardInfoApi } from "../api/dashboard";

export default function useGetDashboardInfo(){
    const { data:dashboardInfo, isLoading:isgettingDashboardInfo } = useQuery({
        queryKey: ['dashboard-info'],
        queryFn: getDashboardInfoApi

    });
     return {dashboardInfo,isgettingDashboardInfo}
}

