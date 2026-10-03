import { useMutation ,useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { deleteLocationApi } from "../api/location";

export function useDeleteLocation() {
  const queryClient=useQueryClient();
  const { isPending: isDeletingLocation, mutate: deleteLocation } = useMutation(
    {
      mutationFn: deleteLocationApi,
      onSuccess: (data) => {
        queryClient.invalidateQueries({queryKey:["locations"]})
        toast.success("مجموعه مورد نظر با موفقیت حذف شد");
      },
      onError: (err) => {
        toast.error("مشکلی در حذف مجموعه  پیش امده است");
      },
    },
  );
  return { isDeletingLocation, deleteLocation };
}
