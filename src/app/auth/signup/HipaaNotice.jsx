import React from "react";
import { Alert, AlertTitle, AlertDescription } from "../../components/ui/alert";
import { AlertTriangle } from "lucide-react";

const HipaaNotice = () => {
  return (
    <Alert
      variant="destructive"
      className="border-amber-500 text-amber-800 bg-amber-50"
    >
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="font-medium">HIPAA Compliance Notice</AlertTitle>
      <AlertDescription className="text-sm">
        This application is designed for general health tracking and is NOT
        HIPAA compliant. While we take security and privacy seriously, this
        platform should not be used to store or transmit protected health
        information (PHI) as defined by HIPAA regulations. If you require HIPAA
        compliance for your practice, please seek alternative solutions.
      </AlertDescription>
    </Alert>
  );
};

export default HipaaNotice;
