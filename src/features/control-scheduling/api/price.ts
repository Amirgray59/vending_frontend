import clientApi from "@/shared/clientApi/clientApi";

export interface PriceRange {
  start_hour: number;
  start_minute: number;
  end_hour: number;
  end_minute: number;
  price: number;
}

export interface PriceScheduleCreatePayload {
  day_of_week: number;
  ranges: PriceRange[];
  timezone?: string;
  enabled?: boolean;
}

export interface PriceScheduleUpdatePayload {
  day_of_week?: number | null;
  price?: number | null;
  start_hour?: number | null;
  start_minute?: number | null;
  end_hour?: number | null;
  end_minute?: number | null;
  timezone?: string | null;
  enabled?: boolean | null;
}

export interface PriceScheduleUpdate {
  scheduleId: string;
  payload: PriceScheduleUpdatePayload;
}

export async function setPriceWithSchedulesApi(data: {
  deviceId: string;
  payload: PriceScheduleCreatePayload;
}) {
  return await clientApi
    .post(`/devices/${data.deviceId}/price-schedules`, data.payload)
    .then(({ data }) => data);
}

export async function getPriceSchedulesApi(deviceId: string) {
  return await clientApi
    .get(`/devices/${deviceId}/price-schedules`)
    .then(({ data }) => data);
}

export async function editPriceSchedulesApi(data: PriceScheduleUpdate) {
  return await clientApi
    .patch(`/price-schedules/${data.scheduleId}`, data.payload)
    .then(({ data }) => data);
}

export async function deletePriceSchedulesApi(scheduleId: string) {
  return await clientApi.delete(`/price-schedules/${scheduleId}`, {
    params: { whole_group: false },
  });
}
