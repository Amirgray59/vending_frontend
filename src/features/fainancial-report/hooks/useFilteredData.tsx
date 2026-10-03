
import { useMemo } from "react";
import moment from "moment"; // استفاده از moment معمولی چون دیتا میلادی است

export const useFilteredData = (data: any[], filters: any) => {
  return useMemo(() => {
    if (!data) return [];

    return data.filter((item) => {
      // ۱. فیلتر جستجو (Search Query)
      if (filters.searchQuery && filters.searchQuery.trim() !== "") {
        const query = filters.searchQuery.toLowerCase().trim();
        const matches = 
          item.device_name?.toLowerCase().includes(query) ||
          item.device_code?.toLowerCase().includes(query) ||
          item.id?.toLowerCase().includes(query);
        if (!matches) return false;
      }

      // ۲. فیلتر مجموعه (ID به ID)
      const isAllPlaces = !filters.places || filters.places === "all" || filters.places === "";
      if (!isAllPlaces && item.location_id !== filters.places) {
        return false;
      }

      // ۳. فیلتر بخش (ID به ID)
      const isAllSections = !filters.sections || filters.sections === "all" || filters.sections === "";
      if (!isAllSections && item.section_id !== filters.sections) {
        return false;
      }

      // ۴. فیلتر تاریخ (مقایسه مستقیم ISO میلادی)
      if (item.occurred_at) {
        const itemMoment = moment(item.occurred_at);

        if (filters.fromDate && filters.fromDate !== "") {
          // چون filters.fromDate خودش ISO است، مستقیماً با moment لود می‌شود
          const startMoment = moment(filters.fromDate).startOf("day");
          if (itemMoment.isBefore(startMoment)) return false;
        }

        if (filters.toDate && filters.toDate !== "") {
          const endMoment = moment(filters.toDate).endOf("day");
          if (itemMoment.isAfter(endMoment)) return false;
        }
      }

      // ۵. فیلتر زمان (مدیریت رشته‌های HH:mm)
      if (item.occurred_at) {
        const itemTimeStr = moment(item.occurred_at).format("HH:mm");
        const [iH, iM] = itemTimeStr.split(":").map(Number);
        const itemTotalMins = iH * 60 + iM;

        // بررسی زمان شروع (startTime است حالا یک رشته مثل "08:30")
        if (filters.startTime && filters.startTime !== "") {
          const [sH, sM] = filters.startTime.split(":").map(Number);
          if (!isNaN(sH)) {
            const startTotalMins = sH * 60 + (sM || 0);
            if (itemTotalMins < startTotalMins) return false;
          }
        }

        // بررسی زمان پایان (endTime است حالا یک رشته مثل "17:30")
        if (filters.endTime && filters.endTime !== "") {
          const [eH, eM] = filters.endTime.split(":").map(Number);
          if (!isNaN(eH)) {
            const endTotalMins = eH * 60 + (eM || 0);
            if (itemTotalMins > endTotalMins) return false;
          }
        }
      }

      return true;
    });
  }, [data, filters]);
};