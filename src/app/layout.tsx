import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SSideBar } from "./_components/side-bar";
import { Navbar } from "./_components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartSpend",
  description: "Manage your finances efficiently with SmartSpend.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex min-h-screen">
          <SSideBar />
          <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden w-full">
            <Navbar />{children}</div>
        </div>
      </body>
    </html>
  );
}
