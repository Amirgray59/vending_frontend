import { useQuery } from "@tanstack/react-query";
import { getAlertListApi } from "../api/alertApi";

export default function useGetAlertList() {
  const { data: alertList, isLoading: isGettingAlertsList } = useQuery({
    queryKey: ["alerts"],
    queryFn: getAlertListApi,
  });
  return { alertList, isGettingAlertsList };
}
