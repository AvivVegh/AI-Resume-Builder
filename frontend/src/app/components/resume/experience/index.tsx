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
            <div key={i} className="mt-1">
              <div className="flex flex-row items-baseline">
                <Typography className="text-xl">
                  {experience.company}
                </Typography>
                {experience.dates && (
                  <Typography className="text-xs ml-1">
                    {experience.dates}
                  </Typography>
                )}
              </div>
              {experience.title && (
                <Typography className="text-l">{experience.title}</Typography>
              )}
              <Typography className="text-xs">
                {experience.jobDetails}
              </Typography>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Experience;
