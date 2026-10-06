import clientApi from "@/shared/clientApi/clientApi";

type EventsPageRequest = (page: number, size: number) => Promise<any>;

function getEventPageItems(page: any): any[] {
  const possibleItems = [
    page?.items,
    page?.history?.items,
    page?.events,
    page?.rewards,
    page?.history,
  ];

  return possibleItems.find(Array.isArray) ?? [];
}

async function getAllEventPages(
  requestPage: EventsPageRequest,
  pageSize: number,
) {
  const firstPage = await requestPage(1, pageSize);
  const firstItems = getEventPageItems(firstPage);
  const rawTotal = firstPage?.total ?? firstPage?.history?.total;

  if (rawTotal === null || rawTotal === undefined) {
    const items = [...firstItems];
    let pageNumber = 2;
    let lastPageItems = firstItems;

    while (lastPageItems.length === pageSize && pageNumber <= 100) {
      const nextPage = await requestPage(pageNumber, pageSize);
      lastPageItems = getEventPageItems(nextPage);
      items.push(...lastPageItems);
      pageNumber += 1;
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
      requestPage(index + 2, pageSize),
    ),
  );

  return {
    ...firstPage,
    items: [
      ...firstItems,
      ...remainingPages.flatMap(getEventPageItems),
    ],
    total,
  };
}

export async function getMovementEventsApi(
  deviceId?: string,
  loadAll = false,
) {
  if (!deviceId) return { items: [], total: 0 };

  const pageSize = loadAll ? 500 : 5;
  const requestPage = (page: number, size: number) =>
    clientApi
      .get("/events/movement", { params: { device_id: deviceId, page, size } })
      .then(({ data }) => data);

  return loadAll
    ? getAllEventPages(requestPage, pageSize)
    : requestPage(1, pageSize);
}

export async function getDoorEventsApi(deviceId?: string, loadAll = false) {
  if (!deviceId) return { items: [], total: 0 };

  const pageSize = loadAll ? 500 : 5;
  const requestPage = (page: number, size: number) =>
    clientApi
      .get("/events/door", { params: { device_id: deviceId, page, size } })
      .then(({ data }) => data);

  return loadAll
    ? getAllEventPages(requestPage, pageSize)
    : requestPage(1, pageSize);
}

export async function getRewardEventsApi(
  deviceId?: string,
  loadAll = false,
) {
  if (!deviceId) return { items: [], total: 0 };

  const pageSize = loadAll ? 200 : 5;
  const requestPage = (page: number, size: number) =>
    clientApi
      .get(`/devices/${deviceId}/rewards`, { params: { page, size } })
      .then(({ data }) => data);

  return loadAll
    ? getAllEventPages(requestPage, pageSize)
    : requestPage(1, pageSize);
}
