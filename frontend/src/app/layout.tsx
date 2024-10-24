"use client";

import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

axios.interceptors.request.use(function (config: any) {
  if (config.url?.includes("auth")) {
    return config;
  }

  const token = localStorage?.getItem("id_token");

  if (!config) {
    config = {};
  }

  if (!config.headers) {
    config.headers = {};
  }

  if (config.headers["noCredentials"] === "true") {
    return config;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  useEffect(() => {
    const isAuth = localStorage.getItem("is_authenticated");
    if (isAuth) {
      router.push("/home");
    } else {
      router.push("/login");
    }
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-100`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
