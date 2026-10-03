
import { useQuery } from "@tanstack/react-query";
import { getUserListApi } from "../api/uers";

export default function UseGetUserList(){
    const { data:userList, isLoading:isgettigUserList, isError } = useQuery({
        queryKey: ['users'],
        queryFn: getUserListApi

    });
     return {userList,isgettigUserList,isError}
}

