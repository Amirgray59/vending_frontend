"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { TabsType } from "../Types";

// لیست تب‌ها دقیقاً مطابق ترتیب عکس از راست به چپ
const tabs = [
  { id: "overview", label: "نمای کلی" },
  { id: "payments", label: "پرداخت‌ها" },
  { id: "games", label: "بازی‌ها" },
  { id: "inventory", label: "موجودی" },
  { id: "events", label: "رویدادها" },
  { id: "repairs", label: "تعمیرات" },
  { id: "control-scheduling", label: "کنترل و زمان بندی" },
] as const;

interface NavigationTabsProps {
  // onChange?: (tabId: string) => void;
  activeTab: TabsType;
  setActiveTab: Dispatch<SetStateAction<TabsType>>;
}

const NavigationTabs = ({ activeTab, setActiveTab }: NavigationTabsProps) => {
  const handleTabClick = (tabId: TabsType) => {
    setActiveTab(tabId);
  };

  return (
    <div className="w-full  border-b mt-6 border-gray-200/80" dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex gap-8 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`
                  relative py-4 text-[14px] font-bold cursor-pointer md:px-4 whitespace-nowrap outline-none
                  ${
                    isActive
                      ? "text-blue-600 border-b-2 border-blue-600  font-extrabold"
                      : "text-slate-500 hover:text-slate-700 font-semibold"
                  }
                `}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default NavigationTabs;
