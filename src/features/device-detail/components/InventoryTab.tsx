"use client";
import React, { useEffect, useState } from "react";
import {
  Package,
  Plus,
  X,
  Bell,
  Save,
  Layers, // اضافه شده برای آیکون ظرفیت
} from "lucide-react";

import InventoryTable from "./InventoryTable";
import SelectInput from "@/components/form/SelectInput";
import { useParams } from "next/navigation";
import { useAddManualInventory } from "../hooks/useAddManualInventory";
import useGetDeviceDetail from "@/shared/hooks/useGetDeviceDetail";
import toast from "react-hot-toast";
import InventoryTabChart from "./InventoryTabChart";
import { hasActionPermission } from "@/shared/permisseions/permissionUtils";
import UseGetProfile from "@/shared/hooks/useGetProfile";
import { useEditDevice } from "../hooks/useEditDevice";

interface HandleChangeArg {
  target: {
    value: string | number;
    name: string;
  };
}

const InventoryTab = () => {
  // اضافه شدن حالت 'capacity' به پنل‌ها
  const [activePanel, setActivePanel] = useState<
    "none" | "edit" | "alert" | "capacity"
  >("none");

  const [changeValue, setChangeValue] = useState({
    count: 0,
    operator: "increase",
    note: "",
  });

  const [alertValues, setAlertValues] = useState({
    inventory_yellow_threshold: "",
    inventory_red_threshold: "",
  });

  const [capacityValue, setCapacityValue] = useState(""); // استیت برای مقدار ظرفیت

  const { deviceId } = useParams();
  const { addManualInventory, isAddingManualInventory } =
    useAddManualInventory();
  const { editDevice, isEditingDevice } = useEditDevice();
  const { device, isGettingDevice } = useGetDeviceDetail(deviceId as string);
  const { profile } = UseGetProfile();

  useEffect(() => {
    if (!isGettingDevice) {
      setAlertValues({
        inventory_yellow_threshold: device.inventory_yellow_threshold,
        inventory_red_threshold: device.inventory_red_threshold,
      });
      setCapacityValue(device.inventory_capacity || ""); // مقدار اولیه ظرفیت
    }
  }, []);

  const handleChange = (e: HandleChangeArg) => {
    setChangeValue({ ...changeValue, [e.target.name]: e.target.value });
  };

  const handleAlertChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlertValues({ ...alertValues, [e.target.name]: e.target.value });
  };

  // تابع جدید برای ذخیره ظرفیت
  const handleSaveCapacity = async () => {
    if (device?.is_active === false) {
      toast.error("این عملیات برای دستگاه های غیر فعال امکان پذیر نیست");
      return;
    }
    if (!capacityValue) {
      toast.error("لطفاً مقدار ظرفیت را وارد کنید");
      return;
    }
    try {
      editDevice(
        {
          deviceId: deviceId as string,
          payload: {
            inventory_capacity: +capacityValue,
          },
        },
        {
          onSuccess: () => {
            setActivePanel("none");
            toast.success("ظرفیت با موفقیت به‌روز شد");
          },
        },
      );
    } catch (error) {
      toast.error("خطایی در ذخیره ظرفیت رخ داد");
    }
  };

  const handleAddInventory = () => {
    const numericValue = +changeValue.count;
    const currentInventory = device?.inventory_level || 0;

    if (device?.is_active === false) {
      toast.error("این عملیات برای دستگاه  های غیر فعال امکان پذیر نیست");
      return;
    }

    if (numericValue === 0) {
      toast.error("لطفاً یک مقدار غیر از صفر را وارد کنید");
      return;
    }

    if (
      changeValue.operator === "decrease" &&
      numericValue > currentInventory
    ) {
      toast.error(
        `مقدار وارد شده بیشتر از موجودی فعلی (${currentInventory}) است`,
      );
      return;
    }

    const finalDelta =
      changeValue.operator === "decrease"
        ? -Math.abs(numericValue)
        : Math.abs(numericValue);

    addManualInventory(
      {
        deviceId: deviceId as string,
        payload: {
          delta: finalDelta,
          reason:
            changeValue.note || changeValue.operator === "increase"
              ? "افزودن"
              : "کم کردن",
        },
      },
      {
        onSuccess: () => {
          setActivePanel("none");
          setChangeValue({ count: 0, operator: "increase", note: "" });
          toast.success("موجودی با موفقیت به‌روز شد");
        },
        onError: () => {
          toast.error("خطایی در ثبت تغییرات رخ داد");
        },
      },
    );
  };

  const handleSaveAlerts = async () => {
    if (device?.is_active === false) {
      toast.error("این عملیات برای دستگاه  های غیر فعال امکان پذیر نیست");
      return;
    }
    if (
      !alertValues.inventory_yellow_threshold ||
      !alertValues.inventory_red_threshold
    ) {
      toast.error("لطفاً هر دو مقدار هشدار را وارد کنید");
      return;
    }
    try {
      editDevice(
        {
          deviceId: deviceId as string,
          payload: {
            inventory_yellow_threshold: +alertValues.inventory_yellow_threshold,
            inventory_red_threshold: +alertValues.inventory_red_threshold,
          },
        },
        {
          onSuccess: () => {
            setActivePanel("none");
            toast.success("هشدارها با موفقیت ذخیره شدند");
          },
        },
      );
    } catch (error) {
      toast.error("خطایی در ذخیره تنظیمات رخ داد");
    }
  };

  return (
    <div className="pt-4 space-y-6" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 h-full relative overflow-hidden group transition-all hover:shadow-md">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-70 group-hover:bg-emerald-100 transition-colors" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6 gap-2">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <Package size={28} />
                </div>

                <div className="flex gap-2">
                  {/* دکمه جدید برای ظرفیت */}
                  {hasActionPermission(profile?.role, "canEdit") && (
                    <button
                      onClick={() =>
                        setActivePanel(
                          activePanel === "capacity" ? "none" : "capacity",
                        )
                      }
                      className={`p-2 rounded-lg transition-all ${activePanel === "capacity" ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                      title="تنظیم ظرفیت موجودی"
                    >
                      <Layers size={20} />
                    </button>
                  )}

                  {hasActionPermission(profile?.role, "canEdit") && (
                    <button
                      onClick={() =>
                        setActivePanel(
                          activePanel === "alert" ? "none" : "alert",
                        )
                      }
                      className={`p-2 rounded-lg transition-all ${activePanel === "alert" ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                      title="تنظیمات هشدار موجودی"
                    >
                      <Bell size={20} />
                    </button>
                  )}

                  {hasActionPermission(profile?.role, "canCreate") && (
                    <button
                      onClick={() =>
                        setActivePanel(activePanel === "edit" ? "none" : "edit")
                      }
                      className={`py-2 px-4 rounded-lg text-white transition-all font-semibold text-sm flex items-center gap-2 ${activePanel === "edit" ? "bg-gray-400 hover:bg-gray-500" : "bg-emerald-600 hover:bg-emerald-700"}`}
                    >
                      {activePanel === "edit" ? (
                        <>
                          <X size={16} /> لغو
                        </>
                      ) : (
                        <>
                          <Plus size={16} /> تغییر موجودی
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="text-center py-4">
                <p className="text-slate-500 text-sm font-medium mb-1">
                  موجودی فعلی دستگاه
                </p>
                <h2 className="text-4xl font-bold text-slate-800">
                  {isGettingDevice ? "..." : device?.inventory_level || 0}
                </h2>
              </div>

              {/* فرم ویرایش موجودی */}
              {activePanel === "edit" && (
                <div className="mt-6 p-4 bg-slate-50 rounded-xl space-y-4 border border-slate-100 animate-in fade-in slide-in-from-top-2">
                  <div className=" gap-3">
                    <div className=" flex items-center w-full  gap-2">
                      <SelectInput
                        filterValues={changeValue}
                        handleChange={handleChange}
                        name="operator"
                        options={[
                          { id: "increase", name: "افزودن" },
                          { id: "decrease", name: "کم کردن" },
                        ]}
                      />

                      <input
                        type="number"
                        name="count"
                        value={changeValue.count}
                        onChange={(e) => handleChange({ target: e.target })}
                        placeholder="مقدار"
                        className={`p-2 h-11.5 w-full mt-1.5 text-sm border border-gray-100 shadow-xs bg-white rounded-lg outline-none focus:ring-2 ${changeValue.operator === "increase" ? "ring-emerald-500" : "ring-red-600"} `}
                      />
                    </div>
                    <input
                      type="text"
                      name="note"
                      value={changeValue.note}
                      onChange={(e) => handleChange({ target: e.target })}
                      placeholder="توضیحات"
                      className="p-2 h-11.5 w-full text-sm border border-gray-100 shadow-xs bg-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleAddInventory}
                      disabled={isAddingManualInventory}
                      className="w-full h-11.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-all disabled:opacity-50"
                    >
                      ثبت تغییرات
                    </button>
                  </div>
                </div>
              )}

              {/* فرم تنظیمات هشدار */}
              {activePanel === "alert" && (
                <div className="mt-6 p-4 bg-amber-50 rounded-xl space-y-4 border border-amber-100 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-amber-700 font-medium">
                        حد هشدار زرد
                      </label>
                      <input
                        type="number"
                        name="inventory_yellow_threshold"
                        value={alertValues.inventory_yellow_threshold}
                        onChange={handleAlertChange}
                        className="p-2 h-11.5 w-full text-sm border border-amber-200 bg-white rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-red-700 font-medium">
                        حد هشدار قرمز
                      </label>
                      <input
                        type="number"
                        name="inventory_red_threshold"
                        value={alertValues.inventory_red_threshold}
                        onChange={handleAlertChange}
                        className="p-2 h-11.5 w-full text-sm border border-red-200 bg-white rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <button
                      onClick={handleSaveAlerts}
                      disabled={isEditingDevice}
                      className="w-full h-11.5 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-all disabled:opacity-50"
                    >
                      ذخیره هشدارها
                    </button>
                  </div>
                </div>
              )}

              {/* فرم تنظیم ظرفیت (بخش جدید) */}
              {activePanel === "capacity" && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl space-y-4 border border-blue-100 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-blue-700 font-medium">
                        ظرفیت موجودی
                      </label>
                      <input
                        type="number"
                        value={capacityValue}
                        onChange={(e) => setCapacityValue(e.target.value)}
                        placeholder="مقدار ظرفیت"
                        className="p-2 h-11.5 w-full text-sm border border-blue-200 bg-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      onClick={handleSaveCapacity}
                      disabled={isEditingDevice}
                      className="w-full h-11.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50"
                    >
                      ذخیره ظرفیت
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 h-full">
          <InventoryTabChart />
        </div>
        <div className="lg:col-span-3 space-y-6">
          <InventoryTable />
        </div>
      </div>
    </div>
  );
};

export default InventoryTab;
