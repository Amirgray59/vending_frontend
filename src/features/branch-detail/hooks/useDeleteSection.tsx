import { useMutation ,useQueryClient} from "@tanstack/react-query";

import toast from "react-hot-toast";
import { deleteSectionApi } from "../api/section";

export function useDeleteSection() {
  const queryClient=useQueryClient();
  const { isPending: isDeletingSection, mutate: deleteSection } = useMutation(
    {
      mutationFn: deleteSectionApi,
      onSuccess: (data) => {
        queryClient.invalidateQueries({queryKey:["sections"]})
        toast.success("بخش مورد نطر با موفقیت حذف شد");
      },
      onError: (err) => {
        toast.error("مشکلی در حذف بخش  پیش امده است");
      },
    },
  );
  return { isDeletingSection, deleteSection };
}
