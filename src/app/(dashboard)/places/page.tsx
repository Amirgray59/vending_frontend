import PageTitle from "@/components/shared/PageTitle";
import LocationManagement from "@/features/places/components/LocationManagementTable";

export default function page() {
  return (
    <section className="p-4">
      {/* Page Title */}
      <PageTitle title="مجموعه ها" description="داشبورد / مجموعه ها" />
      {/* Location Section */}
      <div className="grid grid-cols-12  gap-4 mt-4">
        <div className="col-span-12 lg:col-span-8">
          
          <LocationManagement/>
        </div>       
      </div>
    </section>
  );
}
