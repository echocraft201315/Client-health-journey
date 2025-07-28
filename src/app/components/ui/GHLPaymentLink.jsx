import { Button } from "./button";
import { ExternalLink, CreditCard } from "lucide-react";

const GHLPaymentLink = ({ paymentLink, planName, className = "" }) => {
  if (!paymentLink) {
    return null;
  }

  const handlePaymentClick = () => {
    window.open(paymentLink, '_blank');
  };

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        <CreditCard className="h-5 w-5 text-blue-600" />
        <h3 className="font-semibold text-blue-900">
          Complete Your {planName} Subscription
        </h3>
      </div>
      <p className="text-blue-700 text-sm mb-4">
        Click the button below to complete your payment and activate your subscription.
      </p>
      <Button 
        onClick={handlePaymentClick}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        Complete Payment
      </Button>
    </div>
  );
};

export default GHLPaymentLink; 