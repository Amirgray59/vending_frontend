import clientApi from "@/shared/clientApi/clientApi";


export async function getDeviceTransactionsApi(deviceId:string){
    return await clientApi.get(`devices/${deviceId}/transactions`).then(({data})=>data)
}

export async function getDeviceInventoryTransActionsApi(deviceId:string){
    return await clientApi.get(`devices/${deviceId}/inventory-transactions`).then(({data})=>data)
}