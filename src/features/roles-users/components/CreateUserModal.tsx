"use client";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import Modal from "@/components/shared/Modal";
import TextField from "@/components/form/TextFeild";
import Select from "@/components/form/Select";
import { useCreateUser } from "../hooks/useCreateUser";
import AddNewButton from "@/components/ui/AddNewButton";
import useGetSingleUser from "@/shared/hooks/useGetSingleUser";
import { useEffect } from "react";
import { useUpdateUser } from "@/shared/hooks/useUpdateUser";
import { ROLE_OPTIONS } from "@/shared/permisseions/roles";

interface CreateUserModalProps {
  onClose: () => void;
  open: boolean;
  editId?: string;
}

const activeOptions = [
  { id: "active", label: "آره", value: "true" },
  { id: "inactive", label: "نه", value: "false" },
];

export const schema = yup
  .object({
    username: yup.string().required("نام و نام خانوادگی الزامی است"),
    phone: yup.string().required(" شماره موبایل الزامی است"),
    role: yup.string().required(" نقش کاربر الزامی است"),
    is_active: yup.string().oneOf(["true", "false"]).defined().default("true"),
  })
  .required();
type FormValues = yup.InferType<typeof schema>;

export default function CreateUserModal({
  onClose,
  open,
  editId,
}: CreateUserModalProps) {
  const { createUser, isCreatingUser } = useCreateUser();

  const { isGettingUser, user } = useGetSingleUser(editId as string);
  const { isUpdatingUser, updateUser } = useUpdateUser();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isLoading },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onBlur",
    defaultValues: { username: "", phone: "", role: "", is_active: "true" },
  });

  useEffect(() => {
    if (user) {
      reset({
        username: user.full_name ?? "",
        role: user.role,
        phone: user.phone,
        is_active: user.is_active ? "true" : "false",
      });
    }
  }, [user, reset]);
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (editId) {
      updateUser({
        id: editId,
        data: { ...data, is_active: data.is_active === "true" },
      },{
        onSuccess:()=>{
          onClose();
          reset()
        }
      })
    } else {
      createUser({
        username: data.username,
        phone: data.phone,
        role: data.role,
      }, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };
  return (
    <Modal
      onClose={onClose}
      open={open}
      title={`${editId ? "ویرایش کاربر" : "افزودن کاربر جدید"}`}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4 py-8">
          <div>
            <TextField
              errors={errors}
              label="نام و نام خانوادگی"
              isRequired
              name="username"
              register={register}
              placeholder="نام و نام خانوادگی را وارد کنید"
            />
          </div>
          <div>
            <TextField
              errors={errors}
              label="شماره موبایل"
              name="phone"
              register={register}
              placeholder="شماره موبایل را وارد کنید"
              isRequired
            />
          </div>
          <div>
            <Select
              control={control}
              errors={errors}
              label="نقش کاربر"
              name="role"
              options={ROLE_OPTIONS}
              isRequire
            />
          </div>
          {editId && (
            <Select
              control={control}
              errors={errors}
              label="فعال بودن"
              name="is_active"
              options={activeOptions}
              isRequire
            />
          )}
        </div>

        {editId ? (
          <button className="flex items-center justify-center gap-x-2 rounded-lg bg-blue-600 text-white text-sm font-medium py-2 px-5">
            <span>ویرایش کاربر </span>
          </button>
        ) : (
          <AddNewButton isLoading={isCreatingUser} title="ثبت کاربر جدید" />
        )}
      </form>
    </Modal>
  );
}
