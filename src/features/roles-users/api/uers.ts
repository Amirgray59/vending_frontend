import clientApi from "@/shared/clientApi/clientApi";


export async function createUserApi(data:{username:string,phone:string,role:string}){
    const newData={
        ...data,
        full_name:data.username
    }
    return await clientApi.post("/users",newData).then(({data})=>data);
}

export async function getUserListApi(){
    return await clientApi.get("/users").then(({data})=>data);
}

export async function deleteUserApi(id:string){
    return await clientApi.delete(`/users/${id}`).then(({data})=>data);
}

