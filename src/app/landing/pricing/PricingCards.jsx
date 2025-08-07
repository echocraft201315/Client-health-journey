"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { CheckCircle, Users, Crown, Sparkles } from "lucide-react";

const PricingCards = ({ plans }) => {
  return (
    <>
      {plans.map((plan, index) => (
        <Card key={index} className={`premium-card relative group hover:shadow-elegant transition-all duration-500 ${plan.badge ? 'ring-2 ring-primary/50 scale-105 shadow-glow border-2 border-primary/30' : ''}`}>
          {plan.badge && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge variant="default" className="px-6 py-2 bg-gradient-to-r from-primary to-primary-glow text-white font-bold text-sm shadow-lg">
                <Crown className="w-3 h-3 mr-1" />
                {plan.badge}
              </Badge>
            </div>
          )}
          <CardHeader className="text-center pb-10 pt-12">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all">
                {plan.icon}
              </div>
            </div>
            <CardTitle className="text-3xl font-display font-bold text-text-hero mb-4">
              {plan.name}
            </CardTitle>
            <div className="flex items-baseline justify-center mb-4">
              <span className="text-6xl font-display font-bold text-text-hero">
                {plan.price}
              </span>
              <span className="text-xl text-text-medical ml-2">
                {plan.period}
              </span>
            </div>
            <CardDescription className="text-text-medical text-lg leading-relaxed max-w-sm mx-auto">
              {plan.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-10 pb-10">
            <ul className="space-y-5 mb-10">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start space-x-4">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center mt-1 flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-text-medical font-medium text-lg">{feature}</span>
                </li>
              ))}
            </ul>
            <Button 
              className={`w-full h-14 text-lg font-semibold transition-all ${
                plan.buttonVariant === 'cta' 
                  ? 'bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary shadow-lg hover:shadow-xl' 
                  : 'border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5'
              }`}
              variant={plan.buttonVariant}
              size="lg"
              onClick={() => window.open('https://go.clienthealthtracker.com/widget/booking/Fwe2aulhdV6W58wEhmQZ', '_blank')}
            >
              {plan.buttonVariant === 'cta' ? <Sparkles className="w-5 h-5 mr-2" /> : <Users className="w-5 h-5 mr-2" />}
              {plan.buttonText}
            </Button>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default PricingCards;
