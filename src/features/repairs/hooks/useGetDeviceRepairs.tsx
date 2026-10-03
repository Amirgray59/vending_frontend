
import { useQuery } from "@tanstack/react-query";
import { getDeviceRepairsApi } from "../api/repairsApi";

export default function useGetDeviceRepairs(deviceIs:string){
    const { data:deviceRepairs, isLoading:isgettingDeviceRepairs } = useQuery({
        queryKey: ['repairs-list'],
        queryFn:()=> getDeviceRepairsApi(deviceIs)

    });
     return {deviceRepairs,isgettingDeviceRepairs}
}

