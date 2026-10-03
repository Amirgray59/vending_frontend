import { FaRegCopyright } from "react-icons/fa6";

export default function Footer() {
  return (
    <div className=" w-full bg-white shadow-[0_-1px_2px_0_rgb(0_0_0/0.05)] py-6 flex items-center justify-center gap-x-2">
      <span>
        <FaRegCopyright className=" text-gray-500" />
      </span>
      <p className=" text-xs text-gray-500">
        کلیه حقوق محفوظ است - سامانه مدیریت و کنترل وندینگ
      </p>
    </div>
  );
}
