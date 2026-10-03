import clientApi from "@/shared/clientApi/clientApi";


export async function getDashboardInfoApi(){
    return await clientApi.get('/dashboard').then(({data})=>data)
}