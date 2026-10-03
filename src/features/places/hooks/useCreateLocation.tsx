import { useMutation ,useQueryClient} from "@tanstack/react-query";

import toast from "react-hot-toast";
import { createLocationApi } from "../api/location";

export function useCreateLocation() {
  const queryClient=useQueryClient();
  const { isPending: isCreatingLocation, mutate: createLocation } = useMutation(
    {
      mutationFn: createLocationApi,
      onSuccess: (data) => {
        queryClient.invalidateQueries({queryKey:["locations"]})
        toast.success("مجموعه جدید با موفقیت ثبت شد");
      },
      onError: (err) => {
        toast.error("مشکلی در ایجاد مجموعه جدید پیش امده است");
      },
    },
  );
  return { isCreatingLocation, createLocation };
}
