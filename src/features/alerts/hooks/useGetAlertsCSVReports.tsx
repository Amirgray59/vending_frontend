import { useMutation } from "@tanstack/react-query";
import { getAlertsCSVReportsApi } from "../api/alertApi";

export default function useGetTransactionsCSVReports() {
  const {
    mutateAsync: executeGetAlertsCsv,
    isPending: isGettingAlertsCsvReports,
  } = useMutation({
    mutationFn: async (params: any) => {
      return await getAlertsCSVReportsApi(params);
    },
  });

  return {
    executeGetAlertsCsv,
    isGettingAlertsCsvReports,
  };
}