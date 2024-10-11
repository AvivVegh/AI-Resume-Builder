"use client";

import { Form, Input, Modal } from "antd";
import { useState } from "react";

export default function HomePage() {
  const [open, setOpen] = useState(true);
  const [modalText, setModalText] = useState("Content of the modal");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };
  const handleOk = (values: any) => {
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
          // style={{ top: 100 }}
          open={open}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          animation={false}
        >
          {/* <p>{modalText}</p> */}
          <Form form={form} onFinish={handleOk}>
            <Form.Item
              name="linkedin profile url"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input placeholder="linkedin profile url" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
