"use client";

import { Form, Input, Modal } from "antd";
import { useEffect, useState } from "react";

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
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div>
        <h1 className="font-title text-3xl font-medium text-center">
          Hello world
        </h1>

        <Modal
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
        </Modal>
      </div>
    </div>
  );
}
