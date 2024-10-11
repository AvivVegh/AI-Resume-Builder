"use client";

import { Button, Form } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { createResume } from "../lib/api";

export default function HomePage() {
  const [open, setOpen] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setOpen(true);
  }, []);

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };
  const handleOk = async () => {
    const values = await form.validateFields();

    setModalText("The modal will be closed after two seconds");
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const createResumeHandler = async () => {
    const values = await form.validateFields();

    const resume = await createResume({
      jobDescription: values.jobDescription,
      resume: values.resume,
    });
  };

  return (
    <div className="bg-gray-100 m-20">
      <div className="flex-row h-full	w-full">
        <h1 className="font-title text-3xl font-medium text-center mt-20 ">
          Let's create your personalized resume!
        </h1>

        <Form form={form} onFinish={createResumeHandler}>
          <div className="flex justify-center items-center w-full">
            <Button
              className="font-title text-3xl font-medium text-center mt-10 p-5 bg-violet-900	text-white"
              onClick={createResumeHandler}
            >
              Create
            </Button>
          </div>
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
                  placeholder="please paste your resume..."
                />
              </Form.Item>
            </div>
          </div>
        </Form>

        {/* <Modal
          className=" top-1/3"
          title="Title"
          open={open}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          animation={false}
        >
          <Form form={form} onFinish={handleOk}>
            <Form.Item
              name="linkedinProfileUrl"
              rules={[
                {
                  required: true,
                  message: "Please put your linkedin profile url",
                },
              ]}
            >
              <Input placeholder="linkedin profile url" />
            </Form.Item>
            <Form.Item
              name="linkedinProfileUrl2"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input placeholder="linkedin profile url2" />
            </Form.Item>
          </Form>
        </Modal> */}
      </div>
    </div>
  );
}
