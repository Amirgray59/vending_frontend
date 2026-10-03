"use client";
import { LuFilter } from "react-icons/lu";
import SelectInput from "../form/SelectInput";
import UseGetLocations from "@/shared/hooks/useGetLocations";

// تعریف ساختار هر آپشن
interface Option {
  id: string;
  name: string;
}

// اصلاح OptionsMap برای پذیرش آرایه‌ای از آبجکت‌ها
interface OptionsMap {
  [key: string]: {
    title: string;
    options: Option[]; // تغییر از string[] به Option[]
  };
}

interface ChangeHandlerEvent {
  target: {
    name: string;
    value: string;
  };
}

interface FilterContainerProps<T> {
  filterValues: T;
  className: string;
  optionsMap: OptionsMap;
  handleInputChange: (e: ChangeHandlerEvent) => void;
  isClearFilter?: boolean;
  onClearFilters?: () => void; // اضافه کردن تابع برای پاکسازی
}

export default function FilterContainer<T>({
  className,
  optionsMap,
  filterValues,
  handleInputChange,
  isClearFilter,
  onClearFilters,
}: FilterContainerProps<T>) {
  const { isGettingLocations, locations } = UseGetLocations();

  return (
    <div className={`${className}`}>
      <div>
        <SelectInput
          name="places"
          title="مجموعه ها"
          options={[
            { id: "all", name: "همه مجموعه ها" }, // آیتم اول به صورت دستی
            ...(locations?.items || []).map((item: any) => ({
              id: item.id,
              name: item.name,
            })),
          ]}
          filterValues={filterValues as any}
          handleChange={handleInputChange}
        />
      </div>
      {Object.entries(optionsMap).map(([key, value]) => {
        return (
          <div key={key}>
            <SelectInput
              name={key}
              title={value.title}
              // پاس دادن آرایه آبجکت‌ها به SelectInput
              options={value.options}
              filterValues={filterValues as any}
              handleChange={handleInputChange}
            />
          </div>
        );
      })}

      {isClearFilter && (
        <div className="flex items-end">
          <button
            onClick={onClearFilters} // فراخوانی تابع پاکسازی
            className="flex shadow-xs bg-white items-center justify-center gap-x-3 border border-gray-100 rounded-lg px-3 w-full py-3 cursor-pointer text-sm hover:bg-gray-50 transition-all"
          >
            <span>
              <LuFilter size={18} />
            </span>
            <span>پاکسازی فیلترها</span>
          </button>
        </div>
      )}
    </div>
  );
}
