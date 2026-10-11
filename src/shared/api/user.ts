import clientApi from "../clientApi/clientApi";



type UpdateUserRequest = {
    id: string;
    data: Record<string, unknown>;
};

export async function updateUserApi({ id, data }: UpdateUserRequest) {
    const payload: Record<string, unknown> = { ...data };

    if (typeof payload.username === "string") {
        payload.full_name = payload.username.trim();
        delete payload.username;
    }
    if (typeof payload.phone === "string") payload.phone = payload.phone.trim();

    return await clientApi
        .patch(`/users/${encodeURIComponent(id)}`, payload)
        .then(({ data: responseData }) => responseData);
}


export async function getSingleUser(id:string){
    return await clientApi.get(`/users/${id}`).then(({data})=>data);
}
