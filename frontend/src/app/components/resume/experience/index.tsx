"use client";
import React from "react";
import { Divider, Typography } from "antd";

const Experience = ({
  title = "Experience",
  experiences,
}: {
  title: string;
  experiences: {
    company: string;
    jobDetails: string;
    title?: string;
    dates?: string;
  }[];
}) => {
  return (
    <div className="flex-row">
      <Divider orientation="left"> {title}</Divider>

      <div className="flex-wrap">
        {experiences.map((experience, i) => {
          return (
            <div key={i}>
              <Typography>{experience.company}</Typography>
              {experience.dates && <Typography>{experience.dates}</Typography>}
              {experience.title && <Typography>{experience.title}</Typography>}
              <Typography>{experience.jobDetails}</Typography>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Experience;
