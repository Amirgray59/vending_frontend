import { useState } from "react";
import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { IconType } from "react-icons";
import { FaRegEyeSlash } from "react-icons/fa6";
import { HiOutlineEye } from "react-icons/hi";

type TextFieldProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  dir?: "rtl" | "ltr";
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  type?: string;
  placeholder: string;
  Icon?: IconType;
  isPassword?: boolean;
  isRequired?: boolean;
};

export default function TextField<T extends FieldValues>({
  label,
  name,
  dir = "rtl",
  register,
  errors,
  type = "text",
  placeholder,
  Icon,
  isPassword,
  isRequired,
}: TextFieldProps<T>) {
  const error = errors[name];
  const [typeValue, setTypeValue] = useState(isPassword ? "password" : "text");
  const [isShow, setIsShow] = useState(false);

  const handleChangeType = () => {
    setTypeValue((v) => (v === "text" ? "password" : "text"));
    setIsShow((prevState) => !prevState);
  };

  return (
    <div className={`flex flex-col ${Icon ? "my-4" : ""} w-full`}>
      <label className="mb-2 text-[#414A53]" htmlFor={name}>
        {isRequired && <span className="ml-1 text-red-600">*</span>}
        {label}
      </label>
      <div className="flex items-center relative">
        {Icon && (
          <span>
            <Icon className=" absolute right-2 text-xl bottom-4 text-[#71717A]" />
          </span>
        )}
        <input
          id={name}
          type={typeValue}
          dir={dir}
          className={`bg-white placeholder:text-sm border outline-0 rounded-lg  px-4 pr-8 py-3 w-full ${Icon ? "pr-6" : "pr-2"} border-gray-200`}
          {...register(name)}
          placeholder={placeholder}
        />
        {isPassword && (
          <span>
            {isShow ? (
              <HiOutlineEye
                onClick={handleChangeType}
                className=" absolute left-2 text-2xl bottom-2 text-[#71717A] cursor-pointer"
              />
            ) : (
              <FaRegEyeSlash
                onClick={handleChangeType}
                className=" absolute left-2 text-2xl bottom-2 text-[#71717A] cursor-pointer"
              />
            )}
          </span>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error.message?.toString()}</p>
      )}
    </div>
  );
}
