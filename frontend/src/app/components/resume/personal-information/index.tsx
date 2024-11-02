"use client";
import React from "react";
import { Typography } from "antd";

const PersonalInformation = ({
  personalInformation,
}: {
  personalInformation: {
    fullName: string;
    title: string;
    email: string;
    linkedIn: string;
    github?: string;
    phoneNumber?: string;
    city?: string;
  };
}) => {
  return (
    <div className="flex-row">
      <Typography className="text-2xl	">
        {personalInformation.fullName}
      </Typography>
      <Typography className="text-xl	">{personalInformation.title}</Typography>
      <Typography>{personalInformation.linkedIn}</Typography>

      {personalInformation.github && (
        <Typography className="text-xs">
          {personalInformation.github}
        </Typography>
      )}

      {personalInformation.phoneNumber && (
        <Typography className="text-xs">
          {personalInformation.phoneNumber}
        </Typography>
      )}

      <Typography className="text-xs">{personalInformation.email}</Typography>

      {personalInformation.city && (
        <Typography className="text-xs">{personalInformation.city}</Typography>
      )}
    </div>
  );
};

export default PersonalInformation;
