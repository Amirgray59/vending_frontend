import { IoIosArrowDown } from "react-icons/io";
import { LuCalendarDays } from "react-icons/lu";

interface PageTitlePropos {
  title: string;
  description?: string;
}

export default function PageTitle({ title, description }: PageTitlePropos) {
  const date = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());
  return (
    <div className="flex items-center gap-x-1 justify-between">
      <div>
        <p className=" text-lg sm:text-2xl font-bold">{title}</p>
        <p className=" text-sm text-gray-500 mt-2">{description}</p>
      </div>
      <div className=" flex items-center bg-white gap-x-2 text-xs sm:text-sm border border-gray-100 rounded-lg py-2 px-3 shadow-xs">
        <span><LuCalendarDays /></span>
        <span>امروز</span>
        <span >
            {date}
        </span>
        <span><IoIosArrowDown/></span>
      </div>
    </div>
  );
}
