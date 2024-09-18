import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const Widget = ({ name, data }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
<div className={`widget ${isExpanded ? 'expanded' : ''} relative rounded-lg`}>
  <h2>{name}</h2>
  <p>{data}</p>
  <Button
    onClick={toggleExpand}
    className="bg-[#34495e] hover:bg-[#2c3e50] text-white font-bold py-2 px-4 rounded-lg absolute top-2 right-2"
  >
    {isExpanded ? 'Less' : 'More'}
  </Button>
</div>

  );
};

export default Widget;
