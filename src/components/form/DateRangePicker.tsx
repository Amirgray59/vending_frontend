
"use client";

import { Dispatch, SetStateAction, useState, useEffect } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persianFa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/layouts/mobile.css";
import { IoCalendarClearOutline } from "react-icons/io5";

interface DateFilterBase {
  fromDate?: string;
  toDate?: string;
}

interface Props<T extends DateFilterBase> {
  value?: any[];
  setFilterValues: Dispatch<SetStateAction<T>>;
}

export default function DateRangePicker<T extends DateFilterBase>({
  value = [],
  setFilterValues,
}: Props<T>) {
  // استیت داخلی برای مدیریت نمایش در DatePicker
  const [dates, setDates] = useState(value && value.length > 0 ? value : []);

  useEffect(() => {
    if (!value || value.length === 0) {
      setDates([]);
    }
  }, [value]);

  return (
    <div className="w-full ">
      <DatePicker
        range
        value={dates}
        onChange={(newDates: any) => {
          setDates(newDates);

          if (newDates && newDates.length === 2) {
            // 💡 تغییر حیاتی: تبدیل به ISO String میلادی برای ذخیره در استیت
            // متد toDate() مقدار را به آبجکت Date استاندارد JS تبدیل می‌کند و سپس toISOString میلادی می‌کند
            const fromISO = newDates[0].toDate().toISOString();
            const toISO = newDates[1].toDate().toISOString();

            setFilterValues(
              (prev) =>
                ({
                  ...prev,
                  fromDate: fromISO,
                  toDate: toISO,
                }) as T,
            );
          } else if (newDates && newDates.length === 0) {
            setFilterValues(
              (prev) =>
                ({
                  ...prev,
                  fromDate: "",
                  toDate: "",
                }) as T,
            );
          }
        }}
        containerClassName="w-full"
        className="w-full"
        calendar={persian}
        locale={persianFa}
        calendarPosition="bottom-right"
        render={(val, openCalendar) => {
          let displayText = "انتخاب بازه زمانی";

          // برای نمایش در UI همچنان از فرمت شمسی استفاده می‌کنیم تا کاربر گیج نشود
          if (dates && dates.length === 2) {
            displayText = `${dates[0].format("YYYY/MM/DD")} - ${dates[1].format("YYYY/MM/DD")}`;
          } else if (dates && dates.length === 1) {
            displayText = dates[0].format("YYYY/MM/DD");
          }

          return (
            <div
              className=" w-full group"
              dir="rtl"
              onClick={openCalendar}
            >

              <label className=" bg-white text-sm font-medium text-gray-800 transition-all mb-2 block">
                بازه زمانی
              </label>

              <div className="flex items-center gap-x-2 justify-between w-full px-4 py-3 bg-white border border-gray-100 rounded-lg shadow-xs cursor-pointer transition-all">
                <span className="text-sm font-medium text-[#1E293B] flex-1 text-center">
                  {displayText}
                </span>
                <span className="flex items-center justify-center">
                  <IoCalendarClearOutline className=" text-gray-500 text-lg" />
                </span>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}