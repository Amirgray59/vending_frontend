
"use client";

import DateRangePicker from "@/components/form/DateRangePicker";
import SelectInput from "@/components/form/SelectInput";
import ElegantTimePicker from "@/components/form/TimeRangeFilter";
import { Dispatch, SetStateAction } from "react";
import { DateObject } from "react-multi-date-picker";

interface OptionItem {
  id: string;
  name: string;
}

interface OptionsMap {
  [key: string]: {
    title: string;
    options: OptionItem[];
  };
}

interface TimeFilterState {
  startTime: DateObject | string | "";
  endTime: DateObject | string | "";
  [key: string]: any;
}

interface DateFilterBase {
  fromDate?: string;
  toDate?: string;
}

interface ChangeHandlerEvent {
  target: {
    name: string;
    value: string;
  };
}

// 💡 تغییر حیاتی: Props را هم Generic می‌کنیم تا با T در کامپوننت یکی باشد
interface ReportsFilterContainerProps<T> {
  filterValues: T;
  className: string;
  optionsMap: OptionsMap;
  handleInputChange: (e: ChangeHandlerEvent) => void;
  setFilterValues: Dispatch<SetStateAction<T>>;
}

export default function ReportsFilterContainer<
  T extends DateFilterBase & TimeFilterState,
>({
  filterValues,
  className,
  handleInputChange,
  optionsMap,
  setFilterValues,
}: ReportsFilterContainerProps<T>) {
  return (
    <div className={`${className}`}>
      <div className="col-span-12 sm:col-span-6 xl:col-span-4 ">
        <DateRangePicker
          value={
            filterValues.fromDate
              ? [filterValues.fromDate, filterValues.toDate]
              : []
          }
          // استفاده از any برای قطع کردن زنجیره خطای Generic
          setFilterValues={setFilterValues as any} 
        />
      </div>
      <div className="col-span-12 sm:col-span-6 xl:col-span-4 flex justify-center">
        <ElegantTimePicker
          // 💡 اینجا را به any تغییر دادیم تا با TimeFilterState تداخل نکند
          setFilterValues={setFilterValues as any}
          filterValues={filterValues as any} 
        />
      </div>

      {Object.entries(optionsMap).map(([key, value]) => {
        return (
          <div key={key} className="col-span-12 sm:col-span-6 xl:col-span-2">
            <SelectInput
              name={key}
              title={value.title}
              options={value.options}
              filterValues={filterValues as any}
              handleChange={handleInputChange}
            />
          </div>
        );
      })}
    </div>
  );
}