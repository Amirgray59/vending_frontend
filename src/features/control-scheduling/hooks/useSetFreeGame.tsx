import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { setFreeGameApi } from "../api/freeGame";

export function useSetFreeGame() {
  const queryClient = useQueryClient();
  const { isPending: isSettingFreeGame, mutate:setFreeGame } = useMutation({
    mutationFn: setFreeGameApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["device"] });
      queryClient.invalidateQueries({ queryKey: ["device-list"] });
      toast.success("بازی های رایگان با موفقیت ثبت شد")
    },
    onError: (err) => {
      console.log(err);
      toast.error("مشکلی در ثیت بازی های رایگان به وجود امده است")
    },
  });
  return { isSettingFreeGame, setFreeGame };
}
