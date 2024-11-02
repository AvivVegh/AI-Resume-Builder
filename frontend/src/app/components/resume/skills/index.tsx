"use client";
import React from "react";
import { Divider, Tag } from "antd";

const Skills = ({ skiils }: { skiils: string[] }) => {
  return (
    <div className="flex-row">
      <Divider orientation="left">Skills</Divider>

      <div className="flex-wrap justify-center items-center">
        {skiils.map((skill, i) => {
          return <Tag key={i}>{skill}</Tag>;
        })}
      </div>
    </div>
  );
};

export default Skills;
