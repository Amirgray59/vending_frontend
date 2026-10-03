import clientApi from "@/shared/clientApi/clientApi";

interface UdatePriceType {
  deviceId: string;
  payload: { price: number };
}


export async function updatePriceApi(data: UdatePriceType) {
  return await clientApi
    .post(`/devices/${data.deviceId}/control/price`, data.payload)
    .then(({ data }) => data);
}


