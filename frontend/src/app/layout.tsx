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
  console.log("intercepting request", config);

  if (config?.url?.includes("auth")) {
    return config;
  }

  const token = localStorage.getItem("id_token");
  const userId = localStorage.getItem("user_id");

  console.log("token exists", token ? "yes" : "no");

  if (!config) {
    config = {};
  }

  if (!config.headers) {
    config.headers = {};
  }

  if (config.headers["noCredentials"] === "true") {
    return config;
  }

  if (userId) {
    config.headers["x-user-id"] = userId;
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
    // router.push("/profile");
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
