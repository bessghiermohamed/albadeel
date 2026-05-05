import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "البديل — المدرسة العليا للأساتذة ENS",
  description:
    "منصة تعليمية بديلة متكاملة لطلبة المدرسة العليا للأساتذة بالجزائر، فرع PEP، تخصص الأدب العربي. البديل — Alternative educational platform for ENS Algeria students.",
  keywords: [
    "البديل",
    "albadeel",
    "ENS",
    "المدرسة العليا للأساتذة",
    "PEP",
    "الأدب العربي",
    "تعليم",
    "جزائر",
    "منصة تعليمية",
    "education",
    "Arabic",
    "RTL",
  ],
  authors: [{ name: "Besseghier Mohamed" }],
  icons: {
    icon: "/albadeel/favicon.ico",
  },
  openGraph: {
    title: "البديل — المدرسة العليا للأساتذة ENS",
    description:
      "منصة تعليمية بديلة متكاملة لطلبة المدرسة العليا للأساتذة بالجزائر، فرع PEP، تخصص الأدب العربي",
    url: "https://besseghiermohamed.github.io/albadeel/",
    siteName: "البديل",
    type: "website",
    locale: "ar_DZ",
    alternateLocale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "البديل — المدرسة العليا للأساتذة ENS",
    description:
      "منصة تعليمية بديلة متكاملة لطلبة المدرسة العليا للأساتذة بالجزائر",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.variable} font-sans antialiased bg-background text-foreground overflow-x-hidden`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
