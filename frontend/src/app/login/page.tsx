"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authUrl } from "../util/api";
import { GooglePlusOutlined } from "@ant-design/icons";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      router.push("/home");
    }
  }, []);

  const onSigninClick = () => {
    let redirectUrl = authUrl;
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    const isAuth = localStorage.getItem("is_authenticated");

    const queryParams = new URLSearchParams();
    if (refreshToken) {
      queryParams.append("refresh-token", refreshToken);
    }
    if (isAuth) {
      queryParams.append("is-authenticated", isAuth);
    }

    if (accessToken) {
      queryParams.append("access-token", accessToken);
    }

    redirectUrl += `?${queryParams.toString()}`;

    location.href = redirectUrl;
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center">
        <h1 className="font-title text-3xl font-medium text-center">
          Welcome to AI Resume Builder
        </h1>
        <p className="font-title text-l text-pretty w-2/4 font-medium text-center mt-10 ">
          {`We’re excited to have you here! Our AI Resume Builder is designed to simplify and enhance your job application process. Whether you're a seasoned professional or just starting out, our tool will guide you in crafting a polished, professional resume that stands out from the crowd. 
          Using the power of AI, we tailor each section of your resume to highlight your skills, experience, and achievements in a way that resonates with recruiters and hiring managers. Say goodbye to hours of formatting and writing—let our intelligent platform do the heavy lifting for you.
          Get ready to showcase your talents and take the next step in your career journey with confidence!`}
        </p>
        <div className="flex flex-row justify-center items-center mt-5">
          <div
            className="flex flex-wrap border-2 p-1 bg-white hover:bg-red-600 cursor-pointer"
            onClick={onSigninClick}
          >
            <p className="font-medium text-l mr-1">Sign in with</p>
            <GooglePlusOutlined className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
