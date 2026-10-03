import clientApi from "@/shared/clientApi/clientApi";



export async function deleteDeviceApi(id:string){
    return await clientApi.delete(`/devices/${id}`).then(({data})=>data)
}


export async function getAllDevicesDetailApi(locationId: string, sectionId: string) {
  return await clientApi.get("/devices", {
    params: {
      // اگر مقدار locationId برابر undefined باشد، axios آن را در URL نمی‌فرستد
      location_id: (locationId && locationId !== "all") ? locationId : undefined,
      section_id: (sectionId && sectionId !== "all") ? sectionId : undefined,
    }
  }).then(({ data }) => data);
}