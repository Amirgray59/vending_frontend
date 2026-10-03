import clientApi from "@/shared/clientApi/clientApi";


export async function createLocationApi(data:{name:string,manager_id:string,city:string}) {
    return await clientApi.post("/locations",data).then(({data})=>data)
}


export async function deleteLocationApi(id:string){
 return await clientApi.delete(`/locations/${id}`).then(({data})=>data)
}