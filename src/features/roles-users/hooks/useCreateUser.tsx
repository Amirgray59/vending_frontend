import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { createUserApi } from "../api/uers";

export function useCreateUser() {
  const queryClient = useQueryClient();
  const { isPending: isCreatingUser, mutate: createUser } = useMutation({
    mutationFn: createUserApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("کاربر جدید با موفقیت ثبت شد");
    },
    onError: (err: any) => {
       if (err.response?.status === 409) {
        toast.error("این کاربر از قبل وجود دارد");
      } else {
        toast.error("مشکلی در ایجاد کاربر جدید پیش امده است");
      }
    },
  });
  return { isCreatingUser, createUser };
}
