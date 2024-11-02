"use client";
import React from "react";
import { Divider, Typography } from "antd";

const Education = ({ educations }: { educations: string[] }) => {
  return (
    <div className="flex-row">
      <Divider orientation="left">Education</Divider>

      <div className="flex-wrap justify-center items-center">
        {educations.map((education, i) => {
          return (
            <div key={i}>
              <Typography>{education}</Typography>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Education;
