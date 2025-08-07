import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { 
  Shield, 
  Brain, 
  FileText, 
  Utensils, 
  AlertTriangle, 
  Heart,
  BarChart3,
  Clock
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: "HIPAA Compliant Platform",
      description: "Bank-level security with full HIPAA compliance. Your patient data is protected with end-to-end encryption and secure cloud infrastructure.",
      image: "/assets/hipaa-dashboard.jpg",
      badge: "Security First"
    },
    {
      icon: Brain,
      title: "AI-Powered Food Analysis",
      description: "Advanced AI instantly analyzes patient food choices, providing detailed nutritional insights and automated coaching recommendations.",
      image: "/assets/ai-coaching-interface.jpg",
      badge: "AI Technology"
    },
    {
      icon: FileText,
      title: "Pre-Built Templates",
      description: "Ready-to-use weight loss and nutrition templates designed by medical professionals. Customize or create your own protocols.",
      badge: "Ready to Use"
    },
    {
      icon: Utensils,
      title: "Food Preference Tracking",
      description: "Comprehensive food preference analysis that adapts coaching to individual patient likes, dislikes, and cultural considerations.",
      badge: "Personalized"
    },
    {
      icon: AlertTriangle,
      title: "Allergy & Medical Condition Support",
      description: "Intelligent monitoring of food allergies and medical conditions with automatic alerts and personalized meal recommendations.",
      badge: "Safety"
    },
    {
      icon: Heart,
      title: "Automated Patient Coaching",
      description: "24/7 AI coaching that provides consistent, evidence-based guidance to your patients between appointments.",
      badge: "24/7 Support"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics Dashboard",
      description: "Comprehensive patient progress tracking with detailed analytics, success metrics, and outcome reporting.",
      badge: "Data Insights"
    },
    {
      icon: Clock,
      title: "Save Time & Scale Practice",
      description: "Reduce consultation time by 40% while improving patient outcomes. Scale your nutrition practice efficiently.",
      badge: "Efficiency"
    }
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <Badge className="bg-primary-light text-primary border-primary/20 mb-4">
            Platform Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-text-hero mb-6">
            Everything You Need for
                            <span className="block text-gradient-hero">
              Successful Patient Outcomes
            </span>
          </h2>
          <p className="text-xl text-text-medical">
            Comprehensive tools designed specifically for healthcare providers and wellness coaches
            to deliver exceptional nutrition and weight loss programs.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-elegant transition-all duration-300 border-border/50 hover:border-primary/20 bg-card/50 backdrop-blur-sm"
            >
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                                     <div className="w-12 h-12 bg-gradient-hero rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 ease-in-out">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="outline" className="bg-background/80">
                    {feature.badge}
                  </Badge>
                </div>
                <h3 className="text-xl font-semibold text-text-hero group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-text-medical leading-relaxed">
                  {feature.description}
                </p>
                {feature.image && (
                  <div className="relative overflow-hidden rounded-lg">
                                         <img 
                       src={feature.image} 
                       alt={feature.title}
                       className="w-full h-48 object-cover group-hover:scale-105 transition-all duration-300 ease-in-out"
                     />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-medical p-8 rounded-2xl border border-border/50">
            <h3 className="text-2xl font-bold text-text-hero mb-4">
              Ready to Transform Your Practice?
            </h3>
            <p className="text-text-medical mb-6">
              Be among the first healthcare providers to experience our revolutionary 
              AI-powered nutrition coaching platform and transform your practice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                   <button className="px-8 py-3 bg-gradient-hero text-white rounded-lg font-semibold hover:scale-105 transition-all duration-300 ease-in-out shadow-elegant hover:shadow-glow">
                Contact Sales
              </button>
              <button 
                className="px-8 py-3 bg-white border-2 border-primary1 text-primary1 rounded-lg font-semibold hover:bg-primary1 hover:text-white transition-colors shadow-card"
                onClick={() => window.open('https://go.clienthealthtracker.com/widget/booking/Fwe2aulhdV6W58wEhmQZ', '_blank')}
              >
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;