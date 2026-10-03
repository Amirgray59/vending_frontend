"use client";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";

import Modal from "@/components/shared/Modal";
import TextField from "@/components/form/TextFeild";
import { FaPlus } from "react-icons/fa6";
import Select from "@/components/form/Select";
import UseGetLocations from "@/shared/hooks/useGetLocations";
import { useCreateSection } from "../hooks/useCreateSection";
import { useParams } from "next/navigation";

interface CreateSectionModalProps {
  onClose: () => void;
  open: boolean;
}

export const schema = yup
  .object({
    name: yup.string().required("نام بخش الزامی است"),
  })
  .required();
type FormValues = yup.InferType<typeof schema>;

export default function CreateSectionModal({
  onClose,
  open,
}: CreateSectionModalProps) {
  const { isGettingLocations, locations } = UseGetLocations();
  const {createSection,isCreatingSection}=useCreateSection();
  const {branchId}=useParams();
  
  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    createSection({name:data.name,location_id:String(branchId)},{
      onSuccess:()=>{
        onClose();
        reset();
      }
    })
  };
  return (
    <Modal onClose={onClose} open={open} title="افزودن بخش جدید">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-4 py-6">
          <div>
            <TextField
              errors={errors}
              label="نام بخش"
              name="name"
              register={register}
              isRequired
              placeholder="نام بخش را وارد کنید"
            />
          </div>
        </div>
        <button className="flex py-2 px-5 mt-2 items-center justify-center gap-x-2 bg-emerald-600 rounded-lg text-white font-medium text-sm">
          <span>ثبت بخش جدید</span>
          <span>
            <FaPlus />
          </span>
        </button>
      </form>
    </Modal>
  );
}
