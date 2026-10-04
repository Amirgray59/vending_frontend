"use vlient"
import useGetDeviceDetail from "@/shared/hooks/useGetDeviceDetail";
import { Store } from "lucide-react";
import { useParams } from "next/navigation";
import { FiBox } from "react-icons/fi";
import { IoLocationOutline, IoWifi } from "react-icons/io5";
import { LuWallet } from "react-icons/lu";
import { getDeviceStatusInfo } from "@/utils/deviceStatus";

const VendingMachineCard = () => {
  const { deviceId } = useParams();
  const { device, isGettingDevice } = useGetDeviceDetail(deviceId as string);

  

  // تابع کمکی برای فرمت اعداد
  const formatNumber = (num: number) => num?.toLocaleString("fa-IR") || "۰";

  // تابع تبدیل تاریخ ISO به فرمت خواندنی (مثلاً: امروز ۱۰:۰۰)
  const formatDateTime = (isoDate: string) => {
    if (!isoDate) return "---";
    const date = new Date(isoDate);
    return date.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });
  };

  const deviceStatus = getDeviceStatusInfo(device?.status);
  const activeStatusColor = device?.is_active
    ? "bg-green-100 text-green-600"
    : "bg-gray-100 text-gray-600";

  // --- بخش اسکلتون (Skeleton) ---
  if (isGettingDevice) {
    return (
      <div className="w-full bg-white border border-gray-100 rounded-lg shadow-sm p-4 mt-4 animate-pulse">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-gray-100">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex flex-col items-center justify-center gap-2 w-full md:w-auto py-4 md:py-0 md:px-4">
              <div className="h-4 w-20 bg-gray-200 rounded-full"></div>
              <div className="h-6 w-24 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!device) return null;

  return (
    <div
      dir="rtl"
      className="w-full bg-white border border-gray-100 rounded-lg shadow-sm p-4 mt-4"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-gray-100">

        {/* بخش اول: اطلاعات اصلی دستگاه */}
        <div className="flex items-center gap-4 w-full md:w-auto pb-4 md:pb-0 md:pl-6">
          <div className="bg-blue-50 p-3 rounded-full text-blue-600">
            <Store size={28} />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-800 text-lg text-nowrap">
                {device.name}
              </h3>
              <span className={`text-xs px-2 py-1 rounded-md flex items-center gap-1 ${deviceStatus.badgeClass}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${deviceStatus.dotClass}`}></span>
                {deviceStatus.label}
              </span>
            </div>
            <p className="text-gray-400 text-xs">کد دستگاه: {device.device_code}</p>
          </div>
        </div>

        {/* بخش دوم: وضعیت دستگاه (بر اساس فیلد status) */}
        <div className="flex flex-col items-center gap-2 w-full md:w-auto py-4 md:py-0 md:px-4">
          <span className="text-gray-400 text-xs text-nowrap">وضعیت دستگاه</span>
          <span className={`px-4 py-1 rounded-md text-sm font-medium ${activeStatusColor}`}>
            {device.is_active ? 'فعال' : 'غیرفعال'}
          </span>
        </div>

        {/* بخش سوم: آخرین اتصال */}
        <div className="flex flex-col items-center gap-2 w-full md:w-auto py-4 md:py-0 md:px-4 text-center">
          <span className="text-gray-400 text-xs text-nowrap">آخرین اتصال</span>
          <div className="flex items-center gap-1.5 text-gray-700 text-sm font-semibold">
            <span className={`w-2 h-2 rounded-full ${deviceStatus.dotClass}`}></span>
            <span className="text-nowrap text-xs">{formatDateTime(device.last_seen_at)}</span>
          </div>
        </div>

        {/* بخش چهارم: هارت‌بیت */}
        <div className="flex flex-col items-center gap-2 w-full md:w-auto py-4 md:py-0 md:px-4 text-center">
          <span className="text-gray-400 text-xs">آخرین هارت‌بیت</span>
          <div className="flex items-center gap-2 text-gray-700 text-sm font-semibold">
            <IoWifi className="text-green-600 text-xl" />
            <span className="text-nowrap text-xs">{formatDateTime(device.last_heartbeat_at)}</span>
          </div>
        </div>

        {/* بخش پنجم: مکان */}
        <div className="flex flex-col items-center gap-2 w-full md:w-auto py-4 md:py-0 md:px-4 text-center">
          <span className="text-gray-400 text-xs">مکان</span>
          <div className="flex items-center gap-1 text-gray-700 text-sm font-semibold">
            <IoLocationOutline className="text-gray-600 text-xl" />
            <span className="text-xs">{device.location_name}</span>
          </div>
        </div>

        {/* بخش ششم: درآمد امروز */}
        <div className="flex items-center justify-center gap-4 w-full md:w-auto py-4 md:py-0 md:px-4">
          <div className="bg-purple-50 p-2.5 rounded-xl text-purple-600">
            <LuWallet />
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-gray-400 text-xs">درآمد امروز</span>
            <span className="text-gray-800 font-bold text-xs">
              {formatNumber(device.today_income)} تومان
            </span>
          </div>
        </div>

        {/* بخش هفتم: موجودی فعلی */}
        <div className="flex items-center justify-center gap-4 w-full md:w-auto pt-4 md:pt-0 md:pr-6">
          <div className="bg-orange-50 p-2.5 rounded-xl text-orange-500">
            <FiBox />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-gray-400 text-xs">موجودی فعلی</span>
            <span className="text-gray-800 font-bold text-xs">
              {formatNumber(device.inventory_level)} عدد
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendingMachineCard;
