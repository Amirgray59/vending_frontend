import clientApi from "@/shared/clientApi/clientApi";


interface CreateRepairsData{
  device_id: string,
  title: string,
  description: string
}

interface UpdateRepairData{
    repairId:string;
    payload:{
        title:string;
        description:string
    }
}

export async function createRepairsApi(data:CreateRepairsData){
    return await clientApi.post(`/maintenance-tasks`,data).then(({data})=>data)
}

export async function getDeviceRepairsApi(deviceId:string){
    return await clientApi.get(`/maintenance-tasks?device_id=${deviceId}`).then(({data})=>data)
}

export async function updateDeviceRepairApi(data:UpdateRepairData){
    return await clientApi.patch(`/maintenance-tasks/${data.repairId}`,data.payload).then(({data})=>data)
}


export async function deleteDeviceRepairApi(repairId:string){
    return await clientApi.delete(`/maintenance-tasks/${repairId}`).then(({data})=>data)
}

export async function getAllRepairsApi(){
    return await clientApi.get(`/maintenance-tasks`).then(({data})=>data)
}

export async function resolveRepairApi({ repairId, payload }: { repairId: string, payload: { note: string } }) {
    // ارسال payload (که شامل description است) به عنوان بدنه درخواست POST
    return await clientApi.post(`/maintenance-tasks/${repairId}/resolve`, payload).then(({ data }) => data);
}
