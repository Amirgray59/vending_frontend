
"use client";

import React, { useMemo } from "react";
import { LuSearch } from "react-icons/lu";
import { FaSlidersH } from "react-icons/fa";
import ReportsFilterContainer from "./ReportsFilterContainer";
import { Dispatch, SetStateAction } from "react";
import UseGetAllSection from "@/shared/hooks/useGetAllSections";
import useGetTransactionsCSVReports from "../hooks/useGetTransactionsCSVReports";

// --- مقادیر اولیه برای پاک‌سازی ---
const initialFilters: FilterValues = {
  fromDate: "",
  toDate: "",
  places: "all",
  sections: "all",
  startTime: "",
  endTime: "",
  searchQuery: "",
};

interface LocationItem {
  id: string;
  name: string;
}

interface SectionItem {
  id: string;
  name: string;
}

interface ChangeHandlerEvent {
  target: {
    name: string;
    value: string;
  };
}

interface FilterValues {
  fromDate: string; // تغییر به string چون حالا ISO است
  toDate: string;   // تغییر به string چون حالا ISO است
  places: string;
  sections: string;
  startTime: string; 
  endTime: string;
  searchQuery: string;
}

interface ReportsFilterSectionProps {
  filterValues: FilterValues;
  setFilterValues: Dispatch<SetStateAction<FilterValues>>;
  locations: LocationItem[];
}

export default function ReportsFilterSection({
  filterValues,
  setFilterValues,
  locations,
}: ReportsFilterSectionProps) {
  const { sectionsList } = UseGetAllSection();
  const { executeGetCsv, isGettingtransactionsCsvReports } = useGetTransactionsCSVReports();

  const sectionsArray = useMemo(() => {
    return sectionsList?.items || [];
  }, [sectionsList]);

  const optionsMap = useMemo(() => {
    return {
      places: {
        title: "مجموعه",
        options: [
          { id: "all", name: "همه مجموعه ها" },
          ...(locations?.map((loc) => ({ id: loc.id, name: loc.name })) || []),
        ],
      },
      sections: {
        title: "بخش",
        options: [
          { id: "all", name: "همه بخش ها" },
          ...(sectionsArray.map((sec: any) => ({
            id: sec.id,
            name: sec.name,
          })) || []),
        ],
      },
    };
  }, [locations, sectionsArray]);

  const handleInputChange = (e: ChangeHandlerEvent) => {
    setFilterValues({
      ...filterValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleClearFilters = () => {
    setFilterValues(initialFilters);
  };

  // 💡 تابع ارسال به CSV
  const handleExportCSV = async () => {
    try {
      // ۱. آماده‌سازی پارامترها (هماهنگ با نام‌های API)
      const params = {
        date_from: filterValues.fromDate || undefined,
        date_to: filterValues.toDate || undefined,
        start_time: filterValues.startTime || undefined,
        end_time: filterValues.endTime || undefined,
        places: filterValues.places === "all" ? undefined : filterValues.places,
        sections: filterValues.sections === "all" ? undefined : filterValues.sections,
        search_query: filterValues.searchQuery || undefined,
      };

      console.log("🚀 Sending Params to API:", params);

      // ۲. اجرای هوک و دریافت دیتای خام (Blob)
      const blob = await executeGetCsv(params);
      
      if (!blob) {
        console.error("No data received from server");
        return;
      }

      // ۳. تبدیل Blob به فایل قابل دانلود در مرورگر
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      
      // نام فایل را به همراه تاریخ جاری می‌سازیم
      const fileName = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
      link.setAttribute('download', fileName);
      
      document.body.appendChild(link);
      link.click();
      
      // ۴. پاک‌سازی برای جلوگیری از نشت حافظه
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Export Error:", error);
      // می‌توانید اینجا یک Toast یا Alert برای کاربر نمایش دهید
    }
  };
  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-xl">
      <div className="grid grid-cols-12 gap-4">
        <ReportsFilterContainer
          filterValues={filterValues}
          setFilterValues={setFilterValues}
          optionsMap={optionsMap}
          handleInputChange={handleInputChange}
          className="col-span-12 grid grid-cols-12 gap-4"
        />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button 
          onClick={handleClearFilters}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          پاکسازی فیلترها
        </button>
        <button 
          onClick={handleExportCSV} 
          disabled={isGettingtransactionsCsvReports}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-all flex items-center gap-2"
        >
          {isGettingtransactionsCsvReports ? "در حال دریافت..." : "خروجی CSV"}
        </button>
      </div>
    </div>
  );
}