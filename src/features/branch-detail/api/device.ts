import clientApi from "@/shared/clientApi/clientApi";

export async function getAllUnclaimedDevicesApi() {
    const pageSize = 200;
    const firstPage = await clientApi
        .get("/devices/unclaimed", { params: { page: 1, size: pageSize } })
        .then(({ data }) => data);
    const total = Number(firstPage?.total ?? firstPage?.items?.length ?? 0);
    const pageCount = Math.ceil(total / pageSize);

    if (pageCount <= 1) {
        return { ...firstPage, items: firstPage?.items ?? [], total };
    }

    const remainingPages = await Promise.all(
        Array.from({ length: pageCount - 1 }, (_, index) =>
            clientApi
                .get("/devices/unclaimed", {
                    params: { page: index + 2, size: pageSize },
                })
                .then(({ data }) => data),
        ),
    );

    return {
        ...firstPage,
        items: [
            ...(firstPage?.items ?? []),
            ...remainingPages.flatMap((page: any) => page?.items ?? []),
        ],
        total,
    };
}

export async function createDeviceApi(data: {
    name: string;
    location_id: string;
    section_id: string;
    device_code: string;
    device_type?: string | null;
}){
    return await clientApi.post("/devices",data).then(({data})=>data)
}


export async function deleteDeviceApi(id:string){
    return await clientApi.delete(`/devices/${id}`).then(({data})=>data)
}
