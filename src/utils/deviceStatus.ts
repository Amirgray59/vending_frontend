export interface DeviceStatusInfo {
  label: string;
  message: string;
  textColor: string;
  bgColor: string;
  bgOpacity: string;
  badgeClass: string;
  dotClass: string;
}

const DEVICE_STATUS_INFO: Record<string, DeviceStatusInfo> = {
  pending: {
    label: "در انتظار",
    message: "دستگاه در انتظار اتصال است",
    textColor: "text-amber-600",
    bgColor: "bg-amber-500",
    bgOpacity: "bg-amber-100",
    badgeClass: "bg-amber-100 text-amber-700",
    dotClass: "bg-amber-500",
  },
  online: {
    label: "آنلاین",
    message: "دستگاه آنلاین است",
    textColor: "text-green-600",
    bgColor: "bg-green-500",
    bgOpacity: "bg-green-100",
    badgeClass: "bg-green-100 text-green-700",
    dotClass: "bg-green-500",
  },
  offline: {
    label: "آفلاین",
    message: "دستگاه آفلاین است",
    textColor: "text-red-600",
    bgColor: "bg-red-500",
    bgOpacity: "bg-red-100",
    badgeClass: "bg-red-100 text-red-700",
    dotClass: "bg-red-500",
  },
  disabled: {
    label: "غیرفعال",
    message: "دستگاه غیرفعال است",
    textColor: "text-gray-500",
    bgColor: "bg-gray-500",
    bgOpacity: "bg-gray-100",
    badgeClass: "bg-gray-100 text-gray-600",
    dotClass: "bg-gray-400",
  },
  maintenance: {
    label: "در تعمیر",
    message: "دستگاه در حال تعمیر است",
    textColor: "text-orange-600",
    bgColor: "bg-orange-500",
    bgOpacity: "bg-orange-100",
    badgeClass: "bg-orange-100 text-orange-700",
    dotClass: "bg-orange-500",
  },
};

const UNKNOWN_DEVICE_STATUS: DeviceStatusInfo = {
  label: "نامشخص",
  message: "وضعیت دستگاه مشخص نیست",
  textColor: "text-gray-500",
  bgColor: "bg-gray-400",
  bgOpacity: "bg-gray-100",
  badgeClass: "bg-gray-100 text-gray-600",
  dotClass: "bg-gray-400",
};

export function getDeviceStatusInfo(
  status: string | null | undefined,
): DeviceStatusInfo {
  return status ? DEVICE_STATUS_INFO[status] ?? UNKNOWN_DEVICE_STATUS : UNKNOWN_DEVICE_STATUS;
}
