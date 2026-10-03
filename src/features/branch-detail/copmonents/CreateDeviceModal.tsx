"use client";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";

import Modal from "@/components/shared/Modal";
import TextField from "@/components/form/TextFeild";
import { FaPlus } from "react-icons/fa6";
import Select from "@/components/form/Select";
import { useCreateDevice } from "../hooks/useCreateDevice";

interface CreateDeviceModalProps {
  onClose: () => void;
  open: boolean;
  locationId: string;
  sectionId: string;
}

export const schema = yup
  .object({
    deviceId: yup.string().required("آیدی دستگاه الزامی است"),
    name: yup.string().required("نام دستگاه الزامی است"),
  })
  .required();
type FormValues = yup.InferType<typeof schema>;

export default function CreateDeviceModal({
  locationId,
  sectionId,
  onClose,
  open,
}: CreateDeviceModalProps) {
  const { createDevice, isCreatingDevice } = useCreateDevice();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isLoading },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    
    createDevice(
      {
        device_code: data.deviceId,
        location_id: locationId,
        section_id: sectionId,
        name:data.name
      },
      {
        onSuccess: () => {
          onClose();
          reset();
        },
      },
    );
  };
  return (
    <Modal onClose={onClose} open={open} title="افزودن دستگاه جدید">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 py-4 sm:grid-cols-2 gap-4">
          <div>
            <TextField
              errors={errors}
              label="نام دستگاه"
              name="name"
              placeholder="نام دستگاه را وارد کنید"
              register={register}
              isRequired
            />
          </div>

          <div>
            <Select
              control={control}
              label="آیدی دستگاه"
              name="deviceId"
              errors={errors}
              options={[
                { id: "1", label: "انتخاب دستگاه", value: "" },
                { id: "2", label: "12cdx35", value: "12cdx35" },
                { id: "3", label: "12cdx36", value: "12cdx36" },
                { id: "4", label: "12cdx37", value: "12cdx37" },
              ]}
            />
          </div>
        </div>
        <button type="submit" className="flex py-2 px-5 mt-2 items-center justify-center gap-x-2 bg-emerald-600 rounded-lg text-white font-medium text-sm">
          <span>ثبت دستگاه جدید</span>
          <span>
            <FaPlus />
          </span>
        </button>
      </form>
    </Modal>
  );
}
