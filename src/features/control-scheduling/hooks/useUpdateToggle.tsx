import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateToggleApi } from "../api/toggleApi";
import toast from "react-hot-toast";

export function useUpdateToggle() {
  const queryClient = useQueryClient();
  const { isPending: isUpdatingToggle, mutate: updateToggle } = useMutation({
    mutationFn: updateToggleApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["device"] });
      toast.success("تنظیمات با موفقیت ثبت شد ")
    },
    onError: (err) => {
      toast.error("مشکلی در ثبت تنظیمات به وجود امده است")
      console.log(err);
    },
  });
  return { isUpdatingToggle, updateToggle };
}
