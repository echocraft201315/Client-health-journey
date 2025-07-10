import React from 'react';
import { Card, CardContent } from "../../../components/ui/card";

const DripLoadingCard = () => {
  return (
    <Card className="mb-6 w-full max-w-full">
      <CardContent className="py-6 px-2 sm:px-6 text-center">
        <p className="text-gray-500 text-sm sm:text-base">Loading today's message...</p>
      </CardContent>
    </Card>
  );
};

export default DripLoadingCard;
