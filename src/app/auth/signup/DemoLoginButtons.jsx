import React from "react";
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { InfoIcon } from "lucide-react";

// Constant for demo clinic ID
const DEMO_CLINIC_ID = "65196bd4-f754-4c4e-9649-2bf478016701";

const DemoLoginButtons = () => {
  return (
    <div className="mt-8">
      <p className="text-sm text-center text-gray-500 mb-4">
        Quick Demo Account Access
      </p>

      <Alert className="mb-4 bg-yellow-50 border-yellow-200">
        <InfoIcon className="h-4 w-4 text-yellow-800" />
        <AlertTitle className="text-yellow-800">Demo Accounts</AlertTitle>
        <AlertDescription className="text-xs text-yellow-800">
          Use these buttons to instantly access demo accounts. All demo accounts
          use the password "password123". Coach can also use
          "support@practicenaturals.com" and Client can use
          "drjerry@livingbetterhealthcare.com" as alternative demo emails.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="text-xs">
          Login as Coach
        </Button>
        <Button variant="outline" className="text-xs">
          Login as Client
        </Button>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-3">
        <Button variant="outline" className="text-xs">
          Login as Alt Coach
        </Button>
        <Button variant="outline" className="text-xs">
          Login as Alt Client
        </Button>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-3">
        <Button variant="outline" className="text-xs">
          Login as Clinic Admin
        </Button>
      </div>
    </div>
  );
};

export default DemoLoginButtons;
