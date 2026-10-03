import { useMutation ,useQueryClient} from "@tanstack/react-query";

import toast from "react-hot-toast";
import { updateDeviceRepairApi } from "../api/repairsApi";

export function useUpdateRepair() {
  const queryClient=useQueryClient();
  const { isPending: isUpdaingRepair, mutate:updateRepair } = useMutation(
    {
      mutationFn: updateDeviceRepairApi,
      onSuccess: (data) => {
        queryClient.invalidateQueries({queryKey:["repairs-list"]});
        queryClient.invalidateQueries({queryKey:["all-repairs-list"]});
        toast.success("تعمیرات  با موفقیت آپدیت شد");
      },
      onError: (err) => {
        toast.error("مشکلی در آپدیت  تعمیرات پیش امده است");
      },
    },
  );
  return { isUpdaingRepair, updateRepair };
}
