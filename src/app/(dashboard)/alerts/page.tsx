"use client";

import FilterContainer from "@/components/shared/FilterContainer";
import PageTitle from "@/components/shared/PageTitle";
import SelectInput from "@/components/form/SelectInput";
import AlertList from "@/features/alerts/components/AlertList";
import AlertStats from "@/features/alerts/components/AlertsStatus";
import useGetAlertList from "@/features/alerts/hooks/useGetAlertList";
import UseGetSections from "@/shared/hooks/useGetSections";
import { useEffect, useMemo, useState } from "react";
import { FaSlidersH } from "react-icons/fa";
import { LuFilter } from "react-icons/lu";

interface ChangeHandlerEvent {
  target: {
    name: string;
    value: string;
  };
}

const optionsMap = {
  alertType: {
    title: "نوع هشدار",
    options: [
      { id: "all", name: "همه انواع" },
      { id: "low_quantity", name: "موجودی کم" },
      { id: "offline", name: "قطع ارتباط" },
      { id: "movement", name: "جابجایی دستگاه" },
      { id: "door_open", name: "باز بودن در" },
      { id: "long_door_open", name: "باز ماندن طولانی در" },
      { id: "hardware_error", name: "خطای سخت‌افزاری" },
      { id: "unclaimed_device", name: "دستگاه ثبت‌نشده" },
      { id: "pos_rate_limit", name: "محدودیت درخواست پرداخت" },
    ],
  },
  status: {
    title: "وضعیت حل",
    options: [
      { id: "all", name: "همه وضعیت‌ها" },
      { id: "resolved", name: "حل‌شده" },
      { id: "unresolved", name: "حل‌نشده" },
    ],
  },
  intensity: {
    title: "شدت",
    options: [
      { id: "all", name: "همه شدت‌ها" },
      { id: "critical", name: "بحرانی" },
      { id: "warning", name: "بالا" },
      { id: "info", name: "متوسط" },
    ],
  },
  acknowledged: {
    title: "تأیید",
    options: [
      { id: "all", name: "همه" },
      { id: "acknowledged", name: "تأییدشده" },
      { id: "unacknowledged", name: "تأییدنشده" },
    ],
  },
  sort: {
    title: "مرتب‌سازی",
    options: [
      { id: "recent", name: "ترتیب پیش‌فرض" },
      { id: "device", name: "بیشترین هشدار برای هر دستگاه" },
    ],
  },
};

const initialFilters = {
  places: "all",
  sections: "all",
  alertType: "all",
  status: "all",
  intensity: "all",
  acknowledged: "all",
  sort: "recent",
  fullName: "",
  city: "",
};

export default function Page() {
  const [filterValues, setFilterValues] = useState(initialFilters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [debouncedTextFilters, setDebouncedTextFilters] = useState({
    fullName: "",
    city: "",
  });

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedTextFilters({
        fullName: filterValues.fullName.trim(),
        city: filterValues.city.trim(),
      });
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [filterValues.fullName, filterValues.city]);

  const { sections } = UseGetSections(filterValues.places);

  const alertQuery = useMemo(
    () => ({
      location_id: filterValues.places === "all" ? undefined : filterValues.places,
      full_name: debouncedTextFilters.fullName || undefined,
      city: debouncedTextFilters.city || undefined,
      type: filterValues.alertType === "all" ? undefined : filterValues.alertType,
      severity: filterValues.intensity === "all" ? undefined : filterValues.intensity,
      resolved:
        filterValues.status === "all" ? undefined : filterValues.status === "resolved",
      acknowledged:
        filterValues.acknowledged === "all"
          ? undefined
          : filterValues.acknowledged === "acknowledged",
      sort: filterValues.sort === "device" ? "device" : undefined,
    }),
    [filterValues, debouncedTextFilters],
  );

  const { alertList, isGettingAlertsList } = useGetAlertList(alertQuery);

  const handleInputChange = (event: ChangeHandlerEvent) => {
    setFilterValues((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
      ...(event.target.name === "places" ? { sections: "all" } : {}),
    }));
  };

  const handleClearFilters = () => setFilterValues(initialFilters);

  const filteredAlerts = useMemo(() => {
    const items = alertList?.items ?? [];
    return items.filter(
      (alert: any) =>
        filterValues.sections === "all" || alert.section_id === filterValues.sections,
    );
  }, [alertList, filterValues.sections]);

  const sectionOptions = [
    { id: "all", name: "همه بخش‌ها" },
    ...(sections?.items ?? []).map((section: any) => ({
      id: section.id,
      name: section.name,
    })),
  ];

  return (
    <section className="p-4">
      <PageTitle title="هشدارها" description="داشبورد / هشدارها" />

      <div className="pt-4">
        <button
          onClick={() => setIsFilterOpen((isOpen) => !isOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
            isFilterOpen
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <LuFilter className="w-4 h-4" />
          <span>فیلترها</span>
          <FaSlidersH className="w-3 h-3" />
        </button>

        {isFilterOpen && (
          <div className="mt-3 flex flex-col gap-3 p-4 bg-gray-50 border border-gray-100 rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
            <FilterContainer
              filterValues={filterValues}
              handleInputChange={handleInputChange}
              className="grid xl:grid-cols-5 gap-4 grid-cols-2"
              optionsMap={optionsMap}
              isClearFilter
              onClearFilters={handleClearFilters}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              <SelectInput
                name="sections"
                title="بخش"
                options={sectionOptions}
                filterValues={filterValues}
                handleChange={handleInputChange}
              />
              <label className="flex flex-col gap-2 text-sm text-gray-800">
                نام دستگاه
                <input
                  name="fullName"
                  value={filterValues.fullName}
                  onChange={(event) => handleInputChange(event)}
                  placeholder="جست‌وجو بر اساس نام دستگاه"
                  className="w-full rounded-lg border border-gray-100 bg-white px-3 py-2 text-sm shadow-xs"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-gray-800">
                شهر
                <input
                  name="city"
                  value={filterValues.city}
                  onChange={(event) => handleInputChange(event)}
                  placeholder="جست‌وجو بر اساس شهر"
                  className="w-full rounded-lg border border-gray-100 bg-white px-3 py-2 text-sm shadow-xs"
                />
              </label>
            </div>
          </div>
        )}
      </div>

      <AlertStats />

      <div className="grid grid-cols-12 pt-4 gap-4">
        <div className="col-span-12">
          <AlertList
            filterValues={filterValues}
            data={filteredAlerts}
            isLoading={isGettingAlertsList}
          />
        </div>
      </div>
    </section>
  );
}
