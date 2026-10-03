import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePriceApi } from "../api/controlDeviceApi";
import toast from "react-hot-toast";

export function useUpdatePrice() {
  const queryClient = useQueryClient();
  const { isPending: isUpdatingPrice, mutate: updatePrice } = useMutation({
    mutationFn: updatePriceApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["device"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });
  return { isUpdatingPrice, updatePrice };
}
