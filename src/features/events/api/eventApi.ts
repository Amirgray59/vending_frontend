import clientApi from "@/shared/clientApi/clientApi";



export async function getMovementEventsApi(deviceId?: string) {
  return await clientApi.get("/events/movement", {
    params: {
      device_id: deviceId 
    }
  }).then(({ data }) => data);
}

export async function getDoorEventsApi(deviceId?: string) {
  return await clientApi.get("/events/door", {
    params: {
      device_id: deviceId  
    }
  }).then(({ data }) => data);
}

export async function getRewardEventsApi(deviceId?: string) {
  return await clientApi.get("/events/reward", {
    params: {
      device_id: deviceId  
    }
  }).then(({ data }) => data);
}