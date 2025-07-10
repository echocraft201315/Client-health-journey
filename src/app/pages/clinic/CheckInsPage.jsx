import React from "react";
import { Card } from "../../components/ui/card";

import ClinicCheckIns from "../../components/check-ins/ClinicCheckIns";

const CheckInsPage = () => {

  return (
    <div className="px-2 sm:px-4 md:px-6 py-4 w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Check-ins</h1>
        <p className="text-gray-500">Review all client check-ins</p>
      </div>

      <Card className="px-2 sm:px-6">
        <ClinicCheckIns />
      </Card>
    </div>
  );
};

export default CheckInsPage;
