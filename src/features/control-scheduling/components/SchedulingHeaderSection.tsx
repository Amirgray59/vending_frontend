import DeviceControlCard from "./DeviceControlCard";
import DeviceHeaderCard from "./DeviceHeaderCard";

export default function () {
  return (
    <section className=" grid grid-cols-12 gap-4">
      <div className="col-span-12 md:col-span-7">
        <DeviceHeaderCard />
      </div>
      <div className="col-span-12 md:col-span-5">
        <DeviceControlCard />
      </div>
    </section>
  );
}
