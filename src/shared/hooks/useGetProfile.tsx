
import { useQuery } from "@tanstack/react-query";
import { getProfileApi } from "../api/auth";

export default function UseGetProfile(){
    const { data:profile, isLoading:isgettingprofile, isError } = useQuery({
        queryKey: ['profile'],
        queryFn: getProfileApi

    });
     return {profile,isgettingprofile,isError}
}

