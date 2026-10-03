
import { useQuery } from "@tanstack/react-query";
import { getTransactionsApi } from "../api/transactionsApi";

export default function useGetTransactions(){
    const { data:transactions, isLoading:isgettingTransactions } = useQuery({
        queryKey: ['transactions'],
        queryFn: getTransactionsApi

    });
     return {transactions,isgettingTransactions}
}

