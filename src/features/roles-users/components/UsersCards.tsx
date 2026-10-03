
"use client";
import React, { useMemo } from "react";
import { FiUser } from "react-icons/fi";
import { GoShieldCheck } from "react-icons/go";
import { LiaUserCheckSolid } from "react-icons/lia";
import { LuHeadphones } from "react-icons/lu";
import UseGetUserList from "../hooks/useGetUserList";

const UserCards = () => {
  const { userList, isgettigUserList } = UseGetUserList();

  // ۱. محاسبه مقادیر واقعی بر اساس دیتای بک-اند (با شرط فعال بودن کاربر)
  const stats = useMemo(() => {
    const items = userList?.items || [];

    return {
      // فقط اپراتورهایی که is_active آنها true باشد
      operators: items.filter(
        (u: any) => u.is_active && u.role === "operator"
      ).length,
      
      // فقط مدیرانی که is_active آنها true باشد
      managers: items.filter(
        (u: any) =>
          u.is_active &&
          (u.role === "location_manager" || u.role === "super_admin")
      ).length,
      
      activeUsers: items.filter((u: any) => u.is_active === true).length,
      totalUsers: items.length,
    };
  }, [userList]);

  // ۲. تعریف ساختار کارت‌ها و متصل کردن مقادیر محاسبه شده به آن‌ها
  const cardsConfig = [
    {
      id: 1,
      title: "اپراتورها",
      value: stats.operators,
      iconType: "support",
      bgColor: "bg-[#EFF6FF]",
      iconColor: "text-[#2563EB]",
    },
    {
      id: 2,
      title: "مدیران",
      value: stats.managers,
      iconType: "shield",
      bgColor: "bg-[#F5F3FF]",
      iconColor: "text-[#7C3AED]",
    },
    {
      id: 3,
      title: "کاربران فعال",
      value: stats.activeUsers,
      iconType: "user-check",
      bgColor: "bg-[#E8F8F0]",
      iconColor: "text-[#10B981]",
    },
    {
      id: 4,
      title: "کل کاربران",
      value: stats.totalUsers,
      iconType: "user",
      bgColor: "bg-[#E8F8F0]",
      iconColor: "text-[#10B981]",
    },
  ];

  if (isgettigUserList) {
    return <div className="h-20 w-full animate-pulse bg-gray-100 rounded-lg" />; 
  }

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-4">
      {cardsConfig.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-lg border border-gray-100 p-4 flex items-center gap-x-3 justify-start shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)] transition-all duration-300"
        >
          <div className="h-full">
            <div className={`w-12 h-12 rounded-full ${item.bgColor} ${item.iconColor} flex items-center justify-center`}>
              {renderIcon(item.iconType)}
            </div>
          </div>

          <div className="flex flex-col items-start text-start">
            <span className="text-[13px] font-medium text-[#64748B] mb-2">
              {item.title}
            </span>
            <span className="text-xl font-bold text-[#0F172A] leading-none mb-2">
              {item.value}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-semibold">
              <span className="text-[#94A3B8]">بروزرسانی لحظه‌ای</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const renderIcon = (type: string) => {
  switch (type) {
    case "user": return <FiUser className="text-2xl" />;
    case "user-check": return <LiaUserCheckSolid className="text-2xl" />;
    case "shield": return <GoShieldCheck className="text-2xl" />;
    case "support": return <LuHeadphones className="text-2xl" />;
    default: return null;
  }
};

export default UserCards;