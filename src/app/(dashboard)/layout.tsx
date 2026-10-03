import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

interface layoutProps {
  children: React.ReactNode;
}

export default function layout({ children }: layoutProps) {
  return (
    <section className=" grid grid-cols-12">
      <div className="hidden md:block md:col-span-2">
        <Sidebar />
      </div>
      <div className="col-span-12 md:col-span-10 ">
        <Header />
        <main className="min-h-[440]">{children}</main>
        <Footer />
      </div>
    </section>
  );
}
