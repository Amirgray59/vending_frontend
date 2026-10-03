import clientApi from "../clientApi/clientApi";


export async function getLocationsApi(){
    return clientApi.get("/locations").then(({data})=>data)
}

export async function getSingleLocationApi(locationId:string){
    return clientApi.get(`/locations/${locationId}`).then(({data})=>data)
}