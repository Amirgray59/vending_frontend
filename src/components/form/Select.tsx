import { Controller } from "react-hook-form";

type SelectProps = {
  control: any;
  label: string;
  isRequire?: boolean;
  name: string;
  className?: string;
  options: { id: string; label: string; value: string }[];
  errors: any;
  isReadOnly?: boolean;
};

export default function Select({
  control,
  label,
  isRequire,
  name,
  className,
  options,
  errors,
  isReadOnly,
}: SelectProps) {
  const error = errors[name];
  return (
    <div className=" h-ful">
      <label className="block   mb-2">
        {isRequire && <span className="text-red-600 ">*</span>}
        <span className="text-[#414A53]  mr-1">{label}</span>
      </label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <select
          
          disabled={isReadOnly}
            {...field}
            className={`w-full outline-0 border h-12 text-gray-500 text-sm border-gray-200 rounded-md p-1 bg-white ${className}`}
          >
            {options.map((option) => (
              <option value={option.value} key={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1 mr-1">
          {error.message?.toString()}
        </p>
      )}
    </div>
  );
}
