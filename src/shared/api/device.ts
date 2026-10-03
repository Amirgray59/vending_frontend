
import clientApi from "../clientApi/clientApi";

export interface DeviceQueryParams {
  page?: number;
  size?: number;
  q?: string;
  location_id?: string | null;
  section_id?: string | null;
  status?: string | null;
  connection?: string | null;
  inventory?: string | null;
  claimed?: boolean | null;
}

export async function getDevicesListApi(params: DeviceQueryParams) {
  // ۱. ایجاد یک کپی از پارامترها برای دستکاری
  const cleanedParams = { ...params };

  // ۲. لیست مقادیری که سرور آن‌ها را قبول نمی‌کند و باعث ارور 422 می‌شود
  const forbiddenValues = ["همه مجموعه ها", "همه بخش ها", "all", "همه", ""];

  // ۳. پیمایش تمام کلیدهای ارسالی و حذف موارد نامعتبر
  Object.keys(cleanedParams).forEach((key) => {
    const value = cleanedParams[key as keyof DeviceQueryParams];
    
    if (forbiddenValues.includes(String(value)) || value === null || value === undefined) {
      // حذف کلید از آبجکت تا اصلاً در URL ارسال نشود
      delete cleanedParams[key as keyof DeviceQueryParams];
    }
  });

  // حالا axios فقط پارامترهای معتبر را به صورت Query String می‌فرستد
  return await clientApi.get("/devices", { params: cleanedParams }).then(({ data }) => data);
}

export async function getDeviceDetailApi(id: string) {
  return await clientApi.get(`/devices/${id}`).then(({ data }) => data);
}

export async function deleteDeviceWeeklyScheduleApi(id: string) {
  return await clientApi.delete(`/schedules/devices/${id}`).then(({ data }) => data);
}