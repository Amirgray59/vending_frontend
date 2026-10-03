import { useMutation ,useQueryClient} from "@tanstack/react-query";

import toast from "react-hot-toast";
import { createDeviceApi } from "../api/device";

export function useCreateDevice() {
  const queryClient=useQueryClient();
  const { isPending: isCreatingDevice, mutate: createDevice } = useMutation(
    {
      mutationFn: createDeviceApi,
      onSuccess: (data) => {
        queryClient.invalidateQueries({queryKey:["devices-section"]})
        toast.success("دستگاه جدید با موفقیت ثبت شد");
      },
      onError: (err) => {
        toast.error("مشکلی در ایجاد دستگاه جدید پیش امده است");
      },
    },
  );
  return { isCreatingDevice, createDevice };
}
