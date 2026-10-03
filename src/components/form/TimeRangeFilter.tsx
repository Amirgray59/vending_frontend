"use client";

import React, { Dispatch, SetStateAction } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";

// تعریف ساختاری که حتما startTime و endTime را داشته باشد
interface TimeFilterState {
  startTime: DateObject | "";
  endTime: DateObject | "";
  [key: string]: any; // در صورت وجود فیلدهای دیگر در آبجکت شما
}

// مقید کردن T به ساختار بالا
interface TimeRangeFilterProps<T extends TimeFilterState> {
  filterValues: T;
  setFilterValues: Dispatch<SetStateAction<T>>;
}

export default function TimeRangeFilter<T extends TimeFilterState>({
  filterValues,
  setFilterValues,
}: TimeRangeFilterProps<T>) {
  
  return (
    <div className="w-full">
      <label htmlFor="" className="mb-2 block text-sm">
        بازه ساعتی
      </label>
      <div
        className="flex items-center justify-center border border-gray-100 shadow-xs rounded-lg h-[46] px-4 gap-x-4"
        dir="rtl"
      >
        {/* زمان شروع */}
        <div className="flex items-center gap-x-2">
          <span className="text-sm text-gray-700 whitespace-nowrap">
            از ساعت:
          </span>
          <DatePicker
            disableDayPicker
            format="HH:mm"
            value={filterValues.startTime}
            onChange={(date: DateObject) =>
              // اصلاح شد: startTime آپدیت می‌شود
              setFilterValues((prev) => ({ ...prev, startTime: date }))
            }
            plugins={[<TimePicker hideSeconds key="start-time" />]}
            placeholder="۰۰:۰۰"
            className="w-44! flex! justify-center! "
            inputClass="w-16 xl:w-24 rounded-md border border-gray-100 bg-white px-3 py-2 h-7 text-sm text-center shadow-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>

        <span className="text-gray-400">-</span>

        {/* زمان پایان */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700 whitespace-nowrap">تا:</span>
          <DatePicker
            disableDayPicker
            format="HH:mm"
            plugins={[<TimePicker hideSeconds key="end-time" />]}
            value={filterValues.endTime}
            onChange={(date: DateObject) =>
              setFilterValues((prev) => ({ ...prev, endTime: date }))
            }
            placeholder="۲۳:۵۹"
            className="w-44! flex! justify-center! "
            inputClass="w-16 xl:w-24 rounded-md border border-gray-100 bg-white px-3 h-7 text-sm text-center shadow-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
