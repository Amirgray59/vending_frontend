
"use client";

import React, { useState } from "react";
import SelectInput from "@/components/form/SelectInput";
import UseGetAllSection from "@/shared/hooks/useGetAllSections";
import UseGetLocations from "@/shared/hooks/useGetLocations";
import { FaSlidersH } from "react-icons/fa";
import { LuFilter } from "react-icons/lu";
import useGetTransactionsCSVReports from "@/features/fainancial-report/hooks/useGetTransactionsCSVReports";
import { useGetDevicesDetail } from "../hooks/useGetAllDevices";
import { Download } from "lucide-react";

interface AdvancedFilterProps<T> {
  filterValues: T;
  className: string;
  handleInputChange: (e: any) => void;
  onReset: () => void;
}

export default function DevicesAdvancedFilter<T>({
  className,
  filterValues,
  handleInputChange,
  onReset,
}: AdvancedFilterProps<T>) {
  const [isFilter, setIsFilter] = useState(false);
  const { locations } = UseGetLocations();
  const { sectionsList } = UseGetAllSection();
  const { executeGetCsv, isGettingtransactionsCsvReports } =
    useGetTransactionsCSVReports();

  const filters = filterValues as any;
  const currentPlaces = filters.places;
  const currentSections = filters.sections;

  const { data: devicesData, isLoading: isGettingDevices } =
    useGetDevicesDetail({
      locationId: currentPlaces,
      sectionId: currentSections,
    });

  const handleExportCSV = async () => {
    try {
      const params = {
        places:
          filters.places === "all" || filters.places === "همه مجموعه ها"
            ? undefined
            : filters.places,
        sections:
          filters.sections === "all" || filters.sections === "همه بخش ها"
            ? undefined
            : filters.sections,
      };
      const blob = await executeGetCsv(params);
      if (!blob) return;
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `report_${new Date().toISOString().split("T")[0]}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export Error:", error);
    }
  };

  return (
    <div className="w-full">
      <div className="mt-4 block sm:hidden">
        <button
          onClick={() => setIsFilter((prev) => !prev)}
          className="flex bg-white justify-center w-full items-center h-[45px] font-medium cursor-pointer gap-2 px-4 py-2 border border-gray-100 shadow-xs rounded-md text-sm text-gray-800 hover:bg-gray-50 transition-all"
        >
          <FaSlidersH className="w-4 h-4" />
          <span>فیلترهای گزارش</span>
        </button>
      </div>

      <div
        className={`${className} ${
          isFilter
            ? "transition-all duration-100 mt-4 sm:mt-0 h-auto border border-gray-100 shadow-sm p-4 rounded-lg"
            : "h-0 sm:h-auto transition-all duration-100"
        } overflow-hidden sm:overflow-visible`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mb-6">

            <button
              onClick={handleExportCSV}
              disabled={isGettingtransactionsCsvReports}
              className="flex justify-center w-full sm:w-auto items-center bg-white h-[45px] font-medium cursor-pointer gap-2 px-4 py-2 border border-gray-100 shadow-xs rounded-md text-sm text-gray-800 hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              خروجی CSV
            </button>
          <button
            onClick={onReset}
            className="flex shadow-xs h-[45px] bg-white items-center justify-center gap-x-3 border border-gray-100 rounded-lg px-3 w-full sm:w-auto py-3 cursor-pointer text-sm"
          >
            <LuFilter size={18} />
            <span>پاکسازی فیلترها</span>
          </button>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 sm:col-span-3 lg:col-span-3 flex items-center">
            <div className="w-full">
              <SelectInput
                name="places"
                title="مجموعه ها"
                options={[
                  { id: "all", name: "همه مجموعه ها" },
                  ...((locations?.items || locations)?.map((item: any) => ({ id: item.id, name: item.name })) || []),
                ]}
                filterValues={filters}
                handleChange={handleInputChange}
              />
            </div>
          </div>

          <div className="col-span-12 sm:col-span-3 lg:col-span-3 flex items-center">
            <div className="w-full">
              <SelectInput
                name="sections"
                title="بخش ها"
                options={[
                  { id: "all", name: "همه بخش ها" },
                  ...((sectionsList?.items || sectionsList)?.map((item: any) => ({ id: item.id, name: item.name })) || []),
                ]}
                filterValues={filters}
                handleChange={handleInputChange}
              />
            </div>
          </div>

          <div className="col-span-12 sm:col-span-3 lg:col-span-3 flex items-center">
            <div className="w-full relative">
              <SelectInput
                name="deviceId"
                title="دستگاه ها"
                options={[
                  { id: "all", name: "همه دستگاه ها" },
                  ...(devicesData?.items?.map((device: any) => ({ id: device.id, name: device.name || device.device_code })) || []),
                ]}
                filterValues={filters}
                handleChange={handleInputChange}
              />
              {isGettingDevices && (
                <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>

          <div className="col-span-12 sm:col-span-3 lg:col-span-3 flex items-center">
            <div className="w-full">
              <SelectInput
                name="sortOrder"
                title="ترتیب موجودی"
                options={[
                  { id: "none", name: "پیش‌فرض" },
                  { id: "desc", name: "بیشترین موجودی" },
                  { id: "asc", name: "کمترین موجودی" },
                ]}
                filterValues={filters}
                handleChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}