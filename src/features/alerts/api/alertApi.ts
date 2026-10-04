import clientApi from "@/shared/clientApi/clientApi";

export interface AlertQueryParams {
  device_id?: string;
  location_id?: string;
  full_name?: string;
  city?: string;
  sort?: string;
  type?: string;
  severity?: string;
  resolved?: boolean;
  acknowledged?: boolean;
  page?: number;
  size?: number;
}

export async function getAlertListApi(params: AlertQueryParams = {}) {
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ""),
  );
  return await clientApi.get("/alerts", { params: cleanedParams }).then(({ data }) => data);
}

export async function getAllAlertListApi(params: Omit<AlertQueryParams, "page" | "size"> = {}) {
  const pageSize = 200;
  const firstPage = await getAlertListApi({ ...params, page: 1, size: pageSize });
  const total = Number(firstPage?.total ?? firstPage?.items?.length ?? 0);
  const pageCount = Math.ceil(total / pageSize);

  if (pageCount <= 1) {
    return { ...firstPage, items: firstPage?.items ?? [], total };
  }

  const remainingPages = await Promise.all(
    Array.from({ length: pageCount - 1 }, (_, index) =>
      getAlertListApi({ ...params, page: index + 2, size: pageSize }),
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

export async function getAlertStatsApi() {
  return await clientApi.get("/alerts/stats").then(({ data }) => data);
}

export async function getAlertsCSVReportsApi(params: AlertQueryParams) {
  const queryParams = new URLSearchParams();
  const supportedParams = ["device_id", "location_id", "type", "severity", "resolved", "acknowledged"] as const;

  supportedParams.forEach((key) => {
    const value = params[key];
    if (value !== undefined && value !== null && value !== "") {
      queryParams.set(key, String(value));
    }
  });

  const queryString = queryParams.toString();
  const url = `/reports/alerts.csv${queryString ? `?${queryString}` : ""}`;
  return await clientApi.get(url, { responseType: "blob" }).then(({ data }) => data);
}
