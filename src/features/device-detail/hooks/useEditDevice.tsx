import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { editDeviceApi } from "../api/deviceApi";

export function useEditDevice() { // 👈 ورودی ID حذف شد
  const queryClient = useQueryClient();
  const {isPending:isEditingDevice,mutate:editDevice} =useMutation({
    mutationFn: editDeviceApi, 
    onSuccess: (data, variables) => {
      // variables همان شیئی است که موقع mutate({ id, data }) می‌فرستید
      const id = variables?.deviceId; 

      if (id) {
        // این خط حیاتی است: دقیقاً همان کلیدی که در useGetDeviceDetail هست را بی‌صحت می‌کند
        queryClient.invalidateQueries({ queryKey: ["device", id] });
        
        // اگر لیست کلی هم دارید، این را هم اضافه کنید:
        queryClient.invalidateQueries({ queryKey: ["devices"] });
      }
      
      toast.success("دستگاه با موفقیت آپدیت شد");
    },
    onError: (err) => {
      toast.error("مشکلی در آپدیت دستگاه پیش آمده است");
    },
  });
  return {isEditingDevice,editDevice}
}