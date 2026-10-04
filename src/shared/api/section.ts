import clientApi from "../clientApi/clientApi";


export async function getAllSectionsApi(){
    return await clientApi.get("/locations/sections/list", { params: { size: 200 } }).then(({data})=>data)
}



export async function getSectionsApi(id:string|null){
    if (!id || id === "all") return getAllSectionsApi();
    return await clientApi.get("/locations/sections/list", { params: { location_id: id, size: 200 } }).then(({data})=>data)
}


