
import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { TabsType } from "../Types";
import StyledPagination from "@/components/ui/Pagination";
import useGetDeviceTransactions from "../hooks/useGetDeviceTransactions";
import { useParams } from "next/navigation";
import { formatToPersianDate } from "@/utils/formatToPersianDate";

interface RecentActivitiesTableProps {
  activeTab: TabsType;
  setActiveTab: Dispatch<SetStateAction<TabsType>>;
}

// کامپوننت اسکلتون برای ردیف‌های جدول
const SkeletonRow = () => (
  <tr className="border-b border-gray-50">
    {[...Array(5)].map((_, i) => (
      <td key={i} className="px-6 py-4">
        <div className="h-5 bg-gray-100 animate-pulse rounded-md w-full"></div>
      </td>
    ))}
  </tr>
);

const RecentActivitiesTable = ({
  activeTab,
  setActiveTab,
}: RecentActivitiesTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const { deviceId } = useParams();

  const { deviceTransactions, isGettingDeviceTransactions } =
    useGetDeviceTransactions(deviceId as string);

    

  const items = deviceTransactions?.items || [];

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1)*  pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }, [currentPage, pageSize, items]);

  const totalPages = Math.ceil(items.length / pageSize);

  return (
    <div className="w-full bg-white p-4 rounded-lg border border-gray-100 shadow-sm overflow-hidden">
      {/* هدر جدول */}
      <div className="flex justify-between items-center p-4 border-b border-gray-50">
        <h3 className="text-[#1e293b] font-bold text-base">
          آخرین پرداخت ها و بازی‌ها
        </h3>
        {activeTab === "overview" && (
          <button
            onClick={() => setActiveTab("payments")}
            className="text-[#3b82f6] text-xs font-bold cursor-pointer"
          >
            مشاهده همه
          </button>
        )}
      </div>

      {/* محتوای جدول */}
      <div className="overflow-x-auto">
        <table className="w-full text-right min-w-xl border-collapse">
          <thead className=" bg-[#F9FAFC] rounded-t-lg">
            <tr className="text-[#94a3b8] text-[13px] font-medium border-b border-gray-50">
              <th className="px-6 py-4 font-medium">تاریخ</th>
              <th className="px-6 py-4 font-medium">زمان</th>
              <th className="px-6 py-4 font-medium text-center">مبلغ</th>
              <th className="px-6 py-4 font-medium text-center">وضعیت</th>
              <th className="px-6 py-4 font-medium text-center">تعداد بازی</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {/* وضعیت اول: در حال لودینگ (اسکلتون) */}
            {isGettingDeviceTransactions ? (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : items.length > 0 ? (
              // وضعیت دوم: داده‌ها موجود هستند
              paginatedData.map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-[#475569] text-sm font-medium">

                    {formatToPersianDate(item.occurred_at)}
                  </td>
                  <td className="px-6 py-4 text-[#475569] text-sm font-medium">
                    {new Date(item.occurred_at).toLocaleTimeString('fa-IR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 text-[#475569] text-sm font-bold text-center">
                    {item.total?.toLocaleString()} تومان
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 bg-green-50 text-green-600 text-[12px] font-bold rounded-md">
                      موفق
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#475569] text-sm font-medium text-center">
                    {item.game_count || 0}
                  </td>
                </tr>
              ))
            ) : (
              // وضعیت سوم: لودینگ تمام شده اما لیستی وجود ندارد
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-400 text-sm italic">
                  تراکنشی وجود ندارد.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Section */}
        {activeTab === "payments" && items.length > 0 && (
          <div className="mt-4">
            <StyledPagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              setPageSize={setPageSize}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivitiesTable;