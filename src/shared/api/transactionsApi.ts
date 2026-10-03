import clientApi from "../clientApi/clientApi";

export async function getTransactionsApi(){
    return await clientApi.get('/transactions').then(({data})=>data)
}