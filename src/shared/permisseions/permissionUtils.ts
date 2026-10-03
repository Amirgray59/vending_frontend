
import { ROLE_PERMISSIONS, Role, PermissionLevel } from './roles';

// تابع کمکی برای دریافت ایمن دسترسی‌های یک نقش
const getPermissions = (role: string | undefined) => {
  if (!role) return null;
  return ROLE_PERMISSIONS[role as Role] || null;
};

export const hasActionPermission = (role: string | undefined, action: 'canEdit' | 'canDelete' | 'canCreate') => {
  const permissions = getPermissions(role);
  return permissions ? permissions[action] : false;
};

export const hasMinLevel = (role: string | undefined, minLevel: PermissionLevel) => {
  const permissions = getPermissions(role);
  if (!permissions) return false;
  
  // لول‌های کمتر (مثلاً 1 و 2) دسترسی بیشتری نسبت به لول‌های بالاتر (مثلاً 4 و 5) دارند
  return permissions.level <= minLevel;
};

export const canSeeFinancials = (role: string | undefined) => {
  // لول 4 (حسابدار) و لول‌های بالاتر از آن (1, 2, 3) اجازه دیدن مالی را دارند
  return hasMinLevel(role, PermissionLevel.LEVEL_4);
};