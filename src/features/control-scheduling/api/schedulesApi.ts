import clientApi from "@/shared/clientApi/clientApi";

interface AddScheduleDeviceType {
  deviceId: string;
  payload: {
    day_of_week: number;
    action: "on" | "off";
    hour: number;
    minute: number;
  };
}

interface editScheduleDeviceType {
  scheduleId: string;
  payload: {
    day_of_week: number;
    action: "on" | "off";
    hour: number;
    minute: number;
  };
}


export async function addScheduleApi(data: AddScheduleDeviceType) {
  return await clientApi
    .post(`/devices/${data.deviceId}/schedules`, data.payload)
    .then(({ data }) => data);
}

export async function getDeviceScheduleApi(deviceId: string) {
  return await clientApi
    .get(`/devices/${deviceId}/schedules`)
    .then(({ data }) => data);
}

export async function deleteScheduleApi(scheduleId: string) {
  return await clientApi
    .delete(`/schedules/${scheduleId}`)
    .then(({ data }) => data);
}

export async function editScheduleApi(data:editScheduleDeviceType) {
  return await clientApi
    .patch(`/schedules/${data.scheduleId}`,data.payload)
    .then(({ data }) => data);
}

