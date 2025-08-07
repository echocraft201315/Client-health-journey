import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Users, Crown } from "lucide-react";
import Header from "@/app/pages/landing/Header";
import Footer from "@/app/pages/landing/Footer";
import PricingCards from "./PricingCards";
import EnterpriseSection from "./EnterpriseSection";
const hipaaBoard = "/assets/hipaa-dashboard.jpg";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/20 dark:from-gray-950 dark:via-blue-950/30 dark:to-indigo-950/20">
      <Header />
      
      {/* Compact Header with Background Color */}
      <div className="bg-gradient-to-r from-emerald-600 to-cyan-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-display font-bold">Simple, Transparent Pricing</h1>
            <p className="text-lg text-emerald-100 mt-2">Choose the plan that fits your practice</p>
            <p className="text-emerald-200 text-sm mt-1">No setup fees • Cancel anytime • 14-day free trial</p>
          </div>
        </div>
      </div>
      
      <main className="py-8 bg-background1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Pricing Cards - Premium Design */}
          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto mb-20">
            <PricingCards plans={plans} />
          </div>

          {/* Enterprise Section */}
          <EnterpriseSection />

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