"use client";

import { Form } from "antd";

import { useEffect, useState } from "react";
import Resume from "../components/resume";

export default function ResumePage() {
  const [form] = Form.useForm();
  const [resume, setResume] = useState<any>(null);

  useEffect(() => {
    const resumeStr = localStorage.getItem("resume");
    console.log("fdsfdfsdfsd", resumeStr);
    setResume(resumeStr ? JSON.parse(resumeStr) : null);
  }, []);

  return (
    <div>
      <div className="mt-4 mb-4 w-6/12 m-auto justify-center items-center ">
        {resume && <Resume resume={resume} />}
      </div>
    </div>
  );
}
