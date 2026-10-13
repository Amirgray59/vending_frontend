import clientApi from "../clientApi/clientApi";


export async function getProfileApi(){
    return await clientApi.get("/users/me").then(({data})=>data)
}

export async function updateMyBaleChatIdApi(data: {
    bale_chat_id: string | null;
}) {
    return await clientApi
        .patch("/users/me/bale", data)
        .then(({ data: profile }) => profile);
}