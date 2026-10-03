import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { createSectionApi } from "../api/section";

export function useCreateSection() {
  const queryClient = useQueryClient();
  const { isPending: isCreatingSection, mutate: createSection } = useMutation({
    mutationFn: createSectionApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      toast.success("بخش جدید با موفقیت ثبت شد");
    },
    onError: (err: any) => {
      if (err.response?.status === 409) {
        toast.error("این بخش از قبل وجود دارد");
      } else {
        toast.error("مشکلی در ایجاد بخش جدید پیش امده است");
      }
    },
  });
  return { isCreatingSection, createSection };
}
