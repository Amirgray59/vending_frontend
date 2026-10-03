import React from "react";
import { FiUsers } from "react-icons/fi";
import { GoShieldCheck } from "react-icons/go";
import { IoClose, IoSettingsOutline } from "react-icons/io5";
import { LuEye, LuFileText } from "react-icons/lu";
import UseGetUserList from "../hooks/useGetUserList";

// دیتا برای لیست مجوزها
const permissions = [
  {
    id: 1,
    key: "device.view",
    title: "مشاهده لیست دستگاه‌ها و جزئیات آن‌ها",
    icon: "eye",
  },
  {
    id: 2,
    key: "report.export",
    title: "صدور گزارش‌ها در فرمت‌های مختلف",
    icon: "file",
  },
  {
    id: 3,
    key: "device_control.execute",
    title: "اجرای دستورات کنترل دستگاه‌ها",
    icon: "scan",
  },
  {
    id: 4,
    key: "user.manage",
    title: "مدیریت کاربران و نقش‌ها",
    icon: "users",
  },
  {
    id: 5,
    key: "settings.manage",
    title: "مدیریت تنظیمات سامانه",
    icon: "settings",
  },
];

const RoleDetails = () => {
  
  return (
    <div className="w-full  bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h2 className=" font-bold text-gray-800">جزئیات نقش</h2>
        <button className="">
          <IoClose className="text-gray-800" />
        </button>
      </div>

      {/* بخش معرفی نقش (مدیر سیستم) */}
      <div className="flex flex-col items-center mb-10">
        <div className="flex items-center gap-2 mb-3">
          {/* آیکون سپر بنفش */}
          <div className="w-14 h-14 rounded-full bg-[#E8E3F9] flex items-center justify-center text-[#7C3AED]">
            <GoShieldCheck className="text-3xl" />
          </div>
          <h1 className=" font-bold text-lg text-gray-800">مدیر سیستم</h1>
        </div>

        <p className="text-[14px] text-gray-400 font-medium">
          دسترسی کامل به تمام بخش‌های سامانه
        </p>
      </div>

      {/* عنوان بخش مجوزها */}
      <div className="text-right mb-4">
        <h3 className="text-[16px] font-bold text-[#1E293B]">مجوزهای نقش</h3>
      </div>

      {/* لیست کارت‌های مجوز */}
      <div className="space-y-3 mb-6">
        {permissions.map((perm) => (
          <div
            key={perm.id}
            className="flex items-center justify-start  gap-x-3 py-4 px-2 bg-white border border-gray-100 rounded-lg hover:border-purple-100 transition-all group"
          >
            {/* آیکون سمت راست کارت */}
            <div className="text-gray-800 group-hover:text-purple-500 transition-colors">
              {renderIcon(perm.icon)}
            </div>

            {/* متن‌های داخل کارت */}
            <div className="flex flex-col  text-right">
              <span className="text-sm font-bold text-[#334155] mb-1">
                {perm.key}
              </span>

              <span className="text-xs text-gray-500 font-medium">
                {perm.title}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* فوتر: تعداد مجوزها */}
      <div className="text-right mt-auto">
        <span className="text-[14px] font-bold text-[#2563EB]">
          تعداد مجوزها: ۱۲
        </span>
      </div>
    </div>
  );
};

// تابع کمکی برای رندر کردن آیکون‌ها
const renderIcon = (type: string) => {
  const props = {
    className: "h-6 w-6",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 1.5,
  };
  switch (type) {
    case "eye":
      return (
        <LuEye className="text-2xl"/>
      );
    case "file":
      return (
        <LuFileText className="text-2xl"/>
      );
    case "scan":
      return (
        <FiUsers className="text-2xl"/>
      );
    case "users":
      return (
        <svg {...props}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      );
    case "settings":
      return (
        <IoSettingsOutline className="text-2xl"/>
      );
    default:
      return null;
  }
};

export default RoleDetails;
