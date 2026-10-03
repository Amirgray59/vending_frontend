import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { updateUserApi } from "../api/user";

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { isPending: isUpdatingUser, mutate: updateUser } = useMutation({
    // تغییر این خط: ورودی را به صورت آبجکت {id, data} می‌گیریم و به تابع API می‌دهیم
    mutationFn: ( data : { id: string; data: any }) =>
      updateUserApi( data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("کاربر با موفقیت آپدیت شد");
    },
    onError: (err) => {
      toast.error("مشکلی در آپدیت کاربر پیش آمده است");
    },
  });
  return { isUpdatingUser, updateUser };
}
