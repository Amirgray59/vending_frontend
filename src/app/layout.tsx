import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import QueryProvider from "@/providers/ReactQueryProvider";
import { Toaster } from 'react-hot-toast'; 
import 'react-loading-skeleton/dist/skeleton.css'

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "سامانه مدیریت و کنترل وندینگ",
  description: "سامانه مدیریت و کنترل وندینگ",
};

const Vazir = localFont({
  src: [
    {
      path: "../../public/fonts/5c53f1a72f61b5b51e2ea79a22ebc38b.woff2",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--font-vazir",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      className={cn("h-full", "antialiased", "font-sans", geist.variable)}
    >
      <body className={`bg-[#FAFBFD] ${Vazir.variable}`} dir="rtl">
        <Toaster/>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
