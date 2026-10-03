
"use client";

import PageTitle from "@/components/shared/PageTitle";
import ReportsChartSection from "@/features/fainancial-report/components/ChartsSection";
import FinancialReportTable from "@/features/fainancial-report/components/FainancialReportTable";
import ReportsCardsSection from "@/features/fainancial-report/components/ReportsCardsSection";
import ReportsFilterSection from "@/features/fainancial-report/components/ReportsFilterSection";
import { useFilteredData } from "@/features/fainancial-report/hooks/useFilteredData";
import { prepareChartData } from "@/features/fainancial-report/utils/prepareChartData";
import { prepareTrendData } from "@/features/fainancial-report/utils/prepareTrendData";
import UseGetAllSection from "@/shared/hooks/useGetAllSections";
import UseGetLocations from "@/shared/hooks/useGetLocations";
import useGetTransactions from "@/shared/hooks/useGetTransactions";
import { useState, useMemo } from "react";

// --- اصلاح تایپ FilterValues: همه چیز string است ---
interface FilterValues {
  fromDate: string;
  toDate: string;
  places: string;
  sections: string;
  startTime: string;
  endTime: string;
  searchQuery: string;
}

export default function Page() {
  const [filterValues, setFilterValues] = useState<FilterValues>({
    fromDate: "",
    toDate: "",
    places: "all", 
    sections: "all", 
    startTime: "",
    endTime: "",
    searchQuery: "",
  });

  const { isgettingTransactions, transactions } = useGetTransactions();
  const { isGettingLocations, locations } = UseGetLocations();


  // --- اصلاح منطق فرمت کردن برای فیلتر داخلی ---
  const formattedFilters = useMemo(() => {
    return {
      ...filterValues,
      // چون مقادیر در استیت- الّرا- به صورت رشته ذخیره شده‌اند، 
      // دیگر نیازی به چک کردن instanceof DateObject نیست.
      // فقط اگر نیاز است فرمت خاصی برای useFilteredData ارسال شود، اینجا تغییر دهید.
      fromDate: filterValues.fromDate,
      toDate: filterValues.toDate,
      startTime: filterValues.startTime,
      endTime: filterValues.endTime,
    };
  }, [filterValues]);

  // ۱. فیلتر کردن داده‌ها (بر اساس مقادیر رشته‌ای)
  const filteredData = useFilteredData(
    transactions?.items || [],
    formattedFilters as any, 
  );

  // ۲. آماده‌سازی دیتای نمودارها
  const incomeLocationData = useMemo(() => {
    return prepareChartData(filteredData, locations?.items || []);
  }, [filteredData, locations]);

  const trendIncomeData = useMemo(() => {
    return prepareTrendData(filteredData);
  }, [filteredData]);

  if (isgettingTransactions || isGettingLocations) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">
          در حال دریافت گزارشات مالی...
        </p>
      </div>
    );
  }

  return (

    <section className="p-4">
      <PageTitle title="گزارش مالی" description="داشبورد / گزارش مالی" />

      <ReportsFilterSection
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        locations={locations?.items || []} 
      />

      <ReportsCardsSection filteredData={filteredData} />

      <ReportsChartSection
        incomeLocationData={incomeLocationData}
        incomeTrendData={trendIncomeData}
      />

      <div className="mt-6">
        <FinancialReportTable filteredData={filteredData} />
      </div>
    </section>
  );
}