
"use client";

import { GrTransaction } from "react-icons/gr";
import { IoGameControllerOutline } from "react-icons/io5";
import { LuWallet } from "react-icons/lu";
import { useMemo } from "react";

// تابع کمکی برای فرمت کردن اعداد به صورت سه رقم سه رقم (مثلاً: 12,450,000)
const formatNumber = (num: number) => {
  return num.toLocaleString("fa-IR");
};

const StatCard = ({
  title,
  value,
  unit,
  icon: Icon,
  iconBg,
  iconColor,
}: any) => (
  <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm flex flex-col items-center justify-between relative overflow-hidden">
    <div className="w-full flex justify-between items-start mb-2">
      <div className={`p-3 rounded-full ${iconBg} ${iconColor}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1 text-center">
        <p className="text-gray-700 text-sm font-bold mb-2">{title}</p>
        <h3 className="text-[#1e293b] text-xl font-bold dir-ltr tracking-tight">
          {value}
        </h3>
        <p className="text-gray-400 text-[10px] mt-1">{unit}</p>
      </div>
    </div>
  </div>
);

// اضافه کردن prop برای دریافت دیتای فیلتر شده
export default function ReportsCardsSection({ filteredData = [] }: { filteredData: any[] }) {
  
  // استفاده از useMemo برای محاسبات تا با هر رندر دوباره محاسبه نشوند
  const stats = useMemo(() => {
    // ۱. محاسبه مجموع درآمد (جمع فیلد total از تمام تراکنش‌ها)
    const totalIncome = filteredData.reduce((sum, item) => sum + (item.total || 0), 0);

    // ۲. محاسبه مجموع بازی‌ها (جمع فیلد amount از تمام تراکنش‌ها)
    const totalGames = filteredData.reduce((sum, item) => sum + (item.game_count || 0), 0);

    // ۳. تعداد کل تراکنش‌ها (تعداد آیتم‌های آرایه)
    const totalTransactions = filteredData.length;

    return [
      {
        title: "درآمد کل",
        value: formatNumber(totalIncome),
        unit: "تومان",
        icon: LuWallet,
        iconBg: "bg-[#E8DEFE]",
        iconColor: "text-[#3611A4]",
      },
      {
        title: "تعداد بازی",
        value: formatNumber(totalGames),
        unit: "بازی",
        icon: IoGameControllerOutline,
        iconBg: "bg-[#E1EFFF]",
        iconColor: "text-[#3D6BC5]",
      },
      {
        title: "تعداد تراکنش",
        value: formatNumber(totalTransactions),
        unit: "عدد",
        icon: GrTransaction,
        iconBg: "bg-[#FFE7D4]",
        iconColor: "text-[#EF7E2B]",
      },
    ];
  }, [filteredData]);

  return (
    <div className=" mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div key={index}>
          <StatCard {...stat} />
        </div>
      ))}
    </div>
  );
}
