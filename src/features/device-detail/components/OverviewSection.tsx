import { Dispatch, SetStateAction } from "react";
import { TabsType } from "../Types";
import DeviceStatusCard from "./DeviceStatusCard";
import EventsCard from "./EventCard";
import KeyMetrics from "./KeyMetrics";
import PaymentDetail from "./PaymentsDetail";
import RecentActivitiesTable from "./RecentActivitiesTable";
import GameTab from "./GameTab";
import InventoryTab from "./InventoryTab";
import RepairsTab from "./RepairsTab";
import ControlSchedulingTab from "./ControlSchedulingTab";

interface OverviewSectionProps {
  activeTab: TabsType;
  setActiveTab: Dispatch<SetStateAction<TabsType>>;
}

export default function OverviewSection({
  activeTab,
  setActiveTab,
}: OverviewSectionProps) {

  const renderTabs = () => {
    switch (activeTab) {
      case "payments":
        return <PaymentDetail activeTab={activeTab} setActiveTab={setActiveTab} />;
      case "games":
        return <GameTab />;
      case "inventory":
        return <InventoryTab />;
      case "events":
        return (
          <div className="pt-4 grid grid-cols-1 md:grid-cols-2">
            <EventsCard activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        );
      case "repairs": 
        return <RepairsTab />;
      
      case "control-scheduling": 
        // CHECK DEVICE STATUS HERE
        if (false) {
          return (
            <div className="flex flex-col items-center justify-center p-10 text-center space-y-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 mt-4">
              <div className="p-4 bg-yellow-100 text-yellow-600 rounded-full">
                ⚠️
              </div>
              <h3 className="text-slate-800 font-bold text-lg">دسترسی محدود</h3>
              <p className="text-slate-500 text-sm max-w-xs">
                این بخش برای دستگاه‌هایی که   <span className="font-bold text-yellow-600">در انتظار فعال شدن</span> هستند فعال نیست.
                <br />
                لطفاً پس از فعال‌سازی دستگاه، مجدداً تلاش کنید.
              </p>
            </div>
          );
        }
        return <ControlSchedulingTab />;
        
      default:
        return null;
    }
  };

  return (
    <section>
      {activeTab === "overview" && (
        <section className="grid grid-cols-12 gap-4 pt-4">
          <div className="col-span-12 xl:col-span-7">
            <KeyMetrics />
          </div>
          <div className="col-span-12 sm:col-span-6 xl:col-span-5">
            <EventsCard activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          <div className="col-span-12 sm:col-span-6 xl:col-span-3">
            <DeviceStatusCard />
          </div>
          <div className="col-span-12 xl:col-span-9">
            <RecentActivitiesTable
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
        </section>
      )}
      <div className="mt-4">{renderTabs()}</div>
    </section>
  );
}