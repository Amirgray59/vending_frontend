"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import SelectInput from "@/components/form/SelectInput";
import UseGetAllSection from "@/shared/hooks/useGetAllSections";
import UseGetLocations from "@/shared/hooks/useGetLocations";
import { Download } from "lucide-react";
import { FaSlidersH } from "react-icons/fa";
import { LuFilter, LuSearch } from "react-icons/lu";
import useGetTransactionsCSVReports from "@/features/fainancial-report/hooks/useGetTransactionsCSVReports";

// تغییر ساختار به id و name برای هماهنگی کامل با SelectInput
const CITIES_LIST = [
  { id: "all", name: "همه شهرها" },
  { id: "Tehran", name: "تهران" },
  { id: "Mashhad", name: "مشهد" },
  { id: "Isfahan", name: "اصفهان" },
  { id: "Tabriz", name: "تبریز" },
  { id: "Shiraz", name: "شیراز" },
  { id: "Karaj", name: "کرج" },
];

interface FilterContainerProps<T> {
  filterValues: T;
  className: string;
  handleInputChange: (e: any) => void;
  onReset: () => void;
}

export default function DevicesFilterContainer<T>({
  className,
  filterValues,
  handleInputChange,
  onReset,
}: FilterContainerProps<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { locations } = UseGetLocations();
  const { sectionsList } = UseGetAllSection();
  const { executeGetCsv, isGettingtransactionsCsvReports } =
    useGetTransactionsCSVReports();

  const filters = filterValues as any;
  const [searchTerm, setSearchTerm] = useState(filters.search || "");

  const updateUrl = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all" && value !== "all") {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleInputChangeWithUrl = (e: any) => {
    const { name, value } = e.target;
    handleInputChange(e);
    updateUrl(name, value);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleInputChange({ target: { name: "search", value: searchTerm } });
      updateUrl("q", searchTerm);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const mapFiltersToCsvParams = () => {
    return {
      q: filters.search || "",
      location_id: filters.places === "all" ? "" : filters.places,
      section_id: filters.sections === "all" ? "" : filters.sections,
      city: filters.city || "",
      status: filters.status || "",
      connection: filters.connection || "",
      inventory: filters.inventory || "",
      date_from: filters.date_from || null,
      date_to: filters.date_to || null,
    };
  };

  const handleExportCSV = async () => {
    try {
      const params = mapFiltersToCsvParams();
      const blob = await executeGetCsv(params);
      if (!blob) return;
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `report_${new Date().getTime()}.csv`);

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Export Error:", error);
    }
  };

  const handleResetAndClearUrl = () => {
    onReset();
    router.push(pathname);
  };

  return (
    <div
      className={`flex flex-wrap items-center pt-4 justify-between gap-4 ${className}`}
    >
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative w-full md:w-72">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="جستجوی دستگاه..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
            isFilterOpen
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <LuFilter className="w-4 h-4" />
          <span className="hidden sm:inline">فیلترها</span>
          <FaSlidersH className="w-3 h-3" />
        </button>

        {isFilterOpen && (
          <div className="flex flex-col gap-3 p-4 bg-gray-50 border w-full rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              <SelectInput
                title="شهر"
                filterValues={filters}
                handleChange={handleInputChangeWithUrl}
                name="city"
                options={CITIES_LIST} // ✅ حالا مستقیماً {id, name} است
              />

              <SelectInput
                title="مجموعه"
                filterValues={filters}
                handleChange={handleInputChangeWithUrl}
                name="places"
                options={[
                  { id: "all", name: "همه مجموعه ها" },
                  ...(locations?.items?.map((loc: any) => ({
                    id: loc.id,
                    name: loc.name,
                  })) || []),
                ]}
              />

              <SelectInput
                title="بخش"
                filterValues={filters}
                handleChange={handleInputChangeWithUrl}
                name="sections"
                options={[
                  { id: "all", name: "همه بخش ها" },
                  ...(sectionsList?.items?.map((sec: any) => ({
                    id: sec.id,
                    name: sec.name,
                  })) || []),
                ]}
              />

              <SelectInput
                title="وضعیت"
                filterValues={filters}
                handleChange={handleInputChangeWithUrl}
                name="status"
                options={[
                  { id: "all", name: "همه وضعیت ها" },
                  { id: "online", name: "آنلاین" },
                  { id: "offline", name: "آفلاین" },
                  { id: "pending", name: "در انتظار" },
                  { id: "disabled", name: "غیرفعال" },
                  { id: "maintenance", name: "تعمیرات" },
                ]}
              />

              <SelectInput
                title="اتصال"
                filterValues={filters}
                handleChange={handleInputChangeWithUrl}
                name="connection"
                options={[
                  { id: "all", name: "همه" },
                  { id: "online", name: "متصل" },
                  { id: "offline", name: "قطع شده" },
                ]}
              />

              <SelectInput
                title="موجودی"
                filterValues={filters}
                handleChange={handleInputChangeWithUrl}
                name="inventory"
                options={[
                  { id: "all", name:"همه" },
                  { id: "ok", name: "به اندازه" },
                  { id: "low", name: "کم" },
                ]}
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleResetAndClearUrl}
                className="px-3 py-2 text-xs text-red-500 hover:bg-red-50 rounded-md transition-colors"
              >
                حذف تمام فیلترها
              </button>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleExportCSV}
        disabled={isGettingtransactionsCsvReports}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGettingtransactionsCsvReports ? (
          <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        <span>خروجی CSV</span>
      </button>
    </div>
  );
}
