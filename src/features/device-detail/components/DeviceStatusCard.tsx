
import { Check, Wifi, AlertCircle, Power } from 'lucide-react';
import { useParams } from 'next/navigation';
import useGetDeviceDetail from '@/shared/hooks/useGetDeviceDetail';

const DeviceStatusCard = () => {
  const { deviceId } = useParams();
  const { device, isGettingDevice } = useGetDeviceDetail(deviceId as string);

  // --- حالت Skeleton (لودینگ) ---
  if (isGettingDevice) {
    return (
      <div className="w-full h-full bg-white border border-gray-100 rounded-lg shadow-sm p-4 animate-pulse">
        <div className="h-6 w-32 bg-gray-200 rounded mb-6 mr-auto ml-auto"></div>
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
          <div className="mt-4 h-4 w-32 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50">
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
              <div className="h-4 w-12 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // منطق تعیین وضعیت بصری بر اساس دیتای بک‌اندم
  const isActive = device?.is_active;
  const isPowerOn = device?.power_on;

  // رنگ و آیکون بر اساس وضعیت فعال بودن
  const statusConfig = {
    color: isActive ? 'text-green-500' : 'text-red-500',
    bgColor: isActive ? 'bg-green-500' : 'bg-red-500',
    bgOpacity: isActive ? 'bg-green-100' : 'bg-red-100',
    icon: isActive ? <Check size={32} strokeWidth={3.5} /> : <AlertCircle size={32} strokeWidth={3.5} />,
    text: isActive ? 'دستگاه آنلاین و در حال کار است' : 'دستگاه غیرفعال یا آفلاین است',
    labelValue: isActive ? 'فعال' : 'غیرفعال'
  };

  return (
    <div className="w-full h-full bg-white border border-gray-100 rounded-lg shadow-sm p-4">
      <div className="text-right mb-4">
        <h3 className="text-gray-600 font-bold text-lg">وضعیت دستگاه</h3>
      </div>

      <div className="flex flex-col items-center justify-center mb-6">
        <div className="relative flex items-center justify-center w-20 h-20">
          <div className={`absolute inset-0 rounded-full opacity-60 scale-110 ${statusConfig.bgOpacity}`}></div>
          <div className={`relative w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg ${statusConfig.bgColor} shadow-current/20`}>
            {statusConfig.icon}
          </div>
        </div>
        <p className="mt-4 text-gray-400 text-sm font-medium text-center">
          {statusConfig.text}
        </p>
      </div>

      <div className="space-y-1">
        {[
          { 
            label: 'وضعیت', 
            value: statusConfig.labelValue, 
            icon: null, 
            color: statusConfig.color, 
            dot: true 
          },
          { 
            label: 'اتصال شبکه', 
            value: isPowerOn ? 'مستقر' : 'قطع شده', 
            icon: <Wifi size={16} />, 
            color: isPowerOn ? 'text-green-500' : 'text-red-500' 
          },
        ].map((item, index) => (
          <div 
            key={index} 

            className={`flex justify-between items-center py-2 ${index !== 1 ? 'border-b border-gray-50' : ''}`}
          >
            <span className="text-gray-400 text-sm font-medium">{item.label}</span>
            <div className={`flex items-center gap-2 ${item.color} text-sm font-semibold`}>
              {item.dot && <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>}
              {item.icon && <span className="text-gray-400">{item.icon}</span>}
              <span>{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceStatusCard;