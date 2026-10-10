import clientApi from "@/shared/clientApi/clientApi";


interface CreateRepairsData {
  device_id?: string | null;
  maintenance_category_id: string;
  title: string;
  description?: string | null;
}

interface UpdateRepairData{
    repairId:string;
    payload:{
        title:string;
        description:string
    }
}

export interface MaintenanceTaskQueryParams {
    device_id?: string;
    category_id?: string;
    resolved?: boolean;
    sort?: string;
    page?: number;
    size?: number;
}

export async function createRepairsApi(data:CreateRepairsData){
    return await clientApi.post(`/maintenance-tasks`,data).then(({data})=>data)
}

export async function getMaintenanceCategoriesApi(includeInactive = false) {
    const pageSize = 200;
    const requestPage = (page: number) =>
        clientApi
            .get(`/maintenance-categories`, {
                params: { include_inactive: includeInactive, page, size: pageSize },
            })
            .then(({ data }) => data);

    const firstPage = await requestPage(1);
    const firstItems = firstPage?.items ?? [];
    const total = Number(firstPage?.total ?? firstItems.length);
    const pageCount = Math.ceil(total / pageSize);

    if (pageCount <= 1) {
        return { ...firstPage, items: firstItems, total };
    }

    const remainingPages = await Promise.all(
        Array.from({ length: pageCount - 1 }, (_, index) =>
            requestPage(index + 2),
        ),
    );

    return {
        ...firstPage,
        items: [
            ...firstItems,
            ...remainingPages.flatMap((page: any) => page?.items ?? []),
        ],
        total,
    };
}

export async function createMaintenanceCategoryApi(data: {
    name: string;
    description?: string | null;
}) {
    return await clientApi
        .post(`/maintenance-categories`, data)
        .then(({ data }) => data);
}

export async function getDeviceRepairsApi(deviceId:string){
    return await clientApi.get(`/maintenance-tasks?device_id=${deviceId}`).then(({data})=>data)
}

export async function updateDeviceRepairApi(data:UpdateRepairData){
    return await clientApi.patch(`/maintenance-tasks/${data.repairId}`,data.payload).then(({data})=>data)
}


export async function deleteDeviceRepairApi(repairId:string){
    return await clientApi.delete(`/maintenance-tasks/${repairId}`).then(({data})=>data)
}

export async function getAllRepairsApi(params: MaintenanceTaskQueryParams = {}){
    return await clientApi.get(`/maintenance-tasks`, { params }).then(({data})=>data)
}

export async function resolveRepairApi({ repairId, payload }: { repairId: string, payload: { note: string } }) {
    // ارسال payload (که شامل description است) به عنوان بدنه درخواست POST
    return await clientApi.post(`/maintenance-tasks/${repairId}/resolve`, payload).then(({ data }) => data);
}
