import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from "sonner";
import { CheckCircle, CircleAlert, Info, TriangleAlert } from "lucide-react";

import { ThemeProvider } from "@/context/theme-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Orbit – Chat Platform",
    template: "%s | Orbit",
  },
  description: "Connect with friends, build communities, and chat in real time with Orbit.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="noir"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider>{children}</ThemeProvider>

        <Toaster
          position="top-right"
          icons={{
            success: <CheckCircle size={18} className="text-success" />,
            error: <CircleAlert size={18} className="text-danger" />,
            info: <Info size={18} className="text-accent" />,
            warning: <TriangleAlert size={18} className="text-warning" />,
          }}
          toastOptions={{
            style: {
              background: "var(--surface)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
            },
            classNames: {
              success: "!border-success/30",
              error: "!border-danger/30",
              info: "!border-accent/30",
              warning: "!border-warning/30",
            },
          }}
        />
      </body>
    </html>
  );
}
