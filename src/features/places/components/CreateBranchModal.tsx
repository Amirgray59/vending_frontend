
"use client";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";

import Modal from "@/components/shared/Modal";
import TextField from "@/components/form/TextFeild";
import { FaPlus } from "react-icons/fa6";
import UseGetProfile from "@/shared/hooks/useGetProfile";
import { useCreateLocation } from "../hooks/useCreateLocation";

interface CreateBranchModalProps {
  onClose: () => void;
  open: boolean;
}

// ۱. آپدیت اسکیما برای اضافه کردن فیلد city
export const schema = yup
  .object({
    name: yup.string().required("نام مجموعه الزامی است"),
    city: yup.string().required("نام شهر الزامی است"), // فیلد شهر اضافه شد
  })
  .required();

type FormValues = yup.InferType<typeof schema>;

export default function CreateBranchModal({
  onClose,
  open,
}: CreateBranchModalProps) {
  const { isgettingprofile, profile } = UseGetProfile();
  const { createLocation, isCreatingLocation } = useCreateLocation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }, // isLoading اینجا استفاده نشده بود، حذف شد
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!isgettingprofile && profile) {
      createLocation(
        { 
          name: data.name, 
          city: data.city, // ۲. ارسال مقدار شهر به بک‌اند
          manager_id: profile.id 
        },
        {
          onSuccess: () => {
            onClose();
            reset();
          },
        },
      );
    }
  };

  return (
    <Modal onClose={onClose} open={open} title="افزودن مجموعه جدید">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-y-6 my-6">
          <TextField
            errors={errors}
            label="نام مجموعه"
            name="name"
            register={register}
            placeholder="نام مجموعه را وارد کنید"
          />

          <TextField
            errors={errors}
            label="نام شهر"
            name="city"
            register={register}
            placeholder="نام شهر را وارد کنید"
          />
        </div>

        <button 
          disabled={isCreatingLocation} // غیرفعال کردن دکمه هنگام ارسال
          className={`flex py-2 px-5 mt-2 items-center justify-center gap-x-2 rounded-lg text-white font-medium text-sm transition-colors ${
            isCreatingLocation ? "bg-emerald-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          <span>{isCreatingLocation ? "در حال ثبت..." : "ثبت مجموعه جدید"}</span>
          {!isCreatingLocation && <FaPlus />}
        </button>
      </form>
    </Modal>
  );
}