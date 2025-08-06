import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { CheckCircle, Dna, Leaf, Zap } from "lucide-react";
import Header from "@/app/pages/landing/Header";
import Footer from "@/app/pages/landing/Footer";

const Templates = () => {
  const templates = [
    {
      title: "GLP-1 Support",
      icon: <Dna className="w-8 h-8" />,
      description: "Comprehensive support program for patients using GLP-1 medications",
      features: [
        "Medication adherence tracking",
        "Side effect management",
        "Nutrition optimization for GLP-1 users",
        "Progress monitoring and adjustments",
        "Educational resources and support"
      ],
      badge: "Popular"
    },
    {
      title: "Practice Naturals™",
      icon: <Leaf className="w-8 h-8" />,
      description: "Natural wellness approach focusing on whole food nutrition and lifestyle",
      features: [
        "Whole food nutrition protocols",
        "Natural supplement recommendations",
        "Lifestyle modification strategies",
        "Holistic health assessments",
        "Sustainable wellness plans"
      ],
      badge: "Holistic"
    },
    {
      title: "ChiroThin™",
      icon: <Zap className="w-8 h-8" />,
      description: "Specialized weight loss program designed for chiropractic practices",
      features: [
        "Structured weight loss protocols",
        "Chiropractic-specific guidelines",
        "Patient education materials",
        "Progress tracking tools",
        "Maintenance phase support"
      ],
      badge: "Specialized"
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
              Pre-Built Templates
            </h1>
            <p className="text-xl text-text-medical max-w-3xl mx-auto mb-8">
              We have pre-built templates for many popular programs and you can also quickly and easily create your own to fit your business model.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="cta" size="lg">
                Schedule Demo
              </Button>
              <Button variant="outline" size="lg">
                Create Custom Template
              </Button>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {templates.map((template, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      {template.icon}
                    </div>
                    <Badge variant="secondary">{template.badge}</Badge>
                  </div>
                  <CardTitle className="text-xl text-text-hero">
                    {template.title}
                  </CardTitle>
                  <CardDescription className="text-text-medical">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {template.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-text-medical">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6" variant="outline">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Custom Templates Section */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-text-hero mb-4">
              Create Your Own Template
            </h2>
            <p className="text-lg text-text-medical mb-8 max-w-2xl mx-auto">
              Don't see what you're looking for? Our intuitive template builder lets you create custom programs tailored to your specific practice needs and methodologies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="cta" size="lg">
                Start Building
              </Button>
              <Button variant="ghost" size="lg">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Templates;