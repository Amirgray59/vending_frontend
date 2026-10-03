import clientApi from "../clientApi/clientApi";

export async function resolveAlertApi(alertId:string){
    return await clientApi.post(`/alerts/${alertId}/resolve`).then(({data})=>data)
}