"use client";

import FilterContainer from "@/components/shared/FilterContainer";
import PageTitle from "@/components/shared/PageTitle";
import AlertList from "@/features/alerts/components/AlertList";
import AlertStats from "@/features/alerts/components/AlertsStatus";
import RecentReports from "@/features/alerts/components/RecentReports";
import useGetAlertList from "@/features/alerts/hooks/useGetAlertList";
import { useState, useMemo } from "react";

interface ChangeHandlerEvent {
  target: {
    name: string;
    value: string;
  };
}

// اصلاح مقادیر مطابق با دیتای سرور
const optionsMap = {
  
  alertType: {
    title: "نوع هشدار",
    options: [
      { id: "all", name: "همه انواع" },
      { id: "hardware_error", name: "خطای سخت‌افزاری" },
      { id: "network_error", name: "خطای شبکه" },
    ],
  },
  status: {
    title: "وضعیت",
    options: [
      { id: "all", name: "همه وضعیت ها" },
      { id: "resolved", name: "حل شده" },
      { id: "unresolved", name: "حل نشده" },
    ],
  },
  intensity: {
    title: "شدت",
    options: [
      { id: "all", name: "همه شدت ها" },
      { id: "critical", name: "بحرانی" },
      { id: "warning", name: "بالا" },
      { id: "info", name: "متوسط" },
    ],
  },
};

export default function Page() {
  const [filterValues, setFilterValues] = useState({
    places: "all",
    alertType: "all",
    status: "all",
    intensity: "all",
  });

  const { alertList, isGettingAlertsList } = useGetAlertList();  

  const handleInputChange = (e: ChangeHandlerEvent) => {
    setFilterValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClearFilters = () => {
    setFilterValues({
      places: "all",
      alertType: "all",
      status: "all",
      intensity: "all",
    });
  };

  const filteredAlerts = useMemo(() => {
    const items = alertList?.items || [];

    return items.filter((alert: any) => {
      const matchesIntensity =
        filterValues.intensity === "all" ||
        alert.severity === filterValues.intensity;

      const matchesType =
        filterValues.alertType === "all" ||
        alert.type === filterValues.alertType;

      let matchesStatus = true;
      if (filterValues.status !== "all") {
        if (filterValues.status === "resolved")
          matchesStatus = alert.resolved === true;
        else if (filterValues.status === "unresolved")
          matchesStatus = alert.resolved === false;
      }

      const matchesPlace =
        filterValues.places === "all" || alert.location_id === filterValues.places;

      return matchesIntensity && matchesType && matchesStatus && matchesPlace;
    });
  }, [alertList, filterValues]);

  return (
    <section className="p-4">
      {/* Page Title */}
      <PageTitle title="هشدار ها" description="داشبورد / هشدارها" />

      {/* Filter Container */}
      <FilterContainer
        filterValues={filterValues}
        handleInputChange={handleInputChange}
        className="grid xl:grid-cols-5 gap-4 py-4 grid-cols-2"
        optionsMap={optionsMap}
        isClearFilter
        onClearFilters={handleClearFilters}
      />

      {/* Alert Status Cards */}
      <AlertStats />

      {/* Main Content Area */}
      <div className="grid grid-cols-12 pt-4 gap-4">
        
        <div className="col-span-12 ">
          <AlertList
            filterValues={filterValues}
            data={filteredAlerts}
            isLoading={isGettingAlertsList}
          />
        </div>
        {/* <div className="col-span-12 sm:col-span-4">
          <RecentReports />
        </div> */}
      </div>
    </section>
  );
}
