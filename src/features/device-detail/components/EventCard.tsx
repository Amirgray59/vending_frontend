"use client";

import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  Move,
  DoorOpen,
  Clock,
  Info,
  WifiOff,
  Gift,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useGetMovementEvents } from "@/features/events/hooks/useGetMovementEvents";
import { useGetDoorEvents } from "@/features/events/hooks/useGetDoorEvents";
import { useGetRewardEvents } from "@/features/events/hooks/useGetRewardEvents";

interface EventsCardProps {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<any>>;
}

type EventCategory = "movement" | "door" | "reward";

const EventsCard = ({ activeTab, setActiveTab }: EventsCardProps) => {
  const { deviceId } = useParams();
  const id = Array.isArray(deviceId) ? deviceId[0] : deviceId;
  const [internalTab, setInternalTab] = useState<EventCategory>("movement");
  const loadAll = activeTab === "events";

  const { movementEvents, isGettingMovementEvents } = useGetMovementEvents(
    id,
    loadAll,
  );
  const { doorEvents, isGettingDoorEvents } = useGetDoorEvents(id, loadAll);
  const { rewardEvents, isGettingRewardEvents } = useGetRewardEvents(id, loadAll);

  const formatTime = (isoDate?: string) => {
    if (!isoDate) return "---";
    try {
      return new Date(isoDate).toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "---";
    }
  };

  const getAggregatePrefix = (item: any) =>
    item.is_aggregate ? "📦 (پس از بازگشت به شبکه): " : "";

  const getDoorMessage = (item: any) => {
    const statusPrefix = getAggregatePrefix(item);

    if (item.alarm_type === 3) {
      return statusPrefix + "هشدار: درب برای مدت طولانی باز مانده است";
    }
    if (item.alarm_type === 1 && item.open_count > 0) {
      return statusPrefix + "درب باز شد (" + item.open_count + " بار)";
    }
    if (item.alarm_type === 2 && item.close_count > 0) {
      return statusPrefix + "درب بسته شد (" + item.close_count + " بار)";
    }
    return statusPrefix + "تغییر وضعیت درب";
  };

  const getMovementMessage = (item: any) => {
    const statusPrefix = getAggregatePrefix(item);

    if (item.level === 2) {
      return statusPrefix + "هشدار: لرزش یا جابه‌جایی شدید دستگاه";
    }
    if (item.level === 1) {
      return statusPrefix + "دستگاه تکان خورد (جابه‌جایی جزئی)";
    }
    return statusPrefix + "رویداد جابه‌جایی";
  };

  const getRewardMessage = (item: any) => {
    const statusPrefix = getAggregatePrefix(item);
    const delta = Number(item.delta ?? 0).toLocaleString("fa-IR");
    const total = Number(item.total_number_of_rewards ?? 0).toLocaleString(
      "fa-IR",
    );

    return statusPrefix + "جایزه جدید: " + delta + " (مجموع جوایز: " + total + ")";
  };

  if (
    isGettingMovementEvents ||
    isGettingDoorEvents ||
    isGettingRewardEvents
  ) {
    return (
      <div className="w-full bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-full animate-pulse">
        <div className="h-12 w-full bg-gray-100 rounded-lg mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-16 w-full bg-gray-50 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const currentData =
    internalTab === "movement"
      ? movementEvents?.items ?? []
      : internalTab === "door"
        ? doorEvents?.items ?? []
        : rewardEvents?.items ?? [];
  const visibleData = loadAll ? currentData : currentData.slice(0, 5);
  const EventIcon =
    internalTab === "movement"
      ? Move
      : internalTab === "door"
        ? DoorOpen
        : Gift;
  const eventIconStyles =
    internalTab === "movement"
      ? "bg-indigo-50 text-indigo-500"
      : internalTab === "door"
        ? "bg-emerald-50 text-emerald-500"
        : "bg-amber-50 text-amber-500";

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-gray-800 font-bold text-lg">تاریخچه رویدادها</h3>
        {activeTab === "overview" && (
          <button
            onClick={() => setActiveTab("events")}
            className="text-blue-500 text-xs font-semibold cursor-pointer"
          >
            مشاهده همه
          </button>
        )}
      </div>

      <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
        <button
          onClick={() => setInternalTab("movement")}
          className={
            "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all " +
            (internalTab === "movement"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700")
          }
        >
          <Move size={14} /> جابه‌جایی‌ها
        </button>
        <button
          onClick={() => setInternalTab("door")}
          className={
            "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all " +
            (internalTab === "door"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700")
          }
        >
          <DoorOpen size={14} /> رویدادهای درب
        </button>
        <button
          onClick={() => setInternalTab("reward")}
          className={
            "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all " +
            (internalTab === "reward"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700")
          }
        >
          <Gift size={14} /> جایزه‌ها
        </button>
      </div>

      <div className="space-y-3">
        {visibleData.length > 0 ? (
          visibleData.map((event: any, index: number) => (
            <div
              key={event.id || index}
              className="flex items-center justify-between p-3 rounded-xl border border-gray-50 bg-gray-50/50 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={"p-2 rounded-full " + eventIconStyles}>
                  <EventIcon size={16} />
                </div>
                <div className="flex flex-col">
                  <p className="text-gray-700 font-semibold text-sm">
                    {internalTab === "movement"
                      ? getMovementMessage(event)
                      : internalTab === "door"
                        ? getDoorMessage(event)
                        : getRewardMessage(event)}
                  </p>
                  <div className="flex items-center gap-2 text-gray-400 text-[11px] mt-1">
                    <div className="flex items-center gap-1">
                      <Clock size={10} />
                      <span>{formatTime(event.occurred_at)}</span>
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
                <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">
                  {event.device_code}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="bg-gray-50 p-4 rounded-full text-gray-300 mb-3">
              <Info size={32} />
            </div>
            <p className="text-gray-400 text-sm">
              در این بخش رویدادی برای این دستگاه ثبت نشده است.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsCard;
