export const formatToPersianDate = (dateString: string | Date) => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    
    // استفاده از Intl برای تبدیل تاریخ به شمسی
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "تاریخ نامعتبر";
  }
};