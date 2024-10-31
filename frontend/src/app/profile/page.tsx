"use client";

import { Button, Form, Input, DatePicker } from "antd";

import { createResume, getProfile } from "../util/api";
import { useEffect, useState } from "react";
import { User } from "../models/user";
import SkillsSelect from "../components/select";

export default function ProfilePage() {
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
    <div className="bg-gray-100 m-10">
      <div className="flex-row h-full	w-full">
        <h1 className="font-title text-3xl font-medium text-center mt-20 ">
          Hi {profile?.firstName}
        </h1>

        <Form
          form={form}
          onFinish={createResumeHandler}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            label="Input"
            name="Input"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="RangePicker"
            name="RangePicker"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item
            label="Skills"
            name="SkillsSelcet"
            rules={[{ required: true, message: "Please add skills" }]}
          >
            <SkillsSelect />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          </Form.Item>
        </Form>
        {/* <Form form={form} onFinish={createResumeHandler}>
          <div className="flex justify-center items-center h-full w-full mt-10">
            <div className="flex gap-x-3 ">
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
                  placeholder="please paste your resume..."
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
        </Form> */}
      </div>
    </div>
  );
}
