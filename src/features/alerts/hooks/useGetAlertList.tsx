import { useQuery } from "@tanstack/react-query";
import { getAllAlertListApi } from "../api/alertApi";
import type { AlertQueryParams } from "../api/alertApi";

export default function useGetAlertList(params: Omit<AlertQueryParams, "page" | "size"> = {}) {
  const { data: alertList, isLoading: isGettingAlertsList } = useQuery({
    queryKey: ["alerts", params],
    queryFn: () => getAllAlertListApi(params),
  });
  return { alertList, isGettingAlertsList };
}
