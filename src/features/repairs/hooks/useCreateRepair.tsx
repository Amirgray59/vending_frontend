import { useMutation ,useQueryClient} from "@tanstack/react-query";

import toast from "react-hot-toast";
import { createRepairsApi } from "../api/repairsApi";

export function useCreateRepair() {
  const queryClient=useQueryClient();
  const { isPending: isCreatingRepair, mutate: createRepair } = useMutation(
    {
      mutationFn: createRepairsApi,
      onSuccess: (data) => {
        queryClient.invalidateQueries({queryKey:["repairs-list"]});
        queryClient.invalidateQueries({queryKey:["all-repairs-list"]});
        toast.success("تعمیرات  با موفقیت ثبت شد");
      },
      onError: (err) => {
        toast.error("مشکلی در ایجاد  تعمیرات پیش امده است");
      },
    },
  );
  return { isCreatingRepair, createRepair };
}
