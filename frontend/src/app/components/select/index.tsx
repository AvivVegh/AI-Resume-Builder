import React from "react";
import { Select } from "antd";
import type { SelectProps } from "antd";

const options: SelectProps["options"] = [];

for (let i = 10; i < 36; i++) {
  options.push({
    value: i.toString(36) + i,
    label: i.toString(36) + i,
  });
}

const SkillsSelect: React.FC = () => (
  <Select
    mode="tags"
    style={{ width: "100%" }}
    tokenSeparators={[","]}
    options={options}
  />
);

export default SkillsSelect;
