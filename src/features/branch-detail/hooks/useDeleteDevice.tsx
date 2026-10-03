import { useMutation ,useQueryClient} from "@tanstack/react-query";

import toast from "react-hot-toast";
import { deleteDeviceApi } from "../api/device";

export function useDeleteDevice() {
  const queryClient=useQueryClient();
  const { isPending: isDeletingDevice, mutate: deleteDevice } = useMutation(
    {
      mutationFn: deleteDeviceApi,
      onSuccess: (data) => {
        queryClient.invalidateQueries({queryKey:["devices-section"]})
        toast.success("دستگاه مورد نطر با موفقیت حذف شد");
      },
      onError: (err) => {
        toast.error("مشکلی در حذف دستگاه  پیش امده است");
      },
    },
  );
  return { isDeletingDevice, deleteDevice };
}
