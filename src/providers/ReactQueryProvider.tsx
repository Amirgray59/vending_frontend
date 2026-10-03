"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 دقیقه
            gcTime: 5 * 60 * 1000, // 5 دقیقه (تو نسخه 5 بجای cacheTime از gcTime استفاده میشه)
            retry: 1,
            refetchOnWindowFocus: false, // اگه نمیخوای با فوکوس پنجره دوباره درخواست بزنه
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}