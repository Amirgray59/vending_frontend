import clientApi from "@/shared/clientApi/clientApi";




export async function getDeviceAlertsApi(deviceId?:string){
    return await clientApi.get(`/alerts?device_id=${deviceId}`).then(({data})=>data)
}


export async function addManualInventoryApi(data:{deviceId:string,payload:{delta:number,reason?:string}}){
    
    return await clientApi.post(`/devices/${data.deviceId}/manual-inventory-transaction`,data.payload).then(({data})=>data)
}

export async function editDeviceApi(data:{deviceId:string,payload:any}){  
    return await clientApi.patch(`/devices/${data.deviceId}`,data.payload).then(({data})=>data)
}

export async function getDeviceSettingApi(deviceId?:string){
    return await clientApi.get(`/devices/${deviceId}/settings`).then(({data})=>data)
}


