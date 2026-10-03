
import { useQuery } from "@tanstack/react-query";
import { getLocationsApi } from "../api/locations";

export default function UseGetLocations(){
    const { data:locations, isLoading:isGettingLocations } = useQuery({
        queryKey: ['locations'],
        queryFn: getLocationsApi

    });
     return {locations,isGettingLocations}
}

