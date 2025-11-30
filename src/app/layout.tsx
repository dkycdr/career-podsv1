import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import FloatingChatBot from "@/components/FloatingChatBot";

// Using system fonts instead of Google Fonts to avoid network dependency

export const metadata: Metadata = {
  title: "Career Pods - President University",
  description: "Discover and join career pods at President University. Connect with mentors, develop skills, and explore career opportunities through interactive pod-based learning.",
  keywords: ["Career Pods", "President University", "Mentorship", "Skills Development", "Career Exploration", "Student Network"],
  authors: [{ name: "Career Pods Team" }],
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "Career Pods - President University",
    description: "Connect with mentors and explore career opportunities through pods",
    siteName: "Career Pods",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Pods",
    description: "Connect with mentors and explore career opportunities",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="antialiased bg-background text-foreground">
        {children}
        <FloatingChatBot />
        <Toaster />
      </body>
    </html>
  );
}
