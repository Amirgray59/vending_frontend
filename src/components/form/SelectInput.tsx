"use client";

import { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

interface ChangeHandlerEvent {
  target: {
    name: string;
    value: string;
  };
}

interface OptionType {
  id: string;
  name: string;
}

interface SelectInputProps<T> {
  filterValues: T;
  handleChange: (e: ChangeHandlerEvent) => void;
  name: string;
  options: OptionType[];
  title?: string;
}

export default function SelectInput<T>({
  filterValues,
  handleChange,
  options,
  name,
  title,
}: SelectInputProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- اصلاح اصلی اینجاست ---
  // پیدا کردن عنوان (title) بر اساس مقدار ذخیره شده در استیت (id)
  const getLabel = () => {
    const currentValue = (filterValues as any)[name];
    if (!currentValue) return "انتخاب کنید...";

    // جستجو در لیست آپشن‌ها برای پیدا کردن عنوان مربوط به این ID
    const selectedOption = options?.find((opt) => opt.id === currentValue);

    // اگر آپشن پیدا شد عنوانش رو برگردون، در غیر این صورت خود مقدار رو نشون بده
    return selectedOption ? selectedOption.name : currentValue;
  };

  const label = getLabel();

  return (
    <div dir="rtl" className="relative w-full! flex flex-col" ref={ref}>
      {/* Label */}
      <label className="text-sm mb-2 mr-1 text-gray-800">{title}</label>

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="
          flex gap-2 border border-gray-100 px-3 py-2 items-center justify-between
          w-full bg-white shadow-xs rounded-lg text-sm text-[#09090B]
          transition cursor-pointer font-medium
        "
      >
        <span className="flex flex-col items-start">
          <span className="mt-2">{label}</span>
        </span>

        <FiChevronDown
          className={`text-[#09090B] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute top-full mt-2 right-0
            w-full bg-white border border-gray-200
            rounded-xl shadow-sm overflow-hidden z-50
          "
        >
          {options.map((item: OptionType, index: number) => (
            <button
              key={`${item.id}-${index}`} // ✅ ترکیب ID و Index برای تضمین منحصر‌به‌فرد بودن
              onClick={() => {
                handleChange({
                  target: {
                    name,
                    value: item.id,
                  },
                });
                setOpen(false);
              }}
              className={`
      w-full text-right px-4 py-2 text-sm
      hover:bg-gray-100 transition
      ${(filterValues as any)[name] === item.id ? "bg-gray-100 font-medium" : ""}
    `}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
