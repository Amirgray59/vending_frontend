import clientApi from "@/shared/clientApi/clientApi";

interface FreeGameType{
    deviceId:string,
    payload:{
        count:number
    }
}

export async function setFreeGameApi(data:FreeGameType){
    return await clientApi.post(`/devices/${data.deviceId}/free-play`,data.payload)
}