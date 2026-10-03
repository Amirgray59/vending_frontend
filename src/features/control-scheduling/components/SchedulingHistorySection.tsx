
import CommandHistory from "./CommandHistory";
import DeviceSetting from "./DeviceSetting";

import WeeklySchedule from "./WeeklySchedule";





export default function SchedulingHistorySection() {
  return (
    <div className="w-full grid grid-cols-12 gap-4 mt-4">
      <div className="col-span-12 xl:col-span-6">
        <CommandHistory />
      </div>
      
      <div className="col-span-12 mt-4 xl:mt-0 xl:col-span-6">
        <WeeklySchedule />
      </div>
      <div className="col-span-12 md:col-span-6">
        <DeviceSetting/>
      </div>
    </div>
  );
}
