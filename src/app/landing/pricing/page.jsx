import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { CheckCircle, Users, Zap, Crown } from "lucide-react";
import Header from "@/app/pages/landing/Header";
import Footer from "@/app/pages/landing/Footer";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "$297",
      period: "/month",
      icon: <Users className="w-8 h-8" />,
      description: "Perfect for smaller practices getting started",
      features: [
        "Up to 20 clients or patients",
        "Standard AI food analysis",
        "30 Micronutrients tracked, not just Macros",
        "Basic nutrition coaching tools",
        "Email support",
        "Mobile app access",
        "Basic reporting"
      ],
      badge: null,
      buttonText: "Schedule Demo",
      buttonVariant: "outline"
    },
    {
      name: "Professional",
      price: "$697",
      period: "/month",
      icon: <Crown className="w-8 h-8" />,
      description: "Advanced features for growing practices",
      features: [
        "Unlimited clients or patients",
        "Unlimited coaches within your organization",
        "Advanced AI-driven nutrition coaching and analysis",
        "30 Micronutrients tracked, not just Macros",
        "Priority support",
        "Advanced reporting and analytics",
        "Let us do the heavy lifting for you!"
      ],
      badge: "Most Popular",
      buttonText: "Schedule Demo",
      buttonVariant: "cta"
    }
  ];

  const faqs = [
    {
      question: "Can I upgrade or downgrade my plan at any time?",
      answer: "Yes, you can change your plan at any time. Changes take effect immediately, and we'll prorate any billing adjustments."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes, we offer a 14-day free trial for all plans so you can explore all features before committing."
    },
    {
      question: "What kind of support do you provide?",
      answer: "We provide email support for Starter plans and priority support for Professional plans, including phone and chat support."
    },
    {
      question: "Can I add more coaches to my organization?",
      answer: "With the Professional plan, you can add unlimited coaches within your organization at no additional cost."
    }
  ];

  return (

    <div className="min-h-screen">
      <Header />
      
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-text-hero mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-text-medical max-w-3xl mx-auto mb-8">
              Choose the plan that fits your practice. Scale as you grow with unlimited access to our advanced AI-powered nutrition coaching platform.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative group hover:shadow-xl transition-all duration-300 ${plan.badge ? 'ring-2 ring-primary scale-105' : ''}`}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge variant="default" className="px-4 py-1">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      {plan.icon}
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-text-hero mb-2">
                    {plan.name}
                  </CardTitle>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-text-hero">
                      {plan.price}
                    </span>
                    <span className="text-text-medical ml-1">
                      {plan.period}
                    </span>
                  </div>
                  <CardDescription className="text-text-medical mt-4">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-text-medical">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={plan.buttonVariant}
                    size="lg"
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Enterprise Section */}
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
            <Button variant="cta" size="lg">
              Contact Sales
            </Button>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-text-hero text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg text-text-hero">
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-text-medical">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;