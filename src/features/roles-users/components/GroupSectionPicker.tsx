"use client";

import React, { useEffect, useMemo, useState } from "react";
import UseGetProfile from "@/shared/hooks/useGetProfile";
import UseGetLocations from "@/shared/hooks/useGetLocations";
import { useParams, useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import clientApi from "@/shared/clientApi/clientApi";
import AddNewButton from "@/components/ui/AddNewButton";
import { useUpdateUser } from "@/shared/hooks/useUpdateUser";
import useGetSingleUser from "@/shared/hooks/useGetSingleUser";

export default function PermissionPicker() {
  const { profile: manager, isgettingprofile: isGettingManager } =
    UseGetProfile();
  const { userId } = useParams();
  const { locations, isGettingLocations } = UseGetLocations();
  const { isUpdatingUser, updateUser } = useUpdateUser();
  const { isGettingUser, user } = useGetSingleUser(userId as string);
  const router = useRouter();

  // --- States ---
  const [targetUser, setTargetUser] = useState<any>(null);
  const [isLoadingTarget, setIsLoadingTarget] = useState(true);
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([]);
  const [selectedSectionIds, setSelectedSectionIds] = useState<string[]>([]);
  const [activeLocationId, setActiveLocationId] = useState<string | null>(null);
  const [locationSections, setLocationSections] = useState<
    Record<string, any[]>
  >({});
  const [loadingLocations, setLoadingLocations] = useState<
    Record<string, boolean>
  >({});

  const handleUpdateUser = async () => {
    if (user.id) {
      await updateUser(
        {
          id: user.id,
          data: {
            allowed_location_ids: selectedLocationIds,
            allowed_section_ids: selectedSectionIds,
          },
        },
        {
          onSuccess: () => {
            router.push("/roles-users");
          },
        },
      );
    }
  };

  useEffect(() => {
  if (user) {
    // استخراج آی‌دی‌های مجموعه‌ها و بخش‌ها از دیتای کاربر
    const initialLocations = user.allowed_location_ids || [];
    const initialSections = user.allowed_section_ids || [];

    setSelectedLocationIds(initialLocations);
    setSelectedSectionIds(initialSections);

    // اگر مجموعه‌ای انتخاب شده بود، اولین مورد را به عنوان تب فعال قرار بده
    if (initialLocations.length > 0) {
      setActiveLocationId(initialLocations[0]);
      // لود کردن بخش‌های مربوط به اولین مجموعه فعال
      fetchSections(initialLocations[0]);
    }
  }
}, [user]);

  // ۱. دریافت اطلاعات کاربر مقصد
  useEffect(() => {
    const fetchTargetUser = async () => {
      if (!userId) return;
      try {
        setIsLoadingTarget(true);
        const response = await clientApi.get(`/users/${userId}`);
        setTargetUser(response.data);
      } catch (e) {
        console.error("Error fetching target user", e);
      } finally {
        setIsLoadingTarget(false);
      }
    };
    fetchTargetUser();
  }, [userId]);

  // ۲. مدیریت لیست مجموعه‌های مجاز (اصلاح شده برای ساختار items و رول super_admin)
  const filteredLocations = useMemo(() => {
    if (!manager || !locations) return [];

    // استخراج آرایه از داخل آبجکت items یا خودِ locations
    const safeLocations = Array.isArray(locations)
      ? locations
      : (locations as any).items || [];

    if (manager.role === "location_manager") {
      const allowedIds =
        manager?.allowed_location_location_ids ||
        manager?.allowed_location_ids ||
        [];
      return safeLocations.filter((loc: any) => allowedIds.includes(loc.id));
    }

    // برای super_admin و سایر رول‌ها تمام لیست باز است
    return safeLocations;
  }, [manager, locations]);

  // ۳. دریافت بخش‌های یک مجموعه (بهینه شده برای جلوگیری از رندر کلی)
  const fetchSections = async (locId: string) => {
    if (!locId) return;
    if (locationSections[locId]) return; // کش کردن
    if (loadingLocations[locId]) return; // جلوگیری از درخواست تکراری همزمان

    setLoadingLocations((prev) => ({ ...prev, [locId]: true }));
    try {
      // حذف اسلش قبل از علامت سوال برای جلوگیری از ارور ۵۲۰
      const response = await clientApi.get(
        `/locations/sections/list?location_id=${locId}`,
      );

      // استخراج آیتم‌ها (سازگار با ساختار {items: [...]})
      const items = Array.isArray(response.data)
        ? response.data
        : response.data?.items || [];

      setLocationSections((prev) => ({ ...prev, [locId]: items }));
    } catch (e) {
      console.error("Error fetching sections:", e);
    } finally {
      setLoadingLocations((prev) => ({ ...prev, [locId]: false }));
    }
  };

  // ۴. منطق انتخاب مجموعه
  const toggleLocation = (locId: string) => {
    setSelectedLocationIds((prev) => {
      const isRemoving = prev.includes(locId);
      const nextLocations = isRemoving
        ? prev.filter((id) => id !== locId)
        : [...prev, locId];

      if (isRemoving) {
        const sectionsOfThisLoc = locationSections[locId] || [];
        const sectionIdsToRemove = sectionsOfThisLoc.map((s: any) => s.id);
        setSelectedSectionIds((prevSections) =>
          prevSections.filter((id) => !sectionIdsToRemove.includes(id)),
        );
      }
      return nextLocations;
    });

    setActiveLocationId(locId);
    fetchSections(locId);
  };

  // ۵. منطق انتخاب بخش
  const toggleSection = (secId: string) => {
    setSelectedSectionIds((prev) =>
      prev.includes(secId)
        ? prev.filter((id) => id !== secId)
        : [...prev, secId],
    );
  };

  const needsSectionSelection = targetUser?.role === "operator";

  if (isGettingManager || isLoadingTarget) {
    return (
      <div className="p-10 flex justify-center">
        <Skeleton count={3} />
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* پنل راست: انتخاب مجموعه‌ها */}
        <div className="rounded-lg border border-gray-100 p-4 shadow-sm bg-white">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-zinc-900">
              انتخاب مجموعه‌ها
            </h2>
            <p className="text-sm text-zinc-500">
              مجموعه‌های مجاز برای کاربر {targetUser?.name}
            </p>
          </div>
          <div className="space-y-3">
            {isGettingLocations ? (
              <Skeleton count={3} className="h-12 w-full rounded-xl" />
            ) : (
              filteredLocations.map((loc: any) => (
                <label
                  key={loc.id}
                  className="flex cursor-pointer items-center justify-between rounded-xl border border-zinc-200 px-4 py-3 hover:bg-zinc-50 transition"
                >
                  <span className="font-medium text-zinc-900">{loc.name}</span>
                  <input
                    type="checkbox"
                    checked={selectedLocationIds.includes(loc.id)}
                    onChange={() => toggleLocation(loc.id)}
                    className="h-5 w-5 accent-blue-600"
                  />
                </label>
              ))
            )}
          </div>
        </div>

        {/* پنل چپ: انتخاب بخش‌ها */}
        {needsSectionSelection && (
          <div className="rounded-lg border border-gray-100 p-4 shadow-sm bg-white">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-zinc-900">انتخاب بخش‌ها</h2>
              <p className="text-sm text-zinc-500">
                بخش‌های مربوط به مجموعه‌های انتخاب شده
              </p>
            </div>

            {selectedLocationIds.length === 0 ? (
              <div className="rounded-xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 text-center">
                ابتدا مجموعه‌ای را انتخاب کنید.
              </div>
            ) : (
              <div className="space-y-4">
                {/* تب‌های مجموعه‌های انتخاب شده */}
                <div className="flex flex-wrap gap-2">
                  {selectedLocationIds.map((locId) => (
                    <button
                      key={locId}
                      onClick={() => {
                        setActiveLocationId(locId);
                        fetchSections(locId);
                      }}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        activeLocationId === locId
                          ? "bg-blue-600 text-white"
                          : "bg-zinc-100 text-zinc-700"
                      }`}
                    >
                      {filteredLocations.find((l: any) => l.id === locId)
                        ?.name || "نامعلوم"}
                    </button>
                  ))}
                </div>

                {/* لیست بخش‌های گروه فعال */}
                <div className="rounded-xl border border-zinc-200 p-4 bg-zinc-50/50">
                  <h3 className="mb-3 font-semibold text-zinc-900">
                    {filteredLocations.find(
                      (l: any) => l.id === activeLocationId,
                    )?.name || "انتخاب کنید..."}
                  </h3>

                  <div className="space-y-2">
                    {loadingLocations[activeLocationId || ""] && (
                      <Skeleton count={3} className="h-12 w-full rounded-xl" />
                    )}

                    {(() => {
                      const currentSections =
                        locationSections[activeLocationId || ""] || [];
                      if (
                        currentSections.length === 0 &&
                        !loadingLocations[activeLocationId || ""]
                      ) {
                        return (
                          <div className="text-center text-zinc-400 text-sm py-4">
                            بخصی یافت نشد.
                          </div>
                        );
                      }
                      return currentSections.map((sec: any) => (
                        <label
                          key={sec.id}
                          className="flex cursor-pointer items-center justify-between rounded-xl border border-zinc-200 px-4 py-3 hover:bg-white transition"
                        >
                          <span className="text-zinc-900">{sec.name}</span>
                          <input
                            type="checkbox"
                            checked={selectedSectionIds.includes(sec.id)}
                            onChange={() => toggleSection(sec.id)}
                            className="h-5 w-5 accent-blue-600"
                          />
                        </label>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Btn Container */}
      <div className="mt-4">
        <AddNewButton
          onClick={handleUpdateUser}
          isLoading={isUpdatingUser}
          title="افزودن دسترسی"
        />
      </div>
    </div>
  );
}
