
"use client";

import React, { useState } from "react";
import useGetAlertList from "@/features/alerts/hooks/useGetAlertList";
import { toPersianNumbers } from "@/utils/toPersianNumber";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaRegBell } from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";
import {
  IoHome,
  IoLocationOutline,
  IoGameControllerOutline,
  IoStatsChart,
} from "react-icons/io5";
import { LuWrench } from "react-icons/lu";
import { CiLogout } from "react-icons/ci";

const links = [
  { id: 1, title: "داشبورد", href: "/dashboard", icon: <IoHome /> },
  { id: 2, title: "دستگاه ها", href: "/devices", icon: <IoGameControllerOutline /> },
  { id: 3, title: "مکان ها", href: "/places", icon: <IoLocationOutline /> },
  { id: 5, title: "هشدار ها ", href: "/alerts", icon: <FaRegBell /> },
  { id: 6, title: "گزارش مالی", href: "/financial-report", icon: <IoStatsChart /> },
  { id: 7, title: "کاربران و نقش ها", href: "/roles-users", icon: <FiUsers /> },
  { id: 8, title: "تعمیرات", href: "/repairs", icon: <LuWrench /> },
];

export default function Sidebar() {
  const pathName = usePathname();
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const { alertList, isGettingAlertsList } = useGetAlertList();
  const alertCount = alertList?.items?.filter((item:any)=>item.resolved===false).length || 0;

  // --- تابع پاکسازی کوکی ---
  const deleteCookie = (name: string) => {
    // تنظیم تاریخ انقضا روی گذشته برای حذف فوری کوکی
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  const handleLogout = () => {
    // ۱. پاکسازی لوکال استوریج
    localStorage.clear(); 

    // ۲. حذف کوکی توکن
    deleteCookie("auth_token");

    // ۳. بستن مودال و هدایت کاربر
    setIsLogoutModalOpen(false);
    router.push("/"); 
  };

  return (
    <>
      <aside className="h-screen sidebar-width fixed top-0 right-0 bottom-0 md:w-[130px] lg:w-[170px] bg-linear-to-b from-[#04275F] to-[#033074] text-[#EEEEF2]">
        <div className="p-5">
          <img src="/icon.png" alt="logo" className="w-12 h-10 rounded-xl object-center" />
        </div>
        <nav className="px-2">
          <ul className="flex flex-col h-full">
            <div className="flex-grow">
              {links.map((item) => (
                <Link key={item.id} href={item.href} className="my-4">
                  <li
                    className={`py-4 flex justify-between px-3 transition-colors cursor-pointer ${
                      pathName.startsWith(item.href) 
                        ? "bg-linear-to-r from-[#023BA0] to-[#033BA1] rounded-lg" 
                        : "hover:bg-blue-800/40 rounded-lg"
                    }`}
                  >
                    <span className="flex items-center gap-x-4">
                      <span className="text-sm lg:text-xl">{item.icon}</span>
                      <span className="text-xs lg:text-[16px]">{item.title}</span>
                    </span>

                    {item.title === "هشدار ها " && (
                      <div className="relative h-5 w-5 flex items-center justify-center">
                        {isGettingAlertsList ? (
                          <div className="bg-gray-400 animate-pulse h-5 w-5 rounded-full"></div>

                        ) : alertCount > 0 ? (
                          <div className="bg-[#FE6006] text-white text-[10px] h-5 w-5 flex items-center justify-center rounded-full shadow-sm">
                            {toPersianNumbers(alertCount)}
                          </div>
                        ) : null}
                      </div>
                    )}
                  </li>
                </Link>
              ))}
            </div>

            <div className="mt-auto mb-4">
              <button 
                onClick={() => setIsLogoutModalOpen(true)}
                className="w-full py-4 px-3 flex items-center gap-x-4 transition-all duration-200 hover:bg-red-500/20 group"
              >
                <span className="text-sm lg:text-xl transition-colors group-hover:text-red-600">
                  <CiLogout />
                </span>
                <span className="text-xs lg:text-[16px] transition-colors group-hover:text-red-600">
                  خروج
                </span>
              </button>
            </div>
          </ul>
        </nav>
      </aside>

      {/* مودال تایید خروج */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl text-center animate-in fade-in zoom-in duration-200">
            <h3 className="text-gray-800 font-bold text-lg mb-2">آیا می‌خواهید خارج شوید؟</h3>
            <p className="text-gray-500 text-sm mb-6">با خروج از حساب، تمامی نشست‌های شما پایان می‌یابد.</p>

            <div className="flex gap-3 justify-center">
              <button 
                onClick={handleLogout}
                className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-md shadow-red-200"
              >
                خروج
              </button>
              <button 
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-6 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}