import { useMutation ,useQueryClient} from "@tanstack/react-query";

import toast from "react-hot-toast";
import { deleteDeviceRepairApi } from "../api/repairsApi";

export function useDeleteRepair() {
  const queryClient=useQueryClient();
  const { isPending: isDeletingRepair, mutate: deleteRepair } = useMutation(
    {
      mutationFn: deleteDeviceRepairApi,
      onSuccess: (data) => {
        queryClient.invalidateQueries({queryKey:["repairs-list"]});
        queryClient.invalidateQueries({queryKey:["all-repairs-list"]});
        toast.success("حذف تعمیر با موفقیت انجام شد");
      },
      onError: (err) => {
        toast.error("مشکلی در  حذف تعمیر پیش امده است");
      },
    },
  );
  return { isDeletingRepair, deleteRepair };
}
