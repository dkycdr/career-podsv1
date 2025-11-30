import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import FloatingChatBot from "@/components/FloatingChatBot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Career Pods - President University",
  description: "Explore careers together with curated pods. Get expert mentorship, discover opportunities, and build meaningful connections with peers.",
  keywords: ["Career Exploration", "Mentorship", "Student Pods", "President University", "Career Development"],
  authors: [{ name: "Career Pods Team" }],
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "Career Pods - President University",
    description: "Explore careers together through collaborative learning pods",
    url: "https://career-pods.vercel.app",
    siteName: "Career Pods",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Pods - President University",
    description: "Explore careers together through collaborative learning pods",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <FloatingChatBot />
        <Toaster />
      </body>
    </html>
  );
}
