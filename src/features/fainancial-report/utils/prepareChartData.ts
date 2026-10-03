export const prepareChartData = (filteredData: any[], allLocationsItems: any[]) => {
  // ۱. محاسبه مجموع درآمدها بر اساس location_id (چون در هر دو دیتا مشترک و منحصر به فرد است)
  const totalsById = filteredData.reduce((acc: Record<string, number>, item: any) => {
    const locId = item.location_id; // استفاده از ID به جای نام
    if (locId) {
      acc[locId] = (acc[locId] || 0) + (item.total || 0);
    }
    return acc;
  }, {});

  // ۲. حالا لیست مکان‌ها را می‌چرخیم تا نام هر مکان و درآمد مربوط به ID آن را استخراج کنیم
  return allLocationsItems.map((loc) => {
    // پیدا کردن مجموع درآمد این مکان با استفاده از ID آن
    const income = totalsById[loc.id] || 0; 
    
    return {
      name: loc.name,   // نمایش نام مکان در نمودار
      value: income,    // مقدار درآمد محاسبه شده
    };
  });
};