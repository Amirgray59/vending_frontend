
import { useQuery } from "@tanstack/react-query";
import { getPriceSchedulesApi } from "../api/price";

export function useGetPriceSchedules(deviceId: string) {
  const {data:priceSchedules,isPending:isGettingPriceSchedules}= useQuery({
    queryKey: ["price-schedules", deviceId],
    queryFn: () => getPriceSchedulesApi(deviceId),
    enabled: !!deviceId, // فقط زمانی اجرا شود که deviceId وجود داشته باشد
    staleTime: 1000 * 60 * 5, // داده‌ها تا ۵ دقیقه "تازه" (fresh) می‌مانند و دوباره درخواست نمی‌زند
  });
  return{
    priceSchedules,isGettingPriceSchedules
  }
}