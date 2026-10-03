import clientApi from "../clientApi/clientApi";


export async function getProfileApi(){
    return await clientApi.get("/users/me").then(({data})=>data)
}