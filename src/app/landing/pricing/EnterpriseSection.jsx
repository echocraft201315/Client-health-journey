"use client"

import { Button } from "@/app/components/ui/button";
import { Zap } from "lucide-react";

const EnterpriseSection = () => {
  return (
    <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 md:p-12 text-center mb-16">
      <div className="flex justify-center mb-6">
        <div className="p-4 rounded-lg bg-primary/10">
          <Zap className="w-10 h-10" />
        </div>
      </div>
      <h2 className="text-3xl font-bold text-text-hero mb-4">
        Enterprise Solutions
      </h2>
      <p className="text-lg text-text-medical mb-8 max-w-2xl mx-auto">
        Large organization? We offer custom enterprise solutions with advanced security, dedicated support, and tailored integrations.
      </p>
      <Button 
        variant="cta" 
        size="lg"
        onClick={() => window.open('https://go.clienthealthtracker.com/widget/booking/Fwe2aulhdV6W58wEhmQZ', '_blank')}
      >
        Contact Sales
      </Button>
    </div>
  );
};

export default EnterpriseSection;
