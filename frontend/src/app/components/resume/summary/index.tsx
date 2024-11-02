"use client";
import React from "react";
import { Divider, Typography } from "antd";

const Summary = ({ text }: { text: string }) => {
  return (
    <div className="flex-row">
      <Divider orientation="left">Summary</Divider>
      <Typography>{text}</Typography>
    </div>
  );
};

export default Summary;
