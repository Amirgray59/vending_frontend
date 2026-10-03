import clientApi from "@/shared/clientApi/clientApi";

export async function getAuditsLogsApi(deviceId:string){
    return await clientApi.get(`/audit-logs?target_id=${deviceId}`).then(({data})=>data)
}