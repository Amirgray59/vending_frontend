
"use client"
import React from "react";
import { Wallet, CreditCard, Gamepad2, TrendingUp } from "lucide-react";
import { useParams } from "next/navigation";
import useGetDeviceDetail from "@/shared/hooks/useGetDeviceDetail";

interface MetricCardProps {
  label: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

const MetricCard = ({ label, value, unit, icon, iconBg, iconColor }: MetricCardProps) => (
  <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 ml-1 rounded-full ${iconBg} ${iconColor}`}>
        {icon}
      </div>
      <div className="text-right flex flex-col justify-between">
        <div className="text-gray-500 text-sm font-medium mb-1">{label}</div>
        <div className="text-gray-800 text-xl font-bold">{value}</div>
        <div className="text-gray-400 text-xs mt-1">{unit}</div>
      </div>
    </div>
  </div>
);

const KeyMetrics = () => {
  const { deviceId } = useParams();
  const { device, isGettingDevice } = useGetDeviceDetail(deviceId as string);

  

  // تابع فرمت اعداد به فارسی (مثلاً 1250000 -> ۱,۲۵۰,۰۰۰)
  const formatNumber = (num: any) => {
    if (num === undefined || num === null) return "۰";
    return Number(num).toLocaleString("fa-IR");
  };

  // محاسبه داینامیک میانگین ارزش پرداخت
  // فرمول: کل درآمد / تعداد کل خریدها
  const calculateAvgPayment = () => {
    const totalIncome = device?.total_income || 0;
    const totalPurchases = device?.total_purchases || 0;
    if (totalPurchases === 0) return "۰";
    return formatNumber(totalIncome / totalPurchases);
  };

  // متصل کردن دیتای API به کارت‌ها
  const metricsData = [
    {
      label: "تعداد پرداخت‌ها",
      value: formatNumber(device?.total_purchases),
      unit: "تراکنش",
      icon: <CreditCard size={24} />,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      label: "درآمد امروز",
      value: formatNumber(device?.today_income),
      unit: "تومان",
      icon: <Wallet size={24} />,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-500",
    },
    {
      label: "میانگین ارزش پرداخت",
      value: calculateAvgPayment(),
      unit: "تومان",
      icon: <TrendingUp size={24} />,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
    },
    {
      label: "تعداد جایزه‌ها", // بر اساس دیتای شما total_rewards جایگزین شد
      value: formatNumber(device?.total_rewards),
      unit: "جایزه",
      icon: <Gamepad2 size={24} />,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
  ];

  // --- نمایش Skeleton در هنگام لودینگ ---
  if (isGettingDevice) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-sm h-full border border-gray-100 animate-pulse">
        <div className="h-6 w-32 bg-gray-200 rounded mb-6 mr-auto ml-auto text-right"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-100 h-24 flex justify-between items-center">
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
              <div className="flex flex-col gap-2 w-1/3 items-end">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm h-full border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-gray-800 text-lg font-bold">شاخص‌های کلیدی</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metricsData.map((item, index) => (
          <MetricCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default KeyMetrics;