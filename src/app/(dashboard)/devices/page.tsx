
"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import PageTitle from "@/components/shared/PageTitle";
import DevicesCardsSection from "@/features/devices/components/DevicesCardsSection";
import DevicesFilterContainer from "@/features/devices/components/DevicesFilterContainer";
import UseGetLocations from "@/shared/hooks/useGetLocations";
import DeviceManagementTable from "@/features/devices/components/DevicesManagementTable";

export default function DevicesPage() {
  const searchParams = useSearchParams();

  const initialFilters = {
    places: "همه مجموعه ها",
    sections: "همه بخش ها",
    status: "all",
    inventory: "all",
    connection: "all",
    deviceId: "all",
    city:"all",
    search: "",
  };

  // ✅ فقط یکبار در لحظه مقداردهی اولیه استیت، URL را چک می‌کنیم
  const [filterAndSearchValues, setFilterAndSearchValues] = useState(() => {
    if (searchParams.toString()) {
      return {
        places: searchParams.get("location_id") || "همه مجموعه ها",
        sections: searchParams.get("section_id") || "همه بخش ها",
        status: searchParams.get("status") || "",
        inventory: searchParams.get("inventory") || "",
        connection: searchParams.get("connection") || "",
        deviceId: searchParams.get("device_id") || "all",
        city: searchParams.get("city") || "all",
        search: searchParams.get("q") || "",
      };
    }
    return initialFilters;
  });

  const { locations } = UseGetLocations();


  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFilterAndSearchValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilterAndSearchValues(initialFilters);
  };

  return (
    <section className="p-4">
      <PageTitle title="دستگاه ها " description="داشبورد / دستگاه ها" />

      <DevicesFilterContainer
        className=""
        filterValues={filterAndSearchValues}
        handleInputChange={handleInputChange}
        onReset={resetFilters}
      />

      <DevicesCardsSection />

      <DeviceManagementTable filters={filterAndSearchValues} />
    </section>
  );
}