import clientApi from "@/shared/clientApi/clientApi";


export async function sendOtpAi(data:{phone_number:string}){
    return await clientApi.post("/auth/otp/request",data)
}

export async function verifyOtpApi(data:{phone_number:string,code:string}){
    return await clientApi.post("/auth/otp/verify",data).then(({data})=>data)
}