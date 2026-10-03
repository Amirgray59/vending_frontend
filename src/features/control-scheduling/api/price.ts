import clientApi from "@/shared/clientApi/clientApi";


interface PriceSchedulesData{
    deviceId:string;
    payload:{
        day_of_week:number,
        ranges: [
    {
      start_hour: number,
      start_minute: number,
      end_hour: number,
      end_minute: number,
      price: 0
    }
  ],
    }
}

interface EditPriceSchedulesData{
    scheduleId:string;
    payload:{
        day_of_week:number,
        ranges: [
    {
      start_hour: number,
      start_minute: number,
      end_hour: number,
      end_minute: number,
      price: 0
    }
  ],
    }
}


export async function setPriceWithSchedulesApi(data:PriceSchedulesData){
    return await clientApi.post(`/devices/${data.deviceId}/price-schedules`,data.payload).then(({data})=>data)
}


export async function getPriceSchedulesApi(deviceId:string){
    return await clientApi.get(`/devices/${deviceId}/price-schedules`).then(({data})=>data)
}

export async function editPriceSchedulesApi(data:EditPriceSchedulesData){
    return await clientApi.patch(`/devices/${data.scheduleId}/price-schedules`,data.payload).then(({data})=>data)
}

export async function deletePriceSchedulesApi(scheduleId:string){
    return await clientApi.patch(`/price-schedules/${scheduleId}?whole_group=${false}`).then(({data})=>data)
}
