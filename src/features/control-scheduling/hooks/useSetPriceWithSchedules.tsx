import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { editPriceSchedulesApi, setPriceWithSchedulesApi } from "../api/price";
import type {
  PriceScheduleCreatePayload,
  PriceScheduleUpdate,
} from "../api/price";

interface SavePriceSchedulesVariables {
  deviceId: string;
  schedules: PriceScheduleCreatePayload[];
  updates: PriceScheduleUpdate[];
}

export function useSetPriceSchedules() {
  const queryClient = useQueryClient();

  const {
    mutateAsync: setPriceSchedules,
    isPending: isSettingPriceSchedules,
  } = useMutation({
    mutationFn: async ({
      deviceId,
      schedules,
      updates,
    }: SavePriceSchedulesVariables) => {
      const requests = [
        ...schedules.map((payload) =>
          setPriceWithSchedulesApi({ deviceId, payload }),
        ),
        ...updates.map((update) => editPriceSchedulesApi(update)),
      ];

      const results = await Promise.allSettled(requests);
      const failedRequest = results.find((result) => result.status === "rejected");

      if (failedRequest?.status === "rejected") throw failedRequest.reason;

      return results;
    },
    onSuccess: () => {
      toast.success("زمان‌بندی قیمت‌ها با موفقیت به‌روزرسانی شد");
    },
    onError: (error: any) => {
      const detail = error?.response?.data?.detail;
      const detailMessage = Array.isArray(detail)
        ? detail
            .map((item) => item?.msg)
            .filter((message): message is string => typeof message === "string")
            .join("، ")
        : typeof detail === "string"
          ? detail
          : undefined;

      toast.error(
        error?.response?.data?.message ||
          detailMessage ||
          "خطا در به‌روزرسانی زمان‌بندی قیمت‌ها",
      );
    },
    onSettled: (_data, _error, variables) =>
      queryClient.invalidateQueries({
        queryKey: ["price-schedules", variables.deviceId],
      }),
  });

  return { setPriceSchedules, isSettingPriceSchedules };
}