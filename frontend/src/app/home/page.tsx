"use client";

import { Button, Form } from "antd";
import TextArea from "antd/es/input/TextArea";
import { createResume, getProfile } from "../util/api";
import { useEffect, useState } from "react";
import { User } from "../models/user";

export default function HomePage() {
  const [form] = Form.useForm();
  const [profile, setProfile] = useState<User>();

  useEffect(() => {
    getProfile()
      .then((profile) => {
        setProfile(profile);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const createResumeHandler = async () => {
    const values = await form.validateFields();

    const resume = await createResume({
      jobDescription: values.jobDescription,
      resume: values.resume,
    });

    console.log(resume);
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
                    required: true,
                    message: "Please add your job description",
                  },
                ]}
              >
                <TextArea
                  style={{ resize: "none" }}
                  className="font-medium font-mono"
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
                  className="font-medium font-mono"
                  cols={70}
                  rows={20}
                  placeholder="please paste your resume,please include experience, education, projects, and skills..."
                />
              </Form.Item>
            </div>
          </div>
          <div className="flex justify-center items-center w-full">
            <Button
              className="font-title text-3xl font-medium text-center mt-5 p-5 bg-violet-900	text-white"
              onClick={createResumeHandler}
            >
              Create
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
