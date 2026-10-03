import { useQuery } from "@tanstack/react-query";
import { getSingleUser } from "../api/user";

export default function useGetSingleUser(id: string) {
  const {
    data: user,
    isLoading: isGettingUser,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getSingleUser(id),
    enabled: !!id,
  });

  return {
    user,
    isGettingUser,
  };
}