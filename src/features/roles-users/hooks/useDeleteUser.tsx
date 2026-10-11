import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { deleteUserApi } from "../api/uers";

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { isPending: isDeletingUser, mutateAsync: deleteUser } = useMutation({
    mutationFn: deleteUserApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("کاربر با موفقیت غیرفعال شد");
    },
    onError: (err) => {
      toast.error("مشکلی در حذف کاربر  پیش امده است");
    },
  });
  return { isDeletingUser, deleteUser };
}
