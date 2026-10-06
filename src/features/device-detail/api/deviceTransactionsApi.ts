import clientApi from "@/shared/clientApi/clientApi";


export async function getDeviceTransactionsApi(deviceId:string){
    return await clientApi.get(`devices/${deviceId}/transactions`).then(({data})=>data)
}

export async function getDeviceInventoryTransActionsApi(deviceId:string){
    const pageSize = 200;
    const requestPage = (page: number) =>
        clientApi
            .get(`devices/${deviceId}/inventory-transactions`, {
                params: { page, size: pageSize },
            })
            .then(({ data }) => data);

    const firstPage = await requestPage(1);
    const firstItems = firstPage?.items ?? [];
    const rawTotal = firstPage?.total;

    if (rawTotal === null || rawTotal === undefined) {
        const items = [...firstItems];
        let page = 2;
        let lastPageItems = firstItems;

        while (lastPageItems.length === pageSize) {
            const nextPage = await requestPage(page);
            lastPageItems = nextPage?.items ?? [];
            items.push(...lastPageItems);
            page += 1;
        }

        return { ...firstPage, items, total: items.length };
    }

    const total = Number(rawTotal);
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
