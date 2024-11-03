"use client";

import { Button, Form, Spin } from "antd";
import TextArea from "antd/es/input/TextArea";
import { createResume, getProfile } from "../util/api";
import { useEffect, useState } from "react";
import { User } from "../models/user";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [form] = Form.useForm();
  const [profile, setProfile] = useState<User>();
  const [resume, setResume] = useState<any>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getProfile()
      .then((profile) => {
        form.setFieldsValue({
          resume: profile.resume,
        });

        setProfile(profile);
        const storedResume = localStorage.getItem("resume");
        const lastGeneratedResume = storedResume
          ? JSON.parse(storedResume)
          : null;
        setResume(lastGeneratedResume);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const createResumeHandler = async () => {
    const values = await form.validateFields();

    setLoading(true);

    const result = await createResume({
      jobDescription: values.jobDescription,
      resume: values.resume,
    });

    setLoading(false);

    if (!result) {
      console.log("Failed to create resume");
      return;
    }

    setResume(result);
    localStorage.setItem("resume", JSON.stringify(result));

    console.log("Resume created successfully");
  };

  const viewResumeHandler = async () => {
    router.push("/resume");
  };

  return (
    <div className="bg-gray-100 m-20">
      <div className="flex-row h-full	w-full">
        <h1 className="font-title text-3xl font-medium text-center mt-20 ">
          Hi {profile?.firstName}
        </h1>
        <h1 className="font-title text-3xl font-medium text-center mt-5">
          Let`s create your personalized resume!
        </h1>

        <Form form={form} onFinish={createResumeHandler}>
          <div className="flex justify-center items-center h-full w-full mt-10">
            <div className="flex gap-x-3 ">
              <Form.Item
                name="jobDescription"
                rules={[
                  {
                    required: false,
                    message: "Please add your job description",
                  },
                ]}
              >
                <TextArea
                  style={{ resize: "none" }}
                  className="font-medium font-mono focus:border-violet-900 hover:border-violet-900"
                  cols={70}
                  rows={20}
                  placeholder="please add your job description..."
                />
              </Form.Item>

              <Form.Item
                name="resume"
                rules={[
                  {
                    required: true,
                    message: "Please paste your resume",
                  },
                ]}
              >
                <TextArea
                  style={{ resize: "none" }}
                  className="font-medium font-mono focus:border-violet-900 hover:border-violet-900"
                  cols={70}
                  rows={20}
                  placeholder="please paste your resume, please include the following details: personal details (full name, linkedin, gmail, phone number, city) experience, education, projects, and skills..."
                />
              </Form.Item>
            </div>
          </div>
          <div className="relative flex justify-center items-center w-full">
            <Button
              className="font-title text-3xl font-medium text-center mt-5 p-5 bg-violet-900	text-white"
              onClick={createResumeHandler}
              disabled={loading}
            >
              Create
            </Button>
            <div className="absolute top-1/2">
              <Spin spinning={loading}></Spin>
            </div>
          </div>
          {resume && (
            <div className="flex justify-center items-center w-full">
              <Button
                className="font-title text-3xl font-medium text-center mt-5 p-5 bg-violet-900	text-white"
                onClick={viewResumeHandler}
              >
                View Resume
              </Button>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
}
