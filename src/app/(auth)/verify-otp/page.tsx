"use client";

import { useState, useEffect } from "react";
import OtpInput from "react-otp-input";
import { LuSmartphone } from "react-icons/lu";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { IoIosArrowBack } from "react-icons/io";
import Footer from "@/components/layout/Footer";
import { useVerifyOtp } from "@/features/auth/hooks/useVerifyOtp";
import { useSendOtp } from "@/features/auth/hooks/useSendOtp";
import Spinner from "@/components/ui/Spinner";

const RESEND_OTP = 120;

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(RESEND_OTP);
  const [isResending, setIsResending] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const router = useRouter();
  const { isSendingOtp, verifyOtp } = useVerifyOtp();
  const { isLoging, sendOtp } = useSendOtp();

  useEffect(() => {
    const phone = localStorage.getItem("phoneNumber");
    if (phone) {
      setPhoneNumber(phone);
    }
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("لطفا کد ۶ رقمی را کامل وارد کنید");
      return;
    }
    try {
      if (phoneNumber && otp.length === 6) {
        verifyOtp(
          { phone_number: phoneNumber, code: otp },
          {
            onSuccess: () => {
              router.push("/dashboard");
            },
          },
        );
      }
    } catch (error: any) {
      console.log(error.response.data);

      toast.error("کد صحیح نمی باشد .");
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    if (!phoneNumber) {
      toast.error("شماره موبایلی ثبت نشده است .");
      router.push("/");
      return;
    }
    try {
      sendOtp({ phone_number: phoneNumber });
      setTimeLeft(RESEND_OTP);
      setOtp("");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "خطایی در ارسال مجدد رخ داد",
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full   bg-[#F3F7FE]" dir="rtl">
      {/* Header */}
      <div className="w-full bg-white shadow-sm py-6 flex items-center gap-x-2 pr-4">
        <img src="/header-icon.png" alt="" className="w-14 h-12" />
        <p className="sm:text-xl font-semibold">سامانه کنترل و مدیریت وندینگ</p>
      </div>

      {/* Body */}
      <div className="grid grid-cols-12 py-4 xl:px-16">
        <div className="col-span-12 xl:col-span-4 flex items-center justify-center">
          <div className="flex justify-center py-6 w-full">
            <div className=" flex justify-center w-full">
              <div className="w-full max-w-xs sm:max-w-md px-6 bg-white shadow-sm border border-gray-100 rounded-2xl py-8">
                <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <LuSmartphone className="text-4xl" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                  تایید شماره موبایل
                </h2>
                <p className="text-gray-500 mb-8 text-sm text-center">
                  کد ۶ رقمی ارسال شده به موبایل شما را وارد کنید
                </p>

                <div
                  dir="ltr"
                  className="flex bg-gray-50 xl:bg-white py-2 rounded-md  justify-center mb-8"
                >
                  <OtpInput
                    value={otp}
                    onChange={(value) => {
                      // فقط اعداد انگلیسی مجاز هستند
                      if (/^\d*$/.test(value)) {
                        setOtp(value);
                      }
                    }}
                    numInputs={6}
                    renderInput={(props) => (
                      <input
                        {...props}
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        onKeyDown={(e) => {
                          if (e.key.length === 1 && !/^\d$/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        className="w-9! bg-white h-9! sm:w-13! sm:h-13! mx-1 text-center text-md sm:text-lg font-bold text-gray-700 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200"
                      />
                    )}
                  />
                </div>

                {timeLeft > 0 ? (
                  <button
                    disabled={isSendingOtp}
                    onClick={handleVerify}
                    className=" cursor-pointer bg-[#032062] text-white w-full py-3  items-center rounded-lg my-2 font-bold flex justify-center gap-x-2"
                  >
                    <span>تایید و ورود</span>
                    {isSendingOtp ? (
                      <Spinner />
                    ) : (
                      <span>
                        <IoIosArrowBack className="text-[#F6711A] text-2xl" />
                      </span>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleResend}
                    disabled={isResending}
                    className=" cursor-pointer bg-[#032062] text-white w-full py-3 items-center rounded-lg my-2 font-bold flex justify-center gap-x-2"
                  >
                    <span>ارسال مجدد کد</span>
                    {isResending && (
                      <span>
                        <Spinner />
                      </span>
                    )}
                  </button>
                )}

                <div className="w-full flex justify-center mt-4 text-[#414A53] text-sm">
                  <span>ارسال مجدد کد: </span>
                  <span className="mx-1 font-medium">{`${minutes}:${seconds}`}</span>
                  <span>دقیقه</span>
                </div>

                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => router.push("/")}
                    className="flex items-center cursor-pointer  gap-x-1 text-gray-400 text-xs hover:text-gray-600 transition-colors"
                  >
                    بازگشت به صفحه قبل
                    <IoIosArrowBack />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden xl:block xl:col-span-8">
          <img
            src="/login-bg.png"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default VerifyOtpPage;
