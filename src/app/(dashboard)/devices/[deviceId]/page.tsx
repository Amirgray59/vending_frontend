"use client"

import PageTitle from "@/components/shared/PageTitle";
import NavigationTabs from "@/features/device-detail/components/NavigationTabs";
import OverviewSection from "@/features/device-detail/components/OverviewSection";
import VendingMachineCard from "@/features/device-detail/components/VendingMachinCard";
import InventoryTab from "@/features/device-detail/components/InventoryTab";
import { TabsType } from "@/features/device-detail/Types";
import { useState } from "react";
import UseGetProfile from "@/shared/hooks/useGetProfile";

export default function page() {
  const { profile } = UseGetProfile();
  const [activeTab, setActiveTab] = useState<TabsType>('overview');

  if (profile?.role === "operator") {
    return (
      <section className="p-4">
        <PageTitle title="جزئیات دستگاه" description="داشبورد / جزئیات دستگاه" />
        <VendingMachineCard showFinancials={false} />
        <InventoryTab />
      </section>
    );
  }
  

  return (
    <section className="p-4">
      {/* Page Title */}
      <PageTitle title="جزییات دستگاه" description="داشبورد / جزییات دستگاه" />
      {/* Vending Machine Card */}
      <VendingMachineCard />
      {/* Navigation Tabs */}
      <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab}/>
      {/* Overview Section */}
      <OverviewSection activeTab={activeTab} setActiveTab={setActiveTab}/>
    </section>
  );
}
