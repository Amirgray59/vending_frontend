
"use client";
import React, { useMemo } from "react";
import { Gamepad2, TrendingUp, Calendar } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import useGetTransactions from "@/shared/hooks/useGetTransactions";
import useGetDeviceTransactions from "../hooks/useGetDeviceTransactions";
import { useParams } from "next/navigation";

const GameTab = () => {
  const { deviceId } = useParams();
  const { deviceTransactions, isGettingDeviceTransactions } = useGetDeviceTransactions(deviceId as string);
  const { isgettingTransactions, transactions } = useGetTransactions();

  // نام روزهای هفته به فارسی برای نمایش در نمودار
  const daysOfWeek = ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"];

  // ۱. محاسبه مجموع کل بازی‌ها
  const totalGames = useMemo(() => {
    if (!transactions?.items) return 0;
    return transactions.items.reduce((acc: number, item: any) => {
      return acc + (item.game_count || 0);
    }, 0);
  }, [transactions]);

  // ۲. آماده‌سازی داده‌ها برای نمودار (گروه‌بندی بر اساس روز هفته)
  const chartData = useMemo(() => {
    if (!transactions?.items) return [];

    // ایجاد یک آبجکت برای ذخیره تعداد بازی هر روز
    const countsByDay: Record<string, number> = {
      "شنبه": 0, "یکشنبه": 0, "دوشنبه": 0, "سه‌شنبه": 0, "چهارشنبه": 0, "پنجشنبه": 0, "جمعه": 0
    };

    transactions.items.forEach((item: any) => {
      if (item.occurred_at) {
        const date = new Date(item.occurred_at);
        // در جاوا اسکریپت getDay() 0 برای یکشنبه است
        const dayName = daysOfWeek[date.getDay()];
        countsByDay[dayName] += (item.game_count || 0);
      }
    });

    // تبدیل آبجکت به آرایه مورد نیاز Recharts
    // ترتیب نمایش را بر اساس لیست daysOfWeek تنظیم می‌کنیم
    return daysOfWeek.map(day => ({
      day: day,
      count: countsByDay[day]
    }));
  }, [transactions]);

  return (
    <div className="pt-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* بخش اول: کارت تعداد بازی‌ها */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 h-full flex flex-col justify-between relative overflow-hidden group transition-all hover:shadow-md">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-70 group-hover:bg-blue-100 transition-colors" />

            <div className="relative z-10">
              <h3 className="text-slate-500 text-sm font-medium mb-1">
                کل بازی‌های ثبت شده
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-800">
                  {totalGames.toLocaleString("fa-IR")}
                </span>
                <span className="text-slate-400 text-xs font-medium">بازی</span>
              </div>
            </div>

            <div className="mt-8 relative z-10 flex items-center gap-2 text-slate-400 text-xs">

              <Calendar size={14} />
              <span>به‌روزرسانی شده در لحظه</span>
            </div>
          </div>
        </div>

        {/* بخش دوم: نمودار تعداد بازی‌ها */}
        <div className="lg:col-span-2 w-full">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 h-full w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-slate-800 font-bold text-lg">
                تحلیل بازی‌های هفتگی
              </h3>
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>تعداد بازی</span>
              </div>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#94a3b8", fontSize: 12 }} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorCount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameTab;