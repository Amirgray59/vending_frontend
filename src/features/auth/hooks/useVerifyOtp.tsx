import { useMutation } from "@tanstack/react-query";
import { verifyOtpApi } from "../api/auth";
import toast from "react-hot-toast";
import Cookies from "js-cookie"; // 1. ایمپورت کوکی

export function useVerifyOtp() {
  const { isPending: isSendingOtp, mutate: verifyOtp } = useMutation({
    mutationFn: verifyOtpApi,
    onSuccess: (data) => {
      toast.success("ورود با موفقیت انجام شد");
      
      // ذخیره در لوکال استوریج برای استفاده در API-ها
      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("refreshToken", data.refresh_token);
      
      // 2. ذخیره در کوکی برای Middleware (راهکار دوم)
      // ما مقدار access_token را در کوکی auth_token می‌ریزیم
      Cookies.set('auth_token', data.access_token, { expires: 7 }); 
    },
    onError: (err) => {
      toast.error("مشکلی در تایید کد otp رخ داده است");
    },
  });
  return { isSendingOtp, verifyOtp };
}