
import axios from 'axios';
import Cookies from 'js-cookie';

// ایجاد نمونه axios
const clientApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

// متغیرهای کمکی برای مدیریت رفرش توکن
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}> = [];


const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};


clientApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ۲. اینترسپتور پاسخ (Response Interceptor)
clientApi.interceptors.response.use(
  (response) => response, // اگر پاسخ موفق بود، مستقیماً برگردان
  async (error) => {
    const originalRequest = error.config;

    // اگر خطای 401 بود و قبلاً برای این درخواست تلاش مجدد نشده بود
    if (error.response?.status === 401 && !originalRequest._retry) {

      // اگر در حال حاضر یک درخواست رفرش در جریان است، این درخواست را در صف قرار بده
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return clientApi(originalRequest);
        })
        .catch((err) => Promise.reject(err));
      }

      // علامت‌گذاری برای جلوگیری از تکرار بی‌نهایت رفرش
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // خواندن رفرش توکن از لوکال استوریج
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
            throw new Error("Refresh token not found");
        }

        // درخواست رفرش توکن از سرور
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token: newAccessToken } = response.data;

        // ✅ گام حیاتی: آپدیت همزمان هر دو منبع ذخیره‌سازی
        // ۱. ذخیره در لوکال استوریج برای API-ها
        localStorage.setItem('accessToken', newAccessToken);
        // ۲. ذخیره در کوکی برای Middleware (جلوگیری از ریدایرکت اشتباه)
        Cookies.set('auth_token', newAccessToken, { expires: 7 });

        // پردازش صف درخواست‌های منتظر با توکن جدید
        processQueue(null, newAccessToken);

        // اجرای مجدد درخواست اصلی با توکن جدید
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return clientApi(originalRequest);

      } catch (refreshError) {
        // در صورت شکست رفرش توکن، تمام صف را با خطا ببند
        processQueue(refreshError, null);

        // ✅ پاک‌سازی کامل برای خروج کاربر

        localStorage.clear(); 
        Cookies.remove('auth_token'); 

        // هدایت کاربر به صفحه لاگین (استفاده از window.location برای اطمینان از رفرش کامل)
        if (typeof window !== 'undefined') {
            window.location.href = '/';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default clientApi;