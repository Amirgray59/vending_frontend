
"use client";

import React, { useState } from "react";
import { ChevronDown, User } from "lucide-react";
import Image from "next/image";
import { toPersianNumbers } from "@/utils/toPersianNumber";

import { FaBars, FaRegBell } from "react-icons/fa6";
import {
  IoClose,
  IoGameControllerOutline,
  IoHome,
  IoLocationOutline,
  IoStatsChart,
} from "react-icons/io5";
import { FiUsers } from "react-icons/fi";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LuWrench } from "react-icons/lu";
import { CiLogout } from "react-icons/ci";
import UseGetProfile from "@/shared/hooks/useGetProfile";

const links = [
  { id: 1, title: "داشبورد", href: "/dashboard", icon: <IoHome /> },
  { id: 2, title: "دستگاه ها", href: "/devices", icon: <IoGameControllerOutline /> },
  { id: 3, title: "مکان ها", href: "/places", icon: <IoLocationOutline /> },
  { id: 5, title: "هشدار ها ", href: "/alerts", icon: <FaRegBell /> },
  { id: 6, title: "گزارش مالی", href: "/financial-report", icon: <IoStatsChart /> },
  { id: 7, title: "کاربران و نقش ها", href: "/roles-users", icon: <FiUsers /> },
  { id: 8, title: "تعمیرات", href: "/repairs", icon: <LuWrench /> },
];

const roleOptions = [
  { id: "1", label: "مدیر کل", value: "super_admin" },
  { id: "2", label: "پشتیبانی فنی ", value: "technical_support" },
  { id: "3", label: "مدیر مجموعه", value: "location_manager" },
  { id: "4", label: "پشتیبانی مرکزی", value: "central_viewer" },
  { id: "5", label: "حسابدار", value: "accounting" },
  { id: "6", label: "اپراتور", value: "operator" },
];

const Header = () => {
  const [isShow, setIsShow] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const pathName = usePathname();
  const router = useRouter();
  const { isgettingprofile, profile } = UseGetProfile();

  const getRoleLabel = (roleValue: string) => {
    const role = roleOptions.find((opt) => opt.value === roleValue);
    return role ? role.label : "کاربر";
  };

  // --- منطق خروج (مشابه سایدبار) ---
  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  const handleLogout = () => {
    localStorage.clear();
    deleteCookie("auth_token");
    setIsLogoutModalOpen(false);
    setIsShow(false); // بستن منوی موبایل در صورت باز بودن
    router.push("/");
  };

  const UserProfile = () => {
    if (isgettingprofile) {
      return (
        <div className="flex items-center gap-3 animate-pulse">
          <div className="flex flex-col items-end gap-1">
            <div className="h-3 w-20 bg-gray-200 rounded" />
            <div className="h-2 w-12 bg-gray-100 rounded" />
          </div>
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
        </div>
      );
    }

    return (
      <div className="flex items-center gap-3">
        <div className="text-right flex flex-col items-end">
          <span className="text-sm font-bold text-gray-900 leading-none">
            {profile?.full_name || "کاربر "}
          </span>
          <span className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            {getRoleLabel(profile?.role)}
            <ChevronDown size={12} className="text-gray-400" />
          </span>
        </div>
        <div className="w-10 h-10 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400">
          <User size={20} />
        </div>
      </div>
    );

  };

  return (
    <>
      {/* Desktop Header */}
      <div className="hidden md:block">
        <header className="flex flex-col sm:flex-row items-center justify-between bg-white px-6 py-3 shadow-sm border-b border-gray-100 dir-rtl">
          <div className="flex items-center my-6">
            <h1 className="text-xl font-bold text-gray-800">
              سامانه مدیریت و کنترل وندینگ
            </h1>
          </div>
          <div className="flex items-center gap-6 border-r pr-2">
            <UserProfile />
          </div>
        </header>
      </div>

      {/* Mobile Header */}
      <div className="block md:hidden">
        <header className="flex justify-between items-center bg-white px-6 py-4 shadow-sm border-b border-gray-100 dir-rtl">
          <button onClick={() => setIsShow(true)} className="cursor-pointer">
            <FaBars className="text-xl text-gray-800" />
          </button>
          <div className="flex items-center gap-6 border-r pr-2">
            <UserProfile />
          </div>

          {isShow && (
            <aside className="fixed z-50 top-0 min-h-screen right-0 left-0 bg-linear-to-b from-[#04275F] to-[#033074] text-[#EEEEF2]">
              <div className="p-5 flex items-center justify-between">
                <img src="/icon.png" alt="logo" className="w-12 h-10 rounded-xl object-center" />
                <button onClick={() => setIsShow(false)} className="cursor-pointer">
                  <IoClose className="text-xl text-[#EEEEF2]" />
                </button>
              </div>
              <nav className="px-2">
                <ul className="flex flex-col h-full">
                  <div className="flex-grow">
                    {links.map((item) => (
                      <Link key={item.id} href={item.href} className="my-2" onClick={() => setIsShow(false)}>
                        <li className={`py-4 flex justify-between px-3 transition-colors ${pathName.startsWith(item.href) ? "bg-linear-to-r from-[#023BA0] to-[#033BA1] rounded-lg" : "hover:bg-white/10 rounded-lg"}`}>
                          <span className="flex text-xs items-center gap-x-4">
                            <span className="text-xl">{item.icon}</span>
                            <span>{item.title}</span>
                          </span>
                          {item.title === "هشدار ها " && (
                            <div className="bg-[#FE6006] text-xs h-5 w-5 flex items-center justify-center rounded-full">
                              {toPersianNumbers(7)}
                            </div>
                          )}
                        </li>
                      </Link>
                    ))}
                  </div>

                  {/* دکمه خروج در منوی موبایل */}
                  <div className="mt-auto mb-8">
                    <button 
                      onClick={() => {
                        setIsLogoutModalOpen(true);
                        setIsShow(false); // بستن منو برای نمایش مودال
                      }} 
                      className="w-full py-4 px-3 flex items-center gap-x-4 text-[#EEEEF2] transition-all hover:bg-red-500/20 hover:text-red-500 rounded-lg group"
                    >
                      <span className="text-xl group-hover:text-red-500 transition-colors">
                        <CiLogout />
                      </span>
                      <span className="text-xs group-hover:text-red-500 transition-colors">خروج</span>
                    </button>
                  </div>
                </ul>
              </nav>
            </aside>
          )}
        </header>
      </div>

      {/* مودال تایید خروج (مشترک برای هر دو حالت) */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl text-center animate-in fade-in zoom-in duration-200">

            <h3 className="text-gray-800 font-bold text-lg mb-2">آیا می‌خواهید خارج شوید؟</h3>

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
};

export default Header;