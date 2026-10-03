import SchedulingHeaderSection from "@/features/control-scheduling/components/SchedulingHeaderSection";
import SchedulingHistorySection from "@/features/control-scheduling/components/SchedulingHistorySection";

export default function ControlSchedulingTab() {
  return (
    <section className="pt-4">
      {/* Scheduling Header Section */}
      <SchedulingHeaderSection />
      {/* Scheduling History Section */}
      <SchedulingHistorySection />
    </section>
  );
}
