import React, { useState } from "react";
import { MultiSelect } from "react-multi-select-component";

const options = [
  { label: "Grapes 🍇", value: "grapes" },
  { label: "Mango 🥭", value: "mango" },
  { label: "Strawberry 🍓", value: "strawberry", disabled: true },
];

const Example = () => {
  const [selected, setSelected] = useState([]);

  return (
    <MultiSelect
      options={options}
      value={selected}
      onChange={setSelected}
      labelledBy="Select"
    />
  );
};

export default Example;
