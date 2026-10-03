import clientApi from "@/shared/clientApi/clientApi";

interface UpdateToggletype {
  deviceId: string;
  payload: {
    pos_ip:string;
    toggle_interval_s: number;
    toggle_duration_s: number;
    toggle_count: number;
  };
}


export async function updateToggleApi(data: UpdateToggletype) {
  return await clientApi
    .post(`/devices/${data.deviceId}/control/settings`, data.payload)
    .then(({ data }) => data);
}

export async function getToggleApi(){  
    return await clientApi.get(`/settings`).then(({data})=>data)
}