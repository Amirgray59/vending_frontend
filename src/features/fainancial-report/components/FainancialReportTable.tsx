
"use client";

import { useMemo, useState } from "react";
import moment from "moment-jalaali";
import UseGetLocations from "@/shared/hooks/useGetLocations";
import UseGetAllSection from "@/shared/hooks/useGetAllSections";

interface TransactionItem {
  id: string;
  occurred_at: string;
  location_id: string;
  section_id: string;
  device_id: string;
  device_name: string;
  game_count: number;
  total: number;
}

interface FinancialReportTableProps {
  filteredData: TransactionItem[];
}

export default function FinancialReportTable({
  filteredData = [],
}: FinancialReportTableProps) {
  const [sort, setSort] = useState("none");

  // دریافت داده‌ها از هوک‌ها
  const { locations } = UseGetLocations();
  const { sectionsList } = UseGetAllSection();

  

  // تبدیل داده‌ها به آرایه برای ایمنی بیشتر
  const locationsArray = useMemo(() => {
    if (!locations) return [];
    return Array.isArray(locations) ? locations : locations.items || [];
  }, [locations]);

  const sectionsArray = useMemo(() => {
    if (!sectionsList) return [];
    return Array.isArray(sectionsList) ? sectionsList : sectionsList.items || [];
  }, [sectionsList]);

  // مرتب‌سازی داده‌ها
  const sortedData = useMemo(() => {
    if (sort === "none") return filteredData;
    return [...filteredData].sort((a, b) => {
      const totalA = a.total || 0;
      const totalB = b.total || 0;
      return sort === "highest" ? totalB - totalA : totalA - totalB;
    });
  }, [filteredData, sort]);

  const formatNumber = (num: number) => num.toLocaleString("fa-IR");

  // توابع دریافت نام مکان و بخش
  const getLocationName = (id: string) => {
    if (!id) return "نامشخص";
    const loc = locationsArray.find((l: any) => l.id === id);
    return loc ? loc.name : "نامشخص";
  };

  const getSectionName = (id: string) => {
    if (!id) return "نامشخص";
    const sec = sectionsArray.find((s: any) => s.id === id);
    return sec ? sec.name : "نامشخص";
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg border border-gray-100 shadow-sm mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-[#1e293b] text-right">گزارش مالی</h3>
        <div className="relative w-40">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm appearance-none cursor-pointer focus:outline-none transition-all text-right"
          >
            <option value="none">ترتیب پیش‌فرض</option>
            <option value="highest">بیشترین مبلغ</option>
            <option value="lowest">کمترین مبلغ</option>
          </select>
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <table className="w-full text-center border-collapse min-w-3xl">

          <thead className="bg-[#F6F7F9] text-xs text-gray-500 font-medium">
            <tr>
              <th className="py-4 px-2 border-b border-gray-100 text-right">تاریخ</th>
              <th className="py-4 px-2 border-b border-gray-100">ساعت</th>
              <th className="py-4 px-2 border-b border-gray-100">نام مجموعه</th>
              <th className="py-4 px-2 border-b border-gray-100">نام بخش</th>
              <th className="py-4 px-2 border-b border-gray-100">نام دستگاه</th>
              <th className="py-4 px-2 border-b border-gray-100">آیدی دستگاه</th>
              <th className="py-4 px-2 border-b border-gray-100">تعداد بازی</th>
              <th className="py-4 px-2 border-b border-gray-100">مبلغ</th>
            </tr>
          </thead>
          <tbody className="text-[10px] md:text-xs text-gray-700">
            {sortedData.length > 0 ? (
              sortedData.map((row) => {
                const dateMoment = moment(row.occurred_at);
                return (
                  <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-2 border-b border-gray-50 text-right">
                      {dateMoment.format("jYYYY/jMM/jDD")}
                    </td>
                    <td className="py-4 px-2 border-b border-gray-50">
                      {dateMoment.format("HH:mm")}
                    </td>
                    <td className="py-4 px-2 border-b border-gray-50">
                      {getLocationName(row.location_id)}
                    </td>
                    <td className="py-4 px-2 border-b border-gray-50">
                      {getSectionName(row.section_id)}
                    </td>
                    <td className="py-4 px-2 border-b border-gray-50">
                      {row.device_name}
                    </td>
                    <td className="py-4 px-2 border-b border-gray-50">
                      {row.device_id}
                    </td>
                    <td className="py-4 px-2 border-b border-gray-50">
                      {row.game_count||0}
                    </td>
                    <td className="py-4 px-2 border-b border-gray-50 font-bold">
                      {formatNumber(row.total)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="py-10 text-gray-400">
                  داده‌ای برای نمایش یافت نشد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}