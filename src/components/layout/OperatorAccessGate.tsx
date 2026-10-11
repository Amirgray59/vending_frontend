"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UseGetProfile from "@/shared/hooks/useGetProfile";

import { canSeeFinancials } from "@/shared/permisseions/permissionUtils";

interface OperatorAccessGateProps {
  children: React.ReactNode;
}

export default function OperatorAccessGate({
  children,
}: OperatorAccessGateProps) {
  const pathname = usePathname();
  const { profile, isgettingprofile } = UseGetProfile();

  if (isgettingprofile || !profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  const normalizedPath = pathname.replace(/\/$/, "") || "/";
  const pathSegments = normalizedPath.split("/").filter(Boolean);
  const reservedDeviceRoutes = new Set([
    "bulk-device-operations",
    "devices-fainancial-report",
    "devices-inventory-reports",
  ]);
  const isDeviceList = normalizedPath === "/devices";
  const isDeviceDetails =
    pathSegments.length === 2 &&
    pathSegments[0] === "devices" &&
    !reservedDeviceRoutes.has(pathSegments[1]);
  const isAllowedOperatorPath = isDeviceList || isDeviceDetails;
  const isFinancialPath =
    normalizedPath === "/financial-report" ||
    normalizedPath.startsWith("/financial-report/") ||
    normalizedPath === "/devices/devices-fainancial-report";
  const cannotAccessFinancialPath =
    isFinancialPath && !canSeeFinancials(profile.role);

  if (
    cannotAccessFinancialPath ||
    (profile.role === "operator" && !isAllowedOperatorPath)
  ) {
    return (
      <main
        className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-6 text-center"
        dir="rtl"
      >
        <h1 className="text-lg font-bold text-slate-800">دسترسی به این بخش ندارید</h1>
        <p className="text-sm text-slate-500">
          {profile.role === "operator"
            ? "اپراتور فقط می‌تواند موجودی دستگاه‌ها را افزایش دهد."
            : "نقش شما اجازه مشاهده گزارش مالی را ندارد."}
        </p>
        <Link
          href="/devices"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          رفتن به فهرست دستگاه‌ها
        </Link>
      </main>
    );
  }

  return children;
}
