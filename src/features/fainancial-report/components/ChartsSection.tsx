import IncomeLocationChart from "@/components/chart/IncomeLocationCharts";
import IncomeTrendChart from "@/components/chart/IncomeTrendChart";

interface ChartDataPoint {
  name: string;  // نام مکان (مثلاً "پاساژ کوروش")
  value: number; // مجموع درآمد (به صورت عدد)
}



export interface TrendDataPoint {
  date: string;
  value: number;
}
interface ReportsChartSectionProps{
  incomeLocationData:ChartDataPoint[];
  incomeTrendData:TrendDataPoint[]
}

export default function ReportsChartSection({incomeLocationData,incomeTrendData}:ReportsChartSectionProps) {
  return (
    <section className=" grid grid-cols-1 xl:grid-cols-2 mt-4 gap-4">
      <div>
        <IncomeLocationChart chartData={incomeLocationData}/>
      </div>
      <div>
        <IncomeTrendChart chartData={incomeTrendData}/>
      </div>
    </section>
  );
}
