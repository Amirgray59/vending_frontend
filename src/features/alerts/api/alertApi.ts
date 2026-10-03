import clientApi from "@/shared/clientApi/clientApi";


export async function getAlertListApi(){
    return await clientApi.get("/alerts").then(({data})=>data)
}

export async function getAlertStatsApi(){
    return await clientApi.get("/alerts/stats").then(({data})=>data)
}


export async function getAlertsCSVReportsApi(params: any) {
  const queryParams: Record<string, string> = {};

  // 💡 اصلاح نام کلیدها برای هماهنگی با استیت (استفاده از underscore)
  if (params.places) queryParams.location_id = params.places;
  if (params.device_id) queryParams.end_time = params.device_id;


  const queryString = new URLSearchParams(queryParams).toString();
  const url = `/reports/alerts.csv${queryString ? `?${queryString}` : ""}`;
  

  // دریافت فایل به صورت blob
  return await clientApi.get(url, { responseType: 'blob' }).then(({ data }) => data);
}