import PageTitle from "@/components/shared/PageTitle";
import RoleDetails from "@/features/roles-users/components/RoleDetails";
import UserCards from "@/features/roles-users/components/UsersCards";
import UserTable from "@/features/roles-users/components/UserTable";

export default function page() {
  return (
    <section className="p-4">
      {/* Page Title */}
      <PageTitle
        title="کاربران و نقش ها"
        description="داشبورد / کاربران و نقش ها"
      />
      <div className=" grid grid-cols-12 pt-4 gap-4">
        <div className="col-span-12 xl:col-span-3">
          {/* Role Detailes */}
          <RoleDetails />
        </div>
        <div className="col-span-12 xl:col-span-9">
          {/* Users Cards */}
          <div>
            <UserCards />
          </div>
          {/* User Table */}
          <div className="">
            <UserTable />
          </div>
        </div>
      </div>
    </section>
  );
}
