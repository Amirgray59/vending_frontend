"use client";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import TextField from "@/components/form/TextFeild";
import FormBtn from "@/components/ui/FormBtn";
import { LuPhone } from "react-icons/lu";
import { IoIosArrowBack } from "react-icons/io";
import { BsShieldCheck } from "react-icons/bs";
import Footer from "@/components/layout/Footer";
import { useSendOtp } from "@/features/auth/hooks/useSendOtp";
import { useEffect } from "react";
import axios from "axios";

export const schema = yup
  .object({
    phone_number: yup.string().required("شماره موبایل الزامی است"),
  })
  .required();
type FormDataSignin = yup.InferType<typeof schema>;
function page() {
  const { isLoging, sendOtp } = useSendOtp();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<FormDataSignin>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<FormDataSignin> = async (data) => {
    sendOtp(
      { phone_number: data.phone_number },
      {
        onSuccess: () => {
          router.push("/verify-otp");
        },
      },
    );
    localStorage.setItem("phoneNumber", data.phone_number);
  };

  return (
    <div className=" w-full  bg-[#F3F7FE]">
      {/* Header */}
      <div className=" w-full bg-white shadow-sm py-6 flex items-center gap-x-2 pr-4">
        <img src="/header-icon.png" alt="" className="w-14 h-12" />
        <p className=" sm:text-xl font-semibold">
          سامانه کنترل و مدیریت وندینگ
        </p>
      </div>
      {/* Body */}
      <div className="grid grid-cols-12 py-4 xl:px-16">
        <div className="col-span-12 xl:col-span-4 flex items-center justify-center">
          <div className=" flex justify-center py-6">
            <div className="max-w-xs sm:max-w-md ">
              <div className="w-full px-6 bg-white shadow-sm border border-gray-100  rounded-2xl py-8">
                <div className=" text-center mb-8">
                  <p className=" sm:text-xl font-bold">
                    سامانه مدیریت و کنترل وندینگ
                  </p>
                  <p className=" mt-2 text-gray-500 ">ورود به پنل مدیریت</p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <TextField
                    errors={errors}
                    label="شماره موبایل"
                    name="phone_number"
                    register={register}
                    placeholder="  شماره موبایل خود را وارد کنید"
                    Icon={LuPhone}
                  />

                  {/* <div className=" flex items-center justify-between my-8">
                    <div className="flex items-center  ">
                      <input
                        type="checkbox"
                        className="peer w-5 h-5 border border-gray-200 rounded-sm checked:border-blue-600 checked:bg-blue-600"
                      />
                      <label htmlFor="" className="mr-2 text-[#414A53] text-sm">
                        مرا به خاطر بسپار
                      </label>
                    </div>
                    <div className=" text-sm text-blue-600">
                      <Link className="" href="/forget-password">
                        <span>فراموشی رمز عبور ؟</span>
                      </Link>
                    </div>
                  </div> */}
                  <div className=" mt-8">
                    <FormBtn
                      isLoading={isLoging}
                      btnTitle="ورود"
                      Icon={IoIosArrowBack}
                    />
                  </div>
                </form>
                <div className=" flex items-center gap-x-3 sm:px-8 mt-8">
                  <div className="bg-green-50 p-2 rounded-full">
                    <BsShieldCheck className=" text-xl  text-green-600 " />
                  </div>
                  <span className=" text-xs text-gray-500">
                    دسترسی شما به صورت امن و رمز گذاری شده انجام می شود لطفا
                    اطلاعات حساب خود را محرمانه نگه دارید.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="xl:col-span-8">
          <img src="/login-bg.png" alt="" className=" hidden xl:block" />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default page;
