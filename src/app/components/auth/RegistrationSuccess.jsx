import { CheckCircle, ExternalLink, CreditCard } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import GHLPaymentLink from "../ui/GHLPaymentLink";

const RegistrationSuccess = ({ 
  clinicName, 
  planName, 
  ghlPaymentLink, 
  onContinue 
}) => {
  const handlePaymentClick = () => {
    if (ghlPaymentLink) {
      window.open(ghlPaymentLink, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Registration Successful!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Welcome to Client Health Tracker, <strong>{clinicName}</strong>! 
            Your account has been created successfully.
          </p>

          {ghlPaymentLink && (
            <div className="mb-6">
              <GHLPaymentLink 
                paymentLink={ghlPaymentLink}
                planName={planName}
              />
            </div>
          )}

          <div className="mt-6 text-sm text-gray-500">
            <p>
              You can complete your payment at any time by clicking the payment link above.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RegistrationSuccess; 