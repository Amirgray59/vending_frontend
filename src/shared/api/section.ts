import clientApi from "../clientApi/clientApi";


export async function getAllSectionsApi(){
    return await clientApi.get("/locations/sections/list").then(({data})=>data)
}



export async function getSectionsApi(id:string|null){
    return await clientApi.get(`/locations/sections/list?location_id=${id}`).then(({data})=>data)
}


