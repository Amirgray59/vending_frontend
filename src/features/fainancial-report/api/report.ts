import clientApi from "@/shared/clientApi/clientApi";

// تعریف دقیق پارامترها مطابق با Swagger
export interface CSVReportParams {
  device_id?: string | null;
  location_id?: string | null;
  section_id?: string | null;
  city?: string | null;
  device_status?: string | null;
  inventory_status?: string | null;
  date_from?: string | null;
  date_to?: string | null;
  search_query?: string | null;
}

export async function getTransactionsCSVReportsApi(params: CSVReportParams) {
  // ۱. تعریف لیست مقادیر ممنوعه که نباید به API ارسال شوند
  const forbiddenValues = ["همه مجموعه ها", "همه بخش ها", "all", "همه", ""];

  // ۲. پاک‌سازی پیشرفته پارامترها
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => {
      // مقدار را به رشته تبدیل می‌کنیم تا بتوانیم با forbiddenValues مقایسه کنیم
      const stringValue = String(value);
      
      // فقط مقادیری را نگه دار که:
      // - null نباشند
      // - undefined نباشند
      // - در لیست forbiddenValues نباشند
      return (
        value !== null && 
        value !== undefined && 
        !forbiddenValues.includes(stringValue)
      );
    })
  );

  // استفاده از قابلیت params در axios برای ساخت استاندارد Query String
  return await clientApi.get(`/reports/transactions.csv`, { 
    params: cleanParams, 
    responseType: 'blob' 
  }).then(({ data }) => data);
}