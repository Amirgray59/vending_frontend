
export type Role = 'super_admin' | 'technical_support' | 'location_manager' | 'operator' | 'accounting' | 'central_viewer';

export enum PermissionLevel {
  LEVEL_1 = 1, // Full Access
  LEVEL_2 = 2, // Location-based
  LEVEL_3 = 3, // Section-based
  LEVEL_4 = 4, // Global Viewer (With Financials)
  LEVEL_5 = 5, // Global Viewer (No Financials)
}

export const ROLE_PERMISSIONS: Record<Role, { level: PermissionLevel; canEdit: boolean; canDelete: boolean; canCreate: boolean }> = {
  super_admin: { level: PermissionLevel.LEVEL_1, canEdit: true, canDelete: true, canCreate: true },
  technical_support: { level: PermissionLevel.LEVEL_1, canEdit: true, canDelete: true, canCreate: true },
  location_manager: { level: PermissionLevel.LEVEL_2, canEdit: true, canDelete: false, canCreate: true },
  operator: { level: PermissionLevel.LEVEL_3, canEdit: true, canDelete: false, canCreate: false },
  accounting: { level: PermissionLevel.LEVEL_4, canEdit: false, canDelete: false, canCreate: false },
  central_viewer: { level: PermissionLevel.LEVEL_5, canEdit: false, canDelete: false, canCreate: false },
};

// اصلاح ترتیب برای تطبیق با PermissionLevel
export const ROLE_OPTIONS = [
  { id: "1", label: "مدیر کل", value: "super_admin" },
  { id: "2", label: "پشتیبانی فنی", value: "technical_support" },
  { id: "3", label: "مدیر مجموعه", value: "location_manager" },
  { id: "4", label: "اپراتور", value: "operator" }, 
  { id: "5", label: "حسابدار", value: "accounting" }, 
  { id: "6", label: "پشتیبانی مرکزی", value: "central_viewer" }, 
];