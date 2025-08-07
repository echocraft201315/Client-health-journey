import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Star, Quote, Users, Activity, Target, Brain } from "lucide-react";

const doctorImage = "/assets/testimonial-doctor.jpg";
const coachImage = "/assets/wellness-coach.jpg";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Dr. Sarah Martinez",
      role: "Family Medicine Physician",
      practice: "Pacific Health Center",
      image: doctorImage,
      rating: 5,
      quote: "Client Health Tracker has revolutionized how I approach nutrition counseling. The AI-powered insights save me hours each week, and my patients are seeing remarkable results. The HIPAA compliance gives me complete peace of mind.",
      results: "40% reduction in consultation time"
    },
    {
      name: "Michael Chen",
      role: "Certified Wellness Coach",
      practice: "Optimal Living Wellness",
      image: coachImage,
      rating: 5,
      quote: "The pre-built templates are incredible - it's like having a team of nutrition experts at my fingertips. My clients love the 24/7 AI coaching, and I've been able to scale my practice to help 3x more people.",
      results: "300% increase in client capacity"
    },
    {
      name: "Dr. Jennifer Wong",
      role: "Endocrinologist",
      practice: "Metro Diabetes Center",
      image: doctorImage,
      rating: 5,
      quote: "The food allergy and medical condition tracking is phenomenal. It automatically flags potential issues and provides safe meal recommendations. This level of personalization was impossible before.",
      results: "95% patient satisfaction rate"
    },
    {
      name: "Lisa Thompson",
      role: "Registered Dietitian",
      practice: "Nutrition First Clinic",
      image: coachImage,
      rating: 5,
      quote: "The analytics dashboard provides insights I never had before. I can track patient progress in real-time and adjust protocols immediately. My success rates have improved dramatically.",
      results: "85% patient goal achievement"
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gradient-medical">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <Badge className="bg-secondary-light text-secondary border-secondary/20 mb-4">
            Success Stories
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-text-hero mb-6">
            Trusted by Healthcare
                            <span className="block text-gradient-hero">
              Professionals Worldwide
            </span>
          </h2>
          <p className="text-xl text-text-medical">
            See how Client Health Tracker is transforming practices and improving patient outcomes
            across the healthcare industry.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="group hover:shadow-elegant transition-all duration-300 border-border/50 hover:border-primary/20 bg-card/80 backdrop-blur-sm"
            >
              <CardContent className="p-8">
                {/* Quote Icon */}
                <div className="flex justify-between items-start mb-6">
                  <Quote className="w-8 h-8 text-primary/30" />
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent1 text-accent" />
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <blockquote className="text-text-medical leading-relaxed mb-6 text-lg">
                  "{testimonial.quote}"
                </blockquote>

                {/* Results Badge */}
                <Badge className="bg-accent-light text-accent1 border-accent/20 mb-6">
                  {testimonial.results}
                </Badge>

                {/* Author Info */}
                <div className="flex items-center space-x-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover shadow-card"
                  />
                  <div>
                    <div className="font-semibold text-text-hero">{testimonial.name}</div>
                    <div className="text-text-medical">{testimonial.role}</div>
                    <div className="text-primary text-sm font-medium">{testimonial.practice}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <Users className="w-12 h-12 text-primary mb-3 mx-auto" />
              <div className="text-text-medical">Unlimited Clients & Patients</div>
            </div>
            <div>
              <Activity className="w-12 h-12 text-secondary mb-3 mx-auto" />
              <div className="text-text-medical">Fresh Platform</div>
            </div>
            <div>
              <Target className="w-12 h-12 text-accent mb-3 mx-auto" />
              <div className="text-text-medical">Ready to Scale</div>
            </div>
            <div>
              <Brain className="w-12 h-12 text-primary mb-3 mx-auto" />
              <div className="text-text-medical">AI-Powered</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-text-hero mb-4">
            Join the Growing Community of Successful Providers
          </h3>
          <p className="text-text-medical mb-8 max-w-2xl mx-auto">
            Be among the first to experience our revolutionary AI-powered nutrition coaching platform.
            Schedule a demo to see how we're transforming healthcare nutrition practices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="px-8 py-4 bg-gradient-accent text-white rounded-lg font-semibold hover:scale-105 transition-all duration-300 ease-in-out shadow-glow animate-glow">
              Contact Sales Team
            </button>
            <button 
              className="px-8 py-4 bg-white border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors shadow-card"
              onClick={() => window.open('https://go.clienthealthtracker.com/widget/booking/Fwe2aulhdV6W58wEhmQZ', '_blank')}
            >
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;