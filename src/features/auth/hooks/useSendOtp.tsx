import { useMutation } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { sendOtpAi } from "../api/auth";

export function useSendOtp() {
  const { isPending: isLoging, mutate: sendOtp } = useMutation({
    mutationFn: sendOtpAi,
    onSuccess: (data) => {
        toast.success("کد otp به شماره موبایل شما ارسال شد");
    },
    onError: (err) => {
      toast.error("مشکلی در ارسال کد otp داده است");
    },
  });
  return { isLoging, sendOtp };
}
