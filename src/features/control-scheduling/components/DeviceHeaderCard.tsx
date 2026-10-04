
"use client"

import useGetDeviceDetail from "@/shared/hooks/useGetDeviceDetail";
import { useParams } from "next/navigation";

export default function DeviceHeaderCard() {
  const { deviceId } = useParams();
  const { device, isGettingDevice } = useGetDeviceDetail(deviceId as string);

  // Helper function to format ISO date to a readable Persian string using native JS Intl API
  const formatLastSeen = (dateString: string | undefined) => {
    if (!dateString) return "Unknown";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("fa-IR", {
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (e) {
      return "Error in date";
    }
  };

  // Loading state: Render a skeleton while data is being fetched
  if (isGettingDevice) {
    return <div className="w-full h-24 animate-pulse bg-gray-100 rounded-lg" />;
  }

  return (
    <div className="w-full h-full" dir="rtl">
      <div className="bg-white rounded-lg h-full border border-gray-100 p-5 shadow-sm flex flex-col sm:flex-row items-stretch gap-6 lg:gap-4">
        <div className="flex flex-col sm:flex-row gap-x-4">
          {/* Device Image Section */}
          <div className="bg-[#F3F4F6] rounded-lg overflow-hidden flex items-center justify-center border border-gray-100 w-32 h-32 shrink-0">
            <img
              src="/devices/device1.png"
              alt={device?.name || "Vending Machine"}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Main Information Section */}
          <div className="flex flex-col sm:flex-row mt-8 sm:mt-0 items-center gap-5 justify-between lg:justify-start">
            <div className="flex-1 text-center sm:text-right">
              <h2 className="text-[17px] font-bold text-[#0F172A] mb-1">
                {device?.name || "Unknown Device"}
              </h2>
              <div className="text-xs font-bold text-gray-500 space-y-1 mb-3">
                <p>
                  <span className="text-gray-400">مکان:</span> {device?.location_name || "Unknown"}
                </p>
                <p>
                  <span className="text-gray-400">آخرین آنلاین:</span>
                  <span className="text-[#9CA3AF] mr-1">
                    {formatLastSeen(device?.last_seen_at)}
                  </span>
                </p>
              </div>

            </div>

            <div className="flex items-center px-2">
              <div className="flex flex-col items-center justify-center lg:text-right px-2">
                <span className="text-xs text-gray-500 font-bold mb-1.5">
                  وضعیت فعلی
                </span>
                {/* Active/Inactive status based on is_active field */}
                <span className={`text-[13px] font-bold ${device?.is_active ? "text-[#10B981]" : "text-red-500"}`}>
                  {device?.is_active ? "فعال" : "غیرفعال"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}