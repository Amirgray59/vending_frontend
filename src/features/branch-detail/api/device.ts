import clientApi from "@/shared/clientApi/clientApi";

type ClaimableDevice = {
    id: string;
    device_code: string;
    status: string;
};

function getPageItems(response: any): ClaimableDevice[] {
    const payload = response?.data ?? response;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.items)) return payload.items;
    if (Array.isArray(payload?.results)) return payload.results;
    if (Array.isArray(payload?.devices)) return payload.devices;
    return [];
}

function getPageTotal(response: any, items: ClaimableDevice[]) {
    const payload = response?.data ?? response;
    return Number(payload?.total ?? items.length);
}

export async function getAllUnclaimedDevicesApi() {
    const pageSize = 200;
    const firstPage = await clientApi
        .get("/devices/unclaimed", { params: { page: 1, size: pageSize } })
        .then(({ data }) => data);
    const firstItems = getPageItems(firstPage);
    const total = getPageTotal(firstPage, firstItems);
    const pageCount = Math.ceil(total / pageSize);

    if (pageCount <= 1) {
        return { ...firstPage, items: firstItems, total };
    }

    const remainingPages = await Promise.all(
        Array.from({ length: pageCount - 1 }, (_, index) =>
            clientApi
                .get("/devices/unclaimed", {
                    params: { page: index + 2, size: pageSize },
                })
                .then(({ data }) => getPageItems(data)),
        ),
    );

    return {
        ...firstPage,
        items: [
            ...firstItems,
            ...remainingPages.flat(),
        ],
        total,
    };
}

async function getAllDevicesWithClaimedFalseApi() {
    const pageSize = 200;
    const fetchPage = async (page: number) =>
        clientApi
            .get("/devices", { params: { claimed: false, page, size: pageSize } })
            .then(({ data }) => {
                const items = getPageItems(data);
                return { items, total: getPageTotal(data, items) };
            });

    const firstPage = await fetchPage(1);
    const pageCount = Math.ceil(firstPage.total / pageSize);
    if (pageCount <= 1) return firstPage;

    const remainingPages = await Promise.all(
        Array.from({ length: pageCount - 1 }, (_, index) => fetchPage(index + 2)),
    );

    return {
        items: [...firstPage.items, ...remainingPages.flatMap((page) => page.items)],
        total: firstPage.total,
    };
}

export async function getPendingDevicesForClaimApi() {
    const results = await Promise.allSettled([
        getAllUnclaimedDevicesApi(),
        getAllDevicesWithClaimedFalseApi(),
    ]);

    const [unclaimedResult, devicesResult] = results;
    const unclaimedDevices: ClaimableDevice[] =
        unclaimedResult.status === "fulfilled"
            ? (unclaimedResult.value?.items ?? [])
            : [];
    const devicesWithClaimFlag: ClaimableDevice[] =
        devicesResult.status === "fulfilled"
            ? (devicesResult.value?.items ?? [])
            : [];
    // Both endpoints already return unclaimed devices. Keep their results even
    // if a deployment omits or differently formats the status field.
    const pendingDevices = [...unclaimedDevices, ...devicesWithClaimFlag];

    if (
        pendingDevices.length === 0 &&
        results.some((result) => result.status === "rejected")
    ) {
        const errors = results
            .filter((result) => result.status === "rejected")
            .map((result) => result.reason);
        throw errors[0];
    }

    const pendingByCode = new Map<string, ClaimableDevice>();
    for (const device of pendingDevices) {
        const deviceCode = device.device_code?.trim();
        if (deviceCode) pendingByCode.set(deviceCode, device);
    }

    return {
        items: Array.from(pendingByCode.values()),
        total: pendingByCode.size,
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
