"use client";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa6";

import Modal from "@/components/shared/Modal";
import Select from "@/components/form/Select";
import TextField from "@/components/form/TextFeild";
import { useCreateDevice } from "../hooks/useCreateDevice";
import { useGetPendingDevices } from "../hooks/useGetPendingDevices";

interface CreateDeviceModalProps {
  onClose: () => void;
  open: boolean;
  locationId: string;
  sectionId: string;
}

const schema = yup
  .object({
    deviceId: yup.string().required("انتخاب شناسه دستگاه الزامی است"),
    name: yup.string().required("نام دستگاه الزامی است"),
    deviceType: yup.string().max(64, "نوع دستگاه حداکثر ۶۴ کاراکتر باشد").optional(),
  })
  .required();

type FormValues = yup.InferType<typeof schema>;

export default function CreateDeviceModal({
  onClose,
  open,
  locationId,
  sectionId,
}: CreateDeviceModalProps) {
  const { createDevice, isCreatingDevice } = useCreateDevice();
  const {
    pendingDevices,
    isGettingPendingDevices,
    isPendingDevicesError,
  } = useGetPendingDevices(open);
  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: { deviceId: "", name: "", deviceType: "" },
  });

  const deviceOptions = [
    {
      id: "placeholder",
      label: isGettingPendingDevices
        ? "در حال دریافت دستگاه‌ها..."
        : isPendingDevicesError
          ? "دریافت فهرست دستگاه‌ها ناموفق بود"
          : pendingDevices.length === 0
            ? "دستگاه در انتظار ثبت وجود ندارد"
            : "شناسه دستگاه را انتخاب کنید",
      value: "",
    },
    ...pendingDevices.map((device: { id: string; device_code: string }) => ({
      id: device.id,
      label: device.device_code,
      value: device.device_code,
    })),
  ];

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    createDevice(
      {
        device_code: data.deviceId,
        name: data.name,
        device_type: data.deviceType?.trim() || null,
        location_id: locationId,
        section_id: sectionId,
      },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      },
    );
  };

  return (
    <Modal onClose={onClose} open={open} title="افزودن دستگاه جدید">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-4 py-6">
          <Select
            control={control}
            errors={errors}
            label="آیدی دستگاه"
            name="deviceId"
            options={deviceOptions}
            isRequire
            isReadOnly={isGettingPendingDevices || pendingDevices.length === 0}
          />
          <TextField
            errors={errors}
            label="نام دستگاه"
            name="name"
            register={register}
            isRequired
            placeholder="نام دستگاه را وارد کنید"
          />
          <TextField
            errors={errors}
            label="نوع دستگاه"
            name="deviceType"
            register={register}
            placeholder="نوع دستگاه را وارد کنید"
          />
        </div>
        <button
          type="submit"
          disabled={
            isCreatingDevice ||
            isGettingPendingDevices ||
            pendingDevices.length === 0
          }
          className="flex items-center justify-center gap-x-2 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>ثبت دستگاه جدید</span>
          <FaPlus />
        </button>
      </form>
    </Modal>
  );
}
