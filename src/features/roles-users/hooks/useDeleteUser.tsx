import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { deleteUserApi } from "../api/uers";

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { isPending: isDeletingUser, mutate: deleteUser } = useMutation({
    mutationFn: deleteUserApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("کاربر  با موفقیت حذف  ثبت شد");
    },
    onError: (err) => {
      toast.error("مشکلی در حذف کاربر  پیش امده است");
    },
  });
  return { isDeletingUser, deleteUser };
}
