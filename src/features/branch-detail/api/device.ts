import clientApi from "@/shared/clientApi/clientApi";


export  async function createDeviceApi(data:{name:string,location_id:string,section_id:string,device_code:string}){
    return await clientApi.post("/devices",data).then(({data})=>data)
}


export async function deleteDeviceApi(id:string){
    return await clientApi.delete(`/devices/${id}`).then(({data})=>data)
}