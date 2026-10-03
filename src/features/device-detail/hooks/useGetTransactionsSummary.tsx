import { useQuery } from "@tanstack/react-query";
import { getTransactionsSummaryApi } from "../api/deviceTransactionsApi";

export default function useGetTransactionsSummary() {
  const { data: transactionsSummary, isLoading: isgettingTransactionsSummary } =
    useQuery({
      queryKey: ["transactions-summary"],
      queryFn: getTransactionsSummaryApi,
    });
  return { transactionsSummary, isgettingTransactionsSummary };
}
