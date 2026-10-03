"use client";
import { toPersianNumbers } from "@/utils/toPersianNumber";
import React, { Dispatch, SetStateAction } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface StyledPaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  rowsPerPage?: number;
  pageSize: number;
  setPageSize: Dispatch<SetStateAction<number>>;
}

const StyledPagination: React.FC<StyledPaginationProps> = ({
  currentPage,
  totalPages,
  setCurrentPage,
  rowsPerPage = 10,
  pageSize,
  setPageSize,
}) => {
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2);
      pages.push("...");
      pages.push(totalPages - 1, totalPages);
    }
    return pages;
  };

  return (
    <div className=" flex items-center justify-between px-4">
      {/* Right */}
      <div className="py-4 w-full  border-gray-100 bg-white flex flex-row-reverse items-center justify-center sm:justify-between dir-ltr font-[vazirmatn]">
        {/* بخش سمت چپ: انتخاب تعداد ردیف */}
        <div className="hidden sm:block">
          {/* <div className="flex  items-center gap-2 border border-gray-300 rounded-lg px-3 py-1.5 text-gray-500 text-[13px] cursor-pointer hover:bg-gray-50 transition-colors select-none group">
          <span className="font-medium">
            {toPersianDigits(rowsPerPage)} ردیف
          </span>
        </div> */}
        </div>
        {/* بخش سمت راست: شماره صفحات و فلش‌ها */}
        <div className="flex items-center gap-1 ">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 text-gray-500 hover:text-gray-700  disabled:opacity-60 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <IoIosArrowForward />
          </button>
          <div className="flex items-center gap-1.5">
            {getPageNumbers().map((page, index) => {
              if (page === "...") {
                return (
                  <span
                    key={`dots-${index}`}
                    className="px-2 text-gray-300 select-none"
                  >
                    ...
                  </span>
                );
              }

              const isPageActive = currentPage === page;
              return (
                <button
                  key={`page-${page}`}
                  onClick={() => setCurrentPage(page as number)}
                  className={`w-9 h-9 border border-gray-200 flex items-center justify-center  cursor-pointer rounded-sm text-[14px] font-medium transition-all duration-300 ${
                    isPageActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-800 hover:bg-gray-50 hover:text-gray-600"
                  }`}
                >
                  {/* نمایش عدد به فارسی */}
                  {toPersianNumbers(page)}
                </button>
              );
            })}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="p-2 text-gray-500 hover:text-gray-700  disabled:opacity-60 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <IoIosArrowBack />
          </button>
        </div>
      </div>

      {/* left */}
      <div className="hidden sm:block ">
        <div className=" flex items-center w-full  ">
          <div className=" w-32 text-sm text-gray-500 font-nedium">
            تعداد در هر صفحه :
          </div>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border rounded-md px-1 text-smoutline-0"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default StyledPagination;
