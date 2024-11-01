"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Main() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const idToken = searchParams.get("id_token");
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");
    const userId = searchParams.get("user_id");

    if (idToken && accessToken && userId) {
      localStorage.setItem("id_token", idToken);
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("user_id", userId);

      if (refreshToken) {
        localStorage.setItem("refresh_token", refreshToken);
      }

      localStorage.setItem("is_authenticated", "true");
    }

    router.push("/login");
  }, []);

  return <></>;
}
