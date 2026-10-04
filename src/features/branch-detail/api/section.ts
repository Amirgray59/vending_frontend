import clientApi from "@/shared/clientApi/clientApi";
import { getAllDevicesListApi } from "@/shared/api/device";



export async function createSectionApi(data:{name:string,location_id:string}){
    return await clientApi.post("/locations/sections",data).then(({data})=>data);
}

export async function deleteSectionApi(id:string){
    return await clientApi.delete(`/locations/sections/${id}`).then(({data})=>data);
}

export async function getDevicesSection(sectionId:string,locationId:string){
    return await getAllDevicesListApi({ location_id: locationId, section_id: sectionId });
}
