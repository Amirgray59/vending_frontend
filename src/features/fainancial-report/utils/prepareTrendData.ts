import moment from "moment-jalaali";

// ⚠️ این خط بسیار مهم است و باعث می‌شود کل سیستم moment فارسی شود
moment.loadPersian({ dialect: "persian-modern" });

export const prepareTrendData = (filteredData: any[]) => {
  if (!filteredData || filteredData.length === 0) return [];

  const totalsByDate = filteredData.reduce((acc: Record<string, number>, item: any) => {
    const date = item.occurred_at ? item.occurred_at.split("T")[0] : "Unknown";
    const incomeValue = item.total || 0;

    acc[date] = (acc[date] || 0) + incomeValue;
    return acc;
  }, {});

  return Object.keys(totalsByDate)
    .sort((a, b) => a.localeCompare(b))
    .map((date) => {
      // حالا دیگر نیازی به نوشتن .locale نیست، چون loadPersian را در بالا صدا زدیم
      const jalaliDate = moment(date).format("jD jMMMM"); // نتیجه: «۷ شهریور»

      return {
        date: jalaliDate,
        value: totalsByDate[date],
      };
    });
};