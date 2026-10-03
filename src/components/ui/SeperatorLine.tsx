type SeperatorLineProps = {
  title?: string;
};

export default function SeperatorLine({ title }: SeperatorLineProps) {
  return (
    <div className="w-full my-6 border-t border-gray-200 relative flex justify-center ">
      {title && (
        <span className=" absolute text-[#71717A] -top-3 px-3 text-sm bg-[#f0f2f5]">
          {title}
        </span>
      )}
    </div>
  );
}
