import { Loader2 } from "lucide-react";
import React from "react";

const FullPageLoader = () => {
  return (
    <div className=" fixed inset-0 bg-white flex items-center justify-center ">
      <Loader2 className=" animate-spin" />
    </div>
  );
};

export default FullPageLoader;
