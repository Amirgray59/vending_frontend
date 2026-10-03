import clientApi from "../clientApi/clientApi";



export async function updateUserApi(data:any){
    const newData={
        ...data.data,
        full_name:data.data.username
    }
    console.log(newData);
    
    return await clientApi.patch(`/users/${data.id}`,newData).then(({data})=>data);
}


export async function getSingleUser(id:string){
    return await clientApi.get(`/users/${id}`).then(({data})=>data);
}
