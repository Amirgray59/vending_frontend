import { useMutation } from "@tanstack/react-query";
import { getTransactionsCSVReportsApi, CSVReportParams } from "../api/report";

export default function useGetTransactionsCSVReports() {
  const {
    mutateAsync: executeGetCsv,
    isPending: isGettingtransactionsCsvReports,
  } = useMutation({
    // تعریف تایپ ورودی برای اینکه در کامپوننت فیلتر، IDE به ما کمک کند
    mutationFn: async (params: CSVReportParams) => {
      return await getTransactionsCSVReportsApi(params);
    },
  });

  return {
    executeGetCsv,
    isGettingtransactionsCsvReports,
  };
}
