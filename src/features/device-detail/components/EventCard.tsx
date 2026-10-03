
import React, { Dispatch, SetStateAction, useState } from "react";
import { Move, DoorOpen, Clock, Info, WifiOff, AlertCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useGetMovementEvents } from "@/features/events/hooks/useGetMovementEvents";
import { useGetDoorEvents } from "@/features/events/hooks/useGetDoorEvents";

interface EventsCardProps {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<any>>;
}

const EventsCard = ({ activeTab, setActiveTab }: EventsCardProps) => {
  const { deviceId } = useParams();
  const id = deviceId as string;
  const [internalTab, setInternalTab] = useState<"movement" | "door">("movement");

  const { movementEvents, isGettingMovementEvents } = useGetMovementEvents();
  const { doorEvents, isGettingDoorEvents } = useGetDoorEvents();

  const formatTime = (isoDate: string) => {
    if (!isoDate) return "---";
    try {
      return new Date(isoDate).toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) { return "---"; }
  };

  // --- منطق حرفه‌ای تولید پیام برای درب‌ها ---
  const getDoorMessage = (item: any) => {
    const statusPrefix = item.is_aggregate ? "📦 (پس از بازگشت به شبکه): " : "";

    if (item.alarm_type === 3) {
      return `${statusPrefix}هشدار: درب بیش از یک دقیقه باز مانده است`;
    }
    if (item.alarm_type === 1 && item.open_count > 0) {
      return `${statusPrefix}درب باز شد (${item.open_count} بار)`;
    }
    if (item.alarmPtype === 2 && item.close_count > 0) {
      return `${statusPrefix}درب بسته شد (${item.close_count} بار)`;
    }
    return `${statusPrefix}تغییر وضعیت درب`;
  };

  // --- منطق حرفه‌ای تولید پیام برای جابجایی ---
  const getMovementMessage = (item: any) => {
    const statusPrefix = item.is_aggregate ? "📦 (پس از بازگشت به شبکه): " : "";

    if (item.level === 2) {
      return `${statusPrefix}⚠️ لرزش/جابجایی شدید دستگاه`;
    }
    if (item.level === 1) {
      return `${statusPrefix}دستگاه تکان خورد (جابجایی جزئی)`;
    }
    return `${statusPrefix}رویداد جابجایی`;
  };

  if (isGettingMovementEvents || isGettingDoorEvents) {
    return (
      <div className="w-full bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-full animate-pulse">
        <div className="h-12 w-full bg-gray-100 rounded-lg mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 w-full bg-gray-50 rounded-lg"></div>)}
        </div>
      </div>
    );
  }

  const currentData = internalTab === "movement" ? movementEvents?.items || [] : doorEvents?.items || [];

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-gray-800 font-bold text-lg">تاریخچه رویدادها</h3>
        {activeTab === "overview" && (
          <button onClick={() => setActiveTab("events")} className="text-blue-500 text-xs font-semibold cursor-pointer ">

            مشاهده همه
          </button>
        )}
      </div>

      {/* تب‌های داخلی */}
      <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
        <button
          onClick={() => setInternalTab("movement")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
            internalTab === "movement" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Move size={14} /> جابجایی‌ها
        </button>
        <button
          onClick={() => setInternalTab("door")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
            internalTab === "door" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <DoorOpen size={14} /> رویدادهای درب
        </button>
      </div>

      <div className="space-y-3">
        {currentData.length > 0 ? (
          currentData.map((event: any, index: number) => (
            <div key={event.id || index} className="flex items-center justify-between p-3 rounded-xl border border-gray-50 bg-gray-50/50 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${internalTab === 'movement' ? 'bg-indigo-50 text-indigo-500' : 'bg-emerald-50 text-emerald-500'}`}>
                  {internalTab === 'movement' ? <Move size={16} /> : <DoorOpen size={16} />}
                </div>
                <div className="flex flex-col">
                  <p className="text-gray-700 font-semibold text-sm">
                    {internalTab === 'movement' ? getMovementMessage(event) : getDoorMessage(event)}
                  </p>
                  <div className="flex items-center gap-2 text-gray-400 text-[11px] mt-1">
                    <div className="flex items-center gap-1">
                      <Clock size={10} />
                      <span>{event.occurred_at ? formatTime(event.occurred_at) : "نامشخص"}</span>
                    </div>
                    {event.is_aggregate && (
                      <div className="flex items-center gap-1 text-orange-400">
                        <WifiOff size={10} />
                        <span>داده‌های تجمیعی</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-left">
                <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">{event.device_code}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="bg-gray-50 p-4 rounded-full text-gray-300 mb-3"><Info size={32} /></div>
            <p className="text-gray-400 text-sm">هیچ رویدادی در این بخش یافت نشد.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsCard;