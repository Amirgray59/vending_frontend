"use client"

import PageTitle from "@/components/shared/PageTitle";
import NavigationTabs from "@/features/device-detail/components/NavigationTabs";
import OverviewSection from "@/features/device-detail/components/OverviewSection";
import VendingMachineCard from "@/features/device-detail/components/VendingMachinCard";
import { TabsType } from "@/features/device-detail/Types";
import { useState } from "react";

export default function page() {
  
  const [activeTab, setActiveTab] = useState<TabsType>('overview');
  

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
