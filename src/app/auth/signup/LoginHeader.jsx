import React from "react";
import { Weight } from "lucide-react";

const LoginHeader = () => {
  return (
    <div className="flex flex-col items-center mb-6">
      <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mb-4">
        <Weight className="h-8 w-8 text-white" />
      </div>
      <h1 className="text-2xl font-bold text-center text-gray-800">
        Client Health Tracker™
      </h1>
      <p className="text-gray-500 text-center mt-1">Log in to your account</p>
    </div>
  );
};

export default LoginHeader;
