export interface InventoryHistoryItem {
  id?: string | null;
  created_at?: string | null;
  before_level?: number | null;
  after_level?: number | null;
  delta?: number | null;
}

export interface InventoryPercentagePoint {
  date: string;
  day: string;
  percentage: number | null;
  tooltipLabel?: string;
}

export interface InventoryDeltaPoint {
  date: string;
  day: string;
  delta: number | null;
  tooltipLabel?: string;
}

interface InventorySnapshot {
  item: InventoryHistoryItem;
  timestamp: number;
  level: number;
}

function toFiniteNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function getInventorySnapshots(
  items: InventoryHistoryItem[] | undefined,
): InventorySnapshot[] {
  const sortedItems = (items ?? [])
    .map((item) => ({
      item,
      timestamp: item.created_at ? Date.parse(item.created_at) : Number.NaN,
    }))
    .filter(({ timestamp }) => Number.isFinite(timestamp))
    .sort((a, b) => a.timestamp - b.timestamp);

  let previousLevel: number | null = null;

  return sortedItems.flatMap(({ item, timestamp }) => {
    const beforeLevel = toFiniteNumber(item.before_level);
    const afterLevel = toFiniteNumber(item.after_level);
    const delta = toFiniteNumber(item.delta);
    const resolvedLevel =
      afterLevel ??
      (beforeLevel !== null && delta !== null
        ? beforeLevel + delta
        : previousLevel !== null && delta !== null
          ? previousLevel + delta
          : beforeLevel);

    if (resolvedLevel === null) return [];
    previousLevel = resolvedLevel;
    return [{ item, timestamp, level: resolvedLevel }];
  });
}

export function getDailyInventoryDeltaChartData(
  items: InventoryHistoryItem[] | undefined,
  days = 7,
  now = new Date(),
): InventoryDeltaPoint[] {
  const dayNames = [
    "یکشنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
    "پنجشنبه",
    "جمعه",
    "شنبه",
  ];
  const today = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  const dayMilliseconds = 24 * 60 * 60 * 1000;
  const firstDayStart = today.getTime() - (days - 1) * dayMilliseconds;
  const finalDayEnd = today.getTime() + dayMilliseconds - 1;
  const dailyChanges = new Map<
    string,
    { delta: number; hasDelta: boolean }
  >();
  let hasChangesInRange = false;

  (items ?? []).forEach((item) => {
    const timestamp = item.created_at ? Date.parse(item.created_at) : Number.NaN;
    if (!Number.isFinite(timestamp)) return;

    const dateKey = new Date(timestamp).toISOString().slice(0, 10);
    if (timestamp < firstDayStart || timestamp > finalDayEnd) return;

    hasChangesInRange = true;
    const current = dailyChanges.get(dateKey) ?? { delta: 0, hasDelta: false };
    const itemDelta = toFiniteNumber(item.delta);
    if (itemDelta !== null) {
      current.delta += itemDelta;
      current.hasDelta = true;
    }
    dailyChanges.set(dateKey, current);
  });

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today);
    date.setUTCDate(today.getUTCDate() - (days - index - 1));
    const dateKey = date.toISOString().slice(0, 10);
    const dailyChange = dailyChanges.get(dateKey);

    return {
      date: dateKey,
      day: dayNames[date.getUTCDay()],
      delta: !hasChangesInRange
        ? null
        : dailyChange?.hasDelta
          ? dailyChange.delta
          : dailyChange
            ? null
            : 0,
    };
  });
}

export function getAllInventoryDeltaChartData(
  items: InventoryHistoryItem[] | undefined,
): InventoryDeltaPoint[] {
  const dateTimeFormatter = new Intl.DateTimeFormat("fa-IR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const fullDateTimeFormatter = new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  return (items ?? [])
    .map((item, index) => ({
      item,
      index,
      timestamp: item.created_at ? Date.parse(item.created_at) : Number.NaN,
    }))
    .filter(({ timestamp }) => Number.isFinite(timestamp))
    .sort((a, b) => a.timestamp - b.timestamp || a.index - b.index)
    .map(({ item, timestamp }) => {
      const date = new Date(timestamp);
      return {
        date: date.toISOString(),
        day: dateTimeFormatter.format(date),
        tooltipLabel: fullDateTimeFormatter.format(date),
        delta: toFiniteNumber(item.delta),
      };
    });
}

export function getInventoryPercentageChartData(
  items: InventoryHistoryItem[] | undefined,
  inventoryCapacity: number | string | null | undefined,
  days = 7,
  now = new Date(),
): InventoryPercentagePoint[] {
  const capacity = toFiniteNumber(inventoryCapacity);
  if (capacity === null || capacity <= 0) return [];

  const dayNames = [
    "یکشنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
    "پنجشنبه",
    "جمعه",
    "شنبه",
  ];

  const snapshots = getInventorySnapshots(items);

  const today = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  let snapshotIndex = 0;
  let lastKnownLevel: number | null = null;

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today);
    date.setUTCDate(today.getUTCDate() - (days - index - 1));
    const dateKey = date.toISOString().slice(0, 10);
    const dayEnd = date.getTime() + 24 * 60 * 60 * 1000 - 1;

    while (
      snapshotIndex < snapshots.length &&
      snapshots[snapshotIndex].timestamp <= dayEnd
    ) {
      lastKnownLevel = snapshots[snapshotIndex].level;
      snapshotIndex += 1;
    }

    return {
      date: dateKey,
      day: dayNames[date.getUTCDay()],
      percentage:
        lastKnownLevel === null ? null : (lastKnownLevel / capacity) * 100,
    };
  });
}

export function getAllInventoryPercentageChangesChartData(
  items: InventoryHistoryItem[] | undefined,
  inventoryCapacity: number | string | null | undefined,
): InventoryPercentagePoint[] {
  const capacity = toFiniteNumber(inventoryCapacity);
  if (capacity === null || capacity <= 0) return [];

  const dateTimeFormatter = new Intl.DateTimeFormat("fa-IR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const fullDateTimeFormatter = new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  return getInventorySnapshots(items).map(({ timestamp, level }) => {
    const date = new Date(timestamp);
    return {
      date: date.toISOString(),
      day: dateTimeFormatter.format(date),
      tooltipLabel: fullDateTimeFormatter.format(date),
      percentage: (level / capacity) * 100,
    };
  });
}
